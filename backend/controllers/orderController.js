const db = require('../config/db');
const crypto = require('crypto');

// @desc    Create new order
// @route   POST /api/orders
// @access  Public
const createOrder = async (req, res) => {
  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');

    const {
      customer_name,
      customer_phone,
      customer_city,
      items, // [{ product_color_id, quantity, price, size, name }]
      total_amount,
    } = req.body;

    const validationToken = crypto.randomBytes(20).toString('hex');

    const insertOrderText = `
      INSERT INTO orders (customer_name, customer_phone, customer_city, total_amount, validation_token)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, validation_token
    `;
    const { rows: orderRows } = await client.query(insertOrderText, [
      customer_name,
      customer_phone,
      customer_city,
      total_amount,
      validationToken, // Token for the link
    ]);
    const orderId = orderRows[0].id;
    const token = orderRows[0].validation_token;

    for (const item of items) {
      const insertItemText = `
        INSERT INTO order_items (order_id, product_color_id, quantity, price_at_purchase, size_selected, product_name)
        VALUES ($1, $2, $3, $4, $5, $6)
      `;
      // Note: we store product_name for history in case product is deleted/changed, though not strictly normalized
      await client.query(insertItemText, [
        orderId,
        item.product_color_id,
        item.quantity,
        item.price,
        item.size,
        item.name
      ]);
    }

    await client.query('COMMIT');

    // Return the validation link to the frontend so it can be added to the WhatsApp message
    // The link should point to the ADMIN Interface or a special validation page
    // Plan says: "https://fama-store.com/admin/validate-order/[TOKEN]"
    // We'll trust the frontend to construct the full URL or send it from here.
    // Let's send the token and a constructed relative path.
    const validationLink = `/admin/validate-order/${token}`;

    res.status(201).json({ 
        message: 'Order created', 
        orderId, 
        token,
        validationLink 
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  } finally {
    client.release();
  }
};

// @desc    Validate order via token (WhatsApp Link)
// @route   POST /api/admin/orders/validate/:token
// @access  Private/Admin (Or Public if the link is enough security? Plan says "Admin API", implying protection. 
//          However, clicking a link in WhatsApp on mobile might not have Admin session logged in.
//          Option 1: Link leads to login, then validates.
//          Option 2: Link contains a "magic" token that validates immediately.
//          The Plan says: "Cliquer sur ce lien (via WhatsApp) connectera l'admin au dashboard, validera la commande".
//          So Frontend handles the link -> checks token -> if not logged in, asks login -> creates session -> calls API.
//          So this endpoint should be PROTECTED.)
const validateOrder = async (req, res) => {
    const { token } = req.params;
    const client = await db.pool.connect();

    try {
        await client.query('BEGIN');

        // Check Order
        const checkOrderQuery = `SELECT * FROM orders WHERE validation_token = $1`;
        const { rows: orderRows } = await client.query(checkOrderQuery, [token]);

        if (orderRows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ message: 'Order not found' });
        }

        const order = orderRows[0];

        if (order.status === 'validated') {
            await client.query('ROLLBACK');
            return res.status(400).json({ message: 'Order already validated' });
        }
        
        if (order.status === 'cancelled') {
             await client.query('ROLLBACK');
            return res.status(400).json({ message: 'Order was cancelled' });
        }

        // Update Order Status
        await client.query(`UPDATE orders SET status = 'validated' WHERE id = $1`, [order.id]);

        // Deduct Stock
        const itemsQuery = `SELECT * FROM order_items WHERE order_id = $1`;
        const { rows: items } = await client.query(itemsQuery, [order.id]);

        for (const item of items) {
             // Check if stock is sufficient (optional, maybe allow negative/force?)
             // Simple decrement for now.
             await client.query(`
                UPDATE product_colors 
                SET stock_quantity = stock_quantity - $1 
                WHERE id = $2
             `, [item.quantity, item.product_color_id]);
        }

        await client.query('COMMIT');
        res.json({ message: 'Order validated and stock updated' });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    } finally {
        client.release();
    }

};

// @desc    Update order status manually
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body; // 'validated', 'cancelled', 'pending'
    const client = await db.pool.connect();

    try {
        await client.query('BEGIN');

        // Check Order
        const checkOrderQuery = `SELECT * FROM orders WHERE id = $1`;
        const { rows: orderRows } = await client.query(checkOrderQuery, [id]);

        if (orderRows.length === 0) {
             await client.query('ROLLBACK');
            return res.status(404).json({ message: 'Order not found' });
        }

        const order = orderRows[0];
        const oldStatus = order.status;

        if (oldStatus === status) {
             await client.query('ROLLBACK');
             return res.json({ message: 'Status unchanged' });
        }

        // Logic for Stock
        const itemsQuery = `SELECT * FROM order_items WHERE order_id = $1`;
        const { rows: items } = await client.query(itemsQuery, [id]);

        // 1. If moving TO validated (from pending/cancelled) -> Deduct Stock
        if (status === 'validated' && oldStatus !== 'validated') {
             for (const item of items) {
                 await client.query(`
                    UPDATE product_colors 
                    SET stock_quantity = stock_quantity - $1 
                    WHERE id = $2
                 `, [item.quantity, item.product_color_id]);
             }
        }

        // 2. If moving FROM validated (to pending/cancelled) -> Restore Stock
        if (oldStatus === 'validated' && status !== 'validated') {
            for (const item of items) {
                 await client.query(`
                    UPDATE product_colors 
                    SET stock_quantity = stock_quantity + $1 
                    WHERE id = $2
                 `, [item.quantity, item.product_color_id]);
             }
        }
        
        // Update Status
        await client.query(`UPDATE orders SET status = $1 WHERE id = $2`, [status, id]);

        await client.query('COMMIT');
        res.json({ message: `Order status updated to ${status}` });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    } finally {
        client.release();
    }
};

// @desc    Get all orders
// @route   GET /api/admin/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
    try {
        const { rows } = await db.query('SELECT * FROM orders ORDER BY created_at DESC');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { createOrder, validateOrder, getOrders, updateOrderStatus };

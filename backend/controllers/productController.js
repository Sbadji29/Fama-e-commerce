const db = require('../config/db');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const productsQuery = `
      SELECT p.*, c.name as category_name 
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.active = TRUE
      ORDER BY p.created_at DESC
    `;
    const { rows: products } = await db.query(productsQuery);

    // Populate colors and photos for each product
    // This is N+1, but efficiently handled with Promise.all for small datasets. 
    // For larger, a single complex query with json_agg is better.
    // Let's use a single complex query approach for performance.
    
    const query = `
      SELECT 
        p.id, p.name, p.description, p.price, p.category_id,
        c.name as category_name,
        (
          SELECT json_agg(json_build_object(
            'id', pc.id,
            'name', pc.color_name,
            'hex', pc.hex_code,
            'available', pc.available,
            'stock', pc.stock_quantity,
            'images', (
              SELECT json_agg(pp.image_url ORDER BY pp.display_order)
              FROM product_photos pp
              WHERE pp.product_color_id = pc.id
            )
          ))
          FROM product_colors pc
          WHERE pc.product_id = p.id
        ) as colors
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.active = TRUE
      ORDER BY p.created_at DESC
    `;

    const { rows } = await db.query(query);
    
    // Transform null colors/images to empty keys if needed to match frontend expectation
    const formatted = rows.map(p => ({
        ...p,
        colors: p.colors || [],
        // Frontend expects top-level 'image' (main image)
        image: p.colors?.[0]?.images?.[0] || null,
        category: p.category_name
    }));

    res.json(formatted);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res) => {
    try {
        const { rows } = await db.query('SELECT * FROM categories ORDER BY name');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create a product
// @route   POST /api/admin/products
// @access  Private/Admin
const createProduct = async (req, res) => {
    const client = await db.pool.connect();
    try {
        await client.query('BEGIN');
        
        const { name, description, price, category_id, colors } = req.body;
        // colors is expected to be a JSON string if sent via FormData, or array if JSON
        // If handled by frontend as JSON body, it's an array.
        // Assuming JSON body for complex structure, but file upload needs formData.
        // Strategy: Frontend uploads images first to get URLs, then sends JSON product create.
        // OR: Frontend sends formData with indexed files.
        // Simplest for now: Assume frontend sends JSON with Image URLs (uploaded separately).
        
        // Let's stick to the Plan: "POST /api/admin/products : Creation de produit (incluant couleurs et upload d'images)".
        // Implementing "Upload First, then Create" is easier.
        // Or "FormData with JSON string for data and files".
        
        // Let's assume the body contains the parsed JSON structure.
        
        const insertProductText = `
            INSERT INTO products (name, description, price, category_id)
            VALUES ($1, $2, $3, $4)
            RETURNING id
        `;
        const { rows: productRows } = await client.query(insertProductText, [name, description, price, category_id]);
        const productId = productRows[0].id;

        if (colors && Array.isArray(colors)) {
            for (const color of colors) {
                const insertColorText = `
                    INSERT INTO product_colors (product_id, color_name, hex_code, stock_quantity)
                    VALUES ($1, $2, $3, $4)
                    RETURNING id
                `;
                const { rows: colorRows } = await client.query(insertColorText, [productId, color.name, color.hex, color.stock_quantity]);
                const colorId = colorRows[0].id;

                if (color.images && Array.isArray(color.images)) {
                    for (let i = 0; i < color.images.length; i++) {
                        const imageUrl = color.images[i];
                        await client.query(
                            'INSERT INTO product_photos (product_color_id, image_url, display_order) VALUES ($1, $2, $3)',
                            [colorId, imageUrl, i]
                        );
                    }
                }
            }
        }

        await client.query('COMMIT');
        res.status(201).json({ message: 'Product created', id: productId });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    } finally {
        client.release();
    }
};

// @desc    Upload image
// @route   POST /api/upload
// @access  Private/Admin
const uploadImage = (req, res) => {
    if(!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    const url = `${process.env.FRONTEND_URL || 'http://localhost:5000'}/uploads/${req.file.filename}`;
    res.json({ url });
};

const deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM products WHERE id = $1', [id]);
        res.json({ message: 'Product removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, description, price, category_id, active } = req.body;
    try {
        const query = `
            UPDATE products 
            SET name = COALESCE($1, name), 
                description = COALESCE($2, description), 
                price = COALESCE($3, price), 
                category_id = COALESCE($4, category_id),
                active = COALESCE($5, active)
            WHERE id = $6
            RETURNING *
        `;
        const { rows } = await db.query(query, [name, description, price, category_id, active, id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { getProducts, getCategories, createProduct, uploadImage, deleteProduct, updateProduct };

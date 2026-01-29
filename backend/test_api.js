// Node 22 has global fetch. No require needed.
// Node 22 has global fetch.

const BASE_URL = 'http://localhost:5000/api';

async function runTests() {
  console.log('🚀 Starting Backend Tests...\n');

  let token = '';
  let productId = 0;
  let orderToken = '';

  // 1. Test Login
  try {
    console.log('1️⃣  Testing Login...');
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'admin123' })
    });
    
    if (!loginRes.ok) throw new Error(`Login failed: ${loginRes.statusText}`);
    const loginData = await loginRes.json();
    token = loginData.token;
    console.log('✅ Login Successful. Token received.\n');
  } catch (err) {
    console.error('❌ Login Test Failed:', err.message);
    process.exit(1);
  }

  // 2. Test Get Products
  try {
    console.log('2️⃣  Testing Get Products...');
    const res = await fetch(`${BASE_URL}/products`);
    const data = await res.json();
    console.log(`✅ Get Products Successful. Found ${data.length} products.\n`);
  } catch (err) {
    console.error('❌ Get Products Failed:', err.message);
  }

  // 3. Test Create Product (Admin)
  try {
    console.log('3️⃣  Testing Create Product...');
    const productData = {
      name: "Test Product " + Date.now(),
      description: "Automated test product",
      price: 5000,
      category_id: 1, // Assuming ID 1 exists (Vêtements)
      colors: [
        { name: "Rouge", hex: "#FF0000", stock_quantity: 10, images: [] }
      ]
    };

    const res = await fetch(`${BASE_URL}/products`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(productData)
    });

    if (!res.ok) {
        const err = await res.json();
        throw new Error(`Create Product failed: ${JSON.stringify(err)}`);
    }
    const data = await res.json();
    productId = data.id;
    console.log(`✅ Create Product Successful. ID: ${productId}\n`);
  } catch (err) {
    console.error('❌ Create Product Failed:', err.message);
  }

  // 4. Test Create Order
  try {
    console.log('4️⃣  Testing Create Order...');
    const orderData = {
      customer_name: "Test Customer",
      customer_phone: "770000000",
      customer_city: "Dakar",
      total_amount: 5000,
      items: [
        // We need a product color id. Since we just created a product, we don't easily have the color ID unless we fetch the product back.
        // Let's assume we use the first available product from the list if we can't get it easily.
        // Or simplified: Just skip detailed validation of item color if DB doesn't enforce FK strictly or if we can guess.
        // Actually, schema enforces FK.
        // So we must fetch the product details to get a valid product_color_id.
      ]
    };

    // Fetch the product we just created or list products to get a valid color ID
    const prodRes = await fetch(`${BASE_URL}/products`);
    const products = await prodRes.json();
    const product = products.find(p => p.id === productId) || products[0];
    
    if (product && product.colors && product.colors.length > 0) {
        const colorId = product.colors[0].id;
        orderData.items.push({
            product_color_id: colorId,
            quantity: 1,
            price: 5000,
            size: "L",
            name: product.name
        });

        const res = await fetch(`${BASE_URL}/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });

        if (!res.ok) throw new Error(`Create Order failed: ${res.statusText}`);
        const data = await res.json();
        orderToken = data.token;
        console.log(`✅ Create Order Successful. Token: ${orderToken}\n`);
    } else {
        console.log('⚠️  Skipping Order Test: No products with colors found.\n');
    }

  } catch (err) {
    console.error('❌ Create Order Failed:', err.message);
  }

  // 5. Test Validate Order
  if (orderToken) {
      try {
        console.log('5️⃣  Testing Validate Order (Admin)...');
        const res = await fetch(`${BASE_URL}/orders/validate/${orderToken}`, {
            method: 'POST',
            headers: { 
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!res.ok) {
             const err = await res.json();
             throw new Error(`Validate failed: ${err.message}`);
        }
        console.log('✅ Validate Order Successful.\n');
      } catch (err) {
        console.error('❌ Validate Order Failed:', err.message);
      }
  }

  console.log('🏁 Tests Completed.');
}

runTests();

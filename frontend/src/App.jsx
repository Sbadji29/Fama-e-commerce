import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import StoreFront from './pages/StoreFront';
import Login from './pages/Login';
import About from './pages/About';
import Collection from './pages/Collection';
import AdminLayout from './components/admin/AdminLayout';
import ProtectedRoute from './components/admin/ProtectedRoute';
import Dashboard from './pages/admin/Dashboard';
import Products from './pages/admin/Products';
import Categories from './pages/admin/Categories';
import Orders from './pages/admin/Orders';
import ValidateOrder from './pages/admin/ValidateOrder';
import { CartProvider } from './context/CartContext';
import { ProductProvider } from './context/ProductContext';
import { CategoryProvider } from './context/CategoryContext';
import { AuthProvider } from './context/AuthContext';
import { OrderProvider } from './context/OrderContext';


function App() {
  return (
    <AuthProvider>
      <ProductProvider>
        <CategoryProvider>
          <CartProvider>
            <OrderProvider>
              <BrowserRouter>
                <Routes>
                  {/* Customer Routes */}
                  <Route path="/" element={<StoreFront />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/collection" element={<Collection />} />
                  <Route path="/login" element={<Login />} />
                  
                  {/* Admin Routes (Protected) */}
                  <Route element={<ProtectedRoute />}>
                    <Route path="/admin" element={<AdminLayout />}>
                      <Route index element={<Dashboard />} />
                      <Route path="products" element={<Products />} />
                      <Route path="categories" element={<Categories />} />
                      <Route path="orders" element={<Orders />} />
                      <Route path="validate-order/:token" element={<ValidateOrder />} />
                    </Route>
                  </Route>
                </Routes>
              </BrowserRouter>
            </OrderProvider>
          </CartProvider>
        </CategoryProvider>
      </ProductProvider>
    </AuthProvider>
  );
}

export default App;

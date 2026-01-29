import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load cart from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('fama-cart');
      if (saved) {
        setCartItems(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Failed to load cart from localStorage', error);
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('fama-cart', JSON.stringify(cartItems));
    } catch (error) {
      console.error('Failed to save cart to localStorage', error);
    }
  }, [cartItems]);

  const addToCart = (product, size = null, color = null) => {
    setCartItems(prev => {
      // Find if item already exists with same ID, Size and Color
      const existingItemIndex = prev.findIndex(
        item => item.id === product.id && item.size === size && item.color?.name === color?.name
      );

      if (existingItemIndex > -1) {
        // Increment quantity
        const updated = [...prev];
        updated[existingItemIndex].quantity += 1;
        return updated;
      } else {
        // Add new item
        return [...prev, { ...product, size, color, quantity: 1 }];
      }
    });
    setIsCartOpen(true); // Open cart when adding item
  };

  const removeFromCart = (productId, size, colorName) => {
    setCartItems(prev => 
      prev.filter(item => !(item.id === productId && item.size === size && item.color?.name === colorName))
    );
  };

  const updateQuantity = (productId, size, colorName, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId, size, colorName);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.id === productId && item.size === size && item.color?.name === colorName
          ? { ...item, quantity } 
          : item
      )
    );
  };

  const clearCart = () => setCartItems([]);

  const getTotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const getItemCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const toggleCart = () => setIsCartOpen(prev => !prev);

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotal,
      getItemCount,
      isCartOpen,
      setIsCartOpen,
      toggleCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;

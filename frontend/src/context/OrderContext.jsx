import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_URL } from '../utils/api';

const OrderContext = createContext();

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within OrderProvider');
  }
  return context;
};

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    try {
        const token = localStorage.getItem('fama-token');
        if (!token) return; // Wait for auth or maybe just return empty if not public
        
        const response = await fetch(`${API_URL}/orders`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) throw new Error('Failed to fetch orders');
        const data = await response.json();
        setOrders(data);
        setError(null);
    } catch (err) {
        console.error("API Error", err);
        setError(err.message);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <OrderContext.Provider value={{ orders, loading, error, refreshOrders: fetchOrders }}>
      {children}
    </OrderContext.Provider>
  );
};

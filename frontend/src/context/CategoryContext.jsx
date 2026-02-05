import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_URL } from '../utils/api';

const CategoryContext = createContext();

export const useCategories = () => {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error('useCategories must be used within CategoryProvider');
  }
  return context;
};

export const CategoryProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/products/categories`);
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      } else {
        console.error('Failed to fetch categories');
        // Fallback or empty
        setCategories([]);
      }
    } catch (err) {
      console.error(err);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const addCategory = async (categoryName) => {
    try {
        const token = localStorage.getItem('fama-token');
        const response = await fetch(`${API_URL}/products/categories`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ name: categoryName })
        });
        
        if (!response.ok) throw new Error('Failed to add category');
        
        const data = await response.json();
        setCategories(prev => [...prev, data]);
        return true;
    } catch (err) {
        console.error("Add Category Error", err);
        return false;
    }
  };

  const deleteCategory = async (id) => {
    try {
        const token = localStorage.getItem('fama-token');
        const response = await fetch(`${API_URL}/products/categories/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) throw new Error('Failed to delete category');
        
        setCategories(prev => prev.filter(cat => cat.id !== id));
        return true;
    } catch (err) {
        console.error("Delete Category Error", err);
        return false;
    }
  };

  return (
    <CategoryContext.Provider value={{ categories, loading, fetchCategories, addCategory, deleteCategory }}>
      {children}
    </CategoryContext.Provider>
  );
};

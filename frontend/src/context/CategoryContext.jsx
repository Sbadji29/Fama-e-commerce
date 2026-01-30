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
    // Ideally backend should handle creation, but sticking to read-only for now unless user asks
    // or if we need to implement category creation endpoints. 
    // For now, let's just mock it or assume read-only since admin page implies management.
    // Given the task is about Product management, I will focus on fetching.
  };

  const deleteCategory = (id) => {
     // Placeholder
  };

  return (
    <CategoryContext.Provider value={{ categories, loading, fetchCategories }}>
      {children}
    </CategoryContext.Provider>
  );
};

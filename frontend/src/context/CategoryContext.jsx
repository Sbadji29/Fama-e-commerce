import React, { createContext, useContext, useState, useEffect } from 'react';

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
  const defaultCategories = ['Vêtements', 'Accessoires', 'Chaussures', 'Promos'];

  // Load from localStorage or use defaults
  useEffect(() => {
    const savedCategories = localStorage.getItem('fama-categories');
    if (savedCategories) {
      setCategories(JSON.parse(savedCategories));
    } else {
      setCategories(defaultCategories);
      localStorage.setItem('fama-categories', JSON.stringify(defaultCategories));
    }
  }, []);

  // Save to persistence
  useEffect(() => {
    if (categories.length > 0) {
      localStorage.setItem('fama-categories', JSON.stringify(categories));
    }
  }, [categories]);

  const addCategory = (category) => {
    if (!categories.includes(category)) {
      setCategories(prev => [...prev, category]);
    }
  };

  const deleteCategory = (category) => {
    setCategories(prev => prev.filter(c => c !== category));
  };

  return (
    <CategoryContext.Provider value={{ categories, addCategory, deleteCategory }}>
      {children}
    </CategoryContext.Provider>
  );
};

import React from 'react';

const CategoryFilter = ({ categories, activeCategory, onSelectCategory }) => {
  return (
    <div className="flex flex-wrap gap-3 sm:gap-4 justify-center py-8">
      {categories.map((category) => {
        const isString = typeof category === 'string';
        const value = isString ? category : category.name;
        const key = isString ? category : category.id;
        const isActive = activeCategory === value;
        
        return (
          <button
            key={key}
            onClick={() => onSelectCategory(value)}
            className={`fun-category-pill ${
              isActive
                ? 'bg-gradient-to-r from-primary-600 to-primary-500 border-transparent text-white shadow-lg shadow-primary-500/40 scale-105'
                : 'bg-white border-slate-100 text-slate-500 hover:border-primary-200 hover:text-primary-600'
            }`}
          >
            {value}
          </button>
        );
      })}
    </div>
  );
};

export default CategoryFilter;

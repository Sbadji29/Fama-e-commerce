import React from 'react';

const CategoryFilter = ({ categories, activeCategory, onSelectCategory }) => {
  return (
    <div className="flex flex-wrap gap-4 justify-center py-6">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onSelectCategory(category)}
          className={`px-6 py-2 rounded-full font-medium transition-all duration-300 transform hover:scale-105 ${
            activeCategory === category
              ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-lg shadow-primary-500/30'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;

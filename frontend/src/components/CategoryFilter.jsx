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
            className={`px-5 py-2 rounded text-sm font-bold uppercase transition-all duration-200 border ${
              isActive
                ? 'bg-slate-900 border-slate-900 text-white shadow-md'
                : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 shadow-sm'
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

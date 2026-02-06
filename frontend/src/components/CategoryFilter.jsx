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
            className={`px-6 py-2.5 rounded-full font-bold transition-all duration-500 transform hover:scale-105 relative overflow-hidden group ${
              isActive
                ? 'bg-white text-primary-600 shadow-xl shadow-primary-500/20 ring-2 ring-primary-500/50'
                : 'bg-white/40 backdrop-blur-md text-slate-600 hover:bg-white/60 border border-white/50'
            }`}
          >
            {isActive && (
              <span className="absolute inset-0 bg-gradient-to-r from-primary-50 w-full h-full animate-pulse-soft pointer-events-none opacity-50"></span>
            )}
            <span className="relative z-10">{value}</span>
          </button>
        );
      })}
    </div>
  );
};

export default CategoryFilter;

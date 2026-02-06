import React from 'react';

const ScrollingBanner = ({ products }) => {
  // Duplicate products to create a seamless loop
  const displayProducts = [...products, ...products, ...products];

  return (
    <div className="relative overflow-hidden py-10 rotate-1">
      <div className="absolute inset-0 bg-primary-500/5 -skew-y-1"></div>
      
      <div className="flex animate-marquee hover:pause whitespace-nowrap gap-6 sm:gap-10">
        {displayProducts.map((product, index) => (
          <div 
            key={`${product.id}-${index}`}
            className="inline-flex flex-col items-center group cursor-pointer"
          >
            <div className="w-32 h-32 sm:w-48 sm:h-48 rounded-2xl overflow-hidden border-4 border-white shadow-xl transform transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3">
              <img 
                src={product.image || (product.colors?.[0]?.images?.[0])} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="mt-4 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-widest">
                {product.name}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScrollingBanner;

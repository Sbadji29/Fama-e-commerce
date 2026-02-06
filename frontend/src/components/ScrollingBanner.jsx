import React from 'react';

const ScrollingBanner = ({ products }) => {
  // Duplicate products to create a seamless loop
  const displayProducts = [...products, ...products, ...products];

  return (
    <div className="relative overflow-hidden py-16">
      <div className="flex animate-marquee hover:pause whitespace-nowrap gap-8 sm:gap-12">
        {displayProducts.map((product, index) => (
          <div 
            key={`${product.id}-${index}`}
            className="inline-flex flex-col items-center group cursor-pointer"
          >
            <div className="relative w-40 h-40 sm:w-60 sm:h-60 rounded-sm overflow-hidden shadow-2xl transition-all duration-1000 ease-out group-hover:shadow-primary-500/20">
              <img 
                src={product.image || (product.colors?.[0]?.images?.[0])} 
                alt={product.name} 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 border border-white/20 group-hover:border-primary-400 transition-colors duration-700"></div>
            </div>
            <div className="mt-6 text-center">
              <h4 className="font-serif italic text-lg sm:text-xl text-slate-800 opacity-60 group-hover:opacity-100 transition-opacity duration-500">
                {product.name}
              </h4>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScrollingBanner;

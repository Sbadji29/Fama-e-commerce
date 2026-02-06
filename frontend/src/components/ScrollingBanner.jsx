import React from 'react';
import { formatPrice } from '../utils/formatters';

const ScrollingBanner = ({ products }) => {
  // Duplicate products to create a seamless loop
  const displayProducts = [...products, ...products, ...products];

  return (
    <div className="relative overflow-hidden py-10">
      <div className="flex animate-marquee hover:pause whitespace-nowrap gap-6">
        {displayProducts.map((product, index) => (
          <div 
            key={`${product.id}-${index}`}
            className="inline-flex flex-col items-center group cursor-pointer"
          >
            <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-lg overflow-hidden border border-slate-100 shadow-sm transition-all duration-300 group-hover:shadow-md">
              <img 
                src={product.image || (product.colors?.[0]?.images?.[0])} 
                alt={product.name} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="mt-4 text-center">
              <h4 className="font-bold text-slate-800 text-sm">
                {product.name}
              </h4>
              <p className="text-primary-600 font-black text-sm">
                {formatPrice(product.price)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScrollingBanner;

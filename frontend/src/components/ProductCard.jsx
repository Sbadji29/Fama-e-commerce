import React from 'react';
import { ShoppingBag, Eye, Play } from 'lucide-react';
import { formatPrice } from '../utils/formatters';

const ProductCard = ({ product, onAddToCart, onViewDetails }) => {
  const colors = product.colors || [];
  const firstAvailableColor = colors.find(c => c.available) || colors[0];

  const displayImage = firstAvailableColor?.images?.[0] || product.image;
  const hasVideo = colors.some(c => c.video);

  return (
    <div className="standard-card overflow-hidden group">
      <div className="relative h-64 sm:h-72 overflow-hidden bg-slate-100">
        <img
          src={displayImage}
          alt={product.name}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded text-[10px] font-bold text-slate-800 uppercase">
          {product.category}
        </div>
        {hasVideo && (
           <div className="absolute top-2 left-2 bg-black/60 p-1.5 rounded-full text-white">
              <Play size={10} fill="white" />
           </div>
        )}
      </div>
      
      <div className="p-4 flex flex-col h-full">
        <h3 className="font-bold text-slate-800 text-sm sm:text-base mb-1 truncate">
          {product.name}
        </h3>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg font-black text-slate-900">
            {formatPrice(product.price)}
          </span>
        </div>

        <button
          onClick={() => onAddToCart(product, product.sizes?.[0], firstAvailableColor)}
          className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-2.5 rounded text-xs uppercase tracking-wider transition-colors mt-auto"
        >
          Ajouter au panier
        </button>
      </div>
    </div>
  );
};

export default ProductCard;

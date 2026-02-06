import React from 'react';
import { ShoppingBag, Eye, Play } from 'lucide-react';
import { formatPrice } from '../utils/formatters';

const ProductCard = ({ product, onAddToCart, onViewDetails }) => {
  const colors = product.colors || [];
  const firstAvailableColor = colors.find(c => c.available) || colors[0];

  const displayImage = firstAvailableColor?.images?.[0] || product.image;
  const hasVideo = colors.some(c => c.video);

  return (
    <div className="glass-morph-luxury luxury-border rounded-2xl overflow-hidden group transition-all duration-700 hover:-translate-y-2">
      <div className="relative h-56 sm:h-72 overflow-hidden">
        <img
          src={displayImage}
          alt={product.name}
          className="w-full h-full object-cover transform group-hover:scale-110 group-hover:rotate-1 transition-transform duration-1000 ease-out"
        />
        <div className="absolute inset-0 bg-black/5 flex items-center justify-center gap-2 sm:gap-4 lg:opacity-0 lg:group-hover:opacity-100 lg:group-hover:bg-black/20 transition-all duration-300">
          <button
            onClick={() => onViewDetails(product)}
            className="p-2.5 sm:p-3 bg-white text-slate-900 rounded-full hover:scale-110 active:scale-95 transition-all duration-300 shadow-xl border border-slate-100"
            title="Voir détails"
          >
            <Eye size={18} className="sm:w-5 sm:h-5" />
          </button>
          <button
            onClick={() => onAddToCart(product, product.sizes?.[0], firstAvailableColor)}
            className="p-2.5 sm:p-3 bg-primary-500 text-white rounded-full hover:scale-110 active:scale-95 transition-all duration-300 shadow-xl shadow-primary-500/50"
            title="Ajouter au panier"
          >
            <ShoppingBag size={18} className="sm:w-5 sm:h-5" />
          </button>
        </div>
        <div className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-white/90 backdrop-blur-sm px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold text-slate-800 shadow-sm animate-float">
          {product.category}
        </div>
        {hasVideo && (
           <div className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-black/60 backdrop-blur-sm p-1 sm:p-1.5 rounded-full text-white shadow-sm" title="Vidéo disponible">
              <Play size={10} fill="white" />
           </div>
        )}
      </div>
      
      <div className="p-3 sm:p-5">
        <div className="flex flex-col mb-2">
          <h3 className="font-serif italic text-lg sm:text-xl text-slate-900 mb-1">
            {product.name}
          </h3>
          <span className="text-base sm:text-lg font-bold text-primary-600 tracking-tight">
            {formatPrice(product.price)}
          </span>
        </div>
        
        <p className="text-slate-500 text-[10px] sm:text-sm mb-2 sm:mb-4 line-clamp-1">
          {product.description}
        </p>

        {colors.length > 0 && (
          <div className="flex gap-1.5 items-center">
            {colors.slice(0, 5).map((color, idx) => (
              <div
                key={idx}
                className={`relative w-4 h-4 rounded-full border border-slate-200 ${!color.available ? 'opacity-40' : ''}`}
                title={`${color.name}${!color.available ? ' (Indisponible)' : ''}`}
              >
                <div 
                  className="w-full h-full rounded-full" 
                  style={{ backgroundColor: color.hex }}
                />
                {!color.available && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-[1px] bg-slate-600 rotate-45" />
                  </div>
                )}
              </div>
            ))}
            {colors.length > 5 && (
              <span className="text-[10px] text-slate-400 font-medium">+{colors.length - 5}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;

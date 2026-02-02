import React from 'react';
import { ShoppingBag, Eye, Play } from 'lucide-react';
import { formatPrice } from '../utils/formatters';

const ProductCard = ({ product, onAddToCart, onViewDetails }) => {
  const colors = product.colors || [];
  const firstAvailableColor = colors.find(c => c.available) || colors[0];

  const displayImage = firstAvailableColor?.images?.[0] || product.image;
  const hasVideo = colors.some(c => c.video);

  return (
    <div className="glass-card rounded-2xl overflow-hidden group hover:shadow-2xl transition-all duration-500">
      <div className="relative h-64 overflow-hidden">
        <img
          src={displayImage}
          alt={product.name}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-black/20 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
          <button
            onClick={() => onViewDetails(product)}
            className="p-3 bg-white text-slate-900 rounded-full hover:scale-110 transition-transform duration-300 shadow-lg"
            title="Voir détails"
          >
            <Eye size={20} />
          </button>
          <button
            onClick={() => onAddToCart(product, product.sizes?.[0], firstAvailableColor)}
            className="p-3 bg-primary-500 text-white rounded-full hover:scale-110 transition-transform duration-300 shadow-lg shadow-primary-500/50"
            title="Ajouter au panier"
          >
            <ShoppingBag size={20} />
          </button>
        </div>
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-slate-800">
          {product.category}
        </div>
        {hasVideo && (
           <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm p-1.5 rounded-full text-white shadow-sm" title="Vidéo disponible">
              <Play size={12} fill="white" />
           </div>
        )}
      </div>
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-display font-semibold text-lg text-slate-800 truncate flex-1">
            {product.name}
          </h3>
          <span className="text-lg font-bold text-gradient ml-2">
            {formatPrice(product.price)}
          </span>
        </div>
        
        <p className="text-slate-500 text-sm mb-4 line-clamp-1">
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

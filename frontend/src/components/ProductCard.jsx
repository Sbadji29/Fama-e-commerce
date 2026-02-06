import React from 'react';
import { ShoppingBag, Eye, Play } from 'lucide-react';
import { formatPrice } from '../utils/formatters';

const ProductCard = ({ product, onAddToCart, onViewDetails }) => {
  const colors = product.colors || [];
  const firstAvailableColor = colors.find(c => c.available) || colors[0];

  const displayImage = firstAvailableColor?.images?.[0] || product.image;
  const hasVideo = colors.some(c => c.video);

  return (
    <div className="standard-card hover-glow group h-full">
      <div className="relative h-60 sm:h-64 overflow-hidden bg-slate-100">
        <img
          src={displayImage}
          alt={product.name}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
        />
        
        {/* Permanently Visible Actions */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 z-20">
          <button
            onClick={() => onViewDetails(product)}
            className="action-icon-luxury !p-2 bg-white/95 shadow-md"
            title="Voir détails"
          >
            <Eye size={18} />
          </button>
          <button
            onClick={() => onAddToCart(product, product.sizes?.[0], firstAvailableColor)}
            className="action-icon-luxury !p-2 bg-primary-600 text-white border-primary-500 shadow-md"
            title="Ajouter au panier"
          >
            <ShoppingBag size={18} />
          </button>
        </div>

        <div className="absolute top-3 right-3 bg-white/95 px-2 py-0.5 rounded-full shadow-sm text-[9px] font-black text-primary-600 uppercase tracking-wider z-10 animate-badge-pop">
          {product.category}
        </div>
        {hasVideo && (
           <div className="absolute bottom-3 right-3 bg-black/60 p-1.5 rounded-full text-white backdrop-blur-sm z-10">
              <Play size={10} fill="white" />
           </div>
        )}
      </div>
      
      <div className="p-3 flex flex-col flex-grow bg-white relative">
        {/* Color Swatches */}
        {colors.length > 0 && (
          <div className="flex gap-1 mb-2">
            {colors.slice(0, 5).map((color, idx) => (
              <div
                key={idx}
                className="w-3.5 h-3.5 rounded-full border border-slate-200 shadow-inner"
                style={{ backgroundColor: color.hex || color.name }}
                title={color.name}
              />
            ))}
            {colors.length > 5 && <span className="text-[10px] text-slate-400">+{colors.length - 5}</span>}
          </div>
        )}

        <h3 className="font-bold text-slate-800 text-xs sm:text-sm mb-0.5 truncate group-hover:text-primary-600 transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center mb-3">
          <span className="text-base font-black text-primary-600">
            {formatPrice(product.price)}
          </span>
        </div>

        <button
          onClick={() => onAddToCart(product, product.sizes?.[0], firstAvailableColor)}
          className="w-full btn-primary-pro !py-1.5 text-[10px] uppercase tracking-widest mt-auto transform group-hover:scale-[1.02]"
        >
          Ajouter au panier
        </button>
      </div>
    </div>
  );
};

export default ProductCard;

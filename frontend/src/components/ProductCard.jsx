import React from 'react';
import { ShoppingBag, Eye, Play } from 'lucide-react';
import { formatPrice } from '../utils/formatters';

const ProductCard = ({ product, onAddToCart, onViewDetails }) => {
  const colors = product.colors || [];
  const firstAvailableColor = colors.find(c => c.available) || colors[0];

  const displayImage = firstAvailableColor?.images?.[0] || product.image;
  const hasVideo = colors.some(c => c.video);

  return (
    <div className="standard-card hover-glow group">
      <div className="relative h-64 sm:h-72 overflow-hidden bg-slate-100">
        <img
          src={displayImage}
          alt={product.name}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
        />
        
        {/* Visible Floating Actions on Hover */}
        <div className="absolute inset-0 bg-black/10 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-all duration-500 z-20">
          <button
            onClick={() => onViewDetails(product)}
            className="action-icon-luxury"
            title="Voir détails"
          >
            <Eye size={22} />
          </button>
          <button
            onClick={() => onAddToCart(product, product.sizes?.[0], firstAvailableColor)}
            className="action-icon-luxury bg-primary-600 text-white border-primary-500"
            title="Ajouter au panier"
          >
            <ShoppingBag size={22} />
          </button>
        </div>

        <div className="absolute top-3 right-3 bg-white/95 px-2.5 py-1 rounded-full shadow-sm text-[10px] font-black text-primary-600 uppercase tracking-wider z-10">
          {product.category}
        </div>
        {hasVideo && (
           <div className="absolute top-3 left-3 bg-black/60 p-2 rounded-full text-white backdrop-blur-sm z-10">
              <Play size={12} fill="white" />
           </div>
        )}
      </div>
      
      <div className="p-4 flex flex-col h-full bg-white relative">
        {/* Color Swatches */}
        {colors.length > 0 && (
          <div className="flex gap-1.5 mb-3">
            {colors.map((color, idx) => (
              <div
                key={idx}
                className="w-4 h-4 rounded-full border border-slate-200 shadow-inner"
                style={{ backgroundColor: color.hex || color.name }}
                title={color.name}
              />
            ))}
          </div>
        )}

        <h3 className="font-bold text-slate-800 text-sm sm:text-base mb-1 truncate group-hover:text-primary-600 transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl font-black text-primary-600">
            {formatPrice(product.price)}
          </span>
        </div>

        <button
          onClick={() => onAddToCart(product, product.sizes?.[0], firstAvailableColor)}
          className="w-full btn-primary-pro text-xs uppercase tracking-widest mt-auto transform group-hover:scale-[1.02]"
        >
          Ajouter au panier
        </button>
      </div>
    </div>
  );
};

export default ProductCard;

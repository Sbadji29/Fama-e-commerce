import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { formatPrice } from '../utils/formatters';
import { useCart } from '../context/CartContext';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();
  const colorName = item.color?.name;
  const itemImage = item.color?.images?.[0] || item.image;

  return (
    <div className="flex gap-4 p-4 bg-white/50 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors">
      {/* Image */}
      <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-slate-100">
        <img
          src={itemImage}
          alt={item.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Details */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h4 className="font-semibold text-slate-900 line-clamp-1">{item.name}</h4>
          <div className="flex flex-wrap gap-2 mt-1">
            {item.size && (
              <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full">
                Taille: {item.size}
              </span>
            )}
            {item.color && (
              <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full flex items-center gap-1">
                <div 
                  className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: item.color.hex }}
                />
                {item.color.name}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <p className="font-bold text-primary-600">
            {formatPrice(item.price * item.quantity)}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col items-end justify-between">
        <button
          onClick={() => removeFromCart(item.id, item.size, colorName)}
          className="text-red-400 hover:text-red-500 p-1"
          title="Retirer"
        >
          <Trash2 size={16} />
        </button>

        <div className="flex items-center gap-2 bg-white rounded-lg border border-slate-200 px-1 py-0.5">
          <button
            onClick={() => updateQuantity(item.id, item.size, colorName, item.quantity - 1)}
            className="p-1 hover:text-primary-600 transition-colors disabled:opacity-30"
          >
            <Minus size={14} />
          </button>
          <span className="text-sm font-semibold w-4 text-center">{item.quantity}</span>
          <button
            onClick={() => updateQuantity(item.id, item.size, colorName, item.quantity + 1)}
            className="p-1 hover:text-primary-600 transition-colors"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;

import React from 'react';
import { X, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import CartItem from './CartItem';
import { formatPrice } from '../utils/formatters';

const Cart = ({ onCheckout }) => {
  const { cartItems, isCartOpen, toggleCart, getTotal, clearCart } = useCart();
  const total = getTotal();

  return (
    <>
      {/* Backdrop */}
      {isCartOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300"
          onClick={toggleCart}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white/95 backdrop-blur-xl shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
        isCartOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-2xl font-display font-bold text-slate-900 flex items-center gap-2">
              <ShoppingBag className="text-primary-600" />
              Panier
            </h2>
            <button 
              onClick={toggleCart}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X size={24} className="text-slate-500" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-4">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                  <ShoppingBag size={48} className="text-slate-300" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Votre panier est vide</h3>
                <p className="text-slate-500 max-w-xs">
                  Découvrez nos collections et ajoutez vos articles préférés.
                </p>
                <button 
                  onClick={toggleCart}
                  className="mt-8 btn-outline"
                >
                  Commencer mes achats
                </button>
              </div>
            ) : (
              cartItems.map((item, index) => (
                <CartItem key={`${item.id}-${item.size}-${index}`} item={item} />
              ))
            )}
          </div>

          {/* Footer */}
          {cartItems.length > 0 && (
            <div className="p-6 border-t border-slate-100 bg-white/50 space-y-4">
              <div className="flex items-center justify-between text-lg font-semibold">
                <span className="text-slate-600">Total</span>
                <span className="text-2xl text-gradient font-bold">{formatPrice(total)}</span>
              </div>
              
              <div className="grid gap-3">
                <button 
                  onClick={() => {
                    if (onCheckout) onCheckout();
                    // toggleCart(); // Depending on UX, maybe keep open or close
                  }}
                  className="btn-primary w-full flex items-center justify-center gap-2 group"
                >
                  Commander via WhatsApp
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button 
                  onClick={clearCart}
                  className="text-sm text-slate-400 hover:text-red-500 transition-colors text-center"
                >
                  Vider le panier
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Cart;

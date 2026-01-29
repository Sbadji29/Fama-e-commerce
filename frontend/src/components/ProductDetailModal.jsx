import React, { useState, useEffect } from 'react';
import { X, ShoppingBag, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatPrice } from '../utils/formatters';

const ProductDetailModal = ({ product, isOpen, onClose, onAddToCart }) => {
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Reset indices when product changes
  useEffect(() => {
    if (product) {
      const firstAvailable = product.colors?.findIndex(c => c.available);
      setSelectedColorIndex(firstAvailable !== -1 ? firstAvailable : 0);
      setCurrentImageIndex(0);
    }
  }, [product, isOpen]);

  if (!isOpen || !product) return null;

  const colors = product.colors || [];
  const selectedColor = colors[selectedColorIndex];
  const images = selectedColor?.images || [product.image];
  
  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      <div className="glass-card rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-hidden relative z-10 animate-scale-in flex flex-col md:flex-row">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white text-slate-800 transition-colors z-20 shadow-sm"
        >
          <X size={24} />
        </button>

        {/* Image Section */}
        <div className="relative w-full md:w-1/2 h-80 md:h-auto bg-slate-100 overflow-hidden group">
          <img
            src={images[currentImageIndex]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700"
            key={images[currentImageIndex]} // Force re-render for animation if needed
          />
          
          {images.length > 1 && (
            <>
              <button 
                onClick={handlePrevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 text-slate-800 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white shadow-lg"
              >
                <ChevronLeft size={24} />
              </button>
              <button 
                onClick={handleNextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 text-slate-800 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white shadow-lg"
              >
                <ChevronRight size={24} />
              </button>
              
              {/* Pagination Dots */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      idx === currentImageIndex ? 'w-6 bg-primary-500' : 'bg-white/60 hover:bg-white'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Content Section */}
        <div className="flex flex-col flex-1 p-8 md:p-12 overflow-y-auto">
          <div className="mb-auto">
            <span className="inline-block px-4 py-1 bg-primary-50 text-primary-600 rounded-full text-xs font-bold tracking-wider uppercase mb-4">
              {product.category}
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-2">
              {product.name}
            </h2>
            <p className="text-2xl font-bold text-gradient mb-6">
              {formatPrice(product.price)}
            </p>
            <p className="text-slate-600 leading-relaxed mb-8 text-lg">
              {product.description}
            </p>

            {/* Colors Selection */}
            {colors.length > 0 && (
              <div className="mb-8">
                <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  Couleur: <span className="font-normal text-slate-500">{colors[selectedColorIndex].name}</span>
                </h3>
                <div className="flex flex-wrap gap-4">
                  {colors.map((color, idx) => (
                    <button
                      key={color.name}
                      onClick={() => {
                        if (color.available) {
                          setSelectedColorIndex(idx);
                          setCurrentImageIndex(0);
                        }
                      }}
                      className={`relative w-10 h-10 rounded-full border-2 transition-all p-0.5 ${
                        selectedColorIndex === idx 
                          ? 'border-primary-500 scale-110' 
                          : 'border-transparent hover:scale-105'
                      } ${!color.available ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
                      title={`${color.name}${!color.available ? ' (Indisponible)' : ''}`}
                    >
                      <div 
                        className="w-full h-full rounded-full" 
                        style={{ backgroundColor: color.hex }}
                      />
                      {!color.available && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-full h-[2px] bg-slate-400 rotate-45" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-8">
                <h3 className="font-semibold text-slate-800 mb-4">Tailles disponibles</h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map(size => (
                    <button 
                      key={size}
                      className="w-12 h-12 flex items-center justify-center rounded-xl border-2 border-slate-100 text-slate-600 font-medium hover:border-primary-500 hover:text-primary-500 transition-all active:scale-95"
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-8">
            <button
              onClick={() => {
                onAddToCart(product, product.sizes?.[0], colors[selectedColorIndex]);
                onClose();
              }}
              className="btn-primary w-full flex items-center justify-center gap-3 py-4 text-lg"
            >
              <ShoppingBag size={22} />
              Ajouter au panier
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;

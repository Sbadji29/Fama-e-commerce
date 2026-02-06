import React, { useState, useEffect } from 'react';
import { X, ShoppingBag, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { formatPrice } from '../utils/formatters';

const ProductDetailModal = ({ product, isOpen, onClose, onAddToCart }) => {
  const [selectedColorIndex, setSelectedColorIndex] = useState(-1);
  const [selectedSize, setSelectedSize] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [viewingVideo, setViewingVideo] = useState(false);
  const [showError, setShowError] = useState(false);

  // Reset indices when product changes
  useEffect(() => {
    if (product) {
      setSelectedColorIndex(-1);
      setSelectedSize(null);
      setCurrentImageIndex(0);
      setViewingVideo(false);
      setShowError(false);
    }
  }, [product, isOpen]);

  // Reset video when color changes
  useEffect(() => {
    setViewingVideo(false);
  }, [selectedColorIndex]);

  if (!isOpen || !product) return null;

  const colors = product.colors || [];
  const selectedColor = selectedColorIndex !== -1 ? colors[selectedColorIndex] : null;
  const images = selectedColor?.images || [product.image];
  const video = selectedColor?.video;
  
  const handleAddToCart = () => {
    const hasColors = colors.length > 0;
    const hasSizes = product.sizes && product.sizes.length > 0;

    if ((hasColors && selectedColorIndex === -1) || (hasSizes && !selectedSize)) {
      setShowError(true);
      return;
    }

    onAddToCart(product, selectedSize, selectedColor);
    onClose();
  };

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
          {viewingVideo && video ? (
             <div className="w-full h-full bg-black flex items-center justify-center relative">
                <video 
                    src={video} 
                    controls 
                    autoPlay 
                    className="w-full h-full object-contain" 
                />
                <button 
                  onClick={() => setViewingVideo(false)}
                  className="absolute top-4 left-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors z-30"
                >
                  <ChevronLeft size={24} /> <span className="sr-only">Retour</span>
                </button>
             </div>
          ) : (
            <>
              <img
                src={images[currentImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700"
                key={images[currentImageIndex]} // Force re-render for animation if needed
              />
              
              {/* Play Button Overlay */}
              {video && (
                <button
                    onClick={() => setViewingVideo(true)}
                    className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors group/video z-10"
                >
                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/40 shadow-xl group-hover/video:scale-110 transition-transform">
                        <Play fill="white" className="text-white ml-1" size={32} />
                    </div>
                </button>
              )}

              {images.length > 1 && (
                <>
                  <button 
                    onClick={handlePrevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 text-slate-800 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white shadow-lg z-20"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button 
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 text-slate-800 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white shadow-lg z-20"
                  >
                    <ChevronRight size={24} />
                  </button>
                  
                  {/* Pagination Dots */}
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                    {images.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={(e) => {
                            e.stopPropagation();
                            setCurrentImageIndex(idx);
                        }}
                        className={`w-2 h-2 rounded-full transition-all ${
                          idx === currentImageIndex ? 'w-6 bg-primary-500' : 'bg-white/60 hover:bg-white'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
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
            <p className="text-slate-600 leading-relaxed mb-8 text-sm">
              {product.description}
            </p>

            {/* Colors Selection */}
            {colors.length > 0 && (
              <div className="mb-8">
                <h3 className="font-semibold text-slate-800 mb-4 flex items-center justify-between">
                  <span>Choisir la Couleur :</span>
                  {selectedColor && <span className="text-primary-600 font-bold">{selectedColor.name}</span>}
                </h3>
                <div className="flex flex-wrap gap-4">
                  {colors.map((color, idx) => (
                    <button
                      key={color.name}
                      onClick={() => {
                        if (color.available) {
                          setSelectedColorIndex(idx);
                          setCurrentImageIndex(0);
                          setShowError(false);
                        }
                      }}
                      className={`relative w-11 h-11 rounded-full border-2 transition-all p-0.5 ${
                        selectedColorIndex === idx 
                          ? 'border-primary-600 scale-110 shadow-lg' 
                          : 'border-slate-200 hover:border-primary-300'
                      } ${!color.available ? 'cursor-not-allowed opacity-30 grayscale' : 'cursor-pointer'}`}
                      title={`${color.name}${!color.available ? ' (Indisponible)' : ''}`}
                    >
                      <div 
                        className="w-full h-full rounded-full" 
                        style={{ backgroundColor: color.hex }}
                      />
                      {selectedColorIndex === idx && (
                         <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary-600 rounded-full border-2 border-white flex items-center justify-center">
                            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                         </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-8">
                <h3 className="font-semibold text-slate-800 mb-4">Choisir la Taille :</h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map(size => (
                    <button 
                      key={size}
                      onClick={() => {
                        setSelectedSize(size);
                        setShowError(false);
                      }}
                      className={`w-12 h-12 flex items-center justify-center rounded-xl border-2 transition-all font-bold ${
                        selectedSize === size
                          ? 'border-primary-600 bg-primary-50 text-primary-600 shadow-md scale-105'
                          : 'border-slate-100 text-slate-600 hover:border-primary-300 hover:text-primary-500'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {showError && (
              <div className="mb-6 animate-shake p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-sm font-bold">
                <AlertCircle size={18} />
                Veuillez sélectionner une couleur et une taille
              </div>
            )}
          </div>

          <div className="mt-8">
            <button
              onClick={handleAddToCart}
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

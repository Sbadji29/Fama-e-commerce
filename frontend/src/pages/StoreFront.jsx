import React, { useState, useMemo } from 'react';
import { Sparkle, Stars } from 'lucide-react';
import Header from '../components/Header';
import ProductGrid from '../components/ProductGrid';
import CategoryFilter from '../components/CategoryFilter';
import ProductDetailModal from '../components/ProductDetailModal';
import Cart from '../components/Cart';
import CheckoutModal from '../components/CheckoutModal';
import WhatsAppButton from '../components/WhatsAppButton';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';
import { useCategories } from '../context/CategoryContext';

const StoreFront = () => {
  const [activeCategory, setActiveCategory] = useState('Tous');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false); // New state
  
  const { addToCart, toggleCart } = useCart();
  const { products } = useProducts();
  const { categories: contextCategories } = useCategories();

  const categories = ['Tous', ...contextCategories];

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'Tous') return products;
    return products.filter(p => p.category === activeCategory);
  }, [activeCategory]);

  const handleOpenDetails = (product) => {
    setSelectedProduct(product);
    setIsDetailOpen(true);
  };

  const handleAddToCart = (product, size) => {
    addToCart(product, size);
  };

  const handleCheckout = () => {
    toggleCart(); // Close cart
    setIsCheckoutOpen(true); // Open checkout
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-primary-100/40 blur-[120px] rounded-full animate-spin-slow"></div>
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-secondary-100/40 blur-[120px] rounded-full animate-float"></div>
      
      <Header />
      
      <main className="container mx-auto px-4 pt-12 pb-20 relative z-10">
        <section className="text-center mb-16 relative">
          {/* Sparkles icons */}
          <div className="absolute -top-10 left-1/4 animate-sparkle text-secondary-500 hidden md:block">
            <Sparkle size={32} />
          </div>
          <div className="absolute top-0 right-1/4 animate-sparkle delay-700 text-primary-400 hidden md:block">
            <Sparkle size={24} />
          </div>
          
          <div className="inline-block mb-3 px-4 py-1.5 rounded-full bg-primary-50 border border-primary-100 text-primary-600 text-xs font-bold uppercase tracking-widest animate-bounce-subtle">
            Nouvelle Collection 2026
          </div>
          
          <h2 className="text-hero mb-6">
            La Vitrine <br className="md:hidden" />
            <span className="text-gradient relative">
              Enchantée
              <Stars className="absolute -top-6 -right-10 text-secondary-400 animate-pulse-soft hidden md:block" />
            </span>
          </h2>
          
          <p className="text-lg md:text-xl text-slate-600 max-w-xl mx-auto leading-relaxed font-medium">
            Plongez dans un univers de <span className="text-primary-600">chic</span> et de <span className="text-secondary-600">glamour</span>. 
            Des pièces uniques pour des femmes d'exception.
          </p>
        </section>

        <div className="max-w-4xl mx-auto">
          <CategoryFilter 
            categories={categories}
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
          />
        </div>

        <ProductGrid 
          products={filteredProducts}
          onAddToCart={(product) => handleAddToCart(product, product.sizes?.[0])}
          onViewDetails={handleOpenDetails}
        />
      </main>

      <Footer />

      {/* Modals and Overlays */}
      <ProductDetailModal 
        product={selectedProduct}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onAddToCart={handleAddToCart}
      />

      <CheckoutModal 
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />

      <Cart onCheckout={handleCheckout} />
      
      <WhatsAppButton />
    </div>
  );
};

export default StoreFront;

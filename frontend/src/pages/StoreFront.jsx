import React, { useState, useMemo } from 'react';
import { Sparkle, Stars } from 'lucide-react';
import Header from '../components/Header';
import ProductGrid from '../components/ProductGrid';
import CategoryFilter from '../components/CategoryFilter';
import ProductDetailModal from '../components/ProductDetailModal';
import Cart from '../components/Cart';
import CheckoutModal from '../components/CheckoutModal';
import WhatsAppButton from '../components/WhatsAppButton';
import ScrollingBanner from '../components/ScrollingBanner';
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
      
      <main className="container mx-auto px-4 pt-4 pb-20 relative z-10">
        <section className="relative mb-4 text-center">
          {/* Decorative floating elements */}
          <div className="absolute top-0 left-10 animate-float opacity-30 pointer-events-none">
            <Sparkle size={48} className="text-primary-400" />
          </div>
          <div className="absolute -bottom-10 right-20 animate-sparkle opacity-30 pointer-events-none">
            <Stars size={40} className="text-secondary-400" />
          </div>
        </section>

        {/* The Banner is now the Hero */}
        <section className="mb-8 -mx-4 sm:mx-0">
          <ScrollingBanner products={products.slice(0, 12)} />
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

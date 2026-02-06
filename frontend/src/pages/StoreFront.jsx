import React, { useState, useMemo } from 'react';
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
      
      <main className="container mx-auto px-4 py-8 relative z-10">
        <section className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-4 tracking-tight">
            La Vitrine <span className="text-gradient">Enchantée</span>
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Découvrez nos trésors soigneusement sélectionnés pour sublimer chaque instant de votre vie.
          </p>
        </section>

        <CategoryFilter 
          categories={categories}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
        />

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

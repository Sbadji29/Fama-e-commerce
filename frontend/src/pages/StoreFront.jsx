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
    <div className="min-h-screen relative">
      {/* Mesh Gradient Background */}
      <div className="mesh-gradient-bg">
        <div className="orb w-[500px] h-[500px] bg-primary-100/40 -top-24 -left-24"></div>
        <div className="orb w-[600px] h-[600px] bg-secondary-100/30 bottom-0 -right-24 delay-1000"></div>
        <div className="orb w-[400px] h-[400px] bg-primary-200/20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 delay-500"></div>
      </div>
      
      <Header />
      
      <main className="container mx-auto px-4 pt-12 pb-24 relative z-10">
        <section className="relative mb-16 text-center">
          {/* Editorial Logo Badge */}
          <div className="flex flex-col items-center mb-10">
            <div className="relative group">
              <div className="absolute inset-0 bg-primary-500/20 blur-3xl group-hover:blur-[60px] transition-all duration-1000"></div>
              <img 
                src="/logo.jpeg" 
                alt="Brand Logo" 
                className="relative h-24 sm:h-32 w-auto object-contain rounded-full shadow-2xl border-4 border-white/80 animate-float"
              />
            </div>
            <h1 className="mt-8 font-serif italic text-4xl md:text-6xl text-slate-900 tracking-tighter">
              L'Élégance <span className="text-primary-600">Redéfinie</span>
            </h1>
          </div>
          
          {/* Asymmetrical Floating Elements */}
          <div className="absolute top-0 left-0 animate-bounce-subtle opacity-40">
            <Sparkle size={32} className="text-secondary-400" />
          </div>
          <div className="absolute bottom-0 right-10 animate-sparkle opacity-40">
            <Stars size={44} className="text-primary-300" />
          </div>
        </section>

        {/* The Banner is now the centerpiece */}
        <section className="mb-24 -mx-4 sm:mx-0 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-white z-10 pointer-events-none opacity-40"></div>
          <ScrollingBanner products={products.slice(0, 15)} />
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

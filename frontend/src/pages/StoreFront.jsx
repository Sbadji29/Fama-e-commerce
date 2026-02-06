import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
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
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Professional Hero Section */}
      <section className="bg-slate-50 border-b border-slate-100">
        <div className="container mx-auto px-4 py-8 sm:py-12">
          <div className="flex flex-col md:flex-row gap-8 items-center bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200">
            <div className="flex-1 p-8 sm:p-12 text-center md:text-left">
              <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 text-xs font-bold rounded-full mb-4 uppercase tracking-wider">
                Nouvelle Arrivée
              </span>
              <h1 className="text-4xl sm:text-6xl font-black text-slate-900 leading-tight mb-6">
                ÉLÉGANCE <br /> <span className="text-primary-600">SANS COMPROMIS</span>
              </h1>
              <p className="text-slate-600 text-lg mb-8 max-w-md">
                Découvrez notre nouvelle collection exclusive. Des pièces uniques sélectionnées pour vous sublimer.
              </p>
              <button className="bg-slate-900 text-white px-8 py-3.5 rounded font-bold hover:bg-slate-800 transition-all uppercase tracking-widest text-sm">
                Acheter Maintenant
              </button>
            </div>
            <div className="flex-1 h-64 sm:h-auto w-full">
              <img 
                src={products[0]?.image || "/logo.jpeg"} 
                alt="Featured Product" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Service Ribbon (Trust Signals) */}
      <section className="bg-white border-b border-slate-100">
        <div className="container mx-auto px-4 py-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Paiement à la livraison", icon: "🚚" },
            { label: "Qualité Garantie", icon: "⭐" },
            { label: "Service Client 24/7", icon: "📞" },
            { label: "Retour Facile", icon: "🔄" }
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-center gap-3 text-sm font-medium text-slate-700">
              <span className="text-xl">{item.icon}</span>
              {item.label}
            </div>
          ))}
        </div>
      </section>

      <main className="container mx-auto px-4 pt-10 pb-24">
        {/* Trending Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8 border-b border-slate-200 pb-4">
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Tendance du moment</h2>
            <Link to="/collection" className="text-primary-600 font-bold text-sm hover:underline">Voir plus ›</Link>
          </div>
          <ScrollingBanner products={products.slice(0, 15)} />
        </div>

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

import React, { useState, useMemo } from 'react';
import Header from '../components/Header';
import ProductGrid from '../components/ProductGrid';
import CategoryFilter from '../components/CategoryFilter';
import ProductDetailModal from '../components/ProductDetailModal';
import Cart from '../components/Cart';
import CheckoutModal from '../components/CheckoutModal'; // Import
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
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <section className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-4">
            La Vitrine Enchantée
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Découvrez nos trésors soigneusement sélectionnés pour vous.
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
    </div>
  );
};

export default StoreFront;

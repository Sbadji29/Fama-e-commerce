import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Menu, X, Search } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { getItemCount, toggleCart } = useCart();
  const { searchQuery, setSearchQuery } = useProducts();
  const itemCount = getItemCount();

  return (
    <div className="w-full">
      {/* Top Bar - Vibrant Brand Colors */}
      <div className="bg-gradient-to-r from-primary-600 via-secondary-500 to-primary-600 text-white text-[10px] sm:text-xs py-2 text-center font-bold tracking-widest shadow-inner">
        LIVRAISON GRATUITE PARTOUT AU SÉNÉGAL À PARTIR DE 50.000 FCFA 🇸🇳
      </div>

      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
        <div className="container mx-auto px-4 h-16 sm:h-20 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <img 
              src="/logo.jpeg" 
              alt="MissUniverse Logo" 
              className="h-10 sm:h-14 w-auto object-contain"
            />
          </Link>

          {/* Search Bar - Professional E-commerce Style */}
          <div className="hidden md:flex flex-grow max-w-xl relative">
            <input 
              type="text" 
              placeholder="Rechercher des produits, catégories..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border-none rounded-md text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          </div>

          {/* Desktop Navigation & Actions */}
          <div className="flex items-center gap-6">
            <nav className="hidden lg:flex items-center gap-6">
              <Link to="/" className="text-sm font-bold text-slate-700 hover:text-primary-600 uppercase tracking-tight transition-colors">
                Accueil
              </Link>
              <Link to="/collection" className="text-sm font-bold text-slate-700 hover:text-primary-600 uppercase tracking-tight transition-colors">
                Boutique
              </Link>
            </nav>

            <div className="flex items-center gap-2 sm:gap-4">
              <button className="md:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-full">
                <Search className="w-5 h-5" />
              </button>

              <button 
                onClick={toggleCart}
                className="relative p-2 rounded-full hover:bg-slate-100 transition-colors group"
                aria-label="Ouvrir le panier"
              >
                <ShoppingCart className="w-6 h-6 text-slate-700 group-hover:text-primary-600 transition-colors" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white bg-primary-600 rounded-full">
                    {itemCount}
                  </span>
                )}
              </button>
              
              <button 
                className="md:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-100 p-4 flex flex-col gap-4 shadow-lg animate-fade-in z-30">
            <Link to="/" className="font-bold text-slate-700 p-2 hover:bg-slate-50 rounded-lg text-sm uppercase" onClick={() => setIsMobileMenuOpen(false)}>Accueil</Link>
            <Link to="/collection" className="font-bold text-slate-700 p-2 hover:bg-slate-50 rounded-lg text-sm uppercase" onClick={() => setIsMobileMenuOpen(false)}>Boutique</Link>
            <Link to="/about" className="font-bold text-slate-700 p-2 hover:bg-slate-50 rounded-lg text-sm uppercase" onClick={() => setIsMobileMenuOpen(false)}>À propos</Link>
          </div>
        )}
      </header>
    </div>
  );
};

export default Header;

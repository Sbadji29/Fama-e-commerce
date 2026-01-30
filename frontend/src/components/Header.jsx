import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { getItemCount, toggleCart } = useCart();
  const itemCount = getItemCount();

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 transition-all duration-300">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
          <h1 className="text-2xl font-display font-bold text-gradient">
            MissUniverse
          </h1>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/" className="font-medium text-slate-600 hover:text-primary-600 transition-colors relative group">
            Accueil
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-500 transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link to="/collection" className="font-medium text-slate-600 hover:text-primary-600 transition-colors relative group">
            Collections
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-500 transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link to="/about" className="font-medium text-slate-600 hover:text-primary-600 transition-colors relative group">
            À propos
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-500 transition-all duration-300 group-hover:w-full"></span>
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleCart}
            className="relative p-2 rounded-full hover:bg-slate-100 transition-colors group"
            aria-label="Ouvrir le panier"
          >
            <ShoppingCart className="w-6 h-6 text-slate-700 group-hover:text-primary-600 transition-colors" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-gradient-to-r from-red-500 to-pink-500 rounded-full shadow-lg shadow-red-500/30 animate-bounce-subtle">
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

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white border-b border-slate-100 p-4 flex flex-col gap-4 shadow-lg animate-fade-in z-30">
          <Link to="/" className="font-medium text-slate-600 p-2 hover:bg-slate-50 rounded-lg" onClick={() => setIsMobileMenuOpen(false)}>Accueil</Link>
          <Link to="/collection" className="font-medium text-slate-600 p-2 hover:bg-slate-50 rounded-lg" onClick={() => setIsMobileMenuOpen(false)}>Collections</Link>
          <Link to="/about" className="font-medium text-slate-600 p-2 hover:bg-slate-50 rounded-lg" onClick={() => setIsMobileMenuOpen(false)}>À propos</Link>
        </div>
      )}
    </header>
  );
};

export default Header;

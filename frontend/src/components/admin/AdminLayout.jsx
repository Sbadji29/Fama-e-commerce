import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, LogOut, Menu, X, Tag } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const { logout } = useAuth();

  const navItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Tableau de bord' },
    { path: '/admin/products', icon: Package, label: 'Produits' },
    { path: '/admin/categories', icon: Tag, label: 'Catégories' },
    { path: '/admin/orders', icon: ShoppingCart, label: 'Commandes' },
  ];

  const isActive = (path) => {
    return location.pathname === path || (path !== '/admin' && location.pathname.startsWith(path));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100">
          <span className="text-xl font-display font-bold text-gradient">Fama Admin</span>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden p-1 text-slate-500 hover:bg-slate-100 rounded"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium ${
                  active 
                    ? 'bg-primary-50 text-primary-600' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon size={20} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-slate-100">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors font-medium text-left"
          >
            <LogOut size={20} />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-slate-100 flex items-center px-4 md:px-8 justify-between sticky top-0 z-30">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="md:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            <Menu size={24} />
          </button>
          
          <div className="flex items-center gap-4 ml-auto">
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-sm">
              AD
            </div>
            <span className="text-sm font-medium text-slate-700 hidden sm:block">Admin User</span>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

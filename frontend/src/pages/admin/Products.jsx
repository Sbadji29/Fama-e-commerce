import React, { useState } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import ProductTable from '../../components/admin/ProductTable';
import ProductForm from '../../components/admin/ProductForm';
import { useCategories } from '../../context/CategoryContext';

const Products = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const { categories } = useCategories();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Tous');

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'Tous' || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleEdit = (product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      deleteProduct(id);
    }
  };

  const handleSave = (productData) => {
    if (editingProduct) {
      updateProduct(editingProduct.id, productData);
    } else {
      addProduct(productData);
    }
    setIsFormOpen(false);
    setEditingProduct(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-slate-900">Produits</h1>
          <p className="text-slate-500">Gérez votre catalogue</p>
        </div>
        <button 
          onClick={() => {
            setEditingProduct(null);
            setIsFormOpen(true);
          }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          Nouveau produit
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Rechercher un produit..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={20} className="text-slate-400" />
          <select 
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 rounded-lg border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none bg-white cursor-pointer"
          >
            <option value="Tous">Toutes les catégories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <ProductTable 
        products={filteredProducts} 
        onEdit={handleEdit} 
        onDelete={handleDelete} 
      />

      {/* Form Modal */}
      {isFormOpen && (
        <ProductForm 
          product={editingProduct} 
          onSubmit={handleSave} 
          onCancel={() => {
            setIsFormOpen(false);
            setEditingProduct(null);
          }} 
        />
      )}
    </div>
  );
};

export default Products;

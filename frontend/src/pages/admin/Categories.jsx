import React, { useState } from 'react';
import { Plus, Trash2, Tag } from 'lucide-react';
import { useCategories } from '../../context/CategoryContext';

const Categories = () => {
  const { categories, addCategory, deleteCategory } = useCategories();
  const [newCategory, setNewCategory] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (newCategory.trim()) {
      addCategory(newCategory.trim());
      setNewCategory('');
    }
  };

  const handleDelete = (category) => {
    if (window.confirm(`Supprimer la catégorie "${category}" ?`)) {
      deleteCategory(category);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-display font-bold text-slate-900">Catégories</h1>
        <p className="text-slate-500">Gérez les rayons de votre boutique</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Add Category Form */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-fit">
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Plus size={20} className="text-primary-600" />
            Nouvelle catégorie
          </h2>
          <form onSubmit={handleAdd} className="flex gap-2">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="input-field"
              placeholder="Ex: Sacs à main"
              required
            />
            <button 
              type="submit"
              className="btn-primary whitespace-nowrap"
            >
              Ajouter
            </button>
          </form>
        </div>

        {/* Category List */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50">
            <h2 className="font-bold text-slate-700">Catégories existantes ({categories.length})</h2>
          </div>
          <ul className="divide-y divide-slate-100">
            {categories.map((category) => (
              <li key={category.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary-50 rounded-lg text-primary-600">
                    <Tag size={18} />
                  </div>
                  <span className="font-medium text-slate-700">{category.name}</span>
                </div>
                {/* 
                <button
                  onClick={() => handleDelete(category.id)}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                  title="Supprimer"
                >
                  <Trash2 size={18} />
                </button> 
                */}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Categories;

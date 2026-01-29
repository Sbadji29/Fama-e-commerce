import React, { useState, useEffect } from 'react';
import { X, Save, Image as ImageIcon } from 'lucide-react';
import { useCategories } from '../../context/CategoryContext';

const ProductForm = ({ product, onSubmit, onCancel }) => {
  const { categories } = useCategories();
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: categories[0] || 'Vêtements',
    description: '',
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80',
    sizes: 'S, M, L' // Comma separated string for input
  });

  useEffect(() => {
    if (product) {
      setFormData({
        ...product,
        sizes: product.sizes ? product.sizes.join(', ') : ''
      });
    }
  }, [product]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formattedData = {
      ...formData,
      price: parseInt(formData.price),
      sizes: formData.sizes.split(',').map(s => s.trim()).filter(Boolean)
    };
    onSubmit(formattedData);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onCancel}
      />
      
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl relative z-10 animate-scale-in flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-xl font-display font-bold text-slate-900">
            {product ? 'Modifier le produit' : 'Nouveau produit'}
          </h2>
          <button 
            onClick={onCancel}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-500"
          >
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto p-6 flex-1">
          <form id="product-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nom du produit</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="input-field"
                    placeholder="Ex: Robe Soirée"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Prix (CFA)</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.price}
                      onChange={e => setFormData({...formData, price: e.target.value})}
                      className="input-field"
                      placeholder="25000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Catégorie</label>
                    <select
                      value={formData.category}
                      onChange={e => setFormData({...formData, category: e.target.value})}
                      className="input-field appearance-none cursor-pointer"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tailles (séparées par des virgules)</label>
                  <input
                    type="text"
                    value={formData.sizes}
                    onChange={e => setFormData({...formData, sizes: e.target.value})}
                    className="input-field"
                    placeholder="S, M, L, XL"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                  <textarea
                    required
                    rows="4"
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    className="input-field min-h-[100px]"
                    placeholder="Description détaillée du produit..."
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-slate-700">Image du produit</label>
                <div className="relative aspect-square rounded-xl overflow-hidden border-2 border-dashed border-slate-200 bg-slate-50 group">
                  {formData.image ? (
                    <>
                      <img 
                        src={formData.image} 
                        alt="Aperçu" 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-medium">
                        Changer l'image
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400">
                      <ImageIcon size={32} />
                      <span className="mt-2 text-sm">Aperçu de l'image</span>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">URL de l'image</label>
                  <input
                    type="url"
                    required
                    value={formData.image}
                    onChange={e => setFormData({...formData, image: e.target.value})}
                    className="input-field text-sm"
                    placeholder="https://example.com/image.jpg"
                  />
                  <p className="text-xs text-slate-400 mt-1">Utilisez une URL Unsplash pour le test</p>
                </div>
              </div>
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50 rounded-b-2xl">
          <button
            onClick={onCancel}
            className="px-6 py-2.5 rounded-xl font-medium text-slate-600 hover:bg-slate-200 transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            form="product-form"
            className="px-6 py-2.5 rounded-xl font-bold text-white bg-primary-600 hover:bg-primary-700 shadow-lg shadow-primary-500/20 transition-all transform active:scale-95 flex items-center gap-2"
          >
            <Save size={18} />
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;

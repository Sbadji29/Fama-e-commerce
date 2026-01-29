import React, { useState, useEffect } from 'react';
import { X, Save, Image as ImageIcon, Plus, Trash2 } from 'lucide-react';
import { useCategories } from '../../context/CategoryContext';

const ProductForm = ({ product, onSubmit, onCancel }) => {
  const { categories } = useCategories();
  
  // Initial state structure
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category_id: '',
    description: '',
    colors: [
      {
        name: 'Standard',
        hex: '#000000',
        stock_quantity: 0,
        images: [''] // Minimum one image slot
      }
    ]
  });

  useEffect(() => {
    if (product) {
        // Adapt existing product data to form structure
        // If editing, we assume product has new structure or we adapt it
        setFormData({
            name: product.name || '',
            price: product.price || '',
            category_id: product.category_id || (categories.length > 0 ? categories[0].id : ''),
            description: product.description || '',
            // If product has colors, use them, else default
            colors: product.colors && product.colors.length > 0 ? product.colors.map(c => ({
                name: c.name || '',
                hex: c.hex || '#000000',
                stock_quantity: c.stock || 0,
                images: c.images && c.images.length > 0 ? c.images : ['']
            })) : [{ name: 'Standard', hex: '#000000', stock_quantity: 0, images: [''] }]
        });
    } else if (categories.length > 0) {
        setFormData(prev => ({ ...prev, category_id: categories[0].id }));
    }
  }, [product, categories]);

  const handleColorChange = (index, field, value) => {
    const newColors = [...formData.colors];
    newColors[index][field] = value;
    setFormData({ ...formData, colors: newColors });
  };

  const addColor = () => {
    setFormData({
      ...formData,
      colors: [...formData.colors, { name: '', hex: '#000000', stock_quantity: 0, images: [''] }]
    });
  };

  const removeColor = (index) => {
    if (formData.colors.length > 1) {
        const newColors = formData.colors.filter((_, i) => i !== index);
        setFormData({ ...formData, colors: newColors });
    }
  };

  const handleImageChange = (colorIndex, imageIndex, value) => {
    const newColors = [...formData.colors];
    newColors[colorIndex].images[imageIndex] = value;
    setFormData({ ...formData, colors: newColors });
  };

  const addImageSlot = (colorIndex) => {
    const newColors = [...formData.colors];
    newColors[colorIndex].images.push('');
    setFormData({ ...formData, colors: newColors });
  };

  const removeImageSlot = (colorIndex, imageIndex) => {
    const newColors = [...formData.colors];
    if (newColors[colorIndex].images.length > 1) {
        newColors[colorIndex].images = newColors[colorIndex].images.filter((_, i) => i !== imageIndex);
        setFormData({ ...formData, colors: newColors });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Clean up empty images
    const cleanedColors = formData.colors.map(c => ({
        ...c,
        images: c.images.filter(img => img.trim() !== '')
    }));

    const formattedData = {
      ...formData,
      price: parseFloat(formData.price),
      colors: cleanedColors
    };
    onSubmit(formattedData);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onCancel}
      />
      
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl relative z-10 animate-scale-in flex flex-col max-h-[90vh]">
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
          <form id="product-form" onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <label className="block text-sm font-medium text-slate-700">Informations de base</label>
                    <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        className="input-field"
                        placeholder="Nom du produit"
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <input
                            type="number"
                            required
                            min="0"
                            value={formData.price}
                            onChange={e => setFormData({...formData, price: e.target.value})}
                            className="input-field"
                            placeholder="Prix (CFA)"
                        />
                        <select
                            value={formData.category_id}
                            onChange={e => setFormData({...formData, category_id: e.target.value})}
                            className="input-field appearance-none cursor-pointer"
                        >
                            <option value="">Sélectionner une catégorie</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                    <textarea
                        required
                        rows="4"
                        value={formData.description}
                        onChange={e => setFormData({...formData, description: e.target.value})}
                        className="input-field"
                        placeholder="Description..."
                    />
                </div>
            </div>

            {/* Colors & Images */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium text-slate-700">Couleurs et Images</label>
                    <button type="button" onClick={addColor} className="text-primary-600 text-sm font-medium flex items-center gap-1 hover:underline">
                        <Plus size={16} /> Ajouter une couleur
                    </button>
                </div>
                
                <div className="space-y-6">
                    {formData.colors.map((color, cIndex) => (
                        <div key={cIndex} className="p-4 border border-slate-200 rounded-xl bg-slate-50 relative">
                            {formData.colors.length > 1 && (
                                <button type="button" onClick={() => removeColor(cIndex)} className="absolute top-4 right-4 text-slate-400 hover:text-red-500">
                                    <Trash2 size={18} />
                                </button>
                            )}
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 pr-8">
                                <input
                                    type="text"
                                    placeholder="Nom couleur (ex: Rouge)"
                                    value={color.name}
                                    onChange={(e) => handleColorChange(cIndex, 'name', e.target.value)}
                                    className="input-field"
                                />
                                <div className="flex items-center gap-2">
                                    <input
                                        type="color"
                                        value={color.hex}
                                        onChange={(e) => handleColorChange(cIndex, 'hex', e.target.value)}
                                        className="h-10 w-10 rounded cursor-pointer border-0"
                                    />
                                    <span className="text-sm text-slate-500">{color.hex}</span>
                                </div>
                                <input
                                    type="number"
                                    placeholder="Stock"
                                    min="0"
                                    value={color.stock_quantity}
                                    onChange={(e) => handleColorChange(cIndex, 'stock_quantity', parseInt(e.target.value) || 0)}
                                    className="input-field"
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Images pour {color.name || 'cette couleur'}</label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {color.images.map((img, iIndex) => (
                                        <div key={iIndex} className="relative group">
                                            <div className="aspect-square bg-white rounded-lg border border-slate-200 overflow-hidden flex items-center justify-center">
                                                {img ? (
                                                    <img src={img} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <ImageIcon className="text-slate-300" />
                                                )}
                                            </div>
                                            <input
                                                type="url"
                                                placeholder="https://..."
                                                value={img}
                                                onChange={(e) => handleImageChange(cIndex, iIndex, e.target.value)}
                                                className="mt-1 w-full text-xs p-1 border rounded"
                                            />
                                            <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                 <button
                                                    type="button"
                                                    onClick={() => removeImageSlot(cIndex, iIndex)}
                                                    className="bg-white text-red-500 rounded-full p-1 shadow-sm border border-slate-100"
                                                    disabled={color.images.length <= 1}
                                                >
                                                    <X size={12} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => addImageSlot(cIndex)}
                                        className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-lg text-slate-400 hover:border-primary-300 hover:text-primary-500 transition-colors"
                                    >
                                        <Plus size={24} />
                                        <span className="text-xs mt-1">Ajouter</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
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

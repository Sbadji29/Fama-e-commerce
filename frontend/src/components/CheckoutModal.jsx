import React, { useState } from 'react';
import { X, MessageCircle, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice, validatePhone } from '../utils/formatters';
import { generateWhatsAppURL } from '../utils/whatsapp';

const CheckoutModal = ({ isOpen, onClose }) => {
  const { cartItems, getTotal, clearCart } = useCart();
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    phone: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const total = getTotal();

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Le nom est requis';
    if (!formData.city.trim()) newErrors.city = 'La ville est requise';
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Le téléphone est requis';
    } else if (validatePhone && !validatePhone(formData.phone)) {
      newErrors.phone = 'Numéro invalide (ex: 771234567)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      let validationLink = null;
      let orderCreated = false;

      try {
        // Create order in backend
        const response = await fetch('http://localhost:5000/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                customer_name: formData.name,
                customer_phone: formData.phone,
                customer_city: formData.city,
                items: cartItems.map(item => ({
                    product_color_id: item.color?.id, 
                    quantity: item.quantity,
                    price: item.price,
                    size: item.size,
                    name: item.name
                })),
                total_amount: total
            })
        });

        if (!response.ok) throw new Error('Failed to create order');
        const data = await response.json();
        validationLink = `${window.location.origin}${data.validationLink}`;
        orderCreated = true;

      } catch (err) {
        console.error("Backend error, falling back to offline mode:", err);
        // Fallback: Proceed without validation link
        // Optional: Alert user
        // alert("Connexion serveur instable. La commande sera envoyée via WhatsApp uniquement.");
      } finally {
        const url = generateWhatsAppURL(formData, cartItems, total, validationLink);
        window.open(url, '_blank');
        clearCart();
        onClose();
        setIsSubmitting(false);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      <div className="glass-card w-full max-w-md bg-white rounded-2xl relative z-10 animate-scale-in p-0 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white/50">
          <h2 className="text-xl font-display font-bold text-slate-900">
            Finaliser la commande
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-primary-50 p-4 rounded-xl border border-primary-100 mb-6">
            <p className="text-sm text-primary-800 flex items-start gap-2">
              <MessageCircle size={18} className="shrink-0 mt-0.5" />
              La commande sera envoyée directement sur WhatsApp pour confirmation rapide.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Nom complet
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`input-field ${errors.name ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : ''}`}
              placeholder="Ex: Aminata Diallo"
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                <AlertCircle size={12} /> {errors.name}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Ville de livraison
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className={`input-field ${errors.city ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : ''}`}
              placeholder="Ex: Dakar, Plateau"
            />
            {errors.city && (
              <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                <AlertCircle size={12} /> {errors.city}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Téléphone
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`input-field ${errors.phone ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : ''}`}
              placeholder="Ex: 77 123 45 67"
            />
            {errors.phone && (
              <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                <AlertCircle size={12} /> {errors.phone}
              </p>
            )}
          </div>

          <div className="py-4 border-t border-slate-100 flex items-center justify-between mt-6">
            <span className="text-slate-600 font-medium">Total à payer</span>
            <span className="text-2xl text-gradient font-bold">{formatPrice(total)}</span>
          </div>

          <button
            type="submit"
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            <MessageCircle size={20} />
            Commander sur WhatsApp
          </button>
        </form>
      </div>
    </div>
  );
};

export default CheckoutModal;

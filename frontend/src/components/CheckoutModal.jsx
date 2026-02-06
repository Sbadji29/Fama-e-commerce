import React, { useState } from 'react';
import { X, MessageCircle, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice, validatePhone } from '../utils/formatters';
import { generateWhatsAppURL } from '../utils/whatsapp';
import { API_URL } from '../utils/api';

const CheckoutModal = ({ isOpen, onClose }) => {
  const { cartItems, getTotal, clearCart } = useCart();
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    phone: '',
    address: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [whatsappUrl, setWhatsappUrl] = useState('');

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

  const SENEGAL_CITIES = [
    "Dakar", "Pikine", "Guédiawaye", "Rufisque", "Thiès", "Mbour", 
    "Saly", "Saint-Louis", "Kaolack", "Ziguinchor", "Diourbel", 
    "Louga", "Richard-Toll", "Tambacounda", "Touba", "Kolda", "Autre"
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      
      const url = generateWhatsAppURL(formData, cartItems, total);
      setWhatsappUrl(url);

      try {
        // Create order in backend
        const response = await fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                customer_name: formData.name,
                customer_phone: formData.phone,
                customer_city: formData.city,
                customer_address: formData.address,
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
        setIsSuccess(true);
        clearCart();
      } catch (err) {
        console.error("Backend error, falling back to offline mode:", err);
        // Fallback: Proceed to success even if backend fails (Offline order)
        setIsSuccess(true);
        clearCart();
      } finally {
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
            {isSuccess ? 'Commande enregistrée !' : 'Finaliser la commande'}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center space-y-6 animate-fade-in">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-green-100">
              <MessageCircle size={40} className="text-green-500" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-2xl font-display font-bold text-slate-900">Merci {formData.name} !</h3>
              <p className="text-slate-600">
                Votre commande a été enregistrée avec succès. 
                Veuillez cliquer sur le bouton ci-dessous pour l'envoyer sur WhatsApp et finaliser la livraison.
              </p>
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
              className="btn-primary w-full flex items-center justify-center gap-3 py-4 text-lg"
            >
              <MessageCircle size={24} />
              Envoyer sur WhatsApp
            </a>
            
            <button 
              onClick={onClose}
              className="text-sm text-slate-400 hover:text-slate-600 transition-colors"
            >
              Continuer mes achats
            </button>
          </div>
        ) : (
          /* Form */
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto custom-scrollbar">
            <div className="bg-primary-50 p-4 rounded-xl border border-primary-100 mb-6">
              <p className="text-sm text-primary-800 flex items-start gap-2">
                <MessageCircle size={18} className="shrink-0 mt-0.5" />
                La commande sera envoyée directement sur WhatsApp pour confirmation rapide.
              </p>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-black text-slate-500 mb-1 tracking-widest">
                Nom complet
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`input-field ${errors.name ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : ''}`}
                placeholder="Ex: Aminata Diallo"
                required
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.name}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-black text-slate-500 mb-1 tracking-widest">
                  Ville / Localité
                </label>
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className={`input-field appearance-none ${errors.city ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : ''}`}
                  required
                >
                  <option value="">Sélectionner</option>
                  {SENEGAL_CITIES.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
                {errors.city && (
                  <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.city}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-[10px] uppercase font-black text-slate-500 mb-1 tracking-widest">
                  Numéro WhatsApp
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`input-field ${errors.phone ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : ''}`}
                  placeholder="77 123 45 67"
                  required
                />
                {errors.phone && (
                  <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.phone}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-black text-slate-500 mb-1 tracking-widest">
                Adresse précise (Quartier, Rue, Porte...)
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows="2"
                className="input-field py-2"
                placeholder="Ex: Sacré-Cœur 3, près de la boulangerie..."
              />
            </div>

            <div className="py-4 border-t border-slate-100 flex items-center justify-between mt-6">
              <span className="text-slate-600 font-medium">Total à payer</span>
              <span className="text-2xl text-gradient font-bold">{formatPrice(total)}</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`btn-primary w-full flex items-center justify-center gap-2 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <MessageCircle size={20} />
                  Calculer & Commander
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default CheckoutModal;

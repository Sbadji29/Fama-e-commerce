export const formatPrice = (price) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0
  }).format(price).replace('XOF', 'CFA');
};

export const validatePhone = (phone) => {
  // Accepts formats like: 771234567, 77 123 45 67, +221 77...
  const phoneRegex = /^(?:(?:\+|00)221)?(7[05-8])\d{7}$/;
  const clean = phone.replace(/[\s-]/g, '');
  return phoneRegex.test(clean);
};

export const formatOrderSummary = (items) => {
  return items.map(item => `${item.quantity}x ${item.name}`).join(', ');
};

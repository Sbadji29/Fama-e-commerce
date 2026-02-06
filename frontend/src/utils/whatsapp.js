import { formatPrice } from './formatters';

// WhatsApp phone number - CHANGE THIS!
// Format: CountryCode + Number (e.g., 221770000000)
const WHATSAPP_PHONE = '221776804819'; 

// Format cart items into WhatsApp message
export const formatWhatsAppMessage = (customerInfo, cartItems, total) => {
  const { name, city, phone, address } = customerInfo;
  
  let message = `🛍️ *Nouvelle Commande - Fama Store*\n\n`;
  message += `👤 *Client:* ${name}\n`;
  message += `📍 *Ville:* ${city}\n`;
  if (address) {
    message += `🏠 *Adresse:* ${address}\n`;
  }
  message += `📞 *WhatsApp:* ${phone}\n\n`;
  message += `📦 *Produits:*\n`;
  
  cartItems.forEach((item, index) => {
    message += `${index + 1}. ${item.name}`;
    if (item.color?.color_name) message += ` (Couleur: ${item.color.color_name})`;
    if (item.size) message += ` (Taille: ${item.size})`;
    message += `\n   Qté: ${item.quantity} x ${formatPrice(item.price)}\n`;
  });
  
  message += `\n💰 *TOTAL: ${formatPrice(total)}*`;

  return message;
};

// Generate WhatsApp URL
export const generateWhatsAppURL = (customerInfo, cartItems, total) => {
  const message = formatWhatsAppMessage(customerInfo, cartItems, total);
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodedMessage}`;
};

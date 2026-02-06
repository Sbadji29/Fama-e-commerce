import React from 'react';
import { MessageCircle } from 'lucide-react';

const WhatsAppButton = ({ phoneNumber = "+221770000000", message = "Bonjour MissUniverse, j'ai une question !" }) => {
  const whatsappUrl = `https://wa.me/${phoneNumber.replace('+', '')}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 group"
      aria-label="Contactez-nous sur WhatsApp"
    >
      <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-25 group-hover:animate-none"></div>
      <div className="relative flex items-center justify-center w-16 h-16 bg-green-500 text-white rounded-full shadow-2xl shadow-green-500/50 hover:scale-110 active:scale-95 transition-all duration-300">
        <MessageCircle size={32} />
      </div>
      
      {/* Label Tooltip (Desktop Only) */}
      <div className="absolute right-20 top-1/2 -translate-y-1/2 bg-white text-slate-800 px-4 py-2 rounded-xl shadow-xl border border-slate-100 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap hidden lg:block">
        Des questions ? Écrivez-nous !
      </div>
    </a>
  );
};

export default WhatsAppButton;

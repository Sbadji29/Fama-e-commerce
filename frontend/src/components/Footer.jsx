import React from 'react';
import { Instagram, Facebook, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white/80 backdrop-blur-md border-t border-slate-200 pt-16 pb-8 mt-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand Info */}
          <div>
            <h3 className="text-2xl font-display font-bold text-gradient mb-4">
              MissUniverse
            </h3>
            <p className="text-slate-600 mb-6 leading-relaxed">
              Votre destination mode chic et moderne au Sénégal. Des collections uniques pour sublimer votre quotidien.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-slate-100 text-slate-600 rounded-full hover:bg-primary-500 hover:text-white transition-all duration-300">
                <Instagram size={20} />
              </a>
              <a href="#" className="p-2 bg-slate-100 text-slate-600 rounded-full hover:bg-primary-500 hover:text-white transition-all duration-300">
                <Facebook size={20} />
              </a>
            </div>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="font-display font-bold text-slate-800 mb-6 uppercase tracking-wider text-sm">
              Contact & Support
            </h4>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-slate-600">
                <div className="p-2 bg-primary-100 text-primary-600 rounded-lg">
                  <Phone size={18} />
                </div>
                <span>+221 77 000 00 00</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600">
                <div className="p-2 bg-pink-100 text-pink-600 rounded-lg">
                  <Mail size={18} />
                </div>
                <span>contact@missuniverse.sn</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600">
                <div className="p-2 bg-secondary-100 text-secondary-600 rounded-lg">
                  <MapPin size={18} />
                </div>
                <span>Dakar, Sénégal</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-bold text-slate-800 mb-6 uppercase tracking-wider text-sm">
              Informations
            </h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-slate-600 hover:text-primary-600 transition-colors">Livraison & Retours</a></li>
              <li><a href="#" className="text-slate-600 hover:text-primary-600 transition-colors">Guide des tailles</a></li>
              <li><a href="#" className="text-slate-600 hover:text-primary-600 transition-colors">Mentions légales</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-8 text-center text-slate-500 text-sm">
          <p>© {new Date().getFullYear()} MissUniverse - Fama E-commerce. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

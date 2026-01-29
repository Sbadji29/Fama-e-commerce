import React from 'react';
import { ShoppingBag } from 'lucide-react';

const Orders = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-display font-bold text-slate-900">Commandes</h1>
        <p className="text-slate-500">Suivi des commandes (Fonctionnalité à venir)</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center">
        <div className="w-24 h-24 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingBag size={48} className="text-primary-300" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Gestion des commandes</h2>
        <p className="text-slate-500 max-w-md mx-auto">
          Cette section sera connectée à WhatsApp ou à une base de données dans une future mise à jour pour suivre le statut de vos commandes.
        </p>
      </div>
    </div>
  );
};

export default Orders;

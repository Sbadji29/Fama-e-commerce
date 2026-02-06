import React from 'react';
import { useOrders } from '../../context/OrderContext';
import { ShoppingBag } from 'lucide-react';

const Orders = () => {
  const { orders, loading, updateOrderStatus } = useOrders();

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-slate-900">Commandes</h1>
          <p className="text-slate-500">Gérer et valider les commandes clients</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-sm font-medium text-slate-500">Total: </span>
          <span className="text-sm font-bold text-slate-900">{orders.length}</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-slate-500 border-b border-slate-100 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-bold">Commande</th>
                <th className="px-6 py-4 font-bold">Client & Contact</th>
                <th className="px-6 py-4 font-bold">Destination</th>
                <th className="px-6 py-4 font-bold">Montant</th>
                <th className="px-6 py-4 font-bold text-center">Statut Actuel</th>
                <th className="px-6 py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
               {orders.length === 0 ? (
                 <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-slate-400 italic">
                        <ShoppingBag className="mx-auto mb-2 opacity-20" size={40} />
                        Aucune commande pour le moment
                    </td>
                 </tr>
               ) : (
                orders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">#{order.id}</div>
                      <div className="text-[10px] text-slate-400">
                        {new Date(order.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                        <div className="font-semibold text-slate-800">{order.customer_name}</div>
                        <div className="text-xs text-primary-600 font-medium">{order.customer_phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-slate-800">{order.customer_city}</div>
                      {order.customer_address && (
                        <div className="text-[10px] text-slate-500 leading-tight mt-1 max-w-[150px]">
                          {order.customer_address}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-black text-slate-900 whitespace-nowrap">
                        {order.total_amount?.toLocaleString()} CFA
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                       <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                          order.status === 'validated' 
                            ? 'bg-green-100 text-green-700' 
                            : order.status === 'cancelled' 
                              ? 'bg-red-100 text-red-700' 
                              : 'bg-amber-100 text-amber-700'
                       }`}>
                          {order.status === 'validated' ? 'Payé / Validé' : order.status === 'cancelled' ? 'Annulé' : 'En Attente'}
                       </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                        <select
                            value={order.status || 'pending'}
                            onChange={(e) => {
                                if (window.confirm(`Changer le statut en "${e.target.value}" ?`)) {
                                    updateOrderStatus(order.id, e.target.value);
                                }
                            }}
                            className="text-xs font-bold bg-slate-100 border-none rounded-lg px-2 py-1.5 focus:ring-2 focus:ring-primary-500 cursor-pointer hover:bg-slate-200 transition-colors"
                        >
                            <option value="pending text-amber-600">En attente</option>
                            <option value="validated text-green-600">Valider</option>
                            <option value="cancelled text-red-600">Annuler</option>
                        </select>
                    </td>
                    </tr>
                ))
               )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Orders;


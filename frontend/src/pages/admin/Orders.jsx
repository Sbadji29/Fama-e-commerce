import React from 'react';
import { useOrders } from '../../context/OrderContext';
import { ShoppingBag } from 'lucide-react';

const Orders = () => {
  const { orders, loading, updateOrderStatus } = useOrders();

  if (loading) return <div>Chargement...</div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-display font-bold text-slate-900">Commandes</h1>
        <p className="text-slate-500">Suivi des commandes</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 font-medium">N°</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Client</th>
                <th className="px-6 py-4 font-medium">Ville</th>
                <th className="px-6 py-4 font-medium">Total</th>
                <th className="px-6 py-4 font-medium">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
               {orders.length === 0 ? (
                 <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-slate-500">
                        Aucune commande trouvée.
                    </td>
                 </tr>
               ) : (
                orders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">#{order.id}</td>
                    <td className="px-6 py-4 text-slate-500">{new Date(order.created_at).toLocaleDateString()} {new Date(order.created_at).toLocaleTimeString()}</td>
                    <td className="px-6 py-4 text-slate-600">
                        <div className="font-medium text-slate-900">{order.customer_name}</div>
                        <div className="text-xs">{order.customer_phone}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{order.customer_city}</td>
                    <td className="px-6 py-4 font-medium text-slate-900">{order.total_amount} CFA</td>
                    <td className="px-6 py-4">
                        <select
                            value={order.status || 'pending'}
                            onChange={(e) => {
                                if (window.confirm(`Changer le statut en "${e.target.value}" ?`)) {
                                    updateOrderStatus(order.id, e.target.value);
                                }
                            }}
                            className={`px-2.5 py-1 rounded-full text-xs font-medium border-0 cursor-pointer focus:ring-2 focus:ring-primary-500 ${
                                (order.status === 'validated' || order.status === 'Livré')
                                    ? 'bg-green-100 text-green-800'
                                    : order.status === 'cancelled' 
                                        ? 'bg-red-100 text-red-800' 
                                        : 'bg-yellow-100 text-yellow-800'
                            }`}
                        >
                            <option value="pending">En attente</option>
                            <option value="validated">Validé</option>
                            <option value="cancelled">Annulé</option>
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

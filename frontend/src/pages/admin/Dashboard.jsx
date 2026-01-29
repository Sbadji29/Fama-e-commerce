import React from 'react';
import { DollarSign, Package, ShoppingBag, TrendingUp } from 'lucide-react';
import StatsCard from '../../components/admin/StatsCard';
import { products } from '../../data/products';

const Dashboard = () => {
  // Mock data calculations
  const totalProducts = products.length;
  // Simulating valid currency format for total revenue
  const totalRevenue = new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0
  }).format(1250000).replace('XOF', 'CFA');

  const recentOrders = [
    { id: '#CMD001', customer: 'Aminata Diallo', date: '26 Jan 2026', total: '25 000 CFA', status: 'En attente' },
    { id: '#CMD002', customer: 'Moussa Diop', date: '25 Jan 2026', total: '15 000 CFA', status: 'Livré' },
    { id: '#CMD003', customer: 'Fatou Sow', date: '25 Jan 2026', total: '45 000 CFA', status: 'Livré' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-display font-bold text-slate-900">Tableau de bord</h1>
        <p className="text-slate-500">Aperçu de votre activité</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="Chiffre d'affaires" 
          value={totalRevenue} 
          icon={DollarSign} 
          trend={12} 
          color="green"
        />
        <StatsCard 
          title="Commandes" 
          value="156" 
          icon={ShoppingBag} 
          trend={8} 
          color="primary"
        />
        <StatsCard 
          title="Produits" 
          value={totalProducts} 
          icon={Package} 
          trend={0} 
          color="orange"
        />
        <StatsCard 
          title="Visites" 
          value="1,245" 
          icon={TrendingUp} 
          trend={24} 
          color="secondary"
        />
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-slate-900">Commandes récentes</h2>
          <button className="text-primary-600 text-sm font-medium hover:underline">Voir tout</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-6 py-4 font-medium">N° Commande</th>
                <th className="px-6 py-4 font-medium">Client</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Total</th>
                <th className="px-6 py-4 font-medium">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">{order.id}</td>
                  <td className="px-6 py-4 text-slate-600">{order.customer}</td>
                  <td className="px-6 py-4 text-slate-500">{order.date}</td>
                  <td className="px-6 py-4 font-medium text-slate-900">{order.total}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      order.status === 'Livré' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

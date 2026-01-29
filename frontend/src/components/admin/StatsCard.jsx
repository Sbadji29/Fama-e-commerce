import React from 'react';

const StatsCard = ({ title, value, icon: Icon, trend, color = "primary" }) => {
  const colorStyles = {
    primary: "bg-primary-50 text-primary-600",
    secondary: "bg-secondary-50 text-secondary-600",
    green: "bg-green-50 text-green-600",
    orange: "bg-orange-50 text-orange-600"
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${colorStyles[color]}`}>
          <Icon size={24} />
        </div>
        {trend && (
          <span className={`text-sm font-medium ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <h3 className="text-slate-500 text-sm font-medium mb-1">{title}</h3>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
};

export default StatsCard;

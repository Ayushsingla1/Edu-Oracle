import React from 'react';

function StatCard({ icon: Icon, title, value, className = '' }) {
  return (
    <div className={`bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700/50 ${className}`}>
      <div className="flex items-center gap-4">
        <div className="p-3 bg-emerald-500/10 rounded-xl">
          <Icon className="w-6 h-6 text-emerald-400" />
        </div>
        <div>
          <p className="text-gray-400 text-sm font-medium">{title}</p>
          <p className="text-white text-xl font-semibold mt-1">{value}</p>
        </div>
      </div>
    </div>
  );
}


export default StatCard;






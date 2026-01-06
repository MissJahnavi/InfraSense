import React from 'react';
import { Clock, TrendingUp, CheckCircle } from 'lucide-react';

const StatusBadge = ({ status }) => {
  const config = {
    open: { icon: Clock, color: 'bg-gray-100 text-gray-700 border-gray-300', label: 'Pending' },
    'in-progress': { icon: TrendingUp, color: 'bg-blue-100 text-blue-700 border-blue-300', label: 'In Progress' },
    resolved: { icon: CheckCircle, color: 'bg-green-100 text-green-700 border-green-300', label: 'Resolved' }
  };
  
  const { icon: Icon, color, label } = config[status] || config.open;
  
  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${color}`}>
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
};

export default StatusBadge;
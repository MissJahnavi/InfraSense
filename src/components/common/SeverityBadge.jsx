import React from 'react';

const SeverityBadge = ({ severity }) => {
  const colors = {
    low: 'bg-green-100 text-green-700 border-green-300',
    medium: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    high: 'bg-red-100 text-red-700 border-red-300'
  };
  
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${colors[severity] || colors.medium}`}>
      {severity.charAt(0).toUpperCase() + severity.slice(1)}
    </span>
  );
};

export default SeverityBadge;
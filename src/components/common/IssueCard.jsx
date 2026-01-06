import React from 'react';
import { MapPin } from 'lucide-react';
import SeverityBadge from './SeverityBadge';
import StatusBadge from './StatusBadge';

const IssueCard = ({ issue, onView }) => (
  <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
    <div className="flex justify-between items-start mb-4">
      <h3 className="text-lg font-semibold text-gray-800">{issue.title}</h3>
      <SeverityBadge severity={issue.severity} />
    </div>
    
    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{issue.description}</p>
    
    <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
      <MapPin className="w-4 h-4" />
      <span>{issue.address}</span>
    </div>
    
    <div className="flex justify-between items-center">
      <StatusBadge status={issue.status} />
      <button
        onClick={onView}
        className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg font-medium text-sm transition-colors"
      >
        View Details
      </button>
    </div>
  </div>
);

export default IssueCard;
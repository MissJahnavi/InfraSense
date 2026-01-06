import React, { useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { MapPin, Calendar, AlertCircle } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
// import { SeverityBadge, StatusBadge } from './index';
import {SeverityBadge, StatusBadge} from "../index"
// Custom marker icons based on severity
const createCustomIcon = (severity) => {
  const colors = {
    low: '#10b981',
    medium: '#f59e0b',
    high: '#ef4444'
  };
  
  const color = colors[severity] || colors.medium;
  
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 32px;
        height: 32px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          width: 10px;
          height: 10px;
          background-color: white;
          border-radius: 50%;
          transform: rotate(45deg);
        "></div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });
};

const IssuesMap = ({ issues, onIssueClick, center, zoom = 13 }) => {
  const mapRef = useRef(null);
  
  // Default center (Bhopal, India)
  const defaultCenter = center || {
    lat: 23.2599,
    lng: 77.4126
  };

  // Calculate map center based on issues if available
  const mapCenter = issues.length > 0 && !center
    ? {
        lat: issues.reduce((sum, issue) => sum + issue.location.lat, 0) / issues.length,
        lng: issues.reduce((sum, issue) => sum + issue.location.lng, 0) / issues.length
      }
    : defaultCenter;

  return (
    <div className="w-full h-full rounded-lg overflow-hidden border-2 border-gray-300 shadow-md">
      <MapContainer
        center={[mapCenter.lat, mapCenter.lng]}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {issues.map((issue) => (
          <Marker
            key={issue.id}
            position={[issue.location.lat, issue.location.lng]}
            icon={createCustomIcon(issue.severity)}
          >
            <Popup maxWidth={300} className="custom-popup">
              <div className="p-2">
                <h3 className="font-bold text-gray-800 mb-2 text-base">{issue.title}</h3>
                
                <div className="flex gap-2 mb-3">
                  <SeverityBadge severity={issue.severity} />
                  <StatusBadge status={issue.status} />
                </div>
                
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {issue.description}
                </p>
                
                <div className="space-y-2 text-xs text-gray-500 mb-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3 h-3" />
                    <span>{issue.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(issue.createdAt).toLocaleDateString()}</span>
                  </div>
                  {issue.aiConfidence > 0 && (
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-3 h-3" />
                      <span>AI Confidence: {Math.round(issue.aiConfidence * 100)}%</span>
                    </div>
                  )}
                </div>
                
                {onIssueClick && (
                  <button
                    onClick={() => onIssueClick(issue.id)}
                    className="w-full px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                  >
                    View Details
                  </button>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default IssuesMap;
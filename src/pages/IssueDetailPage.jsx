import React, { useState, useEffect } from "react";
import { Camera, MapPin } from "lucide-react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { SeverityBadge, StatusBadge, LoadingSpinner } from "../components";
import { API_BASE_URL } from "../config/api";
import "leaflet/dist/leaflet.css";

const IssueDetailPage = ({ issueId, onBack }) => {
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchIssueDetails();
  }, [issueId]);

  const fetchIssueDetails = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/issues`);
      const allIssues = await response.json();
      const foundIssue = allIssues.find((i) => i.id === issueId);
      setIssue(foundIssue || null);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching issue details:", error);
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!issue)
    return <div className="p-8 text-center text-gray-500">Issue not found</div>;

  return (
    <div className="p-8 max-w-4xl">
      <button
        onClick={onBack}
        className="mb-6 text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
      >
        ← Back to My Issues
      </button>

      <div className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden">
        {issue.imageUrl ? (
          <div className="h-96 bg-gray-200 overflow-hidden">
            <img
              src={`${API_BASE_URL.replace("/api", "")}${issue.imageUrl}`}
              alt={issue.title}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="h-64 bg-gray-200 flex items-center justify-center">
            <Camera className="w-16 h-16 text-gray-400" />
          </div>
        )}

        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-3xl font-bold text-gray-800">{issue.title}</h2>
            <div className="flex gap-3">
              <SeverityBadge severity={issue.severity} />
              <StatusBadge status={issue.status} />
            </div>
          </div>

          {issue.aiConfidence > 0 && (
            <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <p className="text-sm text-purple-800">
                <span className="font-semibold">AI Analysis:</span> Severity
                predicted with {Math.round(issue.aiConfidence * 100)}%
                confidence
              </p>
            </div>
          )}

          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
              Description
            </h3>
            <p className="text-gray-700 leading-relaxed">{issue.description}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                Reported On
              </h3>
              <p className="text-gray-700">
                {new Date(issue.createdAt).toLocaleString()}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                Last Updated
              </h3>
              <p className="text-gray-700">
                {new Date(issue.updatedAt).toLocaleString()}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
              Location
            </h3>
            <div className="flex items-center gap-2 text-gray-700 mb-2">
              <MapPin className="w-5 h-5 text-gray-400" />
              <span>{issue.address}</span>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Coordinates: {issue.location.lat}, {issue.location.lng}
            </p>

            {/* Leaflet Map */}
            <div className="h-64 rounded-lg overflow-hidden border-2 border-gray-300 shadow-md">
              <MapContainer
                center={[issue.location.lat, issue.location.lng]}
                zoom={16}
                style={{ height: "100%", width: "100%" }}
                scrollWheelZoom={false}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[issue.location.lat, issue.location.lng]} />
              </MapContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueDetailPage;

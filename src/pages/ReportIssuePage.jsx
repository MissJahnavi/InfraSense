import React, { useState } from 'react';
import { Camera, Loader } from 'lucide-react';
import { useAuth } from '@clerk/clerk-react';
import { API_BASE_URL } from '../config/api';
import { LocationPicker } from '../components';  // ← Only LocationPicker now

const ReportIssuePage = ({ userId, onSuccess }) => {
  const { getToken } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    latitude: '',
    longitude: '',
    address: '',
    image: null
  });
  const [submitting, setSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({...formData, image: file});
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleLocationSelect = (locationData) => {
    setFormData({
      ...formData,
      latitude: locationData.latitude.toString(),
      longitude: locationData.longitude.toString(),
      address: locationData.address
    });
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.description || !formData.latitude || !formData.longitude) {
      alert('Please fill in all required fields and select a location on the map');
      return;
    }

    setSubmitting(true);

    try {
      const token = await getToken();

      const formDataObj = new FormData();
      formDataObj.append('title', formData.title);
      formDataObj.append('description', formData.description);
      formDataObj.append('latitude', formData.latitude);
      formDataObj.append('longitude', formData.longitude);
      formDataObj.append('address', formData.address || `${formData.latitude}, ${formData.longitude}`);

      if (formData.image) {
        formDataObj.append('image', formData.image);
      }

      const response = await fetch(`${API_BASE_URL}/issues`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataObj
      });

      if (response.ok) {
        const result = await response.json();
        alert(`✅ Issue reported successfully!\n\n🤖 AI Predicted Severity: ${result.severity.toUpperCase()}\n📊 %\n📍 Location: ${formData.address}`);

        setFormData({
          title: '',
          description: '',
          latitude: '',
          longitude: '',
          address: '',
          image: null
        });
        setPreviewUrl(null);

        if (onSuccess) onSuccess();
      } else {
        const error = await response.json();
        alert(`❌ Error: ${error.error || 'Failed to submit issue'}`);
      }
    } catch (error) {
      console.error('Error submitting issue:', error);
      alert('❌ Failed to submit issue. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Report New Issue</h2>

      <div className="bg-white rounded-lg shadow-md p-8 border border-gray-100 space-y-6">
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Issue Title*</label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., Large pothole on Main Street"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">Description*</label>
          <textarea
            required
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Provide detailed description. This helps AI predict severity more accurately..."
          />
          <p className="text-xs text-gray-500 mt-1">
            💡 Tip: Mention size, severity, duration, and impact for better AI analysis
          </p>
        </div>

        {/* Location Picker - Now using Leaflet */}
        <LocationPicker
          onLocationSelect={handleLocationSelect}
          initialLocation={
            formData.latitude && formData.longitude
              ? { lat: parseFloat(formData.latitude), lng: parseFloat(formData.longitude) }
              : null
          }
        />

        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Upload Image (Enhances AI Analysis)
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
            {previewUrl ? (
              <div className="relative">
                <img src={previewUrl} alt="Preview" className="max-h-64 mx-auto rounded-lg shadow-md" />
                <button
                  type="button"
                  onClick={() => {
                    setFormData({...formData, image: null});
                    setPreviewUrl(null);
                  }}
                  className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Remove Image
                </button>
              </div>
            ) : (
              <div>
                <Camera className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <span className="text-blue-600 font-medium hover:underline">Click to upload</span>
                  <span className="text-gray-500"> or drag and drop</span>
                  <p className="text-sm text-gray-400 mt-1">PNG, JPG up to 5MB</p>
                </label>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={submitting || !formData.latitude || !formData.longitude}
          className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {submitting ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              Submitting & Analyzing with AI...
            </>
          ) : (
            '📤 Submit Issue Report'
          )}
        </button>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <p className="text-sm text-purple-800 flex items-center gap-2">
            <span className="text-lg">🤖</span>
            <span>
              Our AI will automatically analyze your issue description and image to predict severity level with confidence scores!
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReportIssuePage;
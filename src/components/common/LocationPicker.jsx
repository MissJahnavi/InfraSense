import React, { useState, useCallback, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { MapPin, Loader, Navigation, Search, X } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const defaultCenter = {
  lat: 23.2599, // Bhopal, India
  lng: 77.4126
};

// Component to handle map clicks
const MapClickHandler = ({ onLocationSelect }) => {
  useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng;
      onLocationSelect({ lat, lng });
    },
  });
  return null;
};

// Component to update map view when location changes
const MapViewController = ({ center, zoom }) => {
  const map = useMapEvents({});
  
  useEffect(() => {
    if (center) {
      map.setView([center.lat, center.lng], zoom || map.getZoom());
    }
  }, [center, zoom, map]);
  
  return null;
};

const LocationPicker = ({ onLocationSelect, initialLocation }) => {
  const [markerPosition, setMarkerPosition] = useState(initialLocation || null);
  const [mapCenter, setMapCenter] = useState(initialLocation || defaultCenter);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  
  // Search functionality
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [searchError, setSearchError] = useState('');
  const searchTimeoutRef = useRef(null);

  // Reverse geocode using Nominatim (OpenStreetMap)
  const getAddressFromCoordinates = async (lat, lng) => {
    try {
      setLoading(true);
      setSearchError('');
      
      // Using fetch with proper error handling
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.display_name) {
        setAddress(data.display_name);
        return data.display_name;
      }
      return '';
    } catch (error) {
      console.error('Error getting address:', error);
      setSearchError('Unable to fetch address. Please try again.');
      return '';
    } finally {
      setLoading(false);
    }
  };

  // Forward geocode - Search for location by text
  const searchLocation = async (query) => {
    if (!query.trim() || query.length < 3) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setSearching(true);
    setSearchError('');
    
    try {
      // Add delay to respect Nominatim rate limits
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.length === 0) {
        setSearchError('No locations found. Try different keywords.');
        setSearchResults([]);
        setShowResults(false);
      } else {
        setSearchResults(data);
        setShowResults(true);
        setSearchError('');
      }
    } catch (error) {
      console.error('Error searching location:', error);
      setSearchError('Search failed. Please try again or click on the map.');
      setSearchResults([]);
      setShowResults(false);
    } finally {
      setSearching(false);
    }
  };

  // Debounced search
  const handleSearchInput = (value) => {
    setSearchQuery(value);
    setSearchError('');
    
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // Clear results if query is too short
    if (value.length < 3) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }
    
    // Set new timeout for search
    searchTimeoutRef.current = setTimeout(() => {
      searchLocation(value);
    }, 1500); // Increased to 1.5 seconds to respect rate limits
  };

  // Handle search result selection
  const handleSelectSearchResult = async (result) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    
    // Update marker and map
    setMarkerPosition({ lat, lng });
    setMapCenter({ lat, lng });
    setAddress(result.display_name);
    setSearchQuery(result.display_name);
    setShowResults(false);
    setSearchResults([]);
    setSearchError('');
    
    // Notify parent component
    onLocationSelect({
      latitude: lat,
      longitude: lng,
      address: result.display_name
    });
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setShowResults(false);
    setSearchError('');
  };

  // Handle location selection (from map click)
  const handleLocationSelect = async ({ lat, lng }) => {
    setMarkerPosition({ lat, lng });
    setMapCenter({ lat, lng });
    
    const fetchedAddress = await getAddressFromCoordinates(lat, lng);
    
    // Update search input with fetched address
    setSearchQuery(fetchedAddress);
    
    // Send location data to parent component
    onLocationSelect({
      latitude: lat,
      longitude: lng,
      address: fetchedAddress
    });
  };

  // Get user's current location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setGettingLocation(true);
    setSearchError('');
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        
        await handleLocationSelect({ lat, lng });
        setGettingLocation(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        setSearchError('Unable to get your location. Please select manually on the map or type your location.');
        setGettingLocation(false);
      }
    );
  };

  // Initialize with current location if no initial location
  useEffect(() => {
    if (!initialLocation) {
      getCurrentLocation();
    } else {
      // If initial location provided, get its address
      getAddressFromCoordinates(initialLocation.lat, initialLocation.lng);
    }
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-gray-700 font-semibold">
          Location* (Click on map, use current location, or search)
        </label>
        <button
          type="button"
          onClick={getCurrentLocation}
          disabled={gettingLocation}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 text-sm"
        >
          {gettingLocation ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              Getting Location...
            </>
          ) : (
            <>
              <Navigation className="w-4 h-4" />
              Use My Location
            </>
          )}
        </button>
      </div>

      {/* Text Search Input */}
      <div className="relative">
        <label className="block text-gray-600 text-sm mb-2">
          Can't find your location on the map? Type it here:
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchInput(e.target.value)}
            onFocus={() => {
              if (searchResults.length > 0) setShowResults(true);
            }}
            placeholder="Type address, area, or landmark (min 3 characters)..."
            className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {searchQuery && !searching && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          )}
          {searching && (
            <Loader className="absolute right-3 top-3.5 text-blue-600 w-5 h-5 animate-spin" />
          )}
        </div>

        {/* Search Error Message */}
        {searchError && (
          <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">{searchError}</p>
          </div>
        )}

        {/* Search Results Dropdown */}
        {showResults && searchResults.length > 0 && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {searchResults.map((result, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSelectSearchResult(result)}
                className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0"
              >
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {result.display_name}
                    </p>
                    {result.type && (
                      <p className="text-xs text-gray-500 mt-0.5">
                        {result.type.charAt(0).toUpperCase() + result.type.slice(1)}
                      </p>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Map */}
      <div className="border-2 border-gray-300 rounded-lg overflow-hidden shadow-md" style={{ height: '400px' }}>
        <MapContainer
          center={[mapCenter.lat, mapCenter.lng]}
          zoom={15}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapClickHandler onLocationSelect={handleLocationSelect} />
          <MapViewController center={mapCenter} zoom={markerPosition ? 15 : undefined} />
          {markerPosition && (
            <Marker position={[markerPosition.lat, markerPosition.lng]} />
          )}
        </MapContainer>
      </div>

      {/* Selected Location Display */}
      {markerPosition && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-700 mb-1">Selected Location:</p>
              {loading ? (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Loader className="w-4 h-4 animate-spin" />
                  Loading address...
                </div>
              ) : (
                <>
                  <p className="text-sm text-gray-600 mb-2">{address || 'Address not found'}</p>
                  <p className="text-xs text-gray-500">
                    Coordinates: {markerPosition.lat.toFixed(6)}, {markerPosition.lng.toFixed(6)}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
        <p className="text-xs text-gray-600 flex items-start gap-2">
          <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>
            <strong>Three ways to select location:</strong>
            <br />
            1. Click anywhere on the map
            <br />
            2. Click "Use My Location" button
            <br />
            3. Type and search (wait 1.5 seconds after typing for results)
            <br />
            <em className="text-gray-500">Note: Search respects Nominatim rate limits (1 request per second)</em>
          </span>
        </p>
      </div>
    </div>
  );
};

export default LocationPicker;
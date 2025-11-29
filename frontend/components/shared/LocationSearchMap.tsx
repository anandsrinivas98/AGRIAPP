'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPinIcon, MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface LocationSearchMapProps {
  onLocationSelect: (locationData: any) => void;
  initialLocation?: string;
}

export default function LocationSearchMap({ onLocationSelect, initialLocation }: LocationSearchMapProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [mapView, setMapView] = useState<'roadmap' | 'satellite'>('satellite');
  const mapRef = useRef<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Search locations using Nominatim
  const searchLocation = async (query: string) => {
    if (!query || query.length < 3) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&countrycodes=in`
      );
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Failed to search location');
    }
  };

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) {
        searchLocation(searchQuery);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Initialize map when selectedLocation changes
  useEffect(() => {
    if (selectedLocation && typeof window !== 'undefined') {
      const lat = parseFloat(selectedLocation.latitude);
      const lon = parseFloat(selectedLocation.longitude);
      
      console.log('Selected location changed:', selectedLocation);
      
      // Wait for DOM to be ready and animation to complete
      const timer = setTimeout(() => {
        const mapElement = document.getElementById('location-map');
        console.log('Map element found:', !!mapElement);
        console.log('Map ref exists:', !!mapRef.current);
        
        if (mapElement) {
          if (mapRef.current) {
            console.log('Updating existing map center');
            updateMapCenter(lat, lon);
          } else {
            console.log('Initializing new map');
            initializeMap(lat, lon);
          }
        } else {
          console.error('Map element #location-map not found in DOM');
        }
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [selectedLocation]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mapRef.current) {
        console.log('Cleaning up map on unmount');
        try {
          mapRef.current.remove();
          mapRef.current = null;
        } catch (e) {
          console.error('Error cleaning up map:', e);
        }
      }
    };
  }, []);

  // Removed separate weather API call - using unified backend API instead

  // Get location details using reverse geocoding with better accuracy
  const getLocationDetails = async (lat: number, lon: number) => {
    try {
      // Use higher zoom level for more precise location
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=14&addressdetails=1`
      );
      const data = await response.json();
      
      // Try to get more specific location details
      if (data.address) {
        // Prefer town/village over city for rural areas
        const locationName = data.address.town || 
                            data.address.village || 
                            data.address.suburb ||
                            data.address.city ||
                            data.address.county ||
                            'Unknown Location';
        
        // Create a more detailed location object
        const detailedLocation = {
          ...data,
          display_name: `${locationName}, ${data.address.state || data.address.country || 'India'}`,
          address: {
            ...data.address,
            city: locationName, // Override city with more specific location
            town: data.address.town || data.address.village || locationName
          }
        };
        
        return detailedLocation;
      }
      
      return data;
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return null;
    }
  };

  const handleLocationSelect = async (location: any) => {
    setLoading(true);
    setSearchResults([]);
    setSearchQuery('');

    const lat = parseFloat(location.lat);
    const lon = parseFloat(location.lon);

    // Prioritize more specific location names
    const specificLocation = location.address?.town || 
                            location.address?.village || 
                            location.address?.suburb ||
                            location.address?.city || 
                            'Unknown';
    
    const locationData = {
      latitude: lat.toFixed(6),
      longitude: lon.toFixed(6),
      city: specificLocation,
      state: location.address?.state || 'Unknown',
      country: location.address?.country || 'India',
      formatted: location.display_name,
      // Add more detailed address info
      fullAddress: {
        town: location.address?.town,
        village: location.address?.village,
        suburb: location.address?.suburb,
        city: location.address?.city,
        district: location.address?.county || location.address?.state_district,
        state: location.address?.state,
        postcode: location.address?.postcode
      }
    };

    setSelectedLocation(locationData);
    onLocationSelect(locationData);

    setLoading(false);
    
    // Map will be initialized by useEffect
  };

  const getCurrentLocation = () => {
    setLoading(true);

    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by this browser. Please search manually.');
      setLoading(false);
      return;
    }

    // First try with network-based location (faster)
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        console.log('GPS Coordinates:', { latitude, longitude });
        
        // Get location details with better accuracy
        const locationDetails = await getLocationDetails(latitude, longitude);
        
        if (locationDetails) {
          console.log('Location Details:', locationDetails);
          await handleLocationSelect(locationDetails);
          
          // Show more specific success message
          const locationName = locationDetails.address?.town || 
                              locationDetails.address?.village || 
                              locationDetails.address?.city || 
                              'your location';
          toast.success(`📍 Location set to ${locationName}!`);
        } else {
          toast.error('Could not determine location details');
        }
      },
      (error) => {
        let errorMessage = 'Unable to get location';
        let suggestion = '';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied';
            suggestion = 'Please allow location access in your browser settings or search manually';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable';
            suggestion = 'GPS signal might be weak. Try searching for "Hosur, Tamil Nadu" manually';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out';
            suggestion = 'GPS is taking too long. Try searching manually or check your internet connection';
            break;
        }
        
        toast.error(`${errorMessage}. ${suggestion}`, {
          duration: 6000,
        });
        
        // Try high accuracy GPS as fallback
        if (error.code === error.POSITION_UNAVAILABLE || error.code === error.TIMEOUT) {
          console.log('Trying high accuracy GPS as fallback...');
          
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;
              console.log('High accuracy GPS success:', { latitude, longitude });
              
              const locationDetails = await getLocationDetails(latitude, longitude);
              if (locationDetails) {
                await handleLocationSelect(locationDetails);
                const locationName = locationDetails.address?.town || 
                                    locationDetails.address?.village || 
                                    locationDetails.address?.city || 
                                    'your location';
                toast.success(`📍 Location found: ${locationName}!`);
              }
            },
            (highAccuracyError) => {
              console.log('High accuracy GPS also failed:', highAccuracyError);
              // Auto-suggest Hosur for users in that area
              setTimeout(() => {
                toast('💡 Try searching for "Hosur" in the search box above', {
                  icon: '🔍',
                  duration: 4000,
                });
              }, 1000);
            },
            {
              enableHighAccuracy: true,
              timeout: 20000,
              maximumAge: 0
            }
          );
        } else {
          // For permission denied, just show the suggestion
          setTimeout(() => {
            toast('💡 You can search for your location manually', {
              icon: '🔍',
              duration: 4000,
            });
          }, 2000);
        }
        
        setLoading(false);
      },
      {
        enableHighAccuracy: false, // Try network location first (faster)
        timeout: 10000, // 10 second timeout
        maximumAge: 60000 // Allow cached location for 1 minute
      }
    );
  };

  const initializeMap = (lat: number, lon: number) => {
    if (typeof window === 'undefined') return;

    console.log('Initializing map at:', lat, lon);

    // Dynamically load Leaflet
    import('leaflet').then((L) => {
      // Remove existing map if any
      if (mapRef.current) {
        console.log('Removing existing map');
        try {
          mapRef.current.remove();
          mapRef.current = null;
        } catch (e) {
          console.error('Error removing map:', e);
        }
      }

      // Check if element exists
      const mapElement = document.getElementById('location-map');
      if (!mapElement) {
        console.error('Map element not found');
        return;
      }

      // Fix for default marker icon
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      });

      try {
        const map = L.map('location-map').setView([lat, lon], 13);

        // Add tile layer based on view type
        const tileLayer = mapView === 'satellite'
          ? L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
              attribution: 'Tiles &copy; Esri',
              maxZoom: 18
            })
          : L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              attribution: '&copy; OpenStreetMap contributors',
              maxZoom: 19
            });

        tileLayer.addTo(map);

        // Add marker
        const marker = L.marker([lat, lon]).addTo(map);
        marker.bindPopup('Selected Location').openPopup();

        mapRef.current = map;
        setMapLoaded(true);
        console.log('Map initialized successfully');
      } catch (err) {
        console.error('Error creating map:', err);
        toast.error('Failed to initialize map');
      }
    }).catch(err => {
      console.error('Failed to load Leaflet:', err);
      toast.error('Failed to load map library');
    });
  };

  const updateMapCenter = (lat: number, lon: number) => {
    if (mapRef.current) {
      mapRef.current.setView([lat, lon], 13);
      
      // Clear existing markers
      mapRef.current.eachLayer((layer: any) => {
        if (layer instanceof (window as any).L.Marker) {
          mapRef.current.removeLayer(layer);
        }
      });

      // Add new marker
      const L = (window as any).L;
      const marker = L.marker([lat, lon]).addTo(mapRef.current);
      marker.bindPopup('Selected Location').openPopup();
    }
  };

  const toggleMapView = () => {
    const newView = mapView === 'satellite' ? 'roadmap' : 'satellite';
    setMapView(newView);

    if (mapRef.current && typeof window !== 'undefined') {
      import('leaflet').then((L) => {
        // Remove old tile layer
        mapRef.current.eachLayer((layer: any) => {
          if (layer instanceof L.TileLayer) {
            mapRef.current.removeLayer(layer);
          }
        });

        // Add new tile layer
        const tileLayer = newView === 'satellite'
          ? L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
              attribution: 'Tiles &copy; Esri',
              maxZoom: 18
            })
          : L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              attribution: '&copy; OpenStreetMap contributors',
              maxZoom: 19
            });

        tileLayer.addTo(mapRef.current);
      }).catch(err => {
        console.error('Failed to toggle map view:', err);
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <div className="flex space-x-2">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for a location (city, district, state)..."
              className="w-full pl-10 pr-10 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSearchResults([]);
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                <XMarkIcon className="w-5 h-5 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
          <motion.button
            type="button"
            onClick={getCurrentLocation}
            disabled={loading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center space-x-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <MapPinIcon className="w-5 h-5" />
            )}
            <span className="hidden sm:inline">GPS</span>
          </motion.button>
        </div>

        {/* Search Results Dropdown */}
        <AnimatePresence>
          {searchResults.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-xl border-2 border-gray-200 max-h-64 overflow-y-auto"
            >
              {searchResults.map((result, index) => (
                <button
                  key={index}
                  onClick={() => handleLocationSelect(result)}
                  className="w-full px-4 py-3 text-left hover:bg-green-50 transition-colors border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-start space-x-3">
                    <MapPinIcon className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">{result.display_name}</p>
                      <p className="text-sm text-gray-600">
                        {result.type} • {result.addresstype}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Map Container */}
      {selectedLocation && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden"
        >
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h4 className="font-semibold text-gray-800">Location Map</h4>
            <button
              onClick={toggleMapView}
              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors"
            >
              {mapView === 'satellite' ? '🗺️ Road' : '🛰️ Satellite'}
            </button>
          </div>
          <div id="location-map" className="w-full h-80" style={{ minHeight: '320px' }} />
        </motion.div>
      )}


    </div>
  );
}

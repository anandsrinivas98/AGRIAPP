'use client';
import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface WeatherMapProps {
  location: { lat: number; lng: number } | null;
}

export default function WeatherMap({ location }: WeatherMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize map only once
    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current).setView([20, 0], 2);

      // Add OpenStreetMap tiles (free and open-source)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(mapRef.current);
    }

    // Update map when location changes
    if (location && mapRef.current) {
      const { lat, lng } = location;
      
      // Remove old marker if exists
      if (markerRef.current) {
        markerRef.current.remove();
      }

      // Create custom icon with pulsing animation
      const customIcon = L.divIcon({
        className: 'custom-marker',
        html: `
          <div style="position: relative;">
            <div style="
              position: absolute;
              background-color: rgba(22, 163, 74, 0.3);
              width: 50px;
              height: 50px;
              border-radius: 50%;
              top: -10px;
              left: -10px;
              animation: pulse 2s infinite;
            "></div>
            <div style="
              background-color: #16a34a;
              width: 30px;
              height: 30px;
              border-radius: 50%;
              border: 3px solid white;
              box-shadow: 0 2px 8px rgba(0,0,0,0.3);
              position: relative;
              z-index: 10;
            "></div>
          </div>
          <style>
            @keyframes pulse {
              0% {
                transform: scale(0.8);
                opacity: 1;
              }
              50% {
                transform: scale(1.2);
                opacity: 0.5;
              }
              100% {
                transform: scale(0.8);
                opacity: 1;
              }
            }
          </style>
        `,
        iconSize: [30, 30],
        iconAnchor: [15, 15],
      });

      // Add new marker
      markerRef.current = L.marker([lat, lng], { icon: customIcon })
        .addTo(mapRef.current)
        .bindPopup('<b>Your Farm Location</b><br>Weather data for this area')
        .openPopup();

      // Zoom to location with smooth animation
      // First zoom out a bit, then zoom in for dramatic effect
      mapRef.current.setView([lat, lng], 5, {
        animate: true,
        duration: 0.5,
      });

      setTimeout(() => {
        if (mapRef.current) {
          mapRef.current.setView([lat, lng], 13, {
            animate: true,
            duration: 1.5,
          });
        }
      }, 500);
    }

    return () => {
      // Cleanup on unmount
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [location]);

  return (
    <div 
      ref={mapContainerRef} 
      className="h-96 w-full rounded-xl overflow-hidden border-2 border-gray-300 shadow-inner"
      style={{ zIndex: 0 }}
    />
  );
}

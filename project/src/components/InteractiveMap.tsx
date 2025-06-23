import React, { useEffect, useRef } from 'react';
import { City } from '../types';

interface InteractiveMapProps {
  selectedCity: City | null;
  cities: City[];
  onCitySelect: (city: City) => void;
}

declare global {
  interface Window {
    L: any;
  }
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  selectedCity,
  cities,
  onCitySelect
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize map
    mapInstanceRef.current = window.L.map(mapRef.current).setView([48.8566, 2.3522], 2);

    // Add tile layer
    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(mapInstanceRef.current);

    // Add city markers
    cities.forEach((city) => {
      const marker = window.L.marker([city.latitude, city.longitude])
        .addTo(mapInstanceRef.current)
        .bindPopup(`
          <div class="p-2">
            <h3 class="font-semibold text-lg">${city.name}</h3>
            <p class="text-sm text-gray-600">${city.country}</p>
            <p class="text-xs text-gray-500 mt-1">${city.population.toLocaleString()} habitants</p>
          </div>
        `)
        .on('click', () => {
          onCitySelect(city);
        });

      markersRef.current.push({ marker, city });
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markersRef.current = [];
      }
    };
  }, [cities, onCitySelect]);

  useEffect(() => {
    if (!mapInstanceRef.current || !selectedCity) return;

    // Fly to selected city
    mapInstanceRef.current.flyTo([selectedCity.latitude, selectedCity.longitude], 10);

    // Update marker styles
    markersRef.current.forEach(({ marker, city }) => {
      if (city.id === selectedCity.id) {
        marker.openPopup();
      }
    });
  }, [selectedCity]);

  return (
    <div className="relative h-full bg-white rounded-2xl shadow-xl overflow-hidden">
      <div 
        ref={mapRef}
        className="w-full h-full"
        style={{ minHeight: '400px' }}
      />
      
      {/* Map overlay with gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-black/5 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/5 to-transparent"></div>
      </div>

      {/* Map controls overlay */}
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg">
        <div className="text-xs text-gray-600 font-medium">
          Cliquez sur une ville
        </div>
      </div>
    </div>
  );
};
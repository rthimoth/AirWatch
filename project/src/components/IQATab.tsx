import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Users, Filter, Wind, TrendingUp, TrendingDown, Minus, RefreshCw } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { City } from '../types';
import { useCitiesData } from '../hooks/useCitiesData';

declare global {
  interface Window {
    L: any;
  }
}

export const IQATab: React.FC = () => {
  const { cities: frenchCities, loading, error, refreshCities } = useCitiesData();
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  useEffect(() => {
    const checkLeaflet = () => {
      if (window.L) {
        setMapLoaded(true);
      } else {
        setTimeout(checkLeaflet, 100);
      }
    };
    checkLeaflet();
  }, []);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current || !mapLoaded) return;

    mapInstanceRef.current = window.L.map(mapRef.current).setView([46.603354, 1.888334], 6);

    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(mapInstanceRef.current);

    // Fonction pour obtenir la couleur du marqueur selon l'IQA
    const getMarkerColor = (aqi: number) => {
      if (aqi <= 50) return '#10B981'; // Vert
      if (aqi <= 100) return '#F59E0B'; // Jaune
      if (aqi <= 150) return '#EF4444'; // Orange
      if (aqi <= 200) return '#DC2626'; // Rouge
      return '#7C2D12'; // Marron
    };

    frenchCities.forEach((city) => {
      const color = getMarkerColor(city.airQuality.aqi);
      
      // Créer un marqueur coloré personnalisé
      const customIcon = window.L.divIcon({
        className: 'custom-marker',
        html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;">
                 <span style="color: white; font-size: 10px; font-weight: bold;">${city.airQuality.aqi}</span>
               </div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });

      const marker = window.L.marker([city.latitude, city.longitude], { icon: customIcon })
        .addTo(mapInstanceRef.current)
        .bindPopup(`
          <div class="p-3 min-w-[200px]">
            <h3 class="font-semibold text-lg text-gray-900">${city.name}</h3>
            <p class="text-sm text-gray-600 mb-2">${city.region}</p>
            <div class="flex items-center gap-2 mb-2">
              <div class="w-3 h-3 rounded-full" style="background-color: ${color}"></div>
              <span class="font-bold text-lg" style="color: ${color}">IQA ${city.airQuality.aqi}</span>
            </div>
            <p class="text-sm font-medium" style="color: ${color}">${city.airQuality.category}</p>
            <div class="mt-2 text-xs text-gray-500">
              <p>PM2.5: ${city.airQuality.pollutants.pm25} µg/m³</p>
              <p>PM10: ${city.airQuality.pollutants.pm10} µg/m³</p>
            </div>
          </div>
        `)
        .on('click', () => {
          setSelectedCity(city);
        });

      markersRef.current.push({ marker, city });
    });

    // Forcer le redimensionnement de la carte après un court délai
    setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    }, 100);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markersRef.current = [];
      }
    };
  }, [mapLoaded, frenchCities]);

  useEffect(() => {
    if (!mapInstanceRef.current || !selectedCity) return;
    mapInstanceRef.current.flyTo([selectedCity.latitude, selectedCity.longitude], 12);
  }, [selectedCity]);

  const filteredCities = frenchCities.filter(city =>
    city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    city.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
    city.department?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'worsening': return <TrendingDown className="w-4 h-4 text-red-600" />;
      default: return <Minus className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'improving': return 'text-green-600';
      case 'worsening': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  if (!mapLoaded) {
    return (
      <div className="p-6 flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de la carte...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Analyse IQA par Métropole</h2>
        <p className="text-gray-600">Surveillance en temps réel de la qualité de l'air dans les grandes villes françaises</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 h-[calc(100vh-12rem)]">
        {/* Liste des villes */}
        <div className="xl:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Wind className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-gray-900">Métropoles Françaises</h3>
                {loading && (
                  <div className="flex items-center gap-1 text-blue-600">
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    <span className="text-xs">API</span>
                  </div>
                )}
              </div>
              <button
                onClick={refreshCities}
                disabled={loading}
                className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
                title="Actualiser les données temps réel"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {error && (
              <div className="mb-3 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-xs text-yellow-800">
                  ⚠️ Erreur API - Données par défaut utilisées
                </p>
              </div>
            )}

            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Rechercher une ville..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex-1 overflow-y-auto space-y-2">
              {filteredCities.map((city) => (
                <div
                  key={city.id}
                  onClick={() => setSelectedCity(city)}
                  className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                    selectedCity?.id === city.id
                      ? 'bg-blue-50 border border-blue-200'
                      : 'bg-gray-50 hover:bg-gray-100 border border-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{city.name}</h4>
                    <div className="flex items-center gap-1">
                      {getTrendIcon(city.airQuality.trend)}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{city.region}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: city.airQuality.color }}
                      ></div>
                      <span className="text-sm font-bold" style={{ color: city.airQuality.color }}>
                        IQA {city.airQuality.aqi}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Users className="w-3 h-3" />
                      <span>{(city.population / 1000).toFixed(0)}k</span>
                    </div>
                  </div>
                  <p className="text-xs mt-1" style={{ color: city.airQuality.color }}>
                    {city.airQuality.category}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Carte */}
        <div className="xl:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full flex flex-col">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
              <h3 className="font-semibold text-gray-900">Carte de la Qualité de l'Air</h3>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Bon (0-50)</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span>Modéré (51-100)</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span>Mauvais (101+)</span>
                </div>
              </div>
            </div>
            <div className="flex-1 relative overflow-hidden">
              <div 
                ref={mapRef}
                className="absolute inset-0 w-full h-full"
              />
            </div>
          </div>
        </div>

        {/* Détails et graphiques */}
        <div className="xl:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 h-full overflow-y-auto">
            <h3 className="font-semibold text-gray-900 mb-4">Analyse Détaillée</h3>
            
            {selectedCity ? (
              <div className="space-y-6">
                {/* Informations générales */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">{selectedCity.name}</h4>
                  <p className="text-sm text-gray-600">{selectedCity.region}</p>
                  <p className="text-sm text-gray-600">{selectedCity.department}</p>
                </div>

                {/* IQA principal */}
                <div className="p-4 rounded-lg" style={{ backgroundColor: `${selectedCity.airQuality.color}15` }}>
                  <div className="flex items-center gap-2 mb-2">
                    <Wind className="w-5 h-5" style={{ color: selectedCity.airQuality.color }} />
                    <span className="text-sm font-medium" style={{ color: selectedCity.airQuality.color }}>
                      Indice de Qualité de l'Air
                    </span>
                  </div>
                  <p className="text-3xl font-bold mb-1" style={{ color: selectedCity.airQuality.color }}>
                    {selectedCity.airQuality.aqi}
                  </p>
                  <p className="text-sm font-medium" style={{ color: selectedCity.airQuality.color }}>
                    {selectedCity.airQuality.category}
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    {getTrendIcon(selectedCity.airQuality.trend)}
                    <span className={`text-xs ${getTrendColor(selectedCity.airQuality.trend)}`}>
                      Tendance {selectedCity.airQuality.trend === 'improving' ? 'positive' : 
                                selectedCity.airQuality.trend === 'worsening' ? 'négative' : 'stable'}
                    </span>
                  </div>
                </div>

                {/* Polluants */}
                <div>
                  <h5 className="font-medium text-gray-900 mb-3">Polluants Principaux</h5>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">PM2.5</span>
                      <span className="font-medium">{selectedCity.airQuality.pollutants.pm25} µg/m³</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">PM10</span>
                      <span className="font-medium">{selectedCity.airQuality.pollutants.pm10} µg/m³</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">NO₂</span>
                      <span className="font-medium">{selectedCity.airQuality.pollutants.no2} µg/m³</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">O₃</span>
                      <span className="font-medium">{selectedCity.airQuality.pollutants.o3} µg/m³</span>
                    </div>
                  </div>
                </div>

                {/* Graphique des polluants */}
                <div>
                  <h5 className="font-medium text-gray-900 mb-3">Répartition des Polluants</h5>
                  <div className="h-32">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={[
                        { name: 'PM2.5', value: selectedCity.airQuality.pollutants.pm25 },
                        { name: 'PM10', value: selectedCity.airQuality.pollutants.pm10 },
                        { name: 'NO₂', value: selectedCity.airQuality.pollutants.no2 },
                        { name: 'O₃', value: selectedCity.airQuality.pollutants.o3 }
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                        <YAxis tick={{ fontSize: 10 }} />
                        <Tooltip />
                        <Bar dataKey="value" fill={selectedCity.airQuality.color} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Évolution historique */}
                <div>
                  <h5 className="font-medium text-gray-900 mb-3">Évolution sur 30 jours</h5>
                  <div className="h-32">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={selectedCity.airQuality.historicalData.slice(-7)}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="date" 
                          tick={{ fontSize: 10 }}
                          tickFormatter={(value) => new Date(value).getDate().toString()}
                        />
                        <YAxis tick={{ fontSize: 10 }} />
                        <Tooltip 
                          labelFormatter={(value) => new Date(value).toLocaleDateString('fr-FR')}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="aqi" 
                          stroke={selectedCity.airQuality.color} 
                          strokeWidth={2}
                          dot={{ fill: selectedCity.airQuality.color, strokeWidth: 2, r: 3 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Informations complémentaires */}
                <div className="pt-4 border-t border-gray-200">
                  <h5 className="font-medium text-gray-900 mb-2">Informations</h5>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p><strong>Population:</strong> {selectedCity.population.toLocaleString()} hab.</p>
                    <p><strong>Dernière mise à jour:</strong> {new Date(selectedCity.airQuality.lastUpdated).toLocaleString('fr-FR')}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 mt-8">
                <Wind className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>Sélectionnez une ville pour voir l'analyse détaillée de la qualité de l'air</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
import React from 'react';
import { MapPin, Users, Globe2 } from 'lucide-react';
import { City } from '../types';

interface StatsCardProps {
  cities: City[];
  selectedCity: City | null;
}

export const StatsCard: React.FC<StatsCardProps> = ({ cities, selectedCity }) => {
  const totalPopulation = cities.reduce((sum, city) => sum + city.population, 0);
  const countries = new Set(cities.map(city => city.country)).size;

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Statistiques</h3>
      
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
          <div className="p-2 bg-blue-100 rounded-lg">
            <MapPin className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Villes disponibles</p>
            <p className="text-xl font-bold text-gray-800">{cities.length}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
          <div className="p-2 bg-green-100 rounded-lg">
            <Globe2 className="w-4 h-4 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Pays représentés</p>
            <p className="text-xl font-bold text-gray-800">{countries}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Users className="w-4 h-4 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Population totale</p>
            <p className="text-xl font-bold text-gray-800">
              {(totalPopulation / 1000000).toFixed(1)}M
            </p>
          </div>
        </div>

        {selectedCity && (
          <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl border border-indigo-100">
            <h4 className="font-semibold text-gray-800 mb-2">Ville sélectionnée</h4>
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="w-3 h-3 text-indigo-600" />
              <span className="text-sm font-medium text-gray-800">{selectedCity.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-3 h-3 text-indigo-600" />
              <span className="text-xs text-gray-600">
                {selectedCity.population.toLocaleString()} habitants
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
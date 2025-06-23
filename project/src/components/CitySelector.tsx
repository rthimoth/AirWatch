import React from 'react';
import { Search, MapPin, Users } from 'lucide-react';
import { City } from '../types';

interface CitySelectorProps {
  cities: City[];
  selectedCity: City | null;
  onCitySelect: (city: City) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export const CitySelector: React.FC<CitySelectorProps> = ({
  cities,
  selectedCity,
  onCitySelect,
  searchTerm,
  onSearchChange
}) => {
  const filteredCities = cities.filter(city =>
    city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    city.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 h-full flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-100 rounded-lg">
          <MapPin className="w-5 h-5 text-blue-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-800">Sélectionner une ville</h2>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Rechercher une ville..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
        />
      </div>

      <div className="flex-1 overflow-y-auto space-y-3">
        {filteredCities.map((city) => (
          <div
            key={city.id}
            onClick={() => onCitySelect(city)}
            className={`p-4 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md ${
              selectedCity?.id === city.id
                ? 'bg-blue-50 border-2 border-blue-200 shadow-md'
                : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 mb-1">{city.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{city.country}</p>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Users className="w-3 h-3" />
                  <span>{city.population.toLocaleString()} hab.</span>
                </div>
              </div>
              {selectedCity?.id === city.id && (
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedCity && (
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
          <h4 className="font-semibold text-gray-800 mb-2">{selectedCity.name}</h4>
          <p className="text-sm text-gray-600 leading-relaxed">{selectedCity.description}</p>
        </div>
      )}
    </div>
  );
};
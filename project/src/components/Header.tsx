import React from 'react';
import { Wind, Settings, Bell } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg">
              <Wind className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">AirWatch France</h1>
              <p className="text-xs text-gray-600">Surveillance de la Qualité de l'Air</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

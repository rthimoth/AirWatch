import React from 'react';

interface GenericTabProps {
  title: string;
  description: string;
}

export const GenericTab: React.FC<GenericTabProps> = ({ title, description }) => {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-600">{description}</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl text-gray-400">📊</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Contenu à venir</h3>
          <p className="text-gray-600">Cette section sera développée prochainement.</p>
        </div>
      </div>
    </div>
  );
};
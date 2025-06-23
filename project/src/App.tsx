import React, { useState } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { IQATab } from './components/IQATab';
import { GenericTab } from './components/GenericTab';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'iqa':
        return <IQATab />;
      case 'analytics':
        return <GenericTab title="Analyses" description="Outils d'analyse avancés et rapports détaillés" />;
      case 'reports':
        return <GenericTab title="Rapports" description="Génération et gestion de rapports personnalisés" />;
      case 'users':
        return <GenericTab title="Utilisateurs" description="Gestion des utilisateurs et des permissions" />;
      case 'settings':
        return <GenericTab title="Paramètres" description="Configuration de la plateforme et préférences" />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="flex h-[calc(100vh-4rem)]">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        
        <main className="flex-1 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;
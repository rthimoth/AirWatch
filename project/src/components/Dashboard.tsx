import React from "react";
import {
  TrendingUp,
  TrendingDown,
  Wind,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
} from "lucide-react";
import { useCitiesData } from "../hooks/useCitiesData";

export const Dashboard: React.FC = () => {
  const {
    cities: frenchCities,
    loading,
    error,
    refreshCities,
  } = useCitiesData();

  // Calculs des statistiques globales
  const totalCities = frenchCities.length;
  const avgAqi =
    totalCities > 0
      ? Math.round(
          frenchCities.reduce((sum, city) => sum + city.airQuality.aqi, 0) /
            totalCities
        )
      : 0;
  const goodAirCities = frenchCities.filter(
    (city) => city.airQuality.aqi <= 50
  ).length;
  const badAirCities = frenchCities.filter(
    (city) => city.airQuality.aqi > 50
  ).length;
  const improvingCities = frenchCities.filter(
    (city) => city.airQuality.trend === "improving"
  ).length;
  const worseningCities = frenchCities.filter(
    (city) => city.airQuality.trend === "worsening"
  ).length;

  const stats = [
    {
      title: "IQA Moyen National",
      value: avgAqi.toString(),
      change: avgAqi <= 50 ? "Bon" : avgAqi <= 100 ? "Modéré" : "Mauvais",
      icon: Wind,
      color: avgAqi <= 50 ? "green" : avgAqi <= 100 ? "yellow" : "red",
    },
    {
      title: "Villes Air Pur",
      value: goodAirCities.toString(),
      change: `${Math.round((goodAirCities / totalCities) * 100)}%`,
      icon: CheckCircle,
      color: "green",
    },
    {
      title: "Villes Polluées",
      value: badAirCities.toString(),
      change: `${Math.round((badAirCities / totalCities) * 100)}% (IQA > 50)`,
      icon: XCircle,
      color: "red",
    },
    {
      title: "Tendance Positive",
      value: improvingCities.toString(),
      change: `vs ${worseningCities} en dégradation`,
      icon: TrendingUp,
      color: "blue",
    },
  ];

  // Top 5 des meilleures et pires villes
  const bestCities = [...frenchCities]
    .sort((a, b) => a.airQuality.aqi - b.airQuality.aqi)
    .slice(0, 5);
  const worstCities = [...frenchCities]
    .sort((a, b) => b.airQuality.aqi - a.airQuality.aqi)
    .slice(0, 5);

  // Affichage de loading si pas de données
  if (loading && frenchCities.length === 0) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Chargement des données...
            </h3>
            <p className="text-gray-600">
              Récupération des données en temps réel depuis les APIs
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Qualité de l'Air en France
            </h2>
            <p className="text-gray-600">
              Surveillance en temps réel de l'Indice de Qualité de l'Air (IQA)
              dans les métropoles françaises
            </p>
          </div>
          <div className="flex items-center gap-3">
            {loading && (
              <div className="flex items-center gap-2 text-blue-600">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span className="text-sm">Actualisation...</span>
              </div>
            )}
            <button
              onClick={refreshCities}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              title="Actualiser les données en temps réel"
            >
              <RefreshCw
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              />
              <span className="text-sm">Actualiser</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <p className="text-sm text-yellow-800">
                <strong>Attention :</strong> {error}. Les données affichées
                utilisent des valeurs par défaut.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const colorClasses = {
            green: "bg-green-100 text-green-600",
            yellow: "bg-yellow-100 text-yellow-600",
            red: "bg-red-100 text-red-600",
            blue: "bg-blue-100 text-blue-600",
          };

          return (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`p-3 rounded-lg ${
                    colorClasses[stat.color as keyof typeof colorClasses]
                  }`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <span
                  className={`text-sm font-medium ${
                    stat.color === "green"
                      ? "text-green-600"
                      : stat.color === "red"
                      ? "text-red-600"
                      : "text-gray-600"
                  }`}
                >
                  {stat.change}
                </span>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">
                {stat.value}
              </h3>
              <p className="text-gray-600 text-sm">{stat.title}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Meilleures villes */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Meilleure Qualité d'Air
            </h3>
          </div>
          <div className="space-y-3">
            {bestCities.map((city, index) => (
              <div
                key={city.name}
                className="flex items-center justify-between p-3 bg-green-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-medium text-gray-900">{city.name}</p>
                    <p className="text-sm text-gray-600">{city.region}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">
                    IQA {city.airQuality.aqi}
                  </p>
                  <p className="text-xs text-green-600">
                    {city.airQuality.category}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pires villes */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Qualité d'Air Préoccupante
            </h3>
          </div>
          <div className="space-y-3">
            {worstCities.map((city, index) => (
              <div
                key={city.name}
                className="flex items-center justify-between p-3 bg-red-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-medium text-gray-900">{city.name}</p>
                    <p className="text-sm text-gray-600">{city.region}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-red-600">
                    IQA {city.airQuality.aqi}
                  </p>
                  <p className="text-xs text-red-600">
                    {city.airQuality.category}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alertes et recommandations */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <AlertTriangle className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Recommandations du Jour
            </h3>
            <div className="space-y-2 text-sm text-gray-700">
              <p>
                • <strong>Activités extérieures :</strong> Limitées pour les
                personnes sensibles dans {badAirCities} villes
              </p>
              <p>
                • <strong>Transport :</strong> Privilégiez les transports en
                commun et le covoiturage
              </p>
              <p>
                • <strong>Ventilation :</strong> Aérez tôt le matin ou tard le
                soir quand la pollution est moindre
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

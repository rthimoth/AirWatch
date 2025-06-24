import { useState, useEffect } from 'react';
import { cityService } from '../services/apiService';
import { City } from '../types';
import FRENCH_CITIES_BASE_DATA from "../data/cities.json"

// Données de base des villes françaises (coordonnées et infos de base)
// const FRENCH_CITIES_BASE_DATA = [
//   {
//     id: 'paris',
//     name: 'Paris',
//     latitude: 48.8566,
//     longitude: 2.3522,
//     population: 2140526,
//     country: 'France',
//     region: 'Île-de-France',
//     description: 'Capitale de la France, centre politique, économique et culturel du pays.'
//   },
//   {
//     id: 'marseille',
//     name: 'Marseille',
//     latitude: 43.2965,
//     longitude: 5.3698,
//     population: 870731,
//     country: 'France',
//     region: 'Provence-Alpes-Côte d\'Azur',
//     description: 'Deuxième ville de France, grand port méditerranéen.'
//   },
//   {
//     id: 'lyon',
//     name: 'Lyon',
//     latitude: 45.7640,
//     longitude: 4.8357,
//     population: 518635,
//     country: 'France',
//     region: 'Auvergne-Rhône-Alpes',
//     description: 'Capitale des Gaules, centre économique majeur.'
//   },
//   {
//     id: 'toulouse',
//     name: 'Toulouse',
//     latitude: 43.6047,
//     longitude: 1.4442,
//     population: 479553,
//     country: 'France',
//     region: 'Occitanie',
//     description: 'Ville rose, capitale européenne de l\'aéronautique.'
//   },
//   {
//     id: 'nice',
//     name: 'Nice',
//     latitude: 43.7102,
//     longitude: 7.2620,
//     population: 342637,
//     country: 'France',
//     region: 'Provence-Alpes-Côte d\'Azur',
//     description: 'Perle de la Côte d\'Azur.'
//   },
//   {
//     id: 'nantes',
//     name: 'Nantes',
//     latitude: 47.2184,
//     longitude: -1.5536,
//     population: 320732,
//     country: 'France',
//     region: 'Pays de la Loire',
//     description: 'Ville verte et innovante.'
//   },
//   {
//     id: 'montpellier',
//     name: 'Montpellier',
//     latitude: 43.6110,
//     longitude: 3.8767,
//     population: 295542,
//     country: 'France',
//     region: 'Occitanie',
//     description: 'Ville universitaire dynamique.'
//   },
//   {
//     id: 'strasbourg',
//     name: 'Strasbourg',
//     latitude: 48.5734,
//     longitude: 7.7521,
//     population: 284677,
//     country: 'France',
//     region: 'Grand Est',
//     description: 'Capitale européenne.'
//   },
//   {
//     id: 'bordeaux',
//     name: 'Bordeaux',
//     latitude: 44.8378,
//     longitude: -0.5792,
//     population: 257804,
//     country: 'France',
//     region: 'Nouvelle-Aquitaine',
//     description: 'Capitale mondiale du vin.'
//   },
//   {
//     id: 'lille',
//     name: 'Lille',
//     latitude: 50.6292,
//     longitude: 3.0573,
//     population: 236234,
//     country: 'France',
//     region: 'Hauts-de-France',
//     description: 'Carrefour européen.'
//   }
// ];

interface UseCitiesDataReturn {
  cities: City[];
  loading: boolean;
  error: string | null;
  refreshCities: () => Promise<void>;
}

export const useCitiesData = (): UseCitiesDataReturn => {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCitiesData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Charger les données de qualité de l'air pour chaque ville
      const citiesWithAirQuality = await Promise.allSettled(
        FRENCH_CITIES_BASE_DATA.map(async (cityData) => {
          console.log(`🔄 Chargement de ${cityData.name}...`);
          
          try {
            const cityWithAQ = await cityService.createCityWithAirQuality(
              cityData.name,
              cityData.latitude,
              cityData.longitude,
              cityData.population,
              cityData.country,
              cityData.region,
            );
            
            console.log(`✅ ${cityData.name} chargée avec AQI: ${cityWithAQ.airQuality.aqi}`);
            return cityWithAQ;
          } catch (error) {
            console.warn(`⚠️ Erreur pour ${cityData.name}, utilisation des données par défaut`);
            // En cas d'erreur, utiliser les données de fallback
            throw error;
          }
        })
      );

      // Traiter les résultats
      const loadedCities: City[] = [];
      
      citiesWithAirQuality.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          loadedCities.push(result.value);
        } else {
          console.error(`Erreur pour la ville ${FRENCH_CITIES_BASE_DATA[index].name}:`, result.reason);
          // Ajouter une ville avec données par défaut
          const fallbackCity = createFallbackCityData(FRENCH_CITIES_BASE_DATA[index]);
          loadedCities.push(fallbackCity);
        }
      });

      setCities(loadedCities);
      console.log(`🎉 ${loadedCities.length} villes chargées avec succès !`);
      
    } catch (err) {
      console.error('❌ Erreur lors du chargement des données:', err);
      setError('Erreur lors du chargement des données des villes');
      
      // En cas d'erreur générale, utiliser toutes les données par défaut
      const fallbackCities = FRENCH_CITIES_BASE_DATA.map(createFallbackCityData);
      setCities(fallbackCities);
    } finally {
      setLoading(false);
    }
  };

  const refreshCities = async () => {
    await loadCitiesData();
  };

  useEffect(() => {
    loadCitiesData();
  }, []);

  return {
    cities,
    loading,
    error,
    refreshCities
  };
};

// Fonction utilitaire pour créer des données par défaut
function createFallbackCityData(baseData: typeof FRENCH_CITIES_BASE_DATA[0]): City {
  const fallbackAqi = 40 + Math.random() * 40; // AQI entre 40 et 80
  
  return {
    name: baseData.name,
    department: getDefaultDepartment(baseData.region),
    region: baseData.region,
    latitude: baseData.latitude,
    longitude: baseData.longitude,
    population: baseData.population,
    airQuality: {
      aqi: Math.round(fallbackAqi),
      category: getAirQualityCategory(fallbackAqi),
      color: getAirQualityColor(fallbackAqi),
      pollutants: {
        pm25: Math.round(fallbackAqi * 0.4),
        pm10: Math.round(fallbackAqi * 0.6),
        no2: Math.round(fallbackAqi * 0.3),
        o3: Math.round(fallbackAqi * 0.5),
        so2: Math.round(fallbackAqi * 0.2),
        co: Math.round(fallbackAqi * 0.1)
      },
      lastUpdated: new Date().toISOString(),
      trend: Math.random() > 0.5 ? 'improving' : 'stable',
      historicalData: generateHistoricalData(fallbackAqi)
    }
  };
}

function getDefaultDepartment(region: string): string {
  const departmentMap: { [key: string]: string } = {
    'Île-de-France': 'Paris',
    'Provence-Alpes-Côte d\'Azur': 'Bouches-du-Rhône',
    'Auvergne-Rhône-Alpes': 'Rhône',
    'Occitanie': 'Haute-Garonne',
    'Pays de la Loire': 'Loire-Atlantique',
    'Grand Est': 'Bas-Rhin',
    'Nouvelle-Aquitaine': 'Gironde',
    'Hauts-de-France': 'Nord'
  };
  
  return departmentMap[region] || region;
}

function getAirQualityCategory(aqi: number): string {
  if (aqi <= 20) return 'Bon';
  if (aqi <= 40) return 'Modéré';
  if (aqi <= 60) return 'Dégradé';
  if (aqi <= 80) return 'Mauvais';
  if (aqi <= 100) return 'Très mauvais';
  return 'Extrêmement mauvais';
}

function getAirQualityColor(aqi: number): string {
  if (aqi <= 20) return '#50f0e6';
  if (aqi <= 40) return '#50ccaa';
  if (aqi <= 60) return '#f0e641';
  if (aqi <= 80) return '#ff5050';
  if (aqi <= 100) return '#960032';
  return '#7d2181';
}

function generateHistoricalData(baseAqi: number, days: number = 30) {
  const data = [];
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Variation réaliste autour de la valeur de base
    const variation = (Math.random() - 0.5) * 30;
    const aqi = Math.max(5, Math.min(100, baseAqi + variation));
    
    data.push({
      date: date.toISOString().split('T')[0],
      aqi: Math.round(aqi),
      pm25: Math.round(aqi * 0.4 + Math.random() * 10),
      pm10: Math.round(aqi * 0.6 + Math.random() * 15),
      no2: Math.round(aqi * 0.3 + Math.random() * 8),
      o3: Math.round(aqi * 0.5 + Math.random() * 12)
    });
  }
  
  return data;
} 

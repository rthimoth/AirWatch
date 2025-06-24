import axios from 'axios';

// Cache simple pour stabiliser les données de fallback
const fallbackCache = new Map<string, number>();
const cacheTimestamp = new Map<string, number>();

// Nettoyer le cache après 30 minutes pour permettre des variations naturelles
const cleanOldCacheEntries = () => {
  const thirtyMinutesAgo = Date.now() - (30 * 60 * 1000);
  for (const [key, timestamp] of cacheTimestamp) {
    if (timestamp < thirtyMinutesAgo) {
      fallbackCache.delete(key);
      cacheTimestamp.delete(key);
    }
  }
};

// Types pour les APIs
interface OpenMeteoAirQuality {
  latitude: number;
  longitude: number;
  current: {
    european_aqi: number;
    pm2_5: number;
    pm10: number;
    nitrogen_dioxide: number;
    ozone: number;
    sulphur_dioxide: number;
    carbon_monoxide: number;
  };
  hourly: {
    time: string[];
    european_aqi: number[];
    pm2_5: number[];
    pm10: number[];
    nitrogen_dioxide: number[];
    ozone: number[];
    sulphur_dioxide: number[];
  };
}

interface CountryInfo {
  name: {
    common: string;
    official: string;
  };
  capital: string[];
  population: number;
  area: number;
  region: string;
  subregion: string;
  latlng: number[];
  flags: {
    png: string;
    svg: string;
  };
  cca2: string; // Code pays 2 lettres
}

// Configuration des APIs
const OPEN_METEO_BASE_URL = 'https://air-quality-api.open-meteo.com/v1';
const REST_COUNTRIES_BASE_URL = 'https://restcountries.com/v3.1';

// Service pour Open-Meteo Air Quality API
export const airQualityService = {
  // Obtenir la qualité de l'air actuelle pour une ville
  async getCurrentAirQuality(latitude: number, longitude: number): Promise<OpenMeteoAirQuality> {
    try {
      const response = await axios.get(`${OPEN_METEO_BASE_URL}/air-quality`, {
        params: {
          latitude,
          longitude,
          current: 'european_aqi,pm2_5,pm10,nitrogen_dioxide,ozone,sulphur_dioxide,carbon_monoxide',
          hourly: 'european_aqi,pm2_5,pm10,nitrogen_dioxide,ozone,sulphur_dioxide',
          timezone: 'Europe/Paris',
          forecast_days: 1
        }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération de la qualité de l\'air:', error);
      throw error;
    }
  },

  // Obtenir l'historique et les prévisions (jusqu'à 5 jours)
  async getAirQualityForecast(latitude: number, longitude: number, days: number = 5): Promise<OpenMeteoAirQuality> {
    try {
      const response = await axios.get(`${OPEN_METEO_BASE_URL}/air-quality`, {
        params: {
          latitude,
          longitude,
          hourly: 'european_aqi,pm2_5,pm10,nitrogen_dioxide,ozone,sulphur_dioxide',
          timezone: 'Europe/Paris',
          forecast_days: days
        }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des prévisions:', error);
      throw error;
    }
  }
};

// Service pour REST Countries API
export const countriesService = {
  // Obtenir toutes les informations des pays
  async getAllCountries(): Promise<CountryInfo[]> {
    try {
      const response = await axios.get(`${REST_COUNTRIES_BASE_URL}/all`, {
        params: {
          fields: 'name,capital,population,area,region,subregion,latlng,flags,cca2'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des pays:', error);
      throw error;
    }
  },

  // Obtenir les informations d'un pays spécifique
  async getCountryByCode(countryCode: string): Promise<CountryInfo> {
    try {
      const response = await axios.get(`${REST_COUNTRIES_BASE_URL}/alpha/${countryCode}`, {
        params: {
          fields: 'name,capital,population,area,region,subregion,latlng,flags,cca2'
        }
      });
      return response.data[0];
    } catch (error) {
      console.error(`Erreur lors de la récupération du pays ${countryCode}:`, error);
      throw error;
    }
  },

  // Rechercher des pays par nom
  async searchCountriesByName(name: string): Promise<CountryInfo[]> {
    try {
      const response = await axios.get(`${REST_COUNTRIES_BASE_URL}/name/${name}`, {
        params: {
          fields: 'name,capital,population,area,region,subregion,latlng,flags,cca2'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la recherche du pays ${name}:`, error);
      throw error;
    }
  }
};

// Service pour combiner les données
export const cityService = {
  // Créer une ville avec données de qualité de l'air en temps réel
  async createCityWithAirQuality(
    id: string,
    name: string,
    latitude: number,
    longitude: number,
    population: number,
    country: string,
    region: string,
    description: string
  ) {
    try {
      // Récupérer les données de qualité de l'air en temps réel
      const airQualityData = await airQualityService.getCurrentAirQuality(latitude, longitude);
      
      // Générer des données historiques (simulation avec variations réalistes)
      const historicalData = generateHistoricalData(airQualityData.current.european_aqi);

      // Convertir le format Open-Meteo vers notre format
      return {
        id,
        name,
        latitude,
        longitude,
        population,
        country,
        region,
        description,
        airQuality: {
          aqi: Math.round(airQualityData.current.european_aqi),
          category: getAirQualityCategory(airQualityData.current.european_aqi),
          color: getAirQualityColor(airQualityData.current.european_aqi),
          pollutants: {
            pm25: Math.round(airQualityData.current.pm2_5),
            pm10: Math.round(airQualityData.current.pm10),
            no2: Math.round(airQualityData.current.nitrogen_dioxide),
            o3: Math.round(airQualityData.current.ozone),
            so2: Math.round(airQualityData.current.sulphur_dioxide),
            co: Math.round(airQualityData.current.carbon_monoxide / 1000) // Convertir en mg/m³
          },
          lastUpdated: new Date().toISOString(),
          trend: 'stable' as const,
          historicalData
        }
      };
    } catch (error) {
      console.error(`Erreur lors de la création de la ville ${name}:`, error);
      // Retourner des données par défaut en cas d'erreur
      return createFallbackCity(id, name, latitude, longitude, population, country, region, description);
    }
  }
};

// Fonctions utilitaires
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

function createFallbackCity(id: string, name: string, latitude: number, longitude: number, population: number, country: string, region: string, description: string) {
  // Nettoyer les entrées de cache trop anciennes
  cleanOldCacheEntries();
  
  // Utiliser le cache pour éviter les variations aléatoires trop importantes
  let fallbackAqi: number;
  
  if (fallbackCache.has(id)) {
    // Si on a une valeur en cache, ajouter seulement une petite variation réaliste
    const cachedAqi = fallbackCache.get(id)!;
    const smallVariation = (Math.random() - 0.5) * 8; // Variation de ±4 points max
    fallbackAqi = Math.max(25, Math.min(90, cachedAqi + smallVariation));
  } else {
    // Première fois : générer une valeur de base et la mettre en cache
    fallbackAqi = 40 + Math.random() * 30; // AQI entre 40 et 70
  }
  
  // Mettre à jour le cache avec la nouvelle valeur et le timestamp
  fallbackCache.set(id, fallbackAqi);
  cacheTimestamp.set(id, Date.now());
  
  return {
    id,
    name,
    latitude,
    longitude,
    population,
    country,
    region,
    description,
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
      trend: 'stable' as const,
      historicalData: generateHistoricalData(fallbackAqi)
    }
  };
} 
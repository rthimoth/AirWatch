import { City } from '../types';

// Fonction pour générer des données historiques réalistes
const generateHistoricalData = (baseAqi: number, days: number = 30) => {
  const data = [];
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Variation réaliste autour de la valeur de base
    const variation = (Math.random() - 0.5) * 40;
    const aqi = Math.max(10, Math.min(300, baseAqi + variation));
    
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
};

// Fonction pour déterminer la catégorie et couleur selon l'AQI
const getAirQualityInfo = (aqi: number) => {
  if (aqi <= 50) return { category: 'Bon' as const, color: '#10B981' };
  if (aqi <= 100) return { category: 'Modéré' as const, color: '#F59E0B' };
  if (aqi <= 150) return { category: 'Mauvais pour les groupes sensibles' as const, color: '#EF4444' };
  if (aqi <= 200) return { category: 'Mauvais' as const, color: '#DC2626' };
  if (aqi <= 300) return { category: 'Très mauvais' as const, color: '#7C2D12' };
  return { category: 'Dangereux' as const, color: '#450A0A' };
};

export const frenchCities: City[] = [
  {
    id: 'paris',
    name: 'Paris',
    department: 'Paris',
    region: 'Île-de-France',
    latitude: 48.8566,
    longitude: 2.3522,
    population: 2140526,
    description: 'Capitale de la France, centre politique, économique et culturel du pays.',
    airQuality: {
      aqi: 78,
      ...getAirQualityInfo(78),
      pollutants: {
        pm25: 32,
        pm10: 45,
        no2: 28,
        o3: 85,
        so2: 12,
        co: 1.2
      },
      lastUpdated: new Date().toISOString(),
      trend: 'stable',
      historicalData: generateHistoricalData(78)
    }
  },
  {
    id: 'marseille',
    name: 'Marseille',
    department: 'Bouches-du-Rhône',
    region: 'Provence-Alpes-Côte d\'Azur',
    latitude: 43.2965,
    longitude: 5.3698,
    population: 870731,
    description: 'Deuxième ville de France, grand port méditerranéen.',
    airQuality: {
      aqi: 65,
      ...getAirQualityInfo(65),
      pollutants: {
        pm25: 28,
        pm10: 38,
        no2: 22,
        o3: 92,
        so2: 15,
        co: 0.9
      },
      lastUpdated: new Date().toISOString(),
      trend: 'improving',
      historicalData: generateHistoricalData(65)
    }
  },
  {
    id: 'lyon',
    name: 'Lyon',
    department: 'Rhône',
    region: 'Auvergne-Rhône-Alpes',
    latitude: 45.7640,
    longitude: 4.8357,
    population: 518635,
    description: 'Capitale des Gaules, centre économique majeur.',
    airQuality: {
      aqi: 72,
      ...getAirQualityInfo(72),
      pollutants: {
        pm25: 30,
        pm10: 42,
        no2: 25,
        o3: 78,
        so2: 10,
        co: 1.1
      },
      lastUpdated: new Date().toISOString(),
      trend: 'stable',
      historicalData: generateHistoricalData(72)
    }
  },
  {
    id: 'toulouse',
    name: 'Toulouse',
    department: 'Haute-Garonne',
    region: 'Occitanie',
    latitude: 43.6047,
    longitude: 1.4442,
    population: 479553,
    description: 'Ville rose, capitale européenne de l\'aéronautique.',
    airQuality: {
      aqi: 58,
      ...getAirQualityInfo(58),
      pollutants: {
        pm25: 24,
        pm10: 35,
        no2: 20,
        o3: 68,
        so2: 8,
        co: 0.8
      },
      lastUpdated: new Date().toISOString(),
      trend: 'improving',
      historicalData: generateHistoricalData(58)
    }
  },
  {
    id: 'nice',
    name: 'Nice',
    department: 'Alpes-Maritimes',
    region: 'Provence-Alpes-Côte d\'Azur',
    latitude: 43.7102,
    longitude: 7.2620,
    population: 342637,
    description: 'Perle de la Côte d\'Azur.',
    airQuality: {
      aqi: 52,
      ...getAirQualityInfo(52),
      pollutants: {
        pm25: 22,
        pm10: 30,
        no2: 18,
        o3: 75,
        so2: 6,
        co: 0.7
      },
      lastUpdated: new Date().toISOString(),
      trend: 'stable',
      historicalData: generateHistoricalData(52)
    }
  },
  {
    id: 'nantes',
    name: 'Nantes',
    department: 'Loire-Atlantique',
    region: 'Pays de la Loire',
    latitude: 47.2184,
    longitude: -1.5536,
    population: 320732,
    description: 'Ville verte et innovante.',
    airQuality: {
      aqi: 45,
      ...getAirQualityInfo(45),
      pollutants: {
        pm25: 18,
        pm10: 28,
        no2: 15,
        o3: 62,
        so2: 5,
        co: 0.6
      },
      lastUpdated: new Date().toISOString(),
      trend: 'improving',
      historicalData: generateHistoricalData(45)
    }
  },
  {
    id: 'montpellier',
    name: 'Montpellier',
    department: 'Hérault',
    region: 'Occitanie',
    latitude: 43.6110,
    longitude: 3.8767,
    population: 295542,
    description: 'Ville universitaire dynamique.',
    airQuality: {
      aqi: 61,
      ...getAirQualityInfo(61),
      pollutants: {
        pm25: 26,
        pm10: 36,
        no2: 21,
        o3: 82,
        so2: 9,
        co: 0.9
      },
      lastUpdated: new Date().toISOString(),
      trend: 'stable',
      historicalData: generateHistoricalData(61)
    }
  },
  {
    id: 'strasbourg',
    name: 'Strasbourg',
    department: 'Bas-Rhin',
    region: 'Grand Est',
    latitude: 48.5734,
    longitude: 7.7521,
    population: 284677,
    description: 'Capitale européenne.',
    airQuality: {
      aqi: 69,
      ...getAirQualityInfo(69),
      pollutants: {
        pm25: 29,
        pm10: 40,
        no2: 24,
        o3: 71,
        so2: 11,
        co: 1.0
      },
      lastUpdated: new Date().toISOString(),
      trend: 'worsening',
      historicalData: generateHistoricalData(69)
    }
  },
  {
    id: 'bordeaux',
    name: 'Bordeaux',
    department: 'Gironde',
    region: 'Nouvelle-Aquitaine',
    latitude: 44.8378,
    longitude: -0.5792,
    population: 257804,
    description: 'Capitale mondiale du vin.',
    airQuality: {
      aqi: 55,
      ...getAirQualityInfo(55),
      pollutants: {
        pm25: 23,
        pm10: 32,
        no2: 19,
        o3: 69,
        so2: 7,
        co: 0.8
      },
      lastUpdated: new Date().toISOString(),
      trend: 'stable',
      historicalData: generateHistoricalData(55)
    }
  },
  {
    id: 'lille',
    name: 'Lille',
    department: 'Nord',
    region: 'Hauts-de-France',
    latitude: 50.6292,
    longitude: 3.0573,
    population: 236234,
    description: 'Carrefour européen.',
    airQuality: {
      aqi: 82,
      ...getAirQualityInfo(82),
      pollutants: {
        pm25: 34,
        pm10: 48,
        no2: 30,
        o3: 76,
        so2: 14,
        co: 1.3
      },
      lastUpdated: new Date().toISOString(),
      trend: 'worsening',
      historicalData: generateHistoricalData(82)
    }
  }
];
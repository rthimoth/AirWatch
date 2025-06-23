export interface City {
  id: string;
  name: string;
  department: string;
  region: string;
  latitude: number;
  longitude: number;
  population: number;
  description: string;
  airQuality: AirQualityData;
}

export interface AirQualityData {
  aqi: number; // Air Quality Index (0-500)
  category: 'Bon' | 'Modéré' | 'Mauvais pour les groupes sensibles' | 'Mauvais' | 'Très mauvais' | 'Dangereux';
  color: string;
  pollutants: {
    pm25: number; // PM2.5 (µg/m³)
    pm10: number; // PM10 (µg/m³)
    no2: number;  // NO2 (µg/m³)
    o3: number;   // O3 (µg/m³)
    so2: number;  // SO2 (µg/m³)
    co: number;   // CO (mg/m³)
  };
  lastUpdated: string;
  trend: 'improving' | 'stable' | 'worsening';
  historicalData: HistoricalAirQuality[];
}

export interface HistoricalAirQuality {
  date: string;
  aqi: number;
  pm25: number;
  pm10: number;
  no2: number;
  o3: number;
}

export interface TabType {
  id: string;
  name: string;
  icon: string;
}
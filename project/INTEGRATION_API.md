# 🌍 Intégration des APIs en Temps Réel

Ce projet utilise maintenant 2 APIs gratuites pour remplacer les données hardcodées par de vraies données en temps réel.

## 🎯 APIs Utilisées

### 1. **Open-Meteo Air Quality API** 
- **URL**: `https://air-quality-api.open-meteo.com/v1`
- **Gratuit**: ✅ Illimité sans clé API
- **Données**: PM2.5, PM10, NO2, O3, SO2, CO, AQI européen
- **Avantages**: 
  - Données en temps réel
  - Couverture mondiale
  - Aucune inscription requise

### 2. **REST Countries API**
- **URL**: `https://restcountries.com/v3.1`
- **Gratuit**: ✅ Illimité
- **Données**: Informations pays, populations, coordonnées
- **Avantages**:
  - Base de données complète
  - Pas de limite de taux
  - Données toujours à jour

## 🔧 Architecture Technique

### Structure des fichiers
```
src/
├── services/
│   └── apiService.ts          # Services API (Open-Meteo + REST Countries)
├── hooks/
│   └── useCitiesData.ts       # Hook React pour charger les données
└── components/
    ├── Dashboard.tsx          # Utilise le hook
    └── IQATab.tsx            # Utilise le hook
```

### Flux de données
1. **Chargement initial** → Hook `useCitiesData` se lance au montage
2. **Appel APIs** → Pour chaque ville française (coordonnées)
3. **Transformation** → Format Open-Meteo → Format application
4. **Fallback** → En cas d'erreur, données par défaut
5. **Mise à jour** → Bouton refresh pour actualiser

## 📝 Comment utiliser les APIs

### 1. Service Air Quality (Open-Meteo)

```typescript
import { airQualityService } from '../services/apiService';

// Obtenir la qualité de l'air actuelle
const airData = await airQualityService.getCurrentAirQuality(48.8566, 2.3522); // Paris
console.log(`AQI Paris: ${airData.current.european_aqi}`);

// Obtenir les prévisions (5 jours)
const forecast = await airQualityService.getAirQualityForecast(48.8566, 2.3522, 5);
```

### 2. Service Countries (REST Countries)

```typescript
import { countriesService } from '../services/apiService';

// Obtenir tous les pays
const countries = await countriesService.getAllCountries();

// Obtenir un pays spécifique
const france = await countriesService.getCountryByCode('FR');

// Rechercher par nom
const searchResults = await countriesService.searchCountriesByName('France');
```

### 3. Hook personnalisé `useCitiesData`

```typescript
import { useCitiesData } from '../hooks/useCitiesData';

function MonComposant() {
  const { cities, loading, error, refreshCities } = useCitiesData();
  
  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;
  
  return (
    <div>
      <button onClick={refreshCities}>Actualiser</button>
      {cities.map(city => (
        <div key={city.id}>
          {city.name}: AQI {city.airQuality.aqi}
        </div>
      ))}
    </div>
  );
}
```

## 🚀 Installation et Configuration

### 1. Installer Axios
```bash
npm install axios
```

### 2. Les fichiers sont déjà créés
- ✅ `src/services/apiService.ts`
- ✅ `src/hooks/useCitiesData.ts`
- ✅ Composants mis à jour

### 3. Fonctionnalités ajoutées
- 🔄 **Bouton Refresh** dans Dashboard et IQATab
- ⏳ **Indicateurs de loading** 
- ⚠️ **Gestion d'erreurs** avec fallback
- 📊 **Données en temps réel** pour 10 villes françaises

## 💡 Exemples d'Utilisation

### Ajouter une nouvelle ville
```typescript
// Dans useCitiesData.ts, ajouter à FRENCH_CITIES_BASE_DATA
{
  id: 'rennes',
  name: 'Rennes',
  latitude: 48.1173,
  longitude: -1.6778,
  population: 216815,
  country: 'France',
  region: 'Bretagne',
  description: 'Capitale de la Bretagne.'
}
```

### Personnaliser les paramètres API
```typescript
// Dans apiService.ts, modifier les paramètres Open-Meteo
const response = await axios.get(`${OPEN_METEO_BASE_URL}/air-quality`, {
  params: {
    latitude,
    longitude,
    current: 'european_aqi,pm2_5,pm10,nitrogen_dioxide,ozone,sulphur_dioxide,carbon_monoxide',
    hourly: 'european_aqi,pm2_5,pm10', // Réduire les données
    timezone: 'Europe/Paris',
    forecast_days: 1 // Changer le nombre de jours
  }
});
```

### Gérer les erreurs
```typescript
try {
  const data = await airQualityService.getCurrentAirQuality(lat, lng);
  // Utiliser les données
} catch (error) {
  console.error('Erreur API:', error);
  // Utiliser des données par défaut
}
```

## 📊 Format des Données

### Données Open-Meteo (entrée)
```json
{
  "current": {
    "european_aqi": 45,
    "pm2_5": 12.5,
    "pm10": 18.3,
    "nitrogen_dioxide": 25.1,
    "ozone": 89.4,
    "sulphur_dioxide": 5.2,
    "carbon_monoxide": 245.6
  }
}
```

### Format Application (sortie)
```json
{
  "id": "paris",
  "name": "Paris",
  "airQuality": {
    "aqi": 45,
    "category": "Modéré",
    "color": "#50ccaa",
    "pollutants": {
      "pm25": 13,
      "pm10": 18,
      "no2": 25,
      "o3": 89,
      "so2": 5,
      "co": 0
    },
    "lastUpdated": "2024-01-15T10:30:00Z",
    "trend": "stable",
    "historicalData": [...]
  }
}
```

## 🎉 Avantages de cette Intégration

### ✅ **Données Réelles**
- Plus de données fictives
- Qualité de l'air en temps réel
- Mises à jour automatiques

### ✅ **Performance**
- Appels API parallèles (Promise.allSettled)
- Fallback en cas d'erreur
- Cache navigateur automatique

### ✅ **UX Améliorée**
- Indicateurs de loading
- Boutons refresh
- Messages d'erreur informatifs

### ✅ **Maintenance**
- Code modulaire et réutilisable
- Services séparés par responsabilité
- TypeScript pour la sécurité

## 🔮 Évolutions Possibles

1. **Cache intelligent** avec localStorage
2. **Notifications** push pour alertes pollution
3. **Géolocalisation** pour ville actuelle
4. **API Météo** complémentaire
5. **WebSocket** pour mises à jour temps réel

---

🎯 **Résultat**: Votre application utilise maintenant de vraies données d'APIs gratuites au lieu de données hardcodées ! Les villes affichent des données de qualité de l'air en temps réel. 
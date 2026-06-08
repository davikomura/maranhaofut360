export interface CityCoordinate {
  latitude: number;
  longitude: number;
}

export const CITY_COORDINATES: Record<string, CityCoordinate> = {
  "São Luís": { latitude: -2.5307, longitude: -44.3068 },
  "Imperatriz": { latitude: -5.5264, longitude: -47.4815 },
  "Barra do Corda": { latitude: -5.5033, longitude: -45.2422 },
  "Pinheiro": { latitude: -2.5218, longitude: -45.0834 },
  "Tuntum": { latitude: -5.2573, longitude: -44.6438 },
  "Viana": { latitude: -3.2201, longitude: -45.0036 },
  "Bacabal": { latitude: -4.2259, longitude: -44.7797 },
  "São José de Ribamar": { latitude: -2.5620, longitude: -44.0538 },
  "Santa Quitéria": { latitude: -3.5137, longitude: -42.7844 },
  "Timon": { latitude: -5.0945, longitude: -42.8378 },
  "São Mateus": { latitude: -4.0401, longitude: -44.4739 },
  "Chapadinha": { latitude: -3.7422, longitude: -43.3601 },
  "Araioses": { latitude: -2.8941, longitude: -41.9056 },
  "Balsas": { latitude: -7.5323, longitude: -46.0376 },
  "Caxias": { latitude: -4.8624, longitude: -43.3562 },
  "Paço do Lumiar": { latitude: -2.5297, longitude: -44.1039 },
  "Lago Verde": { latitude: -4.0041, longitude: -44.9785 },
};

// Default center of Maranhão (geographic center, close to Barra do Corda)
// MapLibre expects coordinates as [longitude, latitude].
export const MARANHAO_CENTER: [number, number] = [-45.0, -5.2];
export const DEFAULT_ZOOM = 6.2;
export const DETAIL_ZOOM = 11;

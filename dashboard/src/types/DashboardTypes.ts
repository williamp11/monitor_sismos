export interface Earthquake {
  id: string;
  time: string; // ISO 8601 en UTC
  latitude: number;
  longitude: number;
  depth: number | null;
  mag: number | null;
  magType: string | null;
  status: string | null; // "reviewed" | "automatic"
  place: string | null;
  region: string | null;
}

export interface EarthquakeWithDistance extends Earthquake {
  distanceKm: number;
}

export type RadiusKm = 100 | 500 | 1000;

export interface Filters {
  days: number; // 3, 7 o 10 últimos días
  minMag: number; // 2.5, 4 o 5
  region: string; // "Todas" o el nombre de la región
  nearMe: boolean;
  radiusKm: RadiusKm;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface SelectOption {
  value: string;
  label: string;
}
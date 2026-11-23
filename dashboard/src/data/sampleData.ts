import type { Coordinates, Earthquake, Filters, SelectOption } from '../types/DashboardTypes';
import records from './sampleEarthquakes.json';

/** Los 1941 sismos de data/earthquakes.json (Sprint 1). El dashboard muestra hasta los últimos 10 días. */
export const sampleEarthquakes = records as Earthquake[];

/** Fecha de corte del feed: se usa como "ahora" para los datos de ejemplo. */
export const REFERENCE_DATE = new Date('2026-11-19T02:30:00Z');

/** Ubicación de ejemplo del usuario (Guayaquil). En el Sprint 3 vendrá del navegador. */
export const SAMPLE_USER_LOCATION: Coordinates = { latitude: -2.17, longitude: -79.92 };
export const SAMPLE_USER_CITY = 'Guayaquil, Ecuador';

export const DEFAULT_FILTERS: Filters = {
  days: 10,
  minMag: 2.5,
  region: 'Todas',
  nearMe: false,
  radiusKm: 1000,
};

export const DAY_OPTIONS: SelectOption[] = [
  { value: '3', label: 'Últimos 3 días' },
  { value: '7', label: 'Últimos 7 días' },
  { value: '10', label: 'Últimos 10 días' },
];

export const MAG_OPTIONS: SelectOption[] = [
  { value: '2.5', label: '≥ 2.5' },
  { value: '4', label: '≥ 4.0' },
  { value: '5', label: '≥ 5.0' },
];
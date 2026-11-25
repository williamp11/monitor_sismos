import type { Coordinates, Filters, SelectOption } from '../types/DashboardTypes';

export const REFERENCE_DATE = new Date('2026-11-19T02:30:00Z');

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
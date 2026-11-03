import { useCallback, useEffect, useState } from 'react';

import { Coordinate, Court } from './types';

export const SEARCH_RADIUS_KM = 10;
const REQUEST_TIMEOUT_MS = 15_000;
// Two sources reporting courts this close together are describing the same court.
const DUPLICATE_KM = 0.15;

export const COURT_DATA_ATTRIBUTION =
  'Court locations from Mapbox and City of Toronto Open Data. Contains information licensed under the Open Government Licence – Toronto.';

// A court location from one of the data sources, before distance and app state are added.
interface Place {
  id: string;
  name: string;
  neighborhood: string;
  coordinate: Coordinate;
}

export function distanceKm(a: Coordinate, b: Coordinate) {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.latitude)) * Math.cos(toRad(b.latitude)) * Math.sin(dLon / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(h));
}

function formatDistance(km: number) {
  return km < 1 ? `${Math.round(km * 100) * 10} m` : `${km.toFixed(1)} km`;
}

async function fetchJson<T>(url: string): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) throw new Error(`Request failed (${response.status}): ${url.split('?')[0]}`);
    return (await response.json()) as T;
  } finally {
    clearTimeout(timer);
  }
}

const query = (params: Record<string, string>) =>
  Object.entries(params)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&');

// --- Mapbox Search Box category search: works anywhere, includes school and private courts, but is
// sparse (often missing park courts) and capped at 25 results.
// https://docs.mapbox.com/api/search/search-box/#category-search

const MAPBOX_URL = 'https://api.mapbox.com/search/searchbox/v1/category/basketball_court';
const GENERIC_NAME = /^(outdoor |indoor )?basketball courts?$/i;

interface MapboxFeature {
  geometry: { coordinates: [number, number] };
  properties: {
    mapbox_id: string;
    name: string;
    address?: string;
    place_formatted?: string;
    context?: Partial<Record<'neighborhood' | 'locality' | 'place', { name: string }>>;
  };
}

async function searchMapbox(origin: Coordinate): Promise<Place[]> {
  const token = process.env.EXPO_PUBLIC_MAPBOX_TOKEN;
  if (!token) throw new Error('Missing EXPO_PUBLIC_MAPBOX_TOKEN');

  const params = query({ proximity: `${origin.longitude},${origin.latitude}`, limit: '25', language: 'en', access_token: token });
  const { features } = await fetchJson<{ features: MapboxFeature[] }>(`${MAPBOX_URL}?${params}`);
  return features.map(({ properties, geometry }) => {
    const [longitude, latitude] = geometry.coordinates;
    const area = properties.context?.neighborhood?.name ?? properties.context?.locality?.name ?? properties.context?.place?.name;
    // Many courts are only named "Basketball court"; a street address (which starts with a number) tells
    // them apart. Some results have only a city in `address`, so those keep the generic name.
    const streetAddress = properties.address && /^\d/.test(properties.address) ? properties.address : undefined;
    return {
      id: properties.mapbox_id,
      name: GENERIC_NAME.test(properties.name.trim()) && streetAddress ? streetAddress : properties.name,
      neighborhood: area ?? properties.place_formatted ?? '',
      coordinate: { latitude, longitude },
    };
  });
}

// --- City of Toronto "Parks and Recreation Facilities" (refreshed monthly): every city park with a
// basketball court, but Toronto only and no school or private courts.
// https://open.toronto.ca/dataset/parks-and-recreation-facilities/

const TORONTO_URL = 'https://ckan0.cf.opendata.inter.prod-toronto.ca/api/3/action/datastore_search';
const TORONTO_RESOURCE_ID = 'e8cd0f4d-4910-42a0-81f9-cf8c2218753a';
const TORONTO_BOUNDS = { south: 43.57, north: 43.86, west: -79.64, east: -79.11 };

interface TorontoRecord {
  ASSET_ID: string;
  ASSET_NAME: string;
  ADDRESS: string | null;
  AMENITIES: string | null;
  geometry: string; // GeoJSON Point or MultiPoint, as a string
}

const inToronto = ({ latitude, longitude }: Coordinate) =>
  latitude >= TORONTO_BOUNDS.south && latitude <= TORONTO_BOUNDS.north && longitude >= TORONTO_BOUNDS.west && longitude <= TORONTO_BOUNDS.east;

// Names come in upper case ("MCGREGOR PARK").
const titleCase = (value: string) =>
  value
    .toLowerCase()
    .replace(/(^|[\s(/-])(\w)/g, (_, before: string, char: string) => before + char.toUpperCase())
    .replace(/\bMc(\w)/g, (_, char: string) => `Mc${char.toUpperCase()}`);

// The whole city list is ~120 courts (~30 KB), so fetch it once per session and filter on device.
let torontoCourts: Promise<Place[]> | null = null;

function fetchTorontoCourts(): Promise<Place[]> {
  torontoCourts ??= fetchJson<{ result: { records: TorontoRecord[] } }>(
    `${TORONTO_URL}?${query({
      resource_id: TORONTO_RESOURCE_ID,
      q: JSON.stringify({ AMENITIES: 'Basketball' }),
      fields: 'ASSET_ID,ASSET_NAME,ADDRESS,AMENITIES,geometry',
      limit: '1000',
    })}`,
  )
    .then(({ result }) =>
      result.records
        .filter((record) => record.AMENITIES?.includes('Basketball Court'))
        .map((record) => {
          const geometry = JSON.parse(record.geometry) as { type: string; coordinates: number[] | number[][] };
          const [longitude, latitude] = (geometry.type === 'Point' ? geometry.coordinates : geometry.coordinates[0]) as number[];
          return {
            id: `toronto:${record.ASSET_ID}`,
            name: titleCase(record.ASSET_NAME),
            neighborhood: record.ADDRESS ?? '',
            coordinate: { latitude: latitude!, longitude: longitude! },
          };
        }),
    )
    .catch((error) => {
      torontoCourts = null; // allow a retry
      throw error;
    });
  return torontoCourts;
}

export async function searchNearbyCourts(origin: Coordinate): Promise<Court[]> {
  const [mapbox, city] = await Promise.allSettled([searchMapbox(origin), inToronto(origin) ? fetchTorontoCourts() : Promise.resolve([])]);
  if (mapbox.status === 'rejected' && city.status === 'rejected') throw mapbox.reason;

  // One source failing still leaves useful results from the other.
  const cityPlaces = city.status === 'fulfilled' ? city.value : [];
  const mapboxPlaces = mapbox.status === 'fulfilled' ? mapbox.value : [];
  // City entries win duplicates: they are the park's official name.
  const places = [
    ...cityPlaces,
    ...mapboxPlaces.filter((place) => !cityPlaces.some((cityPlace) => distanceKm(cityPlace.coordinate, place.coordinate) < DUPLICATE_KM)),
  ];

  return places
    .map((place) => ({ place, km: distanceKm(origin, place.coordinate) }))
    .filter(({ km }) => km <= SEARCH_RADIUS_KM)
    .sort((a, b) => a.km - b.km)
    .map(({ place, km }) => ({ ...place, distance: formatDistance(km), currentPlayers: 0, king: null, leaderboard: [] }));
}

type CourtSearch =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'ready'; courts: Court[] };

// Keyed by origin rounded to ~100 m, so tab switches reuse results instead of re-querying.
const cache = new Map<string, Court[]>();
const cacheKey = ({ latitude, longitude }: Coordinate) => `${latitude.toFixed(3)},${longitude.toFixed(3)}`;

export function useNearbyCourts(origin: Coordinate | null) {
  const cachedCourts = origin ? cache.get(cacheKey(origin)) : undefined;
  const [search, setSearch] = useState<CourtSearch>(cachedCourts ? { status: 'ready', courts: cachedCourts } : { status: 'loading' });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!origin) return;
    const key = cacheKey(origin);
    const hit = cache.get(key);
    if (hit) {
      setSearch({ status: 'ready', courts: hit });
      return;
    }

    let active = true;
    setSearch({ status: 'loading' });
    searchNearbyCourts(origin)
      .then((courts) => {
        cache.set(key, courts);
        if (active) setSearch({ status: 'ready', courts });
      })
      .catch(() => {
        if (active) setSearch({ status: 'error' });
      });
    return () => {
      active = false;
    };
  }, [origin?.latitude, origin?.longitude, attempt]);

  const retry = useCallback(() => setAttempt((value) => value + 1), []);
  return { ...search, retry };
}

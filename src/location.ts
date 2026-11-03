import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { AppState } from 'react-native';

import { defaultLocation } from './mockData';
import { Coordinate } from './types';

export type LocationStatus = 'locating' | 'granted' | 'denied' | 'unavailable';

export interface CurrentLocation {
  status: LocationStatus;
  // The device position when granted, otherwise defaultLocation.
  coordinate: Coordinate | null;
}

const FIX_TIMEOUT_MS = 10_000;

// Screens unmount on tab switches; keep the result so we don't re-prompt or re-locate each time.
let cached: CurrentLocation | null = null;
// Shared so a remount or app-resume never starts a second lookup (or a second permission prompt).
let pending: Promise<CurrentLocation> | null = null;
// Mounted hooks, told when a fix lands after the lookup already gave up and fell back.
const listeners = new Set<(result: CurrentLocation) => void>();

function publish(result: CurrentLocation) {
  cached = result;
  listeners.forEach((listener) => listener(result));
}

async function locate(prompt: boolean): Promise<CurrentLocation> {
  try {
    // Only the first lookup may prompt. Re-checks just read the current permission: on Android the
    // prompt itself backgrounds and resumes the app, so prompting on resume would loop.
    const { status } = prompt ? await Location.requestForegroundPermissionsAsync() : await Location.getForegroundPermissionsAsync();
    if (status !== 'granted') return { status: 'denied', coordinate: defaultLocation };

    // A recent cached fix is instant, but only worth using if it's precise; Wi-Fi/cell fixes can be far off.
    const last = await Location.getLastKnownPositionAsync({ maxAge: 2 * 60_000, requiredAccuracy: 100 });
    if (last) return granted(last);

    // High uses GPS. Balanced on Android settles for Wi-Fi/cell and can place you blocks away.
    const fix = Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
    const position = await Promise.race([fix, new Promise<null>((resolve) => setTimeout(() => resolve(null), FIX_TIMEOUT_MS))]);
    if (position) return granted(position);

    // A cold GPS fix can outlast the timeout. Show the fallback now, then switch over when it arrives.
    fix.then((late) => publish(granted(late))).catch(() => {});
    return { status: 'unavailable', coordinate: defaultLocation };
  } catch {
    return { status: 'unavailable', coordinate: defaultLocation };
  }
}

function granted(position: Location.LocationObject): CurrentLocation {
  const { latitude, longitude } = position.coords;
  return { status: 'granted', coordinate: { latitude, longitude } };
}

function lookUp(prompt: boolean) {
  pending ??= locate(prompt).then((result) => {
    // A late fix may already have landed while a resume re-check was in flight; don't regress it.
    if (cached?.status === 'granted' && result.status !== 'granted') return cached;
    cached = result;
    pending = null;
    return result;
  });
  return pending;
}

export function useCurrentLocation(): CurrentLocation {
  const [location, setLocation] = useState<CurrentLocation>(cached ?? { status: 'locating', coordinate: null });

  useEffect(() => {
    let active = true;
    const update = (prompt: boolean) =>
      lookUp(prompt).then((result) => {
        if (active) setLocation(result);
      });

    if (!cached) update(true);
    const listener = (result: CurrentLocation) => {
      if (active) setLocation(result);
    };
    listeners.add(listener);

    // Pick up a permission granted in system Settings, or a GPS fix, when the user comes back to the app.
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active' && cached && cached.status !== 'granted') update(false);
    });
    return () => {
      active = false;
      listeners.delete(listener);
      subscription.remove();
    };
  }, []);

  return location;
}

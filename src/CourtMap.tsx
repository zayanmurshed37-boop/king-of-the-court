import Mapbox, { Camera, MapView, MarkerView } from '@rnmapbox/maps';
import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from './theme';
import { Coordinate, Court } from './types';

const accessToken = process.env.EXPO_PUBLIC_MAPBOX_TOKEN;
if (accessToken) Mapbox.setAccessToken(accessToken);

// Courts beyond these are still pinned, but the initial view frames only the closest few.
const FRAMED_COURTS = 6;

// Mapbox expects [longitude, latitude].
const toPosition = ({ latitude, longitude }: Coordinate) => [longitude, latitude];

// Frame every point, padded so pins and the overlay label stay inside the map.
function fitBounds(points: Coordinate[]) {
  const latitudes = points.map((point) => point.latitude);
  const longitudes = points.map((point) => point.longitude);
  return {
    ne: [Math.max(...longitudes), Math.max(...latitudes)],
    sw: [Math.min(...longitudes), Math.min(...latitudes)],
    paddingTop: 56,
    paddingBottom: 36,
    paddingLeft: 36,
    paddingRight: 36,
  };
}

export function CourtMap({
  center,
  showUser,
  courts,
  onSelectCourt,
}: {
  center: Coordinate;
  // False when falling back to the default location, so we don't pin a position that isn't the user's.
  showUser: boolean;
  courts: Court[];
  onSelectCourt: (id: string) => void;
}) {
  // Courts arrive sorted nearest-first.
  const bounds = useMemo(
    () => (courts.length ? fitBounds([center, ...courts.slice(0, FRAMED_COURTS).map((court) => court.coordinate)]) : undefined),
    [center, courts],
  );

  if (!accessToken) {
    return (
      <View style={styles.missing}>
        <Text style={styles.missingTitle}>Map unavailable</Text>
        <Text style={styles.missingText}>Set EXPO_PUBLIC_MAPBOX_TOKEN in .env, then restart Metro.</Text>
      </View>
    );
  }

  return (
    <MapView
      style={StyleSheet.absoluteFill}
      styleURL={Mapbox.StyleURL.Dark}
      scaleBarEnabled={false}
      // Hidden at the owner's request; note Mapbox's terms require the wordmark, so this risks the token.
      logoEnabled={false}
      // Keep the (i) attribution: OpenStreetMap's ODbL licence requires crediting the map data.
      attributionPosition={{ bottom: 8, left: 8 }}
      compassEnabled={false}
      pitchEnabled={false}
      rotateEnabled={false}
    >
      {bounds ? (
        <Camera bounds={bounds} animationDuration={0} />
      ) : (
        <Camera centerCoordinate={toPosition(center)} zoomLevel={13} animationDuration={0} />
      )}
      {courts.map((court) => {
        const active = court.currentPlayers > 0;
        return (
          <MarkerView key={court.id} coordinate={toPosition(court.coordinate)} allowOverlap>
            <Pressable
              onPress={() => onSelectCourt(court.id)}
              hitSlop={8}
              style={active ? styles.pin : styles.pinQuiet}
              accessibilityRole="button"
              accessibilityLabel={active ? `${court.name}, ${court.currentPlayers} players now` : court.name}
            >
              {active ? <Text style={styles.pinText}>{court.currentPlayers}</Text> : <View style={styles.pinDot} />}
            </Pressable>
          </MarkerView>
        );
      })}
      {showUser ? (
        <MarkerView coordinate={toPosition(center)} allowOverlap>
          <View style={styles.you} accessibilityLabel="Your location">
            <View style={styles.youInner} />
          </View>
        </MarkerView>
      ) : null}
    </MapView>
  );
}

const styles = StyleSheet.create({
  pin: { width: 42, height: 42, borderRadius: 21, backgroundColor: colors.orange, alignItems: 'center', justifyContent: 'center', borderWidth: 4, borderColor: '#FFB18F3A' },
  pinText: { color: colors.white, fontWeight: '900', fontSize: 13 },
  pinQuiet: { width: 24, height: 24, borderRadius: 12, backgroundColor: colors.orange, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: '#FFB18F3A' },
  pinDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.white },
  you: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#2489FF52', alignItems: 'center', justifyContent: 'center' },
  youInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#3B9AFF', borderWidth: 2, borderColor: colors.white },
  missing: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  missingTitle: { color: colors.text, fontSize: 14, fontWeight: '800' },
  missingText: { color: colors.muted, fontSize: 12, textAlign: 'center', marginTop: 6 },
});

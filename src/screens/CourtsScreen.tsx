import React, { useState } from 'react';
import { ActivityIndicator, Linking, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Avatar, Button, Card, Pill, Rating } from '../components';
import { CourtMap } from '../CourtMap';
import { LocationStatus, useCurrentLocation } from '../location';
import { COURT_DATA_ATTRIBUTION, SEARCH_RADIUS_KM, useNearbyCourts } from '../nearbyCourts';
import { colors } from '../theme';
import { Court } from '../types';

const locationCopy: Record<LocationStatus, string> = {
  locating: 'Finding your location…',
  granted: 'Basketball courts near you.',
  denied: 'Location is off, so these are courts near downtown Toronto.',
  unavailable: "Couldn't get your location, so these are courts near downtown Toronto.",
};

function directionsUrl({ coordinate: { latitude, longitude }, name }: Court) {
  const label = encodeURIComponent(name);
  return Platform.OS === 'ios'
    ? `maps:?ll=${latitude},${longitude}&q=${label}`
    : `geo:${latitude},${longitude}?q=${latitude},${longitude}(${label})`;
}

function CourtDetail({ court, onBack, notify }: { court: Court; onBack: () => void; notify: (message: string) => void }) {
  const { king, leaderboard } = court;
  const openDirections = () => Linking.openURL(directionsUrl(court)).catch(() => notify("Couldn't open a maps app."));

  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Pressable onPress={onBack} hitSlop={10} accessibilityRole="button"><Text style={styles.back}>‹ Nearby courts</Text></Pressable>
      <View style={styles.detailHero}>
        <View style={styles.kingMark}><Text style={styles.crown}>♛</Text></View>
        <Text style={styles.kingLabel}>KING OF THIS COURT</Text>
        {king ? (
          <>
            <Avatar player={king} size={74} />
            <Text style={styles.kingName}>{king.name}</Text>
            <Text style={styles.kingType}>{king.record}</Text>
            <View style={styles.kingRating}><Rating player={king} /></View>
            <Button label="Challenge the king" onPress={() => notify(`Challenge sent to ${king.name}.`)} />
            <Text style={styles.rule}>Beat the current king in a verified 1v1 at this court to take the crown.</Text>
          </>
        ) : (
          <>
            <View style={styles.vacantCrown}><Text style={styles.vacantCrownText}>♛</Text></View>
            <Text style={styles.kingName}>No king yet</Text>
            <Text style={styles.rule}>The first player to win a verified crown challenge here takes the title.</Text>
          </>
        )}
      </View>

      <View style={styles.courtTitleRow}>
        <View style={styles.titleCopy}>
          <Text style={styles.detailCourtName}>{court.name}</Text>
          <Text style={styles.detailMeta}>{[court.neighborhood, court.distance].filter(Boolean).join(' · ')}</Text>
        </View>
        {court.currentPlayers > 0 ? <Pill label={`${court.currentPlayers} here now`} tone="green" /> : <Pill label="No check-ins yet" />}
      </View>
      <View style={styles.directions}>
        <Button variant="secondary" label="Get directions" onPress={openDirections} />
      </View>

      <Text style={styles.leaderboardTitle}>COURT TOP 10</Text>
      <Card style={styles.leaderboard}>
        {leaderboard.length === 0 ? (
          <Text style={styles.emptyText}>No ranked games at this court yet.</Text>
        ) : (
          leaderboard.map((player, index) => (
            <View key={player.id} style={[styles.rankRow, index < leaderboard.length - 1 && styles.rankBorder]}>
              <Text style={[styles.rank, player.id === king?.id && styles.rankFirst]}>{player.id === king?.id ? '♛' : index + 1}</Text>
              <Avatar player={player} size={39} />
              <View style={styles.rankCopy}>
                <Text style={styles.rankName}>{player.name}{player.id === 'me' ? '  (You)' : ''}</Text>
                <Text style={styles.rankMeta}>{player.record}</Text>
              </View>
              <Rating player={player} small />
            </View>
          ))
        )}
      </Card>
    </ScrollView>
  );
}

function CourtCard({ court, onPress }: { court: Court; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => pressed && styles.pressed} accessibilityRole="button">
      <Card style={styles.courtCard}>
        <View style={styles.courtHeader}>
          <View style={styles.courtIcon}><Text style={styles.courtIconText}>◉</Text></View>
          <View style={styles.courtCopy}>
            <Text style={styles.courtName}>{court.name}</Text>
            <Text style={styles.courtMeta}>{[court.neighborhood, court.distance].filter(Boolean).join(' · ')}</Text>
          </View>
          {court.activity ? (
            <Pill label={court.activity} tone={court.activity === 'Hot' ? 'orange' : court.activity === 'Active' ? 'green' : 'default'} />
          ) : null}
        </View>
        <View style={styles.courtStats}>
          {court.currentPlayers > 0 ? (
            <Text style={styles.courtStat}><Text style={styles.courtStatStrong}>{court.currentPlayers}</Text> players now</Text>
          ) : (
            <Text style={styles.courtStat}>No check-ins yet</Text>
          )}
          {court.courts ? <Text style={styles.courtStat}><Text style={styles.courtStatStrong}>{court.courts}</Text> courts</Text> : null}
        </View>
        <View style={styles.kingRow}>
          <Text style={[styles.miniCrown, !court.king && styles.miniCrownVacant]}>♛</Text>
          {court.king ? (
            <>
              <Avatar player={court.king} size={32} />
              <Text style={styles.kingRowText}><Text style={styles.kingRowName}>{court.king.name}</Text> rules this court</Text>
            </>
          ) : (
            <Text style={[styles.kingRowText, styles.kingRowVacant]}>No king yet</Text>
          )}
          <Text style={styles.chevron}>›</Text>
        </View>
      </Card>
    </Pressable>
  );
}

export function CourtsScreen({ notify }: { notify: (message: string) => void }) {
  const location = useCurrentLocation();
  const search = useNearbyCourts(location.coordinate);
  const courts = search.status === 'ready' ? search.courts : [];
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = courts.find((court) => court.id === selectedId);

  if (selected) return <CourtDetail court={selected} onBack={() => setSelectedId(null)} notify={notify} />;

  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Text style={styles.kicker}>NEARBY COURTS</Text>
      <Text style={styles.title}>Who's on the court?</Text>
      <Text style={styles.subtitle}>{locationCopy[location.status]}</Text>
      {location.status === 'denied' ? (
        <Pressable onPress={() => Linking.openSettings()} hitSlop={8} accessibilityRole="button">
          <Text style={styles.enableLocation}>Turn on location</Text>
        </Pressable>
      ) : null}

      <View style={styles.map}>
        {location.coordinate ? (
          <>
            <CourtMap center={location.coordinate} showUser={location.status === 'granted'} courts={courts} onSelectCourt={setSelectedId} />
            {courts.length ? <Text style={styles.mapLabel} pointerEvents="none">Tap a court for details</Text> : null}
          </>
        ) : (
          <View style={styles.centered}><ActivityIndicator color={colors.orange} /></View>
        )}
      </View>

      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>Nearby courts</Text>
        {search.status === 'ready' ? <Text style={styles.location}>⌖ {courts.length} within {SEARCH_RADIUS_KM} km</Text> : null}
      </View>

      {search.status === 'loading' ? (
        <View style={styles.listState}>
          <ActivityIndicator color={colors.orange} />
          <Text style={styles.stateText}>Finding courts…</Text>
        </View>
      ) : search.status === 'error' ? (
        <Card style={styles.listState}>
          <Text style={styles.stateTitle}>Couldn't load courts</Text>
          <Text style={styles.stateText}>Check your connection and try again.</Text>
          <View style={styles.retry}><Button compact variant="secondary" label="Try again" onPress={search.retry} /></View>
        </Card>
      ) : courts.length === 0 ? (
        <Card style={styles.listState}>
          <Text style={styles.stateTitle}>No courts found</Text>
          <Text style={styles.stateText}>There are no basketball courts on the map within {SEARCH_RADIUS_KM} km.</Text>
        </Card>
      ) : (
        <>
          {courts.map((court) => <CourtCard key={court.id} court={court} onPress={() => setSelectedId(court.id)} />)}
          <Text style={styles.attribution}>{COURT_DATA_ATTRIBUTION}</Text>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 122 },
  kicker: { color: colors.orange, fontSize: 10, fontWeight: '900', letterSpacing: 1.8 },
  title: { color: colors.text, fontSize: 30, fontWeight: '900', letterSpacing: -1, marginTop: 6 },
  subtitle: { color: colors.muted, fontSize: 14, marginTop: 6 },
  map: { height: 340, borderRadius: 24, overflow: 'hidden', marginTop: 22, backgroundColor: '#161B17', borderWidth: 1, borderColor: colors.border },
  // Top-left so it never covers the Mapbox logo and attribution, which sit bottom-left/right.
  mapLabel: { position: 'absolute', left: 12, top: 12, color: colors.text, fontSize: 10, fontWeight: '700', backgroundColor: '#0A0A0AB3', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, overflow: 'hidden' },
  listHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 28, marginBottom: 13 },
  listTitle: { color: colors.text, fontSize: 18, fontWeight: '800' },
  location: { color: colors.orange, fontSize: 11, fontWeight: '700' },
  courtCard: { marginBottom: 12 },
  courtHeader: { flexDirection: 'row', alignItems: 'center' },
  courtIcon: { width: 45, height: 45, borderRadius: 14, backgroundColor: '#2C1C14', alignItems: 'center', justifyContent: 'center' },
  courtIconText: { color: colors.orange, fontSize: 22 },
  courtCopy: { flex: 1, marginLeft: 11 },
  courtName: { color: colors.text, fontSize: 15, fontWeight: '800' },
  courtMeta: { color: colors.muted, fontSize: 11, marginTop: 4 },
  courtStats: { flexDirection: 'row', gap: 24, paddingVertical: 15, marginTop: 14, borderTopWidth: 1, borderBottomWidth: 1, borderColor: colors.border },
  courtStat: { color: colors.muted, fontSize: 11 },
  courtStatStrong: { color: colors.text, fontWeight: '900', fontSize: 15 },
  kingRow: { flexDirection: 'row', alignItems: 'center', paddingTop: 14 },
  miniCrown: { color: colors.yellow, fontSize: 17, marginRight: 8 },
  kingRowText: { flex: 1, color: colors.muted, fontSize: 11, marginLeft: 8 },
  kingRowName: { color: colors.text, fontWeight: '800' },
  chevron: { color: colors.muted, fontSize: 25 },
  miniCrownVacant: { color: colors.muted },
  kingRowVacant: { marginLeft: 0 },
  pressed: { opacity: 0.72 },
  enableLocation: { color: colors.orange, fontSize: 13, fontWeight: '800', marginTop: 8 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  listState: { alignItems: 'center', paddingVertical: 24 },
  stateTitle: { color: colors.text, fontSize: 14, fontWeight: '800' },
  stateText: { color: colors.muted, fontSize: 12, textAlign: 'center', marginTop: 6 },
  retry: { marginTop: 14 },
  attribution: { color: colors.muted, fontSize: 10, lineHeight: 14, textAlign: 'center', marginTop: 8, paddingHorizontal: 12 },
  vacantCrown: { width: 74, height: 74, borderRadius: 37, borderWidth: 1.5, borderStyle: 'dashed', borderColor: colors.yellow, alignItems: 'center', justifyContent: 'center' },
  vacantCrownText: { color: colors.yellow, fontSize: 30 },
  directions: { marginTop: 16 },
  emptyText: { color: colors.muted, fontSize: 12, textAlign: 'center', paddingVertical: 18 },
  back: { color: colors.orange, fontSize: 14, fontWeight: '700', marginBottom: 16 },
  detailHero: { backgroundColor: '#181411', borderRadius: 26, padding: 20, alignItems: 'center', borderWidth: 1, borderColor: '#3B241A', overflow: 'hidden' },
  kingMark: { position: 'absolute', right: -25, top: -35, width: 120, height: 120, borderRadius: 60, backgroundColor: '#FF5A1F12', alignItems: 'center', justifyContent: 'center' },
  crown: { color: '#FF5A1F20', fontSize: 60 },
  kingLabel: { color: colors.yellow, fontSize: 10, fontWeight: '900', letterSpacing: 1.8, marginBottom: 13 },
  kingName: { color: colors.text, fontSize: 23, fontWeight: '900', marginTop: 12 },
  kingType: { color: colors.muted, fontSize: 11, marginTop: 4 },
  kingRating: { position: 'absolute', top: 49, right: 28 },
  rule: { color: colors.muted, fontSize: 10, textAlign: 'center', lineHeight: 15, marginTop: 12, paddingHorizontal: 18 },
  courtTitleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 26 },
  titleCopy: { flex: 1, marginRight: 12 },
  detailCourtName: { color: colors.text, fontSize: 19, fontWeight: '900' },
  detailMeta: { color: colors.muted, fontSize: 11, marginTop: 4 },
  leaderboardTitle: { color: colors.muted, fontSize: 10, fontWeight: '900', letterSpacing: 1.6, marginTop: 27, marginBottom: 11 },
  leaderboard: { paddingVertical: 4 },
  rankRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  rankBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  rank: { color: colors.muted, width: 27, fontSize: 14, fontWeight: '900' },
  rankFirst: { color: colors.yellow },
  rankCopy: { flex: 1, marginLeft: 10 },
  rankName: { color: colors.text, fontSize: 13, fontWeight: '800' },
  rankMeta: { color: colors.muted, fontSize: 9, marginTop: 4 },
});

import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Avatar, Button, Card, Pill, Rating } from '../components';
import { courts } from '../mockData';
import { colors, radius } from '../theme';

export function CourtsScreen({ notify }: { notify: (message: string) => void }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = courts.find((court) => court.id === selectedId);

  if (selected) {
    return (
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Pressable onPress={() => setSelectedId(null)} hitSlop={10}><Text style={styles.back}>‹ Nearby courts</Text></Pressable>
        <View style={styles.detailHero}>
          <View style={styles.kingMark}><Text style={styles.crown}>♛</Text></View>
          <Text style={styles.kingLabel}>KING OF THIS COURT</Text>
          <Avatar player={selected.king} size={74} />
          <Text style={styles.kingName}>{selected.king.name}</Text>
          <Text style={styles.kingType}>{selected.king.archetype} · {selected.king.record}</Text>
          <View style={styles.kingRating}><Rating value={selected.king.rating} /></View>
          <Button label="Challenge the king" onPress={() => notify(`Challenge sent to ${selected.king.name}.`)} />
          <Text style={styles.rule}>Beat the current king in a verified 1v1 at this court to take the crown.</Text>
        </View>

        <View style={styles.courtTitleRow}>
          <View>
            <Text style={styles.detailCourtName}>{selected.name}</Text>
            <Text style={styles.detailMeta}>{selected.neighborhood} · {selected.distance}</Text>
          </View>
          <Pill label={`${selected.currentPlayers} here now`} tone="green" />
        </View>

        <Text style={styles.leaderboardTitle}>COURT TOP 10</Text>
        <Card style={styles.leaderboard}>
          {selected.leaderboard.map((player, index) => (
            <View key={player.id} style={[styles.rankRow, index < selected.leaderboard.length - 1 && styles.rankBorder]}>
              <Text style={[styles.rank, index === 0 && styles.rankFirst]}>{index === 0 ? '♛' : index + 1}</Text>
              <Avatar player={player} size={39} />
              <View style={styles.rankCopy}>
                <Text style={styles.rankName}>{player.name}{player.id === 'me' ? '  (You)' : ''}</Text>
                <Text style={styles.rankMeta}>{player.wins} wins · {player.archetype}</Text>
              </View>
              <Rating value={player.rating} small />
            </View>
          ))}
          <Pressable onPress={() => notify('The full top 10 will load from the court leaderboard API.')}><Text style={styles.viewTen}>View complete top 10</Text></Pressable>
        </Card>
      </ScrollView>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Text style={styles.kicker}>LIVE COURTS</Text>
      <Text style={styles.title}>Who's on the court?</Text>
      <Text style={styles.subtitle}>Live activity near downtown Toronto.</Text>

      <View style={styles.map}>
        <View style={styles.mapRoadOne} />
        <View style={styles.mapRoadTwo} />
        <View style={styles.mapRoadThree} />
        <View style={[styles.pin, { left: '23%', top: '44%' }]}><Text style={styles.pinText}>18</Text></View>
        <View style={[styles.pin, { left: '60%', top: '25%' }]}><Text style={styles.pinText}>9</Text></View>
        <View style={[styles.pin, { left: '70%', top: '66%' }]}><Text style={styles.pinText}>4</Text></View>
        <View style={styles.you}><View style={styles.youInner} /></View>
        <Text style={styles.mapLabel}>Tap a court below for rankings</Text>
      </View>

      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>Nearby courts</Text>
        <Text style={styles.location}>⌖ Within 5 km</Text>
      </View>
      {courts.map((court) => (
        <Pressable key={court.id} onPress={() => setSelectedId(court.id)} style={({ pressed }) => pressed && styles.pressed}>
          <Card style={styles.courtCard}>
            <View style={styles.courtHeader}>
              <View style={styles.courtIcon}><Text style={styles.courtIconText}>◉</Text></View>
              <View style={styles.courtCopy}>
                <Text style={styles.courtName}>{court.name}</Text>
                <Text style={styles.courtMeta}>{court.neighborhood} · {court.distance}</Text>
              </View>
              <Pill label={court.activity} tone={court.activity === 'Hot' ? 'orange' : court.activity === 'Active' ? 'green' : 'default'} />
            </View>
            <View style={styles.courtStats}>
              <Text style={styles.courtStat}><Text style={styles.courtStatStrong}>{court.currentPlayers}</Text> players now</Text>
              <Text style={styles.courtStat}><Text style={styles.courtStatStrong}>{court.courts}</Text> courts</Text>
            </View>
            <View style={styles.kingRow}>
              <Text style={styles.miniCrown}>♛</Text>
              <Avatar player={court.king} size={32} />
              <Text style={styles.kingRowText}><Text style={styles.kingRowName}>{court.king.name}</Text> rules this court</Text>
              <Text style={styles.chevron}>›</Text>
            </View>
          </Card>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 122 },
  kicker: { color: colors.orange, fontSize: 10, fontWeight: '900', letterSpacing: 1.8 },
  title: { color: colors.text, fontSize: 30, fontWeight: '900', letterSpacing: -1, marginTop: 6 },
  subtitle: { color: colors.muted, fontSize: 14, marginTop: 6 },
  map: { height: 218, borderRadius: 24, overflow: 'hidden', marginTop: 22, backgroundColor: '#161B17', borderWidth: 1, borderColor: colors.border },
  mapRoadOne: { position: 'absolute', width: '140%', height: 16, backgroundColor: '#2C302D', top: 86, left: -55, transform: [{ rotate: '-13deg' }] },
  mapRoadTwo: { position: 'absolute', width: 18, height: '140%', backgroundColor: '#2C302D', top: -35, left: '52%', transform: [{ rotate: '18deg' }] },
  mapRoadThree: { position: 'absolute', width: '120%', height: 9, backgroundColor: '#262B27', top: 160, left: -20, transform: [{ rotate: '8deg' }] },
  pin: { position: 'absolute', width: 42, height: 42, borderRadius: 21, backgroundColor: colors.orange, alignItems: 'center', justifyContent: 'center', borderWidth: 4, borderColor: '#FFB18F3A' },
  pinText: { color: colors.white, fontWeight: '900', fontSize: 13 },
  you: { position: 'absolute', left: '42%', top: '55%', width: 24, height: 24, borderRadius: 12, backgroundColor: '#2489FF52', alignItems: 'center', justifyContent: 'center' },
  youInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#3B9AFF', borderWidth: 2, borderColor: colors.white },
  mapLabel: { position: 'absolute', left: 13, bottom: 12, color: colors.muted, fontSize: 10, fontWeight: '700' },
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
  pressed: { opacity: 0.72 },
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
  viewTen: { color: colors.orange, textAlign: 'center', fontSize: 12, fontWeight: '800', paddingVertical: 13 },
});

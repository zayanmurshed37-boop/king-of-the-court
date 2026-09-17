import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Avatar, Button, Card, Pill, Rating, SectionHeader } from '../components';
import { courts, currentPlayer, openGames } from '../mockData';
import { colors, radius } from '../theme';

export function HomeScreen({ navigate, notify }: { navigate: (tab: string) => void; notify: (message: string) => void }) {
  const nextGame = openGames[0]!;
  const nearestCourt = courts[0]!;

  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.eyebrowRow}>
        <Text style={styles.eyebrow}>FRIDAY, AUG 28</Text>
        <View style={styles.liveDot} />
        <Text style={styles.liveText}>18 nearby</Text>
      </View>
      <Text style={styles.greeting}>Ready to run, Marcus?</Text>
      <Text style={styles.subline}>Your next game is closer than you think.</Text>

      <View style={styles.ratingHero}>
        <View style={styles.ratingGlow} />
        <View style={styles.heroTop}>
          <View>
            <Text style={styles.heroLabel}>MY PLAYER</Text>
            <Text style={styles.heroName}>{currentPlayer.name}</Text>
            <Text style={styles.heroArchetype}>{currentPlayer.archetype}</Text>
          </View>
          <Rating value={currentPlayer.rating} />
        </View>
        <View style={styles.heroStats}>
          <View><Text style={styles.statValue}>38–12</Text><Text style={styles.statLabel}>RECORD</Text></View>
          <View style={styles.statDivider} />
          <View><Text style={styles.statValue}>76%</Text><Text style={styles.statLabel}>WIN RATE</Text></View>
          <View style={styles.statDivider} />
          <View><Text style={styles.statValue}>#3</Text><Text style={styles.statLabel}>HOME COURT</Text></View>
        </View>
      </View>

      <View style={styles.quickRow}>
        <Pressable style={styles.quickCard} onPress={() => navigate('Discover')}>
          <Text style={styles.quickIcon}>⚡</Text>
          <Text style={styles.quickTitle}>Find a game</Text>
          <Text style={styles.quickCaption}>Players ready now</Text>
        </Pressable>
        <Pressable style={styles.quickCard} onPress={() => navigate('Courts')}>
          <Text style={styles.quickIcon}>⌖</Text>
          <Text style={styles.quickTitle}>Check courts</Text>
          <Text style={styles.quickCaption}>See who's hooping</Text>
        </Pressable>
      </View>

      <SectionHeader title="Up next" action="View games" onPress={() => navigate('Discover')} />
      <Card>
        <View style={styles.gameTop}>
          <Pill label={nextGame.mode} tone="orange" />
          <Text style={styles.gameTime}>Starts in {nextGame.startsIn}</Text>
        </View>
        <Text style={styles.gameCourt}>{nextGame.court}</Text>
        <Text style={styles.gameMeta}>{nextGame.distance} away · {nextGame.spots} spots open · {nextGame.skillRange}</Text>
        <View style={styles.hostRow}>
          <Avatar player={nextGame.host} size={38} />
          <View style={styles.hostCopy}>
            <Text style={styles.hostLabel}>HOSTED BY</Text>
            <Text style={styles.hostName}>{nextGame.host.name} · {nextGame.host.rating} OVR</Text>
          </View>
          <Button compact label="Join run" onPress={() => notify("You're in. Game added to your runs.")} />
        </View>
      </Card>

      <SectionHeader title="Happening nearby" action="All courts" onPress={() => navigate('Courts')} />
      <Pressable onPress={() => navigate('Courts')}>
        <Card style={styles.courtCard}>
          <View style={styles.courtVisual}>
            <View style={styles.courtLine} />
            <View style={styles.courtCircle} />
            <Text style={styles.courtBall}>●</Text>
          </View>
          <View style={styles.courtInfo}>
            <View style={styles.gameTop}>
              <Pill label={`${nearestCourt.currentPlayers} playing`} tone="green" />
              <Text style={styles.distance}>{nearestCourt.distance}</Text>
            </View>
            <Text style={styles.courtName}>{nearestCourt.name}</Text>
            <Text style={styles.gameMeta}>♛ {nearestCourt.king.name} rules this court</Text>
          </View>
        </Card>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, paddingBottom: 122 },
  eyebrowRow: { flexDirection: 'row', alignItems: 'center', marginTop: 16, marginBottom: 10 },
  eyebrow: { color: colors.muted, fontSize: 11, fontWeight: '800', letterSpacing: 1.5 },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.green, marginLeft: 12, marginRight: 5 },
  liveText: { color: colors.green, fontSize: 11, fontWeight: '700' },
  greeting: { color: colors.text, fontSize: 31, lineHeight: 35, fontWeight: '900', letterSpacing: -1.1 },
  subline: { color: colors.muted, fontSize: 15, marginTop: 7, marginBottom: 22 },
  ratingHero: { overflow: 'hidden', backgroundColor: '#181411', borderRadius: 24, borderWidth: 1, borderColor: '#3B241A', padding: 18 },
  ratingGlow: { position: 'absolute', width: 180, height: 180, borderRadius: 90, backgroundColor: '#FF5A1F18', right: -45, top: -80 },
  heroTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  heroLabel: { color: colors.orange, fontSize: 10, letterSpacing: 1.7, fontWeight: '900' },
  heroName: { color: colors.text, fontSize: 20, fontWeight: '900', marginTop: 5 },
  heroArchetype: { color: colors.muted, fontSize: 12, marginTop: 3 },
  heroStats: { flexDirection: 'row', marginTop: 24, alignItems: 'center', justifyContent: 'space-between' },
  statValue: { color: colors.text, fontSize: 17, fontWeight: '900' },
  statLabel: { color: colors.muted, fontSize: 8, fontWeight: '800', letterSpacing: 1, marginTop: 3 },
  statDivider: { width: 1, height: 25, backgroundColor: colors.border },
  quickRow: { flexDirection: 'row', gap: 12, marginTop: 14 },
  quickCard: { flex: 1, backgroundColor: colors.surface, borderRadius: radius.large, borderWidth: 1, borderColor: colors.border, padding: 15 },
  quickIcon: { fontSize: 21, color: colors.orange },
  quickTitle: { color: colors.text, fontWeight: '800', fontSize: 14, marginTop: 10 },
  quickCaption: { color: colors.muted, fontSize: 11, marginTop: 4 },
  gameTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  gameTime: { color: colors.green, fontSize: 12, fontWeight: '700' },
  gameCourt: { color: colors.text, fontSize: 19, fontWeight: '900', marginTop: 14 },
  gameMeta: { color: colors.muted, fontSize: 12, marginTop: 5 },
  hostRow: { flexDirection: 'row', alignItems: 'center', borderTopWidth: 1, borderTopColor: colors.border, marginTop: 17, paddingTop: 15 },
  hostCopy: { flex: 1, marginLeft: 10 },
  hostLabel: { color: colors.muted, fontSize: 8, fontWeight: '800', letterSpacing: 1 },
  hostName: { color: colors.text, fontSize: 12, fontWeight: '700', marginTop: 3 },
  courtCard: { padding: 0, overflow: 'hidden' },
  courtVisual: { height: 92, backgroundColor: '#683419', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  courtLine: { position: 'absolute', width: '100%', height: 1, backgroundColor: '#FFFFFF52' },
  courtCircle: { width: 74, height: 74, borderRadius: 37, borderWidth: 1, borderColor: '#FFFFFF52' },
  courtBall: { position: 'absolute', color: colors.orange, fontSize: 30 },
  courtInfo: { padding: 16 },
  distance: { color: colors.muted, fontSize: 12, fontWeight: '700' },
  courtName: { color: colors.text, fontSize: 18, fontWeight: '900', marginTop: 12 },
});

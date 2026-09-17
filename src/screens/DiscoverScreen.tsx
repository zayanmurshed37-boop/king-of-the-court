import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Avatar, Button, Card, Pill, Rating } from '../components';
import { openGames } from '../mockData';
import { colors, radius } from '../theme';

type Filter = 'All' | '1v1' | 'Team';

export function DiscoverScreen({ notify }: { notify: (message: string) => void }) {
  const [filter, setFilter] = useState<Filter>('All');
  const [joined, setJoined] = useState<string[]>([]);
  const visibleGames = useMemo(() => openGames.filter((game) => filter === 'All' || (filter === '1v1' ? game.mode === '1v1' : game.mode !== '1v1')), [filter]);

  const join = (id: string) => {
    setJoined((value) => [...value, id]);
    notify('Match request sent to the host.');
  };

  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Text style={styles.kicker}>MATCHMAKER</Text>
      <Text style={styles.title}>Find your next run</Text>
      <Text style={styles.subtitle}>Games within 5 km that fit your rating.</Text>

      <View style={styles.modeRow}>
        {(['All', '1v1', 'Team'] as Filter[]).map((item) => (
          <Pressable key={item} onPress={() => setFilter(item)} style={[styles.mode, filter === item && styles.modeActive]}>
            <Text style={[styles.modeText, filter === item && styles.modeTextActive]}>{item}</Text>
          </Pressable>
        ))}
      </View>

      <Pressable style={styles.createBanner} onPress={() => notify('Game creation flow ready for backend connection.')}>
        <View>
          <Text style={styles.createEyebrow}>CAN'T FIND THE RIGHT RUN?</Text>
          <Text style={styles.createTitle}>Create your own game</Text>
        </View>
        <Text style={styles.arrow}>＋</Text>
      </Pressable>

      <View style={styles.resultRow}>
        <Text style={styles.resultTitle}>{visibleGames.length} games near you</Text>
        <Text style={styles.sort}>Nearest first⌄</Text>
      </View>

      {visibleGames.map((game) => {
        const isJoined = joined.includes(game.id);
        return (
          <Card key={game.id} style={styles.gameCard}>
            <View style={styles.gameHeader}>
              <View style={styles.modeBadge}><Text style={styles.modeBadgeText}>{game.mode}</Text></View>
              <View style={styles.gameHeaderCopy}>
                <Text style={styles.court}>{game.court}</Text>
                <Text style={styles.distance}>{game.distance} · {game.startsIn}</Text>
              </View>
              <Pill label={game.competitive ? 'Ranked' : 'Casual'} tone={game.competitive ? 'orange' : 'green'} />
            </View>
            <View style={styles.gameDetails}>
              <View><Text style={styles.detailValue}>{game.spots}</Text><Text style={styles.detailLabel}>SPOTS LEFT</Text></View>
              <View><Text style={styles.detailValue}>{game.skillRange}</Text><Text style={styles.detailLabel}>SKILL RANGE</Text></View>
            </View>
            <View style={styles.hostRow}>
              <Avatar player={game.host} size={44} />
              <View style={styles.hostCopy}>
                <Text style={styles.hostName}>{game.host.name}</Text>
                <Text style={styles.hostType}>{game.host.archetype}</Text>
              </View>
              <Rating value={game.host.rating} small />
            </View>
            <Button label={isJoined ? 'Request sent' : game.mode === '1v1' ? 'Accept challenge' : 'Request to join'} onPress={() => join(game.id)} disabled={isJoined} />
          </Card>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 122 },
  kicker: { color: colors.orange, fontSize: 10, fontWeight: '900', letterSpacing: 1.8 },
  title: { color: colors.text, fontSize: 30, fontWeight: '900', letterSpacing: -1, marginTop: 6 },
  subtitle: { color: colors.muted, fontSize: 14, marginTop: 6 },
  modeRow: { flexDirection: 'row', gap: 8, marginTop: 23 },
  mode: { paddingHorizontal: 20, paddingVertical: 11, borderRadius: radius.pill, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  modeActive: { backgroundColor: colors.text, borderColor: colors.text },
  modeText: { color: colors.muted, fontSize: 13, fontWeight: '800' },
  modeTextActive: { color: colors.black },
  createBanner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 18, padding: 17, borderRadius: radius.large, backgroundColor: colors.orangeSoft, borderWidth: 1, borderColor: '#71331D' },
  createEyebrow: { color: colors.orange, fontSize: 9, fontWeight: '900', letterSpacing: 1.2 },
  createTitle: { color: colors.text, fontSize: 16, fontWeight: '800', marginTop: 5 },
  arrow: { color: colors.orange, fontSize: 28 },
  resultRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 28, marginBottom: 12 },
  resultTitle: { color: colors.text, fontSize: 17, fontWeight: '800' },
  sort: { color: colors.muted, fontSize: 11 },
  gameCard: { marginBottom: 12 },
  gameHeader: { flexDirection: 'row', alignItems: 'center' },
  modeBadge: { width: 49, height: 49, borderRadius: 15, backgroundColor: colors.orangeSoft, alignItems: 'center', justifyContent: 'center' },
  modeBadgeText: { color: colors.orange, fontWeight: '900', fontSize: 15 },
  gameHeaderCopy: { flex: 1, marginLeft: 11 },
  court: { color: colors.text, fontSize: 15, fontWeight: '800' },
  distance: { color: colors.muted, fontSize: 11, marginTop: 4 },
  gameDetails: { flexDirection: 'row', gap: 38, marginVertical: 18, paddingVertical: 15, borderTopWidth: 1, borderBottomWidth: 1, borderColor: colors.border },
  detailValue: { color: colors.text, fontSize: 15, fontWeight: '900' },
  detailLabel: { color: colors.muted, fontSize: 8, fontWeight: '800', letterSpacing: 1, marginTop: 4 },
  hostRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  hostCopy: { flex: 1, marginLeft: 10 },
  hostName: { color: colors.text, fontSize: 14, fontWeight: '800' },
  hostType: { color: colors.muted, fontSize: 10, marginTop: 3 },
});

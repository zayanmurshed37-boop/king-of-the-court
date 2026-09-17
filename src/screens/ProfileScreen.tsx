import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Avatar, Button, Card, Rating } from '../components';
import { currentPlayer, friends } from '../mockData';
import { colors } from '../theme';

const attributes = [
  ['Finishing', 81],
  ['Shooting', 87],
  ['Playmaking', 84],
  ['Defense', 86],
  ['Rebounding', 74],
] as const;

export function ProfileScreen({ notify }: { notify: (message: string) => void }) {
  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.headerActions}>
        <Text style={styles.kicker}>PLAYER CARD</Text>
        <Pressable onPress={() => notify('Profile settings opened.')}><Text style={styles.settings}>⚙</Text></Pressable>
      </View>
      <View style={styles.identity}>
        <Avatar player={currentPlayer} size={80} />
        <View style={styles.identityCopy}>
          <Text style={styles.name}>{currentPlayer.name}</Text>
          <Text style={styles.handle}>{currentPlayer.handle}</Text>
          <Text style={styles.home}>⌖ Christie Pits · Toronto</Text>
        </View>
        <Rating value={currentPlayer.rating} />
      </View>

      <Card style={styles.archetypeCard}>
        <View>
          <Text style={styles.label}>ARCHETYPE</Text>
          <Text style={styles.archetype}>{currentPlayer.archetype}</Text>
        </View>
        <View style={styles.level}><Text style={styles.levelText}>LVL 18</Text></View>
        <View style={styles.progressTrack}><View style={styles.progress} /></View>
        <Text style={styles.progressText}>1,280 XP to level 19</Text>
      </Card>

      <View style={styles.statsRow}>
        <View><Text style={styles.statValue}>38</Text><Text style={styles.statLabel}>WINS</Text></View>
        <View><Text style={styles.statValue}>12</Text><Text style={styles.statLabel}>LOSSES</Text></View>
        <View><Text style={styles.statValue}>8</Text><Text style={styles.statLabel}>COURTS</Text></View>
        <View><Text style={[styles.statValue, styles.orange]}>2</Text><Text style={styles.statLabel}>CROWNS</Text></View>
      </View>

      <Text style={styles.sectionTitle}>Player attributes</Text>
      <Card>
        {attributes.map(([label, value], index) => (
          <View key={label} style={[styles.attribute, index < attributes.length - 1 && styles.attributeBorder]}>
            <Text style={styles.attributeName}>{label}</Text>
            <View style={styles.attributeTrack}><View style={[styles.attributeFill, { width: `${value}%` }]} /></View>
            <Text style={styles.attributeValue}>{value}</Text>
          </View>
        ))}
      </Card>

      <View style={styles.sectionRow}>
        <Text style={styles.sectionTitleNoMargin}>Friends</Text>
        <Pressable onPress={() => notify('Friend search opened.')}><Text style={styles.addFriend}>＋ Add friend</Text></Pressable>
      </View>
      <Card>
        {friends.map((friend, index) => (
          <View key={friend.id} style={[styles.friendRow, index < friends.length - 1 && styles.attributeBorder]}>
            <Avatar player={friend} size={40} />
            <View style={styles.friendCopy}>
              <Text style={styles.friendName}>{friend.name}</Text>
              <Text style={styles.friendMeta}>{friend.handle} · {friend.rating} OVR</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </View>
        ))}
      </Card>

      <Button variant="secondary" label="Share player card" onPress={() => notify('Player card ready to share.')} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 122 },
  headerActions: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  kicker: { color: colors.orange, fontSize: 10, fontWeight: '900', letterSpacing: 1.8 },
  settings: { color: colors.muted, fontSize: 20 },
  identity: { flexDirection: 'row', alignItems: 'center', marginTop: 16 },
  identityCopy: { flex: 1, marginLeft: 14 },
  name: { color: colors.text, fontSize: 21, fontWeight: '900' },
  handle: { color: colors.muted, fontSize: 11, marginTop: 3 },
  home: { color: colors.muted, fontSize: 10, marginTop: 8 },
  archetypeCard: { marginTop: 20 },
  label: { color: colors.muted, fontSize: 9, fontWeight: '900', letterSpacing: 1.4 },
  archetype: { color: colors.text, fontSize: 17, fontWeight: '900', marginTop: 5 },
  level: { position: 'absolute', top: 16, right: 16, backgroundColor: colors.orangeSoft, borderRadius: 10, paddingHorizontal: 9, paddingVertical: 6 },
  levelText: { color: colors.orange, fontSize: 10, fontWeight: '900' },
  progressTrack: { height: 5, backgroundColor: colors.border, borderRadius: 3, marginTop: 18, overflow: 'hidden' },
  progress: { height: 5, width: '68%', backgroundColor: colors.orange, borderRadius: 3 },
  progressText: { color: colors.muted, fontSize: 9, marginTop: 6, textAlign: 'right' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 24 },
  statValue: { color: colors.text, fontSize: 22, fontWeight: '900', textAlign: 'center' },
  statLabel: { color: colors.muted, fontSize: 8, fontWeight: '800', letterSpacing: 1, marginTop: 4 },
  orange: { color: colors.orange },
  sectionTitle: { color: colors.text, fontSize: 18, fontWeight: '800', marginTop: 29, marginBottom: 12 },
  attribute: { flexDirection: 'row', alignItems: 'center', paddingVertical: 11 },
  attributeBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  attributeName: { color: colors.text, fontSize: 12, fontWeight: '700', width: 90 },
  attributeTrack: { flex: 1, height: 5, backgroundColor: colors.border, borderRadius: 3, overflow: 'hidden' },
  attributeFill: { height: 5, backgroundColor: colors.orange, borderRadius: 3 },
  attributeValue: { color: colors.text, width: 30, textAlign: 'right', fontSize: 12, fontWeight: '900' },
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 29, marginBottom: 12 },
  sectionTitleNoMargin: { color: colors.text, fontSize: 18, fontWeight: '800' },
  addFriend: { color: colors.orange, fontSize: 12, fontWeight: '800' },
  friendRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 11 },
  friendCopy: { flex: 1, marginLeft: 11 },
  friendName: { color: colors.text, fontSize: 13, fontWeight: '800' },
  friendMeta: { color: colors.muted, fontSize: 10, marginTop: 3 },
  chevron: { color: colors.muted, fontSize: 24 },
});

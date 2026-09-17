import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Avatar, Button, Card, Rating } from '../components';
import { friends, squad } from '../mockData';
import { colors, radius } from '../theme';
import { GameMode } from '../types';

const sizes: GameMode[] = ['2v2', '3v3', '4v4', '5v5'];

export function SquadScreen({ notify }: { notify: (message: string) => void }) {
  const [mode, setMode] = useState<GameMode>(squad.mode);
  const [invited, setInvited] = useState<string[]>([]);

  const invite = (id: string, name: string) => {
    setInvited((value) => [...value, id]);
    notify(`Invite sent to ${name}.`);
  };

  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Text style={styles.kicker}>MY SQUAD</Text>
      <View style={styles.titleRow}>
        <View>
          <Text style={styles.title}>{squad.name}</Text>
          <Text style={styles.subtitle}>{squad.wins}–{squad.losses} · 75% win rate</Text>
        </View>
        <Pressable style={styles.edit} onPress={() => notify('Squad settings opened.')}><Text style={styles.editText}>•••</Text></Pressable>
      </View>

      <Card style={styles.recordCard}>
        <View><Text style={styles.recordValue}>{squad.wins}</Text><Text style={styles.recordLabel}>WINS</Text></View>
        <View style={styles.divider} />
        <View><Text style={styles.recordValue}>{squad.losses}</Text><Text style={styles.recordLabel}>LOSSES</Text></View>
        <View style={styles.divider} />
        <View><Text style={[styles.recordValue, styles.orange]}>87</Text><Text style={styles.recordLabel}>TEAM OVR</Text></View>
      </Card>

      <Text style={styles.sectionLabel}>GAME SIZE</Text>
      <View style={styles.sizeRow}>
        {sizes.map((size) => (
          <Pressable key={size} style={[styles.size, mode === size && styles.sizeActive]} onPress={() => setMode(size)}>
            <Text style={[styles.sizeText, mode === size && styles.sizeTextActive]}>{size}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Starting lineup</Text>
        <Text style={styles.count}>{squad.members.length}/{mode.charAt(0)}</Text>
      </View>
      {squad.members.map((member, index) => (
        <Card key={member.id} style={styles.memberCard}>
          <Text style={styles.position}>{index + 1}</Text>
          <Avatar player={member} />
          <View style={styles.memberCopy}>
            <Text style={styles.memberName}>{member.name}{member.id === 'me' ? '  (Captain)' : ''}</Text>
            <Text style={styles.memberType}>{member.archetype}</Text>
          </View>
          <Rating value={member.rating} small />
        </Card>
      ))}

      {squad.members.length < Number(mode[0]) ? (
        <View style={styles.openSpot}>
          <Text style={styles.plus}>＋</Text>
          <Text style={styles.openTitle}>{Number(mode[0]) - squad.members.length} open roster {Number(mode[0]) - squad.members.length === 1 ? 'spot' : 'spots'}</Text>
          <Text style={styles.openCaption}>Invite a friend below</Text>
        </View>
      ) : null}

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Friends ready to play</Text>
        <Text style={styles.online}>{friends.filter((friend) => friend.online).length} online</Text>
      </View>
      {friends.map((friend) => {
        const wasInvited = invited.includes(friend.id);
        return (
          <View key={friend.id} style={styles.friendRow}>
            <Avatar player={friend} size={42} />
            <View style={styles.memberCopy}>
              <Text style={styles.memberName}>{friend.name}</Text>
              <Text style={styles.memberType}>{friend.rating} OVR · {friend.archetype}</Text>
            </View>
            <Button compact variant={wasInvited ? 'secondary' : 'primary'} label={wasInvited ? 'Invited' : 'Invite'} disabled={wasInvited} onPress={() => invite(friend.id, friend.name)} />
          </View>
        );
      })}

      <Button label="Find an opponent" onPress={() => notify(`Searching for another ${mode} squad nearby.`)} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 122 },
  kicker: { color: colors.orange, fontSize: 10, fontWeight: '900', letterSpacing: 1.8 },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 5 },
  title: { color: colors.text, fontSize: 30, fontWeight: '900', letterSpacing: -1 },
  subtitle: { color: colors.muted, fontSize: 13, marginTop: 5 },
  edit: { width: 42, height: 42, borderRadius: 14, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border },
  editText: { color: colors.text, fontWeight: '900', letterSpacing: 2 },
  recordCard: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginTop: 22 },
  recordValue: { color: colors.text, fontSize: 25, fontWeight: '900', textAlign: 'center' },
  recordLabel: { color: colors.muted, fontSize: 8, fontWeight: '800', letterSpacing: 1, marginTop: 4 },
  divider: { width: 1, height: 34, backgroundColor: colors.border },
  orange: { color: colors.orange },
  sectionLabel: { color: colors.muted, fontSize: 9, fontWeight: '900', letterSpacing: 1.5, marginTop: 25, marginBottom: 10 },
  sizeRow: { flexDirection: 'row', gap: 8 },
  size: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 13, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  sizeActive: { backgroundColor: colors.orange, borderColor: colors.orange },
  sizeText: { color: colors.muted, fontWeight: '800' },
  sizeTextActive: { color: colors.white },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 28, marginBottom: 12 },
  sectionTitle: { color: colors.text, fontSize: 18, fontWeight: '800' },
  count: { color: colors.muted, fontSize: 12, fontWeight: '700' },
  memberCard: { flexDirection: 'row', alignItems: 'center', borderRadius: radius.medium, padding: 12, marginBottom: 8 },
  position: { color: colors.muted, width: 22, fontSize: 12, fontWeight: '900' },
  memberCopy: { flex: 1, marginLeft: 11 },
  memberName: { color: colors.text, fontSize: 13, fontWeight: '800' },
  memberType: { color: colors.muted, fontSize: 10, marginTop: 4 },
  openSpot: { alignItems: 'center', paddingVertical: 20, borderWidth: 1, borderStyle: 'dashed', borderColor: '#444', borderRadius: radius.medium, marginTop: 3 },
  plus: { color: colors.orange, fontSize: 24 },
  openTitle: { color: colors.text, fontSize: 13, fontWeight: '800', marginTop: 5 },
  openCaption: { color: colors.muted, fontSize: 10, marginTop: 3 },
  online: { color: colors.green, fontSize: 11, fontWeight: '700' },
  friendRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
});

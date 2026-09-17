import React, { PropsWithChildren } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';

import { colors, radius } from './theme';
import { Player } from './types';

export function Avatar({ player, size = 46 }: { player: Player; size?: number }) {
  return (
    <View
      style={[
        styles.avatar,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: player.accent },
      ]}
    >
      <Text style={[styles.avatarText, { fontSize: Math.max(11, size * 0.3) }]}>{player.initials}</Text>
      {player.online ? <View style={styles.online} /> : null}
    </View>
  );
}

export function Rating({ value, small = false }: { value: number; small?: boolean }) {
  const tone = value >= 90 ? colors.yellow : value >= 84 ? colors.orange : colors.green;
  return (
    <View style={[styles.rating, { borderColor: tone }, small && styles.ratingSmall]}>
      <Text style={[styles.ratingValue, { color: tone }, small && styles.ratingValueSmall]}>{value}</Text>
      <Text style={[styles.ratingLabel, small && styles.ratingLabelSmall]}>OVR</Text>
    </View>
  );
}

export function SectionHeader({ title, action, onPress }: { title: string; action?: string; onPress?: () => void }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {action ? (
        <Pressable onPress={onPress} hitSlop={8}>
          <Text style={styles.sectionAction}>{action}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  compact = false,
  disabled = false,
}: {
  label: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  compact?: boolean;
  disabled?: boolean;
}) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        styles[`button_${variant}`],
        compact && styles.buttonCompact,
        disabled && styles.buttonDisabled,
        pressed && styles.pressed,
      ]}
    >
      <Text style={[styles.buttonText, styles[`buttonText_${variant}`]]}>{label}</Text>
    </Pressable>
  );
}

export function Card({ children, style }: PropsWithChildren<{ style?: ViewStyle | ViewStyle[] }>) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function Pill({ label, tone = 'default' }: { label: string; tone?: 'default' | 'orange' | 'green' }) {
  return (
    <View style={[styles.pill, tone === 'orange' && styles.pillOrange, tone === 'green' && styles.pillGreen]}>
      <Text style={[styles.pillText, tone === 'orange' && styles.pillTextOrange, tone === 'green' && styles.pillTextGreen]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF1F',
  },
  avatarText: { color: colors.white, fontWeight: '900', letterSpacing: 0.4 },
  online: {
    position: 'absolute',
    right: -1,
    bottom: -1,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.green,
    borderWidth: 2,
    borderColor: colors.background,
  },
  rating: {
    width: 54,
    height: 54,
    borderRadius: 16,
    borderWidth: 1.5,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ratingSmall: { width: 42, height: 42, borderRadius: 12 },
  ratingValue: { fontSize: 21, fontWeight: '900', lineHeight: 22 },
  ratingValueSmall: { fontSize: 16, lineHeight: 17 },
  ratingLabel: { color: colors.muted, fontSize: 8, fontWeight: '800', letterSpacing: 1 },
  ratingLabelSmall: { fontSize: 7 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 28,
    marginBottom: 13,
  },
  sectionTitle: { color: colors.text, fontSize: 18, fontWeight: '800', letterSpacing: -0.3 },
  sectionAction: { color: colors.orange, fontSize: 13, fontWeight: '700' },
  button: {
    minHeight: 48,
    paddingHorizontal: 20,
    borderRadius: radius.medium,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button_primary: { backgroundColor: colors.orange },
  button_secondary: { backgroundColor: colors.surfaceRaised, borderWidth: 1, borderColor: colors.border },
  button_ghost: { backgroundColor: 'transparent' },
  buttonCompact: { minHeight: 38, borderRadius: 12, paddingHorizontal: 14 },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { fontSize: 14, fontWeight: '800' },
  buttonText_primary: { color: colors.white },
  buttonText_secondary: { color: colors.text },
  buttonText_ghost: { color: colors.orange },
  pressed: { opacity: 0.76, transform: [{ scale: 0.985 }] },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.large,
    padding: 16,
  },
  pill: { backgroundColor: colors.surfaceRaised, paddingHorizontal: 10, paddingVertical: 6, borderRadius: radius.pill },
  pillOrange: { backgroundColor: colors.orangeSoft },
  pillGreen: { backgroundColor: '#12301C' },
  pillText: { color: colors.muted, fontSize: 11, fontWeight: '800' },
  pillTextOrange: { color: colors.orange },
  pillTextGreen: { color: colors.green },
});

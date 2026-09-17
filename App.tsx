import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
  Platform,
  Pressable,
  SafeAreaView,
  StatusBar as NativeStatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { AuthScreen } from './src/screens/AuthScreen';
import { CourtsScreen } from './src/screens/CourtsScreen';
import { DiscoverScreen } from './src/screens/DiscoverScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { SquadScreen } from './src/screens/SquadScreen';
import { colors, shadow } from './src/theme';

type Tab = 'Home' | 'Discover' | 'Courts' | 'Squad' | 'Profile';

const tabs: { id: Tab; label: string; icon: string }[] = [
  { id: 'Home', label: 'Home', icon: '⌂' },
  { id: 'Discover', label: 'Play', icon: '⚡' },
  { id: 'Courts', label: 'Courts', icon: '⌖' },
  { id: 'Squad', label: 'Squad', icon: '◆' },
  { id: 'Profile', label: 'Me', icon: '●' },
];

export default function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [tab, setTab] = useState<Tab>('Home');
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(timer);
  }, [toast]);

  const navigate = (destination: string) => {
    if (tabs.some(({ id }) => id === destination)) setTab(destination as Tab);
  };

  if (!authenticated) {
    return (
      <>
        <StatusBar style="light" />
        <AuthScreen onContinue={() => setAuthenticated(true)} />
      </>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" />
      <View style={styles.topBar}>
        <Pressable style={styles.brand} onPress={() => setTab('Home')}>
          <View style={styles.mark}><Text style={styles.markText}>♛</Text></View>
          <Text style={styles.brandText}>KOTC</Text>
        </Pressable>
        <Pressable style={styles.bell} onPress={() => setToast('No new notifications.')}>
          <Text style={styles.bellIcon}>◉</Text>
          <View style={styles.notificationDot} />
        </Pressable>
      </View>

      <View style={styles.screen}>
        {tab === 'Home' && <HomeScreen navigate={navigate} notify={setToast} />}
        {tab === 'Discover' && <DiscoverScreen notify={setToast} />}
        {tab === 'Courts' && <CourtsScreen notify={setToast} />}
        {tab === 'Squad' && <SquadScreen notify={setToast} />}
        {tab === 'Profile' && <ProfileScreen notify={setToast} />}
      </View>

      <View style={styles.tabBar}>
        {tabs.map((item) => {
          const active = tab === item.id;
          return (
            <Pressable key={item.id} onPress={() => setTab(item.id)} style={({ pressed }) => [styles.tab, pressed && styles.pressed]}>
              <Text style={[styles.tabIcon, active && styles.tabIconActive]}>{item.icon}</Text>
              <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{item.label}</Text>
              {active ? <View style={styles.activeLine} /> : null}
            </Pressable>
          );
        })}
      </View>

      {toast ? (
        <View style={styles.toast}>
          <Text style={styles.toastCheck}>✓</Text>
          <Text style={styles.toastText}>{toast}</Text>
        </View>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: Platform.OS === 'android' ? NativeStatusBar.currentHeight : 0,
  },
  topBar: { height: 56, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: '#1D1D1D' },
  brand: { flexDirection: 'row', alignItems: 'center' },
  mark: { width: 31, height: 31, borderRadius: 10, backgroundColor: colors.orange, alignItems: 'center', justifyContent: 'center' },
  markText: { color: colors.white, fontSize: 19, marginTop: -2 },
  brandText: { color: colors.text, fontSize: 15, fontWeight: '900', letterSpacing: 1.7, marginLeft: 9 },
  bell: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  bellIcon: { color: colors.text, fontSize: 17 },
  notificationDot: { position: 'absolute', top: 7, right: 7, width: 6, height: 6, borderRadius: 3, backgroundColor: colors.orange },
  screen: { flex: 1 },
  tabBar: { position: 'absolute', left: 12, right: 12, bottom: Platform.OS === 'ios' ? 10 : 12, height: 71, flexDirection: 'row', backgroundColor: '#171717F5', borderWidth: 1, borderColor: '#303030', borderRadius: 23, paddingHorizontal: 5, ...shadow },
  tab: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  tabIcon: { color: colors.muted, fontSize: 19, lineHeight: 22 },
  tabIconActive: { color: colors.orange },
  tabLabel: { color: colors.muted, fontSize: 9, fontWeight: '700', marginTop: 4 },
  tabLabelActive: { color: colors.text },
  activeLine: { position: 'absolute', top: 0, width: 21, height: 2, borderRadius: 1, backgroundColor: colors.orange },
  pressed: { opacity: 0.65 },
  toast: { position: 'absolute', left: 24, right: 24, bottom: 92, minHeight: 52, borderRadius: 16, flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F1E9', paddingHorizontal: 15, ...shadow },
  toastCheck: { color: colors.green, fontSize: 16, fontWeight: '900', marginRight: 9 },
  toastText: { color: '#1A1A1A', fontSize: 12, fontWeight: '700', flex: 1 },
});

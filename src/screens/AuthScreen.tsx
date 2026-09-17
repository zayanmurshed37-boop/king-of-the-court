import React from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';

import { Button } from '../components';
import { colors } from '../theme';

export function AuthScreen({ onContinue }: { onContinue: () => void }) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.courtLines}>
        <View style={styles.centerLine} />
        <View style={styles.centerCircle} />
        <View style={styles.hoop}><View style={styles.backboard} /></View>
      </View>
      <View style={styles.brand}>
        <View style={styles.logo}><Text style={styles.logoCrown}>♛</Text><Text style={styles.logoBall}>●</Text></View>
        <Text style={styles.name}>KING OF{`\n`}THE COURT</Text>
        <Text style={styles.tagline}>Find your run. Build your rep. Rule your court.</Text>
      </View>
      <View style={styles.actions}>
        <Button label="Create an account" onPress={onContinue} />
        <Pressable style={styles.signIn} onPress={onContinue}><Text style={styles.signInText}>Already have an account? <Text style={styles.signInAccent}>Sign in</Text></Text></Pressable>
        <Text style={styles.legal}>By continuing, you agree to the community rules and fair play policy.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background, justifyContent: 'space-between' },
  courtLines: { position: 'absolute', top: 0, left: 0, right: 0, height: '58%', backgroundColor: '#35180E', opacity: 0.72, overflow: 'hidden' },
  centerLine: { position: 'absolute', left: 0, right: 0, top: '63%', height: 1, backgroundColor: '#FFFFFF28' },
  centerCircle: { position: 'absolute', alignSelf: 'center', top: '43%', width: 170, height: 170, borderRadius: 85, borderWidth: 1, borderColor: '#FFFFFF28' },
  hoop: { position: 'absolute', alignSelf: 'center', top: 0, width: 148, height: 86, borderWidth: 1, borderTopWidth: 0, borderColor: '#FFFFFF28', borderBottomLeftRadius: 74, borderBottomRightRadius: 74 },
  backboard: { alignSelf: 'center', marginTop: 14, width: 54, height: 1, backgroundColor: '#FFFFFF28' },
  brand: { alignItems: 'center', marginTop: '31%', paddingHorizontal: 25 },
  logo: { width: 86, height: 86, borderRadius: 26, backgroundColor: colors.orange, alignItems: 'center', justifyContent: 'center', transform: [{ rotate: '-4deg' }] },
  logoCrown: { color: colors.white, fontSize: 37, marginTop: -14 },
  logoBall: { color: '#71250E', fontSize: 34, marginTop: -17 },
  name: { color: colors.text, fontSize: 37, lineHeight: 37, fontWeight: '900', textAlign: 'center', letterSpacing: -1.5, marginTop: 22 },
  tagline: { color: '#CCC7BD', fontSize: 14, textAlign: 'center', marginTop: 13 },
  actions: { paddingHorizontal: 24, paddingBottom: 18 },
  signIn: { paddingVertical: 20, alignItems: 'center' },
  signInText: { color: colors.muted, fontSize: 13 },
  signInAccent: { color: colors.orange, fontWeight: '800' },
  legal: { color: '#666662', fontSize: 9, lineHeight: 13, textAlign: 'center', paddingHorizontal: 35 },
});

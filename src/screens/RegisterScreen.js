import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, SafeAreaView, ScrollView, Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING } from '../data/theme';
import { useApp } from '../context/AppContext';

export default function RegisterScreen({ navigation }) {
  const [sex, setSex] = useState('Male');
  const [heightUnit, setHeightUnit] = useState('CM');
  const [weightUnit, setWeightUnit] = useState('KG');
  const [height, setHeight] = useState('180');
  const [weight, setWeight] = useState('75.0');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [agreed, setAgreed] = useState(false);
  const { setUser } = useApp();

  const handleCreate = () => {
    setUser((prev) => ({ ...prev, height: Number(height), weight: Number(weight), sex, heightUnit, weightUnit }));
    navigation.replace('Main');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.inner} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={COLORS.textPrimary} />
        </TouchableOpacity>

        <Text style={styles.heading}>Let's Personalize{'\n'}Your Coach</Text>
        <Text style={styles.sub}>We use your stats to customize your AI plan.{'\n'}All data stays local.</Text>

        {/* Physical Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>YOUR PHYSICAL STATS</Text>

          <View style={styles.row}>
            {/* Sex */}
            <View style={styles.sexToggle}>
              {['Male', 'Female'].map((s) => (
                <TouchableOpacity
                  key={s}
                  onPress={() => setSex(s)}
                  style={[styles.sexBtn, sex === s && styles.sexBtnActive]}
                >
                  <Text style={[styles.sexBtnText, sex === s && styles.sexBtnTextActive]}>{s}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Height */}
          <View style={styles.statRow}>
            <View style={styles.statIcon}>
              <Ionicons name="resize-outline" size={18} color={COLORS.textSecondary} />
            </View>
            <View style={styles.statInputWrap}>
              <Text style={styles.statLabel}>Height</Text>
              <TextInput
                style={styles.statInput}
                value={height}
                onChangeText={setHeight}
                keyboardType="numeric"
                placeholderTextColor={COLORS.textMuted}
              />
            </View>
            <View style={styles.unitToggle}>
              {['CM', 'FT'].map((u) => (
                <TouchableOpacity
                  key={u}
                  onPress={() => setHeightUnit(u)}
                  style={[styles.unitBtn, heightUnit === u && styles.unitBtnActive]}
                >
                  <Text style={[styles.unitBtnText, heightUnit === u && styles.unitBtnTextActive]}>{u}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Weight */}
          <View style={styles.statRow}>
            <View style={styles.statIcon}>
              <Ionicons name="scale-outline" size={18} color={COLORS.textSecondary} />
            </View>
            <View style={styles.statInputWrap}>
              <Text style={styles.statLabel}>Weight</Text>
              <TextInput
                style={styles.statInput}
                value={weight}
                onChangeText={setWeight}
                keyboardType="numeric"
                placeholderTextColor={COLORS.textMuted}
              />
            </View>
            <View style={styles.unitToggle}>
              {['KG', 'LBS'].map((u) => (
                <TouchableOpacity
                  key={u}
                  onPress={() => setWeightUnit(u)}
                  style={[styles.unitBtn, weightUnit === u && styles.unitBtnActive]}
                >
                  <Text style={[styles.unitBtnText, weightUnit === u && styles.unitBtnTextActive]}>{u}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Account */}
        <View style={styles.section}>
          <View style={styles.inputWrap}>
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              placeholderTextColor={COLORS.textMuted}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          <View style={styles.inputWrap}>
            <TextInput
              style={styles.input}
              placeholder="Create Password"
              placeholderTextColor={COLORS.textMuted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>
          <View style={styles.inputWrap}>
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              placeholderTextColor={COLORS.textMuted}
              value={confirm}
              onChangeText={setConfirm}
              secureTextEntry
            />
          </View>
        </View>

        {/* Terms */}
        <TouchableOpacity style={styles.termsRow} onPress={() => setAgreed(!agreed)} activeOpacity={0.7}>
          <View style={[styles.checkbox, agreed && styles.checkboxActive]}>
            {agreed && <Ionicons name="checkmark" size={12} color={COLORS.white} />}
          </View>
          <Text style={styles.termsText}>
            I agree to the{' '}
            <Text style={styles.termsLink}>Terms & Conditions</Text>
            {' '}and acknowledge the Privacy Policy regarding my local data.
          </Text>
        </TouchableOpacity>

        {/* Create Button */}
        <TouchableOpacity
          style={[styles.createBtn, !agreed && styles.createBtnDisabled]}
          onPress={handleCreate}
          disabled={!agreed}
          activeOpacity={0.85}
        >
          <Text style={styles.createBtnText}>Create Account</Text>
        </TouchableOpacity>

        <View style={styles.loginRow}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginLink}>Log In</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.privacyBadge}>
          <Ionicons name="lock-closed" size={12} color={COLORS.textMuted} />
          <Text style={styles.privacyText}>Your data never leaves your phone.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  inner: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 40 },
  backBtn: { marginBottom: 20 },
  heading: {
    color: COLORS.textPrimary,
    fontSize: 26,
    fontWeight: '700',
    lineHeight: 34,
    marginBottom: 8,
  },
  sub: { color: COLORS.textSecondary, fontSize: 13, lineHeight: 20, marginBottom: 28 },
  section: { marginBottom: 20 },
  sectionLabel: { color: COLORS.textMuted, fontSize: 11, fontWeight: '600', letterSpacing: 1, marginBottom: 14 },
  row: { marginBottom: 12 },
  sexToggle: {
    flexDirection: 'row',
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.sm,
    padding: 3,
    alignSelf: 'flex-start',
  },
  sexBtn: { paddingVertical: 6, paddingHorizontal: 18, borderRadius: 6 },
  sexBtnActive: { backgroundColor: COLORS.primary },
  sexBtnText: { color: COLORS.textMuted, fontSize: 13, fontWeight: '500' },
  sexBtnTextActive: { color: COLORS.white },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.md,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statIcon: { marginRight: 12 },
  statInputWrap: { flex: 1 },
  statLabel: { color: COLORS.textMuted, fontSize: 11, marginBottom: 2 },
  statInput: { color: COLORS.textPrimary, fontSize: 18, fontWeight: '600' },
  unitToggle: { flexDirection: 'row', gap: 4 },
  unitBtn: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 6, backgroundColor: COLORS.bgSurface },
  unitBtnActive: { backgroundColor: COLORS.primary },
  unitBtnText: { color: COLORS.textMuted, fontSize: 12, fontWeight: '500' },
  unitBtnTextActive: { color: COLORS.white },
  inputWrap: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 14,
    height: 50,
    justifyContent: 'center',
    marginBottom: 10,
  },
  input: { color: COLORS.textPrimary, fontSize: 14 },
  termsRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 20 },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: COLORS.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  termsText: { flex: 1, color: COLORS.textSecondary, fontSize: 12, lineHeight: 18 },
  termsLink: { color: COLORS.primary },
  createBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  createBtnDisabled: { opacity: 0.5 },
  createBtnText: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
  loginRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 16 },
  loginText: { color: COLORS.textSecondary, fontSize: 13 },
  loginLink: { color: COLORS.primary, fontSize: 13, fontWeight: '600' },
  privacyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  privacyText: { color: COLORS.textMuted, fontSize: 11 },
});

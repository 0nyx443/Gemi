import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, SafeAreaView,
  TouchableOpacity, Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS } from '../data/theme';
import { useApp } from '../context/AppContext';

function StatBox({ label, value, unit, color }) {
  return (
    <View style={styles.statBox}>
      <Text style={[styles.statBoxVal, color && { color }]}>{value}</Text>
      <Text style={styles.statBoxUnit}>{unit}</Text>
      <Text style={styles.statBoxLabel}>{label}</Text>
    </View>
  );
}

function SettingRow({ icon, label, value, onPress, toggle, toggleValue, onToggle, color }) {
  return (
    <TouchableOpacity style={styles.settingRow} onPress={onPress} activeOpacity={toggle ? 1 : 0.7}>
      <View style={[styles.settingIcon, { backgroundColor: (color || COLORS.primary) + '20' }]}>
        <Ionicons name={icon} size={16} color={color || COLORS.primary} />
      </View>
      <View style={styles.settingInfo}>
        <Text style={styles.settingLabel}>{label}</Text>
        {value ? <Text style={styles.settingValue}>{value}</Text> : null}
      </View>
      {toggle ? (
        <Switch
          value={toggleValue}
          onValueChange={onToggle}
          trackColor={{ false: COLORS.bgSurface, true: COLORS.primary + '60' }}
          thumbColor={toggleValue ? COLORS.primary : COLORS.textMuted}
        />
      ) : (
        <Ionicons name="chevron-forward" size={16} color={COLORS.textMuted} />
      )}
    </TouchableOpacity>
  );
}

export default function ProfileScreen({ navigation }) {
  const { user, stats, logout } = useApp();
  const [notifs, setNotifs] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [localData, setLocalData] = useState(true);

  const weightTrendData = [68.2, 68.5, 68.3, 68.8, 69.0, 68.6, 68.5];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity style={styles.settingsBtn}>
            <Ionicons name="settings-outline" size={22} color={COLORS.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileTop}>
            <View style={styles.avatarWrap}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</Text>
              </View>
              <View style={styles.proBadge}>
                <Text style={styles.proBadgeText}>PRO</Text>
              </View>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{user.name}</Text>
              <View style={styles.goalBadge}>
                <Ionicons name="trending-up" size={11} color={COLORS.accentGreen} />
                <Text style={styles.goalText}>{user.goal}</Text>
              </View>
            </View>
          </View>

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <StatBox label="Height" value={user.height} unit={user.heightUnit} />
            <View style={styles.statDivider} />
            <StatBox label="Weight" value={user.weight} unit={user.weightUnit} />
            <View style={styles.statDivider} />
            <StatBox label="Streak" value={stats.weekStreak} unit="days" color={COLORS.accentOrange} />
          </View>
        </View>

        {/* Weight Trend */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Weight Trend</Text>
            <Text style={styles.trendSub}>Past 30 Days</Text>
          </View>

          {/* Mini Chart */}
          <View style={styles.miniChart}>
            {weightTrendData.map((v, i) => {
              const min = Math.min(...weightTrendData);
              const max = Math.max(...weightTrendData);
              const h = ((v - min) / (max - min + 0.1)) * 40 + 10;
              const isLast = i === weightTrendData.length - 1;
              return (
                <View key={i} style={styles.chartBarWrap}>
                  <View style={[styles.chartBar, { height: h, backgroundColor: isLast ? COLORS.primary : COLORS.primary + '40' }]} />
                </View>
              );
            })}
          </View>

          <View style={styles.weightRow}>
            <Text style={styles.weightCurrent}>{user.weight} kg</Text>
            <View style={styles.trendChip}>
              <Ionicons name="arrow-up" size={11} color={COLORS.accentGreen} />
              <Text style={styles.trendChipText}>+1.2 kg</Text>
            </View>
          </View>
          <Text style={styles.weightDates}>Oct 1 — Oct 31</Text>
        </View>

        {/* Settings */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>PREFERENCES</Text>
          <SettingRow icon="notifications-outline" label="Push Notifications" toggle toggleValue={notifs} onToggle={setNotifs} />
          <SettingRow icon="moon-outline" label="Dark Mode" toggle toggleValue={darkMode} onToggle={setDarkMode} color={COLORS.accentPurple} />
          <SettingRow icon="lock-closed-outline" label="Local Data Only" toggle toggleValue={localData} onToggle={setLocalData} color={COLORS.accentGreen} />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>ACCOUNT</Text>
          <SettingRow icon="person-outline" label="Edit Profile" value="Update your stats" color={COLORS.primary} />
          <SettingRow icon="trophy-outline" label="Your Goal" value={user.goal} color={COLORS.accentOrange} />
          <SettingRow icon="shield-checkmark-outline" label="Privacy" value="All data is local" color={COLORS.accentGreen} />
          <SettingRow icon="help-circle-outline" label="Help & Support" color={COLORS.textSecondary} />
        </View>

        {/* Logout */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={() => {
            logout();
            navigation.replace('Login');
          }}
          activeOpacity={0.8}
        >
          <Ionicons name="log-out-outline" size={18} color={COLORS.error} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <Text style={styles.version}>Aura v1.0.0 · All data stays local</Text>
        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  headerTitle: { color: COLORS.textPrimary, fontSize: 20, fontWeight: '700' },
  settingsBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: COLORS.bgCard, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: COLORS.border,
  },
  profileCard: {
    backgroundColor: COLORS.bgCard, borderRadius: RADIUS.lg,
    padding: 16, marginBottom: 12, borderWidth: 1, borderColor: COLORS.border,
  },
  profileTop: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 16 },
  avatarWrap: { position: 'relative' },
  avatar: {
    width: 60, height: 60, borderRadius: 30,
    backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { color: COLORS.white, fontSize: 20, fontWeight: '700' },
  proBadge: {
    position: 'absolute', bottom: -2, right: -4,
    backgroundColor: COLORS.accentYellow, borderRadius: RADIUS.full,
    paddingVertical: 2, paddingHorizontal: 5,
  },
  proBadgeText: { color: COLORS.black, fontSize: 8, fontWeight: '800' },
  profileInfo: { flex: 1 },
  profileName: { color: COLORS.textPrimary, fontSize: 18, fontWeight: '700', marginBottom: 4 },
  goalBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: COLORS.accentGreen + '18', borderRadius: RADIUS.full,
    paddingVertical: 3, paddingHorizontal: 8, alignSelf: 'flex-start',
  },
  goalText: { color: COLORS.accentGreen, fontSize: 11, fontWeight: '600' },
  statsRow: {
    flexDirection: 'row', justifyContent: 'space-around',
    borderTopWidth: 1, borderTopColor: COLORS.border, paddingTop: 14,
  },
  statBox: { alignItems: 'center', flex: 1 },
  statBoxVal: { color: COLORS.textPrimary, fontSize: 22, fontWeight: '700' },
  statBoxUnit: { color: COLORS.textMuted, fontSize: 11 },
  statBoxLabel: { color: COLORS.textSecondary, fontSize: 11, marginTop: 2 },
  statDivider: { width: 1, backgroundColor: COLORS.border },
  card: {
    backgroundColor: COLORS.bgCard, borderRadius: RADIUS.lg,
    padding: 16, marginBottom: 12, borderWidth: 1, borderColor: COLORS.border,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  cardTitle: { color: COLORS.textPrimary, fontSize: 14, fontWeight: '600' },
  trendSub: { color: COLORS.textMuted, fontSize: 11 },
  miniChart: { flexDirection: 'row', alignItems: 'flex-end', height: 56, gap: 4, marginBottom: 12 },
  chartBarWrap: { flex: 1, justifyContent: 'flex-end' },
  chartBar: { borderRadius: 3 },
  weightRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  weightCurrent: { color: COLORS.textPrimary, fontSize: 24, fontWeight: '700' },
  trendChip: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: COLORS.accentGreen + '18', borderRadius: RADIUS.full,
    paddingVertical: 3, paddingHorizontal: 8,
  },
  trendChipText: { color: COLORS.accentGreen, fontSize: 12, fontWeight: '600' },
  weightDates: { color: COLORS.textMuted, fontSize: 11, marginTop: 2 },
  sectionTitle: { color: COLORS.textMuted, fontSize: 11, fontWeight: '600', letterSpacing: 1, marginBottom: 12 },
  settingRow: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 11,
    borderBottomWidth: 1, borderBottomColor: COLORS.border, gap: 12,
  },
  settingIcon: {
    width: 32, height: 32, borderRadius: 8,
    alignItems: 'center', justifyContent: 'center',
  },
  settingInfo: { flex: 1 },
  settingLabel: { color: COLORS.textPrimary, fontSize: 14 },
  settingValue: { color: COLORS.textMuted, fontSize: 11, marginTop: 1 },
  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: COLORS.error + '12', borderRadius: RADIUS.lg, height: 50,
    borderWidth: 1, borderColor: COLORS.error + '30', marginBottom: 14,
  },
  logoutText: { color: COLORS.error, fontSize: 15, fontWeight: '600' },
  version: { color: COLORS.textMuted, fontSize: 11, textAlign: 'center' },
});

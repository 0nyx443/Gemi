import React from 'react';
import {
  View, Text, ScrollView, StyleSheet, SafeAreaView,
  TouchableOpacity, Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING } from '../data/theme';
import { useApp } from '../context/AppContext';

const { width } = Dimensions.get('window');

function MacroBar({ label, eaten, goal, color }) {
  const pct = Math.min((eaten / goal) * 100, 100);
  return (
    <View style={styles.macroRow}>
      <View style={styles.macroInfo}>
        <Text style={styles.macroLabel}>{label}</Text>
        <Text style={styles.macroVal}>
          <Text style={{ color }}>{eaten}g</Text>
          <Text style={styles.macroGoal}> / {goal}g</Text>
        </Text>
      </View>
      <View style={styles.macroBarBg}>
        <View style={[styles.macroBarFill, { width: `${pct}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
}

function CalorieRing({ eaten, remaining, goal }) {
  const pct = eaten / goal;
  const size = 130;
  const stroke = 10;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const dash = circ * pct;

  return (
    <View style={styles.ringContainer}>
      <View style={[styles.ringOuter, { width: size, height: size, borderRadius: size / 2 }]}>
        <View style={[styles.ringInner, { width: size - stroke * 2.5, height: size - stroke * 2.5, borderRadius: (size - stroke * 2.5) / 2 }]}>
          <Text style={styles.ringRemaining}>{remaining.toLocaleString()}</Text>
          <Text style={styles.ringLabel}>kcal left</Text>
        </View>
        {/* Ring border approximation */}
        <View style={styles.ringProgress} />
      </View>
      <View style={styles.ringEatenRow}>
        <Ionicons name="flame" size={14} color={COLORS.accentOrange} />
        <Text style={styles.ringEatenText}>{eaten.toLocaleString()} eaten</Text>
      </View>
    </View>
  );
}

export default function DashboardScreen({ navigation }) {
  const { user, stats, meals } = useApp();
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerSub}>Today</Text>
            <Text style={styles.headerName}>Hey, {user.name.split(' ')[0]} 👋</Text>
          </View>
          <TouchableOpacity style={styles.notifBtn}>
            <Ionicons name="notifications-outline" size={22} color={COLORS.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Calories Remaining Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>CALORIES REMAINING</Text>
          <View style={styles.caloriesRow}>
            <View style={styles.caloriesBig}>
              <Text style={styles.caloriesNum}>{stats.caloriesRemaining.toLocaleString()}</Text>
              <Text style={styles.caloriesGoal}>/ {stats.caloriesGoal.toLocaleString()} kcal</Text>
            </View>
            <CalorieRing
              eaten={stats.caloriesEaten}
              remaining={stats.caloriesRemaining}
              goal={stats.caloriesGoal}
            />
          </View>

          {/* Macros */}
          <View style={styles.macrosWrap}>
            <View style={styles.macroColumn}>
              <Text style={[styles.macroBig, { color: COLORS.protein }]}>{stats.protein.eaten}g</Text>
              <Text style={styles.macroSmall}>Protein</Text>
              <Text style={styles.macroSmallGoal}>/{stats.protein.goal}g</Text>
            </View>
            <View style={[styles.macroColumn, styles.macroColumnBorder]}>
              <Text style={[styles.macroBig, { color: COLORS.carbs }]}>{stats.carbs.eaten}g</Text>
              <Text style={styles.macroSmall}>Carbs</Text>
              <Text style={styles.macroSmallGoal}>/{stats.carbs.goal}g</Text>
            </View>
            <View style={styles.macroColumn}>
              <Text style={[styles.macroBig, { color: COLORS.fats }]}>{stats.fats.eaten}g</Text>
              <Text style={styles.macroSmall}>Fats</Text>
              <Text style={styles.macroSmallGoal}>/{stats.fats.goal}g</Text>
            </View>
          </View>
        </View>

        {/* Progress Bars */}
        <View style={styles.card}>
          <View style={styles.barHeader}>
            <Text style={styles.cardTitle}>TODAY'S NUTRITION</Text>
            <Text style={styles.caloriesEatenBadge}>{stats.caloriesEaten} kcal</Text>
          </View>
          <MacroBar label="Protein" eaten={stats.protein.eaten} goal={stats.protein.goal} color={COLORS.protein} />
          <MacroBar label="Carbs" eaten={stats.carbs.eaten} goal={stats.carbs.goal} color={COLORS.carbs} />
          <MacroBar label="Fats" eaten={stats.fats.eaten} goal={stats.fats.goal} color={COLORS.fats} />
        </View>

        {/* Quick Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Ionicons name="water" size={20} color={COLORS.primary} />
            <Text style={styles.statCardNum}>{stats.waterIntake}</Text>
            <Text style={styles.statCardLabel}>/ {stats.waterGoal} glasses</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="moon" size={20} color={COLORS.accentPurple} />
            <Text style={styles.statCardNum}>{stats.sleepHours}</Text>
            <Text style={styles.statCardLabel}>hrs sleep</Text>
          </View>
        </View>

        {/* Weekly Review */}
        <View style={styles.card}>
          <View style={styles.weeklyHeader}>
            <Text style={styles.cardTitle}>Weekly Review</Text>
            <View style={styles.streakBadge}>
              <Ionicons name="flame" size={12} color={COLORS.accentOrange} />
              <Text style={styles.streakText}>{stats.weekStreak} Day Streak</Text>
            </View>
          </View>
          <View style={styles.weekDays}>
            {days.map((d, i) => (
              <View key={i} style={styles.dayCol}>
                <Text style={styles.dayLabel}>{d}</Text>
                <View style={[
                  styles.dayDot,
                  user.weeklyLog[i] ? styles.dayDotFilled : styles.dayDotEmpty,
                  i === new Date().getDay() - 1 && styles.dayDotToday,
                ]}>
                  {user.weeklyLog[i] && <Ionicons name="checkmark" size={10} color={COLORS.white} />}
                </View>
              </View>
            ))}
          </View>
          <Text style={styles.weeklyText}>
            Great job this week! You hit your protein goals 6 out of 7 days, maintaining a solid anabolic state. Your average caloric intake is tracking perfectly with your slight surplus target.
          </Text>
        </View>

        {/* AI Insight Card */}
        <TouchableOpacity
          style={styles.aiCard}
          onPress={() => navigation.navigate('AICoach')}
          activeOpacity={0.85}
        >
          <View style={styles.aiCardHeader}>
            <View style={styles.aiWhisperBadge}>
              <Ionicons name="sparkles" size={12} color={COLORS.primary} />
              <Text style={styles.aiWhisperText}>AI Recovery Insight</Text>
            </View>
          </View>
          <Text style={styles.aiCardText}>
            "You've been hitting high RPEs; consider a deload day to optimize CNS recovery."
          </Text>
          <TouchableOpacity style={styles.adjustPlanBtn}>
            <Text style={styles.adjustPlanText}>Adjust Plan</Text>
          </TouchableOpacity>
        </TouchableOpacity>

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 20 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingTop: 4,
  },
  headerSub: { color: COLORS.textMuted, fontSize: 12, fontWeight: '500', letterSpacing: 0.5 },
  headerName: { color: COLORS.textPrimary, fontSize: 20, fontWeight: '700' },
  notifBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.bgCard,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  card: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardTitle: { color: COLORS.textMuted, fontSize: 11, fontWeight: '600', letterSpacing: 1, marginBottom: 12 },
  caloriesRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  caloriesBig: { flex: 1 },
  caloriesNum: { color: COLORS.textPrimary, fontSize: 40, fontWeight: '700', lineHeight: 46 },
  caloriesGoal: { color: COLORS.textMuted, fontSize: 13 },
  ringContainer: { alignItems: 'center' },
  ringOuter: {
    backgroundColor: COLORS.bgSurface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 8,
    borderColor: COLORS.primary + '30',
  },
  ringInner: {
    backgroundColor: COLORS.bgCard,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
  },
  ringProgress: {},
  ringRemaining: { color: COLORS.textPrimary, fontSize: 20, fontWeight: '700' },
  ringLabel: { color: COLORS.textMuted, fontSize: 11 },
  ringEatenRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 },
  ringEatenText: { color: COLORS.textSecondary, fontSize: 11 },
  macrosWrap: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: COLORS.border, paddingTop: 12 },
  macroColumn: { flex: 1, alignItems: 'center' },
  macroColumnBorder: { borderLeftWidth: 1, borderRightWidth: 1, borderColor: COLORS.border },
  macroBig: { fontSize: 20, fontWeight: '700' },
  macroSmall: { color: COLORS.textSecondary, fontSize: 11, marginTop: 2 },
  macroSmallGoal: { color: COLORS.textMuted, fontSize: 10 },
  barHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  caloriesEatenBadge: { color: COLORS.primary, fontSize: 12, fontWeight: '600' },
  macroRow: { marginBottom: 10 },
  macroInfo: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  macroLabel: { color: COLORS.textSecondary, fontSize: 13 },
  macroVal: { fontSize: 13, fontWeight: '600' },
  macroGoal: { color: COLORS.textMuted, fontWeight: '400' },
  macroBarBg: { height: 6, backgroundColor: COLORS.bgSurface, borderRadius: 3, overflow: 'hidden' },
  macroBarFill: { height: 6, borderRadius: 3 },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 4,
  },
  statCardNum: { color: COLORS.textPrimary, fontSize: 22, fontWeight: '700' },
  statCardLabel: { color: COLORS.textMuted, fontSize: 11 },
  weeklyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.accentOrange + '20',
    borderRadius: RADIUS.full,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  streakText: { color: COLORS.accentOrange, fontSize: 11, fontWeight: '600' },
  weekDays: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14 },
  dayCol: { alignItems: 'center', gap: 6 },
  dayLabel: { color: COLORS.textMuted, fontSize: 11, fontWeight: '500' },
  dayDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayDotFilled: { backgroundColor: COLORS.primary },
  dayDotEmpty: { backgroundColor: COLORS.bgSurface, borderWidth: 1, borderColor: COLORS.border },
  dayDotToday: { borderWidth: 2, borderColor: COLORS.primaryLight },
  weeklyText: { color: COLORS.textSecondary, fontSize: 12, lineHeight: 18 },
  aiCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.primary + '40',
    marginBottom: 12,
  },
  aiCardHeader: { marginBottom: 10 },
  aiWhisperBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    backgroundColor: COLORS.primary + '18',
    borderRadius: RADIUS.full,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  aiWhisperText: { color: COLORS.primary, fontSize: 11, fontWeight: '600' },
  aiCardText: { color: COLORS.textPrimary, fontSize: 15, fontWeight: '600', lineHeight: 22, marginBottom: 14, fontStyle: 'italic' },
  adjustPlanBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.sm,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
  },
  adjustPlanText: { color: COLORS.white, fontSize: 13, fontWeight: '600' },
});

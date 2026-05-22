import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, SafeAreaView,
  TouchableOpacity, TextInput, Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS } from '../data/theme';
import { useApp } from '../context/AppContext';

const SUGGESTED_EXERCISES = [
  { name: 'Back Squat', muscle: 'Lower Body' },
  { name: 'Bench Press', muscle: 'Chest' },
  { name: 'Deadlift', muscle: 'Back' },
  { name: 'Overhead Press', muscle: 'Shoulders' },
  { name: 'Pull Up', muscle: 'Back' },
  { name: 'Romanian Deadlift', muscle: 'Hamstrings' },
  { name: 'Lat Pulldown', muscle: 'Back' },
  { name: 'Leg Press', muscle: 'Lower Body' },
];

function ExerciseCard({ workout, onUpdateSet, onAddSet }) {
  return (
    <View style={styles.exerciseCard}>
      <View style={styles.exHeader}>
        <View>
          <View style={styles.muscleBadge}>
            <Text style={styles.muscleBadgeText}>{workout.muscle}</Text>
          </View>
          <Text style={styles.exName}>{workout.name}</Text>
        </View>
        <Ionicons name="ellipsis-horizontal" size={18} color={COLORS.textMuted} />
      </View>

      {/* Set Headers */}
      <View style={styles.setHeaderRow}>
        <Text style={[styles.setHeaderText, { width: 30 }]}>Set</Text>
        <Text style={[styles.setHeaderText, { flex: 1 }]}>Previous</Text>
        <Text style={[styles.setHeaderText, { width: 70 }]}>lbs × Reps</Text>
        <Text style={[styles.setHeaderText, { width: 30 }]}>✓</Text>
      </View>

      {workout.sets.map((s, i) => (
        <View key={i} style={styles.setRow}>
          <Text style={[styles.setNum, { width: 30 }]}>{s.set}</Text>
          <Text style={[styles.setPrev, { flex: 1 }]}>
            {s.weight} × {s.reps}
          </Text>
          <View style={styles.setInputs}>
            <TextInput
              style={styles.setInput}
              value={String(s.weight)}
              onChangeText={(v) => onUpdateSet(workout.id, i, { weight: Number(v) || s.weight })}
              keyboardType="numeric"
            />
            <Text style={styles.setX}>×</Text>
            <TextInput
              style={styles.setInput}
              value={String(s.reps)}
              onChangeText={(v) => onUpdateSet(workout.id, i, { reps: Number(v) || s.reps })}
              keyboardType="numeric"
            />
          </View>
          <View style={[styles.setCheck, s.rpe != null && styles.setCheckDone]}>
            {s.rpe != null && <Ionicons name="checkmark" size={12} color={COLORS.white} />}
          </View>
        </View>
      ))}

      <TouchableOpacity style={styles.addSetBtn} onPress={() => onAddSet(workout.id)}>
        <Ionicons name="add" size={14} color={COLORS.textSecondary} />
        <Text style={styles.addSetText}>Add Set</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function LiftScreen() {
  const { workouts, updateSet, addSet, addWorkout, stats } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [timerRunning, setTimerRunning] = useState(true);
  const [activeDay, setActiveDay] = useState('TUE');

  const weekDays = [
    { label: 'SUN', num: 25, status: 'rest' },
    { label: 'MON', num: 26, status: 'push' },
    { label: 'TUE', num: 27, status: 'today' },
    { label: 'WED', num: 28, status: 'pull' },
    { label: 'THU', num: 29, status: '' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.dayLabel}>Leg Day</Text>
            <View style={styles.statsRow}>
              <View style={styles.statChip}>
                <Ionicons name="barbell-outline" size={12} color={COLORS.textMuted} />
                <Text style={styles.statChipText}>{stats.totalVolume.toLocaleString()} kg</Text>
              </View>
              <View style={styles.statChip}>
                <Ionicons name="time-outline" size={12} color={COLORS.textMuted} />
                <Text style={styles.statChipText}>{stats.sessionTime}</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity style={styles.notifBtn}>
            <Ionicons name="notifications-outline" size={22} color={COLORS.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Session Timer */}
        <View style={styles.timerCard}>
          <Text style={styles.timerLabel}>SESSION TIME</Text>
          <Text style={styles.timerNum}>{stats.sessionTime}</Text>
          <TouchableOpacity
            style={styles.logSetBtn}
            onPress={() => {}}
          >
            <Text style={styles.logSetBtnText}>Log Set</Text>
          </TouchableOpacity>
        </View>

        {/* Training Calendar */}
        <View style={styles.calCard}>
          <View style={styles.calHeader}>
            <Text style={styles.calTitle}>Training Calendar</Text>
            <TouchableOpacity><Text style={styles.viewAll}>View All</Text></TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.calRow}>
              {weekDays.map((d) => (
                <TouchableOpacity
                  key={d.label}
                  onPress={() => setActiveDay(d.label)}
                  style={[styles.calDay, d.label === activeDay && styles.calDayActive]}
                >
                  <Text style={[styles.calDayLabel, d.label === activeDay && styles.calDayLabelActive]}>{d.label}</Text>
                  <Text style={[styles.calDayNum, d.label === activeDay && styles.calDayNumActive]}>{d.num}</Text>
                  {d.status ? (
                    <View style={[styles.calDayTag, d.label === activeDay && styles.calDayTagActive]}>
                      <Text style={styles.calDayTagText}>{d.status.toUpperCase()}</Text>
                    </View>
                  ) : null}
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* AI Note */}
        <View style={styles.aiNoteCard}>
          <View style={styles.aiNoteHeader}>
            <Ionicons name="sparkles" size={13} color={COLORS.primary} />
            <Text style={styles.aiNoteLabel}>AI Note</Text>
          </View>
          <Text style={styles.aiNoteText}>
            Great volume progression on push movements today. Rest your chest tomorrow.
          </Text>
        </View>

        {/* Summary Cards */}
        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryCardNum}>{stats.totalVolume.toLocaleString()}</Text>
            <Text style={styles.summaryCardLabel}>TOTAL VOLUME</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryCardNum}>{stats.weekStreak}</Text>
            <Text style={styles.summaryCardLabel}>WEEK STREAK</Text>
          </View>
        </View>

        {/* Exercises */}
        <View style={styles.exercisesSection}>
          <Text style={styles.sectionTitle}>EXERCISES</Text>
          {workouts.map((workout) => (
            <ExerciseCard
              key={workout.id}
              workout={workout}
              onUpdateSet={updateSet}
              onAddSet={addSet}
            />
          ))}
        </View>

        {/* Add Exercise */}
        <TouchableOpacity style={styles.addExBtn} onPress={() => setShowAddModal(true)} activeOpacity={0.85}>
          <Ionicons name="add" size={20} color={COLORS.white} />
          <Text style={styles.addExBtnText}>Add Exercise</Text>
        </TouchableOpacity>

        {/* Action buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.copyBtn}>
            <Ionicons name="copy-outline" size={16} color={COLORS.primary} />
            <Text style={styles.copyBtnText}>Copy Routine</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.startBtn}>
            <Ionicons name="play" size={16} color={COLORS.white} />
            <Text style={styles.startBtnText}>Start Workout</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Add Exercise Modal */}
      <Modal visible={showAddModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Exercise</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <Ionicons name="close" size={22} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              {SUGGESTED_EXERCISES.map((ex, i) => (
                <TouchableOpacity
                  key={i}
                  style={styles.exOption}
                  onPress={() => {
                    addWorkout({
                      name: ex.name,
                      muscle: ex.muscle,
                      sets: [{ set: 1, weight: 100, reps: 10, rpe: null }],
                      completed: false,
                      date: new Date().toISOString(),
                    });
                    setShowAddModal(false);
                  }}
                >
                  <View>
                    <Text style={styles.exOptionName}>{ex.name}</Text>
                    <Text style={styles.exOptionMuscle}>{ex.muscle}</Text>
                  </View>
                  <Ionicons name="add-circle-outline" size={22} color={COLORS.primary} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  dayLabel: { color: COLORS.textPrimary, fontSize: 20, fontWeight: '700', marginBottom: 6 },
  statsRow: { flexDirection: 'row', gap: 8 },
  statChip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: COLORS.bgCard, borderRadius: RADIUS.full,
    paddingVertical: 4, paddingHorizontal: 10,
    borderWidth: 1, borderColor: COLORS.border,
  },
  statChipText: { color: COLORS.textSecondary, fontSize: 11, fontWeight: '500' },
  notifBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: COLORS.bgCard, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: COLORS.border,
  },
  timerCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    padding: 20,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  timerLabel: { color: COLORS.textMuted, fontSize: 11, letterSpacing: 1, fontWeight: '600', marginBottom: 6 },
  timerNum: { color: COLORS.primary, fontSize: 40, fontWeight: '700', fontVariant: ['tabular-nums'], marginBottom: 14 },
  logSetBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingVertical: 12,
    paddingHorizontal: 48,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  logSetBtnText: { color: COLORS.white, fontSize: 15, fontWeight: '700' },
  calCard: {
    backgroundColor: COLORS.bgCard, borderRadius: RADIUS.lg,
    padding: 16, marginBottom: 12, borderWidth: 1, borderColor: COLORS.border,
  },
  calHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  calTitle: { color: COLORS.textPrimary, fontSize: 14, fontWeight: '600' },
  viewAll: { color: COLORS.primary, fontSize: 12, fontWeight: '500' },
  calRow: { flexDirection: 'row', gap: 8 },
  calDay: {
    alignItems: 'center', paddingVertical: 10, paddingHorizontal: 12,
    borderRadius: RADIUS.md, backgroundColor: COLORS.bgSurface,
    minWidth: 56, gap: 4,
  },
  calDayActive: { backgroundColor: COLORS.primary },
  calDayLabel: { color: COLORS.textMuted, fontSize: 10, fontWeight: '600' },
  calDayLabelActive: { color: COLORS.white },
  calDayNum: { color: COLORS.textPrimary, fontSize: 16, fontWeight: '700' },
  calDayNumActive: { color: COLORS.white },
  calDayTag: { backgroundColor: COLORS.bgCard, borderRadius: RADIUS.full, paddingVertical: 2, paddingHorizontal: 5 },
  calDayTagActive: { backgroundColor: COLORS.primaryDark },
  calDayTagText: { color: COLORS.textMuted, fontSize: 8, fontWeight: '600' },
  aiNoteCard: {
    backgroundColor: COLORS.primary + '15',
    borderRadius: RADIUS.lg,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.primary + '30',
  },
  aiNoteHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  aiNoteLabel: { color: COLORS.primary, fontSize: 12, fontWeight: '600' },
  aiNoteText: { color: COLORS.textSecondary, fontSize: 13, lineHeight: 18 },
  summaryRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  summaryCard: {
    flex: 1, backgroundColor: COLORS.bgCard, borderRadius: RADIUS.lg,
    padding: 16, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border,
  },
  summaryCardNum: { color: COLORS.textPrimary, fontSize: 22, fontWeight: '700' },
  summaryCardLabel: { color: COLORS.textMuted, fontSize: 10, fontWeight: '600', letterSpacing: 0.5, marginTop: 2 },
  exercisesSection: { marginBottom: 14 },
  sectionTitle: { color: COLORS.textMuted, fontSize: 11, fontWeight: '600', letterSpacing: 1, marginBottom: 10 },
  exerciseCard: {
    backgroundColor: COLORS.bgCard, borderRadius: RADIUS.lg,
    padding: 14, marginBottom: 12, borderWidth: 1, borderColor: COLORS.border,
  },
  exHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  muscleBadge: {
    backgroundColor: COLORS.primary + '20', borderRadius: RADIUS.full,
    paddingVertical: 2, paddingHorizontal: 8, alignSelf: 'flex-start', marginBottom: 4,
  },
  muscleBadgeText: { color: COLORS.primary, fontSize: 10, fontWeight: '600' },
  exName: { color: COLORS.textPrimary, fontSize: 16, fontWeight: '700' },
  setHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, paddingBottom: 6, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  setHeaderText: { color: COLORS.textMuted, fontSize: 11, fontWeight: '600' },
  setRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  setNum: { color: COLORS.textSecondary, fontSize: 14, fontWeight: '600' },
  setPrev: { color: COLORS.textMuted, fontSize: 13 },
  setInputs: { flexDirection: 'row', alignItems: 'center', width: 70 },
  setInput: {
    backgroundColor: COLORS.bgSurface, borderRadius: 6, width: 26,
    textAlign: 'center', color: COLORS.textPrimary, fontSize: 13, fontWeight: '600',
    paddingVertical: 4, borderWidth: 1, borderColor: COLORS.border,
  },
  setX: { color: COLORS.textMuted, marginHorizontal: 3, fontSize: 12 },
  setCheck: {
    width: 22, height: 22, borderRadius: 4, borderWidth: 1.5,
    borderColor: COLORS.border, alignItems: 'center', justifyContent: 'center', marginLeft: 8,
  },
  setCheckDone: { backgroundColor: COLORS.accentGreen, borderColor: COLORS.accentGreen },
  addSetBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingTop: 10, borderTopWidth: 1, borderTopColor: COLORS.border, marginTop: 4,
    justifyContent: 'center',
  },
  addSetText: { color: COLORS.textSecondary, fontSize: 13 },
  addExBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: COLORS.bgCard, borderRadius: RADIUS.lg, height: 50,
    borderWidth: 1.5, borderColor: COLORS.border, borderStyle: 'dashed', marginBottom: 14,
  },
  addExBtnText: { color: COLORS.textSecondary, fontSize: 14, fontWeight: '500' },
  actionRow: { flexDirection: 'row', gap: 10 },
  copyBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: COLORS.bgCard, borderRadius: RADIUS.md, height: 48,
    borderWidth: 1, borderColor: COLORS.primary + '40',
  },
  copyBtnText: { color: COLORS.primary, fontSize: 14, fontWeight: '600' },
  startBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: COLORS.primary, borderRadius: RADIUS.md, height: 48,
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 10, elevation: 6,
  },
  startBtnText: { color: COLORS.white, fontSize: 14, fontWeight: '700' },
  modalOverlay: { flex: 1, backgroundColor: '#00000088', justifyContent: 'flex-end' },
  modalCard: {
    backgroundColor: COLORS.bgCard, borderTopLeftRadius: RADIUS.xxl,
    borderTopRightRadius: RADIUS.xxl, padding: 24, paddingBottom: 40, maxHeight: '70%',
  },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalTitle: { color: COLORS.textPrimary, fontSize: 18, fontWeight: '700' },
  exOption: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  exOptionName: { color: COLORS.textPrimary, fontSize: 15, fontWeight: '600' },
  exOptionMuscle: { color: COLORS.textMuted, fontSize: 12, marginTop: 2 },
});

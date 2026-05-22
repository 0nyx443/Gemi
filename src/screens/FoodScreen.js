import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, SafeAreaView,
  TouchableOpacity, TextInput, Modal, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING } from '../data/theme';
import { useApp } from '../context/AppContext';

function MealCard({ meal, onLog }) {
  return (
    <View style={styles.mealCard}>
      <View style={styles.mealIconWrap}>
        <Ionicons
          name={meal.name === 'Breakfast' ? 'sunny-outline' : meal.name === 'Lunch' ? 'partly-sunny-outline' : 'moon-outline'}
          size={18}
          color={COLORS.textSecondary}
        />
      </View>
      <View style={styles.mealInfo}>
        <Text style={styles.mealName}>{meal.name}</Text>
        <Text style={styles.mealDesc}>{meal.description}</Text>
      </View>
      <View style={styles.mealRight}>
        <Text style={[styles.mealCals, meal.logged && { color: COLORS.textPrimary }]}>
          {meal.logged ? meal.calories : '0'}
        </Text>
        <TouchableOpacity
          onPress={() => onLog(meal)}
          style={[styles.mealPlusBtn, meal.logged && styles.mealPlusBtnLogged]}
        >
          <Ionicons name={meal.logged ? 'checkmark' : 'add'} size={18} color={meal.logged ? COLORS.accentGreen : COLORS.textSecondary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function FoodScreen({ navigation }) {
  const { stats, meals, logMeal, addChatMessage } = useApp();
  const [quickLog, setQuickLog] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [logDesc, setLogDesc] = useState('');
  const [logCals, setLogCals] = useState('');
  const [aiSuggestion, setAiSuggestion] = useState('');
  const [loadingAi, setLoadingAi] = useState(false);

  const handleQuickLogAI = async () => {
    if (!quickLog.trim()) return;
    setLoadingAi(true);
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [
            {
              role: 'user',
              content: `The user ate: "${quickLog}". Estimate the calories and macros. 
              Reply ONLY as JSON: {"calories": 320, "protein": 12, "carbs": 50, "fats": 8, "summary": "Short meal summary"}`,
            },
          ],
        }),
      });
      const data = await response.json();
      const text = data.content?.[0]?.text || '{}';
      const clean = text.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(clean);
      setAiSuggestion(`~${parsed.calories} kcal · P:${parsed.protein}g C:${parsed.carbs}g F:${parsed.fats}g`);
      addChatMessage({ role: 'assistant', text: `Quick log: "${quickLog}" — ${parsed.summary} (~${parsed.calories} kcal)`, time: 'Just now' });
    } catch (e) {
      setAiSuggestion('Could not estimate. Check connection.');
    }
    setLoadingAi(false);
    setQuickLog('');
  };

  const openLogModal = (meal) => {
    if (meal.logged) return;
    setSelectedMeal(meal);
    setLogDesc('');
    setLogCals('');
    setModalVisible(true);
  };

  const submitLog = () => {
    if (!logCals) return;
    logMeal(selectedMeal.id, Number(logCals), logDesc || selectedMeal.description);
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerSub}>Today</Text>
            <Text style={styles.headerTitle}>Food Hub</Text>
          </View>
          <TouchableOpacity style={styles.notifBtn}>
            <Ionicons name="notifications-outline" size={22} color={COLORS.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Calorie Summary */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryVal}>{stats.caloriesEaten.toLocaleString()}</Text>
            <Text style={styles.summaryLabel}>Eaten</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryVal, { color: COLORS.primary }]}>{stats.caloriesRemaining.toLocaleString()}</Text>
            <Text style={styles.summaryLabel}>Remaining</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryVal}>{stats.caloriesGoal.toLocaleString()}</Text>
            <Text style={styles.summaryLabel}>Goal</Text>
          </View>
        </View>

        {/* Macro Bars */}
        <View style={styles.card}>
          {[
            { label: 'Protein', val: stats.protein.eaten, goal: stats.protein.goal, color: COLORS.protein },
            { label: 'Carbs', val: stats.carbs.eaten, goal: stats.carbs.goal, color: COLORS.carbs },
            { label: 'Fats', val: stats.fats.eaten, goal: stats.fats.goal, color: COLORS.fats },
          ].map((m) => (
            <View key={m.label} style={styles.macroRow}>
              <Text style={styles.macroLabel}>{m.label}</Text>
              <View style={styles.macroBg}>
                <View style={[styles.macroFill, { width: `${Math.min((m.val / m.goal) * 100, 100)}%`, backgroundColor: m.color }]} />
              </View>
              <Text style={styles.macroText}>{m.val}g / {m.goal}g</Text>
            </View>
          ))}
        </View>

        {/* AI Quick Log */}
        <View style={styles.card}>
          <View style={styles.aiLabelRow}>
            <Ionicons name="sparkles" size={14} color={COLORS.primary} />
            <Text style={styles.aiLabel}>AI Quick Log</Text>
          </View>
          <View style={styles.quickLogRow}>
            <TextInput
              style={styles.quickLogInput}
              placeholder="I ate 2 eggs, a slice of toast..."
              placeholderTextColor={COLORS.textMuted}
              value={quickLog}
              onChangeText={setQuickLog}
              onSubmitEditing={handleQuickLogAI}
            />
            <TouchableOpacity style={styles.quickLogBtn} onPress={handleQuickLogAI} disabled={loadingAi}>
              {loadingAi
                ? <Ionicons name="reload" size={18} color={COLORS.white} />
                : <Ionicons name="send" size={18} color={COLORS.white} />
              }
            </TouchableOpacity>
          </View>
          {aiSuggestion ? (
            <View style={styles.aiSuggestionRow}>
              <Ionicons name="checkmark-circle" size={14} color={COLORS.accentGreen} />
              <Text style={styles.aiSuggestionText}>{aiSuggestion}</Text>
            </View>
          ) : null}
        </View>

        {/* Meals */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Meals</Text>
          {meals.map((meal) => (
            <MealCard key={meal.id} meal={meal} onLog={openLogModal} />
          ))}
        </View>

        {/* Bottom info */}
        <View style={styles.privacyRow}>
          <Ionicons name="lock-closed" size={12} color={COLORS.textMuted} />
          <Text style={styles.privacyText}>Your data never leaves your phone.</Text>
        </View>
      </ScrollView>

      {/* Log Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Log {selectedMeal?.name}</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="What did you eat?"
              placeholderTextColor={COLORS.textMuted}
              value={logDesc}
              onChangeText={setLogDesc}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Calories"
              placeholderTextColor={COLORS.textMuted}
              value={logCals}
              onChangeText={setLogCals}
              keyboardType="numeric"
            />
            <View style={styles.modalBtns}>
              <TouchableOpacity style={styles.modalCancel} onPress={() => setModalVisible(false)}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalSubmit} onPress={submitLog}>
                <Text style={styles.modalSubmitText}>Log</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  headerSub: { color: COLORS.textMuted, fontSize: 12, fontWeight: '500' },
  headerTitle: { color: COLORS.textPrimary, fontSize: 20, fontWeight: '700' },
  notifBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: COLORS.bgCard, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: COLORS.border,
  },
  summaryCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'space-around',
  },
  summaryItem: { alignItems: 'center', flex: 1 },
  summaryVal: { color: COLORS.textPrimary, fontSize: 22, fontWeight: '700' },
  summaryLabel: { color: COLORS.textMuted, fontSize: 11, marginTop: 2 },
  summaryDivider: { width: 1, backgroundColor: COLORS.border },
  card: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  macroRow: { marginBottom: 10 },
  macroLabel: { color: COLORS.textSecondary, fontSize: 12, marginBottom: 4 },
  macroBg: { height: 6, backgroundColor: COLORS.bgSurface, borderRadius: 3, overflow: 'hidden', marginBottom: 3 },
  macroFill: { height: 6, borderRadius: 3 },
  macroText: { color: COLORS.textMuted, fontSize: 11 },
  aiLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
  aiLabel: { color: COLORS.primary, fontSize: 13, fontWeight: '600' },
  quickLogRow: { flexDirection: 'row', gap: 8 },
  quickLogInput: {
    flex: 1,
    backgroundColor: COLORS.bgSurface,
    borderRadius: RADIUS.md,
    paddingHorizontal: 12,
    color: COLORS.textPrimary,
    fontSize: 13,
    height: 44,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  quickLogBtn: {
    width: 44, height: 44, borderRadius: RADIUS.md,
    backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center',
  },
  aiSuggestionRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 },
  aiSuggestionText: { color: COLORS.accentGreen, fontSize: 12 },
  sectionTitle: { color: COLORS.textMuted, fontSize: 11, fontWeight: '600', letterSpacing: 1, marginBottom: 12 },
  mealCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  mealIconWrap: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: COLORS.bgSurface, alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  mealInfo: { flex: 1 },
  mealName: { color: COLORS.textPrimary, fontSize: 14, fontWeight: '600' },
  mealDesc: { color: COLORS.textMuted, fontSize: 12, marginTop: 2 },
  mealRight: { alignItems: 'flex-end', gap: 4 },
  mealCals: { color: COLORS.textMuted, fontSize: 16, fontWeight: '600' },
  mealPlusBtn: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: COLORS.bgSurface, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: COLORS.border,
  },
  mealPlusBtnLogged: { borderColor: COLORS.accentGreen + '60' },
  privacyRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  privacyText: { color: COLORS.textMuted, fontSize: 11 },
  modalOverlay: { flex: 1, backgroundColor: '#00000088', justifyContent: 'flex-end' },
  modalCard: {
    backgroundColor: COLORS.bgCard,
    borderTopLeftRadius: RADIUS.xxl,
    borderTopRightRadius: RADIUS.xxl,
    padding: 24,
    paddingBottom: 40,
    gap: 12,
  },
  modalTitle: { color: COLORS.textPrimary, fontSize: 18, fontWeight: '700', marginBottom: 4 },
  modalInput: {
    backgroundColor: COLORS.bgSurface,
    borderRadius: RADIUS.md,
    paddingHorizontal: 14,
    color: COLORS.textPrimary,
    fontSize: 14,
    height: 48,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  modalBtns: { flexDirection: 'row', gap: 10, marginTop: 4 },
  modalCancel: {
    flex: 1, height: 48, borderRadius: RADIUS.md,
    backgroundColor: COLORS.bgSurface, alignItems: 'center', justifyContent: 'center',
  },
  modalCancelText: { color: COLORS.textSecondary, fontWeight: '600' },
  modalSubmit: {
    flex: 1, height: 48, borderRadius: RADIUS.md,
    backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center',
  },
  modalSubmitText: { color: COLORS.white, fontWeight: '700' },
});

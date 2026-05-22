import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet, SafeAreaView,
  TouchableOpacity, TextInput, KeyboardAvoidingView,
  Platform, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS } from '../data/theme';
import { useApp } from '../context/AppContext';

const QUICK_REPLIES = [
  'Yes, all logged',
  'Need to update',
  'Why did I lose strength?',
  'Suggest a deload',
  'What should I eat today?',
];

const SYSTEM_PROMPT = `You are an elite AI fitness coach called "Aura Coach" embedded in a mobile fitness app. 
You have access to the user's workout and nutrition data. Be concise, motivating, and evidence-based.
Use short paragraphs. Never use markdown headers. Give direct, personalized advice.
When asked about strength loss, analyze sleep, nutrition timing, and volume.
When suggesting workouts, tailor to the user's current goal (Bulking/Cutting/Maintaining).
When suggesting food, consider their macro targets and calorie goals.`;

export default function AICoachScreen({ navigation }) {
  const { chatHistory, addChatMessage, user, stats, workouts, meals } = useApp();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef();

  const contextSummary = `
User: ${user.name}, Goal: ${user.goal}, Weight: ${user.weight}${user.weightUnit}
Today's calories: ${stats.caloriesEaten} eaten, ${stats.caloriesRemaining} remaining (goal: ${stats.caloriesGoal})
Protein: ${stats.protein.eaten}/${stats.protein.goal}g, Carbs: ${stats.carbs.eaten}/${stats.carbs.goal}g, Fats: ${stats.fats.eaten}/${stats.fats.goal}g
Sleep: ${stats.sleepHours} hrs, Water: ${stats.waterIntake}/${stats.waterGoal} glasses
Workout streak: ${stats.weekStreak} days, Session volume: ${stats.totalVolume}kg
Recent exercises: ${workouts.map(w => w.name).join(', ')}
`;

  useEffect(() => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  }, [chatHistory]);

  const sendMessage = async (text) => {
    const userText = text || input.trim();
    if (!userText) return;
    setInput('');

    const userMsg = { role: 'user', text: userText, time: 'Just now' };
    addChatMessage(userMsg);
    setLoading(true);

    try {
      const messages = [
        {
          role: 'user',
          content: `[User context]\n${contextSummary}\n\n[User message]\n${userText}`,
        },
      ];

      // Add prior chat turns for context (last 6 messages)
      const history = chatHistory.slice(-6);
      const apiMessages = [
        ...history
          .filter((m) => m.role === 'user' || m.role === 'assistant')
          .map((m) => ({ role: m.role, content: m.text })),
        { role: 'user', content: `[User context]\n${contextSummary}\n\n[User message]\n${userText}` },
      ];

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: apiMessages,
        }),
      });

      const data = await response.json();
      const reply = data.content?.[0]?.text || "I'm having trouble connecting right now. Please try again.";
      addChatMessage({ role: 'assistant', text: reply, time: 'Just now' });
    } catch (e) {
      addChatMessage({
        role: 'assistant',
        text: 'Connection error. Make sure you have internet access and try again.',
        time: 'Just now',
      });
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <View style={styles.aiAvatar}>
            <Ionicons name="sparkles" size={16} color={COLORS.white} />
          </View>
          <View>
            <Text style={styles.headerTitle}>AI Coach</Text>
            <View style={styles.onlineRow}>
              <View style={styles.onlineDot} />
              <Text style={styles.onlineText}>Online</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity style={styles.menuBtn}>
          <Ionicons name="ellipsis-horizontal" size={20} color={COLORS.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Chat */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={10}
      >
        <ScrollView
          ref={scrollRef}
          style={styles.chatScroll}
          contentContainerStyle={styles.chatContent}
          showsVerticalScrollIndicator={false}
        >
          {chatHistory.map((msg, i) => (
            <View key={i} style={[styles.msgRow, msg.role === 'user' && styles.msgRowUser]}>
              {msg.role === 'assistant' && (
                <View style={styles.msgAvatar}>
                  <Ionicons name="sparkles" size={12} color={COLORS.white} />
                </View>
              )}
              <View style={[styles.msgBubble, msg.role === 'user' ? styles.msgBubbleUser : styles.msgBubbleAI]}>
                <Text style={[styles.msgText, msg.role === 'user' && styles.msgTextUser]}>
                  {msg.text}
                </Text>
                {msg.time ? <Text style={styles.msgTime}>{msg.time}</Text> : null}
              </View>
            </View>
          ))}

          {loading && (
            <View style={styles.msgRow}>
              <View style={styles.msgAvatar}>
                <Ionicons name="sparkles" size={12} color={COLORS.white} />
              </View>
              <View style={[styles.msgBubble, styles.msgBubbleAI, styles.loadingBubble]}>
                <ActivityIndicator size="small" color={COLORS.primary} />
                <Text style={styles.typingText}>Aura is thinking...</Text>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Quick Replies */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.quickReplies}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
        >
          {QUICK_REPLIES.map((r, i) => (
            <TouchableOpacity key={i} style={styles.quickChip} onPress={() => sendMessage(r)}>
              <Text style={styles.quickChipText}>{r}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Input */}
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Ask your AI coach..."
            placeholderTextColor={COLORS.textMuted}
            value={input}
            onChangeText={setInput}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[styles.sendBtn, !input.trim() && styles.sendBtnDisabled]}
            onPress={() => sendMessage()}
            disabled={!input.trim() || loading}
          >
            <Ionicons name="send" size={18} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerCenter: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 },
  aiAvatar: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { color: COLORS.textPrimary, fontSize: 15, fontWeight: '700' },
  onlineRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 1 },
  onlineDot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: COLORS.accentGreen },
  onlineText: { color: COLORS.accentGreen, fontSize: 11 },
  menuBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  chatScroll: { flex: 1 },
  chatContent: { padding: 16, gap: 14 },
  msgRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  msgRowUser: { flexDirection: 'row-reverse' },
  msgAvatar: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  msgBubble: {
    maxWidth: '78%',
    borderRadius: RADIUS.lg,
    padding: 12,
    paddingBottom: 8,
  },
  msgBubbleAI: {
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderBottomLeftRadius: 4,
  },
  msgBubbleUser: {
    backgroundColor: COLORS.primary,
    borderBottomRightRadius: 4,
  },
  msgText: { color: COLORS.textSecondary, fontSize: 14, lineHeight: 20 },
  msgTextUser: { color: COLORS.white },
  msgTime: { color: COLORS.textMuted, fontSize: 10, marginTop: 4 },
  loadingBubble: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  typingText: { color: COLORS.textMuted, fontSize: 13, fontStyle: 'italic' },
  quickReplies: { maxHeight: 44, marginBottom: 8 },
  quickChip: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.full,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  quickChipText: { color: COLORS.textSecondary, fontSize: 12, fontWeight: '500' },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.bg,
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: COLORS.textPrimary,
    fontSize: 14,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sendBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center',
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.4, shadowRadius: 8, elevation: 4,
  },
  sendBtnDisabled: { opacity: 0.5 },
});

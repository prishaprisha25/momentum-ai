import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Animated,
  Alert,
  Share,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Trash2, Calendar, Tag, Zap, Target, BookOpen, Heart, Share2 } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useNotes } from '@/providers/NotesProvider';
import MomentumBar from '@/components/MomentumBar';

export default function InsightDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getNoteById, deleteNote, markInteracted, toggleFavorite } = useNotes();
  const note = getNoteById(id ?? '');
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (note) markInteracted(note.id);
    Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
  }, []);

  const handleDelete = () => {
    Alert.alert('Delete Insight', 'Are you sure you want to delete this insight?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          deleteNote.mutate(note?.id ?? '', { onSuccess: () => router.back() });
        },
      },
    ]);
  };

  const handleToggleFavorite = () => {
    if (!note) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleFavorite.mutate(note.id);
  };

  const handleShare = async () => {
    if (!note) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const shareText = `${note.summary}\n\nCategory: ${note.category}\nMomentum: ${note.momentumScore.toFixed(1)}/10\n\n${note.text}`;
    try {
      if (Platform.OS === 'web') {
        const { setStringAsync } = await import('expo-clipboard');
        await setStringAsync(shareText);
        Alert.alert('Copied', 'Note copied to clipboard!');
      } else {
        await Share.share({ message: shareText, title: note.category });
      }
    } catch (err) {
      console.log('[InsightDetail] Share error:', err);
    }
  };

  if (!note) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: 'Not Found' }} />
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>Insight not found</Text>
          <Pressable style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backBtnText}>Go Back</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 4) return Colors.accent;
    if (score >= 3) return Colors.teal;
    return Colors.textMuted;
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: note.category,
          headerRight: () => (
            <View style={styles.headerActions}>
              <Pressable onPress={handleShare} style={styles.headerBtn} hitSlop={8}>
                <Share2 size={17} color={Colors.textSecondary} />
              </Pressable>
              <Pressable onPress={handleToggleFavorite} style={styles.headerBtn} hitSlop={8}>
                <Heart size={17} color={note.isFavorite ? Colors.pink : Colors.textSecondary} fill={note.isFavorite ? Colors.pink : 'none'} />
              </Pressable>
              <Pressable onPress={handleDelete} style={styles.headerBtn} hitSlop={8}>
                <Trash2 size={17} color={Colors.red} />
              </Pressable>
            </View>
          ),
        }}
      />
      <Animated.ScrollView style={{ opacity: fadeAnim }} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.scoreHeader}>
          <View style={styles.scoreCircle}>
            <Text style={styles.scoreNumber}>{note.momentumScore.toFixed(1)}</Text>
            <Text style={styles.scoreMax}>/10</Text>
          </View>
          <Text style={styles.scoreLabel}>Momentum Score</Text>
          <View style={styles.momentumWrap}>
            <MomentumBar score={note.momentumScore} height={6} />
          </View>
        </View>

        <View style={styles.metricsRow}>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Importance</Text>
            <Text style={[styles.metricValue, { color: getScoreColor(note.importance) }]}>{note.importance.toFixed(1)}</Text>
            <Text style={styles.metricMax}>/5</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Actionability</Text>
            <Text style={[styles.metricValue, { color: getScoreColor(note.actionability) }]}>{note.actionability.toFixed(1)}</Text>
            <Text style={styles.metricMax}>/5</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Novelty</Text>
            <Text style={[styles.metricValue, { color: getScoreColor(note.novelty) }]}>{note.novelty.toFixed(1)}</Text>
            <Text style={styles.metricMax}>/5</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>AI Summary</Text>
          <Text style={styles.sectionBody}>{note.summary}</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <BookOpen size={15} color={Colors.teal} />
            <Text style={styles.sectionTitle}>Original Note</Text>
          </View>
          <Text style={styles.originalText}>{note.text}</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Tag size={15} color={Colors.blue} />
            <Text style={styles.sectionTitle}>Keywords</Text>
          </View>
          <View style={styles.keywordsWrap}>
            {note.keywords.map((kw, i) => (
              <View key={i} style={styles.keywordChip}>
                <Text style={styles.keywordText}>{kw}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Zap size={15} color={Colors.purple} />
            <Text style={styles.sectionTitle}>AI Reasoning</Text>
          </View>
          <Text style={styles.sectionBody}>{note.reason}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Score Explanation</Text>
          <Text style={styles.sectionBody}>{note.scoreReason}</Text>
        </View>

        <View style={styles.actionCard}>
          <View style={styles.sectionHeader}>
            <Target size={15} color={Colors.accent} />
            <Text style={styles.sectionTitle}>Recommended Action</Text>
          </View>
          <Text style={styles.actionText}>{note.recommendedAction}</Text>
        </View>

        <View style={styles.metaRow}>
          <Calendar size={13} color={Colors.textMuted} />
          <Text style={styles.metaText}>Created {new Date(note.createdAt).toLocaleDateString()}</Text>
        </View>

        <View style={{ height: 40 }} />
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  scrollContent: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40 },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  headerBtn: { padding: 4 },
  notFound: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 },
  notFoundText: { color: Colors.textMuted, fontSize: 16 },
  backBtn: { backgroundColor: Colors.card, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12, borderWidth: 1, borderColor: Colors.border },
  backBtnText: { color: Colors.accent, fontSize: 14, fontWeight: '600' as const },
  scoreHeader: { alignItems: 'center', marginBottom: 24 },
  scoreCircle: { flexDirection: 'row', alignItems: 'baseline', marginBottom: 6 },
  scoreNumber: { color: Colors.accent, fontSize: 52, fontWeight: '800' as const, letterSpacing: -1 },
  scoreMax: { color: Colors.textMuted, fontSize: 20, fontWeight: '500' as const },
  scoreLabel: { color: Colors.textMuted, fontSize: 12, fontWeight: '600' as const, marginBottom: 14, textTransform: 'uppercase' as const, letterSpacing: 1.5 },
  momentumWrap: { width: '100%', paddingHorizontal: 20 },
  metricsRow: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  metricCard: { flex: 1, backgroundColor: Colors.card, borderRadius: 16, paddingVertical: 14, paddingHorizontal: 10, alignItems: 'center', borderWidth: 1, borderColor: Colors.border },
  metricLabel: { color: Colors.textMuted, fontSize: 10, fontWeight: '600' as const, textTransform: 'uppercase' as const, letterSpacing: 0.5, marginBottom: 6 },
  metricValue: { fontSize: 24, fontWeight: '800' as const },
  metricMax: { color: Colors.textMuted, fontSize: 11, marginTop: 2 },
  section: { backgroundColor: Colors.card, borderRadius: 16, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: Colors.border },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  sectionTitle: { color: Colors.textPrimary, fontSize: 14, fontWeight: '700' as const, marginBottom: 8 },
  sectionBody: { color: Colors.textSecondary, fontSize: 14, lineHeight: 22 },
  originalText: { color: Colors.textPrimary, fontSize: 15, lineHeight: 24 },
  keywordsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  keywordChip: { backgroundColor: Colors.tealSoft, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: Colors.tealBorder },
  keywordText: { color: Colors.teal, fontSize: 13, fontWeight: '600' as const },
  actionCard: { backgroundColor: Colors.accentSoft, borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: Colors.accentBorder },
  actionText: { color: Colors.accent, fontSize: 14, lineHeight: 22, fontWeight: '500' as const },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6, justifyContent: 'center' },
  metaText: { color: Colors.textMuted, fontSize: 12 },
});

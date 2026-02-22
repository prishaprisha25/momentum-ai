import React, { useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { ChevronRight, Heart } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { Note } from '@/types';
import MomentumBar from './MomentumBar';

interface NoteCardProps {
  note: Note;
  compact?: boolean;
}

const categoryColors: Record<string, { bg: string; text: string }> = {
  'Product Idea': { bg: Colors.accentSoft, text: Colors.accent },
  'Business': { bg: Colors.accentSoft, text: Colors.accentLight },
  'Technical': { bg: Colors.tealSoft, text: Colors.teal },
  'Creative': { bg: Colors.purpleSoft, text: Colors.purple },
  'Health': { bg: Colors.greenSoft, text: Colors.green },
  'Personal Growth': { bg: Colors.pinkSoft, text: Colors.pink },
  'Learning': { bg: Colors.blueSoft, text: Colors.blue },
  'General': { bg: Colors.cardHighlight, text: Colors.textSecondary },
};

function getCatStyle(category: string) {
  const lower = category.toLowerCase();
  for (const [key, val] of Object.entries(categoryColors)) {
    if (lower.includes(key.toLowerCase().split(' ')[0])) return val;
  }
  return categoryColors['General'];
}

export default React.memo(function NoteCard({ note, compact = false }: NoteCardProps) {
  const router = useRouter();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, { toValue: 0.97, useNativeDriver: true, speed: 50 }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, { toValue: 1, friction: 4, useNativeDriver: true }).start();
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/insight/${note.id}` as any);
  };

  const catStyle = getCatStyle(note.category);

  const timeAgo = () => {
    const diff = Date.now() - new Date(note.createdAt).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days === 1) return 'Yesterday';
    return `${days}d ago`;
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        style={styles.card}
        testID={`note-card-${note.id}`}
      >
        <View style={styles.topRow}>
          <View style={[styles.categoryBadge, { backgroundColor: catStyle.bg }]}>
            <Text style={[styles.categoryText, { color: catStyle.text }]}>{note.category}</Text>
          </View>
          <View style={styles.topRight}>
            {note.isFavorite && (
              <Heart size={12} color={Colors.pink} fill={Colors.pink} />
            )}
            <Text style={styles.time}>{timeAgo()}</Text>
          </View>
        </View>

        <Text style={styles.summary} numberOfLines={compact ? 2 : 3}>
          {note.summary}
        </Text>

        {!compact && note.keywords.length > 0 && (
          <View style={styles.keywordsRow}>
            {note.keywords.slice(0, 3).map((kw, i) => (
              <View key={i} style={styles.keywordChip}>
                <Text style={styles.keywordText}>{kw}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.footer}>
          <View style={styles.momentumRow}>
            <MomentumBar score={note.momentumScore} height={3} />
          </View>
          <View style={styles.scoreContainer}>
            <Text style={[styles.scoreValue, {
              color: note.momentumScore >= 7 ? Colors.accent : note.momentumScore >= 5 ? Colors.teal : Colors.textMuted
            }]}>{note.momentumScore.toFixed(1)}</Text>
            <ChevronRight size={14} color={Colors.textMuted} />
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 18,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '700' as const,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
  },
  topRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  time: {
    color: Colors.textMuted,
    fontSize: 12,
  },
  summary: {
    color: Colors.textPrimary,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 10,
  },
  keywordsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  keywordChip: {
    backgroundColor: Colors.cardHighlight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  keywordText: {
    color: Colors.textSecondary,
    fontSize: 11,
    fontWeight: '500' as const,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  momentumRow: {
    flex: 1,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  scoreValue: {
    fontSize: 14,
    fontWeight: '700' as const,
  },
});

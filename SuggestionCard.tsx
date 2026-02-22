import React, { useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Link2, Zap, Expand, Combine, TrendingUp, ArrowRight } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { Suggestion } from '@/types';

interface SuggestionCardProps {
  suggestion: Suggestion;
}

const iconMap = {
  connection: Link2,
  action: Zap,
  expand: Expand,
  combine: Combine,
  trend: TrendingUp,
} as const;

const colorMap = {
  connection: Colors.blue,
  action: Colors.accent,
  expand: Colors.teal,
  combine: Colors.purple,
  trend: Colors.green,
} as const;

const bgMap = {
  connection: Colors.blueSoft,
  action: Colors.accentSoft,
  expand: Colors.tealSoft,
  combine: Colors.purpleSoft,
  trend: Colors.greenSoft,
} as const;

export default React.memo(function SuggestionCard({ suggestion }: SuggestionCardProps) {
  const router = useRouter();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const Icon = iconMap[suggestion.type];
  const color = colorMap[suggestion.type];
  const bg = bgMap[suggestion.type];

  const handlePressIn = () => {
    Animated.spring(scaleAnim, { toValue: 0.97, useNativeDriver: true, speed: 50 }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, { toValue: 1, friction: 4, useNativeDriver: true }).start();
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (suggestion.relatedNoteIds.length > 0) {
      router.push(`/insight/${suggestion.relatedNoteIds[0]}` as any);
    }
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        style={styles.card}
      >
        <View style={[styles.iconWrap, { backgroundColor: bg }]}>
          <Icon size={18} color={color} />
        </View>
        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={1}>{suggestion.title}</Text>
          <Text style={styles.description} numberOfLines={2}>{suggestion.description}</Text>
        </View>
        <ArrowRight size={14} color={Colors.textMuted} />
      </Pressable>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 14,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  title: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '600' as const,
    marginBottom: 3,
  },
  description: {
    color: Colors.textMuted,
    fontSize: 12,
    lineHeight: 17,
  },
});

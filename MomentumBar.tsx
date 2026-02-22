import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Text } from 'react-native';
import Colors from '@/constants/colors';

interface MomentumBarProps {
  score: number;
  height?: number;
  showLabel?: boolean;
}

export default function MomentumBar({ score, height = 6, showLabel = false }: MomentumBarProps) {
  const widthAnim = useRef(new Animated.Value(0)).current;
  const normalized = Math.min(Math.max(score / 10, 0), 1);

  useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: normalized,
      duration: 900,
      useNativeDriver: false,
    }).start();
  }, [normalized]);

  const getColor = () => {
    if (score >= 8) return Colors.accent;
    if (score >= 6) return Colors.teal;
    if (score >= 4) return Colors.blue;
    return Colors.textMuted;
  };

  return (
    <View style={styles.container}>
      {showLabel && (
        <View style={styles.labelRow}>
          <Text style={styles.label}>Momentum</Text>
          <Text style={[styles.score, { color: getColor() }]}>{score.toFixed(1)}</Text>
        </View>
      )}
      <View style={[styles.track, { height, borderRadius: height / 2 }]}>
        <Animated.View
          style={[
            styles.fill,
            {
              height,
              borderRadius: height / 2,
              backgroundColor: getColor(),
              width: widthAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: '500' as const,
  },
  score: {
    fontSize: 13,
    fontWeight: '700' as const,
  },
  track: {
    backgroundColor: Colors.cardHighlight,
    overflow: 'hidden',
  },
  fill: {
    opacity: 0.9,
  },
});

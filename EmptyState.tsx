import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import Colors from '@/constants/colors';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}

export default function EmptyState({ icon, title, subtitle }: EmptyStateProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 8, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[styles.container, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}
      testID="empty-state"
    >
      <View style={styles.iconWrap}>
        <View style={styles.iconInner}>{icon}</View>
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 56,
    paddingHorizontal: 36,
  },
  iconWrap: {
    width: 88,
    height: 88,
    borderRadius: 28,
    backgroundColor: Colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.accentGlow,
  },
  iconInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: Colors.textPrimary,
    fontSize: 20,
    fontWeight: '700' as const,
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: -0.3,
  },
  subtitle: {
    color: Colors.textSecondary,
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
  },
});

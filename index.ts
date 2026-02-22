export interface Note {
  id: string;
  text: string;
  createdAt: string;
  updatedAt: string;
  category: string;
  summary: string;
  keywords: string[];
  reason: string;
  momentumScore: number;
  scoreReason: string;
  importance: number;
  actionability: number;
  novelty: number;
  recommendedAction: string;
  lastInteractedAt: string;
  isFavorite?: boolean;
}

export interface AIAnalysis {
  category: string;
  summary: string;
  keywords: string[];
  reason: string;
}

export interface MomentumResult {
  momentumScore: number;
  scoreReason: string;
  importance: number;
  actionability: number;
  novelty: number;
  recommendedAction: string;
}

export interface ResurfacedNote {
  note: Note;
  resurfaceReason: string;
  recommendedAction: string;
}

export interface Suggestion {
  id: string;
  type: 'connection' | 'action' | 'expand' | 'combine' | 'trend';
  title: string;
  description: string;
  relatedNoteIds: string[];
  createdAt: string;
}

export interface AnalyticsData {
  totalNotes: number;
  todayNotes: number;
  weekNotes: number;
  avgMomentum: number;
  topCategories: { name: string; count: number }[];
  weeklyTrend: { day: string; count: number }[];
  highMomentumCount: number;
  mostProductiveDay: string;
  streakDays: number;
}

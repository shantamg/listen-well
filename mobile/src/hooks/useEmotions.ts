import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

/**
 * Emotion check-in record
 */
export interface EmotionRecord {
  id: string;
  sessionId: string;
  intensity: number;
  context?: string;
  createdAt: string;
}

/**
 * Exercise completion record
 */
export interface ExerciseRecord {
  id: string;
  sessionId: string;
  exerciseType: 'breathing' | 'grounding' | 'other';
  intensityBefore: number;
  intensityAfter: number;
  durationSeconds: number;
  completedAt: string;
}

/**
 * Input for recording an emotion
 */
export interface RecordEmotionInput {
  sessionId: string;
  intensity: number;
  context?: string;
}

/**
 * Input for completing an exercise
 */
export interface CompleteExerciseInput {
  sessionId: string;
  exerciseType: 'breathing' | 'grounding' | 'other';
  intensityBefore: number;
  intensityAfter: number;
  durationSeconds: number;
}

/**
 * Query keys for emotion-related queries
 */
const EMOTION_QUERY_KEYS = {
  all: ['emotions'] as const,
  bySession: (sessionId: string) => ['emotions', 'session', sessionId] as const,
  exercises: ['exercises'] as const,
  exercisesBySession: (sessionId: string) => ['exercises', 'session', sessionId] as const,
};

/**
 * Stub API client for emotion endpoints
 * TODO: Replace with actual API client when available
 */
const emotionApi = {
  /**
   * Record a new emotion check-in
   */
  async recordEmotion(input: RecordEmotionInput): Promise<EmotionRecord> {
    // TODO: Replace with actual API call
    // return apiClient.post<EmotionRecord>('/emotions', input);
    console.log('[STUB] Recording emotion:', input);
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      id: `emotion-${Date.now()}`,
      sessionId: input.sessionId,
      intensity: input.intensity,
      context: input.context,
      createdAt: new Date().toISOString(),
    };
  },

  /**
   * Get emotions for a session
   */
  async getEmotions(sessionId: string): Promise<EmotionRecord[]> {
    // TODO: Replace with actual API call
    // return apiClient.get<EmotionRecord[]>(`/sessions/${sessionId}/emotions`);
    console.log('[STUB] Getting emotions for session:', sessionId);
    await new Promise((resolve) => setTimeout(resolve, 300));
    return [];
  },

  /**
   * Complete a regulation exercise
   */
  async completeExercise(input: CompleteExerciseInput): Promise<ExerciseRecord> {
    // TODO: Replace with actual API call
    // return apiClient.post<ExerciseRecord>('/exercises', input);
    console.log('[STUB] Completing exercise:', input);
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      id: `exercise-${Date.now()}`,
      sessionId: input.sessionId,
      exerciseType: input.exerciseType,
      intensityBefore: input.intensityBefore,
      intensityAfter: input.intensityAfter,
      durationSeconds: input.durationSeconds,
      completedAt: new Date().toISOString(),
    };
  },

  /**
   * Get exercises for a session
   */
  async getExercises(sessionId: string): Promise<ExerciseRecord[]> {
    // TODO: Replace with actual API call
    // return apiClient.get<ExerciseRecord[]>(`/sessions/${sessionId}/exercises`);
    console.log('[STUB] Getting exercises for session:', sessionId);
    await new Promise((resolve) => setTimeout(resolve, 300));
    return [];
  },
};

/**
 * Hook for managing emotion check-ins and regulation exercises
 *
 * Provides queries and mutations for:
 * - Recording emotion intensity levels
 * - Fetching emotion history for a session
 * - Completing regulation exercises
 * - Fetching exercise history for a session
 */
export function useEmotions(sessionId?: string) {
  const queryClient = useQueryClient();

  // Query for fetching emotions by session
  const emotionsQuery = useQuery({
    queryKey: EMOTION_QUERY_KEYS.bySession(sessionId || ''),
    queryFn: () => emotionApi.getEmotions(sessionId!),
    enabled: !!sessionId,
    staleTime: 30000, // 30 seconds
  });

  // Query for fetching exercises by session
  const exercisesQuery = useQuery({
    queryKey: EMOTION_QUERY_KEYS.exercisesBySession(sessionId || ''),
    queryFn: () => emotionApi.getExercises(sessionId!),
    enabled: !!sessionId,
    staleTime: 30000, // 30 seconds
  });

  // Mutation for recording an emotion
  const recordEmotionMutation = useMutation({
    mutationFn: emotionApi.recordEmotion,
    onSuccess: (newEmotion) => {
      // Invalidate and refetch emotions for this session
      queryClient.invalidateQueries({
        queryKey: EMOTION_QUERY_KEYS.bySession(newEmotion.sessionId),
      });
    },
  });

  // Mutation for completing an exercise
  const completeExerciseMutation = useMutation({
    mutationFn: emotionApi.completeExercise,
    onSuccess: (newExercise) => {
      // Invalidate and refetch exercises for this session
      queryClient.invalidateQueries({
        queryKey: EMOTION_QUERY_KEYS.exercisesBySession(newExercise.sessionId),
      });
    },
  });

  /**
   * Record an emotion check-in
   */
  const recordEmotion = useCallback(
    async (intensity: number, context?: string) => {
      if (!sessionId) {
        throw new Error('Session ID is required to record emotion');
      }
      return recordEmotionMutation.mutateAsync({
        sessionId,
        intensity,
        context,
      });
    },
    [sessionId, recordEmotionMutation]
  );

  /**
   * Complete a regulation exercise
   */
  const completeExercise = useCallback(
    async (
      exerciseType: CompleteExerciseInput['exerciseType'],
      intensityBefore: number,
      intensityAfter: number,
      durationSeconds: number
    ) => {
      if (!sessionId) {
        throw new Error('Session ID is required to complete exercise');
      }
      return completeExerciseMutation.mutateAsync({
        sessionId,
        exerciseType,
        intensityBefore,
        intensityAfter,
        durationSeconds,
      });
    },
    [sessionId, completeExerciseMutation]
  );

  return {
    // Emotion data
    emotions: emotionsQuery.data || [],
    isLoadingEmotions: emotionsQuery.isLoading,
    emotionsError: emotionsQuery.error,

    // Exercise data
    exercises: exercisesQuery.data || [],
    isLoadingExercises: exercisesQuery.isLoading,
    exercisesError: exercisesQuery.error,

    // Mutations
    recordEmotion,
    isRecordingEmotion: recordEmotionMutation.isPending,
    recordEmotionError: recordEmotionMutation.error,

    completeExercise,
    isCompletingExercise: completeExerciseMutation.isPending,
    completeExerciseError: completeExerciseMutation.error,

    // Refetch functions
    refetchEmotions: emotionsQuery.refetch,
    refetchExercises: exercisesQuery.refetch,
  };
}

export default useEmotions;

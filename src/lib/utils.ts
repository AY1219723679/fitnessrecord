import type {
  DailyLog,
  Exercise,
  Meal,
  Score1To5,
  Workout,
  WorkoutType
} from '../types';

export const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(' ');

export const formatDate = (date: string) =>
  new Intl.DateTimeFormat('zh-CN', {
    month: 'short',
    day: 'numeric'
  }).format(new Date(date));

export const formatWorkoutType = (type: WorkoutType) => {
  const map: Record<WorkoutType, string> = {
    chest_shoulders_core: '胸肩 + 核心',
    back_core: '背部 + 核心',
    legs_circuit: '腿部 / 循环',
    dance: '舞蹈',
    cardio: '有氧',
    rest: '休息',
    recovery: '康复训练'
  };

  return map[type];
};

export const formatMealType = (value: Meal['mealType']) => {
  const map = {
    breakfast: '早餐',
    lunch: '午餐',
    dinner: '晚餐',
    snack: '加餐',
    pre_workout: '训练前',
    post_workout: '训练后',
    before_bed: '睡前'
  };

  return map[value];
};

export const calculateDailyReadiness = (
  log: DailyLog | undefined,
  recentWorkouts: Workout[]
) => {
  if (!log) {
    return 72;
  }

  const recentLoad =
    recentWorkouts.reduce(
      (total, workout) => total + workout.durationMinutes * workout.rpe,
      0
    ) / Math.max(recentWorkouts.length, 1);
  const normalizedLoadPenalty = Math.min(20, recentLoad / 35);
  const sleepScore = log.sleepQuality * 12;
  const moodScore = log.mood * 8;
  const fatiguePenalty = (6 - log.fatigue) * 6;
  const sorenessPenalty = Math.max(0, 12 - log.sorenessAreas.length * 3);
  const painPenalty = log.painAreas.length > 0 ? 10 : 0;

  return Math.max(
    20,
    Math.min(
      100,
      Math.round(
        sleepScore + moodScore + fatiguePenalty + sorenessPenalty - painPenalty - normalizedLoadPenalty
      )
    )
  );
};

export const getTodayNutrition = (meals: Meal[], today: string) =>
  meals
    .filter((meal) => meal.date === today)
    .reduce(
      (totals, meal) => ({
        calories: totals.calories + meal.calories,
        protein: totals.protein + meal.protein,
        carbs: totals.carbs + meal.carbs,
        fat: totals.fat + meal.fat
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );

export const getExerciseName = (exercises: Exercise[], exerciseId: string) =>
  exercises.find((exercise) => exercise.id === exerciseId)?.nameZh ?? '未知动作';

export const averageScore = (values: Score1To5[]) =>
  values.length === 0
    ? 0
    : Number(
        (
          values.reduce((total, value) => total + value, 0) / values.length
        ).toFixed(1)
      );

export const makeId = (prefix: string) =>
  `${prefix}_${Math.random().toString(36).slice(2, 10)}`;

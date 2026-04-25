export type Score1To5 = 1 | 2 | 3 | 4 | 5;
export type Score1To10 = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export type WeightUnit = 'kg' | 'lb';
export type WorkoutType =
  | 'chest_shoulders_core'
  | 'back_core'
  | 'legs_circuit'
  | 'dance'
  | 'cardio'
  | 'rest'
  | 'recovery';
export type WorkoutFocus = 'strength' | 'volume' | 'conditioning' | 'skill';
export type MealType =
  | 'breakfast'
  | 'lunch'
  | 'dinner'
  | 'snack'
  | 'pre_workout'
  | 'post_workout'
  | 'before_bed';

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  weightUnit: WeightUnit;
}

export interface Exercise {
  id: string;
  key: string;
  nameEn: string;
  nameZh: string;
  category: 'push' | 'pull' | 'legs' | 'core' | 'dance' | 'cardio' | 'mobility';
  primaryMuscleGroup: string;
}

export interface WorkoutSet {
  id: string;
  exerciseId: string;
  setNumber: number;
  weight: number;
  reps: number;
  rpe: Score1To10;
  tempo?: string;
  isPr: boolean;
  note?: string;
}

export interface DanceDetails {
  style: string;
  practicedBasics: boolean;
  practicedChoreography: boolean;
}

export interface Workout {
  id: string;
  userId: string;
  date: string;
  type: WorkoutType;
  focus: WorkoutFocus;
  durationMinutes: number;
  rpe: Score1To10;
  energyLevel: Score1To5;
  hasPain: boolean;
  painAreas: string[];
  note?: string;
  exerciseEntries: WorkoutExerciseEntry[];
  danceDetails?: DanceDetails;
}

export interface WorkoutExerciseEntry {
  id: string;
  exerciseId: string;
  note?: string;
  sets: WorkoutSet[];
}

export interface FoodItem {
  id: string;
  name: string;
  defaultUnit: 'g' | 'piece' | 'ml' | 'serving';
  caloriesPer100g?: number;
  proteinPer100g?: number;
  carbsPer100g?: number;
  fatPer100g?: number;
}

export interface MealEntry {
  id: string;
  foodName: string;
  amountText: string;
  grams?: number;
}

export interface Meal {
  id: string;
  userId: string;
  date: string;
  mealType: MealType;
  entries: MealEntry[];
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  note?: string;
}

export interface DailyLog {
  id: string;
  userId: string;
  date: string;
  trainingStatus: 'trained' | 'rest' | 'dance' | 'recovery';
  sleepHours: number;
  sleepQuality: Score1To5;
  mood: Score1To5;
  fatigue: Score1To5;
  stress: Score1To5;
  hunger: Score1To5;
  appetite: string;
  digestion: string;
  sorenessAreas: string[];
  painAreas: string[];
  painLevel: Score1To10;
  bodyWeight?: number;
  menstrualStatus?: string;
  note?: string;
  bedtime?: string;
  wakeTime?: string;
}

export interface BodyMetric {
  id: string;
  userId: string;
  date: string;
  weight?: number;
  waist?: number;
  hips?: number;
  chest?: number;
  shoulders?: number;
  photoUrl?: string;
  physiqueNote?: string;
}

export interface WorkoutTemplate {
  id: string;
  userId: string;
  name: string;
  type: WorkoutType;
  focus: WorkoutFocus;
  description: string;
  exerciseIds: string[];
}

export interface DashboardStats {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  readinessScore: number;
}

export interface AppState {
  user: UserProfile;
  exercises: Exercise[];
  foods: FoodItem[];
  workouts: Workout[];
  meals: Meal[];
  dailyLogs: DailyLog[];
  bodyMetrics: BodyMetric[];
  templates: WorkoutTemplate[];
  addWorkout: (workout: Workout) => void;
  addMeal: (meal: Meal) => void;
  addDailyLog: (log: DailyLog) => void;
  addBodyMetric: (metric: BodyMetric) => void;
  applyTemplate: (templateId: string) => Workout | null;
  updateWeightUnit: (unit: WeightUnit) => void;
}

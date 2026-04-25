import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  exerciseLibrary,
  foodLibrary,
  mockBodyMetrics,
  mockDailyLogs,
  mockMeals,
  mockTemplates,
  mockUser,
  mockWorkouts
} from '../data/mockData';
import { makeId } from '../lib/utils';
import type { AppState, Workout } from '../types';

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: mockUser,
      exercises: exerciseLibrary,
      foods: foodLibrary,
      workouts: mockWorkouts,
      meals: mockMeals,
      dailyLogs: mockDailyLogs,
      bodyMetrics: mockBodyMetrics,
      templates: mockTemplates,
      addWorkout: (workout) =>
        set((state) => ({
          workouts: [workout, ...state.workouts].sort((a, b) => b.date.localeCompare(a.date))
        })),
      addMeal: (meal) =>
        set((state) => ({
          meals: [meal, ...state.meals].sort((a, b) => b.date.localeCompare(a.date))
        })),
      addDailyLog: (log) =>
        set((state) => {
          const next = state.dailyLogs.filter((item) => item.date !== log.date);
          return {
            dailyLogs: [log, ...next].sort((a, b) => b.date.localeCompare(a.date))
          };
        }),
      addBodyMetric: (metric) =>
        set((state) => {
          const next = state.bodyMetrics.filter((item) => item.date !== metric.date);
          return {
            bodyMetrics: [metric, ...next].sort((a, b) => b.date.localeCompare(a.date))
          };
        }),
      applyTemplate: (templateId) => {
        const template = get().templates.find((item) => item.id === templateId);
        if (!template) {
          return null;
        }

        const workout: Workout = {
          id: makeId('workout'),
          userId: get().user.id,
          date: new Date().toISOString().slice(0, 10),
          type: template.type,
          focus: template.focus,
          durationMinutes: 60,
          rpe: 7,
          energyLevel: 3,
          hasPain: false,
          painAreas: [],
          note: `${template.name} 模板创建`,
          exerciseEntries: template.exerciseIds.map((exerciseId) => ({
            id: makeId('entry'),
            exerciseId,
            note: '',
            sets: [
              {
                id: makeId('set'),
                exerciseId,
                setNumber: 1,
                weight: 0,
                reps: exerciseId.includes('plank') || exerciseId.includes('hold') ? 1 : 8,
                rpe: 7,
                tempo: '',
                isPr: false,
                note: ''
              }
            ]
          }))
        };

        set((state) => ({
          workouts: [workout, ...state.workouts]
        }));

        return workout;
      },
      updateWeightUnit: (unit) =>
        set((state) => ({
          user: {
            ...state.user,
            weightUnit: unit
          }
        }))
    }),
    {
      name: 'fitness-tracker-mvp'
    }
  )
);

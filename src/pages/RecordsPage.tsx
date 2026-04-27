import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { formatDate, formatMealType, formatWorkoutType, getExerciseName } from '../lib/utils';
import { useAppStore } from '../store/appStore';

export function RecordsPage() {
  const { exercises, workouts, meals, dailyLogs } = useAppStore();

  return (
    <div className="grid gap-5">
      <Card title="训练记录" subtitle="集中查看已保存的训练记录">
        <div className="space-y-3">
          {workouts.length === 0 ? (
            <p className="text-sm text-muted">还没有训练记录。</p>
          ) : (
            workouts.map((workout) => (
              <div key={workout.id} className="rounded-2xl border border-line bg-panel p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm text-muted">{formatDate(workout.date)}</p>
                    <p className="mt-1 text-lg font-medium text-slate-900">
                      {formatWorkoutType(workout.type)}
                    </p>
                    <p className="mt-1 text-sm text-muted">
                      {workout.focus === 'strength'
                        ? '重量日'
                        : workout.focus === 'volume'
                          ? '容量日'
                          : workout.focus}
                    </p>
                  </div>
                  <div className="text-right text-sm text-muted">
                    <p>{workout.durationMinutes} min</p>
                    <p>RPE {workout.rpe}</p>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {workout.exerciseEntries.map((entry) => (
                    <span
                      key={entry.id}
                      className="rounded-full border border-line bg-surface px-3 py-1 text-xs text-slate-900"
                    >
                      {getExerciseName(exercises, entry.exerciseId)}
                    </span>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      <Card title="饮食记录" subtitle="按餐次查看已保存的饮食记录">
        <div className="space-y-3">
          {meals.length === 0 ? (
            <p className="text-sm text-muted">还没有饮食记录。</p>
          ) : (
            meals.map((meal) => (
              <div key={meal.id} className="rounded-2xl border border-line bg-panel p-4">
                <p className="text-sm text-muted">{formatDate(meal.date)}</p>
                <p className="mt-2 font-mono text-sm text-accent">
                  {formatMealType(meal.mealType)}｜
                  {meal.entries.map((entry) => entry.foodName).join('、')}｜约 {meal.calories} kcal｜P{' '}
                  {meal.protein}g / C {meal.carbs}g / F {meal.fat}g
                </p>
                {meal.note ? <p className="mt-2 text-sm text-muted">{meal.note}</p> : null}
              </div>
            ))
          )}
        </div>
      </Card>

      <Card title="感受记录" subtitle="查看睡眠、心情、疲劳和恢复记录">
        <div className="space-y-3">
          {dailyLogs.length === 0 ? (
            <p className="text-sm text-muted">还没有感受记录。</p>
          ) : (
            dailyLogs.map((log) => (
              <div key={log.id} className="rounded-2xl border border-line bg-panel p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm text-muted">{formatDate(log.date)}</p>
                    <p className="mt-1 text-slate-900">
                      睡眠 {log.sleepHours}h · 心情 {log.mood}/5 · 疲劳 {log.fatigue}/5
                    </p>
                  </div>
                  <span className="rounded-full border border-line bg-surface px-3 py-1 text-xs text-slate-900">
                    疼痛 {log.painLevel}/10
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted">
                  酸痛: {log.sorenessAreas.join('、') || '无'} | 疼痛: {log.painAreas.join('、') || '无'}
                </p>
              </div>
            ))
          )}
        </div>
      </Card>

      <Card title="更多页面" subtitle="其他非记录入口">
        <div className="grid gap-3 md:grid-cols-3">
          {[
            { to: '/progress', label: 'Progress' },
            { to: '/templates', label: 'Templates' },
            { to: '/settings', label: 'Settings' }
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="flex items-center justify-between rounded-2xl border border-line bg-panel px-4 py-4 text-sm text-ink transition hover:bg-[#e4f0ff]"
            >
              <span>{item.label}</span>
              <ChevronRight size={16} />
            </Link>
          ))}
        </div>
      </Card>
    </div>
  );
}

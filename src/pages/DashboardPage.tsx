import { Activity, BatteryCharging, MoonStar, SmilePlus, Utensils } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { StatCard } from '../components/ui/StatCard';
import { calculateDailyReadiness, formatDate, formatWorkoutType, getTodayNutrition } from '../lib/utils';
import { useAppStore } from '../store/appStore';

export function DashboardPage() {
  const { workouts, meals, dailyLogs, bodyMetrics, exercises } = useAppStore();
  const today = new Date().toISOString().slice(0, 10);
  const sevenDaysAgo = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);
  const todayLog = dailyLogs.find((log) => log.date === today);
  const nutrition = getTodayNutrition(meals, today);
  const recentWorkouts = workouts.filter((workout) => workout.date >= sevenDaysAgo);
  const readinessScore = calculateDailyReadiness(todayLog, recentWorkouts);
  const bodyMetric = bodyMetrics.find((item) => item.date === today);
  const latestWorkout = workouts[0];

  return (
    <div className="grid gap-5">
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Daily Readiness" value={`${readinessScore}`} hint="结合睡眠、心情、疲劳、疼痛和近期训练量" icon={<BatteryCharging size={20} />} />
        <StatCard label="今日训练状态" value={latestWorkout ? formatWorkoutType(latestWorkout.type) : '未记录'} hint={todayLog?.trainingStatus ?? '待填写'} icon={<Activity size={20} />} />
        <StatCard label="今日饮食总览" value={`${nutrition.calories} kcal`} hint={`P ${nutrition.protein} / C ${nutrition.carbs} / F ${nutrition.fat}`} icon={<Utensils size={20} />} />
        <StatCard label="今日睡眠" value={todayLog ? `${todayLog.sleepHours} h` : '--'} hint={todayLog ? `质量 ${todayLog.sleepQuality}/5` : '待填写'} icon={<MoonStar size={20} />} />
        <StatCard label="今日心情" value={todayLog ? `${todayLog.mood}/5` : '--'} hint={todayLog ? `疲劳 ${todayLog.fatigue}/5` : '待填写'} icon={<SmilePlus size={20} />} />
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <Card title="今日状态概览" subtitle="训练、恢复和主观反馈汇总">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-line bg-surface p-4">
              <p className="text-sm text-muted">疼痛 / 不适</p>
              <p className="mt-2 text-lg font-medium text-white">
                {todayLog?.painAreas.length ? todayLog.painAreas.join('、') : '无明显疼痛'}
              </p>
            </div>
            <div className="rounded-2xl border border-line bg-surface p-4">
              <p className="text-sm text-muted">肌肉酸痛</p>
              <p className="mt-2 text-lg font-medium text-white">
                {todayLog?.sorenessAreas.length ? todayLog.sorenessAreas.join('、') : '恢复良好'}
              </p>
            </div>
            <div className="rounded-2xl border border-line bg-surface p-4">
              <p className="text-sm text-muted">今日体重</p>
              <p className="mt-2 text-lg font-medium text-white">
                {todayLog?.bodyWeight ?? bodyMetric?.weight ?? '--'} kg
              </p>
            </div>
            <div className="rounded-2xl border border-line bg-surface p-4">
              <p className="text-sm text-muted">今日备注</p>
              <p className="mt-2 text-sm leading-6 text-white">
                {todayLog?.note ?? '今天还没有额外备注。'}
              </p>
            </div>
          </div>
        </Card>

        <Card title="最近一次训练" subtitle="帮助快速回看上次负荷">
          <div className="space-y-4">
            <div className="rounded-2xl border border-line bg-surface p-4">
              {latestWorkout ? (
                <>
                  <p className="text-sm text-muted">{formatDate(latestWorkout.date)}</p>
                  <p className="mt-2 text-xl font-semibold text-white">{formatWorkoutType(latestWorkout.type)}</p>
                  <p className="mt-1 text-sm text-muted">
                    {latestWorkout.durationMinutes} 分钟 · RPE {latestWorkout.rpe} · 能量 {latestWorkout.energyLevel}/5
                  </p>
                </>
              ) : (
                <p className="text-sm text-muted">还没有训练记录。</p>
              )}
            </div>
            <div className="space-y-2">
              {latestWorkout?.exerciseEntries.slice(0, 4).map((entry) => (
                <div key={entry.id} className="flex items-center justify-between rounded-2xl border border-line px-4 py-3">
                  <span className="text-sm text-white">
                    {exercises.find((item) => item.id === entry.exerciseId)?.nameZh}
                  </span>
                  <span className="text-sm text-muted">{entry.sets.length} 组</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card title="最近 7 天恢复观察">
          <ul className="space-y-3 text-sm text-muted">
            <li>过去 7 天你有 2 天睡眠低于 7 小时，第二天训练 RPE 平均更高。</li>
            <li>背部训练频率稳定，引体向上进步快于高位下拉。</li>
            <li>最近三天疲劳度略高，下一次可考虑核心轻量日或容量日。</li>
          </ul>
        </Card>
        <Card title="营养目标">
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between rounded-2xl border border-line bg-surface px-4 py-3">
              <span className="text-muted">训练日热量</span>
              <span className="text-white">1900 - 2100 kcal</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-line bg-surface px-4 py-3">
              <span className="text-muted">蛋白质目标</span>
              <span className="text-white">110 - 130 g</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-line bg-surface px-4 py-3">
              <span className="text-muted">碳水策略</span>
              <span className="text-white">训练日适当提高</span>
            </div>
          </div>
        </Card>
        <Card title="近期体型变化">
          <div className="space-y-3">
            <div className="rounded-2xl border border-line bg-surface p-4">
              <p className="text-sm text-muted">腰围</p>
              <p className="mt-2 text-xl font-semibold text-white">{bodyMetrics[0]?.waist} cm</p>
            </div>
            <div className="rounded-2xl border border-line bg-surface p-4">
              <p className="text-sm text-muted">肩宽</p>
              <p className="mt-2 text-xl font-semibold text-white">{bodyMetrics[0]?.shoulders} cm</p>
            </div>
            <p className="text-sm text-muted">{bodyMetrics[0]?.physiqueNote}</p>
          </div>
        </Card>
      </div>
    </div>
  );
}

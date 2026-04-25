import { useMemo, useState } from 'react';
import { ProgressCharts } from '../components/charts/ProgressCharts';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { makeId } from '../lib/utils';
import { useAppStore } from '../store/appStore';
import type { BodyMetric } from '../types';

export function ProgressPage() {
  const { user, workouts, meals, dailyLogs, bodyMetrics, addBodyMetric } = useAppStore();
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [weight, setWeight] = useState(56.8);
  const [waist, setWaist] = useState(65.2);
  const [hips, setHips] = useState(91);
  const [chest, setChest] = useState(84.5);
  const [shoulders, setShoulders] = useState(39.2);

  const chartData = useMemo(() => {
    const weightTrend = [...bodyMetrics]
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((metric) => ({ date: metric.date.slice(5), weight: metric.weight ?? 0 }));

    const trainingVolumeTrend = [...workouts]
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((workout) => ({
        date: workout.date.slice(5),
        volume: workout.exerciseEntries.reduce(
          (total, entry) =>
            total +
            entry.sets.reduce((sum, set) => sum + set.weight * Math.max(set.reps, 1), 0),
          0
        )
      }));

    const sleepVsRpe = workouts.map((workout) => ({
      date: workout.date.slice(5),
      sleepHours: dailyLogs.find((log) => log.date === workout.date)?.sleepHours ?? 0,
      rpe: workout.rpe
    }));

    const carbsVsPerformance = workouts.map((workout) => {
      const dailyCarbs = meals
        .filter((meal) => meal.date === workout.date)
        .reduce((total, meal) => total + meal.carbs, 0);

      const topSet = Math.max(
        ...workout.exerciseEntries.flatMap((entry) =>
          entry.sets.map((set) => set.weight * Math.max(set.reps, 1))
        ),
        0
      );

      return {
        date: workout.date.slice(5),
        carbs: dailyCarbs,
        topSet
      };
    });

    return {
      weightTrend,
      trainingVolumeTrend,
      sleepVsRpe,
      carbsVsPerformance
    };
  }, [bodyMetrics, dailyLogs, meals, workouts]);

  const weeklyFrequency = workouts.filter((workout) => workout.date >= sevenDaysAgo).length;
  const proteinDaysHit = dailyLogs.filter((log) => {
    const protein = meals
      .filter((meal) => meal.date === log.date)
      .reduce((total, meal) => total + meal.protein, 0);
    return protein >= 110;
  }).length;

  const painFrequency = dailyLogs.filter((log) => log.painAreas.length > 0).length;
  const danceConflict = workouts.filter((workout) => workout.type === 'dance' && workout.rpe >= 7).length;

  const handleSaveMetric = () => {
    const metric: BodyMetric = {
      id: makeId('metric'),
      userId: user.id,
      date,
      weight,
      waist,
      hips,
      chest,
      shoulders
    };

    addBodyMetric(metric);
  };

  return (
    <div className="grid gap-5">
      <div className="grid gap-5 lg:grid-cols-[0.72fr_1.28fr]">
        <Card title="身体数据记录" subtitle="记录体重、围度和主观体型变化">
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="日期" type="date" value={date} onChange={(event) => setDate(event.target.value)} />
            <Input label={`体重 (${user.weightUnit})`} type="number" value={weight} onChange={(event) => setWeight(Number(event.target.value))} />
            <Input label="腰围 (cm)" type="number" value={waist} onChange={(event) => setWaist(Number(event.target.value))} />
            <Input label="臀围 (cm)" type="number" value={hips} onChange={(event) => setHips(Number(event.target.value))} />
            <Input label="胸围 (cm)" type="number" value={chest} onChange={(event) => setChest(Number(event.target.value))} />
            <Input label="肩宽 (cm)" type="number" value={shoulders} onChange={(event) => setShoulders(Number(event.target.value))} />
          </div>
          <div className="mt-4">
            <Button onClick={handleSaveMetric}>保存身体数据</Button>
          </div>
        </Card>

        <div className="grid gap-5 md:grid-cols-2">
          <Card title="Insight Cards">
            <ul className="space-y-3 text-sm text-muted">
              <li>过去 7 天训练频率为 {weeklyFrequency} 次，维持得很稳定。</li>
              <li>蛋白质达标天数 {proteinDaysHit} 天，仍有提升空间。</li>
              <li>疼痛出现频率 {painFrequency} 次，主要集中在肩前束。</li>
              <li>舞蹈与力量训练高强度重叠 {danceConflict} 次，建议错开高强度上肢日。</li>
            </ul>
          </Card>
          <Card title="主项趋势">
            <div className="space-y-3 text-sm">
              <div className="rounded-2xl border border-line bg-surface p-4">
                <p className="text-muted">Bench / Pull-up / Row / Shoulder Press</p>
                <p className="mt-2 text-white">当前 MVP 已支持历史训练数据对比和图表聚合。</p>
              </div>
              <div className="rounded-2xl border border-line bg-surface p-4">
                <p className="text-muted">睡眠与疲劳</p>
                <p className="mt-2 text-white">低于 7 小时睡眠时，训练 RPE 往往更高。</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <ProgressCharts {...chartData} />
    </div>
  );
}
  const sevenDaysAgo = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);

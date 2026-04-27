import { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { makeId } from '../lib/utils';
import { useAppStore } from '../store/appStore';
import type { DailyLog } from '../types';

const today = new Date().toISOString().slice(0, 10);

export function CheckInPage() {
  const { user, addDailyLog } = useAppStore();
  const [date, setDate] = useState(today);
  const [sleepHours, setSleepHours] = useState(7.5);
  const [bedtime, setBedtime] = useState('00:00');
  const [wakeTime, setWakeTime] = useState('07:30');
  const [sleepQuality, setSleepQuality] = useState(4);
  const [mood, setMood] = useState(4);
  const [stress, setStress] = useState(3);
  const [fatigue, setFatigue] = useState(2);
  const [hunger, setHunger] = useState(3);
  const [appetite, setAppetite] = useState('稳定');
  const [digestion, setDigestion] = useState('正常');
  const [sorenessAreas, setSorenessAreas] = useState('背部, 核心');
  const [painAreas, setPainAreas] = useState('');
  const [painLevel, setPainLevel] = useState(1);
  const [bodyWeight, setBodyWeight] = useState(56.8);
  const [menstrualStatus, setMenstrualStatus] = useState('');
  const [note, setNote] = useState('');

  const handleSave = () => {
    const log: DailyLog = {
      id: makeId('log'),
      userId: user.id,
      date,
      trainingStatus: 'trained',
      sleepHours,
      bedtime,
      wakeTime,
      sleepQuality: sleepQuality as DailyLog['sleepQuality'],
      mood: mood as DailyLog['mood'],
      stress: stress as DailyLog['stress'],
      fatigue: fatigue as DailyLog['fatigue'],
      hunger: hunger as DailyLog['hunger'],
      appetite,
      digestion,
      sorenessAreas: sorenessAreas
        .split(/[，,]/)
        .map((item) => item.trim())
        .filter(Boolean),
      painAreas: painAreas
        .split(/[，,]/)
        .map((item) => item.trim())
        .filter(Boolean),
      painLevel: painLevel as DailyLog['painLevel'],
      bodyWeight,
      menstrualStatus,
      note
    };

    addDailyLog(log);
    setNote('');
  };

  return (
    <div className="grid gap-5">
      <Card title="Daily Check-in" subtitle="记录睡眠、心情、恢复、疼痛、饥饿和身体状态">
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="日期" type="date" value={date} onChange={(event) => setDate(event.target.value)} />
          <Input label={`体重 (${user.weightUnit})`} type="number" value={bodyWeight} onChange={(event) => setBodyWeight(Number(event.target.value))} />
          <Input label="睡眠时长" type="number" step="0.1" value={sleepHours} onChange={(event) => setSleepHours(Number(event.target.value))} />
          <Input label="睡眠质量 1-5" type="number" min="1" max="5" value={sleepQuality} onChange={(event) => setSleepQuality(Number(event.target.value))} />
          <Input label="入睡时间" type="time" value={bedtime} onChange={(event) => setBedtime(event.target.value)} />
          <Input label="起床时间" type="time" value={wakeTime} onChange={(event) => setWakeTime(event.target.value)} />
          <Input label="心情 1-5" type="number" min="1" max="5" value={mood} onChange={(event) => setMood(Number(event.target.value))} />
          <Input label="压力 1-5" type="number" min="1" max="5" value={stress} onChange={(event) => setStress(Number(event.target.value))} />
          <Input label="疲劳度 1-5" type="number" min="1" max="5" value={fatigue} onChange={(event) => setFatigue(Number(event.target.value))} />
          <Input label="饥饿感 1-5" type="number" min="1" max="5" value={hunger} onChange={(event) => setHunger(Number(event.target.value))} />
          <Input label="食欲" value={appetite} onChange={(event) => setAppetite(event.target.value)} />
          <Input label="消化状态" value={digestion} onChange={(event) => setDigestion(event.target.value)} />
          <Input label="肌肉酸痛部位" value={sorenessAreas} onChange={(event) => setSorenessAreas(event.target.value)} />
          <Input label="疼痛部位" value={painAreas} onChange={(event) => setPainAreas(event.target.value)} />
          <Input label="疼痛程度 1-10" type="number" min="1" max="10" value={painLevel} onChange={(event) => setPainLevel(Number(event.target.value))} />
          <Input label="经期状态（可选）" value={menstrualStatus} onChange={(event) => setMenstrualStatus(event.target.value)} />
        </div>
        <div className="mt-4">
          <Textarea label="今日备注" placeholder="今天的恢复感受、精神状态、训练调整建议" value={note} onChange={(event) => setNote(event.target.value)} />
        </div>
        <div className="mt-4">
          <Button onClick={handleSave}>保存 Check-in</Button>
        </div>
      </Card>
    </div>
  );
}

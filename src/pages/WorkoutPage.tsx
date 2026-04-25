import { useMemo, useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Textarea } from '../components/ui/Textarea';
import { formatDate, formatWorkoutType, getExerciseName, makeId } from '../lib/utils';
import { useAppStore } from '../store/appStore';
import type { Workout, WorkoutExerciseEntry, WorkoutFocus, WorkoutType } from '../types';

const today = new Date().toISOString().slice(0, 10);

export function WorkoutPage() {
  const { exercises, workouts, templates, addWorkout, applyTemplate, user } = useAppStore();
  const [date, setDate] = useState(today);
  const [type, setType] = useState<WorkoutType>('chest_shoulders_core');
  const [focus, setFocus] = useState<WorkoutFocus>('strength');
  const [durationMinutes, setDurationMinutes] = useState(70);
  const [rpe, setRpe] = useState(7);
  const [energyLevel, setEnergyLevel] = useState(4);
  const [painAreas, setPainAreas] = useState('');
  const [note, setNote] = useState('');
  const [selectedExerciseId, setSelectedExerciseId] = useState(exercises[0]?.id ?? '');
  const [exerciseEntries, setExerciseEntries] = useState<WorkoutExerciseEntry[]>([
    {
      id: makeId('entry'),
      exerciseId: exercises[0]?.id ?? '',
      note: '',
      sets: [{ id: makeId('set'), exerciseId: exercises[0]?.id ?? '', setNumber: 1, weight: 0, reps: 8, rpe: 7, tempo: '', isPr: false, note: '' }]
    }
  ]);
  const [templateId, setTemplateId] = useState(templates[0]?.id ?? '');

  const exerciseTrend = useMemo(() => {
    return workouts
      .filter((workout) =>
        workout.exerciseEntries.some((entry) => entry.exerciseId === selectedExerciseId)
      )
      .map((workout) => {
        const matchingEntry = workout.exerciseEntries.find((entry) => entry.exerciseId === selectedExerciseId);
        const topSet = matchingEntry?.sets.reduce(
          (best, set) => Math.max(best, set.weight * Math.max(set.reps, 1)),
          0
        );

        return {
          id: workout.id,
          date: workout.date,
          topSet: topSet ?? 0
        };
      })
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [selectedExerciseId, workouts]);

  const addExerciseEntry = () => {
    setExerciseEntries((current) => [
      ...current,
      {
        id: makeId('entry'),
        exerciseId: exercises[0]?.id ?? '',
        note: '',
        sets: [{ id: makeId('set'), exerciseId: exercises[0]?.id ?? '', setNumber: 1, weight: 0, reps: 8, rpe: 7, tempo: '', isPr: false, note: '' }]
      }
    ]);
  };

  const updateExerciseEntry = (
    entryId: string,
    updater: (entry: WorkoutExerciseEntry) => WorkoutExerciseEntry
  ) => {
    setExerciseEntries((current) => current.map((entry) => (entry.id === entryId ? updater(entry) : entry)));
  };

  const handleSaveWorkout = () => {
    const workout: Workout = {
      id: makeId('workout'),
      userId: user.id,
      date,
      type,
      focus,
      durationMinutes,
      rpe: rpe as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10,
      energyLevel: energyLevel as 1 | 2 | 3 | 4 | 5,
      hasPain: Boolean(painAreas.trim()),
      painAreas: painAreas
        .split(/[，,]/)
        .map((item) => item.trim())
        .filter(Boolean),
      note,
      exerciseEntries
    };

    addWorkout(workout);
    setNote('');
    setPainAreas('');
  };

  const handleApplyTemplate = () => {
    const created = applyTemplate(templateId);
    if (created) {
      setDate(created.date);
      setType(created.type);
      setFocus(created.focus);
      setExerciseEntries(created.exerciseEntries);
      setNote(created.note ?? '');
    }
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
      <Card title="记录训练" subtitle="支持模板、重量日 / 容量日、舞蹈训练和动作组次输入">
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="日期" type="date" value={date} onChange={(event) => setDate(event.target.value)} />
          <Select label="训练类型" value={type} onChange={(event) => setType(event.target.value as WorkoutType)}>
            <option value="chest_shoulders_core">胸肩 (+ 核心)</option>
            <option value="back_core">背 (+ 核心)</option>
            <option value="legs_circuit">腿日 / 循环</option>
            <option value="dance">舞蹈</option>
            <option value="cardio">有氧</option>
            <option value="rest">休息日</option>
            <option value="recovery">康复训练</option>
          </Select>
          <Select label="训练焦点" value={focus} onChange={(event) => setFocus(event.target.value as WorkoutFocus)}>
            <option value="strength">重量日</option>
            <option value="volume">容量日</option>
            <option value="conditioning">恢复 / 循环</option>
            <option value="skill">技能 / 舞蹈</option>
          </Select>
          <Input label="时长（分钟）" type="number" value={durationMinutes} onChange={(event) => setDurationMinutes(Number(event.target.value))} />
          <Input label="主观强度 RPE 1-10" type="number" min="1" max="10" value={rpe} onChange={(event) => setRpe(Number(event.target.value))} />
          <Input label="能量水平 1-5" type="number" min="1" max="5" value={energyLevel} onChange={(event) => setEnergyLevel(Number(event.target.value))} />
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-[1fr_auto]">
          <Select label="从模板快速创建" value={templateId} onChange={(event) => setTemplateId(event.target.value)}>
            {templates.map((template) => (
              <option key={template.id} value={template.id}>
                {template.name}
              </option>
            ))}
          </Select>
          <div className="flex items-end">
            <Button fullWidth variant="secondary" onClick={handleApplyTemplate}>
              应用模板
            </Button>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {exerciseEntries.map((entry, index) => (
            <div key={entry.id} className="rounded-3xl border border-line bg-surface p-4">
              <div className="grid gap-4 md:grid-cols-[1fr_auto]">
                <Select
                  label={`动作 ${index + 1}`}
                  value={entry.exerciseId}
                  onChange={(event) =>
                    updateExerciseEntry(entry.id, (current) => ({
                      ...current,
                      exerciseId: event.target.value,
                      sets: current.sets.map((set) => ({ ...set, exerciseId: event.target.value }))
                    }))
                  }
                >
                  {exercises.map((exercise) => (
                    <option key={exercise.id} value={exercise.id}>
                      {exercise.nameZh}
                    </option>
                  ))}
                </Select>
                <div className="flex items-end">
                  <Button variant="ghost" onClick={addExerciseEntry}>
                    添加动作
                  </Button>
                </div>
              </div>

              <div className="mt-4 overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="text-muted">
                    <tr>
                      <th className="pb-2 pr-3">组</th>
                      <th className="pb-2 pr-3">重量 ({user.weightUnit})</th>
                      <th className="pb-2 pr-3">次数</th>
                      <th className="pb-2 pr-3">RPE</th>
                      <th className="pb-2 pr-3">Tempo</th>
                      <th className="pb-2 pr-3">PR</th>
                    </tr>
                  </thead>
                  <tbody>
                    {entry.sets.map((set, setIndex) => (
                      <tr key={set.id}>
                        <td className="py-2 pr-3 text-white">{setIndex + 1}</td>
                        <td className="py-2 pr-3">
                          <input
                            className="w-20 rounded-xl border border-line bg-panel px-3 py-2 text-white"
                            type="number"
                            value={set.weight}
                            onChange={(event) =>
                              updateExerciseEntry(entry.id, (current) => ({
                                ...current,
                                sets: current.sets.map((item) =>
                                  item.id === set.id ? { ...item, weight: Number(event.target.value) } : item
                                )
                              }))
                            }
                          />
                        </td>
                        <td className="py-2 pr-3">
                          <input
                            className="w-20 rounded-xl border border-line bg-panel px-3 py-2 text-white"
                            type="number"
                            value={set.reps}
                            onChange={(event) =>
                              updateExerciseEntry(entry.id, (current) => ({
                                ...current,
                                sets: current.sets.map((item) =>
                                  item.id === set.id ? { ...item, reps: Number(event.target.value) } : item
                                )
                              }))
                            }
                          />
                        </td>
                        <td className="py-2 pr-3">
                          <input
                            className="w-20 rounded-xl border border-line bg-panel px-3 py-2 text-white"
                            type="number"
                            min="1"
                            max="10"
                            value={set.rpe}
                            onChange={(event) =>
                              updateExerciseEntry(entry.id, (current) => ({
                                ...current,
                                sets: current.sets.map((item) =>
                                  item.id === set.id
                                    ? {
                                        ...item,
                                        rpe: Number(event.target.value) as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
                                      }
                                    : item
                                )
                              }))
                            }
                          />
                        </td>
                        <td className="py-2 pr-3">
                          <input
                            className="w-28 rounded-xl border border-line bg-panel px-3 py-2 text-white"
                            value={set.tempo ?? ''}
                            onChange={(event) =>
                              updateExerciseEntry(entry.id, (current) => ({
                                ...current,
                                sets: current.sets.map((item) =>
                                  item.id === set.id ? { ...item, tempo: event.target.value } : item
                                )
                              }))
                            }
                          />
                        </td>
                        <td className="py-2 pr-3">
                          <input
                            className="h-4 w-4 rounded border-line bg-panel"
                            type="checkbox"
                            checked={set.isPr}
                            onChange={(event) =>
                              updateExerciseEntry(entry.id, (current) => ({
                                ...current,
                                sets: current.sets.map((item) =>
                                  item.id === set.id ? { ...item, isPr: event.target.checked } : item
                                )
                              }))
                            }
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>

        {type === 'dance' && (
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Input label="舞种" placeholder="例如 Urban Choreo / Jazz Funk" />
            <Input label="舞蹈备注" placeholder="是否跳成品舞、是否练基础" />
          </div>
        )}

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Input label="疼痛部位" placeholder="肩前束，腰背" value={painAreas} onChange={(event) => setPainAreas(event.target.value)} />
          <Textarea label="训练备注" placeholder="记录状态、动作感觉、离心控制等" value={note} onChange={(event) => setNote(event.target.value)} />
        </div>

        <div className="mt-4">
          <Button onClick={handleSaveWorkout}>保存训练</Button>
        </div>
      </Card>

      <div className="grid gap-5">
        <Card title="动作历史对比" subtitle="选择一个动作查看历史表现">
          <Select label="动作" value={selectedExerciseId} onChange={(event) => setSelectedExerciseId(event.target.value)}>
            {exercises.map((exercise) => (
              <option key={exercise.id} value={exercise.id}>
                {exercise.nameZh}
              </option>
            ))}
          </Select>
          <div className="mt-4 space-y-3">
            {exerciseTrend.length === 0 ? (
              <p className="text-sm text-muted">还没有该动作的历史记录。</p>
            ) : (
              exerciseTrend.map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded-2xl border border-line bg-surface px-4 py-3">
                  <span className="text-sm text-white">{formatDate(item.date)}</span>
                  <span className="font-mono text-sm text-accent">{item.topSet.toFixed(1)} volume index</span>
                </div>
              ))
            )}
          </div>
        </Card>

        <Card title="历史训练" subtitle="最近训练记录">
          <div className="space-y-3">
            {workouts.map((workout) => (
              <div key={workout.id} className="rounded-2xl border border-line bg-surface p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm text-muted">{formatDate(workout.date)}</p>
                    <p className="mt-1 text-lg font-medium text-white">{formatWorkoutType(workout.type)}</p>
                    <p className="mt-1 text-sm text-muted">
                      {workout.focus === 'strength' ? '重量日' : workout.focus === 'volume' ? '容量日' : workout.focus}
                    </p>
                  </div>
                  <div className="text-right text-sm text-muted">
                    <p>{workout.durationMinutes} min</p>
                    <p>RPE {workout.rpe}</p>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {workout.exerciseEntries.map((entry) => (
                    <span key={entry.id} className="rounded-full border border-line px-3 py-1 text-xs text-white">
                      {getExerciseName(exercises, entry.exerciseId)}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

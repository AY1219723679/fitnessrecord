import { useState } from 'react';
import { ImagePlus, Sparkles } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Textarea } from '../components/ui/Textarea';
import { makeId } from '../lib/utils';
import { useAppStore } from '../store/appStore';
import type { Workout, WorkoutAnalysisResult, WorkoutExerciseEntry, WorkoutFocus, WorkoutType } from '../types';

const today = new Date().toISOString().slice(0, 10);

export function WorkoutPage() {
  const { exercises, templates, addWorkout, applyTemplate, user } = useAppStore();
  const [date, setDate] = useState(today);
  const [type, setType] = useState<WorkoutType>('chest_shoulders_core');
  const [focus, setFocus] = useState<WorkoutFocus>('strength');
  const [durationMinutes, setDurationMinutes] = useState(70);
  const [rpe, setRpe] = useState(7);
  const [energyLevel, setEnergyLevel] = useState(4);
  const [painAreas, setPainAreas] = useState('');
  const [note, setNote] = useState('');
  const [workoutInput, setWorkoutInput] = useState(
    '今天练背：引体向上2组 6次/5次，杠铃划船3组 42.5kg 8次、42.5kg 8次、45kg 6次，绳索卷腹1组 22.5kg 15次，整体RPE 8，训练78分钟。'
  );
  const [workoutImageDataUrl, setWorkoutImageDataUrl] = useState('');
  const [analysis, setAnalysis] = useState<WorkoutAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState('');
  const [exerciseEntries, setExerciseEntries] = useState<WorkoutExerciseEntry[]>([
    {
      id: makeId('entry'),
      exerciseId: exercises[0]?.id ?? '',
      note: '',
      sets: [{ id: makeId('set'), exerciseId: exercises[0]?.id ?? '', setNumber: 1, weight: 0, reps: 8, rpe: 7, isPr: false, note: '' }]
    }
  ]);
  const [templateId, setTemplateId] = useState(templates[0]?.id ?? '');

  const createDefaultExerciseEntry = (): WorkoutExerciseEntry => ({
    id: makeId('entry'),
    exerciseId: exercises[0]?.id ?? '',
    note: '',
    sets: [
      {
        id: makeId('set'),
        exerciseId: exercises[0]?.id ?? '',
        setNumber: 1,
        weight: 0,
        reps: 8,
        rpe: 7,
        isPr: false,
        note: ''
      }
    ]
  });

  const findExerciseId = (exerciseName: string) => {
    const normalized = exerciseName.trim().toLowerCase();
    return (
      exercises.find(
        (exercise) =>
          exercise.nameZh.toLowerCase() === normalized ||
          exercise.nameEn.toLowerCase() === normalized ||
          exercise.key.toLowerCase() === normalized
      )?.id ?? exercises[0]?.id ?? ''
    );
  };

  const adjustSetCount = (entryId: string, nextCount: number) => {
    const safeCount = Math.max(1, nextCount);

    updateExerciseEntry(entryId, (current) => {
      if (safeCount === current.sets.length) {
        return current;
      }

      if (safeCount < current.sets.length) {
        return {
          ...current,
          sets: current.sets.slice(0, safeCount).map((set, index) => ({
            ...set,
            setNumber: index + 1
          }))
        };
      }

      const lastSet = current.sets[current.sets.length - 1];
      const additionalSets = Array.from({ length: safeCount - current.sets.length }, (_, index) => ({
        id: makeId('set'),
        exerciseId: current.exerciseId,
        setNumber: current.sets.length + index + 1,
        weight: lastSet?.weight ?? 0,
        reps: lastSet?.reps ?? 8,
        rpe: lastSet?.rpe ?? 7,
        isPr: false,
        note: ''
      }));

      return {
        ...current,
        sets: [...current.sets, ...additionalSets]
      };
    });
  };

  const resetWorkoutForm = () => {
    setDate(today);
    setType('chest_shoulders_core');
    setFocus('strength');
    setDurationMinutes(70);
    setRpe(7);
    setEnergyLevel(4);
    setPainAreas('');
    setNote('');
    setExerciseEntries([createDefaultExerciseEntry()]);
  };

  const addExerciseEntry = () => {
    setExerciseEntries((current) => [
      ...current,
      createDefaultExerciseEntry()
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
    resetWorkoutForm();
  };

  const handleApplyTemplate = () => {
    const draft = applyTemplate(templateId);
    if (draft) {
      setDate(draft.date);
      setType(draft.type);
      setFocus(draft.focus);
      setDurationMinutes(draft.durationMinutes);
      setRpe(draft.rpe);
      setEnergyLevel(draft.energyLevel);
      setExerciseEntries(draft.exerciseEntries);
      setNote(draft.note ?? '');
      setPainAreas(draft.painAreas.join('，'));
    }
  };

  const handleWorkoutImageChange = async (file: File | null) => {
    if (!file) {
      setWorkoutImageDataUrl('');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setWorkoutImageDataUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyzeWorkout = async () => {
    if (!workoutInput.trim() && !workoutImageDataUrl) {
      setAnalysisError('请先输入一次训练描述，或者上传训练截图。');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisError('');

    try {
      const response = await fetch('/api/workout-analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: workoutInput,
          imageDataUrl: workoutImageDataUrl || undefined,
          exercises: exercises.map((exercise) => ({
            key: exercise.key,
            nameEn: exercise.nameEn,
            nameZh: exercise.nameZh
          }))
        })
      });

      if (!response.ok) {
        const errorPayload = await response.json().catch(() => null);
        throw new Error(errorPayload?.error ?? '训练解析失败，请稍后重试。');
      }

      const payload = (await response.json()) as WorkoutAnalysisResult;
      setAnalysis(payload);
      setType(payload.workoutType);
      setFocus(payload.focus);
      setDurationMinutes(payload.durationMinutes);
      setRpe(payload.rpe);
      setEnergyLevel(payload.energyLevel);
      setPainAreas(payload.painAreas.join('，'));
      setNote(payload.note || payload.assumptions.join('；'));
      setExerciseEntries(
        payload.exercises.length > 0
          ? payload.exercises.map((exercise) => {
              const exerciseId = findExerciseId(exercise.exerciseName);
              return {
                id: makeId('entry'),
                exerciseId,
                note: exercise.note ?? '',
                sets: exercise.sets.map((set, index) => ({
                  id: makeId('set'),
                  exerciseId,
                  setNumber: index + 1,
                  weight: set.weight,
                  reps: set.reps,
                  rpe: set.rpe,
                  isPr: set.isPr,
                  note: ''
                }))
              };
            })
          : [createDefaultExerciseEntry()]
      );
    } catch (error) {
      setAnalysisError(error instanceof Error ? error.message : '训练解析失败，请稍后重试。');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="grid gap-5">
      <Card title="AI 解析训练" subtitle="输入一句训练描述或上传训练笔记，让 ChatGPT 自动回填训练表单">
        <div className="grid gap-4">
          <Textarea
            label="模糊输入"
            value={workoutInput}
            onChange={(event) => setWorkoutInput(event.target.value)}
            placeholder="例如：今天胸肩重量日，卧推 35kg 8次、37.5kg 6次，史密斯肩推 25kg 10次、27.5kg 8次，训练 74 分钟，RPE 7"
          />
          <div className="rounded-3xl border border-dashed border-line bg-panel p-4">
            <label className="flex cursor-pointer flex-col gap-3 text-sm text-muted">
              <span className="flex items-center gap-2 text-ink">
                <ImagePlus size={16} />
                上传训练截图 / 笔记（可选）
              </span>
              <input
                type="file"
                accept="image/*"
                className="text-sm"
                onChange={(event) => handleWorkoutImageChange(event.target.files?.[0] ?? null)}
              />
            </label>
            {workoutImageDataUrl ? (
              <img
                src={workoutImageDataUrl}
                alt="workout preview"
                className="mt-4 h-40 w-full rounded-2xl object-cover"
              />
            ) : null}
          </div>
          <div className="flex flex-wrap gap-3">
            <Button onClick={handleAnalyzeWorkout} disabled={isAnalyzing}>
              <Sparkles size={16} />
              {isAnalyzing ? '正在解析...' : '让 ChatGPT 解析训练'}
            </Button>
            <Button variant="secondary" onClick={handleApplyTemplate}>
              填入模板
            </Button>
          </div>
          {analysisError ? <p className="text-sm text-red-600">{analysisError}</p> : null}
          {analysis ? (
            <div className="rounded-2xl border border-dashed border-accent/40 bg-[#eef6ff] p-4 text-sm text-ink">
              <p className="font-medium">
                解析结果：{analysis.exercises.length} 个动作 · {analysis.durationMinutes} 分钟 · RPE {analysis.rpe}
              </p>
              <p className="mt-2 text-muted">
                置信度：
                {analysis.confidence === 'high'
                  ? '高'
                  : analysis.confidence === 'medium'
                    ? '中'
                    : '低'}
              </p>
              {analysis.assumptions.length > 0 ? (
                <p className="mt-2 text-muted">假设：{analysis.assumptions.join('；')}</p>
              ) : null}
            </div>
          ) : null}
        </div>
      </Card>

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

        <div className="mt-4">
          <Select label="从模板快速创建" value={templateId} onChange={(event) => setTemplateId(event.target.value)}>
            {templates.map((template) => (
              <option key={template.id} value={template.id}>
                {template.name}
              </option>
            ))}
          </Select>
        </div>

        <div className="mt-6 space-y-4">
          {exerciseEntries.map((entry, index) => (
            <div key={entry.id} className="rounded-3xl border border-line bg-panel p-4">
              <div className="grid gap-4 md:grid-cols-[1fr_auto]">
                <div className="grid gap-4 md:grid-cols-[1fr_120px]">
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
                  <Input
                    label="组数"
                    type="number"
                    min="1"
                    value={entry.sets.length}
                    onChange={(event) => adjustSetCount(entry.id, Number(event.target.value))}
                  />
                </div>
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
                      <th className="pb-2 pr-3">PR</th>
                    </tr>
                  </thead>
                  <tbody>
                    {entry.sets.map((set, setIndex) => (
                      <tr key={set.id}>
                        <td className="py-2 pr-3 text-slate-900">{setIndex + 1}</td>
                        <td className="py-2 pr-3">
                          <input
                            className="w-20 rounded-xl border border-line bg-surface px-3 py-2 text-slate-900"
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
                            className="w-20 rounded-xl border border-line bg-surface px-3 py-2 text-slate-900"
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
                            className="w-20 rounded-xl border border-line bg-surface px-3 py-2 text-slate-900"
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
                            className="h-4 w-4 rounded border-line bg-surface"
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
    </div>
  );
}

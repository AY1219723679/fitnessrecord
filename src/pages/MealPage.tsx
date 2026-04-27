import { useState } from 'react';
import { ImagePlus, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Textarea } from '../components/ui/Textarea';
import { formatMealType, makeId } from '../lib/utils';
import { useAppStore } from '../store/appStore';
import type { Meal, MealAnalysisResult, MealType } from '../types';

const today = new Date().toISOString().slice(0, 10);

export function MealPage() {
  const { addMeal, user } = useAppStore();
  const [date, setDate] = useState(today);
  const [mealType, setMealType] = useState<MealType>('breakfast');
  const [mealInput, setMealInput] = useState('早餐：燕麦40g、牛奶150g、鸡蛋2个、草莓');
  const [mealImageDataUrl, setMealImageDataUrl] = useState('');
  const [analysis, setAnalysis] = useState<MealAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState('');
  const [note, setNote] = useState('');

  const handleImageChange = async (file: File | null) => {
    if (!file) {
      setMealImageDataUrl('');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setMealImageDataUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyzeMeal = async () => {
    if (!mealInput.trim() && !mealImageDataUrl) {
      setAnalysisError('请先输入一句饮食描述，或者上传一张食物照片。');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisError('');

    try {
      const response = await fetch('/api/meal-analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          mealType,
          prompt: mealInput,
          imageDataUrl: mealImageDataUrl || undefined
        })
      });

      if (!response.ok) {
        const errorPayload = await response.json().catch(() => null);
        throw new Error(errorPayload?.error ?? '饮食解析失败，请稍后重试。');
      }

      const payload = (await response.json()) as MealAnalysisResult;
      setAnalysis(payload);
      setNote(payload.assumptions.join('；'));
    } catch (error) {
      setAnalysisError(error instanceof Error ? error.message : '饮食解析失败，请稍后重试。');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSaveMeal = () => {
    if (!analysis) {
      setAnalysisError('请先让 AI 帮你解析这餐，再保存饮食记录。');
      return;
    }

    const meal: Meal = {
      id: makeId('meal'),
      userId: user.id,
      date,
      mealType,
      entries: analysis.items.map((item) => ({
        id: makeId('entry'),
        foodName: item.name,
        amountText: item.amountText
      })),
      calories: analysis.totals.calories,
      protein: analysis.totals.protein,
      carbs: analysis.totals.carbs,
      fat: analysis.totals.fat,
      note
    };

    addMeal(meal);
    setNote('');
    setAnalysis(null);
    setMealImageDataUrl('');
  };

  return (
    <div className="grid gap-5">
      <Card title="记录饮食" subtitle="输入一句模糊描述或上传照片，让 AI 自动估算营养">
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="日期" type="date" value={date} onChange={(event) => setDate(event.target.value)} />
          <Select label="餐次" value={mealType} onChange={(event) => setMealType(event.target.value as MealType)}>
            <option value="breakfast">早餐</option>
            <option value="lunch">午餐</option>
            <option value="dinner">晚餐</option>
            <option value="snack">加餐</option>
            <option value="pre_workout">训练前</option>
            <option value="post_workout">训练后</option>
            <option value="before_bed">睡前</option>
          </Select>
        </div>
        <div className="mt-4">
          <Textarea
            label="模糊输入"
            value={mealInput}
            onChange={(event) => setMealInput(event.target.value)}
            placeholder="例如：午餐吃了半碗米饭、一份番茄炒蛋、一块鸡腿肉，油不算太多"
          />
        </div>
        <div className="mt-4 rounded-3xl border border-dashed border-line bg-panel p-4">
          <label className="flex cursor-pointer flex-col gap-3 text-sm text-muted">
            <span className="flex items-center gap-2 text-ink">
              <ImagePlus size={16} />
              上传食物照片（可选）
            </span>
            <input
              type="file"
              accept="image/*"
              className="text-sm"
              onChange={(event) => handleImageChange(event.target.files?.[0] ?? null)}
            />
          </label>
          {mealImageDataUrl ? (
            <img
              src={mealImageDataUrl}
              alt="食物预览"
              className="mt-4 h-40 w-full rounded-2xl object-cover"
            />
          ) : null}
        </div>
        <div className="mt-4">
          <Button onClick={handleAnalyzeMeal} disabled={isAnalyzing}>
            <Sparkles size={16} />
            {isAnalyzing ? '正在分析...' : '让 AI 分析这餐'}
          </Button>
        </div>
        {analysisError ? <p className="mt-3 text-sm text-red-600">{analysisError}</p> : null}
        <div className="mt-4">
          <Textarea
            label="备注 / 假设"
            placeholder="这里会自动带入模型的估算假设，你也可以手动补充"
            value={note}
            onChange={(event) => setNote(event.target.value)}
          />
        </div>
        <div className="mt-4">
          <Button onClick={handleSaveMeal} disabled={!analysis}>
            保存饮食记录
          </Button>
        </div>
      </Card>

      <Card title="智能解析结果" subtitle="你不需要自己手填碳水、蛋白质和脂肪">
        {analysis ? (
          <div className="space-y-4">
            <div className="rounded-2xl border border-dashed border-accent/40 bg-[#eef6ff] p-4 font-mono text-sm text-slate-900">
              {formatMealType(mealType)}｜{analysis.summary}｜约 {analysis.totals.calories} kcal｜蛋白质 {analysis.totals.protein}g / 碳水 {analysis.totals.carbs}g / 脂肪 {analysis.totals.fat}g
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-line bg-panel px-4 py-3 text-sm">
              <span className="text-muted">估算置信度</span>
              <span className="font-medium text-ink">
                {analysis.confidence === 'high'
                  ? '高'
                  : analysis.confidence === 'medium'
                    ? '中'
                    : '低'}
              </span>
            </div>
            <div className="space-y-3">
              {analysis.items.map((item, index) => (
                <div key={`${item.name}-${index}`} className="rounded-2xl border border-line bg-panel p-4">
                  <p className="font-medium text-ink">{item.name}</p>
                  <p className="mt-1 text-sm text-muted">{item.amountText}</p>
                  <p className="mt-2 text-sm text-ink">
                    {item.calories} kcal｜蛋白质 {item.protein}g / 碳水 {item.carbs}g / 脂肪 {item.fat}g
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted">输入一句饮食描述或上传照片后，点“让 AI 分析这餐”。</p>
        )}
      </Card>
    </div>
  );
}

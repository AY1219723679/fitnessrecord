import { useMemo, useState } from 'react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Textarea } from '../components/ui/Textarea';
import { formatMealType, makeId } from '../lib/utils';
import { useAppStore } from '../store/appStore';
import type { Meal, MealType } from '../types';

const today = new Date().toISOString().slice(0, 10);

export function MealPage() {
  const { meals, addMeal, user } = useAppStore();
  const [date, setDate] = useState(today);
  const [mealType, setMealType] = useState<MealType>('breakfast');
  const [summary, setSummary] = useState('燕麦40g、牛奶150g、鸡蛋2个、草莓');
  const [calories, setCalories] = useState(450);
  const [protein, setProtein] = useState(28);
  const [carbs, setCarbs] = useState(45);
  const [fat, setFat] = useState(16);
  const [note, setNote] = useState('');

  const todayMeals = useMemo(() => meals.filter((meal) => meal.date === date), [date, meals]);
  const totals = todayMeals.reduce(
    (acc, meal) => ({
      calories: acc.calories + meal.calories,
      protein: acc.protein + meal.protein,
      carbs: acc.carbs + meal.carbs,
      fat: acc.fat + meal.fat
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const handleSaveMeal = () => {
    const meal: Meal = {
      id: makeId('meal'),
      userId: user.id,
      date,
      mealType,
      entries: summary.split(/[，,]/).map((item) => ({
        id: makeId('entry'),
        foodName: item.trim(),
        amountText: item.trim()
      })),
      calories,
      protein,
      carbs,
      fat,
      note
    };

    addMeal(meal);
    setNote('');
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
      <Card title="记录饮食" subtitle="支持一餐一行的 Markdown 风格总结">
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
            label="食物摘要"
            value={summary}
            onChange={(event) => setSummary(event.target.value)}
            placeholder="燕麦40g、牛奶150g、鸡蛋2个、草莓"
          />
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Input label="热量 (kcal)" type="number" value={calories} onChange={(event) => setCalories(Number(event.target.value))} />
          <Input label="蛋白质 (g)" type="number" value={protein} onChange={(event) => setProtein(Number(event.target.value))} />
          <Input label="碳水 (g)" type="number" value={carbs} onChange={(event) => setCarbs(Number(event.target.value))} />
          <Input label="脂肪 (g)" type="number" value={fat} onChange={(event) => setFat(Number(event.target.value))} />
        </div>
        <div className="mt-4">
          <Textarea label="备注" placeholder="生重、烹饪方式、训练日碳水策略" value={note} onChange={(event) => setNote(event.target.value)} />
        </div>
        <div className="mt-4 rounded-2xl border border-dashed border-accent/40 bg-accent/5 p-4 font-mono text-sm text-white">
          {formatMealType(mealType)}｜{summary}｜约 {calories} kcal｜P {protein}g / C {carbs}g / F {fat}g
        </div>
        <div className="mt-4">
          <Button onClick={handleSaveMeal}>保存饮食记录</Button>
        </div>
      </Card>

      <div className="grid gap-5">
        <Card title="每日营养总览" subtitle={`${date} 的 TDN / TDZ 汇总`}>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-2xl border border-line bg-surface p-4">
              <p className="text-sm text-muted">总热量</p>
              <p className="mt-2 text-2xl font-semibold text-white">{totals.calories} kcal</p>
            </div>
            <div className="rounded-2xl border border-line bg-surface p-4">
              <p className="text-sm text-muted">TDZ</p>
              <p className="mt-2 text-lg font-semibold text-white">
                {totals.carbs} / {totals.protein} / {totals.fat}
              </p>
              <p className="mt-1 text-xs text-muted">carb / protein / fat</p>
            </div>
            <div className="rounded-2xl border border-line bg-surface p-4">
              <p className="text-sm text-muted">蛋白质是否达标</p>
              <p className="mt-2 text-white">{totals.protein >= 110 ? '已达标' : '仍需补充'}</p>
            </div>
            <div className="rounded-2xl border border-line bg-surface p-4">
              <p className="text-sm text-muted">碳水是否匹配训练量</p>
              <p className="mt-2 text-white">{totals.carbs >= 150 ? '适合训练日' : '更像休息日碳水'}</p>
            </div>
          </div>
        </Card>

        <Card title="当日餐次记录" subtitle="按一餐一行快速回顾">
          <div className="space-y-3">
            {todayMeals.map((meal) => (
              <div key={meal.id} className="rounded-2xl border border-line bg-surface p-4">
                <p className="font-mono text-sm text-accent">
                  {formatMealType(meal.mealType)}｜
                  {meal.entries.map((entry) => entry.foodName).join('、')}｜约 {meal.calories} kcal｜P {meal.protein}g / C {meal.carbs}g / F {meal.fat}g
                </p>
                {meal.note ? <p className="mt-2 text-sm text-muted">{meal.note}</p> : null}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

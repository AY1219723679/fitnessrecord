import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { hasSupabaseEnv } from '../lib/supabase';
import { useAppStore } from '../store/appStore';

export function SettingsPage() {
  const { user, updateWeightUnit } = useAppStore();

  return (
    <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
      <Card title="个人设置" subtitle="当前以本地 mock 数据为主，结构已预留给 Supabase">
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="邮箱" value={user.email} disabled />
          <Input label="显示名称" value={user.displayName} disabled />
          <Select label="重量单位" value={user.weightUnit} onChange={(event) => updateWeightUnit(event.target.value as 'kg' | 'lb')}>
            <option value="kg">kg</option>
            <option value="lb">lb</option>
          </Select>
          <Input label="食物重量单位" value="g" disabled />
        </div>
      </Card>

      <Card title="数据层状态" subtitle="方便后续从 local mock data 切换到 Supabase">
        <div className="space-y-4 text-sm text-muted">
          <div className="rounded-2xl border border-line bg-surface p-4">
            <p className="text-white">Supabase Client</p>
            <p className="mt-2">
              {hasSupabaseEnv
                ? '已检测到环境变量，可以继续接真实数据库。'
                : '暂未检测到 `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`，当前运行在本地持久化模式。'}
            </p>
          </div>
          <div className="rounded-2xl border border-line bg-surface p-4">
            <p className="text-white">Auth 规划</p>
            <p className="mt-2">MVP 已预留 email login 方向，当前用 demo user 模拟单用户场景。</p>
          </div>
          <Button variant="secondary">后续可扩展到 PWA</Button>
        </div>
      </Card>
    </div>
  );
}

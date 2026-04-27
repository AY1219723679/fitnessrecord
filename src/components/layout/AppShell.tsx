import { ChevronLeft } from 'lucide-react';
import type { PropsWithChildren } from 'react';
import { Link, useLocation } from 'react-router-dom';

const routeMeta: Record<string, { title: string; description: string }> = {
  '/': {
    title: 'Fitness Record',
    description: '用最少的步骤，快速记录训练、饮食和当天感受。'
  },
  '/workouts': {
    title: '记录训练',
    description: '记录动作、组数、重量、次数和训练备注。'
  },
  '/meals': {
    title: '记录饮食',
    description: '快速录入每餐和每日营养汇总。'
  },
  '/check-in': {
    title: '记录感受',
    description: '记录睡眠、心情、疲劳、疼痛和恢复状态。'
  },
  '/records': {
    title: '查看记录',
    description: '集中查看训练、饮食和感受记录，不和录入页混在一起。'
  },
  '/progress': {
    title: 'Progress',
    description: '查看体重、训练和恢复趋势。'
  },
  '/templates': {
    title: 'Templates',
    description: '管理你的训练模板。'
  },
  '/settings': {
    title: 'Settings',
    description: '管理单位、后端配置和偏好。'
  }
};

export function AppShell({ children }: PropsWithChildren) {
  const location = useLocation();
  const meta = routeMeta[location.pathname] ?? routeMeta['/'];
  const isHome = location.pathname === '/';

  return (
    <div className="mx-auto flex min-h-screen max-w-4xl flex-col px-4 pb-10 pt-6 md:px-6">
      <header className="mb-8 flex items-start justify-between gap-4 rounded-[28px] border border-line bg-white/85 p-5 shadow-panel backdrop-blur">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-accent">Daily Log</p>
          <h1 className="mt-2 text-3xl font-semibold text-ink md:text-4xl">{meta.title}</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted">{meta.description}</p>
        </div>
        {!isHome ? (
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-2xl border border-line bg-surface px-4 py-3 text-sm text-ink transition hover:bg-panel"
          >
            <ChevronLeft size={16} />
            返回首页
          </Link>
        ) : null}
      </header>

      <main className="flex-1">{children}</main>
    </div>
  );
}

import { ArrowRight, ClipboardCheck, Dumbbell, FolderKanban, UtensilsCrossed } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '../components/ui/Card';

export function DashboardPage() {
  const actions = [
    {
      to: '/workouts',
      title: '记录训练',
      description: '记录力量训练、舞蹈或有氧。',
      icon: Dumbbell
    },
    {
      to: '/meals',
      title: '记录饮食',
      description: '快速录入每餐和三大营养素。',
      icon: UtensilsCrossed
    },
    {
      to: '/check-in',
      title: '记录感受',
      description: '记录睡眠、心情、疲劳和恢复。',
      icon: ClipboardCheck
    },
    {
      to: '/records',
      title: '查看记录',
      description: '集中查看训练、饮食和感受记录。',
      icon: FolderKanban
    }
  ];

  return (
    <div className="grid gap-5">
      <Card
        title="今天想记录什么？"
        subtitle="首页只保留最常用的 3 个入口，减少干扰，先把当天内容记下来。"
      >
        <div className="grid gap-4">
          {actions.map(({ to, title, description, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className="group flex items-center justify-between rounded-[28px] border border-line bg-panel px-5 py-5 transition hover:border-[#a9c7eb] hover:bg-[#e4f0ff]"
            >
              <div className="flex items-center gap-4">
                <div className="rounded-2xl bg-white p-3 text-accent shadow-sm">
                  <Icon size={22} />
                </div>
                <div>
                  <p className="text-lg font-semibold text-ink">{title}</p>
                  <p className="mt-1 text-sm text-muted">{description}</p>
                </div>
              </div>
              <ArrowRight className="text-muted transition group-hover:translate-x-1 group-hover:text-ink" size={20} />
            </Link>
          ))}
        </div>
      </Card>

      <p className="px-1 text-sm text-muted">
        后续的数据分析、模板和趋势页我先保留在应用里，但首页不再堆信息，优先保证每天打开就能快速记录。
      </p>
    </div>
  );
}

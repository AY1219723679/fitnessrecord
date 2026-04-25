# Fitness Tracker MVP

一个偏 `performance tracker / athlete logbook` 风格的个人健身、饮食、恢复记录 Web App MVP。当前版本优先保证：

- React + TypeScript + Tailwind 的可运行前端结构
- Zustand 本地持久化 CRUD
- Dashboard / Workout / Meal / Daily Check-in / Progress / Templates / Settings 页面
- 后续方便切换到 Supabase

## 技术栈

- Frontend: React + TypeScript + Vite
- Styling: Tailwind CSS
- State: Zustand + localStorage persist
- Charts: Recharts
- Backend scaffold: Supabase client
- Database schema: PostgreSQL / Supabase SQL

## 项目结构

```text
fitness-tracker-mvp
├── .env.example
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
├── tsconfig.app.json
├── vite.config.ts
├── supabase/
│   └── schema.sql
└── src/
    ├── App.tsx
    ├── main.tsx
    ├── components/
    │   ├── charts/
    │   │   └── ProgressCharts.tsx
    │   ├── layout/
    │   │   └── AppShell.tsx
    │   └── ui/
    │       ├── Button.tsx
    │       ├── Card.tsx
    │       ├── Input.tsx
    │       ├── Select.tsx
    │       ├── StatCard.tsx
    │       └── Textarea.tsx
    ├── data/
    │   └── mockData.ts
    ├── lib/
    │   ├── supabase.ts
    │   └── utils.ts
    ├── pages/
    │   ├── CheckInPage.tsx
    │   ├── DashboardPage.tsx
    │   ├── MealPage.tsx
    │   ├── ProgressPage.tsx
    │   ├── SettingsPage.tsx
    │   ├── TemplatesPage.tsx
    │   └── WorkoutPage.tsx
    ├── store/
    │   └── appStore.ts
    ├── styles/
    │   └── index.css
    └── types/
        └── index.ts
```

## 本地运行

你当前这台机器的终端里还没有 `node` / `npm`，所以我没法在这里直接安装依赖并实际启动。但项目源码已经按标准 Vite 结构写好，装好 Node 18+ 之后即可运行。

### 1. 安装 Node.js

推荐安装 Node.js 18 或 20。

### 2. 安装依赖

```bash
cd "/Users/winkietian/Documents/New project/fitness-tracker-mvp"
npm install
```

### 3. 启动开发环境

```bash
npm run dev
```

默认会在 `http://localhost:5173` 启动。

### 4. 构建生产版本

```bash
npm run build
npm run preview
```

## Supabase 接入

### 1. 配置环境变量

复制 `.env.example` 为 `.env`：

```bash
cp .env.example .env
```

然后填入：

```env
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

### 2. 执行 schema

把 [supabase/schema.sql](/Users/winkietian/Documents/New%20project/fitness-tracker-mvp/supabase/schema.sql) 粘贴到 Supabase SQL Editor 中执行。

### 3. 当前数据层说明

- 现在使用 Zustand + localStorage 做本地 CRUD
- `src/lib/supabase.ts` 已经就位
- 后续可以把 `useAppStore` 的读写逐步替换成 Supabase 查询和 mutation

## 已实现的 MVP 功能

- Dashboard 首页
  - 今日训练状态、饮食总览、睡眠、心情、疲劳、疼痛、体重、备注
  - 简化版 Daily Readiness Score
- 训练记录
  - 新建训练
  - 重量日 / 容量日标记
  - 模板快速创建
  - 动作、组数、重量、次数、RPE、tempo、PR 记录
  - 舞蹈训练字段预留
  - 历史训练和动作历史对比
- 饮食记录
  - 每餐录入
  - Markdown 风格一行总结
  - 每日热量和三大营养素统计
- Daily Check-in
  - 睡眠、心情、压力、疲劳、疼痛、饥饿、经期、备注
- Progress
  - 体重、训练总量、睡眠 vs RPE、碳水 vs 训练表现图表
  - 身体数据记录
  - Insight cards
- Templates
  - 内置训练模板
- Settings
  - 重量单位切换
  - Supabase 状态提示

## 数据库设计说明

SQL 中至少包含以下表：

- `users`
- `daily_logs`
- `workouts`
- `exercises`
- `workout_sets`
- `meals`
- `food_items`
- `body_metrics`
- `mood_logs`
- `sleep_logs`
- `pain_logs`
- `workout_templates`
- `template_exercises`

另外为了更合理地支持多动作、多组训练和餐次明细，也增加了：

- `workout_exercises`
- `meal_items`

## 后续建议

下一步最值得做的几件事：

1. 接入 Supabase Auth 邮箱登录
2. 把 Zustand CRUD 替换为真实数据库读写
3. 增加编辑 / 删除功能和详情抽屉
4. 做成 PWA
5. 增加更智能的 insight engine

## 说明

- 当前 UI 偏黑白灰、卡片化、移动端友好
- 默认食物重量单位为 `g`
- 默认训练重量单位支持 `kg / lb`
- mock 数据已经内置，首次打开就能看到完整页面内容

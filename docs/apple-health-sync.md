# Apple Health / Apple Watch Sync Plan

## Recommended Architecture

保留现有 Web App 作为主界面，同时新增一个 iPhone companion app：

- Apple Watch 采集 workout / heart rate / activity / sleep
- 数据同步到 iPhone HealthKit
- iPhone companion app 读取 HealthKit
- app 将增量数据写入 Supabase
- React Web App 从 Supabase 读取并展示

## Why this architecture

- Web 不能直接读 HealthKit
- Apple Watch 数据在 iPhone Health app / HealthKit 里最完整
- 权限管理、隐私提示、后台同步都更符合 Apple 平台规则

## First Sync Scope

### Daily metrics

- `step_count`
- `active_energy_burned`
- `apple_exercise_time`
- `resting_heart_rate`
- `heart_rate`
- `hrv_sdnn`

### Recovery / sleep

- `sleep_analysis`

### Workouts

- `traditional_strength_training`
- `functional_strength_training`
- `dance`
- `running`
- `walking`
- `cycling`
- 以及其他 `HKWorkoutActivityType`

## Mapping to the current product

### Dashboard

- 今日步数
- 今日 active energy
- 昨夜睡眠时长
- resting HR / HRV
- readiness score 调权

### Workout analysis

- 自动发现 Apple Watch workout
- 与手动训练日志做“候选匹配”
- 舞蹈 / 有氧可优先从 HealthKit 导入

### Recovery analysis

- 用 sleep + resting HR + HRV 提升 readiness 可信度
- 用 activity load 作为疲劳参考

## Sync rules

- 增量同步优先，默认最近 14 天
- 每条记录保存 `external_id`
- 使用 `user_id + external_id` 做 upsert 去重
- 保留 `source_name` 和 `source_bundle_identifier`

## Security

- 生产环境建议用 Supabase Auth 会话
- iOS app 登录后获得 JWT，再调用 Supabase REST / Edge Function
- 不要把 service role key 放到客户端

## Suggested next implementation steps

1. 在 Supabase 执行 schema 扩展
2. 在 Web 端新增 `apple health imported` 数据层
3. 在 Progress 页面加入 HRV / resting HR / steps 图表
4. 在 Dashboard readiness 中加入 sleep / HRV / resting HR 权重
5. 增加“手动训练 vs Apple Workout”匹配 UI

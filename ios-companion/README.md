# iPhone Companion App Scaffold

这个目录是给 `Web 前端 + iPhone HealthKit 同步器` 架构准备的 companion app 骨架。

目标：

- 在 iPhone 上请求 HealthKit 权限
- 读取 Apple Watch / Apple Health 的关键数据
- 转成适合 Supabase 的 payload
- 同步到你现有的 fitness tracker 后端

## 为什么需要原生 iPhone App

Web App 不能直接读取 Apple Health / Apple Watch 数据。HealthKit 只能在原生 Apple 平台应用里用，所以这里采用：

1. Apple Watch 记录数据
2. 数据进入 iPhone HealthKit
3. iPhone companion app 读取数据
4. 同步到 Supabase
5. 现有 React Web App 继续做展示和分析

## 当前包含

- SwiftUI app 入口骨架
- HealthKit 权限请求与查询服务
- 睡眠 / 心率 / HRV / 步数 / 活动能量 / workout 映射模型
- Supabase REST 同步客户端
- 同步主页 ViewModel / View
- Info.plist / entitlements 示例
- Supabase schema 扩展建议

## 建议首批同步的数据

- `sleepAnalysis`
- `restingHeartRate`
- `heartRateVariabilitySDNN`
- `heartRate`
- `stepCount`
- `activeEnergyBurned`
- `appleExerciseTime`
- `HKWorkout`

## 在 Xcode 中继续

1. 新建 iOS App，名称建议 `FitnessRecordCompanion`
2. 最低 iOS 建议 `17.0`
3. 勾选 `SwiftUI`
4. 开启 `HealthKit` capability
5. 将 `FitnessRecordCompanion` 目录下的 Swift 文件拖入 target
6. 按 `Config/Info.plist.additions.txt` 补 Info.plist
7. 把 `Config/FitnessRecord.entitlements.example` 的内容迁到 entitlements
8. 配置 `SUPABASE_URL`、`SUPABASE_ANON_KEY`、当前登录用户的 access token 获取方式

## 同步策略建议

- App 启动时做一次增量同步
- 用户点击按钮时手动同步
- 后续可加 BackgroundTasks 做低频后台同步
- 用 `anchor` 或 `lastSyncedAt` 做增量拉取

## 注意

- HealthKit 权限必须由用户明确授权
- 对睡眠、心率、HRV 这类数据要非常克制，只同步业务真正需要的字段
- 生产环境建议用 Supabase Auth 会话，而不是手填 token

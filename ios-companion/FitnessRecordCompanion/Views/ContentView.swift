import SwiftUI

struct ContentView: View {
    @ObservedObject var viewModel: SyncDashboardViewModel

    var body: some View {
        NavigationStack {
            Form {
                Section("Supabase") {
                    TextField("Supabase URL", text: $viewModel.supabaseURLString)
                        .textInputAutocapitalization(.never)
                        .keyboardType(.URL)
                    TextField("Supabase anon key", text: $viewModel.supabaseAnonKey)
                        .textInputAutocapitalization(.never)
                    TextField("Supabase user id", text: $viewModel.currentUserId)
                        .textInputAutocapitalization(.never)
                    SecureField("Supabase user JWT", text: $viewModel.userJWT)
                        .textInputAutocapitalization(.never)
                }

                Section("Sync Options") {
                    Picker("Lookback Days", selection: $viewModel.selectedLookbackDays) {
                        Text("7").tag(7)
                        Text("14").tag(14)
                        Text("30").tag(30)
                        Text("90").tag(90)
                    }
                }

                Section("Actions") {
                    Button("请求 HealthKit 授权") {
                        Task { await viewModel.authorize() }
                    }

                    Button("立即同步到 Supabase") {
                        Task { await viewModel.syncNow() }
                    }
                }

                Section("Status") {
                    Text(statusText)
                        .foregroundStyle(statusColor)

                    if let lastSyncDate = viewModel.lastSyncDate {
                        Text("Last Sync: \(lastSyncDate.formatted(date: .abbreviated, time: .shortened))")
                            .font(.footnote)
                            .foregroundStyle(.secondary)
                    }
                }

                Section("Notes") {
                    Text("建议生产环境使用 Supabase Auth 会话，自动获得用户 JWT，而不是手动粘贴。")
                    Text("首版优先同步睡眠、心率、HRV、步数、活动能量和 workouts。")
                }
            }
            .navigationTitle("Health Sync")
        }
    }

    private var statusText: String {
        switch viewModel.syncState {
        case .idle:
            return "尚未同步"
        case .authorizing:
            return "正在请求 HealthKit 授权..."
        case .syncing:
            return "同步中..."
        case .success(let message):
            return message
        case .failure(let message):
            return "失败: \(message)"
        }
    }

    private var statusColor: Color {
        switch viewModel.syncState {
        case .success:
            return .green
        case .failure:
            return .red
        case .authorizing, .syncing:
            return .orange
        case .idle:
            return .secondary
        }
    }
}

#Preview {
    ContentView(
        viewModel: SyncDashboardViewModel(
            healthKitService: HealthKitService(),
            syncClient: SupabaseSyncClient()
        )
    )
}

import Foundation

@MainActor
final class SyncDashboardViewModel: ObservableObject {
    @Published var syncState: SyncState = .idle
    @Published var lastSyncDate: Date?
    @Published var selectedLookbackDays: Int = 14
    @Published var currentUserId: String = ""
    @Published var userJWT: String = ""
    @Published var supabaseURLString: String = ""
    @Published var supabaseAnonKey: String = ""

    private let healthKitService: HealthKitService
    private let syncClient: SupabaseSyncClient

    init(
        healthKitService: HealthKitService,
        syncClient: SupabaseSyncClient
    ) {
        self.healthKitService = healthKitService
        self.syncClient = syncClient
    }

    func authorize() async {
        syncState = .authorizing

        do {
            try await healthKitService.requestAuthorization()
            syncState = .success("HealthKit 授权成功")
        } catch {
            syncState = .failure(error.localizedDescription)
        }
    }

    func syncNow() async {
        guard
            let supabaseURL = URL(string: supabaseURLString),
            !currentUserId.isEmpty,
            !supabaseAnonKey.isEmpty,
            !userJWT.isEmpty
        else {
            syncState = .failure("请先填写 Supabase URL、anon key、user id 和 user JWT。")
            return
        }

        syncState = .syncing

        do {
            let endDate = Date()
            let startDate = Calendar.current.date(byAdding: .day, value: -selectedLookbackDays, to: endDate) ?? endDate
            let envelope = try await healthKitService.fetchSyncEnvelope(
                userId: currentUserId,
                from: startDate,
                to: endDate
            )

            let summary = try await syncClient.syncHealthData(
                envelope: envelope,
                configuration: SyncConfiguration(
                    supabaseURL: supabaseURL,
                    anonKey: supabaseAnonKey,
                    userJWT: userJWT
                )
            )

            lastSyncDate = Date()
            syncState = .success(
                "已同步 \(summary.dailyMetricsCount) 条 metric、\(summary.workoutsCount) 条 workout、\(summary.sleepSamplesCount) 条 sleep sample"
            )
        } catch {
            syncState = .failure(error.localizedDescription)
        }
    }
}

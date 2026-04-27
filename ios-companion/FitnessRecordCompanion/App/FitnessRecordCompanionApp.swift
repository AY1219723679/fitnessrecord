import SwiftUI

@main
struct FitnessRecordCompanionApp: App {
    @StateObject private var viewModel = SyncDashboardViewModel(
        healthKitService: HealthKitService(),
        syncClient: SupabaseSyncClient()
    )

    var body: some Scene {
        WindowGroup {
            ContentView(viewModel: viewModel)
        }
    }
}

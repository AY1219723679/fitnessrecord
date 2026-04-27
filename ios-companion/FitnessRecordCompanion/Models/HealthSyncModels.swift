import Foundation
import HealthKit

enum HealthSyncMetric: String, CaseIterable, Identifiable {
    case stepCount = "step_count"
    case activeEnergyBurned = "active_energy_burned"
    case appleExerciseTime = "apple_exercise_time"
    case restingHeartRate = "resting_heart_rate"
    case heartRate = "heart_rate"
    case heartRateVariabilitySDNN = "hrv_sdnn"
    case sleepAnalysis = "sleep_analysis"

    var id: String { rawValue }
}

struct DailyMetricPayload: Codable, Identifiable {
    let id: UUID
    let metricType: String
    let value: Double
    let unit: String
    let startDate: Date
    let endDate: Date
    let sourceName: String?
    let sourceBundleIdentifier: String?
}

struct WorkoutPayload: Codable, Identifiable {
    let id: UUID
    let workoutType: String
    let durationSeconds: Double
    let totalEnergyBurned: Double?
    let totalDistance: Double?
    let startDate: Date
    let endDate: Date
    let sourceName: String?
    let sourceBundleIdentifier: String?
}

struct SleepPayload: Codable, Identifiable {
    let id: UUID
    let categoryValue: Int
    let startDate: Date
    let endDate: Date
    let sourceName: String?
    let sourceBundleIdentifier: String?
}

struct SyncEnvelope: Codable {
    let userId: String
    let syncedAt: Date
    let dailyMetrics: [DailyMetricPayload]
    let workouts: [WorkoutPayload]
    let sleepSamples: [SleepPayload]
}

struct SyncSummary {
    let dailyMetricsCount: Int
    let workoutsCount: Int
    let sleepSamplesCount: Int
}

enum SyncState: Equatable {
    case idle
    case authorizing
    case syncing
    case success(String)
    case failure(String)
}

extension HKWorkoutActivityType {
    var syncName: String {
        switch self {
        case .traditionalStrengthTraining:
            return "traditional_strength_training"
        case .functionalStrengthTraining:
            return "functional_strength_training"
        case .dance:
            return "dance"
        case .running:
            return "running"
        case .walking:
            return "walking"
        case .cycling:
            return "cycling"
        case .mixedCardio:
            return "mixed_cardio"
        default:
            return String(describing: self)
        }
    }
}

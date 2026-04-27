import Foundation

struct SyncConfiguration {
    let supabaseURL: URL
    let anonKey: String
    let userJWT: String
}

final class SupabaseSyncClient {
    private let session: URLSession

    init(session: URLSession = .shared) {
        self.session = session
    }

    func syncHealthData(
        envelope: SyncEnvelope,
        configuration: SyncConfiguration
    ) async throws -> SyncSummary {
        async let metricsCount = upsertDailyMetrics(
            envelope.dailyMetrics,
            configuration: configuration,
            userId: envelope.userId
        )
        async let workoutsCount = upsertWorkouts(
            envelope.workouts,
            configuration: configuration,
            userId: envelope.userId
        )
        async let sleepCount = upsertSleepSamples(
            envelope.sleepSamples,
            configuration: configuration,
            userId: envelope.userId
        )

        return try await SyncSummary(
            dailyMetricsCount: metricsCount,
            workoutsCount: workoutsCount,
            sleepSamplesCount: sleepCount
        )
    }

    private func upsertDailyMetrics(
        _ metrics: [DailyMetricPayload],
        configuration: SyncConfiguration,
        userId: String
    ) async throws -> Int {
        let records = metrics.map {
            SyncedDailyMetricRecord(
                userId: userId,
                externalId: $0.id.uuidString,
                metricType: $0.metricType,
                value: $0.value,
                unit: $0.unit,
                startDate: isoString($0.startDate),
                endDate: isoString($0.endDate),
                sourceName: $0.sourceName,
                sourceBundleIdentifier: $0.sourceBundleIdentifier
            )
        }

        try await post(records, to: "apple_health_daily_metrics", configuration: configuration)
        return records.count
    }

    private func upsertWorkouts(
        _ workouts: [WorkoutPayload],
        configuration: SyncConfiguration,
        userId: String
    ) async throws -> Int {
        let records = workouts.map {
            SyncedWorkoutRecord(
                userId: userId,
                externalId: $0.id.uuidString,
                workoutType: $0.workoutType,
                durationSeconds: $0.durationSeconds,
                totalEnergyBurned: $0.totalEnergyBurned,
                totalDistance: $0.totalDistance,
                startDate: isoString($0.startDate),
                endDate: isoString($0.endDate),
                sourceName: $0.sourceName,
                sourceBundleIdentifier: $0.sourceBundleIdentifier
            )
        }

        try await post(records, to: "apple_health_workouts", configuration: configuration)
        return records.count
    }

    private func upsertSleepSamples(
        _ sleepSamples: [SleepPayload],
        configuration: SyncConfiguration,
        userId: String
    ) async throws -> Int {
        let records = sleepSamples.map {
            SyncedSleepRecord(
                userId: userId,
                externalId: $0.id.uuidString,
                categoryValue: $0.categoryValue,
                startDate: isoString($0.startDate),
                endDate: isoString($0.endDate),
                sourceName: $0.sourceName,
                sourceBundleIdentifier: $0.sourceBundleIdentifier
            )
        }

        try await post(records, to: "apple_health_sleep_samples", configuration: configuration)
        return records.count
    }

    private func post<T: Encodable>(
        _ payload: T,
        to table: String,
        onConflict: String = "user_id,external_id",
        configuration: SyncConfiguration
    ) async throws {
        var components = URLComponents(
            url: configuration.supabaseURL
            .appendingPathComponent("rest/v1")
            .appendingPathComponent(table),
            resolvingAgainstBaseURL: false
        )
        components?.queryItems = [
            URLQueryItem(name: "on_conflict", value: onConflict)
        ]

        guard let endpoint = components?.url else {
            throw NSError(domain: "SupabaseSyncClient", code: 2, userInfo: [
                NSLocalizedDescriptionKey: "Unable to construct Supabase endpoint."
            ])
        }

        var request = URLRequest(url: endpoint)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue("return=minimal,resolution=merge-duplicates", forHTTPHeaderField: "Prefer")
        request.setValue(configuration.anonKey, forHTTPHeaderField: "apikey")
        request.setValue("Bearer \(configuration.userJWT)", forHTTPHeaderField: "Authorization")
        request.httpBody = try JSONEncoder.supabaseEncoder.encode(payload)

        let (_, response) = try await session.data(for: request)
        guard let httpResponse = response as? HTTPURLResponse, (200...299).contains(httpResponse.statusCode) else {
            throw NSError(domain: "SupabaseSyncClient", code: 1, userInfo: [
                NSLocalizedDescriptionKey: "Supabase sync failed for table \(table)."
            ])
        }
    }

    private func isoString(_ date: Date) -> String {
        ISO8601DateFormatter().string(from: date)
    }
}

private struct SyncedDailyMetricRecord: Encodable {
    let userId: String
    let externalId: String
    let metricType: String
    let value: Double
    let unit: String
    let startDate: String
    let endDate: String
    let sourceName: String?
    let sourceBundleIdentifier: String?

    enum CodingKeys: String, CodingKey {
        case userId = "user_id"
        case externalId = "external_id"
        case metricType = "metric_type"
        case value
        case unit
        case startDate = "start_date"
        case endDate = "end_date"
        case sourceName = "source_name"
        case sourceBundleIdentifier = "source_bundle_identifier"
    }
}

private struct SyncedWorkoutRecord: Encodable {
    let userId: String
    let externalId: String
    let workoutType: String
    let durationSeconds: Double
    let totalEnergyBurned: Double?
    let totalDistance: Double?
    let startDate: String
    let endDate: String
    let sourceName: String?
    let sourceBundleIdentifier: String?

    enum CodingKeys: String, CodingKey {
        case userId = "user_id"
        case externalId = "external_id"
        case workoutType = "workout_type"
        case durationSeconds = "duration_seconds"
        case totalEnergyBurned = "total_energy_burned"
        case totalDistance = "total_distance"
        case startDate = "start_date"
        case endDate = "end_date"
        case sourceName = "source_name"
        case sourceBundleIdentifier = "source_bundle_identifier"
    }
}

private struct SyncedSleepRecord: Encodable {
    let userId: String
    let externalId: String
    let categoryValue: Int
    let startDate: String
    let endDate: String
    let sourceName: String?
    let sourceBundleIdentifier: String?

    enum CodingKeys: String, CodingKey {
        case userId = "user_id"
        case externalId = "external_id"
        case categoryValue = "category_value"
        case startDate = "start_date"
        case endDate = "end_date"
        case sourceName = "source_name"
        case sourceBundleIdentifier = "source_bundle_identifier"
    }
}

private extension JSONEncoder {
    static var supabaseEncoder: JSONEncoder {
        let encoder = JSONEncoder()
        encoder.dateEncodingStrategy = .iso8601
        encoder.keyEncodingStrategy = .useDefaultKeys
        return encoder
    }
}

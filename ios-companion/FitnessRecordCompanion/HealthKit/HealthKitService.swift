import Foundation
import HealthKit

@MainActor
final class HealthKitService {
    private let healthStore = HKHealthStore()

    func requestAuthorization() async throws {
        guard HKHealthStore.isHealthDataAvailable() else {
            throw NSError(domain: "HealthKitService", code: 1, userInfo: [
                NSLocalizedDescriptionKey: "Health data is not available on this device."
            ])
        }

        let readTypes: Set<HKObjectType> = [
            HKObjectType.quantityType(forIdentifier: .stepCount),
            HKObjectType.quantityType(forIdentifier: .activeEnergyBurned),
            HKObjectType.quantityType(forIdentifier: .appleExerciseTime),
            HKObjectType.quantityType(forIdentifier: .restingHeartRate),
            HKObjectType.quantityType(forIdentifier: .heartRate),
            HKObjectType.quantityType(forIdentifier: .heartRateVariabilitySDNN),
            HKObjectType.categoryType(forIdentifier: .sleepAnalysis),
            HKObjectType.workoutType()
        ].compactMap { $0 }

        try await healthStore.requestAuthorization(toShare: [], read: readTypes)
    }

    func fetchSyncEnvelope(
        userId: String,
        from startDate: Date,
        to endDate: Date
    ) async throws -> SyncEnvelope {
        async let dailyMetrics = fetchDailyMetrics(from: startDate, to: endDate)
        async let workouts = fetchWorkouts(from: startDate, to: endDate)
        async let sleep = fetchSleepSamples(from: startDate, to: endDate)

        return try await SyncEnvelope(
            userId: userId,
            syncedAt: Date(),
            dailyMetrics: dailyMetrics,
            workouts: workouts,
            sleepSamples: sleep
        )
    }

    private func fetchDailyMetrics(
        from startDate: Date,
        to endDate: Date
    ) async throws -> [DailyMetricPayload] {
        var payloads: [DailyMetricPayload] = []

        payloads += try await fetchQuantitySamples(
            identifier: .stepCount,
            unit: HKUnit.count(),
            metricType: .stepCount,
            from: startDate,
            to: endDate
        )

        payloads += try await fetchQuantitySamples(
            identifier: .activeEnergyBurned,
            unit: .kilocalorie(),
            metricType: .activeEnergyBurned,
            from: startDate,
            to: endDate
        )

        payloads += try await fetchQuantitySamples(
            identifier: .appleExerciseTime,
            unit: .minute(),
            metricType: .appleExerciseTime,
            from: startDate,
            to: endDate
        )

        payloads += try await fetchQuantitySamples(
            identifier: .restingHeartRate,
            unit: HKUnit.count().unitDivided(by: .minute()),
            metricType: .restingHeartRate,
            from: startDate,
            to: endDate
        )

        payloads += try await fetchQuantitySamples(
            identifier: .heartRate,
            unit: HKUnit.count().unitDivided(by: .minute()),
            metricType: .heartRate,
            from: startDate,
            to: endDate
        )

        payloads += try await fetchQuantitySamples(
            identifier: .heartRateVariabilitySDNN,
            unit: .secondUnit(with: .milli),
            metricType: .heartRateVariabilitySDNN,
            from: startDate,
            to: endDate
        )

        return payloads.sorted { $0.startDate < $1.startDate }
    }

    private func fetchQuantitySamples(
        identifier: HKQuantityTypeIdentifier,
        unit: HKUnit,
        metricType: HealthSyncMetric,
        from startDate: Date,
        to endDate: Date
    ) async throws -> [DailyMetricPayload] {
        guard let sampleType = HKObjectType.quantityType(forIdentifier: identifier) else {
            return []
        }

        let predicate = HKQuery.predicateForSamples(withStart: startDate, end: endDate)
        let sortDescriptors = [NSSortDescriptor(key: HKSampleSortIdentifierStartDate, ascending: true)]

        return try await withCheckedThrowingContinuation { continuation in
            let query = HKSampleQuery(
                sampleType: sampleType,
                predicate: predicate,
                limit: HKObjectQueryNoLimit,
                sortDescriptors: sortDescriptors
            ) { _, samples, error in
                if let error {
                    continuation.resume(throwing: error)
                    return
                }

                let mapped = (samples as? [HKQuantitySample] ?? []).map { sample in
                    DailyMetricPayload(
                        id: UUID(),
                        metricType: metricType.rawValue,
                        value: sample.quantity.doubleValue(for: unit),
                        unit: unit.unitString,
                        startDate: sample.startDate,
                        endDate: sample.endDate,
                        sourceName: sample.sourceRevision.source.name,
                        sourceBundleIdentifier: sample.sourceRevision.source.bundleIdentifier
                    )
                }

                continuation.resume(returning: mapped)
            }

            self.healthStore.execute(query)
        }
    }

    private func fetchWorkouts(
        from startDate: Date,
        to endDate: Date
    ) async throws -> [WorkoutPayload] {
        let predicate = HKQuery.predicateForSamples(withStart: startDate, end: endDate)
        let sortDescriptors = [NSSortDescriptor(key: HKSampleSortIdentifierStartDate, ascending: true)]

        return try await withCheckedThrowingContinuation { continuation in
            let query = HKSampleQuery(
                sampleType: .workoutType(),
                predicate: predicate,
                limit: HKObjectQueryNoLimit,
                sortDescriptors: sortDescriptors
            ) { _, samples, error in
                if let error {
                    continuation.resume(throwing: error)
                    return
                }

                let workouts = (samples as? [HKWorkout] ?? []).map { workout in
                    WorkoutPayload(
                        id: UUID(),
                        workoutType: workout.workoutActivityType.syncName,
                        durationSeconds: workout.duration,
                        totalEnergyBurned: workout.totalEnergyBurned?.doubleValue(for: .kilocalorie()),
                        totalDistance: workout.totalDistance?.doubleValue(for: .meter()),
                        startDate: workout.startDate,
                        endDate: workout.endDate,
                        sourceName: workout.sourceRevision.source.name,
                        sourceBundleIdentifier: workout.sourceRevision.source.bundleIdentifier
                    )
                }

                continuation.resume(returning: workouts)
            }

            self.healthStore.execute(query)
        }
    }

    private func fetchSleepSamples(
        from startDate: Date,
        to endDate: Date
    ) async throws -> [SleepPayload] {
        guard let sampleType = HKObjectType.categoryType(forIdentifier: .sleepAnalysis) else {
            return []
        }

        let predicate = HKQuery.predicateForSamples(withStart: startDate, end: endDate)
        let sortDescriptors = [NSSortDescriptor(key: HKSampleSortIdentifierStartDate, ascending: true)]

        return try await withCheckedThrowingContinuation { continuation in
            let query = HKSampleQuery(
                sampleType: sampleType,
                predicate: predicate,
                limit: HKObjectQueryNoLimit,
                sortDescriptors: sortDescriptors
            ) { _, samples, error in
                if let error {
                    continuation.resume(throwing: error)
                    return
                }

                let sleepSamples = (samples as? [HKCategorySample] ?? []).map { sample in
                    SleepPayload(
                        id: UUID(),
                        categoryValue: sample.value,
                        startDate: sample.startDate,
                        endDate: sample.endDate,
                        sourceName: sample.sourceRevision.source.name,
                        sourceBundleIdentifier: sample.sourceRevision.source.bundleIdentifier
                    )
                }

                continuation.resume(returning: sleepSamples)
            }

            self.healthStore.execute(query)
        }
    }
}

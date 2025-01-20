import { Hitbox, RectangleHitbox } from "../utils/hitbox";
import { ObjectDefinitions, type ObjectDefinition } from "../utils/objectDefinitions";

export interface VehicleDefinition extends ObjectDefinition {
    readonly hitbox: Hitbox
    readonly rpm: {
        readonly idle: number
        readonly redline: number
        readonly peakPowerRPM: number
        readonly baseRevLimiterDrop: number
        readonly baseDecelerationRate: number
        readonly baseAccelerationRate: number
        readonly rpmRanges:
        ReadonlyArray<{
            readonly base: number
            readonly lowerBound: number
            readonly upperBound: number
            readonly minSpeed: number
            readonly maxSpeed: number
        }>
    }
    readonly needle: {
        readonly min: number
        readonly max: number
    }
    readonly volume: {
        readonly min: number
        readonly max: number
    }
    readonly misc: {
        readonly gears: number
        readonly maxPower: number
    }
}
export const Vehicles = ObjectDefinitions.create<VehicleDefinition>("Vehicles", [
    {
        idString: "renova_rs8",
        name: "Renova RS8",
        hitbox: RectangleHitbox.fromRect(10, 10),
        rpm: {
            idle: 1000,
            redline: 7000,
            peakPowerRPM: 6500,
            baseRevLimiterDrop: 5000,
            baseDecelerationRate: 1000,
            baseAccelerationRate: 1000,
            rpmRanges: [
                { base: 1000, lowerBound: 1000, upperBound: 2000, minSpeed: 1, maxSpeed: 1.1 },
                { base: 2000, lowerBound: 1000, upperBound: 3000, minSpeed: 0.9, maxSpeed: 1.25 },
                { base: 3000, lowerBound: 2000, upperBound: 4000, minSpeed: 0.825, maxSpeed: 1.35 },
                { base: 4000, lowerBound: 3000, upperBound: 5000, minSpeed: 0.825, maxSpeed: 1.2 },
                { base: 5000, lowerBound: 4000, upperBound: 6000, minSpeed: 0.85, maxSpeed: 1.175 },
                { base: 6000, lowerBound: 5000, upperBound: 7000, minSpeed: 0.825, maxSpeed: 1.3 },
                { base: 7000, lowerBound: 6000, upperBound: 7000, minSpeed: 0.765, maxSpeed: 1.075 }
            ]
        },
        needle: {
            min: -122,
            max: 90
        },
        volume: {
            min: 0.5,
            max: 2
        },
        misc: {
            gears: 5,
            maxPower: 200
        }
    }
]);

import { ObjectCategory } from "@common/constants";
import { BaseGameObject } from "./gameObject";
import { Hitbox, RectangleHitbox } from "@common/utils/hitbox";
import { VehicleDefinition, Vehicles } from "@common/definitions/vehicles";
import { ReifiableDef } from "@common/utils/objectDefinitions";
import { Game } from "../game";
import { Vector } from "@common/utils/vector";
import { FullData } from "@common/utils/objectsSerializations";

export class Vehicle extends BaseGameObject.derive(ObjectCategory.Vehicle) {
    override readonly fullAllocBytes = 16;
    override readonly partialAllocBytes = 16;

    readonly definition: VehicleDefinition;
    readonly hitbox: Hitbox;

    rpm = 1000;

    constructor(game: Game, definition: ReifiableDef<VehicleDefinition>, position: Vector, layer: number) {
        super(game, position);

        this.definition = Vehicles.reify(definition);
        this.hitbox = RectangleHitbox.fromRect(10, 10, this.position);

        this.layer = layer;
    }

    update(): void {
        const {
            idle,
            redline,
            baseDecelerationRate,
            baseAccelerationRate,
            baseRevLimiterDrop,
            rpmRanges
        } = this.definition.rpm;

        this.rpm = Math.min(this.rpm + 20, redline);

        if (this.rpm === redline) {
            this.rpm -= (baseRevLimiterDrop * ((Math.random() * (1.1 - 0.9)) + 0.9));
        }
        /*
        else if (throttlePressed) {
            this.rpm = Math.min(this.rpm + baseAccelerationRate, redline);
        }

        } else {
            const decelerationMultiplier = ((this.rpm - idle) / (redline - idle));
            this.rpm = Math.max(this.rpm - (baseDecelerationRate * decelerationMultiplier), idle);
        }
        */
    }

    damage(): void {
    }

    override get data(): FullData<ObjectCategory.Vehicle> {
        return {
            position: this.position,
            rotation: this.rotation,
            rpm: this.rpm,
            full: {
                definition: this.definition,
                layer: this.layer
            }
        };
    }
}

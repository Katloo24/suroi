import { ObjectCategory } from "@common/constants";
import { GameObject } from "./gameObject";
import type { ObjectsNetData } from "@common/utils/objectsSerializations";
import { Game } from "../game";
import type { VehicleDefinition } from "@common/definitions/vehicles";

export class Vehicle extends GameObject.derive(ObjectCategory.Vehicle) {
    definition!: VehicleDefinition;
    rpm = 1000;

    constructor(game: Game, id: number, data: ObjectsNetData[ObjectCategory.Vehicle]) {
        super(game, id);
        this.updateFromData(data, true);
    }

    override updateFromData(data: ObjectsNetData[ObjectCategory.Vehicle], isNew = false): void {
        if (data.full) {
            const full = data.full;
            const definition = this.definition = full.definition;
            this.layer = full.layer;
        }

        const definition = this.definition;

        if (definition === undefined) {
            console.warn("Vehicle partially updated before being fully updated");
        }

        this.position = data.position;
        this.rotation = data.rotation;
        this.rpm = data.rpm;

        console.log(this.rpm);
    }
}

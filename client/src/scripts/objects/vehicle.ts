import { ObjectCategory } from "@common/constants";
import { GameObject } from "./gameObject";
import type { ObjectsNetData } from "@common/utils/objectsSerializations";
import { Game } from "../game";
import type { VehicleDefinition } from "@common/definitions/vehicles";
import { drawHitbox, SuroiSprite, toPixiCoords } from "../utils/pixi";
import { HITBOX_COLORS, HITBOX_DEBUG_MODE } from "../utils/constants";

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

            if (isNew) {
                const image = new SuroiSprite(definition.idString);
                this.container.addChild(image);
            }
        }

        const definition = this.definition;

        if (definition === undefined) {
            console.warn("Vehicle partially updated before being fully updated");
        }

        this.container.position = toPixiCoords(this.position = data.position);
        this.container.rotation = this.rotation = data.rotation;
        this.rpm = data.rpm;

        console.log(this.rpm);
    }

    updateZIndex(): void {
    }

    override updateDebugGraphics(): void {
        if (!HITBOX_DEBUG_MODE) return;

        this.debugGraphics.clear();
        drawHitbox(
            this.definition.hitbox.transform(this.position, 1),
            HITBOX_COLORS.obstacle,
            this.debugGraphics,
            1
        );
    }
}

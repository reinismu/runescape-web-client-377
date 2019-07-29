import { ItemDefinition } from "../../cache/def/ItemDefinition";
import { Model } from "./Model";
import { Renderable } from "./Renderable";

export class Item extends Renderable {
    public itemId: number;

    public itemCount: number;

    constructor() {
        super();
        if (this.itemId === undefined) { this.itemId = 0; }
        if (this.itemCount === undefined) { this.itemCount = 0; }
    }

    /**
     *
     * @return {Model}
     */
    public getRotatedModel(): Model {
        const itemDefinition: ItemDefinition = ItemDefinition.lookup(this.itemId);
        return itemDefinition.asGroundStack(this.itemCount);
    }
}

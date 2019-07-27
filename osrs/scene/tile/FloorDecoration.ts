import { Renderable } from "../../media/renderable/Renderable";

export class FloorDecoration {
    public x: number;

    public y: number;

    public z: number;

    public renderable: Renderable;

    public hash: number;

    public config: number;

    constructor() {
        if (this.x === undefined) { this.x = 0; }
        if (this.y === undefined) { this.y = 0; }
        if (this.z === undefined) { this.z = 0; }
        if (this.renderable === undefined) { this.renderable = null; }
        if (this.hash === undefined) { this.hash = 0; }
        if (this.config === undefined) { this.config = 0; }
    }
}

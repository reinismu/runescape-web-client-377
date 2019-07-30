import { Renderable } from "../../media/renderable/Renderable";

export class Wall {
    public plane: number;

    public x: number;

    public y: number;

    public orientationA: number;

    public face: number;

    public aRenderable769: Renderable;

    public aRenderable770: Renderable;

    public hash: number;

    public config: number;

    constructor() {
        if (this.plane === undefined) { this.plane = 0; }
        if (this.x === undefined) { this.x = 0; }
        if (this.y === undefined) { this.y = 0; }
        if (this.orientationA === undefined) { this.orientationA = 0; }
        if (this.face === undefined) { this.face = 0; }
        if (this.aRenderable769 === undefined) { this.aRenderable769 = null; }
        if (this.aRenderable770 === undefined) { this.aRenderable770 = null; }
        if (this.hash === undefined) { this.hash = 0; }
        if (this.config === undefined) { this.config = 0; }
    }
}

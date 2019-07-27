import { Renderable } from "../../media/renderable/Renderable";

export class WallDecoration {

    public plane: number;

    public y: number;

    public x: number;

    public faceUnknown: number;

    public face: number;

    public renderable: Renderable;

    public hash: number;

    public config: number;
    public constructor() {
        if (this.plane === undefined) { this.plane = 0; }
        if (this.y === undefined) { this.y = 0; }
        if (this.x === undefined) { this.x = 0; }
        if (this.faceUnknown === undefined) { this.faceUnknown = 0; }
        if (this.face === undefined) { this.face = 0; }
        if (this.renderable === undefined) { this.renderable = null; }
        if (this.hash === undefined) { this.hash = 0; }
        if (this.config === undefined) { this.config = 0; }
    }
}

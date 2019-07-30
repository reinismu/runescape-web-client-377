import { Renderable } from "../media/renderable/Renderable";

export class SceneSpawnRequest {
    public anInt113: number;

    public tileHeight: number;

    public x: number;

    public y: number;

    public renderable: Renderable;

    public anInt118: number;

    public relativeX: number;

    public offsetX: number;

    public relativeY: number;

    public offsetY: number;

    public anInt123: number;

    public cycle: number;

    public hash: number;

    public config: number;

    constructor() {
        if (this.anInt113 === undefined) { this.anInt113 = 0; }
        if (this.tileHeight === undefined) { this.tileHeight = 0; }
        if (this.relativeX === undefined) { this.relativeX = 0; }
        if (this.y === undefined) { this.y = 0; }
        if (this.renderable === undefined) { this.renderable = null; }
        if (this.anInt118 === undefined) { this.anInt118 = 0; }
        if (this.relativeX === undefined) { this.relativeX = 0; }
        if (this.offsetX === undefined) { this.offsetX = 0; }
        if (this.relativeY === undefined) { this.relativeY = 0; }
        if (this.offsetY === undefined) { this.offsetY = 0; }
        if (this.anInt123 === undefined) { this.anInt123 = 0; }
        if (this.cycle === undefined) { this.cycle = 0; }
        if (this.hash === undefined) { this.hash = 0; }
        if (this.config === undefined) { this.config = 0; }
    }
}

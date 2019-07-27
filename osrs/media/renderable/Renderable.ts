/* Generated from Java with JSweet 2.3.0 - http://www.jsweet.org */
import { CacheableNode } from "../../collection/CacheableNode";
import { VertexNormal } from "../VertexNormal";
import { Model } from "./Model";

export class Renderable extends CacheableNode {
    public verticesNormal: VertexNormal[];

    public modelHeight: number = 1000;

    constructor() {
        super();
        if (this.verticesNormal === undefined) { this.verticesNormal = null; }
    }

    public renderAtPoint(i: number, j: number, k: number, l: number, i1: number, j1: number, k1: number, l1: number, i2: number) {
        const model: Model = this.getRotatedModel();
        if (model != null) {
            this.modelHeight = model.modelHeight;
            model.renderAtPoint(i, j, k, l, i1, j1, k1, l1, i2);
        }
    }

    public getRotatedModel(): Model {
        return null;
    }
}

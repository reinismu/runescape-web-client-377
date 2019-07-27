export class VertexNormal {

    public x: number;

    public y: number;

    public z: number;

    public magnitude: number;
    public constructor() {
        if (this.x === undefined) { this.x = 0; }
        if (this.y === undefined) { this.y = 0; }
        if (this.z === undefined) { this.z = 0; }
        if (this.magnitude === undefined) { this.magnitude = 0; }
    }
}

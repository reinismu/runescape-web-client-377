export class GenericTile {

    public anInt95: number;

    public anInt96: number;

    public anInt97: number;

    public anInt98: number;

    public texture: number;

    public flat: boolean;

    public rgbColor: number;
    public constructor(i: number, j: number, k: number, l: number, texture: number, rgbColor: number, flat: boolean) {
        if (this.anInt95 === undefined) { this.anInt95 = 0; }
        if (this.anInt96 === undefined) { this.anInt96 = 0; }
        if (this.anInt97 === undefined) { this.anInt97 = 0; }
        if (this.anInt98 === undefined) { this.anInt98 = 0; }
        if (this.texture === undefined) { this.texture = 0; }
        if (this.flat === undefined) { this.flat = false; }
        if (this.rgbColor === undefined) { this.rgbColor = 0; }
        this.anInt95 = i;
        this.anInt96 = j;
        this.anInt97 = k;
        this.anInt98 = l;
        this.texture = texture;
        this.rgbColor = rgbColor;
        this.flat = flat;
    }
}

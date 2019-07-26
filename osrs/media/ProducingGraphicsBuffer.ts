import { Rasterizer } from "./Rasterizer";
import { Graphics } from "../graphics/Graphics";

export class ProducingGraphicsBuffer {
    public pixels: number[];

    public width: number;

    public height: number;

    public constructor(width: number, height: number) {
        if (this.pixels === undefined) { this.pixels = null; }
        if (this.width === undefined) { this.width = 0; }
        if (this.height === undefined) { this.height = 0; }
        this.width = width;
        this.height = height;
        this.pixels = ((s) => { const a = []; while (s-- > 0) { a.push(0); } return a; })(width * height);

        this.createRasterizer();
    }

    public createRasterizer() {
        Rasterizer.createRasterizer(this.pixels, this.width, this.height);
    }

    public drawGraphics(x: number, y: number, graphics: Graphics) {
        graphics.drawImage(new ImageData(new Uint8ClampedArray(this.pixels), this.width, this.height), x, y);
    }
}

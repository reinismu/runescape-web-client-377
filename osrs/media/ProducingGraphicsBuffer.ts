import { Rasterizer } from "./Rasterizer";
import { Graphics } from "../graphics/Graphics";

export class ProducingGraphicsBuffer {
    public pixels: number[];

    public width: number;

    public height: number;

    public constructor(width: number, height: number) {
        if (this.pixels === undefined) {
            this.pixels = null;
        }
        if (this.width === undefined) {
            this.width = 0;
        }
        if (this.height === undefined) {
            this.height = 0;
        }
        this.width = width;
        this.height = height;
        this.pixels = (s => {
            const a = [];
            while (s-- > 0) {
                a.push(0);
            }
            return a;
        })(width * height);

        this.createRasterizer();
    }

    public createRasterizer() {
        Rasterizer.createRasterizer(this.pixels, this.width, this.height);
    }

    public drawGraphics(x: number, y: number, graphics: Graphics) {
        graphics.drawImage(
            new ImageData(
                new Uint8ClampedArray(
                    new Int32Array(
                        this.pixels.map(p => this.fixPixel(p))
                    ).buffer
                ),
                this.width,
                this.height
            ),
            x,
            y
        );
    }

    public fixPixel(pixel: number): number {
        let c = (pixel >> 24) & 255;
        let r = (pixel >> 16) & 255;
        let g = (pixel >> 8) & 255;
        let b = pixel & 255;
        if (c != 0) {
            return pixel;
        }

        // //invert
        let a = 255;
        const black = (255 << 24);
        return pixel == 0 ? black : (a << 24) + (b << 16) + (g << 8) + r;
    }
}

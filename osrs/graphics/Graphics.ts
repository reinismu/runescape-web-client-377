import { Font } from "./Font";
import { Color } from "./Color";

export class Graphics {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
    }

    public setColor(color: Color) {
        this.ctx.fillStyle = color.toCanvasStyle();
        this.ctx.strokeStyle = color.toCanvasStyle();
    }

    public fillRect(x: number, y: number, width: number, height: number) {
        this.ctx.fillRect(x, y, width, height);
    }

    public drawRect(x: number, y: number, width: number, height: number) {
        this.ctx.strokeRect(x, y, width, height);
    }

    public setFont(font: Font) {
        this.ctx.font = font.toCanvasFont();
    }

    public drawString(s: string, x: number, y: number) {
        this.ctx.fillText(s, x, y);
    }

    public measureTextWidth(s: string): number {
        return this.ctx.measureText(s).width;
    }

    public drawImage(image: ImageData, x: number, y: number) {
        this.ctx.putImageData(image, x, y);
    }

    public getImage(width: number, height: number): ImageData {
        return this.ctx.getImageData(0, 0, width, height);
    }
}

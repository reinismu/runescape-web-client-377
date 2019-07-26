import { CacheableNode } from "../collection/CacheableNode";

export class Rasterizer extends CacheableNode {
    public static pixels: number[] = null;

    public static width: number = 0;

    public static height: number = 0;

    public static topY: number = 0;

    public static bottomY: number = 0;

    public static topX: number = 0;

    public static bottomX: number = 0;

    public static virtualBottomX: number = 0;

    public static centerX: number = 0;

    public static centerY: number = 0;

    public static createRasterizer(pixels: number[], width: number, height: number) {
        Rasterizer.pixels = pixels;
        Rasterizer.width = width;
        Rasterizer.height = height;
        Rasterizer.setCoordinates(0, 0, height, width);
    }

    public static resetCoordinates() {
        Rasterizer.topX = 0;
        Rasterizer.topY = 0;
        Rasterizer.bottomX = Rasterizer.width;
        Rasterizer.bottomY = Rasterizer.height;
        Rasterizer.virtualBottomX = Rasterizer.bottomX - 1;
        Rasterizer.centerX = (Rasterizer.bottomX / 2 | 0);
    }

    public static setCoordinates(y: number, x: number, height: number, width: number) {
        if (x < 0) { x = 0; }
        if (y < 0) { y = 0; }
        if (width > Rasterizer.width) { width = Rasterizer.width; }
        if (height > Rasterizer.height) { height = Rasterizer.height; }
        Rasterizer.topX = x;
        Rasterizer.topY = y;
        Rasterizer.bottomX = width;
        Rasterizer.bottomY = height;
        Rasterizer.virtualBottomX = Rasterizer.bottomX - 1;
        Rasterizer.centerX = (Rasterizer.bottomX / 2 | 0);
        Rasterizer.centerY = (Rasterizer.bottomY / 2 | 0);
    }

    public static resetPixels() {
        const pixelCount: number = Rasterizer.width * Rasterizer.height;
        for (let pixel: number = 0; pixel < pixelCount; pixel++) {Rasterizer.pixels[pixel] = 0; }
    }

    public static drawFilledRectangleAlhpa(x: number, y: number, width: number, height: number, colour: number, alpha: number) {
        if (x < Rasterizer.topX) {
            width -= Rasterizer.topX - x;
            x = Rasterizer.topX;
        }
        if (y < Rasterizer.topY) {
            height -= Rasterizer.topY - y;
            y = Rasterizer.topY;
        }
        if (x + width > Rasterizer.bottomX) { width = Rasterizer.bottomX - x; }
        if (y + height > Rasterizer.bottomY) { height = Rasterizer.bottomY - y; }
        const a: number = 256 - alpha;
        const r: number = (colour >> 16 & 255) * alpha;
        const g: number = (colour >> 8 & 255) * alpha;
        const b: number = (colour & 255) * alpha;
        const widthOffset: number = Rasterizer.width - width;
        let pixel: number = x + y * Rasterizer.width;
        for (let heightCounter: number = 0; heightCounter < height; heightCounter++) {{
            for (let widthCounter: number = -width; widthCounter < 0; widthCounter++) {{
                const red: number = (Rasterizer.pixels[pixel] >> 16 & 255) * a;
                const green: number = (Rasterizer.pixels[pixel] >> 8 & 255) * a;
                const blue: number = (Rasterizer.pixels[pixel] & 255) * a;
                const rgba: number = ((r + red >> 8) << 16) + ((g + green >> 8) << 8) + (b + blue >> 8);
                Rasterizer.pixels[pixel++] = rgba;
            }}
            pixel += widthOffset;
        }}
    }

    public static drawFilledRectangle(x: number, y: number, width: number, height: number, colour: number) {
        if (x < Rasterizer.topX) {
            width -= Rasterizer.topX - x;
            x = Rasterizer.topX;
        }
        if (y < Rasterizer.topY) {
            height -= Rasterizer.topY - y;
            y = Rasterizer.topY;
        }
        if (x + width > Rasterizer.bottomX) { width = Rasterizer.bottomX - x; }
        if (y + height > Rasterizer.bottomY) { height = Rasterizer.bottomY - y; }
        const pixelOffset: number = Rasterizer.width - width;
        let pixel: number = x + y * Rasterizer.width;
        for (let heightCounter: number = -height; heightCounter < 0; heightCounter++) {{
            for (let widthCounter: number = -width; widthCounter < 0; widthCounter++) {Rasterizer.pixels[pixel++] = colour; }
            pixel += pixelOffset;
        }}
    }

    public static drawUnfilledRectangle(x: number, y: number, width: number, height: number, color: number) {
        Rasterizer.drawHorizontalLine(x, y, width, color);
        Rasterizer.drawHorizontalLine(x, (y + height) - 1, width, color);
        Rasterizer.drawVerticalLine(x, y, height, color);
        Rasterizer.drawVerticalLine((x + width) - 1, y, height, color);
    }

    public static drawUnfilledRectangleAlpha(x: number, y: number, width: number, height: number, colour: number, alpha: number) {
        Rasterizer.drawHorizontalLineAlpha(x, y, width, colour, alpha);
        Rasterizer.drawHorizontalLineAlpha(x, (y + height) - 1, width, colour, alpha);
        if (height >= 3) {
            Rasterizer.drawVerticalLineAlpha(x, y + 1, height - 2, colour, alpha);
            Rasterizer.drawVerticalLineAlpha((x + width) - 1, y + 1, height - 2, colour, alpha);
        }
    }

    public static drawHorizontalLine(x: number, y: number, lenght: number, colour: number) {
        if (y < Rasterizer.topY || y >= Rasterizer.bottomY) { return; }
        if (x < Rasterizer.topX) {
            lenght -= Rasterizer.topX - x;
            x = Rasterizer.topX;
        }
        if (x + lenght > Rasterizer.bottomX) { lenght = Rasterizer.bottomX - x; }
        const pixelOffset: number = x + y * Rasterizer.width;
        for (let pixel: number = 0; pixel < lenght; pixel++) {Rasterizer.pixels[pixelOffset + pixel] = colour; }
    }

    public static drawHorizontalLineAlpha(x: number, y: number, length: number, colour: number, alpha: number) {
        if (y < Rasterizer.topY || y >= Rasterizer.bottomY) { return; }
        if (x < Rasterizer.topX) {
            length -= Rasterizer.topX - x;
            x = Rasterizer.topX;
        }
        if (x + length > Rasterizer.bottomX) { length = Rasterizer.bottomX - x; }
        const a: number = 256 - alpha;
        const r: number = (colour >> 16 & 255) * alpha;
        const g: number = (colour >> 8 & 255) * alpha;
        const b: number = (colour & 255) * alpha;
        let pixelOffset: number = x + y * Rasterizer.width;
        for (let lengthCounter: number = 0; lengthCounter < length; lengthCounter++) {{
            const red: number = (Rasterizer.pixels[pixelOffset] >> 16 & 255) * a;
            const green: number = (Rasterizer.pixels[pixelOffset] >> 8 & 255) * a;
            const blue: number = (Rasterizer.pixels[pixelOffset] & 255) * a;
            const rgba: number = ((r + red >> 8) << 16) + ((g + green >> 8) << 8) + (b + blue >> 8);
            Rasterizer.pixels[pixelOffset++] = rgba;
        }}
    }

    public static drawVerticalLine(x: number, y: number, lenght: number, colour: number) {
        if (x < Rasterizer.topX || x >= Rasterizer.bottomX) { return; }
        if (y < Rasterizer.topY) {
            lenght -= Rasterizer.topY - y;
            y = Rasterizer.topY;
        }
        if (y + lenght > Rasterizer.bottomY) { lenght = Rasterizer.bottomY - y; }
        const pixelOffset: number = x + y * Rasterizer.width;
        for (let pixel: number = 0; pixel < lenght; pixel++) {Rasterizer.pixels[pixelOffset + pixel * Rasterizer.width] = colour; }
    }

    public static drawVerticalLineAlpha(x: number, y: number, lenght: number, colour: number, alpha: number) {
        if (x < Rasterizer.topX || x >= Rasterizer.bottomX) { return; }
        if (y < Rasterizer.topY) {
            lenght -= Rasterizer.topY - y;
            y = Rasterizer.topY;
        }
        if (y + lenght > Rasterizer.bottomY) { lenght = Rasterizer.bottomY - y; }
        const a: number = 256 - alpha;
        const r: number = (colour >> 16 & 255) * alpha;
        const g: number = (colour >> 8 & 255) * alpha;
        const b: number = (colour & 255) * alpha;
        let pixel: number = x + y * Rasterizer.width;
        for (let lengthCounter: number = 0; lengthCounter < lenght; lengthCounter++) {{
            const red: number = (Rasterizer.pixels[pixel] >> 16 & 255) * a;
            const blue: number = (Rasterizer.pixels[pixel] >> 8 & 255) * a;
            const green: number = (Rasterizer.pixels[pixel] & 255) * a;
            const rgba: number = ((r + red >> 8) << 16) + ((g + blue >> 8) << 8) + (b + green >> 8);
            Rasterizer.pixels[pixel] = rgba;
            pixel += Rasterizer.width;
        }}
    }

    public constructor() {
        super();
    }
}

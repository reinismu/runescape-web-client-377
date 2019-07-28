import { Rasterizer } from "../../media/Rasterizer";
import { Buffer } from "../../net/Buffer";
import { Archive } from "../Archive";
import { IndexedImage } from "./IndexedImage";
import { decode } from "jpeg-js";

export class ImageRGB extends Rasterizer {
    public pixels: number[];

    public width: number;

    public height: number;

    public offsetX: number;

    public offsetY: number;

    public maxWidth: number;

    public maxHeight: number;

    public static from(width: number, height: number): ImageRGB {
        let image = new ImageRGB();
        image.pixels = Array(width * height).fill(0);
        image.width = image.maxWidth = width;
        image.height = image.maxHeight = height;
        image.offsetX = image.offsetY = 0;
        return image;
    }

    public static async fromJpg(bytes: Int8Array): Promise<ImageRGB> {
        // Pixel data didn't align with one one in java. Tho it seemed to change the same way.
        const jpgData = decode(bytes);
        let image = new ImageRGB();
        image.pixels = Array.from(new Int32Array(jpgData.data.buffer));
        image.width = image.maxWidth = jpgData.width;
        image.height = image.maxHeight = jpgData.height;
        image.offsetX = image.offsetY = 0;
        return image;
    }

    public static fromArchive(archive: Archive, archiveName: string, archiveIndex: number): ImageRGB {
        let image = new ImageRGB();
        const imageBytes = archive.getFile(archiveName + ".dat");
        const dataBuffer: Buffer = new Buffer(imageBytes);
        const indexBuffer: Buffer = new Buffer(archive.getFile("index.dat"));
        indexBuffer.currentPosition = dataBuffer.getUnsignedLEShort();
        image.maxWidth = indexBuffer.getUnsignedLEShort();
        image.maxHeight = indexBuffer.getUnsignedLEShort();
        const length: number = indexBuffer.getUnsignedByte();
        const pixels: number[] = Array(length).fill(0);
        for (let pixel: number = 0; pixel < length - 1; pixel++) {
            {
                pixels[pixel + 1] = indexBuffer.get24BitInt();
                if (pixels[pixel + 1] === 0) {
                    pixels[pixel + 1] = 1;
                }
            }
        }
        for (let index: number = 0; index < archiveIndex; index++) {
            {
                indexBuffer.currentPosition += 2;
                dataBuffer.currentPosition += indexBuffer.getUnsignedLEShort() * indexBuffer.getUnsignedLEShort();
                indexBuffer.currentPosition++;
            }
        }
        image.offsetX = indexBuffer.getUnsignedByte();
        image.offsetY = indexBuffer.getUnsignedByte();
        image.width = indexBuffer.getUnsignedLEShort();
        image.height = indexBuffer.getUnsignedLEShort();
        const type: number = indexBuffer.getUnsignedByte();
        const pixelCount: number = image.width * image.height;
        image.pixels = Array(pixelCount).fill(0);
        if (type === 0) {
            for (let pixel: number = 0; pixel < pixelCount; pixel++) {
                const newPixel = pixels[dataBuffer.getUnsignedByte()];
                image.pixels[pixel] = newPixel;
            }
            return image;
        }
        if (type === 1) {
            for (let x: number = 0; x < image.width; x++) {
                {
                    for (let y: number = 0; y < image.height; y++) {
                        const newPixel = pixels[dataBuffer.getUnsignedByte()];
                        image.pixels[x + y * image.width] = newPixel;
                    }
                }
            }
        }
        return image;
    }

    public createRasterizer() {
        Rasterizer.createRasterizer(this.pixels, this.width, this.height);
    }

    public adjustRGB(redOffset: number, greenOffset: number, blueOffset: number) {
        for (let pixel: number = 0; pixel < this.pixels.length; pixel++) {
            {
                const originalColor: number = this.pixels[pixel];
                if (originalColor !== 0) {
                    let red: number = (originalColor >> 16) & 255;
                    red += redOffset;
                    if (red < 1) {
                        red = 1;
                    } else if (red > 255) {
                        red = 255;
                    }
                    let green: number = (originalColor >> 8) & 255;
                    green += greenOffset;
                    if (green < 1) {
                        green = 1;
                    } else if (green > 255) {
                        green = 255;
                    }
                    let blue: number = originalColor & 255;
                    blue += blueOffset;
                    if (blue < 1) {
                        blue = 1;
                    } else if (blue > 255) {
                        blue = 255;
                    }
                    this.pixels[pixel] = (red << 16) + (green << 8) + blue;
                }
            }
        }
    }

    public trim() {
        const newPixels: number[] = (s => {
            const a = [];
            while (s-- > 0) {
                a.push(0);
            }
            return a;
        })(this.maxWidth * this.maxHeight);
        for (let y: number = 0; y < this.height; y++) {
            {
                for (let x: number = 0; x < this.width; x++) {
                    newPixels[(y + this.offsetY) * this.maxWidth + (x + this.offsetX)] = this.pixels[y * this.width + x];
                }
            }
        }
        this.pixels = newPixels;
        this.width = this.maxWidth;
        this.height = this.maxHeight;
        this.offsetX = 0;
        this.offsetY = 0;
    }

    public drawInverse(x: number, y: number) {
        x += this.offsetX;
        y += this.offsetY;
        let rasterizerPixel: number = x + y * Rasterizer.width;
        let pixel: number = 0;
        let newHeight: number = this.height;
        let newWidth: number = this.width;
        let rasterizerPixelOffset: number = Rasterizer.width - newWidth;
        let pixelOffset: number = 0;
        if (y < Rasterizer.topY) {
            const yOffset: number = Rasterizer.topY - y;
            newHeight -= yOffset;
            y = Rasterizer.topY;
            pixel += yOffset * newWidth;
            rasterizerPixel += yOffset * Rasterizer.width;
        }
        if (y + newHeight > Rasterizer.bottomY) {
            newHeight -= y + newHeight - Rasterizer.bottomY;
        }
        if (x < Rasterizer.topX) {
            const xOffset: number = Rasterizer.topX - x;
            newWidth -= xOffset;
            x = Rasterizer.topX;
            pixel += xOffset;
            rasterizerPixel += xOffset;
            pixelOffset += xOffset;
            rasterizerPixelOffset += xOffset;
        }
        if (x + newWidth > Rasterizer.bottomX) {
            const widthOffset: number = x + newWidth - Rasterizer.bottomX;
            newWidth -= widthOffset;
            pixelOffset += widthOffset;
            rasterizerPixelOffset += widthOffset;
        }
        if (newWidth <= 0 || newHeight <= 0) {
            return;
        }
        this.copyPixels(this.pixels, Rasterizer.pixels, pixel, rasterizerPixel, pixelOffset, rasterizerPixelOffset, newWidth, newHeight);
    }

    public copyPixels(
        pixels: number[],
        rasterizerPixels: number[],
        pixel: number,
        rasterizerPixel: number,
        pixelOffset: number,
        rasterizerPixelOffset: number,
        width: number,
        height: number
    ) {
        const shiftedWidth: number = -(width >> 2);
        width = -(width & 3);
        for (let heightCounter: number = -height; heightCounter < 0; heightCounter++) {
            {
                for (let widthCounter: number = shiftedWidth; widthCounter < 0; widthCounter++) {
                    {
                        rasterizerPixels[rasterizerPixel++] = pixels[pixel++];
                        rasterizerPixels[rasterizerPixel++] = pixels[pixel++];
                        rasterizerPixels[rasterizerPixel++] = pixels[pixel++];
                        rasterizerPixels[rasterizerPixel++] = pixels[pixel++];
                    }
                }
                for (let widthCounter: number = width; widthCounter < 0; widthCounter++) {
                    rasterizerPixels[rasterizerPixel++] = pixels[pixel++];
                }
                rasterizerPixel += rasterizerPixelOffset;
                pixel += pixelOffset;
            }
        }
    }

    public drawImage(y: number, x: number) {
        x += this.offsetX;
        y += this.offsetY;
        let rasterizerOffset: number = x + y * Rasterizer.width;
        let pixelOffset: number = 0;
        let imageHeight: number = this.height;
        let imageWidth: number = this.width;
        let deviation: number = Rasterizer.width - imageWidth;
        let originalDeviation: number = 0;
        if (y < Rasterizer.topY) {
            const yOffset: number = Rasterizer.topY - y;
            imageHeight -= yOffset;
            y = Rasterizer.topY;
            pixelOffset += yOffset * imageWidth;
            rasterizerOffset += yOffset * Rasterizer.width;
        }
        if (y + imageHeight > Rasterizer.bottomY) {
            imageHeight -= y + imageHeight - Rasterizer.bottomY;
        }
        if (x < Rasterizer.topX) {
            const xOffset: number = Rasterizer.topX - x;
            imageWidth -= xOffset;
            x = Rasterizer.topX;
            pixelOffset += xOffset;
            rasterizerOffset += xOffset;
            originalDeviation += xOffset;
            deviation += xOffset;
        }
        if (x + imageWidth > Rasterizer.bottomX) {
            const xOffset: number = x + imageWidth - Rasterizer.bottomX;
            imageWidth -= xOffset;
            originalDeviation += xOffset;
            deviation += xOffset;
        }
        if (imageWidth <= 0 || imageHeight <= 0) {
            return;
        } else {
            this.shapeImageToPixels$int_A$int_A$int$int$int$int$int$int$int(
                this.pixels,
                Rasterizer.pixels,
                pixelOffset,
                rasterizerOffset,
                imageWidth,
                imageHeight,
                originalDeviation,
                deviation,
                0
            );
            return;
        }
    }

    public shapeImageToPixels$int_A$int_A$int$int$int$int$int$int$int(
        pixels: number[],
        rasterizerPixels: number[],
        pixel: number,
        rasterizerPixel: number,
        width: number,
        height: number,
        pixelOffset: number,
        rasterizerPixelOffset: number,
        pixelColor: number
    ) {
        const shiftedWidth: number = -(width >> 2);
        width = -(width & 3);
        for (let heightCounter: number = -height; heightCounter < 0; heightCounter++) {
            {
                for (let widthCounter: number = shiftedWidth; widthCounter < 0; widthCounter++) {
                    {
                        pixelColor = pixels[pixel++];
                        if (pixelColor !== 0) {
                            rasterizerPixels[rasterizerPixel++] = pixelColor;
                        } else {
                            rasterizerPixel++;
                        }
                        pixelColor = pixels[pixel++];
                        if (pixelColor !== 0) {
                            rasterizerPixels[rasterizerPixel++] = pixelColor;
                        } else {
                            rasterizerPixel++;
                        }
                        pixelColor = pixels[pixel++];
                        if (pixelColor !== 0) {
                            rasterizerPixels[rasterizerPixel++] = pixelColor;
                        } else {
                            rasterizerPixel++;
                        }
                        pixelColor = pixels[pixel++];
                        if (pixelColor !== 0) {
                            rasterizerPixels[rasterizerPixel++] = pixelColor;
                        } else {
                            rasterizerPixel++;
                        }
                    }
                }
                for (let widthCounter: number = width; widthCounter < 0; widthCounter++) {
                    {
                        pixelColor = pixels[pixel++];
                        if (pixelColor !== 0) {
                            rasterizerPixels[rasterizerPixel++] = pixelColor;
                        } else {
                            rasterizerPixel++;
                        }
                    }
                }
                rasterizerPixel += rasterizerPixelOffset;
                pixel += pixelOffset;
            }
        }
    }

    public drawImageAlpha(x: number, y: number, alpha: number) {
        x += this.offsetX;
        y += this.offsetY;
        let rasterizerPixel: number = x + y * Rasterizer.width;
        let pixel: number = 0;
        let newHeight: number = this.height;
        let newWidth: number = this.width;
        let rasterizerPixelOffset: number = Rasterizer.width - newWidth;
        let pixelOffset: number = 0;
        if (y < Rasterizer.topY) {
            const yOffset: number = Rasterizer.topY - y;
            newHeight -= yOffset;
            y = Rasterizer.topY;
            pixel += yOffset * newWidth;
            rasterizerPixel += yOffset * Rasterizer.width;
        }
        if (y + newHeight > Rasterizer.bottomY) {
            newHeight -= y + newHeight - Rasterizer.bottomY;
        }
        if (x < Rasterizer.topX) {
            const xOffset: number = Rasterizer.topX - x;
            newWidth -= xOffset;
            x = Rasterizer.topX;
            pixel += xOffset;
            rasterizerPixel += xOffset;
            pixelOffset += xOffset;
            rasterizerPixelOffset += xOffset;
        }
        if (x + newWidth > Rasterizer.bottomX) {
            const xOffset: number = x + newWidth - Rasterizer.bottomX;
            newWidth -= xOffset;
            pixelOffset += xOffset;
            rasterizerPixelOffset += xOffset;
        }
        if (newWidth > 0 && newHeight > 0) {
            this.copyPixelsAlpha(
                this.pixels,
                Rasterizer.pixels,
                pixel,
                rasterizerPixel,
                pixelOffset,
                rasterizerPixelOffset,
                newWidth,
                newHeight,
                0,
                alpha
            );
        }
    }

    public copyPixelsAlpha(
        pixels: number[],
        rasterizerPixels: number[],
        pixel: number,
        rasterizerPixel: number,
        pixelOffset: number,
        rasterizerPixelOffset: number,
        width: number,
        height: number,
        color: number,
        alpha: number
    ) {
        const alphaValue: number = 256 - alpha;
        for (let heightCounter: number = -height; heightCounter < 0; heightCounter++) {
            {
                for (let widthCounter: number = -width; widthCounter < 0; widthCounter++) {
                    {
                        color = pixels[pixel++];
                        if (color !== 0) {
                            const rasterizerPixelColor: number = rasterizerPixels[rasterizerPixel];
                            rasterizerPixels[rasterizerPixel++] =
                                ((((color & 16711935) * alpha + (rasterizerPixelColor & 16711935) * alphaValue) & -16711936) +
                                    (((color & 65280) * alpha + (rasterizerPixelColor & 65280) * alphaValue) & 16711680)) >>
                                8;
                        } else {
                            rasterizerPixel++;
                        }
                    }
                }
                rasterizerPixel += rasterizerPixelOffset;
                pixel += pixelOffset;
            }
        }
    }

    public shapeImageToPixels$int$int$int$int$int_A$int$int$int$int_A$int(
        i: number,
        k: number,
        l: number,
        i1: number,
        ai: number[],
        j1: number,
        k1: number,
        l1: number,
        ai1: number[],
        i2: number
    ) {
        try {
            const j2: number = (-i1 / 2) | 0;
            const k2: number = (-k / 2) | 0;
            let l2: number = ((Math.sin(k1 / 326.11) * 65536.0) as number) | 0;
            let i3: number = ((Math.cos(k1 / 326.11) * 65536.0) as number) | 0;
            l2 = (l2 * l1) >> 8;
            i3 = (i3 * l1) >> 8;
            let j3: number = (l << 16) + (k2 * l2 + j2 * i3);
            let k3: number = (i2 << 16) + (k2 * i3 - j2 * l2);
            let l3: number = j1 + i * Rasterizer.width;
            for (i = 0; i < k; i++) {
                {
                    const i4: number = ai1[i];
                    let j4: number = l3 + i4;
                    let k4: number = j3 + i3 * i4;
                    let l4: number = k3 - l2 * i4;
                    for (j1 = -ai[i]; j1 < 0; j1++) {
                        {
                            Rasterizer.pixels[j4++] = this.pixels[(k4 >> 16) + (l4 >> 16) * this.width];
                            k4 += i3;
                            l4 -= l2;
                        }
                    }
                    j3 += l2;
                    k3 += i3;
                    l3 += Rasterizer.width;
                }
            }
            return;
        } catch (_ex) {
            return;
        }
    }

    public shapeImageToPixels(i?: any, k?: any, l?: any, i1?: any, ai?: any, j1?: any, k1?: any, l1?: any, ai1?: any, i2?: any): any {
        if (
            (typeof i === "number" || i === null) &&
            (typeof k === "number" || k === null) &&
            (typeof l === "number" || l === null) &&
            (typeof i1 === "number" || i1 === null) &&
            ((ai != null && ((ai instanceof Array) as any) && (ai.length == 0 || ai[0] == null || typeof ai[0] === "number")) ||
                ai === null) &&
            (typeof j1 === "number" || j1 === null) &&
            (typeof k1 === "number" || k1 === null) &&
            (typeof l1 === "number" || l1 === null) &&
            ((ai1 != null && ((ai1 instanceof Array) as any) && (ai1.length == 0 || ai1[0] == null || typeof ai1[0] === "number")) ||
                ai1 === null) &&
            (typeof i2 === "number" || i2 === null)
        ) {
            return this.shapeImageToPixels$int$int$int$int$int_A$int$int$int$int_A$int(i, k, l, i1, ai, j1, k1, l1, ai1, i2) as any;
        } else if (
            ((i != null && ((i instanceof Array) as any) && (i.length == 0 || i[0] == null || typeof i[0] === "number")) || i === null) &&
            ((k != null && ((k instanceof Array) as any) && (k.length == 0 || k[0] == null || typeof k[0] === "number")) || k === null) &&
            (typeof l === "number" || l === null) &&
            (typeof i1 === "number" || i1 === null) &&
            (typeof ai === "number" || ai === null) &&
            (typeof j1 === "number" || j1 === null) &&
            (typeof k1 === "number" || k1 === null) &&
            (typeof l1 === "number" || l1 === null) &&
            (typeof ai1 === "number" || ai1 === null) &&
            i2 === undefined
        ) {
            return this.shapeImageToPixels$int_A$int_A$int$int$int$int$int$int$int(i, k, l, i1, ai, j1, k1, l1, ai1) as any;
        } else {
            throw new Error("invalid overload");
        }
    }

    public method466(i: number, j: number, k: number, l: number, i1: number, j1: number, k1: number, d: number, l1: number) {
        if (j1 !== -30658) {
            return;
        }
        try {
            const i2: number = (-k1 / 2) | 0;
            const j2: number = (-i1 / 2) | 0;
            let k2: number = ((Math.sin(d) * 65536.0) as number) | 0;
            let l2: number = ((Math.cos(d) * 65536.0) as number) | 0;
            k2 = (k2 * i) >> 8;
            l2 = (l2 * i) >> 8;
            let i3: number = (j << 16) + (j2 * k2 + i2 * l2);
            let j3: number = (l << 16) + (j2 * l2 - i2 * k2);
            let k3: number = k + l1 * Rasterizer.width;
            for (l1 = 0; l1 < i1; l1++) {
                {
                    let l3: number = k3;
                    let i4: number = i3;
                    let j4: number = j3;
                    for (k = -k1; k < 0; k++) {
                        {
                            const k4: number = this.pixels[(i4 >> 16) + (j4 >> 16) * this.width];
                            if (k4 !== 0) {
                                Rasterizer.pixels[l3++] = k4;
                            } else {
                                l3++;
                            }
                            i4 += l2;
                            j4 -= k2;
                        }
                    }
                    i3 += k2;
                    j3 += l2;
                    k3 += Rasterizer.width;
                }
            }
            return;
        } catch (_ex) {
            return;
        }
    }

    public method467(class50_sub1_sub1_sub3: IndexedImage, i: number, j: number, k: number) {
        if (j !== -49993) {
            return;
        }
        k += this.offsetX;
        i += this.offsetY;
        let l: number = k + i * Rasterizer.width;
        let i1: number = 0;
        let j1: number = this.height;
        let k1: number = this.width;
        let l1: number = Rasterizer.width - k1;
        let i2: number = 0;
        if (i < Rasterizer.topY) {
            const j2: number = Rasterizer.topY - i;
            j1 -= j2;
            i = Rasterizer.topY;
            i1 += j2 * k1;
            l += j2 * Rasterizer.width;
        }
        if (i + j1 > Rasterizer.bottomY) {
            j1 -= i + j1 - Rasterizer.bottomY;
        }
        if (k < Rasterizer.topX) {
            const k2: number = Rasterizer.topX - k;
            k1 -= k2;
            k = Rasterizer.topX;
            i1 += k2;
            l += k2;
            i2 += k2;
            l1 += k2;
        }
        if (k + k1 > Rasterizer.bottomX) {
            const l2: number = k + k1 - Rasterizer.bottomX;
            k1 -= l2;
            i2 += l2;
            l1 += l2;
        }
        if (k1 <= 0 || j1 <= 0) {
            return;
        } else {
            this.method468(l, l1, this.pixels, k1, Rasterizer.pixels, class50_sub1_sub1_sub3.pixels, 40303, j1, i1, 0, i2);
            return;
        }
    }

    public method468(
        i: number,
        j: number,
        ai: number[],
        k: number,
        ai1: number[],
        abyte0: number[],
        l: number,
        i1: number,
        j1: number,
        k1: number,
        l1: number
    ) {
        const i2: number = -(k >> 2);
        k = -(k & 3);
        for (let j2: number = -i1; j2 < 0; j2++) {
            {
                for (let k2: number = i2; k2 < 0; k2++) {
                    {
                        k1 = ai[j1++];
                        if (k1 !== 0 && abyte0[i] === 0) {
                            ai1[i++] = k1;
                        } else {
                            i++;
                        }
                        k1 = ai[j1++];
                        if (k1 !== 0 && abyte0[i] === 0) {
                            ai1[i++] = k1;
                        } else {
                            i++;
                        }
                        k1 = ai[j1++];
                        if (k1 !== 0 && abyte0[i] === 0) {
                            ai1[i++] = k1;
                        } else {
                            i++;
                        }
                        k1 = ai[j1++];
                        if (k1 !== 0 && abyte0[i] === 0) {
                            ai1[i++] = k1;
                        } else {
                            i++;
                        }
                    }
                }
                for (let l2: number = k; l2 < 0; l2++) {
                    {
                        k1 = ai[j1++];
                        if (k1 !== 0 && abyte0[i] === 0) {
                            ai1[i++] = k1;
                        } else {
                            i++;
                        }
                    }
                }
                i += j;
                j1 += l1;
            }
        }
    }
}

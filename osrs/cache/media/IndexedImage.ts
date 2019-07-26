/* Generated from Java with JSweet 2.3.0 - http://www.jsweet.org */
import { Rasterizer } from "../../media/Rasterizer";
import { Buffer } from "../../net/Buffer";
import { Archive } from "../Archive";

export class IndexedImage extends Rasterizer {
    public pixels: number[];

    public palette: number[];

    public width: number;

    public height: number;

    public xDrawOffset: number;

    public yDrawOffset: number;

    public maxWidth: number;

    public maxHeight: number;

    public constructor(archive: Archive, archiveName: string, offset: number) {
        super();
        if (this.pixels === undefined) { this.pixels = null; }
        if (this.palette === undefined) { this.palette = null; }
        if (this.width === undefined) { this.width = 0; }
        if (this.height === undefined) { this.height = 0; }
        if (this.xDrawOffset === undefined) { this.xDrawOffset = 0; }
        if (this.yDrawOffset === undefined) { this.yDrawOffset = 0; }
        if (this.maxWidth === undefined) { this.maxWidth = 0; }
        if (this.maxHeight === undefined) { this.maxHeight = 0; }
        const dataBuffer: Buffer = new Buffer(archive.getFile(archiveName + ".dat"));
        const indexBuffer: Buffer = new Buffer(archive.getFile("index.dat"));
        indexBuffer.currentPosition = dataBuffer.getUnsignedLEShort();
        this.maxWidth = indexBuffer.getUnsignedLEShort();
        this.maxHeight = indexBuffer.getUnsignedLEShort();
        const palleteLength: number = indexBuffer.getUnsignedByte();
        this.palette = ((s) => { const a = []; while (s-- > 0) { a.push(0); } return a; })(palleteLength);
        for (let index: number = 0; index < palleteLength - 1; index++) {this.palette[index + 1] = indexBuffer.get24BitInt(); }
        for (let counter: number = 0; counter < offset; counter++) {{
            indexBuffer.currentPosition += 2;
            dataBuffer.currentPosition += indexBuffer.getUnsignedLEShort() * indexBuffer.getUnsignedLEShort();
            indexBuffer.currentPosition++;
        }}
        this.xDrawOffset = indexBuffer.getUnsignedByte();
        this.yDrawOffset = indexBuffer.getUnsignedByte();
        this.width = indexBuffer.getUnsignedLEShort();
        this.height = indexBuffer.getUnsignedLEShort();
        const type: number = indexBuffer.getUnsignedByte();
        const pixelLength: number = this.width * this.height;
        this.pixels = ((s) => { const a = []; while (s-- > 0) { a.push(0); } return a; })(pixelLength);
        if (type === 0) {
            for (let pixel: number = 0; pixel < pixelLength; pixel++) {this.pixels[pixel] = dataBuffer.getSignedByte(); }
            return;
        }
        if (type === 1) {
            for (let x: number = 0; x < this.width; x++) {{
                for (let y: number = 0; y < this.height; y++) {this.pixels[x + y * this.width] = dataBuffer.getSignedByte(); }
            }}
        }
    }

    public resizeToHalfMax() {
        this.maxWidth = ((n) => n < 0 ? Math.ceil(n) : Math.floor(n))(this.maxWidth / 2);
        this.maxHeight = ((n) => n < 0 ? Math.ceil(n) : Math.floor(n))(this.maxHeight / 2);
        const resizedPixels: number[] = ((s) => { const a = []; while (s-- > 0) { a.push(0); } return a; })(this.maxWidth * this.maxHeight);
        let pixelCount: number = 0;
        for (let y: number = 0; y < this.height; y++) {{
            for (let x: number = 0; x < this.width; x++) {resizedPixels[(x + this.xDrawOffset >> 1) + (y + this.yDrawOffset >> 1) * this.maxWidth] = this.pixels[pixelCount++]; }
        }}
        this.pixels = resizedPixels;
        this.width = this.maxWidth;
        this.height = this.maxHeight;
        this.xDrawOffset = 0;
        this.yDrawOffset = 0;
    }

    public resizeToMax() {
        if (this.width !== this.maxWidth || this.height !== this.maxHeight) {
            const resizedPixels: number[] = ((s) => { const a = []; while (s-- > 0) { a.push(0); } return a; })(this.maxWidth * this.maxHeight);
            let pixelCount: number = 0;
            for (let y: number = 0; y < this.height; y++) {{
                for (let x: number = 0; x < this.width; x++) {resizedPixels[x + this.xDrawOffset + (y + this.yDrawOffset) * this.maxWidth] = this.pixels[pixelCount++]; }
            }}
            this.pixels = resizedPixels;
            this.width = this.maxWidth;
            this.height = this.maxHeight;
            this.xDrawOffset = 0;
            this.yDrawOffset = 0;
        }
    }

    public flipHorizontal() {
        const flipedPixels: number[] = ((s) => { const a = []; while (s-- > 0) { a.push(0); } return a; })(this.width * this.height);
        let pixelCount: number = 0;
        for (let y: number = 0; y < this.height; y++) {{
            for (let x: number = this.width - 1; x >= 0; x--) {flipedPixels[pixelCount++] = this.pixels[x + y * this.width]; }
        }}
        this.pixels = flipedPixels;
        this.xDrawOffset = this.maxWidth - this.width - this.xDrawOffset;
    }

    public flipVertical() {
        const flipedPixels: number[] = ((s) => { const a = []; while (s-- > 0) { a.push(0); } return a; })(this.width * this.height);
        let pixelCount: number = 0;
        for (let y: number = this.height - 1; y >= 0; y--) {{
            for (let x: number = 0; x < this.width; x++) {flipedPixels[pixelCount++] = this.pixels[x + y * this.width]; }
        }}
        this.pixels = flipedPixels;
        this.yDrawOffset = this.maxHeight - this.height - this.yDrawOffset;
    }

    public mixPalette(red: number, green: number, blue: number) {
        for (let index: number = 0; index < this.palette.length; index++) {{
            let r: number = this.palette[index] >> 16 & 255;
            r += red;
            if (r < 0) { r = 0; } else if (r > 255) { r = 255; }
            let g: number = this.palette[index] >> 8 & 255;
            g += green;
            if (g < 0) { g = 0; } else if (g > 255) { g = 255; }
            let b: number = this.palette[index] & 255;
            b += blue;
            if (b < 0) { b = 0; } else if (b > 255) { b = 255; }
            this.palette[index] = (r << 16) + (g << 8) + b;
        }}
    }

    public drawImage(x: number, y: number) {
        x += this.xDrawOffset;
        y += this.yDrawOffset;
        let offset: number = x + y * Rasterizer.width;
        let originalOffset: number = 0;
        let imageHeight: number = this.height;
        let imageWidth: number = this.width;
        let deviation: number = Rasterizer.width - imageWidth;
        let originalDeviation: number = 0;
        if (y < Rasterizer.topY) {
            const yOffset: number = Rasterizer.topY - y;
            imageHeight -= yOffset;
            y = Rasterizer.topY;
            originalOffset += yOffset * imageWidth;
            offset += yOffset * Rasterizer.width;
        }
        if (y + imageHeight > Rasterizer.bottomY) { imageHeight -= (y + imageHeight) - Rasterizer.bottomY; }
        if (x < Rasterizer.topX) {
            const xOffset: number = Rasterizer.topX - x;
            imageWidth -= xOffset;
            x = Rasterizer.topX;
            originalOffset += xOffset;
            offset += xOffset;
            originalDeviation += xOffset;
            deviation += xOffset;
        }
        if (x + imageWidth > Rasterizer.bottomX) {
            const xOffset: number = (x + imageWidth) - Rasterizer.bottomX;
            imageWidth -= xOffset;
            originalDeviation += xOffset;
            deviation += xOffset;
        }
        if (imageWidth > 0 && imageHeight > 0) {
            this.copyPixels(this.pixels, Rasterizer.pixels, imageWidth, imageHeight, offset, originalOffset, deviation, originalDeviation, this.palette);
        }
    }

    public copyPixels(pixels: number[], rasterizerPixels: number[], width: number, height: number, offset: number, originalOffset: number, deviation: number, originalDeviation: number, pallete: number[]) {
        const shiftedWidth: number = -(width >> 2);
        width = -(width & 3);
        for (let heightCounter: number = -height; heightCounter < 0; heightCounter++) {{
            for (let shiftedWidthCounter: number = shiftedWidth; shiftedWidthCounter < 0; shiftedWidthCounter++) {{
                let pixel: number = pixels[originalOffset++];
                if (pixel !== 0) { rasterizerPixels[offset++] = pallete[pixel & 255]; } else { offset++; }
                pixel = pixels[originalOffset++];
                if (pixel !== 0) { rasterizerPixels[offset++] = pallete[pixel & 255]; } else { offset++; }
                pixel = pixels[originalOffset++];
                if (pixel !== 0) { rasterizerPixels[offset++] = pallete[pixel & 255]; } else { offset++; }
                pixel = pixels[originalOffset++];
                if (pixel !== 0) { rasterizerPixels[offset++] = pallete[pixel & 255]; } else { offset++; }
            }}
            for (let widthCounter: number = width; widthCounter < 0; widthCounter++) {{
                const pixel: number = pixels[originalOffset++];
                if (pixel !== 0) { rasterizerPixels[offset++] = pallete[pixel & 255]; } else { offset++; }
            }}
            offset += deviation;
            originalOffset += originalDeviation;
        }}
    }
}

import { Rasterizer } from "../../media/Rasterizer";
import { Buffer } from "../../net/Buffer";
import { Archive } from "../Archive";

export class TypeFace extends Rasterizer {
    public characterPixels: number[][] = ((s) => { const a = []; while (s-- > 0) { a.push(null); } return a; })(256);

    public characterWidths: number[] = ((s) => { const a = []; while (s-- > 0) { a.push(0); } return a; })(256);

    public characterHeights: number[] = ((s) => { const a = []; while (s-- > 0) { a.push(0); } return a; })(256);

    public characterXOffsets: number[] = ((s) => { const a = []; while (s-- > 0) { a.push(0); } return a; })(256);

    public characterYOffsets: number[] = ((s) => { const a = []; while (s-- > 0) { a.push(0); } return a; })(256);

    public characterScreenWidths: number[] = ((s) => { const a = []; while (s-- > 0) { a.push(0); } return a; })(256);

    public characterDefaultHeight: number;

    public strikethrough: boolean = false;

    public constructor(large: boolean, archive: Archive, archiveName: string) {
        super();
        if (this.characterDefaultHeight === undefined) { this.characterDefaultHeight = 0; }
        const dataBuffer: Buffer = new Buffer(archive.getFile(archiveName + ".dat"));
        const indexBuffer: Buffer = new Buffer(archive.getFile("index.dat"));
        indexBuffer.currentPosition = dataBuffer.getUnsignedLEShort() + 4;
        const k: number = indexBuffer.getUnsignedByte();
        if (k > 0) { indexBuffer.currentPosition += 3 * (k - 1); }
        for (let character: number = 0; character < 256; character++) {{
            this.characterXOffsets[character] = indexBuffer.getUnsignedByte();
            this.characterYOffsets[character] = indexBuffer.getUnsignedByte();
            const characterWidth: number = this.characterWidths[character] = indexBuffer.getUnsignedLEShort();
            const characterHeight: number = this.characterHeights[character] = indexBuffer.getUnsignedLEShort();
            const characterType: number = indexBuffer.getUnsignedByte();
            const characterSize: number = characterWidth * characterHeight;
            this.characterPixels[character] = ((s) => { const a = []; while (s-- > 0) { a.push(0); } return a; })(characterSize);
            if (characterType === 0) {
                for (let pixel: number = 0; pixel < characterSize; pixel++) {this.characterPixels[character][pixel] = dataBuffer.getSignedByte(); }
            } else if (characterType === 1) {
                for (let characterX: number = 0; characterX < characterWidth; characterX++) {{
                    for (let characterY: number = 0; characterY < characterHeight; characterY++) {this.characterPixels[character][characterX + characterY * characterWidth] = dataBuffer.getSignedByte(); }
                }}
            }
            if (characterHeight > this.characterDefaultHeight && character < 128) { this.characterDefaultHeight = characterHeight; }
            this.characterXOffsets[character] = 1;
            this.characterScreenWidths[character] = characterWidth + 2;
            let pixelCount: number = 0;
            for (let characterY: number = (characterHeight / 7 | 0); characterY < characterHeight; characterY++) {pixelCount += this.characterPixels[character][characterY * characterWidth]; }
            if (pixelCount <= (characterHeight / 7 | 0)) {
                this.characterScreenWidths[character]--;
                this.characterXOffsets[character] = 0;
            }
            pixelCount = 0;
            for (let characterY: number = (characterHeight / 7 | 0); characterY < characterHeight; characterY++) {pixelCount += this.characterPixels[character][(characterWidth - 1) + characterY * characterWidth]; }
            if (pixelCount <= (characterHeight / 7 | 0)) { this.characterScreenWidths[character]--; }
        }}
        if (large) {
            this.characterScreenWidths[32] = this.characterScreenWidths[73];
        } else {
            this.characterScreenWidths[32] = this.characterScreenWidths[105];
        }
    }

    public drawStringRight(string: string, x: number, y: number, colour: number) {
        this.drawString(string, x - this.getStringWidth(string), y, colour);
    }

    public drawStringLeft(string: string, x: number, y: number, colour: number) {
        this.drawString(string, x - (this.getStringWidth(string) / 2 | 0), y, colour);
    }

    public drawStringCenter(string: string, x: number, y: number, colour: number, shadowed: boolean) {
        this.drawShadowedString(string, x - (this.getStringEffectWidth(string) / 2 | 0), y, shadowed, colour);
    }

    public getStringEffectWidth(string: string): number {
        if (string == null) { return 0; }
        let width: number = 0;
        for (let character: number = 0; character < string.length; character++) {if (((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(string.charAt(character)) == "@".charCodeAt(0) && character + 4 < string.length && ((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(string.charAt(character + 4)) == "@".charCodeAt(0)) { character += 4; } else { width += this.characterScreenWidths[(string.charAt(character)).charCodeAt(0)]; }}
        return width;
    }

    public getStringWidth(string: string): number {
        if (string == null) { return 0; }
        let width: number = 0;
        for (let character: number = 0; character < string.length; character++) {width += this.characterScreenWidths[(string.charAt(character)).charCodeAt(0)]; }
        return width;
    }

    public drawString(string: string, x: number, y: number, colour: number) {
        if (string == null) { return; }
        y -= this.characterDefaultHeight;
        for (let index: number = 0; index < string.length; index++) {{
            const character: string = string.charAt(index);
            if (((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(character) != " ".charCodeAt(0)) { this.drawCharacter(this.characterPixels[(character).charCodeAt(0)], x + this.characterXOffsets[(character).charCodeAt(0)], y + this.characterYOffsets[(character).charCodeAt(0)], this.characterWidths[(character).charCodeAt(0)], this.characterHeights[(character).charCodeAt(0)], colour); }
            x += this.characterScreenWidths[(character).charCodeAt(0)];
        }}
    }

    public drawCenteredStringWaveY(string: string, x: number, y: number, wave: number, colour: number) {
        if (string == null) { return; }
        x -= (this.getStringWidth(string) / 2 | 0);
        y -= this.characterDefaultHeight;
        for (let index: number = 0; index < string.length; index++) {{
            const character: string = string.charAt(index);
            if (((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(character) != " ".charCodeAt(0)) { this.drawCharacter(this.characterPixels[(character).charCodeAt(0)], x + this.characterXOffsets[(character).charCodeAt(0)], y + this.characterYOffsets[(character).charCodeAt(0)] + (((Math.sin(index / 2.0 + wave / 5.0) * 5.0) as number) | 0), this.characterWidths[(character).charCodeAt(0)], this.characterHeights[(character).charCodeAt(0)], colour); }
            x += this.characterScreenWidths[(character).charCodeAt(0)];
        }}
    }

    public drawCeneteredStringWaveXY(string: string, x: number, y: number, wave: number, colour: number) {
        if (string == null) { return; }
        x -= (this.getStringWidth(string) / 2 | 0);
        y -= this.characterDefaultHeight;
        for (let index: number = 0; index < string.length; index++) {{
            const character: string = string.charAt(index);
            if (((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(character) != " ".charCodeAt(0)) { this.drawCharacter(this.characterPixels[(character).charCodeAt(0)], x + this.characterXOffsets[(character).charCodeAt(0)] + (((Math.sin(index / 5.0 + wave / 5.0) * 5.0) as number) | 0), y + this.characterYOffsets[(character).charCodeAt(0)] + (((Math.sin(index / 3.0 + wave / 5.0) * 5.0) as number) | 0), this.characterWidths[(character).charCodeAt(0)], this.characterHeights[(character).charCodeAt(0)], colour); }
            x += this.characterScreenWidths[(character).charCodeAt(0)];
        }}
    }

    public drawCenteredStringWaveXYMove(string: string, x: number, y: number, waveAmount: number, waveSpeed: number, colour: number) {
        if (string == null) { return; }
        let speed: number = 7.0 - waveSpeed / 8.0;
        if (speed < 0.0) { speed = 0.0; }
        x -= (this.getStringWidth(string) / 2 | 0);
        y -= this.characterDefaultHeight;
        for (let index: number = 0; index < string.length; index++) {{
            const character: string = string.charAt(index);
            if (((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(character) != " ".charCodeAt(0)) { this.drawCharacter(this.characterPixels[(character).charCodeAt(0)], x + this.characterXOffsets[(character).charCodeAt(0)], y + this.characterYOffsets[(character).charCodeAt(0)] + (((Math.sin(index / 1.5 + waveAmount) * speed) as number) | 0), this.characterWidths[(character).charCodeAt(0)], this.characterHeights[(character).charCodeAt(0)], colour); }
            x += this.characterScreenWidths[(character).charCodeAt(0)];
        }}
    }

    public drawShadowedString(string: string, x: number, y: number, shadow: boolean, colour: number) {
        this.strikethrough = false;
        const originalX: number = x;
        if (string == null) { return; }
        y -= this.characterDefaultHeight;
        for (let character: number = 0; character < string.length; character++) {if (((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(string.charAt(character)) == "@".charCodeAt(0) && character + 4 < string.length && ((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(string.charAt(character + 4)) == "@".charCodeAt(0)) {
            const stringColour: number = this.getColour(string.substring(character + 1, character + 4));
            if (stringColour !== -1) { colour = stringColour; }
            character += 4;
        } else {
            const c: string = string.charAt(character);
            if (((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c) != " ".charCodeAt(0)) {
                if (shadow) { this.drawCharacter(this.characterPixels[(c).charCodeAt(0)], x + this.characterXOffsets[(c).charCodeAt(0)] + 1, y + this.characterYOffsets[(c).charCodeAt(0)] + 1, this.characterWidths[(c).charCodeAt(0)], this.characterHeights[(c).charCodeAt(0)], 0); }
                this.drawCharacter(this.characterPixels[(c).charCodeAt(0)], x + this.characterXOffsets[(c).charCodeAt(0)], y + this.characterYOffsets[(c).charCodeAt(0)], this.characterWidths[(c).charCodeAt(0)], this.characterHeights[(c).charCodeAt(0)], colour);
            }
            x += this.characterScreenWidths[(c).charCodeAt(0)];
        }}
        if (this.strikethrough) { Rasterizer.drawHorizontalLine(originalX, y + (((this.characterDefaultHeight * 0.7) as number) | 0), x - originalX, 8388608); }
    }

    public drawShadowedSeededAlphaString(string: string, x: number, y: number, colour: number, seed: number) {
        if (string == null) { return; }
        const alpha: number = 192 + (this.getRandomInt(123456) & 31);
        y -= this.characterDefaultHeight;
        for (let index: number = 0; index < string.length; index++) {if (((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(string.charAt(index)) == "@".charCodeAt(0) && index + 4 < string.length && ((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(string.charAt(index + 4)) == "@".charCodeAt(0)) {
            const stringColour: number = this.getColour(string.substring(index + 1, index + 4));
            if (stringColour !== -1) { colour = stringColour; }
            index += 4;
        } else {
            const c: string = string.charAt(index);
            if (((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(c) != " ".charCodeAt(0)) {
                this.drawAlphaCharacter(x + this.characterXOffsets[(c).charCodeAt(0)] + 1, true, 0, this.characterPixels[(c).charCodeAt(0)], y + this.characterYOffsets[(c).charCodeAt(0)] + 1, this.characterHeights[(c).charCodeAt(0)], this.characterWidths[(c).charCodeAt(0)], 192);
                this.drawAlphaCharacter(x + this.characterXOffsets[(c).charCodeAt(0)], true, colour, this.characterPixels[(c).charCodeAt(0)], y + this.characterYOffsets[(c).charCodeAt(0)], this.characterHeights[(c).charCodeAt(0)], this.characterWidths[(c).charCodeAt(0)], alpha);
            }
            x += this.characterScreenWidths[(c).charCodeAt(0)];
            if ((this.getRandomInt(234253) & 3) === 0) { x++; }
        }}
    }

    public getColour(code: string): number {
        if (/* equals */(((o1: any, o2: any) => { if (o1 && o1.equals) { return o1.equals(o2); } else { return o1 === o2; } })(code, "red") as any)) { return 16711680; }
        if (/* equals */(((o1: any, o2: any) => { if (o1 && o1.equals) { return o1.equals(o2); } else { return o1 === o2; } })(code, "gre") as any)) { return 65280; }
        if (/* equals */(((o1: any, o2: any) => { if (o1 && o1.equals) { return o1.equals(o2); } else { return o1 === o2; } })(code, "blu") as any)) { return 255; }
        if (/* equals */(((o1: any, o2: any) => { if (o1 && o1.equals) { return o1.equals(o2); } else { return o1 === o2; } })(code, "yel") as any)) { return 16776960; }
        if (/* equals */(((o1: any, o2: any) => { if (o1 && o1.equals) { return o1.equals(o2); } else { return o1 === o2; } })(code, "cya") as any)) { return 65535; }
        if (/* equals */(((o1: any, o2: any) => { if (o1 && o1.equals) { return o1.equals(o2); } else { return o1 === o2; } })(code, "mag") as any)) { return 16711935; }
        if (/* equals */(((o1: any, o2: any) => { if (o1 && o1.equals) { return o1.equals(o2); } else { return o1 === o2; } })(code, "whi") as any)) { return 16777215; }
        if (/* equals */(((o1: any, o2: any) => { if (o1 && o1.equals) { return o1.equals(o2); } else { return o1 === o2; } })(code, "bla") as any)) { return 0; }
        if (/* equals */(((o1: any, o2: any) => { if (o1 && o1.equals) { return o1.equals(o2); } else { return o1 === o2; } })(code, "lre") as any)) { return 16748608; }
        if (/* equals */(((o1: any, o2: any) => { if (o1 && o1.equals) { return o1.equals(o2); } else { return o1 === o2; } })(code, "dre") as any)) { return 8388608; }
        if (/* equals */(((o1: any, o2: any) => { if (o1 && o1.equals) { return o1.equals(o2); } else { return o1 === o2; } })(code, "dbl") as any)) { return 128; }
        if (/* equals */(((o1: any, o2: any) => { if (o1 && o1.equals) { return o1.equals(o2); } else { return o1 === o2; } })(code, "or1") as any)) { return 16756736; }
        if (/* equals */(((o1: any, o2: any) => { if (o1 && o1.equals) { return o1.equals(o2); } else { return o1 === o2; } })(code, "or2") as any)) { return 16740352; }
        if (/* equals */(((o1: any, o2: any) => { if (o1 && o1.equals) { return o1.equals(o2); } else { return o1 === o2; } })(code, "or3") as any)) { return 16723968; }
        if (/* equals */(((o1: any, o2: any) => { if (o1 && o1.equals) { return o1.equals(o2); } else { return o1 === o2; } })(code, "gr1") as any)) { return 12648192; }
        if (/* equals */(((o1: any, o2: any) => { if (o1 && o1.equals) { return o1.equals(o2); } else { return o1 === o2; } })(code, "gr2") as any)) { return 8453888; }
        if (/* equals */(((o1: any, o2: any) => { if (o1 && o1.equals) { return o1.equals(o2); } else { return o1 === o2; } })(code, "gr3") as any)) { return 4259584; }
        if (/* equals */(((o1: any, o2: any) => { if (o1 && o1.equals) { return o1.equals(o2); } else { return o1 === o2; } })(code, "str") as any)) { this.strikethrough = true; }
        if (/* equals */(((o1: any, o2: any) => { if (o1 && o1.equals) { return o1.equals(o2); } else { return o1 === o2; } })(code, "end") as any)) { this.strikethrough = false; }
        return -1;
    }

    public drawCharacter(pixels: number[], x: number, y: number, width: number, height: number, colour: number) {
        let rasterizerPixel: number = x + y * Rasterizer.width;
        let remainingWidth: number = Rasterizer.width - width;
        let characterPixelOffset: number = 0;
        let characterPixel: number = 0;
        if (y < Rasterizer.topY) {
            const offsetY: number = Rasterizer.topY - y;
            height -= offsetY;
            y = Rasterizer.topY;
            characterPixel += offsetY * width;
            rasterizerPixel += offsetY * Rasterizer.width;
        }
        if (y + height >= Rasterizer.bottomY) { height -= ((y + height) - Rasterizer.bottomY) + 1; }
        if (x < Rasterizer.topX) {
            const offsetX: number = Rasterizer.topX - x;
            width -= offsetX;
            x = Rasterizer.topX;
            characterPixel += offsetX;
            rasterizerPixel += offsetX;
            characterPixelOffset += offsetX;
            remainingWidth += offsetX;
        }
        if (x + width >= Rasterizer.bottomX) {
            const endOffsetX: number = ((x + width) - Rasterizer.bottomX) + 1;
            width -= endOffsetX;
            characterPixelOffset += endOffsetX;
            remainingWidth += endOffsetX;
        }
        if (width > 0 && height > 0) {
            this.drawCharacterPixels(pixels, Rasterizer.pixels, characterPixel, rasterizerPixel, characterPixelOffset, remainingWidth, width, height, colour);
        }
    }

    public drawCharacterPixels(characterPixels: number[], rasterizerPixels: number[], characterPixel: number, rasterizerPixel: number, characterPixelOffset: number, rasterizerPixelOffset: number, width: number, height: number, colour: number) {
        const negativeQuaterWidth: number = -(width >> 2);
        width = -(width & 3);
        for (let heightCounter: number = -height; heightCounter < 0; heightCounter++) {{
            for (let widthCounter: number = negativeQuaterWidth; widthCounter < 0; widthCounter++) {{
                if (characterPixels[characterPixel++] !== 0) { rasterizerPixels[rasterizerPixel++] = colour; } else { rasterizerPixel++; }
                if (characterPixels[characterPixel++] !== 0) { rasterizerPixels[rasterizerPixel++] = colour; } else { rasterizerPixel++; }
                if (characterPixels[characterPixel++] !== 0) { rasterizerPixels[rasterizerPixel++] = colour; } else { rasterizerPixel++; }
                if (characterPixels[characterPixel++] !== 0) { rasterizerPixels[rasterizerPixel++] = colour; } else { rasterizerPixel++; }
            }}
            for (let widthCounter: number = width; widthCounter < 0; widthCounter++) {if (characterPixels[characterPixel++] !== 0) { rasterizerPixels[rasterizerPixel++] = colour; } else { rasterizerPixel++; }}
            rasterizerPixel += rasterizerPixelOffset;
            characterPixel += characterPixelOffset;
        }}
    }

    public drawAlphaCharacter(x: number, flag: boolean, j: number, abyte0: number[], y: number, height: number, width: number, j1: number) {
        let rasterizerPixel: number = x + y * Rasterizer.width;
        let rasterizerPixelOffset: number = Rasterizer.width - width;
        let characterPixelOffset: number = 0;
        let characterPixel: number = 0;
        if (y < Rasterizer.topY) {
            const yOffset: number = Rasterizer.topY - y;
            height -= yOffset;
            y = Rasterizer.topY;
            characterPixel += yOffset * width;
            rasterizerPixel += yOffset * Rasterizer.width;
        }
        if (y + height >= Rasterizer.bottomY) { height -= ((y + height) - Rasterizer.bottomY) + 1; }
        if (x < Rasterizer.topX) {
            const xOffset: number = Rasterizer.topX - x;
            width -= xOffset;
            x = Rasterizer.topX;
            characterPixel += xOffset;
            rasterizerPixel += xOffset;
            characterPixelOffset += xOffset;
            rasterizerPixelOffset += xOffset;
        }
        if (x + width >= Rasterizer.bottomX) {
            const widthoffset: number = ((x + width) - Rasterizer.bottomX) + 1;
            width -= widthoffset;
            characterPixelOffset += widthoffset;
            rasterizerPixelOffset += widthoffset;
        }
        if (width > 0 && height > 0) {
            this.drawCharacterPixelsAlpha(characterPixel, rasterizerPixelOffset, characterPixelOffset, rasterizerPixel, j1, Rasterizer.pixels, j, 2, height, width, abyte0);
        }
    }

    public drawCharacterPixelsAlpha(characterPixel: number, rasterizerPixelOffset: number, characterPixelOffset: number, rasterizerPixel: number, alpha: number, rasterizerPixels: number[], colour: number, k1: number, height: number, width: number, characterPixels: number[]) {
        colour = ((colour & 16711935) * alpha & -16711936) + ((colour & 65280) * alpha & 16711680) >> 8;
        alpha = 256 - alpha;
        for (let heightCounter: number = -height; heightCounter < 0; heightCounter++) {{
            for (let widthCounter: number = -width; widthCounter < 0; widthCounter++) {if (characterPixels[characterPixel++] !== 0) {
                const rasterizerPixelColor: number = rasterizerPixels[rasterizerPixel];
                rasterizerPixels[rasterizerPixel++] = (((rasterizerPixelColor & 16711935) * alpha & -16711936) + ((rasterizerPixelColor & 65280) * alpha & 16711680) >> 8) + colour;
            } else {
                rasterizerPixel++;
            }}
            rasterizerPixel += rasterizerPixelOffset;
            characterPixel += characterPixelOffset;
        }}
    }

    getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }
}

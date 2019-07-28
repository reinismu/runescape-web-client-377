import { Buffer } from "../../net/Buffer";
import { Archive } from "../Archive";

export class FloorDefinition {
    public static aByte310: number = 6;

    public static count: number = 0;

    public static cache: FloorDefinition[] = null;

    public static load(archive: Archive) {
        const buffer: Buffer = new Buffer(archive.getFile("flo.dat"));
        FloorDefinition.count = buffer.getUnsignedLEShort();
        if (FloorDefinition.cache == null) { FloorDefinition.cache = ((s) => { const a = []; while (s-- > 0) { a.push(null); } return a; })(FloorDefinition.count); }
        for (let floor: number = 0; floor < FloorDefinition.count; floor++) {{
            if (FloorDefinition.cache[floor] == null) { FloorDefinition.cache[floor] = new FloorDefinition(); }
            FloorDefinition.cache[floor].loadDefinition(buffer);
        }}
    }

    public anInt311: number;

    public aBoolean312: boolean = true;

    public name: string;

    public rgbColor: number;

    public textureId: number = -1;

    public aBoolean318: boolean = false;

    public occlude: boolean = true;

    public hue2: number;

    public saturation: number;

    public lightness: number;

    public hue: number;

    public hueDivisor: number;

    public hslColor2: number;

    constructor() {
        if (this.anInt311 === undefined) { this.anInt311 = 0; }
        if (this.name === undefined) { this.name = null; }
        if (this.rgbColor === undefined) { this.rgbColor = 0; }
        if (this.hue2 === undefined) { this.hue2 = 0; }
        if (this.saturation === undefined) { this.saturation = 0; }
        if (this.lightness === undefined) { this.lightness = 0; }
        if (this.hue === undefined) { this.hue = 0; }
        if (this.hueDivisor === undefined) { this.hueDivisor = 0; }
        if (this.hslColor2 === undefined) { this.hslColor2 = 0; }
    }

    public loadDefinition(buffer: Buffer) {
        while ((true)) {{
            const attributeId: number = buffer.getUnsignedByte();
            if (attributeId === 0) { return; }
            switch ((attributeId)) {
            case 1:
                this.rgbColor = buffer.get24BitInt();
                this.shiftRGBColors(this.rgbColor);
                break;
            case 2:
                this.textureId = buffer.getUnsignedByte();
                break;
            case 3:
                this.aBoolean318 = true;
                break;
            case 5:
                this.occlude = false;
                break;
            case 6:
                this.name = buffer.getString();
                break;
            case 7:
                const oldHue2: number = this.hue2;
                const oldSaturation: number = this.saturation;
                const oldLightness: number = this.lightness;
                const oldHue: number = this.hue;
                this.shiftRGBColors(buffer.get24BitInt());
                this.hue2 = oldHue2;
                this.saturation = oldSaturation;
                this.lightness = oldLightness;
                this.hue = oldHue;
                this.hueDivisor = oldHue;
                break;
            default:
                console.info("Error unrecognised config code: " + attributeId);
                break;
            }
        }}
    }

    public shiftRGBColors(color: number) {
        const r: number = (color >> 16 & 255) / 256.0;
        const b: number = (color >> 8 & 255) / 256.0;
        const g: number = (color & 255) / 256.0;
        let cmin: number = r;
        if (b < cmin) { cmin = b; }
        if (g < cmin) { cmin = g; }
        let cmax: number = r;
        if (b > cmax) { cmax = b; }
        if (g > cmax) { cmax = g; }
        let d5: number = 0.0;
        let d6: number = 0.0;
        const d7: number = (cmin + cmax) / 2.0;
        if (cmin !== cmax) {
            if (d7 < 0.5) { d6 = (cmax - cmin) / (cmax + cmin); }
            if (d7 >= 0.5) { d6 = (cmax - cmin) / (2.0 - cmax - cmin); }
            if (r === cmax) { d5 = (b - g) / (cmax - cmin); } else if (b === cmax) { d5 = 2.0 + (g - r) / (cmax - cmin); } else if (g === cmax) { d5 = 4.0 + (r - b) / (cmax - cmin); }
        }
        d5 /= 6.0;
        this.hue2 = (((d5 * 256.0) as number) | 0);
        this.saturation = (((d6 * 256.0) as number) | 0);
        this.lightness = (((d7 * 256.0) as number) | 0);
        if (this.saturation < 0) { this.saturation = 0; } else if (this.saturation > 255) { this.saturation = 255; }
        if (this.lightness < 0) { this.lightness = 0; } else if (this.lightness > 255) { this.lightness = 255; }
        if (d7 > 0.5) { this.hueDivisor = ((((1.0 - d7) * d6 * 512.0) as number) | 0); } else { this.hueDivisor = (((d7 * d6 * 512.0) as number) | 0); }
        if (this.hueDivisor < 1) { this.hueDivisor = 1; }
        this.hue = (((d5 * this.hueDivisor) as number) | 0);
        let huerand: number = (this.hue2 + (((Math.random() * 16.0) as number) | 0)) - 8;
        if (huerand < 0) { huerand = 0; } else if (huerand > 255) { huerand = 255; }
        let satrand: number = (this.saturation + (((Math.random() * 48.0) as number) | 0)) - 24;
        if (satrand < 0) { satrand = 0; } else if (satrand > 255) { satrand = 255; }
        let lightrand: number = (this.lightness + (((Math.random() * 48.0) as number) | 0)) - 24;
        if (lightrand < 0) { lightrand = 0; } else if (lightrand > 255) { lightrand = 255; }
        this.hslColor2 = this.shiftHSLColors(huerand, satrand, lightrand);
    }

    public shiftHSLColors(i: number, j: number, k: number): number {
        if (k > 179) { j = ((n) => n < 0 ? Math.ceil(n) : Math.floor(n))(j / 2); }
        if (k > 192) { j = ((n) => n < 0 ? Math.ceil(n) : Math.floor(n))(j / 2); }
        if (k > 217) { j = ((n) => n < 0 ? Math.ceil(n) : Math.floor(n))(j / 2); }
        if (k > 243) { j = ((n) => n < 0 ? Math.ceil(n) : Math.floor(n))(j / 2); }
        const l: number = ((i / 4 | 0) << 10) + ((j / 32 | 0) << 7) + (k / 2 | 0);
        return l;
    }
}

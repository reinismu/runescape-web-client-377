import { Archive } from "../cache/Archive";
import { IndexedImage } from "../cache/media/IndexedImage";
import { Rasterizer } from "./Rasterizer";

export class Rasterizer3D extends Rasterizer {

    public static anInt1524: number = -20714;

    public static anInt1525: number = 0;
    public static aBoolean1526: boolean = false;
    public static lowMemory: boolean = true;

    public static aBoolean1528: boolean = false;
    public static aBoolean1529: boolean = false;
    public static approximateAlphaBlending: boolean = true;

    public static anInt1531: number = 0;
    public static centerX: number = 0;
    public static centerY: number = 0;
    public static anIntArray1534: number[] = Array(512).fill(0);
    public static anIntArray1535: number[] = Array(2048).fill(0);
    public static SINE: number[] = Array(2048).fill(0);
    public static COSINE: number[] = Array(2048).fill(0);
    public static lineOffsets: number[] = null;
    public static anInt1539: number = 0;
    public static aClass50_Sub1_Sub1_Sub3Array1540: IndexedImage[] = Array(50).fill(null);
    public static aBooleanArray1541: boolean[] = Array(50).fill(false);
    public static anIntArray1542: number[] = Array(50).fill(0);
    public static anInt1543: number = 0;
    public static anIntArrayArray1544: number[][] = null;
    public static anIntArrayArray1545: number[][] = Array(50);
    public static anIntArray1546: number[] = Array(50).fill(0);
    public static anInt1547: number = 0;
    public static getRgbLookupTableId: number[] = Array(0x10000).fill(0);;
    public static anIntArrayArray1549: number[][] = Array(50);

    public static reset() {
        Rasterizer3D.anIntArray1534 = null;
        Rasterizer3D.anIntArray1534 = null;
        Rasterizer3D.SINE = null;
        Rasterizer3D.COSINE = null;
        Rasterizer3D.lineOffsets = null;
        Rasterizer3D.aClass50_Sub1_Sub1_Sub3Array1540 = null;
        Rasterizer3D.aBooleanArray1541 = null;
        Rasterizer3D.anIntArray1542 = null;
        Rasterizer3D.anIntArrayArray1544 = null;
        Rasterizer3D.anIntArrayArray1545 = null;
        Rasterizer3D.anIntArray1546 = null;
        Rasterizer3D.getRgbLookupTableId = null;
        Rasterizer3D.anIntArrayArray1549 = null;
    }

    public static setDefaultBoundaries() {
        Rasterizer3D.lineOffsets = ((s) => { const a = []; while (s-- > 0) { a.push(0); } return a; })(Rasterizer.height);
        for (let lineOffset: number = 0; lineOffset < Rasterizer.height; lineOffset++) {Rasterizer3D.lineOffsets[lineOffset] = Rasterizer.width * lineOffset; }
        Rasterizer3D.centerX = (Rasterizer.width / 2 | 0);
        Rasterizer3D.centerY = (Rasterizer.height / 2 | 0);
    }

    public static method494(width: number, height: number) {
        Rasterizer3D.lineOffsets = ((s) => { const a = []; while (s-- > 0) { a.push(0); } return a; })(height);
        for (let lineOffset: number = 0; lineOffset < height; lineOffset++) {Rasterizer3D.lineOffsets[lineOffset] = width * lineOffset; }
        Rasterizer3D.centerX = (width / 2 | 0);
        Rasterizer3D.centerY = (height / 2 | 0);
    }

    public static method495(byte0: number) {
        if (byte0 !== 71) { return; }
        Rasterizer3D.anIntArrayArray1544 = null;
        for (let i: number = 0; i < 50; i++) {Rasterizer3D.anIntArrayArray1545[i] = null; }
    }

    public static method496(i: number) {
        if (Rasterizer3D.anIntArrayArray1544 == null) {
            Rasterizer3D.anInt1543 = i;
            if (Rasterizer3D.lowMemory) { Rasterizer3D.anIntArrayArray1544 = (function(dims) { const allocate = function(dims) { if (dims.length == 0) { return 0; } else { const array = []; for (let i = 0; i < dims[0]; i++) { array.push(allocate(dims.slice(1))); } return array; }}; return allocate(dims); })([Rasterizer3D.anInt1543, 16384]) as any; } else { Rasterizer3D.anIntArrayArray1544 = (function(dims) { const allocate = function(dims) { if (dims.length == 0) { return 0; } else { const array = []; for (let i = 0; i < dims[0]; i++) { array.push(allocate(dims.slice(1))); } return array; }}; return allocate(dims); })([Rasterizer3D.anInt1543, 65536]) as any; }
            for (let k: number = 0; k < 50; k++) {Rasterizer3D.anIntArrayArray1545[k] = null; }
        }
    }

    public static loadIndexedImages(class2: Archive) {
        Rasterizer3D.anInt1539 = 0;
        for (let k: number = 0; k < 50; k++) {try {
            Rasterizer3D.aClass50_Sub1_Sub1_Sub3Array1540[k] = new IndexedImage(class2, /* valueOf */new String(k).toString(), 0);
            if (Rasterizer3D.lowMemory && Rasterizer3D.aClass50_Sub1_Sub1_Sub3Array1540[k].maxWidth === 128) { Rasterizer3D.aClass50_Sub1_Sub1_Sub3Array1540[k].resizeToHalfMax(); } else { Rasterizer3D.aClass50_Sub1_Sub1_Sub3Array1540[k].resizeToMax(); }
            Rasterizer3D.anInt1539;
            Rasterizer3D.anInt1539++;
        } catch (_ex) {
        }}
    }

    public static getAverageRgbColorForTexture(i: number, j: number): number {
        if (Rasterizer3D.anIntArray1542[i] !== 0) { return Rasterizer3D.anIntArray1542[i]; }
        let k: number = 0;
        let l: number = 0;
        let i1: number = 0;
        const j1: number = Rasterizer3D.anIntArrayArray1549[i].length;
        for (let k1: number = 0; k1 < j1; k1++) {{
            k += Rasterizer3D.anIntArrayArray1549[i][k1] >> 16 & 255;
            l += Rasterizer3D.anIntArrayArray1549[i][k1] >> 8 & 255;
            i1 += Rasterizer3D.anIntArrayArray1549[i][k1] & 255;
        }}
        if (j !== 0) { return Rasterizer3D.anInt1525; }
        let l1: number = ((k / j1 | 0) << 16) + ((l / j1 | 0) << 8) + (i1 / j1 | 0);
        l1 = Rasterizer3D.method502(l1, 1.4);
        if (l1 === 0) { l1 = 1; }
        Rasterizer3D.anIntArray1542[i] = l1;
        return l1;
    }

    public static method499(i: number, j: number) {
        if (j !== 9) { Rasterizer3D.anInt1524 = -48; }
        if (Rasterizer3D.anIntArrayArray1545[i] == null) {
            return;
        } else {
            Rasterizer3D.anInt1543;
            Rasterizer3D.anIntArrayArray1544[Rasterizer3D.anInt1543++] = Rasterizer3D.anIntArrayArray1545[i];
            Rasterizer3D.anIntArrayArray1545[i] = null;
            return;
        }
    }

    public static method500(i: number): number[] {
        Rasterizer3D.anInt1547;
        Rasterizer3D.anIntArray1546[i] = Rasterizer3D.anInt1547++;
        if (Rasterizer3D.anIntArrayArray1545[i] != null) { return Rasterizer3D.anIntArrayArray1545[i]; }
        let ai: number[];
        if (Rasterizer3D.anInt1543 > 0) {
            Rasterizer3D.anInt1543;
            ai = Rasterizer3D.anIntArrayArray1544[--Rasterizer3D.anInt1543];
            Rasterizer3D.anIntArrayArray1544[Rasterizer3D.anInt1543] = null;
        } else {
            let j: number = 0;
            let k: number = -1;
            for (let l: number = 0; l < Rasterizer3D.anInt1539; l++) {if (Rasterizer3D.anIntArrayArray1545[l] != null && (Rasterizer3D.anIntArray1546[l] < j || k === -1)) {
                j = Rasterizer3D.anIntArray1546[l];
                k = l;
            }}
            ai = Rasterizer3D.anIntArrayArray1545[k];
            Rasterizer3D.anIntArrayArray1545[k] = null;
        }
        Rasterizer3D.anIntArrayArray1545[i] = ai;
        const class50_sub1_sub1_sub3: IndexedImage = Rasterizer3D.aClass50_Sub1_Sub1_Sub3Array1540[i];
        const ai1: number[] = Rasterizer3D.anIntArrayArray1549[i];
        if (Rasterizer3D.lowMemory) {
            Rasterizer3D.aBooleanArray1541[i] = false;
            for (let i1: number = 0; i1 < 4096; i1++) {{
                const i2: number = ai[i1] = ai1[class50_sub1_sub1_sub3.pixels[i1]] & 16316671;
                if (i2 === 0) { Rasterizer3D.aBooleanArray1541[i] = true; }
                ai[4096 + i1] = i2 - (i2 >>> 3) & 16316671;
                ai[8192 + i1] = i2 - (i2 >>> 2) & 16316671;
                ai[12288 + i1] = i2 - (i2 >>> 2) - (i2 >>> 3) & 16316671;
            }}
        } else {
            if (class50_sub1_sub1_sub3.width === 64) {
                for (let j1: number = 0; j1 < 128; j1++) {{
                    for (let j2: number = 0; j2 < 128; j2++) {ai[j2 + (j1 << 7)] = ai1[class50_sub1_sub1_sub3.pixels[(j2 >> 1) + ((j1 >> 1) << 6)]]; }
                }}
            } else {
                for (let k1: number = 0; k1 < 16384; k1++) {ai[k1] = ai1[class50_sub1_sub1_sub3.pixels[k1]]; }
            }
            Rasterizer3D.aBooleanArray1541[i] = false;
            for (let l1: number = 0; l1 < 16384; l1++) {{
                ai[l1] &= 16316671;
                const k2: number = ai[l1];
                if (k2 === 0) { Rasterizer3D.aBooleanArray1541[i] = true; }
                ai[16384 + l1] = k2 - (k2 >>> 3) & 16316671;
                ai[32768 + l1] = k2 - (k2 >>> 2) & 16316671;
                ai[49152 + l1] = k2 - (k2 >>> 2) - (k2 >>> 3) & 16316671;
            }}
        }
        return ai;
    }

    public static method501(d: number) {
        d += Math.random() * 0.03 - 0.015;
        let i: number = 0;
        for (let j: number = 0; j < 512; j++) {{
            const d1: number = ((j / 8 | 0)) / 64.0 + 0.0078125;
            const d2: number = (j & 7) / 8.0 + 0.0625;
            for (let j1: number = 0; j1 < 128; j1++) {{
                const d3: number = j1 / 128.0;
                let d4: number = d3;
                let d5: number = d3;
                let d6: number = d3;
                if (d2 !== 0.0) {
                    let d7: number;
                    if (d3 < 0.5) { d7 = d3 * (1.0 + d2); } else { d7 = (d3 + d2) - d3 * d2; }
                    const d8: number = 2.0 * d3 - d7;
                    let d9: number = d1 + 0.3333333333333333;
                    if (d9 > 1.0) { d9--; }
                    const d10: number = d1;
                    let d11: number = d1 - 0.3333333333333333;
                    if (d11 < 0.0) { d11++; }
                    if (6.0 * d9 < 1.0) { d4 = d8 + (d7 - d8) * 6.0 * d9; } else if (2.0 * d9 < 1.0) { d4 = d7; } else if (3.0 * d9 < 2.0) { d4 = d8 + (d7 - d8) * (0.6666666666666666 - d9) * 6.0; } else { d4 = d8; }
                    if (6.0 * d10 < 1.0) { d5 = d8 + (d7 - d8) * 6.0 * d10; } else if (2.0 * d10 < 1.0) { d5 = d7; } else if (3.0 * d10 < 2.0) { d5 = d8 + (d7 - d8) * (0.6666666666666666 - d10) * 6.0; } else { d5 = d8; }
                    if (6.0 * d11 < 1.0) { d6 = d8 + (d7 - d8) * 6.0 * d11; } else if (2.0 * d11 < 1.0) { d6 = d7; } else if (3.0 * d11 < 2.0) { d6 = d8 + (d7 - d8) * (0.6666666666666666 - d11) * 6.0; } else { d6 = d8; }
                }
                const k1: number = (((d4 * 256.0) as number) | 0);
                const l1: number = (((d5 * 256.0) as number) | 0);
                const i2: number = (((d6 * 256.0) as number) | 0);
                let j2: number = (k1 << 16) + (l1 << 8) + i2;
                j2 = Rasterizer3D.method502(j2, d);
                if (j2 === 0) { j2 = 1; }
                Rasterizer3D.getRgbLookupTableId[i++] = j2;
            }}
        }}
        for (let k: number = 0; k < 50; k++) {if (Rasterizer3D.aClass50_Sub1_Sub1_Sub3Array1540[k] != null) {
            const ai: number[] = Rasterizer3D.aClass50_Sub1_Sub1_Sub3Array1540[k].palette;
            Rasterizer3D.anIntArrayArray1549[k] = ((s) => { const a = []; while (s-- > 0) { a.push(0); } return a; })(ai.length);
            for (let i1: number = 0; i1 < ai.length; i1++) {{
                Rasterizer3D.anIntArrayArray1549[k][i1] = Rasterizer3D.method502(ai[i1], d);
                if ((Rasterizer3D.anIntArrayArray1549[k][i1] & 16316671) === 0 && i1 !== 0) { Rasterizer3D.anIntArrayArray1549[k][i1] = 1; }
            }}
        }}
        for (let l: number = 0; l < 50; l++) {Rasterizer3D.method499(l, 9); }
    }

    public static method502(i: number, d: number): number {
        let d1: number = (i >> 16) / 256.0;
        let d2: number = (i >> 8 & 255) / 256.0;
        let d3: number = (i & 255) / 256.0;
        d1 = Math.pow(d1, d);
        d2 = Math.pow(d2, d);
        d3 = Math.pow(d3, d);
        const j: number = (((d1 * 256.0) as number) | 0);
        const k: number = (((d2 * 256.0) as number) | 0);
        const l: number = (((d3 * 256.0) as number) | 0);
        return (j << 16) + (k << 8) + l;
    }

    public static method503(i: number, j: number, k: number, l: number, i1: number, j1: number, k1: number, l1: number, i2: number) {
        let j2: number = 0;
        let k2: number = 0;
        if (j !== i) {
            j2 = ((i1 - l << 16) / (j - i) | 0);
            k2 = ((l1 - k1 << 15) / (j - i) | 0);
        }
        let l2: number = 0;
        let i3: number = 0;
        if (k !== j) {
            l2 = ((j1 - i1 << 16) / (k - j) | 0);
            i3 = ((i2 - l1 << 15) / (k - j) | 0);
        }
        let j3: number = 0;
        let k3: number = 0;
        if (k !== i) {
            j3 = ((l - j1 << 16) / (i - k) | 0);
            k3 = ((k1 - i2 << 15) / (i - k) | 0);
        }
        if (i <= j && i <= k) {
            if (i >= Rasterizer.bottomY) { return; }
            if (j > Rasterizer.bottomY) { j = Rasterizer.bottomY; }
            if (k > Rasterizer.bottomY) { k = Rasterizer.bottomY; }
            if (j < k) {
                j1 = l <<= 16;
                i2 = k1 <<= 15;
                if (i < 0) {
                    j1 -= j3 * i;
                    l -= j2 * i;
                    i2 -= k3 * i;
                    k1 -= k2 * i;
                    i = 0;
                }
                i1 <<= 16;
                l1 <<= 15;
                if (j < 0) {
                    i1 -= l2 * j;
                    l1 -= i3 * j;
                    j = 0;
                }
                if (i !== j && j3 < j2 || i === j && j3 > l2) {
                    k -= j;
                    j -= i;
                    for (i = Rasterizer3D.lineOffsets[i]; --j >= 0; i += Rasterizer.width) {{
                        Rasterizer3D.method504(Rasterizer.pixels, i, 0, 0, j1 >> 16, l >> 16, i2 >> 7, k1 >> 7);
                        j1 += j3;
                        l += j2;
                        i2 += k3;
                        k1 += k2;
                    }}
                    while ((--k >= 0)) {{
                        Rasterizer3D.method504(Rasterizer.pixels, i, 0, 0, j1 >> 16, i1 >> 16, i2 >> 7, l1 >> 7);
                        j1 += j3;
                        i1 += l2;
                        i2 += k3;
                        l1 += i3;
                        i += Rasterizer.width;
                    }}
                    return;
                }
                k -= j;
                j -= i;
                for (i = Rasterizer3D.lineOffsets[i]; --j >= 0; i += Rasterizer.width) {{
                    Rasterizer3D.method504(Rasterizer.pixels, i, 0, 0, l >> 16, j1 >> 16, k1 >> 7, i2 >> 7);
                    j1 += j3;
                    l += j2;
                    i2 += k3;
                    k1 += k2;
                }}
                while ((--k >= 0)) {{
                    Rasterizer3D.method504(Rasterizer.pixels, i, 0, 0, i1 >> 16, j1 >> 16, l1 >> 7, i2 >> 7);
                    j1 += j3;
                    i1 += l2;
                    i2 += k3;
                    l1 += i3;
                    i += Rasterizer.width;
                }}
                return;
            }
            i1 = l <<= 16;
            l1 = k1 <<= 15;
            if (i < 0) {
                i1 -= j3 * i;
                l -= j2 * i;
                l1 -= k3 * i;
                k1 -= k2 * i;
                i = 0;
            }
            j1 <<= 16;
            i2 <<= 15;
            if (k < 0) {
                j1 -= l2 * k;
                i2 -= i3 * k;
                k = 0;
            }
            if (i !== k && j3 < j2 || i === k && l2 > j2) {
                j -= k;
                k -= i;
                for (i = Rasterizer3D.lineOffsets[i]; --k >= 0; i += Rasterizer.width) {{
                    Rasterizer3D.method504(Rasterizer.pixels, i, 0, 0, i1 >> 16, l >> 16, l1 >> 7, k1 >> 7);
                    i1 += j3;
                    l += j2;
                    l1 += k3;
                    k1 += k2;
                }}
                while ((--j >= 0)) {{
                    Rasterizer3D.method504(Rasterizer.pixels, i, 0, 0, j1 >> 16, l >> 16, i2 >> 7, k1 >> 7);
                    j1 += l2;
                    l += j2;
                    i2 += i3;
                    k1 += k2;
                    i += Rasterizer.width;
                }}
                return;
            }
            j -= k;
            k -= i;
            for (i = Rasterizer3D.lineOffsets[i]; --k >= 0; i += Rasterizer.width) {{
                Rasterizer3D.method504(Rasterizer.pixels, i, 0, 0, l >> 16, i1 >> 16, k1 >> 7, l1 >> 7);
                i1 += j3;
                l += j2;
                l1 += k3;
                k1 += k2;
            }}
            while ((--j >= 0)) {{
                Rasterizer3D.method504(Rasterizer.pixels, i, 0, 0, l >> 16, j1 >> 16, k1 >> 7, i2 >> 7);
                j1 += l2;
                l += j2;
                i2 += i3;
                k1 += k2;
                i += Rasterizer.width;
            }}
            return;
        }
        if (j <= k) {
            if (j >= Rasterizer.bottomY) { return; }
            if (k > Rasterizer.bottomY) { k = Rasterizer.bottomY; }
            if (i > Rasterizer.bottomY) { i = Rasterizer.bottomY; }
            if (k < i) {
                l = i1 <<= 16;
                k1 = l1 <<= 15;
                if (j < 0) {
                    l -= j2 * j;
                    i1 -= l2 * j;
                    k1 -= k2 * j;
                    l1 -= i3 * j;
                    j = 0;
                }
                j1 <<= 16;
                i2 <<= 15;
                if (k < 0) {
                    j1 -= j3 * k;
                    i2 -= k3 * k;
                    k = 0;
                }
                if (j !== k && j2 < l2 || j === k && j2 > j3) {
                    i -= k;
                    k -= j;
                    for (j = Rasterizer3D.lineOffsets[j]; --k >= 0; j += Rasterizer.width) {{
                        Rasterizer3D.method504(Rasterizer.pixels, j, 0, 0, l >> 16, i1 >> 16, k1 >> 7, l1 >> 7);
                        l += j2;
                        i1 += l2;
                        k1 += k2;
                        l1 += i3;
                    }}
                    while ((--i >= 0)) {{
                        Rasterizer3D.method504(Rasterizer.pixels, j, 0, 0, l >> 16, j1 >> 16, k1 >> 7, i2 >> 7);
                        l += j2;
                        j1 += j3;
                        k1 += k2;
                        i2 += k3;
                        j += Rasterizer.width;
                    }}
                    return;
                }
                i -= k;
                k -= j;
                for (j = Rasterizer3D.lineOffsets[j]; --k >= 0; j += Rasterizer.width) {{
                    Rasterizer3D.method504(Rasterizer.pixels, j, 0, 0, i1 >> 16, l >> 16, l1 >> 7, k1 >> 7);
                    l += j2;
                    i1 += l2;
                    k1 += k2;
                    l1 += i3;
                }}
                while ((--i >= 0)) {{
                    Rasterizer3D.method504(Rasterizer.pixels, j, 0, 0, j1 >> 16, l >> 16, i2 >> 7, k1 >> 7);
                    l += j2;
                    j1 += j3;
                    k1 += k2;
                    i2 += k3;
                    j += Rasterizer.width;
                }}
                return;
            }
            j1 = i1 <<= 16;
            i2 = l1 <<= 15;
            if (j < 0) {
                j1 -= j2 * j;
                i1 -= l2 * j;
                i2 -= k2 * j;
                l1 -= i3 * j;
                j = 0;
            }
            l <<= 16;
            k1 <<= 15;
            if (i < 0) {
                l -= j3 * i;
                k1 -= k3 * i;
                i = 0;
            }
            if (j2 < l2) {
                k -= i;
                i -= j;
                for (j = Rasterizer3D.lineOffsets[j]; --i >= 0; j += Rasterizer.width) {{
                    Rasterizer3D.method504(Rasterizer.pixels, j, 0, 0, j1 >> 16, i1 >> 16, i2 >> 7, l1 >> 7);
                    j1 += j2;
                    i1 += l2;
                    i2 += k2;
                    l1 += i3;
                }}
                while ((--k >= 0)) {{
                    Rasterizer3D.method504(Rasterizer.pixels, j, 0, 0, l >> 16, i1 >> 16, k1 >> 7, l1 >> 7);
                    l += j3;
                    i1 += l2;
                    k1 += k3;
                    l1 += i3;
                    j += Rasterizer.width;
                }}
                return;
            }
            k -= i;
            i -= j;
            for (j = Rasterizer3D.lineOffsets[j]; --i >= 0; j += Rasterizer.width) {{
                Rasterizer3D.method504(Rasterizer.pixels, j, 0, 0, i1 >> 16, j1 >> 16, l1 >> 7, i2 >> 7);
                j1 += j2;
                i1 += l2;
                i2 += k2;
                l1 += i3;
            }}
            while ((--k >= 0)) {{
                Rasterizer3D.method504(Rasterizer.pixels, j, 0, 0, i1 >> 16, l >> 16, l1 >> 7, k1 >> 7);
                l += j3;
                i1 += l2;
                k1 += k3;
                l1 += i3;
                j += Rasterizer.width;
            }}
            return;
        }
        if (k >= Rasterizer.bottomY) { return; }
        if (i > Rasterizer.bottomY) { i = Rasterizer.bottomY; }
        if (j > Rasterizer.bottomY) { j = Rasterizer.bottomY; }
        if (i < j) {
            i1 = j1 <<= 16;
            l1 = i2 <<= 15;
            if (k < 0) {
                i1 -= l2 * k;
                j1 -= j3 * k;
                l1 -= i3 * k;
                i2 -= k3 * k;
                k = 0;
            }
            l <<= 16;
            k1 <<= 15;
            if (i < 0) {
                l -= j2 * i;
                k1 -= k2 * i;
                i = 0;
            }
            if (l2 < j3) {
                j -= i;
                i -= k;
                for (k = Rasterizer3D.lineOffsets[k]; --i >= 0; k += Rasterizer.width) {{
                    Rasterizer3D.method504(Rasterizer.pixels, k, 0, 0, i1 >> 16, j1 >> 16, l1 >> 7, i2 >> 7);
                    i1 += l2;
                    j1 += j3;
                    l1 += i3;
                    i2 += k3;
                }}
                while ((--j >= 0)) {{
                    Rasterizer3D.method504(Rasterizer.pixels, k, 0, 0, i1 >> 16, l >> 16, l1 >> 7, k1 >> 7);
                    i1 += l2;
                    l += j2;
                    l1 += i3;
                    k1 += k2;
                    k += Rasterizer.width;
                }}
                return;
            }
            j -= i;
            i -= k;
            for (k = Rasterizer3D.lineOffsets[k]; --i >= 0; k += Rasterizer.width) {{
                Rasterizer3D.method504(Rasterizer.pixels, k, 0, 0, j1 >> 16, i1 >> 16, i2 >> 7, l1 >> 7);
                i1 += l2;
                j1 += j3;
                l1 += i3;
                i2 += k3;
            }}
            while ((--j >= 0)) {{
                Rasterizer3D.method504(Rasterizer.pixels, k, 0, 0, l >> 16, i1 >> 16, k1 >> 7, l1 >> 7);
                i1 += l2;
                l += j2;
                l1 += i3;
                k1 += k2;
                k += Rasterizer.width;
            }}
            return;
        }
        l = j1 <<= 16;
        k1 = i2 <<= 15;
        if (k < 0) {
            l -= l2 * k;
            j1 -= j3 * k;
            k1 -= i3 * k;
            i2 -= k3 * k;
            k = 0;
        }
        i1 <<= 16;
        l1 <<= 15;
        if (j < 0) {
            i1 -= j2 * j;
            l1 -= k2 * j;
            j = 0;
        }
        if (l2 < j3) {
            i -= j;
            j -= k;
            for (k = Rasterizer3D.lineOffsets[k]; --j >= 0; k += Rasterizer.width) {{
                Rasterizer3D.method504(Rasterizer.pixels, k, 0, 0, l >> 16, j1 >> 16, k1 >> 7, i2 >> 7);
                l += l2;
                j1 += j3;
                k1 += i3;
                i2 += k3;
            }}
            while ((--i >= 0)) {{
                Rasterizer3D.method504(Rasterizer.pixels, k, 0, 0, i1 >> 16, j1 >> 16, l1 >> 7, i2 >> 7);
                i1 += j2;
                j1 += j3;
                l1 += k2;
                i2 += k3;
                k += Rasterizer.width;
            }}
            return;
        }
        i -= j;
        j -= k;
        for (k = Rasterizer3D.lineOffsets[k]; --j >= 0; k += Rasterizer.width) {{
            Rasterizer3D.method504(Rasterizer.pixels, k, 0, 0, j1 >> 16, l >> 16, i2 >> 7, k1 >> 7);
            l += l2;
            j1 += j3;
            k1 += i3;
            i2 += k3;
        }}
        while ((--i >= 0)) {{
            Rasterizer3D.method504(Rasterizer.pixels, k, 0, 0, j1 >> 16, i1 >> 16, i2 >> 7, l1 >> 7);
            i1 += j2;
            j1 += j3;
            l1 += k2;
            i2 += k3;
            k += Rasterizer.width;
        }}
    }

    public static method504(ai: number[], i: number, j: number, k: number, l: number, i1: number, j1: number, k1: number) {
        if (Rasterizer3D.approximateAlphaBlending) {
            let l1: number;
            if (Rasterizer3D.aBoolean1528) {
                if (i1 - l > 3) { l1 = ((k1 - j1) / (i1 - l) | 0); } else { l1 = 0; }
                if (i1 > Rasterizer.virtualBottomX) { i1 = Rasterizer.virtualBottomX; }
                if (l < 0) {
                    j1 -= l * l1;
                    l = 0;
                }
                if (l >= i1) { return; }
                i += l;
                k = i1 - l >> 2;
                l1 <<= 2;
            } else {
                if (l >= i1) { return; }
                i += l;
                k = i1 - l >> 2;
                if (k > 0) { l1 = (k1 - j1) * Rasterizer3D.anIntArray1534[k] >> 15; } else { l1 = 0; }
            }
            if (Rasterizer3D.anInt1531 === 0) {
                while ((--k >= 0)) {{
                    j = Rasterizer3D.getRgbLookupTableId[j1 >> 8];
                    j1 += l1;
                    ai[i++] = j;
                    ai[i++] = j;
                    ai[i++] = j;
                    ai[i++] = j;
                }}
                k = i1 - l & 3;
                if (k > 0) {
                    j = Rasterizer3D.getRgbLookupTableId[j1 >> 8];
                    do {ai[i++] = j; } while ((--k > 0));
                    return;
                }
            } else {
                const j2: number = Rasterizer3D.anInt1531;
                const l2: number = 256 - Rasterizer3D.anInt1531;
                while ((--k >= 0)) {{
                    j = Rasterizer3D.getRgbLookupTableId[j1 >> 8];
                    j1 += l1;
                    j = ((j & 16711935) * l2 >> 8 & 16711935) + ((j & 65280) * l2 >> 8 & 65280);
                    ai[i++] = j + ((ai[i] & 16711935) * j2 >> 8 & 16711935) + ((ai[i] & 65280) * j2 >> 8 & 65280);
                    ai[i++] = j + ((ai[i] & 16711935) * j2 >> 8 & 16711935) + ((ai[i] & 65280) * j2 >> 8 & 65280);
                    ai[i++] = j + ((ai[i] & 16711935) * j2 >> 8 & 16711935) + ((ai[i] & 65280) * j2 >> 8 & 65280);
                    ai[i++] = j + ((ai[i] & 16711935) * j2 >> 8 & 16711935) + ((ai[i] & 65280) * j2 >> 8 & 65280);
                }}
                k = i1 - l & 3;
                if (k > 0) {
                    j = Rasterizer3D.getRgbLookupTableId[j1 >> 8];
                    j = ((j & 16711935) * l2 >> 8 & 16711935) + ((j & 65280) * l2 >> 8 & 65280);
                    do {ai[i++] = j + ((ai[i] & 16711935) * j2 >> 8 & 16711935) + ((ai[i] & 65280) * j2 >> 8 & 65280); } while ((--k > 0));
                }
            }
            return;
        }
        if (l >= i1) { return; }
        const i2: number = ((k1 - j1) / (i1 - l) | 0);
        if (Rasterizer3D.aBoolean1528) {
            if (i1 > Rasterizer.virtualBottomX) { i1 = Rasterizer.virtualBottomX; }
            if (l < 0) {
                j1 -= l * i2;
                l = 0;
            }
            if (l >= i1) { return; }
        }
        i += l;
        k = i1 - l;
        if (Rasterizer3D.anInt1531 === 0) {
            do {{
                ai[i++] = Rasterizer3D.getRgbLookupTableId[j1 >> 8];
                j1 += i2;
            }} while ((--k > 0));
            return;
        }
        const k2: number = Rasterizer3D.anInt1531;
        const i3: number = 256 - Rasterizer3D.anInt1531;
        do {{
            j = Rasterizer3D.getRgbLookupTableId[j1 >> 8];
            j1 += i2;
            j = ((j & 16711935) * i3 >> 8 & 16711935) + ((j & 65280) * i3 >> 8 & 65280);
            ai[i++] = j + ((ai[i] & 16711935) * k2 >> 8 & 16711935) + ((ai[i] & 65280) * k2 >> 8 & 65280);
        }} while ((--k > 0));
    }

    public static method505(i: number, j: number, k: number, l: number, i1: number, j1: number, k1: number) {
        let l1: number = 0;
        if (j !== i) { l1 = ((i1 - l << 16) / (j - i) | 0); }
        let i2: number = 0;
        if (k !== j) { i2 = ((j1 - i1 << 16) / (k - j) | 0); }
        let j2: number = 0;
        if (k !== i) { j2 = ((l - j1 << 16) / (i - k) | 0); }
        if (i <= j && i <= k) {
            if (i >= Rasterizer.bottomY) { return; }
            if (j > Rasterizer.bottomY) { j = Rasterizer.bottomY; }
            if (k > Rasterizer.bottomY) { k = Rasterizer.bottomY; }
            if (j < k) {
                j1 = l <<= 16;
                if (i < 0) {
                    j1 -= j2 * i;
                    l -= l1 * i;
                    i = 0;
                }
                i1 <<= 16;
                if (j < 0) {
                    i1 -= i2 * j;
                    j = 0;
                }
                if (i !== j && j2 < l1 || i === j && j2 > i2) {
                    k -= j;
                    j -= i;
                    for (i = Rasterizer3D.lineOffsets[i]; --j >= 0; i += Rasterizer.width) {{
                        Rasterizer3D.method506(Rasterizer.pixels, i, k1, 0, j1 >> 16, l >> 16);
                        j1 += j2;
                        l += l1;
                    }}
                    while ((--k >= 0)) {{
                        Rasterizer3D.method506(Rasterizer.pixels, i, k1, 0, j1 >> 16, i1 >> 16);
                        j1 += j2;
                        i1 += i2;
                        i += Rasterizer.width;
                    }}
                    return;
                }
                k -= j;
                j -= i;
                for (i = Rasterizer3D.lineOffsets[i]; --j >= 0; i += Rasterizer.width) {{
                    Rasterizer3D.method506(Rasterizer.pixels, i, k1, 0, l >> 16, j1 >> 16);
                    j1 += j2;
                    l += l1;
                }}
                while ((--k >= 0)) {{
                    Rasterizer3D.method506(Rasterizer.pixels, i, k1, 0, i1 >> 16, j1 >> 16);
                    j1 += j2;
                    i1 += i2;
                    i += Rasterizer.width;
                }}
                return;
            }
            i1 = l <<= 16;
            if (i < 0) {
                i1 -= j2 * i;
                l -= l1 * i;
                i = 0;
            }
            j1 <<= 16;
            if (k < 0) {
                j1 -= i2 * k;
                k = 0;
            }
            if (i !== k && j2 < l1 || i === k && i2 > l1) {
                j -= k;
                k -= i;
                for (i = Rasterizer3D.lineOffsets[i]; --k >= 0; i += Rasterizer.width) {{
                    Rasterizer3D.method506(Rasterizer.pixels, i, k1, 0, i1 >> 16, l >> 16);
                    i1 += j2;
                    l += l1;
                }}
                while ((--j >= 0)) {{
                    Rasterizer3D.method506(Rasterizer.pixels, i, k1, 0, j1 >> 16, l >> 16);
                    j1 += i2;
                    l += l1;
                    i += Rasterizer.width;
                }}
                return;
            }
            j -= k;
            k -= i;
            for (i = Rasterizer3D.lineOffsets[i]; --k >= 0; i += Rasterizer.width) {{
                Rasterizer3D.method506(Rasterizer.pixels, i, k1, 0, l >> 16, i1 >> 16);
                i1 += j2;
                l += l1;
            }}
            while ((--j >= 0)) {{
                Rasterizer3D.method506(Rasterizer.pixels, i, k1, 0, l >> 16, j1 >> 16);
                j1 += i2;
                l += l1;
                i += Rasterizer.width;
            }}
            return;
        }
        if (j <= k) {
            if (j >= Rasterizer.bottomY) { return; }
            if (k > Rasterizer.bottomY) { k = Rasterizer.bottomY; }
            if (i > Rasterizer.bottomY) { i = Rasterizer.bottomY; }
            if (k < i) {
                l = i1 <<= 16;
                if (j < 0) {
                    l -= l1 * j;
                    i1 -= i2 * j;
                    j = 0;
                }
                j1 <<= 16;
                if (k < 0) {
                    j1 -= j2 * k;
                    k = 0;
                }
                if (j !== k && l1 < i2 || j === k && l1 > j2) {
                    i -= k;
                    k -= j;
                    for (j = Rasterizer3D.lineOffsets[j]; --k >= 0; j += Rasterizer.width) {{
                        Rasterizer3D.method506(Rasterizer.pixels, j, k1, 0, l >> 16, i1 >> 16);
                        l += l1;
                        i1 += i2;
                    }}
                    while ((--i >= 0)) {{
                        Rasterizer3D.method506(Rasterizer.pixels, j, k1, 0, l >> 16, j1 >> 16);
                        l += l1;
                        j1 += j2;
                        j += Rasterizer.width;
                    }}
                    return;
                }
                i -= k;
                k -= j;
                for (j = Rasterizer3D.lineOffsets[j]; --k >= 0; j += Rasterizer.width) {{
                    Rasterizer3D.method506(Rasterizer.pixels, j, k1, 0, i1 >> 16, l >> 16);
                    l += l1;
                    i1 += i2;
                }}
                while ((--i >= 0)) {{
                    Rasterizer3D.method506(Rasterizer.pixels, j, k1, 0, j1 >> 16, l >> 16);
                    l += l1;
                    j1 += j2;
                    j += Rasterizer.width;
                }}
                return;
            }
            j1 = i1 <<= 16;
            if (j < 0) {
                j1 -= l1 * j;
                i1 -= i2 * j;
                j = 0;
            }
            l <<= 16;
            if (i < 0) {
                l -= j2 * i;
                i = 0;
            }
            if (l1 < i2) {
                k -= i;
                i -= j;
                for (j = Rasterizer3D.lineOffsets[j]; --i >= 0; j += Rasterizer.width) {{
                    Rasterizer3D.method506(Rasterizer.pixels, j, k1, 0, j1 >> 16, i1 >> 16);
                    j1 += l1;
                    i1 += i2;
                }}
                while ((--k >= 0)) {{
                    Rasterizer3D.method506(Rasterizer.pixels, j, k1, 0, l >> 16, i1 >> 16);
                    l += j2;
                    i1 += i2;
                    j += Rasterizer.width;
                }}
                return;
            }
            k -= i;
            i -= j;
            for (j = Rasterizer3D.lineOffsets[j]; --i >= 0; j += Rasterizer.width) {{
                Rasterizer3D.method506(Rasterizer.pixels, j, k1, 0, i1 >> 16, j1 >> 16);
                j1 += l1;
                i1 += i2;
            }}
            while ((--k >= 0)) {{
                Rasterizer3D.method506(Rasterizer.pixels, j, k1, 0, i1 >> 16, l >> 16);
                l += j2;
                i1 += i2;
                j += Rasterizer.width;
            }}
            return;
        }
        if (k >= Rasterizer.bottomY) { return; }
        if (i > Rasterizer.bottomY) { i = Rasterizer.bottomY; }
        if (j > Rasterizer.bottomY) { j = Rasterizer.bottomY; }
        if (i < j) {
            i1 = j1 <<= 16;
            if (k < 0) {
                i1 -= i2 * k;
                j1 -= j2 * k;
                k = 0;
            }
            l <<= 16;
            if (i < 0) {
                l -= l1 * i;
                i = 0;
            }
            if (i2 < j2) {
                j -= i;
                i -= k;
                for (k = Rasterizer3D.lineOffsets[k]; --i >= 0; k += Rasterizer.width) {{
                    Rasterizer3D.method506(Rasterizer.pixels, k, k1, 0, i1 >> 16, j1 >> 16);
                    i1 += i2;
                    j1 += j2;
                }}
                while ((--j >= 0)) {{
                    Rasterizer3D.method506(Rasterizer.pixels, k, k1, 0, i1 >> 16, l >> 16);
                    i1 += i2;
                    l += l1;
                    k += Rasterizer.width;
                }}
                return;
            }
            j -= i;
            i -= k;
            for (k = Rasterizer3D.lineOffsets[k]; --i >= 0; k += Rasterizer.width) {{
                Rasterizer3D.method506(Rasterizer.pixels, k, k1, 0, j1 >> 16, i1 >> 16);
                i1 += i2;
                j1 += j2;
            }}
            while ((--j >= 0)) {{
                Rasterizer3D.method506(Rasterizer.pixels, k, k1, 0, l >> 16, i1 >> 16);
                i1 += i2;
                l += l1;
                k += Rasterizer.width;
            }}
            return;
        }
        l = j1 <<= 16;
        if (k < 0) {
            l -= i2 * k;
            j1 -= j2 * k;
            k = 0;
        }
        i1 <<= 16;
        if (j < 0) {
            i1 -= l1 * j;
            j = 0;
        }
        if (i2 < j2) {
            i -= j;
            j -= k;
            for (k = Rasterizer3D.lineOffsets[k]; --j >= 0; k += Rasterizer.width) {{
                Rasterizer3D.method506(Rasterizer.pixels, k, k1, 0, l >> 16, j1 >> 16);
                l += i2;
                j1 += j2;
            }}
            while ((--i >= 0)) {{
                Rasterizer3D.method506(Rasterizer.pixels, k, k1, 0, i1 >> 16, j1 >> 16);
                i1 += l1;
                j1 += j2;
                k += Rasterizer.width;
            }}
            return;
        }
        i -= j;
        j -= k;
        for (k = Rasterizer3D.lineOffsets[k]; --j >= 0; k += Rasterizer.width) {{
            Rasterizer3D.method506(Rasterizer.pixels, k, k1, 0, j1 >> 16, l >> 16);
            l += i2;
            j1 += j2;
        }}
        while ((--i >= 0)) {{
            Rasterizer3D.method506(Rasterizer.pixels, k, k1, 0, j1 >> 16, i1 >> 16);
            i1 += l1;
            j1 += j2;
            k += Rasterizer.width;
        }}
    }

    public static method506(ai: number[], i: number, j: number, k: number, l: number, i1: number) {
        if (Rasterizer3D.aBoolean1528) {
            if (i1 > Rasterizer.virtualBottomX) { i1 = Rasterizer.virtualBottomX; }
            if (l < 0) { l = 0; }
        }
        if (l >= i1) { return; }
        i += l;
        k = i1 - l >> 2;
        if (Rasterizer3D.anInt1531 === 0) {
            while ((--k >= 0)) {{
                ai[i++] = j;
                ai[i++] = j;
                ai[i++] = j;
                ai[i++] = j;
            }}
            for (k = i1 - l & 3; --k >= 0; ) {ai[i++] = j; }
            return;
        }
        const j1: number = Rasterizer3D.anInt1531;
        const k1: number = 256 - Rasterizer3D.anInt1531;
        j = ((j & 16711935) * k1 >> 8 & 16711935) + ((j & 65280) * k1 >> 8 & 65280);
        while ((--k >= 0)) {{
            ai[i++] = j + ((ai[i] & 16711935) * j1 >> 8 & 16711935) + ((ai[i] & 65280) * j1 >> 8 & 65280);
            ai[i++] = j + ((ai[i] & 16711935) * j1 >> 8 & 16711935) + ((ai[i] & 65280) * j1 >> 8 & 65280);
            ai[i++] = j + ((ai[i] & 16711935) * j1 >> 8 & 16711935) + ((ai[i] & 65280) * j1 >> 8 & 65280);
            ai[i++] = j + ((ai[i] & 16711935) * j1 >> 8 & 16711935) + ((ai[i] & 65280) * j1 >> 8 & 65280);
        }}
        for (k = i1 - l & 3; --k >= 0; ) {ai[i++] = j + ((ai[i] & 16711935) * j1 >> 8 & 16711935) + ((ai[i] & 65280) * j1 >> 8 & 65280); }
    }

    public static method507(i: number, j: number, k: number, l: number, i1: number, j1: number, k1: number, l1: number, i2: number, j2: number, k2: number, l2: number, i3: number, j3: number, k3: number, l3: number, i4: number, j4: number, k4: number) {
        const ai: number[] = Rasterizer3D.method500(k4);
        Rasterizer3D.aBoolean1529 = !Rasterizer3D.aBooleanArray1541[k4];
        k2 = j2 - k2;
        j3 = i3 - j3;
        i4 = l3 - i4;
        l2 -= j2;
        k3 -= i3;
        j4 -= l3;
        let l4: number = l2 * i3 - k3 * j2 << 14;
        const i5: number = k3 * l3 - j4 * i3 << 8;
        const j5: number = j4 * j2 - l2 * l3 << 5;
        let k5: number = k2 * i3 - j3 * j2 << 14;
        const l5: number = j3 * l3 - i4 * i3 << 8;
        const i6: number = i4 * j2 - k2 * l3 << 5;
        let j6: number = j3 * l2 - k2 * k3 << 14;
        const k6: number = i4 * k3 - j3 * j4 << 8;
        const l6: number = k2 * j4 - i4 * l2 << 5;
        let i7: number = 0;
        let j7: number = 0;
        if (j !== i) {
            i7 = ((i1 - l << 16) / (j - i) | 0);
            j7 = ((l1 - k1 << 16) / (j - i) | 0);
        }
        let k7: number = 0;
        let l7: number = 0;
        if (k !== j) {
            k7 = ((j1 - i1 << 16) / (k - j) | 0);
            l7 = ((i2 - l1 << 16) / (k - j) | 0);
        }
        let i8: number = 0;
        let j8: number = 0;
        if (k !== i) {
            i8 = ((l - j1 << 16) / (i - k) | 0);
            j8 = ((k1 - i2 << 16) / (i - k) | 0);
        }
        if (i <= j && i <= k) {
            if (i >= Rasterizer.bottomY) { return; }
            if (j > Rasterizer.bottomY) { j = Rasterizer.bottomY; }
            if (k > Rasterizer.bottomY) { k = Rasterizer.bottomY; }
            if (j < k) {
                j1 = l <<= 16;
                i2 = k1 <<= 16;
                if (i < 0) {
                    j1 -= i8 * i;
                    l -= i7 * i;
                    i2 -= j8 * i;
                    k1 -= j7 * i;
                    i = 0;
                }
                i1 <<= 16;
                l1 <<= 16;
                if (j < 0) {
                    i1 -= k7 * j;
                    l1 -= l7 * j;
                    j = 0;
                }
                const k8: number = i - Rasterizer3D.centerY;
                l4 += j5 * k8;
                k5 += i6 * k8;
                j6 += l6 * k8;
                if (i !== j && i8 < i7 || i === j && i8 > k7) {
                    k -= j;
                    j -= i;
                    i = Rasterizer3D.lineOffsets[i];
                    while ((--j >= 0)) {{
                        Rasterizer3D.method508(Rasterizer.pixels, ai, 0, 0, i, j1 >> 16, l >> 16, i2 >> 8, k1 >> 8, l4, k5, j6, i5, l5, k6);
                        j1 += i8;
                        l += i7;
                        i2 += j8;
                        k1 += j7;
                        i += Rasterizer.width;
                        l4 += j5;
                        k5 += i6;
                        j6 += l6;
                    }}
                    while ((--k >= 0)) {{
                        Rasterizer3D.method508(Rasterizer.pixels, ai, 0, 0, i, j1 >> 16, i1 >> 16, i2 >> 8, l1 >> 8, l4, k5, j6, i5, l5, k6);
                        j1 += i8;
                        i1 += k7;
                        i2 += j8;
                        l1 += l7;
                        i += Rasterizer.width;
                        l4 += j5;
                        k5 += i6;
                        j6 += l6;
                    }}
                    return;
                }
                k -= j;
                j -= i;
                i = Rasterizer3D.lineOffsets[i];
                while ((--j >= 0)) {{
                    Rasterizer3D.method508(Rasterizer.pixels, ai, 0, 0, i, l >> 16, j1 >> 16, k1 >> 8, i2 >> 8, l4, k5, j6, i5, l5, k6);
                    j1 += i8;
                    l += i7;
                    i2 += j8;
                    k1 += j7;
                    i += Rasterizer.width;
                    l4 += j5;
                    k5 += i6;
                    j6 += l6;
                }}
                while ((--k >= 0)) {{
                    Rasterizer3D.method508(Rasterizer.pixels, ai, 0, 0, i, i1 >> 16, j1 >> 16, l1 >> 8, i2 >> 8, l4, k5, j6, i5, l5, k6);
                    j1 += i8;
                    i1 += k7;
                    i2 += j8;
                    l1 += l7;
                    i += Rasterizer.width;
                    l4 += j5;
                    k5 += i6;
                    j6 += l6;
                }}
                return;
            }
            i1 = l <<= 16;
            l1 = k1 <<= 16;
            if (i < 0) {
                i1 -= i8 * i;
                l -= i7 * i;
                l1 -= j8 * i;
                k1 -= j7 * i;
                i = 0;
            }
            j1 <<= 16;
            i2 <<= 16;
            if (k < 0) {
                j1 -= k7 * k;
                i2 -= l7 * k;
                k = 0;
            }
            const l8: number = i - Rasterizer3D.centerY;
            l4 += j5 * l8;
            k5 += i6 * l8;
            j6 += l6 * l8;
            if (i !== k && i8 < i7 || i === k && k7 > i7) {
                j -= k;
                k -= i;
                i = Rasterizer3D.lineOffsets[i];
                while ((--k >= 0)) {{
                    Rasterizer3D.method508(Rasterizer.pixels, ai, 0, 0, i, i1 >> 16, l >> 16, l1 >> 8, k1 >> 8, l4, k5, j6, i5, l5, k6);
                    i1 += i8;
                    l += i7;
                    l1 += j8;
                    k1 += j7;
                    i += Rasterizer.width;
                    l4 += j5;
                    k5 += i6;
                    j6 += l6;
                }}
                while ((--j >= 0)) {{
                    Rasterizer3D.method508(Rasterizer.pixels, ai, 0, 0, i, j1 >> 16, l >> 16, i2 >> 8, k1 >> 8, l4, k5, j6, i5, l5, k6);
                    j1 += k7;
                    l += i7;
                    i2 += l7;
                    k1 += j7;
                    i += Rasterizer.width;
                    l4 += j5;
                    k5 += i6;
                    j6 += l6;
                }}
                return;
            }
            j -= k;
            k -= i;
            i = Rasterizer3D.lineOffsets[i];
            while ((--k >= 0)) {{
                Rasterizer3D.method508(Rasterizer.pixels, ai, 0, 0, i, l >> 16, i1 >> 16, k1 >> 8, l1 >> 8, l4, k5, j6, i5, l5, k6);
                i1 += i8;
                l += i7;
                l1 += j8;
                k1 += j7;
                i += Rasterizer.width;
                l4 += j5;
                k5 += i6;
                j6 += l6;
            }}
            while ((--j >= 0)) {{
                Rasterizer3D.method508(Rasterizer.pixels, ai, 0, 0, i, l >> 16, j1 >> 16, k1 >> 8, i2 >> 8, l4, k5, j6, i5, l5, k6);
                j1 += k7;
                l += i7;
                i2 += l7;
                k1 += j7;
                i += Rasterizer.width;
                l4 += j5;
                k5 += i6;
                j6 += l6;
            }}
            return;
        }
        if (j <= k) {
            if (j >= Rasterizer.bottomY) { return; }
            if (k > Rasterizer.bottomY) { k = Rasterizer.bottomY; }
            if (i > Rasterizer.bottomY) { i = Rasterizer.bottomY; }
            if (k < i) {
                l = i1 <<= 16;
                k1 = l1 <<= 16;
                if (j < 0) {
                    l -= i7 * j;
                    i1 -= k7 * j;
                    k1 -= j7 * j;
                    l1 -= l7 * j;
                    j = 0;
                }
                j1 <<= 16;
                i2 <<= 16;
                if (k < 0) {
                    j1 -= i8 * k;
                    i2 -= j8 * k;
                    k = 0;
                }
                const i9: number = j - Rasterizer3D.centerY;
                l4 += j5 * i9;
                k5 += i6 * i9;
                j6 += l6 * i9;
                if (j !== k && i7 < k7 || j === k && i7 > i8) {
                    i -= k;
                    k -= j;
                    j = Rasterizer3D.lineOffsets[j];
                    while ((--k >= 0)) {{
                        Rasterizer3D.method508(Rasterizer.pixels, ai, 0, 0, j, l >> 16, i1 >> 16, k1 >> 8, l1 >> 8, l4, k5, j6, i5, l5, k6);
                        l += i7;
                        i1 += k7;
                        k1 += j7;
                        l1 += l7;
                        j += Rasterizer.width;
                        l4 += j5;
                        k5 += i6;
                        j6 += l6;
                    }}
                    while ((--i >= 0)) {{
                        Rasterizer3D.method508(Rasterizer.pixels, ai, 0, 0, j, l >> 16, j1 >> 16, k1 >> 8, i2 >> 8, l4, k5, j6, i5, l5, k6);
                        l += i7;
                        j1 += i8;
                        k1 += j7;
                        i2 += j8;
                        j += Rasterizer.width;
                        l4 += j5;
                        k5 += i6;
                        j6 += l6;
                    }}
                    return;
                }
                i -= k;
                k -= j;
                j = Rasterizer3D.lineOffsets[j];
                while ((--k >= 0)) {{
                    Rasterizer3D.method508(Rasterizer.pixels, ai, 0, 0, j, i1 >> 16, l >> 16, l1 >> 8, k1 >> 8, l4, k5, j6, i5, l5, k6);
                    l += i7;
                    i1 += k7;
                    k1 += j7;
                    l1 += l7;
                    j += Rasterizer.width;
                    l4 += j5;
                    k5 += i6;
                    j6 += l6;
                }}
                while ((--i >= 0)) {{
                    Rasterizer3D.method508(Rasterizer.pixels, ai, 0, 0, j, j1 >> 16, l >> 16, i2 >> 8, k1 >> 8, l4, k5, j6, i5, l5, k6);
                    l += i7;
                    j1 += i8;
                    k1 += j7;
                    i2 += j8;
                    j += Rasterizer.width;
                    l4 += j5;
                    k5 += i6;
                    j6 += l6;
                }}
                return;
            }
            j1 = i1 <<= 16;
            i2 = l1 <<= 16;
            if (j < 0) {
                j1 -= i7 * j;
                i1 -= k7 * j;
                i2 -= j7 * j;
                l1 -= l7 * j;
                j = 0;
            }
            l <<= 16;
            k1 <<= 16;
            if (i < 0) {
                l -= i8 * i;
                k1 -= j8 * i;
                i = 0;
            }
            const j9: number = j - Rasterizer3D.centerY;
            l4 += j5 * j9;
            k5 += i6 * j9;
            j6 += l6 * j9;
            if (i7 < k7) {
                k -= i;
                i -= j;
                j = Rasterizer3D.lineOffsets[j];
                while ((--i >= 0)) {{
                    Rasterizer3D.method508(Rasterizer.pixels, ai, 0, 0, j, j1 >> 16, i1 >> 16, i2 >> 8, l1 >> 8, l4, k5, j6, i5, l5, k6);
                    j1 += i7;
                    i1 += k7;
                    i2 += j7;
                    l1 += l7;
                    j += Rasterizer.width;
                    l4 += j5;
                    k5 += i6;
                    j6 += l6;
                }}
                while ((--k >= 0)) {{
                    Rasterizer3D.method508(Rasterizer.pixels, ai, 0, 0, j, l >> 16, i1 >> 16, k1 >> 8, l1 >> 8, l4, k5, j6, i5, l5, k6);
                    l += i8;
                    i1 += k7;
                    k1 += j8;
                    l1 += l7;
                    j += Rasterizer.width;
                    l4 += j5;
                    k5 += i6;
                    j6 += l6;
                }}
                return;
            }
            k -= i;
            i -= j;
            j = Rasterizer3D.lineOffsets[j];
            while ((--i >= 0)) {{
                Rasterizer3D.method508(Rasterizer.pixels, ai, 0, 0, j, i1 >> 16, j1 >> 16, l1 >> 8, i2 >> 8, l4, k5, j6, i5, l5, k6);
                j1 += i7;
                i1 += k7;
                i2 += j7;
                l1 += l7;
                j += Rasterizer.width;
                l4 += j5;
                k5 += i6;
                j6 += l6;
            }}
            while ((--k >= 0)) {{
                Rasterizer3D.method508(Rasterizer.pixels, ai, 0, 0, j, i1 >> 16, l >> 16, l1 >> 8, k1 >> 8, l4, k5, j6, i5, l5, k6);
                l += i8;
                i1 += k7;
                k1 += j8;
                l1 += l7;
                j += Rasterizer.width;
                l4 += j5;
                k5 += i6;
                j6 += l6;
            }}
            return;
        }
        if (k >= Rasterizer.bottomY) { return; }
        if (i > Rasterizer.bottomY) { i = Rasterizer.bottomY; }
        if (j > Rasterizer.bottomY) { j = Rasterizer.bottomY; }
        if (i < j) {
            i1 = j1 <<= 16;
            l1 = i2 <<= 16;
            if (k < 0) {
                i1 -= k7 * k;
                j1 -= i8 * k;
                l1 -= l7 * k;
                i2 -= j8 * k;
                k = 0;
            }
            l <<= 16;
            k1 <<= 16;
            if (i < 0) {
                l -= i7 * i;
                k1 -= j7 * i;
                i = 0;
            }
            const k9: number = k - Rasterizer3D.centerY;
            l4 += j5 * k9;
            k5 += i6 * k9;
            j6 += l6 * k9;
            if (k7 < i8) {
                j -= i;
                i -= k;
                k = Rasterizer3D.lineOffsets[k];
                while ((--i >= 0)) {{
                    Rasterizer3D.method508(Rasterizer.pixels, ai, 0, 0, k, i1 >> 16, j1 >> 16, l1 >> 8, i2 >> 8, l4, k5, j6, i5, l5, k6);
                    i1 += k7;
                    j1 += i8;
                    l1 += l7;
                    i2 += j8;
                    k += Rasterizer.width;
                    l4 += j5;
                    k5 += i6;
                    j6 += l6;
                }}
                while ((--j >= 0)) {{
                    Rasterizer3D.method508(Rasterizer.pixels, ai, 0, 0, k, i1 >> 16, l >> 16, l1 >> 8, k1 >> 8, l4, k5, j6, i5, l5, k6);
                    i1 += k7;
                    l += i7;
                    l1 += l7;
                    k1 += j7;
                    k += Rasterizer.width;
                    l4 += j5;
                    k5 += i6;
                    j6 += l6;
                }}
                return;
            }
            j -= i;
            i -= k;
            k = Rasterizer3D.lineOffsets[k];
            while ((--i >= 0)) {{
                Rasterizer3D.method508(Rasterizer.pixels, ai, 0, 0, k, j1 >> 16, i1 >> 16, i2 >> 8, l1 >> 8, l4, k5, j6, i5, l5, k6);
                i1 += k7;
                j1 += i8;
                l1 += l7;
                i2 += j8;
                k += Rasterizer.width;
                l4 += j5;
                k5 += i6;
                j6 += l6;
            }}
            while ((--j >= 0)) {{
                Rasterizer3D.method508(Rasterizer.pixels, ai, 0, 0, k, l >> 16, i1 >> 16, k1 >> 8, l1 >> 8, l4, k5, j6, i5, l5, k6);
                i1 += k7;
                l += i7;
                l1 += l7;
                k1 += j7;
                k += Rasterizer.width;
                l4 += j5;
                k5 += i6;
                j6 += l6;
            }}
            return;
        }
        l = j1 <<= 16;
        k1 = i2 <<= 16;
        if (k < 0) {
            l -= k7 * k;
            j1 -= i8 * k;
            k1 -= l7 * k;
            i2 -= j8 * k;
            k = 0;
        }
        i1 <<= 16;
        l1 <<= 16;
        if (j < 0) {
            i1 -= i7 * j;
            l1 -= j7 * j;
            j = 0;
        }
        const l9: number = k - Rasterizer3D.centerY;
        l4 += j5 * l9;
        k5 += i6 * l9;
        j6 += l6 * l9;
        if (k7 < i8) {
            i -= j;
            j -= k;
            k = Rasterizer3D.lineOffsets[k];
            while ((--j >= 0)) {{
                Rasterizer3D.method508(Rasterizer.pixels, ai, 0, 0, k, l >> 16, j1 >> 16, k1 >> 8, i2 >> 8, l4, k5, j6, i5, l5, k6);
                l += k7;
                j1 += i8;
                k1 += l7;
                i2 += j8;
                k += Rasterizer.width;
                l4 += j5;
                k5 += i6;
                j6 += l6;
            }}
            while ((--i >= 0)) {{
                Rasterizer3D.method508(Rasterizer.pixels, ai, 0, 0, k, i1 >> 16, j1 >> 16, l1 >> 8, i2 >> 8, l4, k5, j6, i5, l5, k6);
                i1 += i7;
                j1 += i8;
                l1 += j7;
                i2 += j8;
                k += Rasterizer.width;
                l4 += j5;
                k5 += i6;
                j6 += l6;
            }}
            return;
        }
        i -= j;
        j -= k;
        k = Rasterizer3D.lineOffsets[k];
        while ((--j >= 0)) {{
            Rasterizer3D.method508(Rasterizer.pixels, ai, 0, 0, k, j1 >> 16, l >> 16, i2 >> 8, k1 >> 8, l4, k5, j6, i5, l5, k6);
            l += k7;
            j1 += i8;
            k1 += l7;
            i2 += j8;
            k += Rasterizer.width;
            l4 += j5;
            k5 += i6;
            j6 += l6;
        }}
        while ((--i >= 0)) {{
            Rasterizer3D.method508(Rasterizer.pixels, ai, 0, 0, k, j1 >> 16, i1 >> 16, i2 >> 8, l1 >> 8, l4, k5, j6, i5, l5, k6);
            i1 += i7;
            j1 += i8;
            l1 += j7;
            i2 += j8;
            k += Rasterizer.width;
            l4 += j5;
            k5 += i6;
            j6 += l6;
        }}
    }

    public static method508(ai: number[], ai1: number[], i: number, j: number, k: number, l: number, i1: number, j1: number, k1: number, l1: number, i2: number, j2: number, k2: number, l2: number, i3: number) {
        if (l >= i1) { return; }
        let j3: number;
        let k3: number;
        if (Rasterizer3D.aBoolean1528) {
            j3 = ((k1 - j1) / (i1 - l) | 0);
            if (i1 > Rasterizer.virtualBottomX) { i1 = Rasterizer.virtualBottomX; }
            if (l < 0) {
                j1 -= l * j3;
                l = 0;
            }
            if (l >= i1) { return; }
            k3 = i1 - l >> 3;
            j3 <<= 12;
            j1 <<= 9;
        } else {
            if (i1 - l > 7) {
                k3 = i1 - l >> 3;
                j3 = (k1 - j1) * Rasterizer3D.anIntArray1534[k3] >> 6;
            } else {
                k3 = 0;
                j3 = 0;
            }
            j1 <<= 9;
        }
        k += l;
        if (Rasterizer3D.lowMemory) {
            let i4: number = 0;
            let k4: number = 0;
            const k6: number = l - Rasterizer3D.centerX;
            l1 += (k2 >> 3) * k6;
            i2 += (l2 >> 3) * k6;
            j2 += (i3 >> 3) * k6;
            let i5: number = j2 >> 12;
            if (i5 !== 0) {
                i = (l1 / i5 | 0);
                j = (i2 / i5 | 0);
                if (i < 0) { i = 0; } else if (i > 4032) { i = 4032; }
            }
            l1 += k2;
            i2 += l2;
            j2 += i3;
            i5 = j2 >> 12;
            if (i5 !== 0) {
                i4 = (l1 / i5 | 0);
                k4 = (i2 / i5 | 0);
                if (i4 < 7) { i4 = 7; } else if (i4 > 4032) { i4 = 4032; }
            }
            let i7: number = i4 - i >> 3;
            let k7: number = k4 - j >> 3;
            i += (j1 & 6291456) >> 3;
            let i8: number = j1 >> 23;
            if (Rasterizer3D.aBoolean1529) {
                while ((k3-- > 0)) {{
                    ai[k++] = ai1[(j & 4032) + (i >> 6)] >>> i8;
                    i += i7;
                    j += k7;
                    ai[k++] = ai1[(j & 4032) + (i >> 6)] >>> i8;
                    i += i7;
                    j += k7;
                    ai[k++] = ai1[(j & 4032) + (i >> 6)] >>> i8;
                    i += i7;
                    j += k7;
                    ai[k++] = ai1[(j & 4032) + (i >> 6)] >>> i8;
                    i += i7;
                    j += k7;
                    ai[k++] = ai1[(j & 4032) + (i >> 6)] >>> i8;
                    i += i7;
                    j += k7;
                    ai[k++] = ai1[(j & 4032) + (i >> 6)] >>> i8;
                    i += i7;
                    j += k7;
                    ai[k++] = ai1[(j & 4032) + (i >> 6)] >>> i8;
                    i += i7;
                    j += k7;
                    ai[k++] = ai1[(j & 4032) + (i >> 6)] >>> i8;
                    i = i4;
                    j = k4;
                    l1 += k2;
                    i2 += l2;
                    j2 += i3;
                    const j5: number = j2 >> 12;
                    if (j5 !== 0) {
                        i4 = (l1 / j5 | 0);
                        k4 = (i2 / j5 | 0);
                        if (i4 < 7) { i4 = 7; } else if (i4 > 4032) { i4 = 4032; }
                    }
                    i7 = i4 - i >> 3;
                    k7 = k4 - j >> 3;
                    j1 += j3;
                    i += (j1 & 6291456) >> 3;
                    i8 = j1 >> 23;
                }}
                for (k3 = i1 - l & 7; k3-- > 0; ) {{
                    ai[k++] = ai1[(j & 4032) + (i >> 6)] >>> i8;
                    i += i7;
                    j += k7;
                }}
                return;
            }
            while ((k3-- > 0)) {{
                let k8: number;
                if ((k8 = ai1[(j & 4032) + (i >> 6)] >>> i8) !== 0) { ai[k] = k8; }
                k++;
                i += i7;
                j += k7;
                if ((k8 = ai1[(j & 4032) + (i >> 6)] >>> i8) !== 0) { ai[k] = k8; }
                k++;
                i += i7;
                j += k7;
                if ((k8 = ai1[(j & 4032) + (i >> 6)] >>> i8) !== 0) { ai[k] = k8; }
                k++;
                i += i7;
                j += k7;
                if ((k8 = ai1[(j & 4032) + (i >> 6)] >>> i8) !== 0) { ai[k] = k8; }
                k++;
                i += i7;
                j += k7;
                if ((k8 = ai1[(j & 4032) + (i >> 6)] >>> i8) !== 0) { ai[k] = k8; }
                k++;
                i += i7;
                j += k7;
                if ((k8 = ai1[(j & 4032) + (i >> 6)] >>> i8) !== 0) { ai[k] = k8; }
                k++;
                i += i7;
                j += k7;
                if ((k8 = ai1[(j & 4032) + (i >> 6)] >>> i8) !== 0) { ai[k] = k8; }
                k++;
                i += i7;
                j += k7;
                if ((k8 = ai1[(j & 4032) + (i >> 6)] >>> i8) !== 0) { ai[k] = k8; }
                k++;
                i = i4;
                j = k4;
                l1 += k2;
                i2 += l2;
                j2 += i3;
                const k5: number = j2 >> 12;
                if (k5 !== 0) {
                    i4 = (l1 / k5 | 0);
                    k4 = (i2 / k5 | 0);
                    if (i4 < 7) { i4 = 7; } else if (i4 > 4032) { i4 = 4032; }
                }
                i7 = i4 - i >> 3;
                k7 = k4 - j >> 3;
                j1 += j3;
                i += (j1 & 6291456) >> 3;
                i8 = j1 >> 23;
            }}
            for (k3 = i1 - l & 7; k3-- > 0; ) {{
                let l8: number;
                if ((l8 = ai1[(j & 4032) + (i >> 6)] >>> i8) !== 0) { ai[k] = l8; }
                k++;
                i += i7;
                j += k7;
            }}
            return;
        }
        let j4: number = 0;
        let l4: number = 0;
        const l6: number = l - Rasterizer3D.centerX;
        l1 += (k2 >> 3) * l6;
        i2 += (l2 >> 3) * l6;
        j2 += (i3 >> 3) * l6;
        let l5: number = j2 >> 14;
        if (l5 !== 0) {
            i = (l1 / l5 | 0);
            j = (i2 / l5 | 0);
            if (i < 0) { i = 0; } else if (i > 16256) { i = 16256; }
        }
        l1 += k2;
        i2 += l2;
        j2 += i3;
        l5 = j2 >> 14;
        if (l5 !== 0) {
            j4 = (l1 / l5 | 0);
            l4 = (i2 / l5 | 0);
            if (j4 < 7) { j4 = 7; } else if (j4 > 16256) { j4 = 16256; }
        }
        let j7: number = j4 - i >> 3;
        let l7: number = l4 - j >> 3;
        i += j1 & 6291456;
        let j8: number = j1 >> 23;
        if (Rasterizer3D.aBoolean1529) {
            while ((k3-- > 0)) {{
                ai[k++] = ai1[(j & 16256) + (i >> 7)] >>> j8;
                i += j7;
                j += l7;
                ai[k++] = ai1[(j & 16256) + (i >> 7)] >>> j8;
                i += j7;
                j += l7;
                ai[k++] = ai1[(j & 16256) + (i >> 7)] >>> j8;
                i += j7;
                j += l7;
                ai[k++] = ai1[(j & 16256) + (i >> 7)] >>> j8;
                i += j7;
                j += l7;
                ai[k++] = ai1[(j & 16256) + (i >> 7)] >>> j8;
                i += j7;
                j += l7;
                ai[k++] = ai1[(j & 16256) + (i >> 7)] >>> j8;
                i += j7;
                j += l7;
                ai[k++] = ai1[(j & 16256) + (i >> 7)] >>> j8;
                i += j7;
                j += l7;
                ai[k++] = ai1[(j & 16256) + (i >> 7)] >>> j8;
                i = j4;
                j = l4;
                l1 += k2;
                i2 += l2;
                j2 += i3;
                const i6: number = j2 >> 14;
                if (i6 !== 0) {
                    j4 = (l1 / i6 | 0);
                    l4 = (i2 / i6 | 0);
                    if (j4 < 7) { j4 = 7; } else if (j4 > 16256) { j4 = 16256; }
                }
                j7 = j4 - i >> 3;
                l7 = l4 - j >> 3;
                j1 += j3;
                i += j1 & 6291456;
                j8 = j1 >> 23;
            }}
            for (k3 = i1 - l & 7; k3-- > 0; ) {{
                ai[k++] = ai1[(j & 16256) + (i >> 7)] >>> j8;
                i += j7;
                j += l7;
            }}
            return;
        }
        while ((k3-- > 0)) {{
            let i9: number;
            if ((i9 = ai1[(j & 16256) + (i >> 7)] >>> j8) !== 0) { ai[k] = i9; }
            k++;
            i += j7;
            j += l7;
            if ((i9 = ai1[(j & 16256) + (i >> 7)] >>> j8) !== 0) { ai[k] = i9; }
            k++;
            i += j7;
            j += l7;
            if ((i9 = ai1[(j & 16256) + (i >> 7)] >>> j8) !== 0) { ai[k] = i9; }
            k++;
            i += j7;
            j += l7;
            if ((i9 = ai1[(j & 16256) + (i >> 7)] >>> j8) !== 0) { ai[k] = i9; }
            k++;
            i += j7;
            j += l7;
            if ((i9 = ai1[(j & 16256) + (i >> 7)] >>> j8) !== 0) { ai[k] = i9; }
            k++;
            i += j7;
            j += l7;
            if ((i9 = ai1[(j & 16256) + (i >> 7)] >>> j8) !== 0) { ai[k] = i9; }
            k++;
            i += j7;
            j += l7;
            if ((i9 = ai1[(j & 16256) + (i >> 7)] >>> j8) !== 0) { ai[k] = i9; }
            k++;
            i += j7;
            j += l7;
            if ((i9 = ai1[(j & 16256) + (i >> 7)] >>> j8) !== 0) { ai[k] = i9; }
            k++;
            i = j4;
            j = l4;
            l1 += k2;
            i2 += l2;
            j2 += i3;
            const j6: number = j2 >> 14;
            if (j6 !== 0) {
                j4 = (l1 / j6 | 0);
                l4 = (i2 / j6 | 0);
                if (j4 < 7) { j4 = 7; } else if (j4 > 16256) { j4 = 16256; }
            }
            j7 = j4 - i >> 3;
            l7 = l4 - j >> 3;
            j1 += j3;
            i += j1 & 6291456;
            j8 = j1 >> 23;
        }}
        for (let l3: number = i1 - l & 7; l3-- > 0; ) {{
            let j9: number;
            if ((j9 = ai1[(j & 16256) + (i >> 7)] >>> j8) !== 0) { ai[k] = j9; }
            k++;
            i += j7;
            j += l7;
        }}
    }

    public static __static_initializer_0() {
        for (let i: number = 1; i < 512; i++) {Rasterizer3D.anIntArray1534[i] = (32768 / i | 0); }
        for (let j: number = 1; j < 2048; j++) {Rasterizer3D.anIntArray1535[j] = (65536 / j | 0); }
        for (let k: number = 0; k < 2048; k++) {{
            Rasterizer3D.SINE[k] = (((65536.0 * Math.sin(k * 0.0030679615)) as number) | 0);
            Rasterizer3D.COSINE[k] = (((65536.0 * Math.cos(k * 0.0030679615)) as number) | 0);
        }}
    }
}

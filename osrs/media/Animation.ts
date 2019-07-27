import { Buffer } from "../net/Buffer";
import { Skins } from "./Skins";

export class Animation {
    public static cache: Animation[] = null;

    public static aBooleanArray438: boolean[] = null;

    public static method235(i: number) {
        Animation.cache = ((s) => { const a = []; while (s-- > 0) { a.push(null); } return a; })(i + 1);
        Animation.aBooleanArray438 = ((s) => { const a = []; while (s-- > 0) { a.push(false); } return a; })(i + 1);
        for (let j: number = 0; j < i + 1; j++) {Animation.aBooleanArray438[j] = true; }
    }

    public static method236(bs: number[]) {
        const buffer: Buffer = new Buffer(bs);
        buffer.currentPosition = bs.length - 8;
        const i: number = buffer.getUnsignedLEShort();
        const j: number = buffer.getUnsignedLEShort();
        const k: number = buffer.getUnsignedLEShort();
        const l: number = buffer.getUnsignedLEShort();
        let i1: number = 0;
        const buffer_5_: Buffer = new Buffer(bs);
        buffer_5_.currentPosition = i1;
        i1 += i + 2;
        const class50_sub1_sub2_2: Buffer = new Buffer(bs);
        class50_sub1_sub2_2.currentPosition = i1;
        i1 += j;
        const class50_sub1_sub2_3: Buffer = new Buffer(bs);
        class50_sub1_sub2_3.currentPosition = i1;
        i1 += k;
        const class50_sub1_sub2_4: Buffer = new Buffer(bs);
        class50_sub1_sub2_4.currentPosition = i1;
        i1 += l;
        const buffer_9_: Buffer = new Buffer(bs);
        buffer_9_.currentPosition = i1;
        const skins: Skins = new Skins(buffer_9_);
        const animationAmount: number = buffer_5_.getUnsignedLEShort();
        const ai: number[] = ((s) => { const a = []; while (s-- > 0) { a.push(0); } return a; })(500);
        const ai1: number[] = ((s) => { const a = []; while (s-- > 0) { a.push(0); } return a; })(500);
        const ai2: number[] = ((s) => { const a = []; while (s-- > 0) { a.push(0); } return a; })(500);
        const ai3: number[] = ((s) => { const a = []; while (s-- > 0) { a.push(0); } return a; })(500);
        for (let k1: number = 0; k1 < animationAmount; k1++) {{
            const l1: number = buffer_5_.getUnsignedLEShort();
            const animation: Animation = Animation.cache[l1] = new Animation();
            animation.anInt431 = class50_sub1_sub2_4.getUnsignedByte();
            animation.animationSkins = skins;
            const i2: number = buffer_5_.getUnsignedByte();
            let j2: number = -1;
            let k2: number = 0;
            for (let l2: number = 0; l2 < i2; l2++) {{
                const i3: number = class50_sub1_sub2_2.getUnsignedByte();
                if (i3 > 0) {
                    if (skins.opcodes[l2] !== 0) {
                        for (let k3: number = l2 - 1; k3 > j2; k3--) {{
                            if (skins.opcodes[k3] !== 0) { continue; }
                            ai[k2] = k3;
                            ai1[k2] = 0;
                            ai2[k2] = 0;
                            ai3[k2] = 0;
                            k2++;
                            break;
                        }}
                    }
                    ai[k2] = l2;
                    let c: string = "\u0000";
                    if (skins.opcodes[l2] === 3) { c = "\u0080"; }
                    if ((i3 & 1) !== 0) { ai1[k2] = class50_sub1_sub2_3.getSignedSmart(); } else { ai1[k2] = (c).charCodeAt(0); }
                    if ((i3 & 2) !== 0) { ai2[k2] = class50_sub1_sub2_3.getSignedSmart(); } else { ai2[k2] = (c).charCodeAt(0); }
                    if ((i3 & 4) !== 0) { ai3[k2] = class50_sub1_sub2_3.getSignedSmart(); } else { ai3[k2] = (c).charCodeAt(0); }
                    j2 = l2;
                    k2++;
                    if (skins.opcodes[l2] === 5) { Animation.aBooleanArray438[l1] = false; }
                }
            }}
            animation.anInt433 = k2;
            animation.opcodeTable = ((s) => { const a = []; while (s-- > 0) { a.push(0); } return a; })(k2);
            animation.modifier1 = ((s) => { const a = []; while (s-- > 0) { a.push(0); } return a; })(k2);
            animation.modifier2 = ((s) => { const a = []; while (s-- > 0) { a.push(0); } return a; })(k2);
            animation.modifier3 = ((s) => { const a = []; while (s-- > 0) { a.push(0); } return a; })(k2);
            for (let j3: number = 0; j3 < k2; j3++) {{
                animation.opcodeTable[j3] = ai[j3];
                animation.modifier1[j3] = ai1[j3];
                animation.modifier2[j3] = ai2[j3];
                animation.modifier3[j3] = ai3[j3];
            }}
        }}
    }

    public static reset() {
        Animation.cache = null;
    }

    public static getAnimation(animationId: number): Animation {
        if (Animation.cache == null) { return null; } else { return Animation.cache[animationId]; }
    }

    public static exists(i: number): boolean {
        return i === -1;
    }

    public anInt431: number;

    public animationSkins: Skins;

    public anInt433: number;

    public opcodeTable: number[];

    public modifier1: number[];

    public modifier2: number[];

    public modifier3: number[];

    public constructor() {
        if (this.anInt431 === undefined) { this.anInt431 = 0; }
        if (this.animationSkins === undefined) { this.animationSkins = null; }
        if (this.anInt433 === undefined) { this.anInt433 = 0; }
        if (this.opcodeTable === undefined) { this.opcodeTable = null; }
        if (this.modifier1 === undefined) { this.modifier1 = null; }
        if (this.modifier2 === undefined) { this.modifier2 = null; }
        if (this.modifier3 === undefined) { this.modifier3 = null; }
    }
}

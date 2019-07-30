import { Bzip2Context } from "./Bzip2Context";

export class BZip2Decompressor {
    public static state: Bzip2Context;
    public static state_$LI$(): Bzip2Context {
        if (BZip2Decompressor.state == null) {
            BZip2Decompressor.state = new Bzip2Context();
        }
        return BZip2Decompressor.state;
    }

    public static decompress$byte_A$int$byte_A$int$int(
        output: number[],
        lenght: number,
        compressed: number[],
        decompressedLength: number,
        minLen: number
    ): number {
        BZip2Decompressor.state_$LI$().compressed = compressed;
        BZip2Decompressor.state_$LI$().nextIn = minLen;
        BZip2Decompressor.state_$LI$().decompressed = output;
        BZip2Decompressor.state_$LI$().nextOut = 0;
        BZip2Decompressor.state_$LI$().decompressedLength = decompressedLength;
        BZip2Decompressor.state_$LI$().lenght = lenght;
        BZip2Decompressor.state_$LI$().bsLive = 0;
        BZip2Decompressor.state_$LI$().bsBuff = 0;
        BZip2Decompressor.state_$LI$().totalInLo32 = 0;
        BZip2Decompressor.state_$LI$().totalInHi32 = 0;
        BZip2Decompressor.state_$LI$().totalOutLo32 = 0;
        BZip2Decompressor.state_$LI$().totalOutHigh32 = 0;
        BZip2Decompressor.state_$LI$().currentBlock = 0;
        BZip2Decompressor.decompress$com_jagex_runescape_cache_bzip_Bzip2Context(BZip2Decompressor.state_$LI$());
        lenght -= BZip2Decompressor.state_$LI$().lenght;
        return lenght;
    }

    public static decompress(output?: any, lenght?: any, compressed?: any, decompressedLength?: any, minLen?: any): any {
        if (
            ((output != null &&
                ((output instanceof Array) as any) &&
                (output.length == 0 || output[0] == null || typeof output[0] === "number")) ||
                output === null) &&
            (typeof lenght === "number" || lenght === null) &&
            ((compressed != null &&
                ((compressed instanceof Array) as any) &&
                (compressed.length == 0 || compressed[0] == null || typeof compressed[0] === "number")) ||
                compressed === null) &&
            (typeof decompressedLength === "number" || decompressedLength === null) &&
            (typeof minLen === "number" || minLen === null)
        ) {
            return BZip2Decompressor.decompress$byte_A$int$byte_A$int$int(output, lenght, compressed, decompressedLength, minLen) as any;
        } else if (
            ((output != null && ((output instanceof Bzip2Context) as any)) || output === null) &&
            lenght === undefined &&
            compressed === undefined &&
            decompressedLength === undefined &&
            minLen === undefined
        ) {
            return BZip2Decompressor.decompress$com_jagex_runescape_cache_bzip_Bzip2Context(output) as any;
        } else {
            throw new Error("invalid overload");
        }
    }

    public static method313(bzip2Context: Bzip2Context) {
        let byte4: number = bzip2Context.aByte57;
        let i: number = bzip2Context.anInt58;
        let j: number = bzip2Context.anInt68;
        let k: number = bzip2Context.anInt66;
        const ai: number[] = Bzip2Context.anIntArray71;
        let l: number = bzip2Context.anInt65;
        const abyte0: number[] = bzip2Context.decompressed;
        let i1: number = bzip2Context.nextOut;
        let j1: number = bzip2Context.lenght;
        const k1: number = j1;
        const l1: number = bzip2Context.anInt85 + 1;
        label0: do {
            {
                if (i > 0) {
                    do {
                        {
                            if (j1 === 0) {
                                break label0;
                            }
                            if (i === 1) {
                                break;
                            }
                            abyte0[i1] = byte4;
                            i--;
                            i1++;
                            j1--;
                        }
                    } while (true);
                    if (j1 === 0) {
                        i = 1;
                        break;
                    }
                    abyte0[i1] = byte4;
                    i1++;
                    j1--;
                }
                let flag: boolean = true;
                while (flag) {
                    {
                        flag = false;
                        if (j === l1) {
                            i = 0;
                            break label0;
                        }
                        byte4 = (k as number) | 0;
                        l = ai[l];
                        const byte0: number = ((l & 255) as number) | 0;
                        l >>= 8;
                        j++;
                        if (byte0 !== k) {
                            k = byte0;
                            if (j1 === 0) {
                                i = 1;
                            } else {
                                abyte0[i1] = byte4;
                                i1++;
                                j1--;
                                flag = true;
                                continue;
                            }
                            break label0;
                        }
                        if (j !== l1) {
                            continue;
                        }
                        if (j1 === 0) {
                            i = 1;
                            break label0;
                        }
                        abyte0[i1] = byte4;
                        i1++;
                        j1--;
                        flag = true;
                    }
                }
                i = 2;
                l = ai[l];
                const byte1: number = ((l & 255) as number) | 0;
                l >>= 8;
                if (++j !== l1) {
                    if (byte1 !== k) {
                        k = byte1;
                    } else {
                        i = 3;
                        l = ai[l];
                        const byte2: number = ((l & 255) as number) | 0;
                        l >>= 8;
                        if (++j !== l1) {
                            if (byte2 !== k) {
                                k = byte2;
                            } else {
                                l = ai[l];
                                const byte3: number = ((l & 255) as number) | 0;
                                l >>= 8;
                                j++;
                                i = (byte3 & 255) + 4;
                                l = ai[l];
                                k = ((l & 255) as number) | 0;
                                l >>= 8;
                                j++;
                            }
                        }
                    }
                }
            }
        } while (true);
        const i2: number = bzip2Context.totalOutLo32;
        bzip2Context.totalOutLo32 += k1 - j1;
        if (bzip2Context.totalOutLo32 < i2) {
            bzip2Context.totalOutHigh32++;
        }
        bzip2Context.aByte57 = byte4;
        bzip2Context.anInt58 = i;
        bzip2Context.anInt68 = j;
        bzip2Context.anInt66 = k;
        Bzip2Context.anIntArray71 = ai;
        bzip2Context.anInt65 = l;
        bzip2Context.decompressed = abyte0;
        bzip2Context.nextOut = i1;
        bzip2Context.lenght = j1;
    }

    public static decompress$com_jagex_runescape_cache_bzip_Bzip2Context(bzip2Context: Bzip2Context) {
        let k8: number = 0;
        let ai: number[] = null;
        let ai1: number[] = null;
        let ai2: number[] = null;
        bzip2Context.anInt62 = 1;
        if (Bzip2Context.anIntArray71 == null) {
            Bzip2Context.anIntArray71 = (s => {
                const a = [];
                while (s-- > 0) {
                    a.push(0);
                }
                return a;
            })(bzip2Context.anInt62 * 100000);
        }
        let flag19: boolean = true;
        while (flag19) {
            {
                let b: number = BZip2Decompressor.method315(bzip2Context);
                if (b === 23) {
                    return;
                }
                b = BZip2Decompressor.method315(bzip2Context);
                b = BZip2Decompressor.method315(bzip2Context);
                b = BZip2Decompressor.method315(bzip2Context);
                b = BZip2Decompressor.method315(bzip2Context);
                b = BZip2Decompressor.method315(bzip2Context);
                bzip2Context.currentBlock++;
                b = BZip2Decompressor.method315(bzip2Context);
                b = BZip2Decompressor.method315(bzip2Context);
                b = BZip2Decompressor.method315(bzip2Context);
                b = BZip2Decompressor.method315(bzip2Context);
                b = BZip2Decompressor.method316(bzip2Context);
                if (b !== 0) {
                    bzip2Context.aBoolean59 = true;
                } else {
                    bzip2Context.aBoolean59 = false;
                }
                if (bzip2Context.aBoolean59) {
                    console.info("PANIC! RANDOMISED BLOCK!");
                }
                bzip2Context.anInt64 = 0;
                b = BZip2Decompressor.method315(bzip2Context);
                bzip2Context.anInt64 = (bzip2Context.anInt64 << 8) | (b & 255);
                b = BZip2Decompressor.method315(bzip2Context);
                bzip2Context.anInt64 = (bzip2Context.anInt64 << 8) | (b & 255);
                b = BZip2Decompressor.method315(bzip2Context);
                bzip2Context.anInt64 = (bzip2Context.anInt64 << 8) | (b & 255);
                for (let j: number = 0; j < 16; j++) {
                    {
                        const byte1: number = BZip2Decompressor.method316(bzip2Context);
                        if (byte1 === 1) {
                            bzip2Context.aBooleanArray74[j] = true;
                        } else {
                            bzip2Context.aBooleanArray74[j] = false;
                        }
                    }
                }
                for (let k: number = 0; k < 256; k++) {
                    bzip2Context.aBooleanArray73[k] = false;
                }
                for (let l: number = 0; l < 16; l++) {
                    if (bzip2Context.aBooleanArray74[l]) {
                        for (let i3: number = 0; i3 < 16; i3++) {
                            {
                                const byte2: number = BZip2Decompressor.method316(bzip2Context);
                                if (byte2 === 1) {
                                    bzip2Context.aBooleanArray73[l * 16 + i3] = true;
                                }
                            }
                        }
                    }
                }
                BZip2Decompressor.method318(bzip2Context);
                const i4: number = bzip2Context.anInt72 + 2;
                const j4: number = BZip2Decompressor.method317(3, bzip2Context);
                const k4: number = BZip2Decompressor.method317(15, bzip2Context);
                for (let i1: number = 0; i1 < k4; i1++) {
                    {
                        let j3: number = 0;
                        do {
                            {
                                const byte3: number = BZip2Decompressor.method316(bzip2Context);
                                if (byte3 === 0) {
                                    break;
                                }
                                j3++;
                            }
                        } while (true);
                        bzip2Context.aByteArray79[i1] = (j3 as number) | 0;
                    }
                }
                const abyte0: number[] = [0, 0, 0, 0, 0, 0];
                for (let byte16: number = 0; byte16 < j4; byte16++) {
                    abyte0[byte16] = byte16;
                }
                for (let j1: number = 0; j1 < k4; j1++) {
                    {
                        let byte17: number = bzip2Context.aByteArray79[j1];
                        const byte15: number = abyte0[byte17];
                        for (; byte17 > 0; byte17--) {
                            abyte0[byte17] = abyte0[byte17 - 1];
                        }
                        abyte0[0] = byte15;
                        bzip2Context.aByteArray78[j1] = byte15;
                    }
                }
                for (let k3: number = 0; k3 < j4; k3++) {
                    {
                        let l6: number = BZip2Decompressor.method317(5, bzip2Context);
                        for (let k1: number = 0; k1 < i4; k1++) {
                            {
                                do {
                                    {
                                        let byte4: number = BZip2Decompressor.method316(bzip2Context);
                                        if (byte4 === 0) {
                                            break;
                                        }
                                        byte4 = BZip2Decompressor.method316(bzip2Context);
                                        if (byte4 === 0) {
                                            l6++;
                                        } else {
                                            l6--;
                                        }
                                    }
                                } while (true);
                                bzip2Context.aByteArrayArray80[k3][k1] = (l6 as number) | 0;
                            }
                        }
                    }
                }
                for (let l3: number = 0; l3 < j4; l3++) {
                    {
                        let byte8: number = 32;
                        let i: number = 0;
                        for (let l1: number = 0; l1 < i4; l1++) {
                            {
                                if (bzip2Context.aByteArrayArray80[l3][l1] > i) {
                                    i = bzip2Context.aByteArrayArray80[l3][l1];
                                }
                                if (bzip2Context.aByteArrayArray80[l3][l1] < byte8) {
                                    byte8 = bzip2Context.aByteArrayArray80[l3][l1];
                                }
                            }
                        }
                        BZip2Decompressor.method319(
                            bzip2Context.anIntArrayArray81[l3],
                            bzip2Context.anIntArrayArray82[l3],
                            bzip2Context.anIntArrayArray83[l3],
                            bzip2Context.aByteArrayArray80[l3],
                            byte8,
                            i,
                            i4
                        );
                        bzip2Context.anIntArray84[l3] = byte8;
                    }
                }
                const l4: number = bzip2Context.anInt72 + 1;
                let i5: number = -1;
                let j5: number = 0;
                for (let i2: number = 0; i2 <= 255; i2++) {
                    bzip2Context.anIntArray67[i2] = 0;
                }
                let j9: number = 4095;
                for (let l8: number = 15; l8 >= 0; l8--) {
                    {
                        for (let i9: number = 15; i9 >= 0; i9--) {
                            {
                                bzip2Context.aByteArray76[j9] = ((l8 * 16 + i9) as number) | 0;
                                j9--;
                            }
                        }
                        bzip2Context.anIntArray77[l8] = j9 + 1;
                    }
                }
                let i6: number = 0;
                if (j5 === 0) {
                    i5++;
                    j5 = 50;
                    const byte12: number = bzip2Context.aByteArray78[i5];
                    k8 = bzip2Context.anIntArray84[byte12];
                    ai = bzip2Context.anIntArrayArray81[byte12];
                    ai2 = bzip2Context.anIntArrayArray83[byte12];
                    ai1 = bzip2Context.anIntArrayArray82[byte12];
                }
                j5--;
                let i7: number = k8;
                let l7: number;
                let byte9: number;
                for (l7 = BZip2Decompressor.method317(i7, bzip2Context); l7 > ai[i7]; l7 = (l7 << 1) | byte9) {
                    {
                        i7++;
                        byte9 = BZip2Decompressor.method316(bzip2Context);
                    }
                }
                for (let k5: number = ai2[l7 - ai1[i7]]; k5 !== l4; ) {
                    if (k5 === 0 || k5 === 1) {
                        let j6: number = -1;
                        let k6: number = 1;
                        do {
                            {
                                if (k5 === 0) {
                                    j6 += k6;
                                } else if (k5 === 1) {
                                    j6 += 2 * k6;
                                }
                                k6 *= 2;
                                if (j5 === 0) {
                                    i5++;
                                    j5 = 50;
                                    const byte13: number = bzip2Context.aByteArray78[i5];
                                    k8 = bzip2Context.anIntArray84[byte13];
                                    ai = bzip2Context.anIntArrayArray81[byte13];
                                    ai2 = bzip2Context.anIntArrayArray83[byte13];
                                    ai1 = bzip2Context.anIntArrayArray82[byte13];
                                }
                                j5--;
                                let j7: number = k8;
                                let i8: number;
                                let byte10: number;
                                for (i8 = BZip2Decompressor.method317(j7, bzip2Context); i8 > ai[j7]; i8 = (i8 << 1) | byte10) {
                                    {
                                        j7++;
                                        byte10 = BZip2Decompressor.method316(bzip2Context);
                                    }
                                }
                                k5 = ai2[i8 - ai1[j7]];
                            }
                        } while (k5 === 0 || k5 === 1);
                        j6++;
                        const byte5: number = bzip2Context.aByteArray75[bzip2Context.aByteArray76[bzip2Context.anIntArray77[0]] & 255];
                        bzip2Context.anIntArray67[byte5 & 255] += j6;
                        for (; j6 > 0; j6--) {
                            {
                                Bzip2Context.anIntArray71[i6] = byte5 & 255;
                                i6++;
                            }
                        }
                    } else {
                        let j11: number = k5 - 1;
                        let byte6: number;
                        if (j11 < 16) {
                            const j10: number = bzip2Context.anIntArray77[0];
                            byte6 = bzip2Context.aByteArray76[j10 + j11];
                            for (; j11 > 3; j11 -= 4) {
                                {
                                    const k11: number = j10 + j11;
                                    bzip2Context.aByteArray76[k11] = bzip2Context.aByteArray76[k11 - 1];
                                    bzip2Context.aByteArray76[k11 - 1] = bzip2Context.aByteArray76[k11 - 2];
                                    bzip2Context.aByteArray76[k11 - 2] = bzip2Context.aByteArray76[k11 - 3];
                                    bzip2Context.aByteArray76[k11 - 3] = bzip2Context.aByteArray76[k11 - 4];
                                }
                            }
                            for (; j11 > 0; j11--) {
                                bzip2Context.aByteArray76[j10 + j11] = bzip2Context.aByteArray76[j10 + j11 - 1];
                            }
                            bzip2Context.aByteArray76[j10] = byte6;
                        } else {
                            let l10: number = (j11 / 16) | 0;
                            const i11: number = j11 % 16;
                            let k10: number = bzip2Context.anIntArray77[l10] + i11;
                            byte6 = bzip2Context.aByteArray76[k10];
                            for (; k10 > bzip2Context.anIntArray77[l10]; k10--) {
                                bzip2Context.aByteArray76[k10] = bzip2Context.aByteArray76[k10 - 1];
                            }
                            bzip2Context.anIntArray77[l10]++;
                            for (; l10 > 0; l10--) {
                                {
                                    bzip2Context.anIntArray77[l10]--;
                                    bzip2Context.aByteArray76[bzip2Context.anIntArray77[l10]] =
                                        bzip2Context.aByteArray76[bzip2Context.anIntArray77[l10 - 1] + 16 - 1];
                                }
                            }
                            bzip2Context.anIntArray77[0]--;
                            bzip2Context.aByteArray76[bzip2Context.anIntArray77[0]] = byte6;
                            if (bzip2Context.anIntArray77[0] === 0) {
                                let i10: number = 4095;
                                for (let k9: number = 15; k9 >= 0; k9--) {
                                    {
                                        for (let l9: number = 15; l9 >= 0; l9--) {
                                            {
                                                bzip2Context.aByteArray76[i10] =
                                                    bzip2Context.aByteArray76[bzip2Context.anIntArray77[k9] + l9];
                                                i10--;
                                            }
                                        }
                                        bzip2Context.anIntArray77[k9] = i10 + 1;
                                    }
                                }
                            }
                        }
                        bzip2Context.anIntArray67[bzip2Context.aByteArray75[byte6 & 255] & 255]++;
                        Bzip2Context.anIntArray71[i6] = bzip2Context.aByteArray75[byte6 & 255] & 255;
                        i6++;
                        if (j5 === 0) {
                            i5++;
                            j5 = 50;
                            const byte14: number = bzip2Context.aByteArray78[i5];
                            k8 = bzip2Context.anIntArray84[byte14];
                            ai = bzip2Context.anIntArrayArray81[byte14];
                            ai2 = bzip2Context.anIntArrayArray83[byte14];
                            ai1 = bzip2Context.anIntArrayArray82[byte14];
                        }
                        j5--;
                        let k7: number = k8;
                        let j8: number;
                        let byte11: number;
                        for (j8 = BZip2Decompressor.method317(k7, bzip2Context); j8 > ai[k7]; j8 = (j8 << 1) | byte11) {
                            {
                                k7++;
                                byte11 = BZip2Decompressor.method316(bzip2Context);
                            }
                        }
                        k5 = ai2[j8 - ai1[k7]];
                    }
                }
                bzip2Context.anInt58 = 0;
                bzip2Context.aByte57 = 0;
                bzip2Context.anIntArray69[0] = 0;
                for (let j2: number = 1; j2 <= 256; j2++) {
                    bzip2Context.anIntArray69[j2] = bzip2Context.anIntArray67[j2 - 1];
                }
                for (let k2: number = 1; k2 <= 256; k2++) {
                    bzip2Context.anIntArray69[k2] += bzip2Context.anIntArray69[k2 - 1];
                }
                for (let l2: number = 0; l2 < i6; l2++) {
                    {
                        const byte7: number = ((Bzip2Context.anIntArray71[l2] & 255) as number) | 0;
                        Bzip2Context.anIntArray71[bzip2Context.anIntArray69[byte7 & 255]] |= l2 << 8;
                        bzip2Context.anIntArray69[byte7 & 255]++;
                    }
                }
                bzip2Context.anInt65 = Bzip2Context.anIntArray71[bzip2Context.anInt64] >> 8;
                bzip2Context.anInt68 = 0;
                bzip2Context.anInt65 = Bzip2Context.anIntArray71[bzip2Context.anInt65];
                bzip2Context.anInt66 = ((bzip2Context.anInt65 & 255) as number) | 0;
                bzip2Context.anInt65 >>= 8;
                bzip2Context.anInt68++;
                bzip2Context.anInt85 = i6;
                BZip2Decompressor.method313(bzip2Context);
                if (bzip2Context.anInt68 === bzip2Context.anInt85 + 1 && bzip2Context.anInt58 === 0) {
                    flag19 = true;
                } else {
                    flag19 = false;
                }
            }
        }
    }

    public static method315(class1: Bzip2Context): number {
        return (BZip2Decompressor.method317(8, class1) as number) | 0;
    }

    public static method316(class1: Bzip2Context): number {
        return (BZip2Decompressor.method317(1, class1) as number) | 0;
    }

    public static method317(i: number, class1: Bzip2Context): number {
        let j: number;
        do {
            {
                if (class1.bsLive >= i) {
                    const k: number = (class1.bsBuff >> (class1.bsLive - i)) & ((1 << i) - 1);
                    class1.bsLive -= i;
                    j = k;
                    break;
                }
                class1.bsBuff = (class1.bsBuff << 8) | (class1.compressed[class1.nextIn] & 255);
                class1.bsLive += 8;
                class1.nextIn++;
                class1.decompressedLength--;
                class1.totalInLo32++;
                if (class1.totalInLo32 === 0) {
                    class1.totalInHi32++;
                }
            }
        } while (true);
        return j;
    }

    public static method318(class1: Bzip2Context) {
        class1.anInt72 = 0;
        for (let i: number = 0; i < 256; i++) {
            if (class1.aBooleanArray73[i]) {
                class1.aByteArray75[class1.anInt72] = (i as number) | 0;
                class1.anInt72++;
            }
        }
    }

    public static method319(ai: number[], ai1: number[], ai2: number[], abyte0: number[], i: number, j: number, k: number) {
        let l: number = 0;
        for (let i1: number = i; i1 <= j; i1++) {
            {
                for (let l2: number = 0; l2 < k; l2++) {
                    if (abyte0[l2] === i1) {
                        ai2[l] = l2;
                        l++;
                    }
                }
            }
        }
        for (let j1: number = 0; j1 < 23; j1++) {
            ai1[j1] = 0;
        }
        for (let k1: number = 0; k1 < k; k1++) {
            ai1[abyte0[k1] + 1]++;
        }
        for (let l1: number = 1; l1 < 23; l1++) {
            ai1[l1] += ai1[l1 - 1];
        }
        for (let i2: number = 0; i2 < 23; i2++) {
            ai[i2] = 0;
        }
        let i3: number = 0;
        for (let j2: number = i; j2 <= j; j2++) {
            {
                i3 += ai1[j2 + 1] - ai1[j2];
                ai[j2] = i3 - 1;
                i3 <<= 1;
            }
        }
        for (let k2: number = i + 1; k2 <= j; k2++) {
            ai1[k2] = ((ai[k2 - 1] + 1) << 1) - ai1[k2];
        }
    }
}

BZip2Decompressor.state_$LI$();

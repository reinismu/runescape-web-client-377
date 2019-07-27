export class ComplexTile {
    public static anIntArray418: number[] = Array(6).fill(0);
    public static anIntArray419: number[] = Array(6).fill(0);
    public static anIntArray420: number[] = Array(6).fill(0);
    public static anIntArray421: number[] = Array(6).fill(0);
    public static anIntArray422: number[] = Array(6).fill(0);
    public static anIntArrayArray426: number[][] = [
        [1, 3, 5, 7],
        [1, 3, 5, 7],
        [1, 3, 5, 7],
        [1, 3, 5, 7, 6],
        [1, 3, 5, 7, 6],
        [1, 3, 5, 7, 6],
        [1, 3, 5, 7, 6],
        [1, 3, 5, 7, 2, 6],
        [1, 3, 5, 7, 2, 8],
        [1, 3, 5, 7, 2, 8],
        [1, 3, 5, 7, 11, 12],
        [1, 3, 5, 7, 11, 12],
        [1, 3, 5, 7, 13, 14]
    ];
    public static anIntArrayArray427: number[][] = [
        [0, 1, 2, 3, 0, 0, 1, 3],
        [1, 1, 2, 3, 1, 0, 1, 3],
        [0, 1, 2, 3, 1, 0, 1, 3],
        [0, 0, 1, 2, 0, 0, 2, 4, 1, 0, 4, 3],
        [0, 0, 1, 4, 0, 0, 4, 3, 1, 1, 2, 4],
        [0, 0, 4, 3, 1, 0, 1, 2, 1, 0, 2, 4],
        [0, 1, 2, 4, 1, 0, 1, 4, 1, 0, 4, 3],
        [0, 4, 1, 2, 0, 4, 2, 5, 1, 0, 4, 5, 1, 0, 5, 3],
        [0, 4, 1, 2, 0, 4, 2, 3, 0, 4, 3, 5, 1, 0, 4, 5],
        [0, 0, 4, 5, 1, 4, 1, 2, 1, 4, 2, 3, 1, 4, 3, 5],
        [0, 0, 1, 5, 0, 1, 4, 5, 0, 1, 2, 4, 1, 0, 5, 3, 1, 5, 4, 3, 1, 4, 2, 3],
        [1, 0, 1, 5, 1, 1, 4, 5, 1, 1, 2, 4, 0, 0, 5, 3, 0, 5, 4, 3, 0, 4, 2, 3],
        [1, 0, 5, 4, 1, 0, 1, 5, 0, 0, 4, 3, 0, 4, 5, 3, 0, 5, 2, 3, 0, 1, 2, 5]
    ];

    public anIntArray403: number[];

    public anIntArray404: number[];

    public anIntArray405: number[];

    public anIntArray406: number[];

    public anIntArray407: number[];

    public anIntArray408: number[];

    public anIntArray409: number[];

    public anIntArray410: number[];

    public anIntArray411: number[];

    public anIntArray412: number[];

    public aBoolean413: boolean;

    public anInt414: number;

    public anInt415: number;

    public anInt416: number;

    public anInt417: number;
    public constructor(
        i: number,
        j: number,
        k: number,
        l: number,
        i1: number,
        j1: number,
        k1: number,
        l1: number,
        i2: number,
        j2: number,
        k2: number,
        l2: number,
        i3: number,
        j3: number,
        k3: number,
        l3: number,
        i4: number,
        j4: number,
        k4: number,
        l4: number
    ) {
        if (this.anIntArray403 === undefined) {
            this.anIntArray403 = null;
        }
        if (this.anIntArray404 === undefined) {
            this.anIntArray404 = null;
        }
        if (this.anIntArray405 === undefined) {
            this.anIntArray405 = null;
        }
        if (this.anIntArray406 === undefined) {
            this.anIntArray406 = null;
        }
        if (this.anIntArray407 === undefined) {
            this.anIntArray407 = null;
        }
        if (this.anIntArray408 === undefined) {
            this.anIntArray408 = null;
        }
        if (this.anIntArray409 === undefined) {
            this.anIntArray409 = null;
        }
        if (this.anIntArray410 === undefined) {
            this.anIntArray410 = null;
        }
        if (this.anIntArray411 === undefined) {
            this.anIntArray411 = null;
        }
        if (this.anIntArray412 === undefined) {
            this.anIntArray412 = null;
        }
        if (this.aBoolean413 === undefined) {
            this.aBoolean413 = false;
        }
        if (this.anInt414 === undefined) {
            this.anInt414 = 0;
        }
        if (this.anInt415 === undefined) {
            this.anInt415 = 0;
        }
        if (this.anInt416 === undefined) {
            this.anInt416 = 0;
        }
        if (this.anInt417 === undefined) {
            this.anInt417 = 0;
        }
        this.aBoolean413 = true;
        if (l !== j3 || l !== k || l !== i) {
            this.aBoolean413 = false;
        }
        this.anInt414 = i3;
        this.anInt415 = l4;
        this.anInt416 = i4;
        this.anInt417 = l1;
        const c: string = "\u0080";
        const i5: number = ((c => (c.charCodeAt == null ? (c as any) : c.charCodeAt(0)))(c) / 2) | 0;
        const j5: number = ((c => (c.charCodeAt == null ? (c as any) : c.charCodeAt(0)))(c) / 4) | 0;
        const k5: number = (((c => (c.charCodeAt == null ? (c as any) : c.charCodeAt(0)))(c) * 3) / 4) | 0;
        const ai: number[] = ComplexTile.anIntArrayArray426[i3];
        const l5: number = ai.length;
        this.anIntArray403 = (s => {
            const a = [];
            while (s-- > 0) {
                a.push(0);
            }
            return a;
        })(l5);
        this.anIntArray404 = (s => {
            const a = [];
            while (s-- > 0) {
                a.push(0);
            }
            return a;
        })(l5);
        this.anIntArray405 = (s => {
            const a = [];
            while (s-- > 0) {
                a.push(0);
            }
            return a;
        })(l5);
        const ai1: number[] = (s => {
            const a = [];
            while (s-- > 0) {
                a.push(0);
            }
            return a;
        })(l5);
        const ai2: number[] = (s => {
            const a = [];
            while (s-- > 0) {
                a.push(0);
            }
            return a;
        })(l5);
        const i6: number = i1 * (c => (c.charCodeAt == null ? (c as any) : c.charCodeAt(0)))(c);
        const j6: number = k4 * (c => (c.charCodeAt == null ? (c as any) : c.charCodeAt(0)))(c);
        for (let k6: number = 0; k6 < l5; k6++) {
            {
                let l6: number = ai[k6];
                if ((l6 & 1) === 0 && l6 <= 8) {
                    l6 = ((l6 - l4 - l4 - 1) & 7) + 1;
                }
                if (l6 > 8 && l6 <= 12) {
                    l6 = ((l6 - 9 - l4) & 3) + 9;
                }
                if (l6 > 12 && l6 <= 16) {
                    l6 = ((l6 - 13 - l4) & 3) + 13;
                }
                let i7: number;
                let k7: number;
                let i8: number;
                let k8: number;
                let j9: number;
                if (l6 === 1) {
                    i7 = i6;
                    k7 = j6;
                    i8 = l;
                    k8 = l2;
                    j9 = j;
                } else if (l6 === 2) {
                    i7 = i6 + i5;
                    k7 = j6;
                    i8 = (l + j3) >> 1;
                    k8 = (l2 + i2) >> 1;
                    j9 = (j + j4) >> 1;
                } else if (l6 === 3) {
                    i7 = i6 + (c => (c.charCodeAt == null ? (c as any) : c.charCodeAt(0)))(c);
                    k7 = j6;
                    i8 = j3;
                    k8 = i2;
                    j9 = j4;
                } else if (l6 === 4) {
                    i7 = i6 + (c => (c.charCodeAt == null ? (c as any) : c.charCodeAt(0)))(c);
                    k7 = j6 + i5;
                    i8 = (j3 + k) >> 1;
                    k8 = (i2 + j1) >> 1;
                    j9 = (j4 + j2) >> 1;
                } else if (l6 === 5) {
                    i7 = i6 + (c => (c.charCodeAt == null ? (c as any) : c.charCodeAt(0)))(c);
                    k7 = j6 + (c => (c.charCodeAt == null ? (c as any) : c.charCodeAt(0)))(c);
                    i8 = k;
                    k8 = j1;
                    j9 = j2;
                } else if (l6 === 6) {
                    i7 = i6 + i5;
                    k7 = j6 + (c => (c.charCodeAt == null ? (c as any) : c.charCodeAt(0)))(c);
                    i8 = (k + i) >> 1;
                    k8 = (j1 + k1) >> 1;
                    j9 = (j2 + k3) >> 1;
                } else if (l6 === 7) {
                    i7 = i6;
                    k7 = j6 + (c => (c.charCodeAt == null ? (c as any) : c.charCodeAt(0)))(c);
                    i8 = i;
                    k8 = k1;
                    j9 = k3;
                } else if (l6 === 8) {
                    i7 = i6;
                    k7 = j6 + i5;
                    i8 = (i + l) >> 1;
                    k8 = (k1 + l2) >> 1;
                    j9 = (k3 + j) >> 1;
                } else if (l6 === 9) {
                    i7 = i6 + i5;
                    k7 = j6 + j5;
                    i8 = (l + j3) >> 1;
                    k8 = (l2 + i2) >> 1;
                    j9 = (j + j4) >> 1;
                } else if (l6 === 10) {
                    i7 = i6 + k5;
                    k7 = j6 + i5;
                    i8 = (j3 + k) >> 1;
                    k8 = (i2 + j1) >> 1;
                    j9 = (j4 + j2) >> 1;
                } else if (l6 === 11) {
                    i7 = i6 + i5;
                    k7 = j6 + k5;
                    i8 = (k + i) >> 1;
                    k8 = (j1 + k1) >> 1;
                    j9 = (j2 + k3) >> 1;
                } else if (l6 === 12) {
                    i7 = i6 + j5;
                    k7 = j6 + i5;
                    i8 = (i + l) >> 1;
                    k8 = (k1 + l2) >> 1;
                    j9 = (k3 + j) >> 1;
                } else if (l6 === 13) {
                    i7 = i6 + j5;
                    k7 = j6 + j5;
                    i8 = l;
                    k8 = l2;
                    j9 = j;
                } else if (l6 === 14) {
                    i7 = i6 + k5;
                    k7 = j6 + j5;
                    i8 = j3;
                    k8 = i2;
                    j9 = j4;
                } else if (l6 === 15) {
                    i7 = i6 + k5;
                    k7 = j6 + k5;
                    i8 = k;
                    k8 = j1;
                    j9 = j2;
                } else {
                    i7 = i6 + j5;
                    k7 = j6 + k5;
                    i8 = i;
                    k8 = k1;
                    j9 = k3;
                }
                this.anIntArray403[k6] = i7;
                this.anIntArray404[k6] = i8;
                this.anIntArray405[k6] = k7;
                ai1[k6] = k8;
                ai2[k6] = j9;
            }
        }
        const ai3: number[] = ComplexTile.anIntArrayArray427[i3];
        const j7: number = (ai3.length / 4) | 0;
        this.anIntArray409 = (s => {
            const a = [];
            while (s-- > 0) {
                a.push(0);
            }
            return a;
        })(j7);
        this.anIntArray410 = (s => {
            const a = [];
            while (s-- > 0) {
                a.push(0);
            }
            return a;
        })(j7);
        this.anIntArray411 = (s => {
            const a = [];
            while (s-- > 0) {
                a.push(0);
            }
            return a;
        })(j7);
        this.anIntArray406 = (s => {
            const a = [];
            while (s-- > 0) {
                a.push(0);
            }
            return a;
        })(j7);
        this.anIntArray407 = (s => {
            const a = [];
            while (s-- > 0) {
                a.push(0);
            }
            return a;
        })(j7);
        this.anIntArray408 = (s => {
            const a = [];
            while (s-- > 0) {
                a.push(0);
            }
            return a;
        })(j7);
        if (l3 !== -1) {
            this.anIntArray412 = (s => {
                const a = [];
                while (s-- > 0) {
                    a.push(0);
                }
                return a;
            })(j7);
        }
        let l7: number = 0;
        for (let j8: number = 0; j8 < j7; j8++) {
            {
                const l8: number = ai3[l7];
                let k9: number = ai3[l7 + 1];
                let i10: number = ai3[l7 + 2];
                let j10: number = ai3[l7 + 3];
                l7 += 4;
                if (k9 < 4) {
                    k9 = (k9 - l4) & 3;
                }
                if (i10 < 4) {
                    i10 = (i10 - l4) & 3;
                }
                if (j10 < 4) {
                    j10 = (j10 - l4) & 3;
                }
                this.anIntArray409[j8] = k9;
                this.anIntArray410[j8] = i10;
                this.anIntArray411[j8] = j10;
                if (l8 === 0) {
                    this.anIntArray406[j8] = ai1[k9];
                    this.anIntArray407[j8] = ai1[i10];
                    this.anIntArray408[j8] = ai1[j10];
                    if (this.anIntArray412 != null) {
                        this.anIntArray412[j8] = -1;
                    }
                } else {
                    this.anIntArray406[j8] = ai2[k9];
                    this.anIntArray407[j8] = ai2[i10];
                    this.anIntArray408[j8] = ai2[j10];
                    if (this.anIntArray412 != null) {
                        this.anIntArray412[j8] = l3;
                    }
                }
            }
        }
        let i9: number = l;
        let l9: number = j3;
        if (j3 < i9) {
            i9 = j3;
        }
        if (j3 > l9) {
            l9 = j3;
        }
        if (k < i9) {
            i9 = k;
        }
        if (k > l9) {
            l9 = k;
        }
        if (i < i9) {
            i9 = i;
        }
        if (i > l9) {
            l9 = i;
        }
    }
}
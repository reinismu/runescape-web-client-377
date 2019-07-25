/* Generated from Java with JSweet 2.3.0 - http://www.jsweet.org */
/**
 * Creates the random number generator with the specified seed.
 *
 * @param {Array} seed The seed.
 * @class
 */
export class ISAACCipher {

    /**
     * The golden ratio.
     */
    public static GOLDEN_RATIO: number = -1640531527;

    /**
     * The log of the size of the result and memory arrays.
     */
    public static SIZEL: number = 8;

    /**
     * The size of the result and memory arrays.
     */
    public static SIZE: number;
    /**
     * A mask for pseudorandom lookup.
     */
    public static MASK: number; public static SIZE_$LI$(): number { if (ISAACCipher.SIZE == null) { ISAACCipher.SIZE = 1 << ISAACCipher.SIZEL; } return ISAACCipher.SIZE; }public static MASK_$LI$(): number { if (ISAACCipher.MASK == null) { ISAACCipher.MASK = (ISAACCipher.SIZE_$LI$() - 1) << 2; } return ISAACCipher.MASK; }
    /**
     * The count through the results in the results array.
     */
    /*private*/ public count: number;

    /**
     * The results given to the user.
     */
    /*private*/ public rsl: number[];

    /**
     * The internal state.
     */
    /*private*/ public mem: number[];

    /**
     * The accumulator.
     */
    /*private*/ public a: number;

    /**
     * The last result.
     */
    /*private*/ public b: number;

    /**
     * The counter.
     */
    /*private*/ public c: number;

    public constructor(seed?: any) {
        if (((seed != null && seed instanceof Array as any && (seed.length == 0 || seed[0] == null || (typeof seed[0] === "number"))) || seed === null)) {
            const __args = arguments;
            if (this.count === undefined) { this.count = 0; }
            if (this.rsl === undefined) { this.rsl = null; }
            if (this.mem === undefined) { this.mem = null; }
            if (this.a === undefined) { this.a = 0; }
            if (this.b === undefined) { this.b = 0; }
            if (this.c === undefined) { this.c = 0; }
            if (this.count === undefined) { this.count = 0; }
            if (this.rsl === undefined) { this.rsl = null; }
            if (this.mem === undefined) { this.mem = null; }
            if (this.a === undefined) { this.a = 0; }
            if (this.b === undefined) { this.b = 0; }
            if (this.c === undefined) { this.c = 0; }
            (() => {
                this.mem = ((s) => { const a = []; while (s-- > 0) { a.push(0); } return a; })(ISAACCipher.SIZE_$LI$());
                this.rsl = ((s) => { const a = []; while (s-- > 0) { a.push(0); } return a; })(ISAACCipher.SIZE_$LI$());
                for (let i: number = 0; i < seed.length; ++i) {{
                    this.rsl[i] = seed[i];
                }}
                this.init(true);
            })();
        } else if (seed === undefined) {
            const __args = arguments;
            if (this.count === undefined) { this.count = 0; }
            if (this.rsl === undefined) { this.rsl = null; }
            if (this.mem === undefined) { this.mem = null; }
            if (this.a === undefined) { this.a = 0; }
            if (this.b === undefined) { this.b = 0; }
            if (this.c === undefined) { this.c = 0; }
            if (this.count === undefined) { this.count = 0; }
            if (this.rsl === undefined) { this.rsl = null; }
            if (this.mem === undefined) { this.mem = null; }
            if (this.a === undefined) { this.a = 0; }
            if (this.b === undefined) { this.b = 0; }
            if (this.c === undefined) { this.c = 0; }
            (() => {
                this.mem = ((s) => { const a = []; while (s-- > 0) { a.push(0); } return a; })(ISAACCipher.SIZE_$LI$());
                this.rsl = ((s) => { const a = []; while (s-- > 0) { a.push(0); } return a; })(ISAACCipher.SIZE_$LI$());
                this.init(false);
            })();
        } else { throw new Error("invalid overload"); }
    }

    /**
     * Generates 256 results.
     * @private
     */
    /*private*/ public isaac() {
        let i: number;
        let j: number;
        let x: number;
        let y: number;
        this.b += ++this.c;
        for (i = 0, j = (ISAACCipher.SIZE_$LI$() / 2 | 0); i < (ISAACCipher.SIZE_$LI$() / 2 | 0); ) {{
            x = this.mem[i];
            this.a ^= this.a << 13;
            this.a += this.mem[j++];
            this.mem[i] = y = this.mem[(x & ISAACCipher.MASK_$LI$()) >> 2] + this.a + this.b;
            this.rsl[i++] = this.b = this.mem[((y >> ISAACCipher.SIZEL) & ISAACCipher.MASK_$LI$()) >> 2] + x;
            x = this.mem[i];
            this.a ^= this.a >>> 6;
            this.a += this.mem[j++];
            this.mem[i] = y = this.mem[(x & ISAACCipher.MASK_$LI$()) >> 2] + this.a + this.b;
            this.rsl[i++] = this.b = this.mem[((y >> ISAACCipher.SIZEL) & ISAACCipher.MASK_$LI$()) >> 2] + x;
            x = this.mem[i];
            this.a ^= this.a << 2;
            this.a += this.mem[j++];
            this.mem[i] = y = this.mem[(x & ISAACCipher.MASK_$LI$()) >> 2] + this.a + this.b;
            this.rsl[i++] = this.b = this.mem[((y >> ISAACCipher.SIZEL) & ISAACCipher.MASK_$LI$()) >> 2] + x;
            x = this.mem[i];
            this.a ^= this.a >>> 16;
            this.a += this.mem[j++];
            this.mem[i] = y = this.mem[(x & ISAACCipher.MASK_$LI$()) >> 2] + this.a + this.b;
            this.rsl[i++] = this.b = this.mem[((y >> ISAACCipher.SIZEL) & ISAACCipher.MASK_$LI$()) >> 2] + x;
        }}
        for (j = 0; j < (ISAACCipher.SIZE_$LI$() / 2 | 0); ) {{
            x = this.mem[i];
            this.a ^= this.a << 13;
            this.a += this.mem[j++];
            this.mem[i] = y = this.mem[(x & ISAACCipher.MASK_$LI$()) >> 2] + this.a + this.b;
            this.rsl[i++] = this.b = this.mem[((y >> ISAACCipher.SIZEL) & ISAACCipher.MASK_$LI$()) >> 2] + x;
            x = this.mem[i];
            this.a ^= this.a >>> 6;
            this.a += this.mem[j++];
            this.mem[i] = y = this.mem[(x & ISAACCipher.MASK_$LI$()) >> 2] + this.a + this.b;
            this.rsl[i++] = this.b = this.mem[((y >> ISAACCipher.SIZEL) & ISAACCipher.MASK_$LI$()) >> 2] + x;
            x = this.mem[i];
            this.a ^= this.a << 2;
            this.a += this.mem[j++];
            this.mem[i] = y = this.mem[(x & ISAACCipher.MASK_$LI$()) >> 2] + this.a + this.b;
            this.rsl[i++] = this.b = this.mem[((y >> ISAACCipher.SIZEL) & ISAACCipher.MASK_$LI$()) >> 2] + x;
            x = this.mem[i];
            this.a ^= this.a >>> 16;
            this.a += this.mem[j++];
            this.mem[i] = y = this.mem[(x & ISAACCipher.MASK_$LI$()) >> 2] + this.a + this.b;
            this.rsl[i++] = this.b = this.mem[((y >> ISAACCipher.SIZEL) & ISAACCipher.MASK_$LI$()) >> 2] + x;
        }}
    }

    /**
     * Initialises this random number generator.
     *
     * @param {boolean} flag Set to {@code true} if a seed was passed to the constructor.
     * @private
     */
    /*private*/ public init(flag: boolean) {
        let i: number;
        let a: number;
        let b: number;
        let c: number;
        let d: number;
        let e: number;
        let f: number;
        let g: number;
        let h: number;
        a = b = c = d = e = f = g = h = ISAACCipher.GOLDEN_RATIO;
        for (i = 0; i < 4; ++i) {{
            a ^= b << 11;
            d += a;
            b += c;
            b ^= c >>> 2;
            e += b;
            c += d;
            c ^= d << 8;
            f += c;
            d += e;
            d ^= e >>> 16;
            g += d;
            e += f;
            e ^= f << 10;
            h += e;
            f += g;
            f ^= g >>> 4;
            a += f;
            g += h;
            g ^= h << 8;
            b += g;
            h += a;
            h ^= a >>> 9;
            c += h;
            a += b;
        }}
        for (i = 0; i < ISAACCipher.SIZE_$LI$(); i += 8) {{
            if (flag) {
                a += this.rsl[i];
                b += this.rsl[i + 1];
                c += this.rsl[i + 2];
                d += this.rsl[i + 3];
                e += this.rsl[i + 4];
                f += this.rsl[i + 5];
                g += this.rsl[i + 6];
                h += this.rsl[i + 7];
            }
            a ^= b << 11;
            d += a;
            b += c;
            b ^= c >>> 2;
            e += b;
            c += d;
            c ^= d << 8;
            f += c;
            d += e;
            d ^= e >>> 16;
            g += d;
            e += f;
            e ^= f << 10;
            h += e;
            f += g;
            f ^= g >>> 4;
            a += f;
            g += h;
            g ^= h << 8;
            b += g;
            h += a;
            h ^= a >>> 9;
            c += h;
            a += b;
            this.mem[i] = a;
            this.mem[i + 1] = b;
            this.mem[i + 2] = c;
            this.mem[i + 3] = d;
            this.mem[i + 4] = e;
            this.mem[i + 5] = f;
            this.mem[i + 6] = g;
            this.mem[i + 7] = h;
        }}
        if (flag) {
            for (i = 0; i < ISAACCipher.SIZE_$LI$(); i += 8) {{
                a += this.mem[i];
                b += this.mem[i + 1];
                c += this.mem[i + 2];
                d += this.mem[i + 3];
                e += this.mem[i + 4];
                f += this.mem[i + 5];
                g += this.mem[i + 6];
                h += this.mem[i + 7];
                a ^= b << 11;
                d += a;
                b += c;
                b ^= c >>> 2;
                e += b;
                c += d;
                c ^= d << 8;
                f += c;
                d += e;
                d ^= e >>> 16;
                g += d;
                e += f;
                e ^= f << 10;
                h += e;
                f += g;
                f ^= g >>> 4;
                a += f;
                g += h;
                g ^= h << 8;
                b += g;
                h += a;
                h ^= a >>> 9;
                c += h;
                a += b;
                this.mem[i] = a;
                this.mem[i + 1] = b;
                this.mem[i + 2] = c;
                this.mem[i + 3] = d;
                this.mem[i + 4] = e;
                this.mem[i + 5] = f;
                this.mem[i + 6] = g;
                this.mem[i + 7] = h;
            }}
        }
        this.isaac();
        this.count = ISAACCipher.SIZE_$LI$();
    }

    /**
     * Gets the next random value.
     *
     * @return {number} The next random value.
     */
    public nextInt(): number {
        if (0 === this.count--) {
            this.isaac();
            this.count = ISAACCipher.SIZE_$LI$() - 1;
        }
        return this.rsl[this.count];
    }
}
ISAACCipher.__class = "com.jagex.runescape.net.ISAACCipher";

ISAACCipher.MASK_$LI$();

ISAACCipher.SIZE_$LI$();

export class Bzip2Context {

    public static anIntArray71: number[] = null;
    public compressed: number[];

    public nextIn: number;

    public decompressedLength: number;

    public totalInLo32: number;

    public totalInHi32: number;

    public decompressed: number[];

    public nextOut: number;

    public lenght: number;

    public totalOutLo32: number;

    public totalOutHigh32: number;

    public aByte57: number;

    public anInt58: number;

    public aBoolean59: boolean;

    public bsBuff: number;

    public bsLive: number;

    public anInt62: number;

    public currentBlock: number;

    public anInt64: number;

    public anInt65: number;

    public anInt66: number;

    public anIntArray67: number[] = ((s) => { const a = []; while (s-- > 0) { a.push(0); } return a; })(256);

    public anInt68: number;

    public anIntArray69: number[] = ((s) => { const a = []; while (s-- > 0) { a.push(0); } return a; })(257);

    public anInt72: number;

    public aBooleanArray73: boolean[] = ((s) => { const a = []; while (s-- > 0) { a.push(false); } return a; })(256);

    public aBooleanArray74: boolean[] = ((s) => { const a = []; while (s-- > 0) { a.push(false); } return a; })(16);

    public aByteArray75: number[] = ((s) => { const a = []; while (s-- > 0) { a.push(0); } return a; })(256);

    public aByteArray76: number[] = ((s) => { const a = []; while (s-- > 0) { a.push(0); } return a; })(4096);

    public anIntArray77: number[] = ((s) => { const a = []; while (s-- > 0) { a.push(0); } return a; })(16);

    public aByteArray78: number[] = ((s) => { const a = []; while (s-- > 0) { a.push(0); } return a; })(18002);

    public aByteArray79: number[] = ((s) => { const a = []; while (s-- > 0) { a.push(0); } return a; })(18002);

    public aByteArrayArray80: number[][] = (function(dims) { const allocate = function(dims) { if (dims.length == 0) { return 0; } else { const array = []; for (let i = 0; i < dims[0]; i++) { array.push(allocate(dims.slice(1))); } return array; }}; return allocate(dims); })([6, 258]) as any;

    public anIntArrayArray81: number[][] = (function(dims) { const allocate = function(dims) { if (dims.length == 0) { return 0; } else { const array = []; for (let i = 0; i < dims[0]; i++) { array.push(allocate(dims.slice(1))); } return array; }}; return allocate(dims); })([6, 258]) as any;

    public anIntArrayArray82: number[][] = (function(dims) { const allocate = function(dims) { if (dims.length == 0) { return 0; } else { const array = []; for (let i = 0; i < dims[0]; i++) { array.push(allocate(dims.slice(1))); } return array; }}; return allocate(dims); })([6, 258]) as any;

    public anIntArrayArray83: number[][] = (function(dims) { const allocate = function(dims) { if (dims.length == 0) { return 0; } else { const array = []; for (let i = 0; i < dims[0]; i++) { array.push(allocate(dims.slice(1))); } return array; }}; return allocate(dims); })([6, 258]) as any;

    public anIntArray84: number[] = [0, 0, 0, 0, 0, 0];

    public anInt85: number;

    constructor() {
        if (this.compressed === undefined) { this.compressed = null; }
        if (this.nextIn === undefined) { this.nextIn = 0; }
        if (this.decompressedLength === undefined) { this.decompressedLength = 0; }
        if (this.totalInLo32 === undefined) { this.totalInLo32 = 0; }
        if (this.totalInHi32 === undefined) { this.totalInHi32 = 0; }
        if (this.decompressed === undefined) { this.decompressed = null; }
        if (this.nextOut === undefined) { this.nextOut = 0; }
        if (this.lenght === undefined) { this.lenght = 0; }
        if (this.totalOutLo32 === undefined) { this.totalOutLo32 = 0; }
        if (this.totalOutHigh32 === undefined) { this.totalOutHigh32 = 0; }
        if (this.aByte57 === undefined) { this.aByte57 = 0; }
        if (this.anInt58 === undefined) { this.anInt58 = 0; }
        if (this.aBoolean59 === undefined) { this.aBoolean59 = false; }
        if (this.bsBuff === undefined) { this.bsBuff = 0; }
        if (this.bsLive === undefined) { this.bsLive = 0; }
        if (this.anInt62 === undefined) { this.anInt62 = 0; }
        if (this.currentBlock === undefined) { this.currentBlock = 0; }
        if (this.anInt64 === undefined) { this.anInt64 = 0; }
        if (this.anInt65 === undefined) { this.anInt65 = 0; }
        if (this.anInt66 === undefined) { this.anInt66 = 0; }
        if (this.anInt68 === undefined) { this.anInt68 = 0; }
        if (this.anInt72 === undefined) { this.anInt72 = 0; }
        if (this.anInt85 === undefined) { this.anInt85 = 0; }
    }
}

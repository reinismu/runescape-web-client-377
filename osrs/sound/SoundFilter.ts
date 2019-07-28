import { Buffer } from "../net/Buffer";
import { SoundTrackEnvelope } from "./SoundTrackEnvelope";

export class SoundFilter {

    public static _coefficient: number[][] = Array(2).fill(Array(8).fill(0));
    public static coefficient: number[][];
    public static _invUnity: number = 0;

    public static invUnity: number = 0;

    public numPairs: number[] = [0, 0];

    public pairPhase: number[][][] = (function(dims) { const allocate = function(dims) { if (dims.length == 0) { return 0; } else { const array = []; for (let i = 0; i < dims[0]; i++) { array.push(allocate(dims.slice(1))); } return array; }}; return allocate(dims); })([2, 2, 4]) as any;

    public magnitude: number[][][] = (function(dims) { const allocate = function(dims) { if (dims.length == 0) { return 0; } else { const array = []; for (let i = 0; i < dims[0]; i++) { array.push(allocate(dims.slice(1))); } return array; }}; return allocate(dims); })([2, 2, 4]) as any;

    public unity: number[] = [0, 0];

    public adaptMagnitude(i: number, f: number, dir: number): number {
        let alpha: number = (Math as any).fround(this.magnitude[i][0][dir] + (Math as any).fround(f * (this.magnitude[i][1][dir] - this.magnitude[i][0][dir])));
        alpha *= 0.001525879;
        return (Math as any).fround(1.0 - (Math as any).fround(Math.pow(10.0, (Math as any).fround(-alpha / 20.0))));
    }

    public normalize(f: number): number {
        const f1: number = (Math as any).fround(32.7032 * (Math as any).fround(Math.pow(2.0, f)));
        return (Math as any).fround(((Math as any).fround(f1 * 3.141593)) / 11025.0);
    }

    public adaptPhase(i: number, dir: number, f: number): number {
        let f1: number = (Math as any).fround(this.pairPhase[dir][0][i] + (Math as any).fround(f * (this.pairPhase[dir][1][i] - this.pairPhase[dir][0][i])));
        f1 *= 1.220703E-4;
        return this.normalize(f1);
    }

    public compute(dir: number, f: number): number {
        if (dir === 0) {
            let f1: number = (Math as any).fround(this.unity[0] + (Math as any).fround((this.unity[1] - this.unity[0]) * f));
            f1 *= 0.003051758;
            SoundFilter._invUnity = (Math as any).fround(Math.pow(0.1, (Math as any).fround(f1 / 20.0)));
            SoundFilter.invUnity = ((((Math as any).fround(SoundFilter._invUnity * 65536.0)) as number) | 0);
        }
        if (this.numPairs[dir] === 0) { return 0; }
        const f2: number = this.adaptMagnitude(dir, f, 0);
        SoundFilter._coefficient[dir][0] = (Math as any).fround((Math as any).fround(-2.0 * f2) * (Math as any).fround(Math.cos(this.adaptPhase(0, dir, f))));
        SoundFilter._coefficient[dir][1] = (Math as any).fround(f2 * f2);
        for (let term: number = 1; term < this.numPairs[dir]; term++) {{
            const f3: number = this.adaptMagnitude(dir, f, term);
            const f4: number = (Math as any).fround((Math as any).fround(-2.0 * f3) * (Math as any).fround(Math.cos(this.adaptPhase(term, dir, f))));
            const f5: number = (Math as any).fround(f3 * f3);
            SoundFilter._coefficient[dir][term * 2 + 1] = (Math as any).fround(SoundFilter._coefficient[dir][term * 2 - 1] * f5);
            SoundFilter._coefficient[dir][term * 2] = (Math as any).fround((Math as any).fround(SoundFilter._coefficient[dir][term * 2 - 1] * f4) + (Math as any).fround(SoundFilter._coefficient[dir][term * 2 - 2] * f5));
            for (let i: number = term * 2 - 1; i >= 2; i--) {SoundFilter._coefficient[dir][i] += (Math as any).fround((Math as any).fround(SoundFilter._coefficient[dir][i - 1] * f4) + (Math as any).fround(SoundFilter._coefficient[dir][i - 2] * f5)); }
            SoundFilter._coefficient[dir][1] += (Math as any).fround((Math as any).fround(SoundFilter._coefficient[dir][0] * f4) + f5);
            SoundFilter._coefficient[dir][0] += f4;
        }}
        if (dir === 0) {
            for (let l: number = 0; l < this.numPairs[0] * 2; l++) {SoundFilter._coefficient[0][l] *= SoundFilter._invUnity; }
        }
        for (let term: number = 0; term < this.numPairs[dir] * 2; term++) {SoundFilter.coefficient[dir][term] = ((((Math as any).fround(SoundFilter._coefficient[dir][term] * 65536.0)) as number) | 0); }
        return this.numPairs[dir] * 2;
    }

    public decode(soundTrackEnvelope: SoundTrackEnvelope, buffer: Buffer) {
        const numPair: number = buffer.getUnsignedByte();
        this.numPairs[0] = numPair >> 4;
        this.numPairs[1] = numPair & 15;
        if (numPair !== 0) {
            this.unity[0] = buffer.getUnsignedLEShort();
            this.unity[1] = buffer.getUnsignedLEShort();
            const migrated: number = buffer.getUnsignedByte();
            for (let dir: number = 0; dir < 2; dir++) {{
                for (let term: number = 0; term < this.numPairs[dir]; term++) {{
                    this.pairPhase[dir][0][term] = buffer.getUnsignedLEShort();
                    this.magnitude[dir][0][term] = buffer.getUnsignedLEShort();
                }}
            }}
            for (let dir: number = 0; dir < 2; dir++) {{
                for (let term: number = 0; term < this.numPairs[dir]; term++) {if ((migrated & 1 << dir * 4 << term) !== 0) {
                    this.pairPhase[dir][1][term] = buffer.getUnsignedLEShort();
                    this.magnitude[dir][1][term] = buffer.getUnsignedLEShort();
                } else {
                    this.pairPhase[dir][1][term] = this.pairPhase[dir][0][term];
                    this.magnitude[dir][1][term] = this.magnitude[dir][0][term];
                }}
            }}
            if (migrated !== 0 || this.unity[1] !== this.unity[0]) { soundTrackEnvelope.decodeShape(buffer); }
            return;
        } else {
            this.unity[0] = this.unity[1] = 0;
            return;
        }
    }
}

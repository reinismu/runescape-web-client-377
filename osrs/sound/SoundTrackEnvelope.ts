import { Buffer } from "../net/Buffer";

export class SoundTrackEnvelope {
    public numPhases: number;

    public phaseDuration: number[];

    public phasePeak: number[];

    public smart: number;

    public end: number;

    public form: number;

    public critical: number;

    public phaseIndex: number;

    public __step: number;

    public amplitude: number;

    public ticks: number;

    constructor() {
        if (this.numPhases === undefined) { this.numPhases = 0; }
        if (this.phaseDuration === undefined) { this.phaseDuration = null; }
        if (this.phasePeak === undefined) { this.phasePeak = null; }
        if (this.smart === undefined) { this.smart = 0; }
        if (this.end === undefined) { this.end = 0; }
        if (this.form === undefined) { this.form = 0; }
        if (this.critical === undefined) { this.critical = 0; }
        if (this.phaseIndex === undefined) { this.phaseIndex = 0; }
        if (this.__step === undefined) { this.__step = 0; }
        if (this.amplitude === undefined) { this.amplitude = 0; }
        if (this.ticks === undefined) { this.ticks = 0; }
    }

    public decode(buffer: Buffer) {
        this.form = buffer.getUnsignedByte();
        this.smart = buffer.getInt();
        this.end = buffer.getInt();
        this.decodeShape(buffer);
    }

    public decodeShape(buffer: Buffer) {
        this.numPhases = buffer.getUnsignedByte();
        this.phaseDuration = ((s) => { const a = []; while (s-- > 0) { a.push(0); } return a; })(this.numPhases);
        this.phasePeak = ((s) => { const a = []; while (s-- > 0) { a.push(0); } return a; })(this.numPhases);
        for (let phase: number = 0; phase < this.numPhases; phase++) {{
            this.phaseDuration[phase] = buffer.getUnsignedLEShort();
            this.phasePeak[phase] = buffer.getUnsignedLEShort();
        }}
    }

    public reset() {
        this.critical = 0;
        this.phaseIndex = 0;
        this.__step = 0;
        this.amplitude = 0;
        this.ticks = 0;
    }

    public step(period: number): number {
        if (this.ticks >= this.critical) {
            this.amplitude = this.phasePeak[this.phaseIndex++] << 15;
            if (this.phaseIndex >= this.numPhases) { this.phaseIndex = this.numPhases - 1; }
            this.critical = ((((this.phaseDuration[this.phaseIndex] / 65536.0) * period) as number) | 0);
            if (this.critical > this.ticks) { this.__step = (((this.phasePeak[this.phaseIndex] << 15) - this.amplitude) / (this.critical - this.ticks) | 0); }
        }
        this.amplitude += this.__step;
        this.ticks++;
        return this.amplitude - this.__step >> 15;
    }
}

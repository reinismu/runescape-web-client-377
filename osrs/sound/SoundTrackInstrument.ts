/* Generated from Java with JSweet 2.3.0 - http://www.jsweet.org */
import { Buffer } from "../net/Buffer";
import { SoundFilter } from "./SoundFilter";
import { SoundTrackEnvelope } from "./SoundTrackEnvelope";

export class SoundTrackInstrument {
    public static buffer: number[] = null;

    public static noise: number[] = null;

    public static sine: number[] = null;

    public static phases: number[] = [0, 0, 0, 0, 0];
    public static delays: number[] = [0, 0, 0, 0, 0];
    public static volumeStep: number[] = [0, 0, 0, 0, 0];
    public static pitchStep: number[] = [0, 0, 0, 0, 0];
    public static pitchBaseStep: number[] = [0, 0, 0, 0, 0];

    public static decode() {
        SoundTrackInstrument.noise = (s => {
            const a = [];
            while (s-- > 0) {
                a.push(0);
            }
            return a;
        })(32768);
        for (let noiseId: number = 0; noiseId < 32768; noiseId++) {
            if (Math.random() > 0.5) {
                SoundTrackInstrument.noise[noiseId] = 1;
            } else {
                SoundTrackInstrument.noise[noiseId] = -1;
            }
        }
        SoundTrackInstrument.sine = (s => {
            const a = [];
            while (s-- > 0) {
                a.push(0);
            }
            return a;
        })(32768);
        for (let sineId: number = 0; sineId < 32768; sineId++) {
            SoundTrackInstrument.sine[sineId] = ((Math.sin(sineId / 5215.1903) * 16384.0) as number) | 0;
        }
        SoundTrackInstrument.buffer = (s => {
            const a = [];
            while (s-- > 0) {
                a.push(0);
            }
            return a;
        })(220500);
    }
    public pitchEnvelope: SoundTrackEnvelope;

    public volumeEnvelope: SoundTrackEnvelope;

    public pitchModEnvelope: SoundTrackEnvelope;

    public pitchModAmpEnvelope: SoundTrackEnvelope;

    public volumeModEnvelope: SoundTrackEnvelope;

    public volumeModAmpEnvelope: SoundTrackEnvelope;

    public gatingReleaseEnvelope: SoundTrackEnvelope;

    public gatingAttackEnvelope: SoundTrackEnvelope;

    public oscillVolume: number[] = [0, 0, 0, 0, 0];

    public oscillPitchDelta: number[] = [0, 0, 0, 0, 0];

    public oscillDelay: number[] = [0, 0, 0, 0, 0];

    public delayTime: number;

    public delayFeedback: number = 100;

    public filter: SoundFilter;

    public filterEnvelope: SoundTrackEnvelope;

    public soundMillis: number = 500;

    public pauseMillis: number;

    constructor() {
        if (this.pitchEnvelope === undefined) {
            this.pitchEnvelope = null;
        }
        if (this.volumeEnvelope === undefined) {
            this.volumeEnvelope = null;
        }
        if (this.pitchModEnvelope === undefined) {
            this.pitchModEnvelope = null;
        }
        if (this.pitchModAmpEnvelope === undefined) {
            this.pitchModAmpEnvelope = null;
        }
        if (this.volumeModEnvelope === undefined) {
            this.volumeModEnvelope = null;
        }
        if (this.volumeModAmpEnvelope === undefined) {
            this.volumeModAmpEnvelope = null;
        }
        if (this.gatingReleaseEnvelope === undefined) {
            this.gatingReleaseEnvelope = null;
        }
        if (this.gatingAttackEnvelope === undefined) {
            this.gatingAttackEnvelope = null;
        }
        if (this.delayTime === undefined) {
            this.delayTime = 0;
        }
        if (this.filter === undefined) {
            this.filter = null;
        }
        if (this.filterEnvelope === undefined) {
            this.filterEnvelope = null;
        }
        if (this.pauseMillis === undefined) {
            this.pauseMillis = 0;
        }
    }

    public synthesize(nS: number, dt: number): number[] {
        for (let position: number = 0; position < nS; position++) {
            SoundTrackInstrument.buffer[position] = 0;
        }
        if (dt < 10) {
            return SoundTrackInstrument.buffer;
        }
        const fS: number = nS / (dt + 0.0);
        this.pitchEnvelope.reset();
        this.volumeEnvelope.reset();
        let pitchModStep: number = 0;
        let pitchModBaseStep: number = 0;
        let pitchModPhase: number = 0;
        if (this.pitchModEnvelope != null) {
            this.pitchModEnvelope.reset();
            this.pitchModAmpEnvelope.reset();
            pitchModStep = ((((this.pitchModEnvelope.end - this.pitchModEnvelope.smart) * 32.768) / fS) as number) | 0;
            pitchModBaseStep = (((this.pitchModEnvelope.smart * 32.768) / fS) as number) | 0;
        }
        let volumeModStep: number = 0;
        let volumeModBaseStep: number = 0;
        let volumeModPhase: number = 0;
        if (this.volumeModEnvelope != null) {
            this.volumeModEnvelope.reset();
            this.volumeModAmpEnvelope.reset();
            volumeModStep = ((((this.volumeModEnvelope.end - this.volumeModEnvelope.smart) * 32.768) / fS) as number) | 0;
            volumeModBaseStep = (((this.volumeModEnvelope.smart * 32.768) / fS) as number) | 0;
        }
        for (let oscillVolumeId: number = 0; oscillVolumeId < 5; oscillVolumeId++) {
            if (this.oscillVolume[oscillVolumeId] !== 0) {
                SoundTrackInstrument.phases[oscillVolumeId] = 0;
                SoundTrackInstrument.delays[oscillVolumeId] = ((this.oscillDelay[oscillVolumeId] * fS) as number) | 0;
                SoundTrackInstrument.volumeStep[oscillVolumeId] = ((this.oscillVolume[oscillVolumeId] << 14) / 100) | 0;
                SoundTrackInstrument.pitchStep[oscillVolumeId] =
                    ((((this.pitchEnvelope.end - this.pitchEnvelope.smart) *
                        32.768 *
                        Math.pow(1.0057929410678534, this.oscillPitchDelta[oscillVolumeId])) /
                        fS) as number) | 0;
                SoundTrackInstrument.pitchBaseStep[oscillVolumeId] = (((this.pitchEnvelope.smart * 32.768) / fS) as number) | 0;
            }
        }
        for (let offset: number = 0; offset < nS; offset++) {
            {
                let pitchChange: number = this.pitchEnvelope.step(nS);
                let volumeChange: number = this.volumeEnvelope.step(nS);
                if (this.pitchModEnvelope != null) {
                    const mod: number = this.pitchModEnvelope.step(nS);
                    const modAmp: number = this.pitchModAmpEnvelope.step(nS);
                    pitchChange += this.evaluateWave(modAmp, pitchModPhase, this.pitchModEnvelope.form) >> 1;
                    pitchModPhase += ((mod * pitchModStep) >> 16) + pitchModBaseStep;
                }
                if (this.volumeModEnvelope != null) {
                    const mod: number = this.volumeModEnvelope.step(nS);
                    const modAmp: number = this.volumeModAmpEnvelope.step(nS);
                    volumeChange =
                        (volumeChange * ((this.evaluateWave(modAmp, volumeModPhase, this.volumeModEnvelope.form) >> 1) + 32768)) >> 15;
                    volumeModPhase += ((mod * volumeModStep) >> 16) + volumeModBaseStep;
                }
                for (let oscillVolumeId: number = 0; oscillVolumeId < 5; oscillVolumeId++) {
                    if (this.oscillVolume[oscillVolumeId] !== 0) {
                        const position: number = offset + SoundTrackInstrument.delays[oscillVolumeId];
                        if (position < nS) {
                            SoundTrackInstrument.buffer[position] += this.evaluateWave(
                                (volumeChange * SoundTrackInstrument.volumeStep[oscillVolumeId]) >> 15,
                                SoundTrackInstrument.phases[oscillVolumeId],
                                this.pitchEnvelope.form
                            );
                            SoundTrackInstrument.phases[oscillVolumeId] +=
                                ((pitchChange * SoundTrackInstrument.pitchStep[oscillVolumeId]) >> 16) +
                                SoundTrackInstrument.pitchBaseStep[oscillVolumeId];
                        }
                    }
                }
            }
        }
        if (this.gatingReleaseEnvelope != null) {
            this.gatingReleaseEnvelope.reset();
            this.gatingAttackEnvelope.reset();
            let counter: number = 0;
            let muted: boolean = true;
            for (let position: number = 0; position < nS; position++) {
                {
                    const onStep: number = this.gatingReleaseEnvelope.step(nS);
                    const offStep: number = this.gatingAttackEnvelope.step(nS);
                    let threshold: number;
                    if (muted) {
                        threshold =
                            this.gatingReleaseEnvelope.smart +
                            (((this.gatingReleaseEnvelope.end - this.gatingReleaseEnvelope.smart) * onStep) >> 8);
                    } else {
                        threshold =
                            this.gatingReleaseEnvelope.smart +
                            (((this.gatingReleaseEnvelope.end - this.gatingReleaseEnvelope.smart) * offStep) >> 8);
                    }
                    if ((counter += 256) >= threshold) {
                        counter = 0;
                        muted = !muted;
                    }
                    if (muted) {
                        SoundTrackInstrument.buffer[position] = 0;
                    }
                }
            }
        }
        if (this.delayTime > 0 && this.delayFeedback > 0) {
            const delay: number = ((this.delayTime * fS) as number) | 0;
            for (let position: number = delay; position < nS; position++) {
                SoundTrackInstrument.buffer[position] += ((SoundTrackInstrument.buffer[position - delay] * this.delayFeedback) / 100) | 0;
            }
        }
        if (this.filter.numPairs[0] > 0 || this.filter.numPairs[1] > 0) {
            this.filterEnvelope.reset();
            let t: number = this.filterEnvelope.step(nS + 1);
            let M: number = this.filter.compute(0, (Math as any).fround(t / 65536.0));
            let N: number = this.filter.compute(1, (Math as any).fround(t / 65536.0));
            if (nS >= M + N) {
                let n: number = 0;
                let delay: number = N;
                if (delay > nS - M) {
                    delay = nS - M;
                }
                for (; n < delay; n++) {
                    {
                        let y: number =
                            ((((n => (n < 0 ? Math.ceil(n) : Math.floor(n)))(SoundTrackInstrument.buffer[n + M] as number) *
                                (n => (n < 0 ? Math.ceil(n) : Math.floor(n)))(SoundFilter.invUnity as number)) >>
                                16) as number) | 0;
                        for (let position: number = 0; position < M; position++) {
                            y +=
                                ((((n => (n < 0 ? Math.ceil(n) : Math.floor(n)))(SoundTrackInstrument.buffer[
                                    n + M - 1 - position
                                ] as number) *
                                    (n => (n < 0 ? Math.ceil(n) : Math.floor(n)))(SoundFilter.coefficient[0][position] as number)) >>
                                    16) as number) | 0;
                        }
                        for (let position: number = 0; position < n; position++) {
                            y -=
                                ((((n => (n < 0 ? Math.ceil(n) : Math.floor(n)))(SoundTrackInstrument.buffer[n - 1 - position] as number) *
                                    (n => (n < 0 ? Math.ceil(n) : Math.floor(n)))(SoundFilter.coefficient[1][position] as number)) >>
                                    16) as number) | 0;
                        }
                        SoundTrackInstrument.buffer[n] = y;
                        t = this.filterEnvelope.step(nS + 1);
                    }
                }
                const offset: string = "\u0080";
                delay = offset.charCodeAt(0);
                do {
                    {
                        if (delay > nS - M) {
                            delay = nS - M;
                        }
                        for (; n < delay; n++) {
                            {
                                let y: number =
                                    ((((n => (n < 0 ? Math.ceil(n) : Math.floor(n)))(SoundTrackInstrument.buffer[n + M] as number) *
                                        (n => (n < 0 ? Math.ceil(n) : Math.floor(n)))(SoundFilter.invUnity as number)) >>
                                        16) as number) | 0;
                                for (let position: number = 0; position < M; position++) {
                                    y +=
                                        ((((n => (n < 0 ? Math.ceil(n) : Math.floor(n)))(SoundTrackInstrument.buffer[
                                            n + M - 1 - position
                                        ] as number) *
                                            (n => (n < 0 ? Math.ceil(n) : Math.floor(n)))(SoundFilter.coefficient[0][
                                                position
                                            ] as number)) >>
                                            16) as number) | 0;
                                }
                                for (let position: number = 0; position < N; position++) {
                                    y -=
                                        ((((n => (n < 0 ? Math.ceil(n) : Math.floor(n)))(SoundTrackInstrument.buffer[
                                            n - 1 - position
                                        ] as number) *
                                            (n => (n < 0 ? Math.ceil(n) : Math.floor(n)))(SoundFilter.coefficient[1][
                                                position
                                            ] as number)) >>
                                            16) as number) | 0;
                                }
                                SoundTrackInstrument.buffer[n] = y;
                                t = this.filterEnvelope.step(nS + 1);
                            }
                        }
                        if (n >= nS - M) {
                            break;
                        }
                        M = this.filter.compute(0, (Math as any).fround(t / 65536.0));
                        N = this.filter.compute(1, (Math as any).fround(t / 65536.0));
                        delay += offset.charCodeAt(0);
                    }
                } while (true);
                for (; n < nS; n++) {
                    {
                        let y: number = 0;
                        for (let position: number = n + M - nS; position < M; position++) {
                            y +=
                                ((((n => (n < 0 ? Math.ceil(n) : Math.floor(n)))(SoundTrackInstrument.buffer[
                                    n + M - 1 - position
                                ] as number) *
                                    (n => (n < 0 ? Math.ceil(n) : Math.floor(n)))(SoundFilter.coefficient[0][position] as number)) >>
                                    16) as number) | 0;
                        }
                        for (let position: number = 0; position < N; position++) {
                            y -=
                                ((((n => (n < 0 ? Math.ceil(n) : Math.floor(n)))(SoundTrackInstrument.buffer[n - 1 - position] as number) *
                                    (n => (n < 0 ? Math.ceil(n) : Math.floor(n)))(SoundFilter.coefficient[1][position] as number)) >>
                                    16) as number) | 0;
                        }
                        SoundTrackInstrument.buffer[n] = y;
                        this.filterEnvelope.step(nS + 1);
                    }
                }
            }
        }
        for (let position: number = 0; position < nS; position++) {
            {
                if (SoundTrackInstrument.buffer[position] < -32768) {
                    SoundTrackInstrument.buffer[position] = -32768;
                }
                if (SoundTrackInstrument.buffer[position] > 32767) {
                    SoundTrackInstrument.buffer[position] = 32767;
                }
            }
        }
        return SoundTrackInstrument.buffer;
    }

    public evaluateWave(amplitude: number, phase: number, table: number): number {
        if (table === 1) {
            if ((phase & 32767) < 16384) {
                return amplitude;
            } else {
                return -amplitude;
            }
        }
        if (table === 2) {
            return (SoundTrackInstrument.sine[phase & 32767] * amplitude) >> 14;
        }
        if (table === 3) {
            return (((phase & 32767) * amplitude) >> 14) - amplitude;
        }
        if (table === 4) {
            return SoundTrackInstrument.noise[((phase / 2607) | 0) & 32767] * amplitude;
        } else {
            return 0;
        }
    }

    public decode(buffer: Buffer) {
        this.pitchEnvelope = new SoundTrackEnvelope();
        this.pitchEnvelope.decode(buffer);
        this.volumeEnvelope = new SoundTrackEnvelope();
        this.volumeEnvelope.decode(buffer);
        let option: number = buffer.getUnsignedByte();
        if (option !== 0) {
            buffer.currentPosition--;
            this.pitchModEnvelope = new SoundTrackEnvelope();
            this.pitchModEnvelope.decode(buffer);
            this.pitchModAmpEnvelope = new SoundTrackEnvelope();
            this.pitchModAmpEnvelope.decode(buffer);
        }
        option = buffer.getUnsignedByte();
        if (option !== 0) {
            buffer.currentPosition--;
            this.volumeModEnvelope = new SoundTrackEnvelope();
            this.volumeModEnvelope.decode(buffer);
            this.volumeModAmpEnvelope = new SoundTrackEnvelope();
            this.volumeModAmpEnvelope.decode(buffer);
        }
        option = buffer.getUnsignedByte();
        if (option !== 0) {
            buffer.currentPosition--;
            this.gatingReleaseEnvelope = new SoundTrackEnvelope();
            this.gatingReleaseEnvelope.decode(buffer);
            this.gatingAttackEnvelope = new SoundTrackEnvelope();
            this.gatingAttackEnvelope.decode(buffer);
        }
        for (let oscillId: number = 0; oscillId < 10; oscillId++) {
            {
                const volume: number = buffer.getSmart();
                if (volume === 0) {
                    break;
                }
                this.oscillVolume[oscillId] = volume;
                this.oscillPitchDelta[oscillId] = buffer.getSignedSmart();
                this.oscillDelay[oscillId] = buffer.getSmart();
            }
        }
        this.delayTime = buffer.getSmart();
        this.delayFeedback = buffer.getSmart();
        this.soundMillis = buffer.getUnsignedLEShort();
        this.pauseMillis = buffer.getUnsignedLEShort();
        this.filter = new SoundFilter();
        this.filterEnvelope = new SoundTrackEnvelope();
        this.filter.decode(this.filterEnvelope, buffer);
    }
}

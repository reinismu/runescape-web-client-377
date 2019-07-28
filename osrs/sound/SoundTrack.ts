import { Buffer } from "../net/Buffer";
import { SoundTrackInstrument } from "./SoundTrackInstrument";

export class SoundTrack {

    public static aByte664: number = 6;

    public static tracks: SoundTrack[] = Array(5000).fill(null);
    public static trackDelays: number[] = Array(5000).fill(0);
    public static _buffer: number[] = null;

    public static buffer: Buffer = null;
    
    public static load(buffer: Buffer) {
        SoundTrack._buffer = ((s) => { const a = []; while (s-- > 0) { a.push(0); } return a; })(441000);
        SoundTrack.buffer = new Buffer(SoundTrack._buffer);
        SoundTrackInstrument.decode();
        while ((true)) {{
            const trackId: number = buffer.getUnsignedLEShort();
            if (trackId === 65535) { return; }
            SoundTrack.tracks[trackId] = new SoundTrack(-524);
            SoundTrack.tracks[trackId].decode(buffer);
            SoundTrack.trackDelays[trackId] = SoundTrack.tracks[trackId].delay();
        }}
    }

    public static data(trackId: number, loops: number): Buffer {
        if (SoundTrack.tracks[trackId] != null) {
            const soundTrack: SoundTrack = SoundTrack.tracks[trackId];
            return soundTrack.encode(loops);
        } else {
            return null;
        }
    }

    public instruments: SoundTrackInstrument[] = [null, null, null, null, null, null, null, null, null, null];

    public loopBegin: number;

    public loopEnd: number;

    public constructor(i: number) {
        if (this.loopBegin === undefined) { this.loopBegin = 0; }
        if (this.loopEnd === undefined) { this.loopEnd = 0; }
        while ((i >= 0)) {{
            throw Error("NullPointerException");
        }}
    }

    public decode(buffer: Buffer) {
        for (let instrument: number = 0; instrument < 10; instrument++) {{
            const active: number = buffer.getUnsignedByte();
            if (active !== 0) {
                buffer.currentPosition--;
                this.instruments[instrument] = new SoundTrackInstrument();
                this.instruments[instrument].decode(buffer);
            }
        }}
        this.loopBegin = buffer.getUnsignedLEShort();
        this.loopEnd = buffer.getUnsignedLEShort();
    }

    public delay(): number {
        let delay: number = 9999999;
        for (let instrument: number = 0; instrument < 10; instrument++) {if (this.instruments[instrument] != null && (this.instruments[instrument].pauseMillis / 20 | 0) < delay) { delay = (this.instruments[instrument].pauseMillis / 20 | 0); }}
        if (this.loopBegin < this.loopEnd && (this.loopBegin / 20 | 0) < delay) { delay = (this.loopBegin / 20 | 0); }
        if (delay === 9999999 || delay === 0) { return 0; }
        for (let instrument: number = 0; instrument < 10; instrument++) {if (this.instruments[instrument] != null) { this.instruments[instrument].pauseMillis -= delay * 20; }}
        if (this.loopBegin < this.loopEnd) {
            this.loopBegin -= delay * 20;
            this.loopEnd -= delay * 20;
        }
        return delay;
    }

    public encode(j: number): Buffer {
        const size: number = this.mix(j);
        SoundTrack.buffer.currentPosition = 0;
        SoundTrack.buffer.putInt(1380533830);
        SoundTrack.buffer.putLEInt(36 + size);
        SoundTrack.buffer.putInt(1463899717);
        SoundTrack.buffer.putInt(1718449184);
        SoundTrack.buffer.putLEInt(16);
        SoundTrack.buffer.putLEShort(1);
        SoundTrack.buffer.putLEShort(1);
        SoundTrack.buffer.putLEInt(22050);
        SoundTrack.buffer.putLEInt(22050);
        SoundTrack.buffer.putLEShort(1);
        SoundTrack.buffer.putLEShort(8);
        SoundTrack.buffer.putInt(1684108385);
        SoundTrack.buffer.putLEInt(size);
        SoundTrack.buffer.currentPosition += size;
        return SoundTrack.buffer;
    }

    public mix(loops: number): number {
        let millis: number = 0;
        for (let instrument: number = 0; instrument < 10; instrument++) {if (this.instruments[instrument] != null && this.instruments[instrument].soundMillis + this.instruments[instrument].pauseMillis > millis) { millis = this.instruments[instrument].soundMillis + this.instruments[instrument].pauseMillis; }}
        if (millis === 0) { return 0; }
        let nS: number = ((22050 * millis) / 1000 | 0);
        let loopBegin: number = ((22050 * this.loopBegin) / 1000 | 0);
        let loopEnd: number = ((22050 * this.loopEnd) / 1000 | 0);
        if (loopBegin < 0 || loopBegin > nS || loopEnd < 0 || loopEnd > nS || loopBegin >= loopEnd) { loops = 0; }
        let length: number = nS + (loopEnd - loopBegin) * (loops - 1);
        for (let position: number = 44; position < length + 44; position++) {SoundTrack._buffer[position] = -128; }
        for (let instrument: number = 0; instrument < 10; instrument++) {if (this.instruments[instrument] != null) {
            const soundSamples: number = ((this.instruments[instrument].soundMillis * 22050) / 1000 | 0);
            const pauseSamples: number = ((this.instruments[instrument].pauseMillis * 22050) / 1000 | 0);
            const samples: number[] = this.instruments[instrument].synthesize(soundSamples, this.instruments[instrument].soundMillis);
            for (let soundSample: number = 0; soundSample < soundSamples; soundSample++) {{
                let sample: number = (SoundTrack._buffer[soundSample + pauseSamples + 44] & 255) + (samples[soundSample] >> 8);
                if ((sample & -256) !== 0) { sample = ~(sample >> 31); }
                SoundTrack._buffer[soundSample + pauseSamples + 44] = ((sample as number) | 0);
            }}
        }}
        if (loops > 1) {
            loopBegin += 44;
            loopEnd += 44;
            nS += 44;
            let offset: number = (length += 44) - nS;
            for (let position: number = nS - 1; position >= loopEnd; position--) {SoundTrack._buffer[position + offset] = SoundTrack._buffer[position]; }
            for (let loopCounter: number = 1; loopCounter < loops; loopCounter++) {{
                offset = (loopEnd - loopBegin) * loopCounter;
                for (let position: number = loopBegin; position < loopEnd; position++) {SoundTrack._buffer[position + offset] = SoundTrack._buffer[position]; }
            }}
            length -= 44;
        }
        return length;
    }
}
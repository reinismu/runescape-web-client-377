/**
 * Initializes the sound player.
 *
 * @param {InputStream} stream
 * @param {number} level
 * @param {number} delay
 * @class
 */
export class SoundPlayer {

    public static volume: number = 0;

    /**
     * Sets the client's volume level.
     *
     * @param {number} level
     */
    public static setVolume(level: number) {
        SoundPlayer.volume = level;
    }

    /**
     * Returns the client's volume level.
     * @return {number}
     */
    public static getVolume(): number {
        return SoundPlayer.volume;
    }
    /*private*/ public stream: any;// AudioInputStream;

    /*private*/ public info: any;// DataLine.Info;

    /*private*/ public sound: any;// Clip;

    /*private*/ public soundStream: any;// InputStream;

    /*private*/ public player: any;// java.lang.Thread;

    /*private*/ public delay: number;

    /*private*/ public soundLevel: number;

    public constructor(stream: any, level: number, delay: number) {
        if (this.stream === undefined) { this.stream = null; }
        if (this.info === undefined) { this.info = null; }
        if (this.sound === undefined) { this.sound = null; }
        if (this.soundStream === undefined) { this.soundStream = null; }
        if (this.player === undefined) { this.player = null; }
        if (this.delay === undefined) { this.delay = 0; }
        if (this.soundLevel === undefined) { this.soundLevel = 0; }
        if (level === 0 || SoundPlayer.volume === 4 || level - SoundPlayer.volume <= 0) {
            return;
        }
        this.soundStream = stream;
        this.soundLevel = level;
        this.delay = delay;
        // this.player = new java.lang.Thread((this) as any);
        // this.player.start();
    }

    /**
     * Plays the sound.
     */
    public run() {
        // try {
        //     this.stream = AudioSystem.getAudioInputStream(this.soundStream);
        //     this.info = new DataLine.Info("javax.sound.sampled.Clip", this.stream.getFormat());
        //     this.sound = AudioSystem.getLine(this.info) as any as Clip;
        //     this.sound.open(this.stream);
        //     const volume: FloatControl = this.sound.getControl(FloatControl.Type.MASTER_GAIN) as FloatControl;
        //     volume.setValue(this.getDecibels(this.soundLevel - SoundPlayer.getVolume()));
        //     if (this.delay > 0) {
        //         java.lang.Thread.sleep(this.delay);
        //     }
        //     this.sound.start();
        //     while ((this.sound.isActive())) {{
        //         java.lang.Thread.sleep(250);
        //     }}
        //     java.lang.Thread.sleep(10000);
        //     this.sound.close();
        //     this.stream.close();
        //     this.player.interrupt();
        // } catch (e) {
        //     this.player.interrupt();
        //     console.error(e.message, e);
        // }
    }

    /**
     * Returns the decibels for a given volume level.
     *
     * @param {number} level
     * @return
     * @return {number}
     */
    public getDecibels(level: number): number {
        switch ((level)) {
        case 1:
            return (Math as any).fround(-80.0);
        case 2:
            return (Math as any).fround(-70.0);
        case 3:
            return (Math as any).fround(-60.0);
        case 4:
            return (Math as any).fround(-50.0);
        case 5:
            return (Math as any).fround(-40.0);
        case 6:
            return (Math as any).fround(-30.0);
        case 7:
            return (Math as any).fround(-20.0);
        case 8:
            return (Math as any).fround(-10.0);
        case 9:
            return (Math as any).fround(-0.0);
        case 10:
            return (Math as any).fround(6.0);
        default:
            return (Math as any).fround(0.0);
        }
    }
}

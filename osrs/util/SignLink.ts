import { Socket } from "../net/Socket";

export enum Position {
    LEFT,
    RIGHT
}

export class SignLink {
    public static CLIENT_REVISION: number = 377;

    public static uid: number = 0;

    public static storeId: number = 32;

    public static active: boolean = false;

    public static threadLiveId: number = ((Math.random() * 9.9999999e7) as number) | 0;;

    public static inetAddress: string = "";

    public static socketRequest: number = 0;

    public static socket: Socket = null;

    public static threadRequestPriority: number = 1;

    public static dnsRequest: string = null;

    public static dns: string = null;

    public static urlRequest: string = null;

    // public static urlStream: DataInputStream = null;

    public static saveLength: number = 0;

    public static saveRequest: string = null;

    public static saveBuffer: number[] = null;

    public static play: boolean = false;

    public static midiPosition: number = 0;

    public static midi: string = null;

    public static midiVolume: number = 0;

    public static fadeMidi: number = 0;

    public static midiPlay: boolean = false;

    public static wavePosition: number = 0;

    public static waveVolume: number = 0;

    public static __reportError: boolean = true;

    public static errorName: string = "";

    // public static music: Sequencer = null;

    // public static synthesizer: Synthesizer = null;

    public static initialize(address: string) {
        SignLink.threadLiveId = ((Math.random() * 9.9999999e7) as number) | 0;
        SignLink.dnsRequest = null;
        SignLink.saveRequest = null;
        SignLink.urlRequest = null;
        SignLink.inetAddress = address;
        // const thread: java.lang.Thread = new java.lang.Thread(() => new SignLink().run());
        // thread.setDaemon(true);
        // thread.start();
    }

    /**
     * Sets the volume for the midi synthesizer.
     *
     * @param {number} value
     */
    public static setVolume(value: number) {
        // const CHANGE_VOLUME: number = 7;
        // SignLink.midiVolume = value;
        // if (SignLink.synthesizer.getDefaultSoundbank() == null) {
        //     try {
        //         const volumeMessage: ShortMessage = new ShortMessage();
        //         for (let i: number = 0; i < 16; i++) {
        //             {
        //                 volumeMessage.setMessage(ShortMessage.CONTROL_CHANGE, i, CHANGE_VOLUME, SignLink.midiVolume);
        //                 volumeMessage.setMessage(ShortMessage.CONTROL_CHANGE, i, 39, SignLink.midiVolume);
        //                 MidiSystem.getReceiver().send(volumeMessage, -1);
        //             }
        //         }
        //     } catch (e) {
        //         console.error(e.message, e);
        //     }
        // } else {
        //     const channels: MidiChannel[] = SignLink.synthesizer.getChannels();
        //     for (let c: number = 0; channels != null && c < channels.length; c++) {
        //         {
        //             channels[c].controlChange(CHANGE_VOLUME, SignLink.midiVolume);
        //             channels[c].controlChange(39, SignLink.midiVolume);
        //         }
        //     }
        // }
    }

    public static getUID(location: string): number {
        return 1;
    }

    // public static openURL(url: string): DataInputStream {
    //     for (SignLink.urlRequest = url; SignLink.urlRequest != null; ) {
    //         {
    //             try {
    //                 java.lang.Thread.sleep(50);
    //             } catch (ignored) {}
    //         }
    //     }
    //     if (SignLink.urlStream == null) {
    //         throw new IOException("could not open: " + url);
    //     } else {
    //         return SignLink.urlStream;
    //     }
    // }

    public static dnsLookup(host: string) {
        SignLink.dns = host;
        SignLink.dnsRequest = host;
    }

    public static saveWave(data: number[], length: number): boolean {
        if (length > 2000000 || SignLink.saveRequest != null) {
            return false;
        }
        SignLink.wavePosition = (SignLink.wavePosition + 1) % 5;
        SignLink.saveLength = length;
        SignLink.saveBuffer = data;
        SignLink.midiPlay = true;
        SignLink.saveRequest = "sound" + SignLink.wavePosition + ".wav";
        return true;
    }

    public static replayWave(): boolean {
        if (SignLink.saveRequest != null) {
            return false;
        }
        SignLink.saveBuffer = null;
        SignLink.midiPlay = true;
        SignLink.saveRequest = "sound" + SignLink.wavePosition + ".wav";
        return true;
    }

    public static saveMidi(data: number[], length: number) {
        if (length > 2000000 || SignLink.saveRequest != null) {
            return;
        }
        SignLink.midiPosition = (SignLink.midiPosition + 1) % 5;
        SignLink.saveLength = length;
        SignLink.saveBuffer = data;
        SignLink.play = true;
        SignLink.saveRequest = "jingle" + SignLink.midiPosition + ".mid";
    }

    public static reportError(error: string) {
        console.info("Error: " + error);
        // throw Error("reportError");
    }

    /*private*/ public curPosition: Position;

    constructor() {
        if (this.curPosition === undefined) {
            this.curPosition = null;
        }
    }

    public run() {
        // SignLink.active = true;

        // for (const i: number = SignLink.threadLiveId; SignLink.threadLiveId === i; ) {
        //     {
        //         if (SignLink.socketRequest !== 0) {
        //             try {
        //                 SignLink.socket = new Socket(SignLink.inetAddress, SignLink.socketRequest);
        //             } catch (_ex) {
        //                 SignLink.socket = null;
        //             }
        //             SignLink.socketRequest = 0;
        //         } else if (SignLink.threadRequest != null) {
        //             const thread: java.lang.Thread = new java.lang.Thread(SignLink.threadRequest as any);
        //             thread.setDaemon(true);
        //             thread.start();
        //             thread.setPriority(SignLink.threadRequestPriority);
        //             SignLink.threadRequest = null as any;
        //         } else if (SignLink.dnsRequest != null) {
        //             try {
        //                 SignLink.dns = InetAddress.getByName(SignLink.dnsRequest).getHostName();
        //             } catch (_ex) {
        //                 SignLink.dns = "unknown";
        //             }
        //             SignLink.dnsRequest = null;
        //         } else if (SignLink.saveRequest != null) {
        //             if (SignLink.saveBuffer != null) {
        //                 try {
        //                     const fileoutputstream: FileOutputStream = new FileOutputStream(directory + SignLink.saveRequest);
        //                     fileoutputstream.write(SignLink.saveBuffer, 0, SignLink.saveLength);
        //                     fileoutputstream.close();
        //                 } catch (ignored) {}
        //             }
        //             if (SignLink.midiPlay) {
        //                 const wave: string = directory + SignLink.saveRequest;
        //                 SignLink.midiPlay = false;
        //                 let audioInputStream: AudioInputStream;
        //                 try {
        //                     audioInputStream = AudioSystem.getAudioInputStream(new File(wave));
        //                 } catch (e) {
        //                     console.error(e.message, e);
        //                     return;
        //                 }
        //                 const format: AudioFormat = audioInputStream.getFormat();
        //                 const info: DataLine.Info = new DataLine.Info("javax.sound.sampled.SourceDataLine", format);
        //                 let audioLine: SourceDataLine;
        //                 try {
        //                     audioLine = (AudioSystem.getLine(info) as any) as SourceDataLine;
        //                     audioLine.open(format);
        //                 } catch (e) {
        //                     console.error(e.message, e);
        //                     return;
        //                 }
        //                 if (audioLine.isControlSupported(FloatControl.Type.PAN)) {
        //                     const pan: FloatControl = audioLine.getControl(FloatControl.Type.PAN) as FloatControl;
        //                     if (this.curPosition === SignLink.Position.RIGHT) {
        //                         pan.setValue(1.0);
        //                     } else if (this.curPosition === SignLink.Position.LEFT) {
        //                         pan.setValue(-1.0);
        //                     }
        //                 }
        //                 audioLine.start();
        //                 let nBytesRead: number = 0;
        //                 const abData: number[] = (s => {
        //                     const a = [];
        //                     while (s-- > 0) {
        //                         a.push(0);
        //                     }
        //                     return a;
        //                 })(524288);
        //                 try {
        //                     while (nBytesRead !== -1) {
        //                         {
        //                             nBytesRead = audioInputStream.read(abData, 0, abData.length);
        //                             if (nBytesRead >= 0) {
        //                                 audioLine.write(abData, 0, nBytesRead);
        //                             }
        //                         }
        //                     }
        //                 } catch (e) {
        //                     console.error(e.message, e);
        //                     return;
        //                 } finally {
        //                     audioLine.drain();
        //                     audioLine.close();
        //                 }
        //             }
        //             if (SignLink.play) {
        //                 SignLink.midi = directory + SignLink.saveRequest;
        //                 try {
        //                     if (SignLink.music != null) {
        //                         SignLink.music.stop();
        //                         SignLink.music.close();
        //                     }
        //                     this.playMidi(SignLink.midi);
        //                 } catch (ex) {
        //                     console.error(ex.message, ex);
        //                 }
        //                 SignLink.play = false;
        //             }
        //             SignLink.saveRequest = null;
        //         } else if (SignLink.urlRequest != null) {
        //             try {
        //                 console.info("urlStream");
        //                 SignLink.urlStream = new DataInputStream(
        //                     (new URL(SignLink.applet.getCodeBase(), SignLink.urlRequest) as URL).openStream()
        //                 );
        //             } catch (_ex) {
        //                 SignLink.urlStream = null;
        //             }
        //             SignLink.urlRequest = null;
        //         }
        //         try {
        //             java.lang.Thread.sleep(50);
        //         } catch (ignored) {}
        //     }
        // }
    }

    /**
     * Plays the specified midi sequence.
     *
     * @param {string} location
     * @private
     */
    public playMidi(location: string) {
        // let sequence: Sequence;
        // SignLink.music = null;
        // SignLink.synthesizer = null;
        // const midiFile: File = new File(location);
        // try {
        //     sequence = MidiSystem.getSequence(midiFile);
        //     SignLink.music = MidiSystem.getSequencer();
        //     SignLink.music.open();
        //     SignLink.music.setSequence(sequence);
        // } catch (e) {
        //     console.error("Problem loading MIDI file.");
        //     console.error(e.message, e);
        //     return;
        // }
        // if (
        //     SignLink.music != null &&
        //     ((SignLink.music.__interfaces != null && SignLink.music.__interfaces.indexOf("javax.sound.midi.Synthesizer") >= 0) ||
        //         (SignLink.music.constructor != null &&
        //             SignLink.music.constructor.__interfaces != null &&
        //             SignLink.music.constructor.__interfaces.indexOf("javax.sound.midi.Synthesizer") >= 0))
        // ) {
        //     SignLink.synthesizer = (SignLink.music as any) as Synthesizer;
        // } else {
        //     try {
        //         SignLink.synthesizer = MidiSystem.getSynthesizer();
        //         SignLink.synthesizer.open();
        //         if (SignLink.synthesizer.getDefaultSoundbank() == null) {
        //             SignLink.music.getTransmitter().setReceiver(MidiSystem.getReceiver());
        //         } else {
        //             SignLink.music.getTransmitter().setReceiver(SignLink.synthesizer.getReceiver());
        //         }
        //     } catch (e) {
        //         console.error(e.message, e);
        //         return;
        //     }
        // }
        // SignLink.music.setLoopCount(Sequencer.LOOP_CONTINUOUSLY);
        // SignLink.music.start();
    }
}

import { Buffer } from "../../net/Buffer";
import { Archive } from "../Archive";

export class Varp {
    public static count: number = 0;

    public static cache: Varp[] = null;

    public static currentIndex: number = 0;

    public static anIntArray706: number[] = null;

    public static load(archive: Archive) {
        const buffer: Buffer = new Buffer(archive.getFile("varp.dat"));
        Varp.currentIndex = 0;
        Varp.count = buffer.getUnsignedLEShort();
        if (Varp.cache == null) {
            Varp.cache = (s => {
                const a = [];
                while (s-- > 0) {
                    a.push(null);
                }
                return a;
            })(Varp.count);
        }
        if (Varp.anIntArray706 == null) {
            Varp.anIntArray706 = (s => {
                const a = [];
                while (s-- > 0) {
                    a.push(0);
                }
                return a;
            })(Varp.count);
        }
        for (let index: number = 0; index < Varp.count; index++) {
            {
                if (Varp.cache[index] == null) {
                    Varp.cache[index] = new Varp();
                }
                Varp.cache[index].loadDefinition(index, buffer);
            }
        }
        if (buffer.currentPosition !== buffer.buffer.length) {
            console.info("varptype load mismatch");
        }
    }

    public aString707: string;

    public anInt708: number;

    public anInt709: number;

    public aBoolean710: boolean = false;

    public aBoolean711: boolean = true;

    public anInt712: number;

    public aBoolean713: boolean = false;

    public anInt714: number;

    public anInt715: number;

    public aBoolean716: boolean = false;

    public anInt717: number = -1;

    public aBoolean718: boolean = true;

    constructor() {
        if (this.aString707 === undefined) {
            this.aString707 = null;
        }
        if (this.anInt708 === undefined) {
            this.anInt708 = 0;
        }
        if (this.anInt709 === undefined) {
            this.anInt709 = 0;
        }
        if (this.anInt712 === undefined) {
            this.anInt712 = 0;
        }
        if (this.anInt714 === undefined) {
            this.anInt714 = 0;
        }
        if (this.anInt715 === undefined) {
            this.anInt715 = 0;
        }
    }

    public loadDefinition(index: number, buffer: Buffer) {
        while (true) {
            {
                const attribute: number = buffer.getUnsignedByte();
                if (attribute === 0) {
                    return;
                }
                if (attribute === 1) {
                    this.anInt708 = buffer.getUnsignedByte();
                } else if (attribute === 2) {
                    this.anInt709 = buffer.getUnsignedByte();
                } else if (attribute === 3) {
                    this.aBoolean710 = true;
                    Varp.anIntArray706[Varp.currentIndex++] = index;
                } else if (attribute === 4) {
                    this.aBoolean711 = false;
                } else if (attribute === 5) {
                    this.anInt712 = buffer.getUnsignedLEShort();
                } else if (attribute === 6) {
                    this.aBoolean713 = true;
                } else if (attribute === 7) {
                    this.anInt714 = buffer.getInt();
                } else if (attribute === 8) {
                    this.anInt715 = 1;
                    this.aBoolean716 = true;
                } else if (attribute === 10) {
                    this.aString707 = buffer.getString();
                } else if (attribute === 11) {
                    this.aBoolean716 = true;
                } else if (attribute === 12) {
                    this.anInt717 = buffer.getInt();
                } else if (attribute === 13) {
                    this.anInt715 = 2;
                    this.aBoolean716 = true;
                } else if (attribute === 14) {
                    this.aBoolean718 = false;
                } else {
                    console.info("Error unrecognised config code: " + attribute);
                }
            }
        }
    }
}

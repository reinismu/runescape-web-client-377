import { Buffer } from "../../net/Buffer";
import { Archive } from "../Archive";
import { Varp } from "./Varp";

export class Varbit {
    public static count: number = 0;

    public static cache: Varbit[] = null;

    public static load(archive: Archive) {
        const buffer: Buffer = new Buffer(archive.getFile("varbit.dat"));
        Varbit.count = buffer.getUnsignedLEShort();
        if (Varbit.cache == null) {
            Varbit.cache = (s => {
                const a = [];
                while (s-- > 0) {
                    a.push(null);
                }
                return a;
            })(Varbit.count);
        }
        for (let index: number = 0; index < Varbit.count; index++) {
            {
                if (Varbit.cache[index] == null) {
                    Varbit.cache[index] = new Varbit();
                }
                Varbit.cache[index].init(buffer);
                if (Varbit.cache[index].aBoolean829) {
                    Varp.cache[Varbit.cache[index].configId].aBoolean716 = true;
                }
            }
        }
        if (buffer.currentPosition !== buffer.buffer.length) {
            console.info("varbit load mismatch");
        }
    }

    public configId: number;

    public leastSignificantBit: number;

    public mostSignificantBit: number;

    public aBoolean829: boolean = false;

    public aBoolean832: boolean = true;

    constructor() {
        if (this.configId === undefined) {
            this.configId = 0;
        }
        if (this.leastSignificantBit === undefined) {
            this.leastSignificantBit = 0;
        }
        if (this.mostSignificantBit === undefined) {
            this.mostSignificantBit = 0;
        }
    }

    public init(buf: Buffer) {
        while (true) {
            {
                const attribute: number = buf.getUnsignedByte();
                if (attribute === 0) {
                    return;
                }
                if (attribute === 1) {
                    this.configId = buf.getUnsignedLEShort();
                    this.leastSignificantBit = buf.getUnsignedByte();
                    this.mostSignificantBit = buf.getUnsignedByte();
                } else if (attribute === 10) {
                    buf.getString();
                } else if (attribute === 2) {
                    this.aBoolean829 = true;
                } else if (attribute === 3) {
                    buf.getInt();
                } else if (attribute === 4) {
                    buf.getInt();
                } else if (attribute === 5) {
                    this.aBoolean832 = false;
                } else {
                    console.info("Error unrecognised config code: " + attribute);
                }
            }
        }
    }
}

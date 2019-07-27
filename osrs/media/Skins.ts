import { Buffer } from "../net/Buffer";

export class Skins {
    public count: number;

    public opcodes: number[];

    public skinList: number[][];

    public constructor(buffer: Buffer) {
        if (this.count === undefined) { this.count = 0; }
        if (this.opcodes === undefined) { this.opcodes = null; }
        if (this.skinList === undefined) { this.skinList = null; }
        this.count = buffer.getUnsignedByte();
        this.opcodes = ((s) => { const a = []; while (s-- > 0) { a.push(0); } return a; })(this.count);
        this.skinList = ((s) => { const a = []; while (s-- > 0) { a.push(null); } return a; })(this.count);
        for (let opcode: number = 0; opcode < this.count; opcode++) {this.opcodes[opcode] = buffer.getUnsignedByte(); }
        for (let skin: number = 0; skin < this.count; skin++) {{
            const subSkinAmount: number = buffer.getUnsignedByte();
            this.skinList[skin] = ((s) => { const a = []; while (s-- > 0) { a.push(0); } return a; })(subSkinAmount);
            for (let subSkin: number = 0; subSkin < subSkinAmount; subSkin++) {this.skinList[skin][subSkin] = buffer.getUnsignedByte(); }
        }}
    }
}

import { Animation } from "../../media/Animation";
import { Buffer } from "../../net/Buffer";
import { Archive } from "../Archive";

export class AnimationSequence {
    public static count: number = 0;

    public static animations: AnimationSequence[] = null;

    public static load(archive: Archive) {
        const buffer: Buffer = new Buffer(archive.getFile("seq.dat"));
        AnimationSequence.count = buffer.getUnsignedLEShort();
        if (AnimationSequence.animations == null) { AnimationSequence.animations = ((s) => { const a = []; while (s-- > 0) { a.push(null); } return a; })(AnimationSequence.count); }
        for (let animation: number = 0; animation < AnimationSequence.count; animation++) {{
            if (AnimationSequence.animations[animation] == null) { AnimationSequence.animations[animation] = new AnimationSequence(); }
            AnimationSequence.animations[animation].loadDefinition(buffer);
        }}
    }

    public frameCount: number;

    public getPrimaryFrame: number[];

    public frame1Ids: number[];

    public frameLenghts: number[];

    public frameStep: number = -1;

    public flowControl: number[];

    public aBoolean300: boolean = false;

    public anInt301: number = 5;

    public getPlayerShieldDelta: number = -1;

    public getPlayerWeaponDelta: number = -1;

    public anInt304: number = 99;

    public anInt305: number = -1;

    public priority: number = -1;

    public anInt307: number = 2;

    constructor() {
        if (this.frameCount === undefined) { this.frameCount = 0; }
        if (this.getPrimaryFrame === undefined) { this.getPrimaryFrame = null; }
        if (this.frame1Ids === undefined) { this.frame1Ids = null; }
        if (this.frameLenghts === undefined) { this.frameLenghts = null; }
        if (this.flowControl === undefined) { this.flowControl = null; }
    }

    public getFrameLength(animationId: number): number {
        let frameLength: number = this.frameLenghts[animationId];
        if (frameLength === 0) {
            const animation: Animation = Animation.getAnimation(this.getPrimaryFrame[animationId]);
            if (animation != null) { frameLength = this.frameLenghts[animationId] = animation.anInt431; }
        }
        if (frameLength === 0) { frameLength = 1; }
        return frameLength;
    }

    public loadDefinition(buf: Buffer) {
        while ((true)) {{
            const attributeId: number = buf.getUnsignedByte();
            if (attributeId === 0) { break; }
            switch ((attributeId)) {
            case 1:
                this.frameCount = buf.getUnsignedByte();
                this.getPrimaryFrame = ((s) => { const a = []; while (s-- > 0) { a.push(0); } return a; })(this.frameCount);
                this.frame1Ids = ((s) => { const a = []; while (s-- > 0) { a.push(0); } return a; })(this.frameCount);
                this.frameLenghts = ((s) => { const a = []; while (s-- > 0) { a.push(0); } return a; })(this.frameCount);
                for (let frame: number = 0; frame < this.frameCount; frame++) {{
                    this.getPrimaryFrame[frame] = buf.getUnsignedLEShort();
                    this.frame1Ids[frame] = buf.getUnsignedLEShort();
                    if (this.frame1Ids[frame] === 65535) { this.frame1Ids[frame] = -1; }
                    this.frameLenghts[frame] = buf.getUnsignedLEShort();
                }}
                break;
            case 2:
                this.frameStep = buf.getUnsignedLEShort();
                break;
            case 3:
                const flowCount: number = buf.getUnsignedByte();
                this.flowControl = ((s) => { const a = []; while (s-- > 0) { a.push(0); } return a; })(flowCount + 1);
                for (let flow: number = 0; flow < flowCount; flow++) {this.flowControl[flow] = buf.getUnsignedByte(); }
                this.flowControl[flowCount] = 9999999;
                break;
            case 4:
                this.aBoolean300 = true;
                break;
            case 5:
                this.anInt301 = buf.getUnsignedByte();
                break;
            case 6:
                this.getPlayerShieldDelta = buf.getUnsignedLEShort();
                break;
            case 7:
                this.getPlayerWeaponDelta = buf.getUnsignedLEShort();
                break;
            case 8:
                this.anInt304 = buf.getUnsignedByte();
                break;
            case 9:
                this.anInt305 = buf.getUnsignedByte();
                break;
            case 10:
                this.priority = buf.getUnsignedByte();
                break;
            case 11:
                this.anInt307 = buf.getUnsignedByte();
                break;
            case 12:
                buf.getInt();
                break;
            default:
                console.info("Error unrecognised seq config code: " + attributeId);
                break;
            }
        }}
        if (this.frameCount === 0) {
            this.frameCount = 1;
            this.getPrimaryFrame = [0];
            this.getPrimaryFrame[0] = -1;
            this.frame1Ids = [0];
            this.frame1Ids[0] = -1;
            this.frameLenghts = [0];
            this.frameLenghts[0] = -1;
        }
        if (this.anInt305 === -1) { if (this.flowControl != null) { this.anInt305 = 2; } else { this.anInt305 = 0; } }
        if (this.priority === -1) {
            if (this.flowControl != null) {
                this.priority = 2;
                return;
            }
            this.priority = 0;
        }
    }
}

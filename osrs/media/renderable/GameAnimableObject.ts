import { AnimationSequence } from "../../cache/media/AnimationSequence";
import { SpotAnimation } from "../../cache/media/SpotAnimation";
import { Animation } from "../Animation";
import { Model } from "./Model";
import { Renderable } from "./Renderable";

export class GameAnimableObject extends Renderable {
    public plane: number;

    public x: number;

    public y: number;

    public z: number;

    public transformCompleted: boolean = false;

    public eclapsedFrames: number;

    public duration: number;

    public animation: SpotAnimation;

    public loopCycle: number;

    public constructor(plane: number, loopCycle: number, loopCycleOffset: number, animationIndex: number, z: number, y: number, x: number) {
        super();
        if (this.plane === undefined) { this.plane = 0; }
        if (this.x === undefined) { this.x = 0; }
        if (this.y === undefined) { this.y = 0; }
        if (this.z === undefined) { this.z = 0; }
        if (this.eclapsedFrames === undefined) { this.eclapsedFrames = 0; }
        if (this.duration === undefined) { this.duration = 0; }
        if (this.animation === undefined) { this.animation = null; }
        if (this.loopCycle === undefined) { this.loopCycle = 0; }
        this.animation = SpotAnimation.cache[animationIndex];
        this.plane = plane;
        this.x = x;
        this.y = y;
        this.z = z;
        this.loopCycle = loopCycle + loopCycleOffset;
        this.transformCompleted = false;
    }

    public nextFrame(frame: number) {
        this.duration += frame;
        while ((this.duration > this.animation.sequences.getFrameLength(this.eclapsedFrames))) {{
            this.duration -= this.animation.sequences.getFrameLength(this.eclapsedFrames);
            this.eclapsedFrames++;
            if (this.eclapsedFrames >= this.animation.sequences.frameCount && (this.eclapsedFrames < 0 || this.eclapsedFrames >= this.animation.sequences.frameCount)) {
                this.eclapsedFrames = 0;
                this.transformCompleted = true;
            }
        }}
    }

    /**
     *
     * @return {Model}
     */
    public getRotatedModel(): Model {
        const model: Model = this.animation.getModel();
        if (model == null) { return null; }
        const frame: number = this.animation.sequences.getPrimaryFrame[this.eclapsedFrames];
        const animatedModel: Model = new Model(true, model, Animation.exists(frame));
        if (!this.transformCompleted) {
            animatedModel.createBones();
            animatedModel.applyTransform(frame);
            animatedModel.triangleSkin = null;
            animatedModel.vectorSkin = null;
        }
        if (this.animation.resizeXY !== 128 || this.animation.resizeZ !== 128) { animatedModel.scaleT(this.animation.resizeZ, this.animation.resizeXY, 9, this.animation.resizeXY); }
        if (this.animation.rotation !== 0) {
            if (this.animation.rotation === 90) { animatedModel.rotate90Degrees(); }
            if (this.animation.rotation === 180) {
                animatedModel.rotate90Degrees();
                animatedModel.rotate90Degrees();
            }
            if (this.animation.rotation === 270) {
                animatedModel.rotate90Degrees();
                animatedModel.rotate90Degrees();
                animatedModel.rotate90Degrees();
            }
        }
        animatedModel.applyLighting(64 + this.animation.modelLightFalloff, 850 + this.animation.modelLightAmbient, -30, -50, -30, true);
        return animatedModel;
    }
}

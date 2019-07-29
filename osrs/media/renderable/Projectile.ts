import { AnimationSequence } from "../../cache/media/AnimationSequence";
import { SpotAnimation } from "../../cache/media/SpotAnimation";
import { Animation } from "../Animation";
import { Model } from "./Model";
import { Renderable } from "./Renderable";

export class Projectile extends Renderable {
    public animation: SpotAnimation;

    public sceneId: number;

    public currentX: number;

    public currentY: number;

    public currentHeight: number;

    public startSlope: number;

    public startDistanceFromTarget: number;

    public targetedEntityId: number;

    public aBoolean1561: boolean;

    public anInt1562: number;

    public anInt1563: number;

    public delay: number;

    public endCycle: number;

    public animationFrame: number;

    public duration: number;

    public speedVectorX: number;

    public speedVectorY: number;

    public speedVectorScalar: number;

    public speedVectorZ: number;

    public aBoolean1573: boolean;

    public heightOffset: number;

    public moving: boolean;

    public startX: number;

    public startY: number;

    public startHeight: number;

    public endHeight: number;

    public constructor(sceneId: number, endHeight: number, startDistanceFromTarget: number, projectileY: number, i1: number, speed: number, startSlope: number, targetedEntityIndex: number, height: number, projectileX: number, delay: number) {
        super();
        if (this.animation === undefined) { this.animation = null; }
        if (this.sceneId === undefined) { this.sceneId = 0; }
        if (this.currentX === undefined) { this.currentX = 0; }
        if (this.currentY === undefined) { this.currentY = 0; }
        if (this.currentHeight === undefined) { this.currentHeight = 0; }
        if (this.startSlope === undefined) { this.startSlope = 0; }
        if (this.startDistanceFromTarget === undefined) { this.startDistanceFromTarget = 0; }
        if (this.targetedEntityId === undefined) { this.targetedEntityId = 0; }
        if (this.aBoolean1561 === undefined) { this.aBoolean1561 = false; }
        if (this.anInt1562 === undefined) { this.anInt1562 = 0; }
        if (this.anInt1563 === undefined) { this.anInt1563 = 0; }
        if (this.delay === undefined) { this.delay = 0; }
        if (this.endCycle === undefined) { this.endCycle = 0; }
        if (this.animationFrame === undefined) { this.animationFrame = 0; }
        if (this.duration === undefined) { this.duration = 0; }
        if (this.speedVectorX === undefined) { this.speedVectorX = 0; }
        if (this.speedVectorY === undefined) { this.speedVectorY = 0; }
        if (this.speedVectorScalar === undefined) { this.speedVectorScalar = 0; }
        if (this.speedVectorZ === undefined) { this.speedVectorZ = 0; }
        if (this.aBoolean1573 === undefined) { this.aBoolean1573 = false; }
        if (this.heightOffset === undefined) { this.heightOffset = 0; }
        if (this.moving === undefined) { this.moving = false; }
        if (this.startX === undefined) { this.startX = 0; }
        if (this.startY === undefined) { this.startY = 0; }
        if (this.startHeight === undefined) { this.startHeight = 0; }
        if (this.endHeight === undefined) { this.endHeight = 0; }
        this.aBoolean1561 = false;
        this.aBoolean1573 = true;
        this.animation = SpotAnimation.cache[i1];
        this.sceneId = sceneId;
        this.startX = projectileX;
        this.startY = projectileY;
        this.startHeight = height;
        this.delay = delay;
        this.endCycle = speed;
        this.startSlope = startSlope;
        this.startDistanceFromTarget = startDistanceFromTarget;
        this.targetedEntityId = targetedEntityIndex;
        this.endHeight = endHeight;
        this.moving = false;
    }

    public trackTarget(targetX: number, targetY: number, k: number, loopCycle: number) {
        if (!this.moving) {
            const distanceX: number = targetX - this.startX;
            const distanceY: number = targetY - this.startY;
            const distanceScalar: number = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
            this.currentX = this.startX + (distanceX * this.startDistanceFromTarget) / distanceScalar;
            this.currentY = this.startY + (distanceY * this.startDistanceFromTarget) / distanceScalar;
            this.currentHeight = this.startHeight;
        }
        const cyclesRemaining: number = (this.endCycle + 1) - loopCycle;
        this.speedVectorX = (targetX - this.currentX) / cyclesRemaining;
        this.speedVectorY = (targetY - this.currentY) / cyclesRemaining;
        this.speedVectorScalar = Math.sqrt(this.speedVectorX * this.speedVectorX + this.speedVectorY * this.speedVectorY);
        if (!this.moving) { this.speedVectorZ = -this.speedVectorScalar * Math.tan(this.startSlope * 0.02454369); }
        this.heightOffset = (2.0 * (k - this.currentHeight - this.speedVectorZ * cyclesRemaining)) / (cyclesRemaining * cyclesRemaining);
    }

    public move(time: number) {
        this.moving = true;
        this.currentX += this.speedVectorX * time;
        this.currentY += this.speedVectorY * time;
        this.currentHeight += this.speedVectorZ * time + 0.5 * this.heightOffset * time * time;
        this.speedVectorZ += this.heightOffset * time;
        this.anInt1562 = (((Math.atan2(this.speedVectorX, this.speedVectorY) * 325.949) as number) | 0) + 1024 & 2047;
        this.anInt1563 = (((Math.atan2(this.speedVectorZ, this.speedVectorScalar) * 325.949) as number) | 0) & 2047;
        if (this.animation.sequences != null) { for (this.duration += time; this.duration > this.animation.sequences.getFrameLength(this.animationFrame); ) {{
            this.duration -= this.animation.sequences.getFrameLength(this.animationFrame);
            this.animationFrame++;
            if (this.animationFrame >= this.animation.sequences.frameCount) { this.animationFrame = 0; }
        }}
        }
    }

    /**
     *
     * @return {Model}
     */
    public getRotatedModel(): Model {
        const model: Model = this.animation.getModel();
        if (model == null) { return null; }
        let frameId: number = -1;
        if (this.animation.sequences != null) { frameId = this.animation.sequences.getPrimaryFrame[this.animationFrame]; }
        const projectileModel: Model = new Model(true, model, Animation.exists(frameId));
        if (frameId !== -1) {
            projectileModel.createBones();
            projectileModel.applyTransform(frameId);
            projectileModel.triangleSkin = null;
            projectileModel.vectorSkin = null;
        }
        if (this.animation.resizeXY !== 128 || this.animation.resizeZ !== 128) { projectileModel.scaleT(this.animation.resizeZ, this.animation.resizeXY, 9, this.animation.resizeXY); }
        projectileModel.rotateX(this.anInt1563);
        projectileModel.applyLighting(64 + this.animation.modelLightFalloff, 850 + this.animation.modelLightAmbient, -30, -50, -30, true);
        return projectileModel;
    }
}

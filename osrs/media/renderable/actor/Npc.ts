import { ActorDefinition } from "../../../cache/def/ActorDefinition";
import { AnimationSequence } from "../../../cache/media/AnimationSequence";
import { SpotAnimation } from "../../../cache/media/SpotAnimation";
import { Animation } from "../../Animation";
import { Model } from "../Model";
import { Actor } from "./Actor";

export class Npc extends Actor {
    public npcDefinition: ActorDefinition;

    constructor() {
        super();
        if (this.npcDefinition === undefined) { this.npcDefinition = null; }
    }

    public getChildModel(): Model {
        if (this.emoteAnimation >= 0 && this.animationDelay === 0) {
            const frameId: number = AnimationSequence.animations[this.emoteAnimation].getPrimaryFrame[this.displayedEmoteFrames];
            let frameId2: number = -1;
            if (this.movementAnimation >= 0 && this.movementAnimation !== this.idleAnimation) { frameId2 = AnimationSequence.animations[this.movementAnimation].getPrimaryFrame[this.displayedMovementFrames]; }
            return this.npcDefinition.getChildModel(frameId, frameId2, AnimationSequence.animations[this.emoteAnimation].flowControl);
        }
        let j: number = -1;
        if (this.movementAnimation >= 0) { j = AnimationSequence.animations[this.movementAnimation].getPrimaryFrame[this.displayedMovementFrames]; }
        return this.npcDefinition.getChildModel(j, -1, null);
    }

    /**
     *
     * @return {Model}
     */
    public getRotatedModel(): Model {
        if (this.npcDefinition == null) { return null; }
        let model: Model = this.getChildModel();
        if (model == null) { return null; }
        this.modelHeight = model.modelHeight;
        if (this.graphic !== -1 && this.currentAnimation !== -1) {
            const spotanimation: SpotAnimation = SpotAnimation.cache[this.graphic];
            const model_4_: Model = spotanimation.getModel();
            if (model_4_ != null) {
                const animationId: number = spotanimation.sequences.getPrimaryFrame[this.currentAnimation];
                const animationModel: Model = new Model(true, model_4_, Animation.exists(animationId));
                animationModel.translate(0, 0, -this.spotAnimationDelay);
                animationModel.createBones();
                animationModel.applyTransform(animationId);
                animationModel.triangleSkin = null;
                animationModel.vectorSkin = null;
                if (spotanimation.resizeXY !== 128 || spotanimation.resizeZ !== 128) { animationModel.scaleT(spotanimation.resizeZ, spotanimation.resizeXY, 9, spotanimation.resizeXY); }
                animationModel.applyLighting(64 + spotanimation.modelLightFalloff, 850 + spotanimation.modelLightAmbient, -30, -50, -30, true);
                const models: Model[] = [model, animationModel];
                model = new Model(2, 0, models);
            }
        }
        if (this.npcDefinition.boundaryDimension === 1) { model.oneSquareModel = true; }
        return model;
    }

    /**
     *
     * @return {boolean}
     */
    public isVisible(): boolean {
        return this.npcDefinition != null;
    }
}

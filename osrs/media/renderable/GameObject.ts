import { Varbit } from "../../cache/cfg/Varbit";
import { GameObjectDefinition } from "../../cache/def/GameObjectDefinition";
import { AnimationSequence } from "../../cache/media/AnimationSequence";
import { Game } from "../../Game";
import { Model } from "./Model";
import { Renderable } from "./Renderable";

export class GameObject extends Renderable {
    public static client: Game = null;
    public vertexHeight: number;

    public vertexHeightRight: number;

    public vertexHeightTopRight: number;

    public vertexHeightTop: number;

    public id: number;

    public clickType: number;

    public face: number;

    public animationSequence: AnimationSequence;

    public varbitId: number;

    public configId: number;

    public childrenIds: number[];

    public animationCycleDelay: number;

    public animationFrame: number;

    public constructor(
        id: number,
        face: number,
        clickType: number,
        vertexHeightRight: number,
        vertexHeightTopRight: number,
        vertexHeight: number,
        vertexHeightTop: number,
        animationId: number,
        flag: boolean
    ) {
        super();
        if (this.vertexHeight === undefined) {
            this.vertexHeight = 0;
        }
        if (this.vertexHeightRight === undefined) {
            this.vertexHeightRight = 0;
        }
        if (this.vertexHeightTopRight === undefined) {
            this.vertexHeightTopRight = 0;
        }
        if (this.vertexHeightTop === undefined) {
            this.vertexHeightTop = 0;
        }
        if (this.id === undefined) {
            this.id = 0;
        }
        if (this.clickType === undefined) {
            this.clickType = 0;
        }
        if (this.face === undefined) {
            this.face = 0;
        }
        if (this.animationSequence === undefined) {
            this.animationSequence = null;
        }
        if (this.varbitId === undefined) {
            this.varbitId = 0;
        }
        if (this.configId === undefined) {
            this.configId = 0;
        }
        if (this.childrenIds === undefined) {
            this.childrenIds = null;
        }
        if (this.animationCycleDelay === undefined) {
            this.animationCycleDelay = 0;
        }
        if (this.animationFrame === undefined) {
            this.animationFrame = 0;
        }
        this.id = id;
        this.clickType = clickType;
        this.face = face;
        this.vertexHeight = vertexHeight;
        this.vertexHeightRight = vertexHeightRight;
        this.vertexHeightTopRight = vertexHeightTopRight;
        this.vertexHeightTop = vertexHeightTop;
        if (animationId !== -1) {
            this.animationSequence = AnimationSequence.animations[animationId];
            this.animationFrame = 0;
            this.animationCycleDelay = Game.pulseCycle - 1;
            if (flag && this.animationSequence.frameStep !== -1) {
                this.animationFrame = ((Math.random() * this.animationSequence.frameCount) as number) | 0;
                this.animationCycleDelay -= ((Math.random() * this.animationSequence.getFrameLength(this.animationFrame)) as number) | 0;
            }
        }
        const gameObjectDefinition: GameObjectDefinition = GameObjectDefinition.getDefinition(this.id);
        this.varbitId = gameObjectDefinition.varbitId;
        this.configId = gameObjectDefinition.configId;
        this.childrenIds = gameObjectDefinition.childrenIds;
    }

    public getChildDefinition(): GameObjectDefinition {
        let child: number = -1;
        if (this.varbitId !== -1) {
            const varbit: Varbit = Varbit.cache[this.varbitId];
            const configId: number = varbit.configId;
            const leastSignificantBit: number = varbit.leastSignificantBit;
            const mostSignificantBit: number = varbit.mostSignificantBit;
            const bit: number = Game.BITFIELD_MAX_VALUE[mostSignificantBit - leastSignificantBit];
            child = (GameObject.client.widgetSettings[configId] >> leastSignificantBit) & bit;
        } else if (this.configId !== -1) {
            child = GameObject.client.widgetSettings[this.configId];
        }
        if (child < 0 || child >= this.childrenIds.length || this.childrenIds[child] === -1) {
            return null;
        } else {
            return GameObjectDefinition.getDefinition(this.childrenIds[child]);
        }
    }

    /**
     *
     * @return {Model}
     */
    public getRotatedModel(): Model {
        let animation: number = -1;
        if (this.animationSequence != null) {
            let step: number = Game.pulseCycle - this.animationCycleDelay;
            if (step > 100 && this.animationSequence.frameStep > 0) {
                step = 100;
            }
            while (step > this.animationSequence.getFrameLength(this.animationFrame)) {
                {
                    step -= this.animationSequence.getFrameLength(this.animationFrame);
                    this.animationFrame++;
                    if (this.animationFrame < this.animationSequence.frameCount) {
                        continue;
                    }
                    this.animationFrame -= this.animationSequence.frameStep;
                    if (this.animationFrame >= 0 && this.animationFrame < this.animationSequence.frameCount) {
                        continue;
                    }
                    this.animationSequence = null;
                    break;
                }
            }
            this.animationCycleDelay = Game.pulseCycle - step;
            if (this.animationSequence != null) {
                animation = this.animationSequence.getPrimaryFrame[this.animationFrame];
            }
        }
        let gameObjectDefinition: GameObjectDefinition;
        if (this.childrenIds != null) {
            gameObjectDefinition = this.getChildDefinition();
        } else {
            gameObjectDefinition = GameObjectDefinition.getDefinition(this.id);
        }
        if (gameObjectDefinition == null) {
            return null;
        } else {
            const model: Model = gameObjectDefinition.getGameObjectModel(
                this.clickType,
                this.face,
                this.vertexHeight,
                this.vertexHeightRight,
                this.vertexHeightTopRight,
                this.vertexHeightTop,
                animation
            );
            return model;
        }
    }
}

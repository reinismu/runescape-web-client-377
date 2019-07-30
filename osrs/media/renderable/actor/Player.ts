import { ActorDefinition } from "../../../cache/def/ActorDefinition";
import { ItemDefinition } from "../../../cache/def/ItemDefinition";
import { AnimationSequence } from "../../../cache/media/AnimationSequence";
import { IdentityKit } from "../../../cache/media/IdentityKit";
import { SpotAnimation } from "../../../cache/media/SpotAnimation";
import { Cache } from "../../../collection/Cache";
import { Game } from "../../../Game";
import { Buffer } from "../../../net/Buffer";
import { TextUtils } from "../../../util/TextUtils";
import { Animation } from "../../Animation";
import { Model } from "../Model";
import { Actor } from "./Actor";

export class Player extends Actor {
    public static modelCache: Cache = new Cache(260);

    public anInt1743: number;

    public anInt1744: number;

    public anInt1745: number;

    public playerModel: Model;

    public prayerIconId: number = -1;

    public cachedModel: number = -1;

    public anInt1750: number;

    public playerName: string;

    public appearance: number[] = Array(12).fill(0);

    public combatLevel: number;

    public appearanceHash: number;

    public gender: number;

    public skullIconId: number = -1;

    public npcDefinition: ActorDefinition;

    public visible: boolean = false;

    public anInt1759: number;

    public appearanceColors: number[] = [0, 0, 0, 0, 0];

    public aBoolean1763: boolean = false;

    public objectAppearanceStartTick: number;

    public objectAppearanceEndTick: number;

    public teamId: number;

    public anInt1768: number;

    public anInt1769: number;

    public anInt1770: number;

    public anInt1771: number;

    constructor() {
        super();
        if (this.anInt1743 === undefined) {
            this.anInt1743 = 0;
        }
        if (this.anInt1744 === undefined) {
            this.anInt1744 = 0;
        }
        if (this.anInt1745 === undefined) {
            this.anInt1745 = 0;
        }
        if (this.playerModel === undefined) {
            this.playerModel = null;
        }
        if (this.anInt1750 === undefined) {
            this.anInt1750 = 0;
        }
        if (this.playerName === undefined) {
            this.playerName = null;
        }
        if (this.combatLevel === undefined) {
            this.combatLevel = 0;
        }
        if (this.appearanceHash === undefined) {
            this.appearanceHash = 0;
        }
        if (this.gender === undefined) {
            this.gender = 0;
        }
        if (this.npcDefinition === undefined) {
            this.npcDefinition = null;
        }
        if (this.anInt1759 === undefined) {
            this.anInt1759 = 0;
        }
        if (this.objectAppearanceStartTick === undefined) {
            this.objectAppearanceStartTick = 0;
        }
        if (this.objectAppearanceEndTick === undefined) {
            this.objectAppearanceEndTick = 0;
        }
        if (this.teamId === undefined) {
            this.teamId = 0;
        }
        if (this.anInt1768 === undefined) {
            this.anInt1768 = 0;
        }
        if (this.anInt1769 === undefined) {
            this.anInt1769 = 0;
        }
        if (this.anInt1770 === undefined) {
            this.anInt1770 = 0;
        }
        if (this.anInt1771 === undefined) {
            this.anInt1771 = 0;
        }
    }

    public getHeadModel(): Model {
        if (!this.visible) {
            return null;
        }
        if (this.npcDefinition != null) {
            return this.npcDefinition.getHeadModel();
        }
        let cached: boolean = false;
        for (let index: number = 0; index < 12; index++) {
            {
                const appearanceId: number = this.appearance[index];
                if (appearanceId >= 256 && appearanceId < 512 && !IdentityKit.cache[appearanceId - 256].isHeadModelCached()) {
                    cached = true;
                }
                if (appearanceId >= 512 && !ItemDefinition.lookup(appearanceId - 512).headPieceReady(this.gender)) {
                    cached = true;
                }
            }
        }
        if (cached) {
            return null;
        }
        const headModels: Model[] = (s => {
            const a = [];
            while (s-- > 0) {
                a.push(null);
            }
            return a;
        })(12);
        let headModelsOffset: number = 0;
        for (let modelIndex: number = 0; modelIndex < 12; modelIndex++) {
            {
                const appearanceId: number = this.appearance[modelIndex];
                if (appearanceId >= 256 && appearanceId < 512) {
                    const subModel: Model = IdentityKit.cache[appearanceId - 256].getHeadModel();
                    if (subModel != null) {
                        headModels[headModelsOffset++] = subModel;
                    }
                }
                if (appearanceId >= 512) {
                    const subModel: Model = ItemDefinition.lookup(appearanceId - 512).asHeadPiece(this.gender);
                    if (subModel != null) {
                        headModels[headModelsOffset++] = subModel;
                    }
                }
            }
        }
        const headModel: Model = new Model(headModelsOffset, headModels);
        for (let index: number = 0; index < 5; index++) {
            if (this.appearanceColors[index] !== 0) {
                headModel.replaceColor(Game.playerColours[index][0], Game.playerColours[index][this.appearanceColors[index]]);
                if (index === 1) {
                    headModel.replaceColor(Game.SKIN_COLOURS[0], Game.SKIN_COLOURS[this.appearanceColors[index]]);
                }
            }
        }
        return headModel;
    }

    public getAnimatedModel(): Model {
        if (this.npcDefinition != null) {
            let frame: number = -1;
            if (this.emoteAnimation >= 0 && this.animationDelay === 0) {
                frame = AnimationSequence.animations[this.emoteAnimation].getPrimaryFrame[this.displayedEmoteFrames];
            } else if (this.movementAnimation >= 0) {
                frame = AnimationSequence.animations[this.movementAnimation].getPrimaryFrame[this.displayedMovementFrames];
            }
            const model: Model = this.npcDefinition.getChildModel(frame, -1, null);
            return model;
        }
        let hash: number = this.appearanceHash;
        let primaryFrame: number = -1;
        let secondaryFrame: number = -1;
        let shieldModel: number = -1;
        let weaponModel: number = -1;
        if (this.emoteAnimation >= 0 && this.animationDelay === 0) {
            const emote: AnimationSequence = AnimationSequence.animations[this.emoteAnimation];
            primaryFrame = emote.getPrimaryFrame[this.displayedEmoteFrames];
            if (this.movementAnimation >= 0 && this.movementAnimation !== this.idleAnimation) {
                secondaryFrame = AnimationSequence.animations[this.movementAnimation].getPrimaryFrame[this.displayedMovementFrames];
            }
            if (emote.getPlayerShieldDelta >= 0) {
                shieldModel = emote.getPlayerShieldDelta;
                hash += (shieldModel - this.appearance[5]) << 40;
            }
            if (emote.getPlayerWeaponDelta >= 0) {
                weaponModel = emote.getPlayerWeaponDelta;
                hash += (weaponModel - this.appearance[3]) << 48;
            }
        } else if (this.movementAnimation >= 0) {
            primaryFrame = AnimationSequence.animations[this.movementAnimation].getPrimaryFrame[this.displayedMovementFrames];
        }
        let model: Model = Player.modelCache.get(hash) as Model;
        if (model == null) {
            let invalid: boolean = false;
            for (let bodyPart: number = 0; bodyPart < 12; bodyPart++) {
                {
                    let appearanceModel: number = this.appearance[bodyPart];
                    if (weaponModel >= 0 && bodyPart === 3) {
                        appearanceModel = weaponModel;
                    }
                    if (shieldModel >= 0 && bodyPart === 5) {
                        appearanceModel = shieldModel;
                    }
                    if (appearanceModel >= 256 && appearanceModel < 512 && !IdentityKit.cache[appearanceModel - 256].isBodyModelCached()) {
                        invalid = true;
                    }
                    if (appearanceModel >= 512 && !ItemDefinition.lookup(appearanceModel - 512).equipmentReady(this.gender)) {
                        invalid = true;
                    }
                }
            }
            if (invalid) {
                if (this.cachedModel !== -1) {
                    model = Player.modelCache.get(this.cachedModel) as Model;
                }
                if (model == null) {
                    return null;
                }
            }
        }
        if (model == null) {
            const models: Model[] = (s => {
                const a = [];
                while (s-- > 0) {
                    a.push(null);
                }
                return a;
            })(12);
            let count: number = 0;
            for (let index: number = 0; index < 12; index++) {
                {
                    let part: number = this.appearance[index];
                    if (weaponModel >= 0 && index === 3) {
                        part = weaponModel;
                    }
                    if (shieldModel >= 0 && index === 5) {
                        part = shieldModel;
                    }
                    if (part >= 256 && part < 512) {
                        const bodyModel: Model = IdentityKit.cache[part - 256].getBodyModel();
                        if (bodyModel != null) {
                            models[count++] = bodyModel;
                        }
                    }
                    if (part >= 512) {
                        const equipment: Model = ItemDefinition.lookup(part - 512).asEquipment(this.gender);
                        if (equipment != null) {
                            models[count++] = equipment;
                        }
                    }
                }
            }
            model = new Model(count, models);
            for (let part: number = 0; part < 5; part++) {
                if (this.appearanceColors[part] !== 0) {
                    model.replaceColor(Game.playerColours[part][0], Game.playerColours[part][this.appearanceColors[part]]);
                    if (part === 1) {
                        model.replaceColor(Game.SKIN_COLOURS[0], Game.SKIN_COLOURS[this.appearanceColors[part]]);
                    }
                }
            }
            model.createBones();
            model.applyLighting(64, 850, -30, -50, -30, true);
            Player.modelCache.put(model, hash);
            this.cachedModel = hash;
        }
        if (this.aBoolean1763) {
            return model;
        }
        const empty: Model = Model.EMPTY_MODEL;
        empty.replaceWithModel(model, ((lhs, rhs) => lhs && rhs)(Animation.exists(primaryFrame), Animation.exists(secondaryFrame)));
        if (primaryFrame !== -1 && secondaryFrame !== -1) {
            empty.mixAnimationFrames(secondaryFrame, 0, primaryFrame, AnimationSequence.animations[this.emoteAnimation].flowControl);
        } else if (primaryFrame !== -1) {
            empty.applyTransform(primaryFrame);
        }
        empty.calculateDiagonals();
        empty.triangleSkin = null;
        empty.vectorSkin = null;
        return empty;
    }

    /**
     *
     * @return {boolean}
     */
    public isVisible(): boolean {
        return this.visible;
    }

    /**
     *
     * @return {Model}
     */
    public getRotatedModel(): Model {
        if (!this.visible) {
            return null;
        }
        let appearanceModel: Model = this.getAnimatedModel();
        if (appearanceModel == null) {
            return null;
        }
        this.modelHeight = appearanceModel.modelHeight;
        appearanceModel.oneSquareModel = true;
        if (this.aBoolean1763) {
            return appearanceModel;
        }
        if (this.graphic !== -1 && this.currentAnimation !== -1) {
            const spotAnimation: SpotAnimation = SpotAnimation.cache[this.graphic];
            const spotAnimationModel: Model = spotAnimation.getModel();
            if (spotAnimationModel != null) {
                const spotAnimationModel2: Model = new Model(true, spotAnimationModel, Animation.exists(this.currentAnimation));
                spotAnimationModel2.translate(0, 0, -this.spotAnimationDelay);
                spotAnimationModel2.createBones();
                spotAnimationModel2.applyTransform(spotAnimation.sequences.getPrimaryFrame[this.currentAnimation]);
                spotAnimationModel2.triangleSkin = null;
                spotAnimationModel2.vectorSkin = null;
                if (spotAnimation.resizeXY !== 128 || spotAnimation.resizeZ !== 128) {
                    spotAnimationModel2.scaleT(spotAnimation.resizeZ, spotAnimation.resizeXY, 9, spotAnimation.resizeXY);
                }
                spotAnimationModel2.applyLighting(
                    64 + spotAnimation.modelLightFalloff,
                    850 + spotAnimation.modelLightAmbient,
                    -30,
                    -50,
                    -30,
                    true
                );
                const models: Model[] = [appearanceModel, spotAnimationModel2];
                appearanceModel = new Model(2, 0, models);
            }
        }
        if (this.playerModel != null) {
            if (Game.pulseCycle >= this.objectAppearanceEndTick) {
                this.playerModel = null;
            }
            if (Game.pulseCycle >= this.objectAppearanceStartTick && Game.pulseCycle < this.objectAppearanceEndTick) {
                const model: Model = this.playerModel;
                model.translate(this.anInt1743 - this.worldX, this.anInt1745 - this.worldY, this.anInt1744 - this.anInt1750);
                if (this.nextStepOrientation === 512) {
                    model.rotate90Degrees();
                    model.rotate90Degrees();
                    model.rotate90Degrees();
                } else if (this.nextStepOrientation === 1024) {
                    model.rotate90Degrees();
                    model.rotate90Degrees();
                } else if (this.nextStepOrientation === 1536) {
                    model.rotate90Degrees();
                }
                const models: Model[] = [appearanceModel, model];
                appearanceModel = new Model(2, 0, models);
                if (this.nextStepOrientation === 512) {
                    model.rotate90Degrees();
                } else if (this.nextStepOrientation === 1024) {
                    model.rotate90Degrees();
                    model.rotate90Degrees();
                } else if (this.nextStepOrientation === 1536) {
                    model.rotate90Degrees();
                    model.rotate90Degrees();
                    model.rotate90Degrees();
                }
                model.translate(this.worldX - this.anInt1743, this.worldY - this.anInt1745, this.anInt1750 - this.anInt1744);
            }
        }
        appearanceModel.oneSquareModel = true;
        return appearanceModel;
    }

    public updateAppearance(buffer: Buffer) {
        buffer.currentPosition = 0;
        this.gender = buffer.getUnsignedByte();
        this.skullIconId = buffer.getSignedByte();
        this.prayerIconId = buffer.getSignedByte();
        this.npcDefinition = null;
        this.teamId = 0;
        for (let index: number = 0; index < 12; index++) {
            {
                const upperByte: number = buffer.getUnsignedByte();
                if (upperByte === 0) {
                    this.appearance[index] = 0;
                    continue;
                }
                const lowerByte: number = buffer.getUnsignedByte();
                this.appearance[index] = (upperByte << 8) + lowerByte;
                if (index === 0 && this.appearance[0] === 65535) {
                    this.npcDefinition = ActorDefinition.getDefinition(buffer.getUnsignedLEShort());
                    break;
                }
                if (this.appearance[index] >= 512 && this.appearance[index] - 512 < ItemDefinition.count) {
                    const itemTeam: number = ItemDefinition.lookup(this.appearance[index] - 512).team;
                    if (itemTeam !== 0) {
                        this.teamId = itemTeam;
                    }
                }
            }
        }
        for (let l: number = 0; l < 5; l++) {
            {
                let j1: number = buffer.getUnsignedByte();
                if (j1 < 0 || j1 >= Game.playerColours[l].length) {
                    j1 = 0;
                }
                this.appearanceColors[l] = j1;
            }
        }
        this.idleAnimation = buffer.getUnsignedLEShort();
        if (this.idleAnimation === 65535) {
            this.idleAnimation = -1;
        }
        this.standTurnAnimationId = buffer.getUnsignedLEShort();
        if (this.standTurnAnimationId === 65535) {
            this.standTurnAnimationId = -1;
        }
        this.walkAnimationId = buffer.getUnsignedLEShort();
        if (this.walkAnimationId === 65535) {
            this.walkAnimationId = -1;
        }
        this.turnAroundAnimationId = buffer.getUnsignedLEShort();
        if (this.turnAroundAnimationId === 65535) {
            this.turnAroundAnimationId = -1;
        }
        this.turnRightAnimationId = buffer.getUnsignedLEShort();
        if (this.turnRightAnimationId === 65535) {
            this.turnRightAnimationId = -1;
        }
        this.turnLeftAnimationId = buffer.getUnsignedLEShort();
        if (this.turnLeftAnimationId === 65535) {
            this.turnLeftAnimationId = -1;
        }
        this.runAnimationId = buffer.getUnsignedLEShort();
        if (this.runAnimationId === 65535) {
            this.runAnimationId = -1;
        }
        this.playerName = TextUtils.formatName(TextUtils.longToName(buffer.getLong()));
        this.combatLevel = buffer.getUnsignedByte();
        this.anInt1759 = buffer.getUnsignedLEShort();
        this.visible = true;
        this.appearanceHash = 0;
        const k1: number = this.appearance[5];
        const i2: number = this.appearance[9];
        this.appearance[5] = i2;
        this.appearance[9] = k1;
        for (let j2: number = 0; j2 < 12; j2++) {
            {
                this.appearanceHash <<= 4;
                if (this.appearance[j2] >= 256) {
                    this.appearanceHash += this.appearance[j2] - 256;
                }
            }
        }
        if (this.appearance[0] >= 256) {
            this.appearanceHash += (this.appearance[0] - 256) >> 4;
        }
        if (this.appearance[1] >= 256) {
            this.appearanceHash += (this.appearance[1] - 256) >> 8;
        }
        this.appearance[5] = k1;
        this.appearance[9] = i2;
        for (let k2: number = 0; k2 < 5; k2++) {
            {
                this.appearanceHash <<= 3;
                this.appearanceHash += this.appearanceColors[k2];
            }
        }
        this.appearanceHash <<= 1;
        this.appearanceHash += this.gender;
    }
}

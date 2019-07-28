import { Cache } from "../../collection/Cache";
import { Model } from "../../media/renderable/Model";
import { Buffer } from "../../net/Buffer";
import { Archive } from "../Archive";
import { AnimationSequence } from "./AnimationSequence";

export class SpotAnimation {
    public static spotAnimationCount: number = 0;

    public static cache: SpotAnimation[] = null;

    public static modelCache: Cache = new Cache(30);

    public static load(archive: Archive) {
        const buffer: Buffer = new Buffer(archive.getFile("spotanim.dat"));
        SpotAnimation.spotAnimationCount = buffer.getUnsignedLEShort();
        if (SpotAnimation.cache == null) {
            SpotAnimation.cache = (s => {
                const a = [];
                while (s-- > 0) {
                    a.push(null);
                }
                return a;
            })(SpotAnimation.spotAnimationCount);
        }
        for (let spotAnimation: number = 0; spotAnimation < SpotAnimation.spotAnimationCount; spotAnimation++) {
            {
                if (SpotAnimation.cache[spotAnimation] == null) {
                    SpotAnimation.cache[spotAnimation] = new SpotAnimation();
                }
                SpotAnimation.cache[spotAnimation].id = spotAnimation;
                SpotAnimation.cache[spotAnimation].loadDefinition(buffer);
            }
        }
    }

    public id: number;

    public modelId: number;

    public animationId: number = -1;

    public sequences: AnimationSequence;

    public originalModelColors: number[] = [0, 0, 0, 0, 0, 0];

    public modifiedModelColors: number[] = [0, 0, 0, 0, 0, 0];

    public resizeXY: number = 128;

    public resizeZ: number = 128;

    public rotation: number;

    public modelLightFalloff: number;

    public modelLightAmbient: number;

    constructor() {
        if (this.id === undefined) {
            this.id = 0;
        }
        if (this.modelId === undefined) {
            this.modelId = 0;
        }
        if (this.sequences === undefined) {
            this.sequences = null;
        }
        if (this.rotation === undefined) {
            this.rotation = 0;
        }
        if (this.modelLightFalloff === undefined) {
            this.modelLightFalloff = 0;
        }
        if (this.modelLightAmbient === undefined) {
            this.modelLightAmbient = 0;
        }
    }

    public loadDefinition(buffer: Buffer) {
        while (true) {
            {
                const attributeId: number = buffer.getUnsignedByte();
                if (attributeId === 0) {
                    return;
                }
                if (attributeId === 1) {
                    this.modelId = buffer.getUnsignedLEShort();
                } else if (attributeId === 2) {
                    this.animationId = buffer.getUnsignedLEShort();
                    if (AnimationSequence.animations != null) {
                        this.sequences = AnimationSequence.animations[this.animationId];
                    }
                } else if (attributeId === 4) {
                    this.resizeXY = buffer.getUnsignedLEShort();
                } else if (attributeId === 5) {
                    this.resizeZ = buffer.getUnsignedLEShort();
                } else if (attributeId === 6) {
                    this.rotation = buffer.getUnsignedLEShort();
                } else if (attributeId === 7) {
                    this.modelLightFalloff = buffer.getUnsignedByte();
                } else if (attributeId === 8) {
                    this.modelLightAmbient = buffer.getUnsignedByte();
                } else if (attributeId >= 40 && attributeId < 50) {
                    this.originalModelColors[attributeId - 40] = buffer.getUnsignedLEShort();
                } else if (attributeId >= 50 && attributeId < 60) {
                    this.modifiedModelColors[attributeId - 50] = buffer.getUnsignedLEShort();
                } else {
                    console.info("Error unrecognised spotanim config code: " + attributeId);
                }
            }
        }
    }

    public getModel(): Model {
        let model: Model = SpotAnimation.modelCache.get(this.id) as Model;
        if (model != null) {
            return model;
        }
        model = Model.getModel(this.modelId);
        if (model == null) {
            return null;
        }
        for (let nodelColor: number = 0; nodelColor < 6; nodelColor++) {
            if (this.originalModelColors[0] !== 0) {
                model.replaceColor(this.originalModelColors[nodelColor], this.modifiedModelColors[nodelColor]);
            }
        }
        SpotAnimation.modelCache.put(model, this.id);
        return model;
    }
}

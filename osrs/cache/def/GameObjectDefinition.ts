import { Cache } from "../../collection/Cache";
import { Game } from "../../Game";
import { Animation } from "../../media/Animation";
import { Model } from "../../media/renderable/Model";
import { Buffer } from "../../net/Buffer";
import { OnDemandRequester } from "../../net/requester/OnDemandRequester";
import { Archive } from "../Archive";
import { Varbit } from "../cfg/Varbit";

export class GameObjectDefinition {

    public static bufferOffsets: number[] = null;

    public static animatedModelCache: Cache = new Cache(40);
    public static buffer: Buffer = null;

    public static client: Game = null;

    public static models: Model[] = [null, null, null, null];;
    public static lowMemory: boolean = false;

    public static cacheIndex: number = 0;

    public static modelCache: Cache = new Cache(500);;
    public static cache: GameObjectDefinition[] = null;

    public static definitionCount: number = 0;
   
    public static getDefinition(id: number): GameObjectDefinition {
        for (let index: number = 0; index < 20; index++) {if (GameObjectDefinition.cache[index].id === id) { return GameObjectDefinition.cache[index]; }}
        GameObjectDefinition.cacheIndex = (GameObjectDefinition.cacheIndex + 1) % 20;
        const definition: GameObjectDefinition = GameObjectDefinition.cache[GameObjectDefinition.cacheIndex];
        GameObjectDefinition.buffer.currentPosition = GameObjectDefinition.bufferOffsets[id];
        definition.id = id;
        definition.setDefaultValues();
        definition.load(GameObjectDefinition.buffer);
        return definition;
    }

    public static load(archive: Archive) {
        GameObjectDefinition.buffer = new Buffer(archive.getFile("loc.dat"));
        const buffer: Buffer = new Buffer(archive.getFile("loc.idx"));
        GameObjectDefinition.definitionCount = buffer.getUnsignedLEShort();
        GameObjectDefinition.bufferOffsets = ((s) => { const a = []; while (s-- > 0) { a.push(0); } return a; })(GameObjectDefinition.definitionCount);
        let offset: number = 2;
        for (let index: number = 0; index < GameObjectDefinition.definitionCount; index++) {{
            GameObjectDefinition.bufferOffsets[index] = offset;
            offset += buffer.getUnsignedLEShort();
        }}
        GameObjectDefinition.cache = ((s) => { const a = []; while (s-- > 0) { a.push(null); } return a; })(20);
        for (let definition: number = 0; definition < 20; definition++) {GameObjectDefinition.cache[definition] = new GameObjectDefinition(); }
    }

    public static method433(flag: boolean) {
        GameObjectDefinition.modelCache = null;
        GameObjectDefinition.animatedModelCache = null;
        GameObjectDefinition.bufferOffsets = null;
        if (flag) {
            for (let i: number = 1; i > 0; i++) {}
        }
        GameObjectDefinition.cache = null;
        GameObjectDefinition.buffer = null;
    }

    public actionsBoolean: boolean;

    public modelSizeY: number;

    public translateX: number;

    public modelIds: number[];

    public anInt764: number;

    public unknown: boolean;

    public translateZ: number;

    public anInt768: number = -992;

    public adjustToTerrain: boolean;

    public id: number = -1;

    public aBoolean774: boolean = true;

    public sizeY: number;

    public name: string = "null";

    public varbitId: number;

    public modelSizeX: number;

    public configId: number;

    public description: number[];

    public modelLightFalloff: number;

    public translateY: number;

    public aBoolean786: boolean = true;

    public modelLightAmbient: number;

    public anInt788: number;

    public modelTypes: number[];

    public options: string[];

    public aBoolean791: boolean;

    public anIntArray792: number[];

    public aByte793: number = -113;

    public anInt794: number;

    public anInt795: number;

    public modelSizeZ: number;

    public aBoolean797: boolean;

    public unknown3: boolean;

    public modifiedModelColors: number[];

    public sizeX: number;

    public unknown4: number;

    public animationId: number;

    public nonFlatShading: boolean;

    public childrenIds: number[];

    public icon: number;

    public unknown2: boolean;

    public walkable: boolean;

    public solid: boolean;

    constructor() {
        if (this.actionsBoolean === undefined) { this.actionsBoolean = false; }
        if (this.modelSizeY === undefined) { this.modelSizeY = 0; }
        if (this.translateX === undefined) { this.translateX = 0; }
        if (this.modelIds === undefined) { this.modelIds = null; }
        if (this.anInt764 === undefined) { this.anInt764 = 0; }
        if (this.unknown === undefined) { this.unknown = false; }
        if (this.translateZ === undefined) { this.translateZ = 0; }
        if (this.adjustToTerrain === undefined) { this.adjustToTerrain = false; }
        if (this.sizeY === undefined) { this.sizeY = 0; }
        if (this.varbitId === undefined) { this.varbitId = 0; }
        if (this.modelSizeX === undefined) { this.modelSizeX = 0; }
        if (this.configId === undefined) { this.configId = 0; }
        if (this.description === undefined) { this.description = null; }
        if (this.modelLightFalloff === undefined) { this.modelLightFalloff = 0; }
        if (this.translateY === undefined) { this.translateY = 0; }
        if (this.modelLightAmbient === undefined) { this.modelLightAmbient = 0; }
        if (this.anInt788 === undefined) { this.anInt788 = 0; }
        if (this.modelTypes === undefined) { this.modelTypes = null; }
        if (this.options === undefined) { this.options = null; }
        if (this.aBoolean791 === undefined) { this.aBoolean791 = false; }
        if (this.anIntArray792 === undefined) { this.anIntArray792 = null; }
        if (this.anInt794 === undefined) { this.anInt794 = 0; }
        if (this.anInt795 === undefined) { this.anInt795 = 0; }
        if (this.modelSizeZ === undefined) { this.modelSizeZ = 0; }
        if (this.aBoolean797 === undefined) { this.aBoolean797 = false; }
        if (this.unknown3 === undefined) { this.unknown3 = false; }
        if (this.modifiedModelColors === undefined) { this.modifiedModelColors = null; }
        if (this.sizeX === undefined) { this.sizeX = 0; }
        if (this.unknown4 === undefined) { this.unknown4 = 0; }
        if (this.animationId === undefined) { this.animationId = 0; }
        if (this.nonFlatShading === undefined) { this.nonFlatShading = false; }
        if (this.childrenIds === undefined) { this.childrenIds = null; }
        if (this.icon === undefined) { this.icon = 0; }
        if (this.unknown2 === undefined) { this.unknown2 = false; }
        if (this.walkable === undefined) { this.walkable = false; }
        if (this.solid === undefined) { this.solid = false; }
    }

    public getChildDefinition(): GameObjectDefinition {
        let child: number = -1;
        if (this.varbitId !== -1) {
            const varbit: Varbit = Varbit.cache[this.varbitId];
            const configId: number = varbit.configId;
            const leastSignificantBit: number = varbit.leastSignificantBit;
            const mostSignificantBit: number = varbit.mostSignificantBit;
            const bit: number = Game.BITFIELD_MAX_VALUE[mostSignificantBit - leastSignificantBit];
            child = GameObjectDefinition.client.widgetSettings[configId] >> leastSignificantBit & bit;
        } else if (this.configId !== -1) { child = GameObjectDefinition.client.widgetSettings[this.configId]; }
        if (child < 0 || child >= this.childrenIds.length || this.childrenIds[child] === -1) { return null; } else { return GameObjectDefinition.getDefinition(this.childrenIds[child]); }
    }

    public setDefaultValues() {
        this.modelIds = null;
        this.modelTypes = null;
        this.name = "null";
        this.description = null;
        this.modifiedModelColors = null;
        this.anIntArray792 = null;
        this.sizeX = 1;
        this.sizeY = 1;
        this.solid = true;
        this.walkable = true;
        this.actionsBoolean = false;
        this.adjustToTerrain = false;
        this.nonFlatShading = false;
        this.aBoolean797 = false;
        this.animationId = -1;
        this.unknown4 = 16;
        this.modelLightFalloff = 0;
        this.modelLightAmbient = 0;
        this.options = null;
        this.icon = -1;
        this.anInt795 = -1;
        this.unknown3 = false;
        this.unknown2 = true;
        this.modelSizeX = 128;
        this.modelSizeY = 128;
        this.modelSizeZ = 128;
        this.anInt764 = 0;
        this.translateX = 0;
        this.translateY = 0;
        this.translateZ = 0;
        this.unknown = false;
        this.aBoolean791 = false;
        this.anInt794 = -1;
        this.varbitId = -1;
        this.configId = -1;
        this.childrenIds = null;
    }

    public passiveRequestModels(onDemandRequester: OnDemandRequester) {
        if (this.modelIds != null) {
            for (let index618 = 0; index618 < this.modelIds.length; index618++) {
                const modelId = this.modelIds[index618];
                {
                    onDemandRequester.passiveRequest(modelId & 65535, 0);
                }
            }
        }
    }

    public getGameObjectAnimatedModel(type: number, animationId: number, face: number): Model {
        let subModel: Model = null;
        let hash: number;
        if (this.modelTypes == null) {
            if (type !== 10) { return null; }
            hash = ((this.id << 6) + face) + (((n) => n < 0 ? Math.ceil(n) : Math.floor(n))((animationId + 1) as number) << 32);
            const cachedModel: Model = GameObjectDefinition.animatedModelCache.get(hash) as Model;
            if (cachedModel != null) { return cachedModel; }
            if (this.modelIds == null) { return null; }
            const mirror: boolean = (this.unknown3) !== ((face > 3));
            const modelCount: number = this.modelIds.length;
            for (let modelId: number = 0; modelId < modelCount; modelId++) {{
                let subModelId: number = this.modelIds[modelId];
                if (mirror) { subModelId += 65536; }
                subModel = GameObjectDefinition.modelCache.get(subModelId) as Model;
                if (subModel == null) {
                    subModel = Model.getModel(subModelId & 65535);
                    if (subModel == null) { return null; }
                    if (mirror) { subModel.mirror(0); }
                    GameObjectDefinition.modelCache.put(subModel, subModelId);
                }
                if (modelCount > 1) { GameObjectDefinition.models[modelId] = subModel; }
            }}
            if (modelCount > 1) { subModel = new Model(modelCount, GameObjectDefinition.models); }
        } else {
            let modelType: number = -1;
            for (let index: number = 0; index < this.modelTypes.length; index++) {{
                if (this.modelTypes[index] !== type) { continue; }
                modelType = index;
                break;
            }}
            if (modelType === -1) { return null; }
            hash = ((this.id << 6) + (modelType << 3) + face) + (((n) => n < 0 ? Math.ceil(n) : Math.floor(n))((animationId + 1) as number) << 32);
            const model: Model = GameObjectDefinition.animatedModelCache.get(hash) as Model;
            if (model != null) { return model; }
            let j2: number = this.modelIds[modelType];
            const mirror: boolean = (this.unknown3) !== ((face > 3));
            if (mirror) { j2 += 65536; }
            subModel = GameObjectDefinition.modelCache.get(j2) as Model;
            if (subModel == null) {
                subModel = Model.getModel(j2 & 65535);
                if (subModel == null) { return null; }
                if (mirror) { subModel.mirror(0); }
                GameObjectDefinition.modelCache.put(subModel, j2);
            }
        }
        let scale: boolean;
        if (this.modelSizeX !== 128 || this.modelSizeY !== 128 || this.modelSizeZ !== 128) { scale = true; } else { scale = false; }
        let needsTranslation: boolean;
        if (this.translateX !== 0 || this.translateY !== 0 || this.translateZ !== 0) { needsTranslation = true; } else { needsTranslation = false; }
        const animtedModel: Model = new Model(this.modifiedModelColors == null, subModel, Animation.exists(animationId));
        if (animationId !== -1) {
            animtedModel.createBones();
            animtedModel.applyTransform(animationId);
            animtedModel.triangleSkin = null;
            animtedModel.vectorSkin = null;
        }
        while ((face-- > 0)) {animtedModel.rotate90Degrees(); }
        if (this.modifiedModelColors != null) {
            for (let k2: number = 0; k2 < this.modifiedModelColors.length; k2++) {animtedModel.replaceColor(this.modifiedModelColors[k2], this.anIntArray792[k2]); }
        }
        if (scale) { animtedModel.scaleT(this.modelSizeY, this.modelSizeZ, 9, this.modelSizeX); }
        if (needsTranslation) { animtedModel.translate(this.translateX, this.translateZ, this.translateY); }
        animtedModel.applyLighting(64 + this.modelLightFalloff, 768 + this.modelLightAmbient * 5, -50, -10, -50, !this.nonFlatShading);
        if (this.anInt794 === 1) { animtedModel.anInt1675 = animtedModel.modelHeight; }
        GameObjectDefinition.animatedModelCache.put(animtedModel, hash);
        return animtedModel;
    }

    public isModelCached(): boolean {
        if (this.modelIds == null) { return true; }
        let cached: boolean = true;
        for (let index619 = 0; index619 < this.modelIds.length; index619++) {
            const modelId = this.modelIds[index619];
            {
                cached = Model.loaded(modelId & 65535) && cached;
            }
        }
        return cached;
    }

    public load(buf: Buffer) {
        let i: number = -1;
        label0: while ((true)) {{
            let attribute: number;
            do {{
                attribute = buf.getUnsignedByte();
                if (attribute === 0) { break label0; }
                switch ((attribute)) {
                case 1:
                    const k: number = buf.getUnsignedByte();
                    if (k > 0) { if (this.modelIds == null || GameObjectDefinition.lowMemory) {
                        this.modelTypes = ((s) => { const a = []; while (s-- > 0) { a.push(0); } return a; })(k);
                        this.modelIds = ((s) => { const a = []; while (s-- > 0) { a.push(0); } return a; })(k);
                        for (let k1: number = 0; k1 < k; k1++) {{
                            this.modelIds[k1] = buf.getUnsignedLEShort();
                            this.modelTypes[k1] = buf.getUnsignedByte();
                        }}
                    } else {
                        buf.currentPosition += k * 3;
                    }
                    }
                    break;
                case 2:
                    this.name = buf.getString();
                    break;
                case 3:
                    this.description = buf.getStringBytes();
                    break;
                case 5:
                    const l: number = buf.getUnsignedByte();
                    if (l > 0) { if (this.modelIds == null || GameObjectDefinition.lowMemory) {
                        this.modelTypes = null;
                        this.modelIds = ((s) => { const a = []; while (s-- > 0) { a.push(0); } return a; })(l);
                        for (let l1: number = 0; l1 < l; l1++) {this.modelIds[l1] = buf.getUnsignedLEShort(); }
                    } else {
                        buf.currentPosition += l * 2;
                    }
                    }
                    break;
                case 14:
                    this.sizeX = buf.getUnsignedByte();
                    break;
                case 15:
                    this.sizeY = buf.getUnsignedByte();
                    break;
                case 17:
                    this.solid = false;
                    break;
                case 18:
                    this.walkable = false;
                    break;
                case 19:
                    i = buf.getUnsignedByte();
                    if (i === 1) { this.actionsBoolean = true; }
                    break;
                case 21:
                    this.adjustToTerrain = true;
                    break;
                case 22:
                    this.nonFlatShading = true;
                    break;
                case 23:
                    this.aBoolean797 = true;
                    break;
                case 24:
                    this.animationId = buf.getUnsignedLEShort();
                    if (this.animationId === 65535) { this.animationId = -1; }
                    break;
                case 28:
                    this.unknown4 = buf.getUnsignedByte();
                    break;
                case 29:
                    this.modelLightFalloff = buf.getSignedByte();
                    break;
                case 39:
                    this.modelLightAmbient = buf.getSignedByte();
                    break;
                }
                if (attribute < 30 || attribute >= 39) {
                    switch ((attribute)) {
                    case 40:
                        const i1: number = buf.getUnsignedByte();
                        this.modifiedModelColors = ((s) => { const a = []; while (s-- > 0) { a.push(0); } return a; })(i1);
                        this.anIntArray792 = ((s) => { const a = []; while (s-- > 0) { a.push(0); } return a; })(i1);
                        for (let i2: number = 0; i2 < i1; i2++) {{
                            this.modifiedModelColors[i2] = buf.getUnsignedLEShort();
                            this.anIntArray792[i2] = buf.getUnsignedLEShort();
                        }}
                        break;
                    case 60:
                        this.icon = buf.getUnsignedLEShort();
                        break;
                    case 62:
                        this.unknown3 = true;
                        break;
                    case 64:
                        this.unknown2 = false;
                        break;
                    case 65:
                        this.modelSizeX = buf.getUnsignedLEShort();
                        break;
                    case 66:
                        this.modelSizeY = buf.getUnsignedLEShort();
                        break;
                    case 67:
                        this.modelSizeZ = buf.getUnsignedLEShort();
                        break;
                    case 68:
                        this.anInt795 = buf.getUnsignedLEShort();
                        break;
                    case 69:
                        this.anInt764 = buf.getUnsignedByte();
                        break;
                    case 70:
                        this.translateX = buf.getSignedShort();
                        break;
                    case 71:
                        this.translateY = buf.getSignedShort();
                        break;
                    case 72:
                        this.translateZ = buf.getSignedShort();
                        break;
                    case 73:
                        this.unknown = true;
                        break;
                    case 74:
                        this.aBoolean791 = true;
                        break;
                    default:
                        if (attribute !== 75) { continue; }
                        this.anInt794 = buf.getUnsignedByte();
                        break;
                    }
                } else {
                    if (this.options == null) { this.options = [null, null, null, null, null]; }
                    this.options[attribute - 30] = buf.getString();
                    if (/* equalsIgnoreCase */((o1, o2) => o1.toUpperCase() === (o2 === null ? o2 : o2.toUpperCase()))(this.options[attribute - 30], "hidden")) { this.options[attribute - 30] = null; }
                }
                continue label0;
            }} while ((attribute !== 77));
            this.varbitId = buf.getUnsignedLEShort();
            if (this.varbitId === 65535) { this.varbitId = -1; }
            this.configId = buf.getUnsignedLEShort();
            if (this.configId === 65535) { this.configId = -1; }
            const j1: number = buf.getUnsignedByte();
            this.childrenIds = ((s) => { const a = []; while (s-- > 0) { a.push(0); } return a; })(j1 + 1);
            for (let j2: number = 0; j2 <= j1; j2++) {{
                this.childrenIds[j2] = buf.getUnsignedLEShort();
                if (this.childrenIds[j2] === 65535) { this.childrenIds[j2] = -1; }
            }}
        }}
        if (i === -1) {
            this.actionsBoolean = false;
            if (this.modelIds != null && (this.modelTypes == null || this.modelTypes[0] === 10)) { this.actionsBoolean = true; }
            if (this.options != null) { this.actionsBoolean = true; }
        }
        if (this.aBoolean791) {
            this.solid = false;
            this.walkable = false;
        }
        if (this.anInt794 === -1) { this.anInt794 = this.solid ? 1 : 0; }
    }

    public getGameObjectModel(type: number, face: number, vertexHeight: number, vertexHeightRight: number, vertexHeightTopRight: number, vertexHeightTop: number, animationId: number): Model {
        let model: Model = this.getGameObjectAnimatedModel(type, animationId, face);
        if (model == null) { return null; }
        if (this.adjustToTerrain || this.nonFlatShading) { model = new Model(this.adjustToTerrain, this.nonFlatShading, 0, model); }
        if (this.adjustToTerrain) {
            const l1: number = ((vertexHeight + vertexHeightRight + vertexHeightTopRight + vertexHeightTop) / 4 | 0);
            for (let i2: number = 0; i2 < model.vertexCount; i2++) {{
                const j2: number = model.verticesX[i2];
                const k2: number = model.verticesZ[i2];
                const l2: number = vertexHeight + (((vertexHeightRight - vertexHeight) * (j2 + 64)) / 128 | 0);
                const i3: number = vertexHeightTop + (((vertexHeightTopRight - vertexHeightTop) * (j2 + 64)) / 128 | 0);
                const j3: number = l2 + (((i3 - l2) * (k2 + 64)) / 128 | 0);
                model.verticesY[i2] += j3 - l1;
            }}
            model.normalise();
        }
        return model;
    }

    public method432(i: number, j: number): boolean {
        if (i !== 26261) { this.aBoolean786 = !this.aBoolean786; }
        if (this.modelTypes == null) {
            if (this.modelIds == null) { return true; }
            if (j !== 10) { return true; }
            let flag: boolean = true;
            for (let l: number = 0; l < this.modelIds.length; l++) {flag = Model.loaded(this.modelIds[l] & 65535) && flag; }
            return flag;
        }
        for (let k: number = 0; k < this.modelTypes.length; k++) {if (this.modelTypes[k] === j) { return Model.loaded(this.modelIds[k] & 65535); }}
        return true;
    }
}

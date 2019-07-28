/* Generated from Java with JSweet 2.3.0 - http://www.jsweet.org */
import { Cache } from "../../collection/Cache";
import { Game } from "../../Game";
import { Animation } from "../../media/Animation";
import { Model } from "../../media/renderable/Model";
import { Buffer } from "../../net/Buffer";
import { Archive } from "../Archive";
import { Varbit } from "../cfg/Varbit";

export class ActorDefinition {

    public static client: Game = null;

    public static modelCache: Cache = new Cache(30);;
    public static size: number = 0;

    public static bufferOffsets: number[] = null;

    public static cache: ActorDefinition[] = null;

    public static buffer: Buffer = null;

    public static bufferIndex: number = 0;

    public static getDefinition(id: number): ActorDefinition {
        for (let j: number = 0; j < 20; j++) {if (ActorDefinition.cache[j].id === id) { return ActorDefinition.cache[j]; }}
        ActorDefinition.bufferIndex = (ActorDefinition.bufferIndex + 1) % 20;
        const definition: ActorDefinition = ActorDefinition.cache[ActorDefinition.bufferIndex] = new ActorDefinition();
        ActorDefinition.buffer.currentPosition = ActorDefinition.bufferOffsets[id];
        definition.id = id;
        definition.loadDefinition(ActorDefinition.buffer);
        return definition;
    }

    public static reset() {
        ActorDefinition.modelCache = null;
        ActorDefinition.bufferOffsets = null;
        ActorDefinition.cache = null;
        ActorDefinition.buffer = null;
    }

    public static load(archive: Archive) {
        ActorDefinition.buffer = new Buffer(archive.getFile("npc.dat"));
        const buffer: Buffer = new Buffer(archive.getFile("npc.idx"));
        ActorDefinition.size = buffer.getUnsignedLEShort();
        ActorDefinition.bufferOffsets = ((s) => { const a = []; while (s-- > 0) { a.push(0); } return a; })(ActorDefinition.size);
        let offset: number = 2;
        for (let bufferIndex: number = 0; bufferIndex < ActorDefinition.size; bufferIndex++) {{
            ActorDefinition.bufferOffsets[bufferIndex] = offset;
            offset += buffer.getUnsignedLEShort();
        }}
        ActorDefinition.cache = ((s) => { const a = []; while (s-- > 0) { a.push(null); } return a; })(20);
        for (let cacheIndex: number = 0; cacheIndex < 20; cacheIndex++) {ActorDefinition.cache[cacheIndex] = new ActorDefinition(); }
    }
    public standAnimationId: number = -1;

    public childrenIds: number[];

    public headModelIndexes: number[];

    public modelIds: number[];

    public anInt627: number = -1;

    public id: number = -1;

    public sizeY: number = 128;

    public clickable: boolean = true;

    public sizeXZ: number = 128;

    public turnLeftAnimationId: number = -1;

    public modifiedModelColors: number[];

    public minimapVisible: boolean = true;

    public anInt637: number = -1;

    public headIcon: number = -1;

    public combatLevel: number = -1;

    public turnRightAnimationId: number = -1;

    public boundaryDimension: number = 1;

    public turnAroundAnimationId: number = -1;

    public visible: boolean = false;

    public walkAnimationId: number = -1;

    public actions: string[];

    public anInt648: number = -1;

    public degreesToTurn: number = 32;

    public name: string = "null";

    public varBitId: number = -1;

    public originalModelColors: number[];

    public contrast: number;

    public settingId: number = -1;

    public description: number[];

    public brightness: number;

    constructor() {
        if (this.childrenIds === undefined) { this.childrenIds = null; }
        if (this.headModelIndexes === undefined) { this.headModelIndexes = null; }
        if (this.modelIds === undefined) { this.modelIds = null; }
        if (this.modifiedModelColors === undefined) { this.modifiedModelColors = null; }
        if (this.actions === undefined) { this.actions = null; }
        if (this.originalModelColors === undefined) { this.originalModelColors = null; }
        if (this.contrast === undefined) { this.contrast = 0; }
        if (this.description === undefined) { this.description = null; }
        if (this.brightness === undefined) { this.brightness = 0; }
    }

    public loadDefinition(buffer: Buffer) {
        do {{
            const attributeId: number = buffer.getUnsignedByte();
            if (attributeId === 0) { return; }
            if (attributeId === 1) {
                const modelCount: number = buffer.getUnsignedByte();
                this.modelIds = ((s) => { const a = []; while (s-- > 0) { a.push(0); } return a; })(modelCount);
                for (let model: number = 0; model < modelCount; model++) {this.modelIds[model] = buffer.getUnsignedLEShort(); }
            } else if (attributeId === 2) { this.name = buffer.getString(); } else if (attributeId === 3) { this.description = buffer.getStringBytes(); } else if (attributeId === 12) { this.boundaryDimension = buffer.getSignedByte(); } else if (attributeId === 13) { this.standAnimationId = buffer.getUnsignedLEShort(); } else if (attributeId === 14) { this.walkAnimationId = buffer.getUnsignedLEShort(); } else if (attributeId === 17) {
                this.walkAnimationId = buffer.getUnsignedLEShort();
                this.turnAroundAnimationId = buffer.getUnsignedLEShort();
                this.turnRightAnimationId = buffer.getUnsignedLEShort();
                this.turnLeftAnimationId = buffer.getUnsignedLEShort();
            } else if (attributeId >= 30 && attributeId < 40) {
                if (this.actions == null) { this.actions = [null, null, null, null, null]; }
                this.actions[attributeId - 30] = buffer.getString();
                if (/* equalsIgnoreCase */((o1, o2) => o1.toUpperCase() === (o2 === null ? o2 : o2.toUpperCase()))(this.actions[attributeId - 30], "hidden")) { this.actions[attributeId - 30] = null; }
            } else if (attributeId === 40) {
                const modelColorCount: number = buffer.getUnsignedByte();
                this.modifiedModelColors = ((s) => { const a = []; while (s-- > 0) { a.push(0); } return a; })(modelColorCount);
                this.originalModelColors = ((s) => { const a = []; while (s-- > 0) { a.push(0); } return a; })(modelColorCount);
                for (let colour: number = 0; colour < modelColorCount; colour++) {{
                    this.modifiedModelColors[colour] = buffer.getUnsignedLEShort();
                    this.originalModelColors[colour] = buffer.getUnsignedLEShort();
                }}
            } else if (attributeId === 60) {
                const additionalModelCount: number = buffer.getUnsignedByte();
                this.headModelIndexes = ((s) => { const a = []; while (s-- > 0) { a.push(0); } return a; })(additionalModelCount);
                for (let model: number = 0; model < additionalModelCount; model++) {this.headModelIndexes[model] = buffer.getUnsignedLEShort(); }
            } else if (attributeId === 90) { this.anInt648 = buffer.getUnsignedLEShort(); } else if (attributeId === 91) { this.anInt627 = buffer.getUnsignedLEShort(); } else if (attributeId === 92) { this.anInt637 = buffer.getUnsignedLEShort(); } else if (attributeId === 93) { this.minimapVisible = false; } else if (attributeId === 95) { this.combatLevel = buffer.getUnsignedLEShort(); } else if (attributeId === 97) { this.sizeXZ = buffer.getUnsignedLEShort(); } else if (attributeId === 98) { this.sizeY = buffer.getUnsignedLEShort(); } else if (attributeId === 99) { this.visible = true; } else if (attributeId === 100) { this.brightness = buffer.getSignedByte(); } else if (attributeId === 101) { this.contrast = buffer.getSignedByte() * 5; } else if (attributeId === 102) { this.headIcon = buffer.getUnsignedLEShort(); } else if (attributeId === 103) { this.degreesToTurn = buffer.getUnsignedLEShort(); } else if (attributeId === 106) {
                this.varBitId = buffer.getUnsignedLEShort();
                if (this.varBitId === 65535) { this.varBitId = -1; }
                this.settingId = buffer.getUnsignedLEShort();
                if (this.settingId === 65535) { this.settingId = -1; }
                const childrenCount: number = buffer.getUnsignedByte();
                this.childrenIds = ((s) => { const a = []; while (s-- > 0) { a.push(0); } return a; })(childrenCount + 1);
                for (let child: number = 0; child <= childrenCount; child++) {{
                    this.childrenIds[child] = buffer.getUnsignedLEShort();
                    if (this.childrenIds[child] === 65535) { this.childrenIds[child] = -1; }
                }}
            } else if (attributeId === 107) { this.clickable = false; }
        }} while ((true));
    }

    public getHeadModel(): Model {
        if (this.childrenIds != null) {
            const definition: ActorDefinition = this.getChildDefinition();
            if (definition == null) { return null; } else { return definition.getHeadModel(); }
        }
        if (this.headModelIndexes == null) { return null; }
        let cached: boolean = false;
        for (let headModel: number = 0; headModel < this.headModelIndexes.length; headModel++) {if (!Model.loaded(this.headModelIndexes[headModel])) { cached = true; }}
        if (cached) { return null; }
        const headModels: Model[] = ((s) => { const a = []; while (s-- > 0) { a.push(null); } return a; })(this.headModelIndexes.length);
        for (let model: number = 0; model < this.headModelIndexes.length; model++) {headModels[model] = Model.getModel(this.headModelIndexes[model]); }
        let headModel: Model;
        if (headModels.length === 1) { headModel = headModels[0]; } else { headModel = new Model(headModels.length, headModels); }
        if (this.modifiedModelColors != null) {
            for (let colour: number = 0; colour < this.modifiedModelColors.length; colour++) {headModel.replaceColor(this.modifiedModelColors[colour], this.originalModelColors[colour]); }
        }
        return headModel;
    }

    public method360(): boolean {
        if (this.childrenIds == null) { return true; }
        let j: number = -1;
        if (this.varBitId !== -1) {
            const class49: Varbit = Varbit.cache[this.varBitId];
            const k: number = class49.configId;
            const l: number = class49.leastSignificantBit;
            const i1: number = class49.mostSignificantBit;
            const j1: number = Game.BITFIELD_MAX_VALUE[i1 - l];
            j = ActorDefinition.client.widgetSettings[k] >> l & j1;
        } else if (this.settingId !== -1) { j = ActorDefinition.client.widgetSettings[this.settingId]; }
        return j >= 0 && j < this.childrenIds.length && this.childrenIds[j] !== -1;
    }

    public getChildModel(frameId2: number, frameId: number, framesFrom2: number[]): Model {
        if (this.childrenIds != null) {
            const childDefinition: ActorDefinition = this.getChildDefinition();
            if (childDefinition == null) { return null; } else { return childDefinition.getChildModel(frameId2, frameId, framesFrom2); }
        }
        let childIdModel: Model = ActorDefinition.modelCache.get(this.id) as Model;
        if (childIdModel == null) {
            let cached: boolean = false;
            for (let modelId: number = 0; modelId < this.modelIds.length; modelId++) {if (!Model.loaded(this.modelIds[modelId])) { cached = true; }}
            if (cached) { return null; }
            const childModels: Model[] = ((s) => { const a = []; while (s-- > 0) { a.push(null); } return a; })(this.modelIds.length);
            for (let model: number = 0; model < this.modelIds.length; model++) {childModels[model] = Model.getModel(this.modelIds[model]); }
            if (childModels.length === 1) { childIdModel = childModels[0]; } else { childIdModel = new Model(childModels.length, childModels); }
            if (this.modifiedModelColors != null) {
                for (let colour: number = 0; colour < this.modifiedModelColors.length; colour++) {childIdModel.replaceColor(this.modifiedModelColors[colour], this.originalModelColors[colour]); }
            }
            childIdModel.createBones();
            childIdModel.applyLighting(64 + this.brightness, 850 + this.contrast, -30, -50, -30, true);
            ActorDefinition.modelCache.put(childIdModel, this.id);
        }
        const childModel: Model = Model.EMPTY_MODEL;
        childModel.replaceWithModel(childIdModel, ((lhs, rhs) => lhs && rhs)(Animation.exists(frameId2), Animation.exists(frameId)));
        if (frameId2 !== -1 && frameId !== -1) { childModel.mixAnimationFrames(frameId, 0, frameId2, framesFrom2); } else if (frameId2 !== -1) { childModel.applyTransform(frameId2); }
        if (this.sizeXZ !== 128 || this.sizeY !== 128) { childModel.scaleT(this.sizeY, this.sizeXZ, 9, this.sizeXZ); }
        childModel.calculateDiagonals();
        childModel.triangleSkin = null;
        childModel.vectorSkin = null;
        if (this.boundaryDimension === 1) { childModel.oneSquareModel = true; }
        return childModel;
    }

    public getChildDefinition(): ActorDefinition {
        let childId: number = -1;
        if (this.varBitId !== -1) {
            const varbit: Varbit = Varbit.cache[this.varBitId];
            const configId: number = varbit.configId;
            const leastSignificantBit: number = varbit.leastSignificantBit;
            const mostSignificantBit: number = varbit.mostSignificantBit;
            const bit: number = Game.BITFIELD_MAX_VALUE[mostSignificantBit - leastSignificantBit];
            childId = ActorDefinition.client.widgetSettings[configId] >> leastSignificantBit & bit;
        } else if (this.settingId !== -1) { childId = ActorDefinition.client.widgetSettings[this.settingId]; }
        if (childId < 0 || childId >= this.childrenIds.length || this.childrenIds[childId] === -1) { return null; } else { return ActorDefinition.getDefinition(this.childrenIds[childId]); }
    }
}

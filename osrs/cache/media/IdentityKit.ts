import { Model } from "../../media/renderable/Model";
import { Buffer } from "../../net/Buffer";
import { Archive } from "../Archive";

export class IdentityKit {
    public static count: number = 0;

    public static cache: IdentityKit[] = null;

    public static load(archive: Archive) {
        const buffer: Buffer = new Buffer(archive.getFile("idk.dat"));
        IdentityKit.count = buffer.getUnsignedLEShort();
        if (IdentityKit.cache == null) { IdentityKit.cache = ((s) => { const a = []; while (s-- > 0) { a.push(null); } return a; })(IdentityKit.count); }
        for (let identityKit: number = 0; identityKit < IdentityKit.count; identityKit++) {{
            if (IdentityKit.cache[identityKit] == null) { IdentityKit.cache[identityKit] = new IdentityKit(); }
            IdentityKit.cache[identityKit].loadDefinition(buffer);
        }}
    }

    public partId: number = -1;

    public modelId: number[];

    public originalModelColors: number[] = [0, 0, 0, 0, 0, 0];

    public modifiedModelColors: number[] = [0, 0, 0, 0, 0, 0];

    public headModelIds: number[] = [-1, -1, -1, -1, -1];

    public widgetDisplayed: boolean = false;

    constructor() {
        if (this.modelId === undefined) { this.modelId = null; }
    }

    public loadDefinition(buffer: Buffer) {
        while ((true)) {{
            const attributeId: number = buffer.getUnsignedByte();
            if (attributeId === 0) { return; }
            if (attributeId === 1) { this.partId = buffer.getUnsignedByte(); } else if (attributeId === 2) {
                const modelCount: number = buffer.getUnsignedByte();
                this.modelId = ((s) => { const a = []; while (s-- > 0) { a.push(0); } return a; })(modelCount);
                for (let model: number = 0; model < modelCount; model++) {this.modelId[model] = buffer.getUnsignedLEShort(); }
            } else if (attributeId === 3) { this.widgetDisplayed = true; } else if (attributeId >= 40 && attributeId < 50) { this.originalModelColors[attributeId - 40] = buffer.getUnsignedLEShort(); } else if (attributeId >= 50 && attributeId < 60) { this.modifiedModelColors[attributeId - 50] = buffer.getUnsignedLEShort(); } else if (attributeId >= 60 && attributeId < 70) { this.headModelIds[attributeId - 60] = buffer.getUnsignedLEShort(); } else { console.info("Error unrecognised config code: " + attributeId); }
        }}
    }

    public isBodyModelCached(): boolean {
        if (this.modelId == null) { return true; }
        let isCached: boolean = true;
        for (let i: number = 0; i < this.modelId.length; i++) {if (!Model.loaded(this.modelId[i])) { isCached = false; }}
        return isCached;
    }

    public getBodyModel(): Model {
        if (this.modelId == null) { return null; }
        const models: Model[] = ((s) => { const a = []; while (s-- > 0) { a.push(null); } return a; })(this.modelId.length);
        for (let model: number = 0; model < this.modelId.length; model++) {models[model] = Model.getModel(this.modelId[model]); }
        let model: Model;
        if (models.length === 1) { model = models[0]; } else { model = new Model(models.length, models); }
        for (let color: number = 0; color < 6; color++) {{
            if (this.originalModelColors[color] === 0) { break; }
            model.replaceColor(this.originalModelColors[color], this.modifiedModelColors[color]);
        }}
        return model;
    }

    public isHeadModelCached(): boolean {
        let cached: boolean = true;
        for (let model: number = 0; model < 5; model++) {if (this.headModelIds[model] !== -1 && !Model.loaded(this.headModelIds[model])) { cached = false; }}
        return cached;
    }

    public getHeadModel(): Model {
        const models: Model[] = [null, null, null, null, null];
        let count: number = 0;
        for (let model: number = 0; model < 5; model++) {if (this.headModelIds[model] !== -1) { models[count++] = Model.getModel(this.headModelIds[model]); }}
        const model: Model = new Model(count, models);
        for (let color: number = 0; color < 6; color++) {{
            if (this.originalModelColors[color] === 0) { break; }
            model.replaceColor(this.originalModelColors[color], this.modifiedModelColors[color]);
        }}
        return model;
    }
}

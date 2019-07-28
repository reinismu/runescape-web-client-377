import { Cache } from "../../collection/Cache";
import { Rasterizer } from "../../media/Rasterizer";
import { Rasterizer3D } from "../../media/Rasterizer3D";
import { Model } from "../../media/renderable/Model";
import { Renderable } from "../../media/renderable/Renderable";
import { Buffer } from "../../net/Buffer";
import { Archive } from "../Archive";
import { ImageRGB } from "../media/ImageRGB";

export class ItemDefinition {

    public static count: number = 0;

    public static cache: ItemDefinition[] = null;

    public static modelCache: Cache = new Cache(50);;
    public static offsets: number[] = null;

    public static memberServer: boolean = true;

    public static rgbImageCache: Cache = new Cache(100);;
    public static aBoolean350: boolean = true;

    public static cacheIndex: number = 0;

    public static buffer: Buffer = null;

    public static dispose() {
        ItemDefinition.modelCache = null;
        ItemDefinition.rgbImageCache = null;
        ItemDefinition.offsets = null;
        ItemDefinition.cache = null;
        ItemDefinition.buffer = null;
    }

    public static lookup(id: number): ItemDefinition {
        for (let i: number = 0; i < 10; i++) {if (ItemDefinition.cache[i].id === id) { return ItemDefinition.cache[i]; }}
        ItemDefinition.cacheIndex = (ItemDefinition.cacheIndex + 1) % 10;
        const definition: ItemDefinition = ItemDefinition.cache[ItemDefinition.cacheIndex];
        ItemDefinition.buffer.currentPosition = ItemDefinition.offsets[id];
        definition.id = id;
        definition.reset();
        definition.decode(ItemDefinition.buffer);
        if (definition.notedTemplateId !== -1) { definition.toNote(); }
        if (!ItemDefinition.memberServer && definition.members) {
            definition.name = "Members Object";
            definition.description = /* getBytes */("Login to a members\' server to use this object.").split("").map((s) => s.charCodeAt(0));
            definition.groundActions = null;
            definition.inventoryActions = null;
            definition.team = 0;
        }
        return definition;
    }

    public static load(archive: Archive) {
        ItemDefinition.buffer = new Buffer(archive.getFile("obj.dat"));
        const buffer: Buffer = new Buffer(archive.getFile("obj.idx"));
        ItemDefinition.count = buffer.getUnsignedLEShort();
        ItemDefinition.offsets = ((s) => { const a = []; while (s-- > 0) { a.push(0); } return a; })(ItemDefinition.count);
        let index: number = 2;
        for (let i: number = 0; i < ItemDefinition.count; i++) {{
            ItemDefinition.offsets[i] = index;
            index += buffer.getUnsignedLEShort();
        }}
        ItemDefinition.cache = [null, null, null, null, null, null, null, null, null, null];
        for (let i: number = 0; i < 10; i++) {ItemDefinition.cache[i] = new ItemDefinition(); }
    }

    public static sprite(id: number, stackSize: number, backColour: number): ImageRGB {
        if (backColour === 0) {
            let sprite: ImageRGB = ItemDefinition.rgbImageCache.get(id) as ImageRGB;
            if (sprite != null && sprite.maxHeight !== stackSize && sprite.maxHeight !== -1) {
                sprite.remove();
                sprite = null;
            }
            if (sprite != null) { return sprite; }
        }
        let definition: ItemDefinition = ItemDefinition.lookup(id);
        if (definition.stackIds == null) { stackSize = -1; }
        if (stackSize > 1) {
            let stackId: number = -1;
            for (let i: number = 0; i < 10; i++) {if (stackSize >= definition.stackAmounts[i] && definition.stackAmounts[i] !== 0) { stackId = definition.stackIds[i]; }}
            if (stackId !== -1) { definition = ItemDefinition.lookup(stackId); }
        }
        const model: Model = definition.asGroundStack(1);
        if (model == null) { return null; }
        let notedSprite: ImageRGB = null;
        if (definition.notedTemplateId !== -1) {
            notedSprite = ItemDefinition.sprite(definition.notedInfoId, 10, -1);
            if (notedSprite == null) { return null; }
        }
        const rendered: ImageRGB = ImageRGB.from(32, 32);
        const centreX: number = Rasterizer3D.centerX;
        const centerY: number = Rasterizer3D.centerY;
        const lineOffsets: number[] = Rasterizer3D.lineOffsets;
        const pixels: number[] = Rasterizer.pixels;
        const width: number = Rasterizer.width;
        const height: number = Rasterizer.height;
        const topX: number = Rasterizer.topX;
        const bottomX: number = Rasterizer.bottomX;
        const topY: number = Rasterizer.topY;
        const bottomY: number = Rasterizer.bottomY;
        Rasterizer3D.approximateAlphaBlending = false;
        Rasterizer.createRasterizer(rendered.pixels, 32, 32);
        Rasterizer.drawFilledRectangle(0, 0, 32, 32, 0);
        Rasterizer3D.setDefaultBoundaries();
        let scale: number = definition.modelScale;
        if (backColour === -1) { scale = (((scale * 1.5) as number) | 0); }
        if (backColour > 0) { scale = (((scale * 1.04) as number) | 0); }
        const sin: number = Rasterizer3D.SINE[definition.modelRotationX] * scale >> 16;
        const cos: number = Rasterizer3D.COSINE[definition.modelRotationX] * scale >> 16;
        model.render(0, definition.modelRotationY, definition.anInt339, definition.modelRotationX, definition.modelOffsetX, sin + (((model) as Renderable).modelHeight / 2 | 0) + definition.modelOffsetY, cos + definition.modelOffsetY);
        for (let x: number = 31; x >= 0; x--) {{
            for (let y: number = 31; y >= 0; y--) {if (rendered.pixels[x + y * 32] === 0) { if (x > 0 && rendered.pixels[(x - 1) + y * 32] > 1) { rendered.pixels[x + y * 32] = 1; } else if (y > 0 && rendered.pixels[x + (y - 1) * 32] > 1) { rendered.pixels[x + y * 32] = 1; } else if (x < 31 && rendered.pixels[x + 1 + y * 32] > 1) { rendered.pixels[x + y * 32] = 1; } else if (y < 31 && rendered.pixels[x + (y + 1) * 32] > 1) { rendered.pixels[x + y * 32] = 1; } }}
        }}
        if (backColour > 0) {
            for (let x: number = 31; x >= 0; x--) {{
                for (let y: number = 31; y >= 0; y--) {if (rendered.pixels[x + y * 32] === 0) { if (x > 0 && rendered.pixels[(x - 1) + y * 32] === 1) { rendered.pixels[x + y * 32] = backColour; } else if (y > 0 && rendered.pixels[x + (y - 1) * 32] === 1) { rendered.pixels[x + y * 32] = backColour; } else if (x < 31 && rendered.pixels[x + 1 + y * 32] === 1) { rendered.pixels[x + y * 32] = backColour; } else if (y < 31 && rendered.pixels[x + (y + 1) * 32] === 1) { rendered.pixels[x + y * 32] = backColour; } }}
            }}
        } else if (backColour === 0) {
            for (let x: number = 31; x >= 0; x--) {{
                for (let y: number = 31; y >= 0; y--) {if (rendered.pixels[x + y * 32] === 0 && x > 0 && y > 0 && rendered.pixels[(x - 1) + (y - 1) * 32] > 0) { rendered.pixels[x + y * 32] = 3153952; }}
            }}
        }
        if (definition.notedTemplateId !== -1) {
            const resizeWidth: number = notedSprite.maxWidth;
            const resizeHeight: number = notedSprite.maxHeight;
            notedSprite.maxWidth = 32;
            notedSprite.maxHeight = 32;
            notedSprite.drawImage(0, 0);
            notedSprite.maxWidth = resizeWidth;
            notedSprite.maxHeight = resizeHeight;
        }
        if (backColour === 0) { ItemDefinition.rgbImageCache.put(rendered, id); }
        Rasterizer.createRasterizer(pixels, width, height);
        Rasterizer.setCoordinates(topY, topX, bottomY, bottomX);
        Rasterizer3D.centerX = centreX;
        Rasterizer3D.centerY = centerY;
        Rasterizer3D.lineOffsets = lineOffsets;
        Rasterizer3D.approximateAlphaBlending = true;
        if (definition.stackable) { rendered.maxWidth = 33; } else { rendered.maxWidth = 32; }
        rendered.maxHeight = stackSize;
        return rendered;
    }
    public primaryFemaleModel: number;

    public modelOffsetX: number;

    public description: number[];

    public name: string;

    public femaleTranslation: number;

    public secondaryMaleModel: number;

    public team: number;

    public notedInfoId: number;

    public primaryMaleHeadPiece: number;

    public groundActions: string[];

    public anInt339: number;

    public modelOffsetY: number;

    public destColors: number[];

    public notedTemplateId: number;

    public value: number;

    public inventoryActions: string[];

    public primaryMaleModel: number;

    public ambience: number;

    public secondaryFemaleModel: number;

    public modelRotationY: number;

    public groundScaleY: number;

    public diffusion: number;

    public modelRotationX: number;

    public modelId: number;

    public secondaryMaleHeadPiece: number;

    public secondaryFemaleHeadPiece: number;

    public id: number = -1;

    public originalColours: number[];

    public stackIds: number[];

    public groundScaleX: number;

    public tertiaryFemaleEquipmentModel: number;

    public groundScaleZ: number;

    public modelScale: number;

    public tertiaryMaleEquipmentModel: number;

    public stackable: boolean;

    public anInt372: number;

    public primaryFemaleHeadPiece: number;

    public stackAmounts: number[];

    public members: boolean;

    public maleTranslation: number;

    constructor() {
        if (this.primaryFemaleModel === undefined) { this.primaryFemaleModel = 0; }
        if (this.modelOffsetX === undefined) { this.modelOffsetX = 0; }
        if (this.description === undefined) { this.description = null; }
        if (this.name === undefined) { this.name = null; }
        if (this.femaleTranslation === undefined) { this.femaleTranslation = 0; }
        if (this.secondaryMaleModel === undefined) { this.secondaryMaleModel = 0; }
        if (this.team === undefined) { this.team = 0; }
        if (this.notedInfoId === undefined) { this.notedInfoId = 0; }
        if (this.primaryMaleHeadPiece === undefined) { this.primaryMaleHeadPiece = 0; }
        if (this.groundActions === undefined) { this.groundActions = null; }
        if (this.anInt339 === undefined) { this.anInt339 = 0; }
        if (this.modelOffsetY === undefined) { this.modelOffsetY = 0; }
        if (this.destColors === undefined) { this.destColors = null; }
        if (this.notedTemplateId === undefined) { this.notedTemplateId = 0; }
        if (this.value === undefined) { this.value = 0; }
        if (this.inventoryActions === undefined) { this.inventoryActions = null; }
        if (this.primaryMaleModel === undefined) { this.primaryMaleModel = 0; }
        if (this.ambience === undefined) { this.ambience = 0; }
        if (this.secondaryFemaleModel === undefined) { this.secondaryFemaleModel = 0; }
        if (this.modelRotationY === undefined) { this.modelRotationY = 0; }
        if (this.groundScaleY === undefined) { this.groundScaleY = 0; }
        if (this.diffusion === undefined) { this.diffusion = 0; }
        if (this.modelRotationX === undefined) { this.modelRotationX = 0; }
        if (this.modelId === undefined) { this.modelId = 0; }
        if (this.secondaryMaleHeadPiece === undefined) { this.secondaryMaleHeadPiece = 0; }
        if (this.secondaryFemaleHeadPiece === undefined) { this.secondaryFemaleHeadPiece = 0; }
        if (this.originalColours === undefined) { this.originalColours = null; }
        if (this.stackIds === undefined) { this.stackIds = null; }
        if (this.groundScaleX === undefined) { this.groundScaleX = 0; }
        if (this.tertiaryFemaleEquipmentModel === undefined) { this.tertiaryFemaleEquipmentModel = 0; }
        if (this.groundScaleZ === undefined) { this.groundScaleZ = 0; }
        if (this.modelScale === undefined) { this.modelScale = 0; }
        if (this.tertiaryMaleEquipmentModel === undefined) { this.tertiaryMaleEquipmentModel = 0; }
        if (this.stackable === undefined) { this.stackable = false; }
        if (this.anInt372 === undefined) { this.anInt372 = 0; }
        if (this.primaryFemaleHeadPiece === undefined) { this.primaryFemaleHeadPiece = 0; }
        if (this.stackAmounts === undefined) { this.stackAmounts = null; }
        if (this.members === undefined) { this.members = false; }
        if (this.maleTranslation === undefined) { this.maleTranslation = 0; }
    }

    public reset() {
        this.modelId = 0;
        this.name = null;
        this.description = null;
        this.originalColours = null;
        this.destColors = null;
        this.modelScale = 2000;
        this.modelRotationX = 0;
        this.modelRotationY = 0;
        this.anInt339 = 0;
        this.modelOffsetX = 0;
        this.modelOffsetY = 0;
        this.anInt372 = -1;
        this.stackable = false;
        this.value = 1;
        this.members = false;
        this.groundActions = null;
        this.inventoryActions = null;
        this.primaryMaleModel = -1;
        this.secondaryMaleModel = -1;
        this.maleTranslation = 0;
        this.primaryFemaleModel = -1;
        this.secondaryFemaleModel = -1;
        this.femaleTranslation = 0;
        this.tertiaryMaleEquipmentModel = -1;
        this.tertiaryFemaleEquipmentModel = -1;
        this.primaryMaleHeadPiece = -1;
        this.secondaryMaleHeadPiece = -1;
        this.primaryFemaleHeadPiece = -1;
        this.secondaryFemaleHeadPiece = -1;
        this.stackIds = null;
        this.stackAmounts = null;
        this.notedInfoId = -1;
        this.notedTemplateId = -1;
        this.groundScaleX = 128;
        this.groundScaleY = 128;
        this.groundScaleZ = 128;
        this.ambience = 0;
        this.diffusion = 0;
        this.team = 0;
    }

    public headPieceReady(gender: number): boolean {
        let primary: number = this.primaryMaleHeadPiece;
        let secondary: number = this.secondaryMaleHeadPiece;
        if (gender === 1) {
            primary = this.primaryFemaleHeadPiece;
            secondary = this.secondaryFemaleHeadPiece;
        }
        if (primary === -1) { return true; }
        let ready: boolean = true;
        if (!Model.loaded(primary)) { ready = false; }
        if (secondary !== -1 && !Model.loaded(secondary)) { ready = false; }
        return ready;
    }

    public asEquipment(gender: number): Model {
        let primaryId: number = this.primaryMaleModel;
        let secondaryId: number = this.secondaryMaleModel;
        let tertiaryId: number = this.tertiaryMaleEquipmentModel;
        if (gender === 1) {
            primaryId = this.primaryFemaleModel;
            secondaryId = this.secondaryFemaleModel;
            tertiaryId = this.tertiaryFemaleEquipmentModel;
        }
        if (primaryId === -1) { return null; }
        let primary: Model = Model.getModel(primaryId);
        if (secondaryId !== -1) { if (tertiaryId !== -1) {
            const secondary: Model = Model.getModel(secondaryId);
            const tertiary: Model = Model.getModel(tertiaryId);
            const parts: Model[] = [primary, secondary, tertiary];
            primary = new Model(3, parts);
        } else {
            const secondary: Model = Model.getModel(secondaryId);
            const parts: Model[] = [primary, secondary];
            primary = new Model(2, parts);
        }
        }
        if (gender === 0 && this.maleTranslation !== 0) { primary.translate(0, 0, this.maleTranslation); }
        if (gender === 1 && this.femaleTranslation !== 0) { primary.translate(0, 0, this.femaleTranslation); }
        if (this.originalColours != null) {
            for (let color: number = 0; color < this.originalColours.length; color++) {primary.replaceColor(this.originalColours[color], this.destColors[color]); }
        }
        return primary;
    }

    public toNote() {
        const graphics: ItemDefinition = ItemDefinition.lookup(this.notedTemplateId);
        this.modelId = graphics.modelId;
        this.modelScale = graphics.modelScale;
        this.modelRotationX = graphics.modelRotationX;
        this.modelRotationY = graphics.modelRotationY;
        this.anInt339 = graphics.anInt339;
        this.modelOffsetX = graphics.modelOffsetX;
        this.modelOffsetY = graphics.modelOffsetY;
        this.originalColours = graphics.originalColours;
        this.destColors = graphics.destColors;
        const info: ItemDefinition = ItemDefinition.lookup(this.notedInfoId);
        this.name = info.name;
        this.members = info.members;
        this.value = info.value;
        let prefix: string = "a";
        const firstChar: string = info.name.charAt(0);
        if (((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(firstChar) == "A".charCodeAt(0) || ((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(firstChar) == "E".charCodeAt(0) || ((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(firstChar) == "I".charCodeAt(0) || ((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(firstChar) == "O".charCodeAt(0) || ((c) => c.charCodeAt == null ? c as any : c.charCodeAt(0))(firstChar) == "U".charCodeAt(0)) { prefix = "an"; }
        this.description = /* getBytes */(("Swap this note at any bank for " + prefix + " " + info.name + ".")).split("").map((s) => s.charCodeAt(0));
        this.stackable = true;
    }

    public equipmentReady(gender: number): boolean {
        let primary: number = this.primaryMaleModel;
        let secondary: number = this.secondaryMaleModel;
        let tertiary: number = this.tertiaryMaleEquipmentModel;
        if (gender === 1) {
            primary = this.primaryFemaleModel;
            secondary = this.secondaryFemaleModel;
            tertiary = this.tertiaryFemaleEquipmentModel;
        }
        if (primary === -1) { return true; }
        let ready: boolean = true;
        if (!Model.loaded(primary)) { ready = false; }
        if (secondary !== -1 && !Model.loaded(secondary)) { ready = false; }
        if (tertiary !== -1 && !Model.loaded(tertiary)) { ready = false; }
        return ready;
    }

    public asStack(stackSize: number): Model {
        if (this.stackIds != null && stackSize > 1) {
            let id: number = -1;
            for (let i: number = 0; i < 10; i++) {if (stackSize >= this.stackAmounts[i] && this.stackAmounts[i] !== 0) { id = this.stackIds[i]; }}
            if (id !== -1) { return ItemDefinition.lookup(id).asStack(1); }
        }
        const model: Model = Model.getModel(this.modelId);
        if (model == null) { return null; }
        if (this.originalColours != null) {
            for (let i: number = 0; i < this.originalColours.length; i++) {model.replaceColor(this.originalColours[i], this.destColors[i]); }
        }
        return model;
    }

    public decode(buffer: Buffer) {
        while ((true)) {{
            const opcode: number = buffer.getUnsignedByte();
            if (opcode === 0) { return; }
            if (opcode === 1) { this.modelId = buffer.getUnsignedLEShort(); } else if (opcode === 2) { this.name = buffer.getString(); } else if (opcode === 3) { this.description = buffer.getStringBytes(); } else if (opcode === 4) { this.modelScale = buffer.getUnsignedLEShort(); } else if (opcode === 5) { this.modelRotationX = buffer.getUnsignedLEShort(); } else if (opcode === 6) { this.modelRotationY = buffer.getUnsignedLEShort(); } else if (opcode === 7) {
                this.modelOffsetX = buffer.getUnsignedLEShort();
                if (this.modelOffsetX > 32767) { this.modelOffsetX -= 65536; }
            } else if (opcode === 8) {
                this.modelOffsetY = buffer.getUnsignedLEShort();
                if (this.modelOffsetY > 32767) { this.modelOffsetY -= 65536; }
            } else if (opcode === 10) { buffer.getUnsignedLEShort(); } else if (opcode === 11) { this.stackable = true; } else if (opcode === 12) { this.value = buffer.getInt(); } else if (opcode === 16) { this.members = true; } else if (opcode === 23) {
                this.primaryMaleModel = buffer.getUnsignedLEShort();
                this.maleTranslation = buffer.getSignedByte();
            } else if (opcode === 24) { this.secondaryMaleModel = buffer.getUnsignedLEShort(); } else if (opcode === 25) {
                this.primaryFemaleModel = buffer.getUnsignedLEShort();
                this.femaleTranslation = buffer.getSignedByte();
            } else if (opcode === 26) { this.secondaryFemaleModel = buffer.getUnsignedLEShort(); } else if (opcode >= 30 && opcode < 35) {
                if (this.groundActions == null) { this.groundActions = [null, null, null, null, null]; }
                this.groundActions[opcode - 30] = buffer.getString();
                if (/* equalsIgnoreCase */((o1, o2) => o1.toUpperCase() === (o2 === null ? o2 : o2.toUpperCase()))(this.groundActions[opcode - 30], "hidden")) { this.groundActions[opcode - 30] = null; }
            } else if (opcode >= 35 && opcode < 40) {
                if (this.inventoryActions == null) { this.inventoryActions = [null, null, null, null, null]; }
                this.inventoryActions[opcode - 35] = buffer.getString();
            } else if (opcode === 40) {
                const colorCount: number = buffer.getUnsignedByte();
                this.originalColours = ((s) => { const a = []; while (s-- > 0) { a.push(0); } return a; })(colorCount);
                this.destColors = ((s) => { const a = []; while (s-- > 0) { a.push(0); } return a; })(colorCount);
                for (let k: number = 0; k < colorCount; k++) {{
                    this.originalColours[k] = buffer.getUnsignedLEShort();
                    this.destColors[k] = buffer.getUnsignedLEShort();
                }}
            } else if (opcode === 78) { this.tertiaryMaleEquipmentModel = buffer.getUnsignedLEShort(); } else if (opcode === 79) { this.tertiaryFemaleEquipmentModel = buffer.getUnsignedLEShort(); } else if (opcode === 90) { this.primaryMaleHeadPiece = buffer.getUnsignedLEShort(); } else if (opcode === 91) { this.primaryFemaleHeadPiece = buffer.getUnsignedLEShort(); } else if (opcode === 92) { this.secondaryMaleHeadPiece = buffer.getUnsignedLEShort(); } else if (opcode === 93) { this.secondaryFemaleHeadPiece = buffer.getUnsignedLEShort(); } else if (opcode === 95) { this.anInt339 = buffer.getUnsignedLEShort(); } else if (opcode === 97) { this.notedInfoId = buffer.getUnsignedLEShort(); } else if (opcode === 98) { this.notedTemplateId = buffer.getUnsignedLEShort(); } else if (opcode >= 100 && opcode < 110) {
                if (this.stackIds == null) {
                    this.stackIds = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                    this.stackAmounts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                }
                this.stackIds[opcode - 100] = buffer.getUnsignedLEShort();
                this.stackAmounts[opcode - 100] = buffer.getUnsignedLEShort();
            } else if (opcode === 110) { this.groundScaleX = buffer.getUnsignedLEShort(); } else if (opcode === 111) { this.groundScaleY = buffer.getUnsignedLEShort(); } else if (opcode === 112) { this.groundScaleZ = buffer.getUnsignedLEShort(); } else if (opcode === 113) { this.ambience = buffer.getSignedByte(); } else if (opcode === 114) { this.diffusion = buffer.getSignedByte() * 5; } else if (opcode === 115) { this.team = buffer.getUnsignedByte(); }
        }}
    }

    public asHeadPiece(gender: number): Model {
        let primaryId: number = this.primaryMaleHeadPiece;
        let secondaryId: number = this.secondaryMaleHeadPiece;
        if (gender === 1) {
            primaryId = this.primaryFemaleHeadPiece;
            secondaryId = this.secondaryFemaleHeadPiece;
        }
        if (primaryId === -1) { return null; }
        let primary: Model = Model.getModel(primaryId);
        if (secondaryId !== -1) {
            const secondary: Model = Model.getModel(secondaryId);
            primary = new Model(2, [primary, secondary]);
        }
        if (this.originalColours != null) {
            for (let index: number = 0; index < this.originalColours.length; index++) {primary.replaceColor(this.originalColours[index], this.destColors[index]); }
        }
        return primary;
    }

    public asGroundStack(amount: number): Model {
        if (this.stackIds != null && amount > 1) {
            let id: number = -1;
            for (let i: number = 0; i < 10; i++) {if (amount >= this.stackAmounts[i] && this.stackAmounts[i] !== 0) { id = this.stackIds[i]; }}
            if (id !== -1) { return ItemDefinition.lookup(id).asGroundStack(1); }
        }
        let model: Model = ItemDefinition.modelCache.get(this.id) as Model;
        if (model != null) { return model; }
        model = Model.getModel(this.modelId);
        if (model == null) { return null; }
        if (this.groundScaleX !== 128 || this.groundScaleY !== 128 || this.groundScaleZ !== 128) { model.scaleT(this.groundScaleY, this.groundScaleZ, 9, this.groundScaleX); }
        if (this.originalColours != null) {
            for (let l: number = 0; l < this.originalColours.length; l++) {model.replaceColor(this.originalColours[l], this.destColors[l]); }
        }
        model.applyLighting(64 + this.ambience, 768 + this.diffusion, -50, -10, -50, true);
        model.oneSquareModel = true;
        ItemDefinition.modelCache.put(model, this.id);
        return model;
    }
}

ItemDefinition.rgbImageCache;

ItemDefinition.modelCache;

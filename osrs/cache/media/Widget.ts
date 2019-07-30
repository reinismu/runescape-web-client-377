import { Cache } from "../../collection/Cache";
import { Game } from "../../Game";
import { Animation } from "../../media/Animation";
import { Model } from "../../media/renderable/Model";
import { Buffer } from "../../net/Buffer";
import { TextUtils } from "../../util/TextUtils";
import { Archive } from "../Archive";
import { ActorDefinition } from "../def/ActorDefinition";
import { ItemDefinition } from "../def/ItemDefinition";
import { ImageRGB } from "./ImageRGB";
import { TypeFace } from "./TypeFace";

export class Widget {

    public static mediaArchive: Archive = null;

    public static interfaces: Widget[] = null;

    public static fonts: TypeFace[] = null;

    public static anInt243: number = 0;

    public static anInt246: number = -1;

    // public static spriteCache: Cache = null;
    public static spriteCacheModern: Map<number, ImageRGB> = new Map<number, ImageRGB>();

    public static anInt255: number = -1;

    public static modelCache: Cache = new Cache(30);;
    public static anInt277: number = -1;

    public static anInt280: number = 0;

    public static data: number[][] = null;

    public static getImage(spriteId: number, spriteName: string): ImageRGB {
        const hash = TextUtils.spriteToHash(spriteName);
        const spriteHash = (hash << 8) + spriteId;
        let sprite: ImageRGB = Widget.spriteCacheModern.get(spriteHash);
        if (sprite != null) { 
            return sprite; 
        }
        if (Widget.mediaArchive == null) {
             return null;
             }
        try {
            sprite = ImageRGB.fromArchive(Widget.mediaArchive, spriteName, spriteId);
            Widget.spriteCacheModern.set(spriteHash, sprite);
        } catch (_ex) {
            return null;
        }
        return sprite;
    }

    public static forId(id: number): Widget {
        if (Widget.interfaces[id] == null) {
            const buf: Buffer = new Buffer(Widget.data[id]);
            const j: number = buf.getUnsignedLEShort();
            Widget.interfaces[id] = Widget.parse(j, buf, id);
        }
        return Widget.interfaces[id];
    }

    public static parse(parentId: number, buffer: Buffer, widgetIndex: number): Widget {
        const widget: Widget = new Widget();
        widget.id = widgetIndex;
        widget.parentId = parentId;
        widget.type = buffer.getUnsignedByte();
        widget.actionType = buffer.getUnsignedByte();
        widget.contentType = buffer.getUnsignedLEShort();
        widget.width = buffer.getUnsignedLEShort();
        widget.height = buffer.getUnsignedLEShort();
        widget.alpha = ((buffer.getUnsignedByte() as number) | 0);
        widget.hoveredPopup = buffer.getUnsignedByte();
        if (widget.hoveredPopup !== 0) { widget.hoveredPopup = (widget.hoveredPopup - 1 << 8) + buffer.getUnsignedByte(); } else { widget.hoveredPopup = -1; }
        if (widget.contentType === 600) { Widget.anInt246 = parentId; }
        if (widget.contentType === 650) { Widget.anInt255 = parentId; }
        if (widget.contentType === 655) { Widget.anInt277 = parentId; }
        const conditionCount: number = buffer.getUnsignedByte();
        if (conditionCount > 0) {
            widget.conditionTypes = Array(conditionCount).fill(0);
            widget.conditionValues = Array(conditionCount).fill(0);
            for (let condition: number = 0; condition < conditionCount; condition++) {{
                widget.conditionTypes[condition] = buffer.getUnsignedByte();
                widget.conditionValues[condition] = buffer.getUnsignedLEShort();
            }}
        }
        const opcodeCount: number = buffer.getUnsignedByte();
        if (opcodeCount > 0) {
            widget.opcodes =Array(opcodeCount).fill(0);
            for (let opcode: number = 0; opcode < opcodeCount; opcode++) {{
                const subOpcodeCount: number = buffer.getUnsignedLEShort();
                widget.opcodes[opcode] = ((s) => { const a = []; while (s-- > 0) { a.push(0); } return a; })(subOpcodeCount);
                for (let subOpcode: number = 0; subOpcode < subOpcodeCount; subOpcode++) {widget.opcodes[opcode][subOpcode] = buffer.getUnsignedLEShort(); }
            }}
        }
        if (widget.type === 0) {
            widget.scrollLimit = buffer.getUnsignedLEShort();
            widget.hiddenUntilHovered = buffer.getUnsignedByte() === 1;
            const childrenCount: number = buffer.getUnsignedLEShort();
            widget.children = Array(childrenCount).fill(0);
            widget.childrenX = Array(childrenCount).fill(0);
            widget.childrenY = Array(childrenCount).fill(0);
            for (let child: number = 0; child < childrenCount; child++) {{
                widget.children[child] = buffer.getUnsignedLEShort();
                widget.childrenX[child] = buffer.getSignedShort();
                widget.childrenY[child] = buffer.getSignedShort();
            }}
        }
        if (widget.type === 1) {
            widget.unknownOne = buffer.getUnsignedLEShort();
            widget.unknownTwo = buffer.getUnsignedByte() === 1;
        }
        if (widget.type === 2) {
            widget.items = Array(widget.width * widget.height).fill(0);
            widget.itemAmounts = Array(widget.width * widget.height).fill(0) ;
            widget.itemSwapable = buffer.getUnsignedByte() === 1;
            widget.isInventory = buffer.getUnsignedByte() === 1;
            widget.itemUsable = buffer.getUnsignedByte() === 1;
            widget.itemDeletesDraged = buffer.getUnsignedByte() === 1;
            widget.itemSpritePadsX = buffer.getUnsignedByte();
            widget.itemSpritePadsY = buffer.getUnsignedByte();
            widget.imageX = Array(20).fill(0);
            widget.imageY = Array(20).fill(0);
            widget.images = Array(20).fill(null);
            for (let sprite: number = 0; sprite < 20; sprite++) {{
                const hasSprite: number = buffer.getUnsignedByte();
                if (hasSprite === 1) {
                    widget.imageX[sprite] = buffer.getSignedShort();
                    widget.imageY[sprite] = buffer.getSignedShort();
                    const spriteName: string = buffer.getString();
                    if (spriteName.length > 0) {
                        const spriteId: number = spriteName.lastIndexOf(",");
                        widget.images[sprite] = Widget.getImage(parseInt(spriteName.substring(spriteId + 1)), spriteName.substring(0, spriteId));
                    }
                }
            }}
            widget.options = [null, null, null, null, null];
            for (let optionId: number = 0; optionId < 5; optionId++) {{
                widget.options[optionId] = buffer.getString();
                if (widget.options[optionId].length === 0) { widget.options[optionId] = null; }
            }}
        }
        if (widget.type === 3) { widget.filled = buffer.getUnsignedByte() === 1; }
        if (widget.type === 4 || widget.type === 1) {
            widget.typeFaceCentered = buffer.getUnsignedByte() === 1;
            const typeFace: number = buffer.getUnsignedByte();
            if (Widget.fonts != null) { widget.typeFaces = Widget.fonts[typeFace]; }
            widget.typeFaceShadowed = buffer.getUnsignedByte() === 1;
        }
        if (widget.type === 4) {
            widget.disabledText = buffer.getString();
            widget.enabledText = buffer.getString();
        }
        if (widget.type === 1 || widget.type === 3 || widget.type === 4) { widget.disabledColor = buffer.getInt(); }
        if (widget.type === 3 || widget.type === 4) {
            widget.enabledColor = buffer.getInt();
            widget.disabledHoveredColor = buffer.getInt();
            widget.enabledHoveredColor = buffer.getInt();
        }
        if (widget.type === 5) {
            let spriteName: string = buffer.getString();
            if (spriteName.length > 0) {
                const spriteId: number = spriteName.lastIndexOf(",");
                widget.disabledImage = Widget.getImage(parseInt(spriteName.substring(spriteId + 1)), spriteName.substring(0, spriteId));
            }
            spriteName = buffer.getString();
            if (spriteName.length > 0) {
                const spriteId: number = spriteName.lastIndexOf(",");
                widget.enabledImage = Widget.getImage(parseInt(spriteName.substring(spriteId + 1)), spriteName.substring(0, spriteId));
            }
        }
        if (widget.type === 6) {
            widgetIndex = buffer.getUnsignedByte();
            if (widgetIndex !== 0) {
                widget.modelType = 1;
                widget.modelId = (widgetIndex - 1 << 8) + buffer.getUnsignedByte();
            }
            widgetIndex = buffer.getUnsignedByte();
            if (widgetIndex !== 0) {
                widget.enabledModelType = 1;
                widget.enabledModelId = (widgetIndex - 1 << 8) + buffer.getUnsignedByte();
            }
            widgetIndex = buffer.getUnsignedByte();
            if (widgetIndex !== 0) { widget.disabledAnimation = (widgetIndex - 1 << 8) + buffer.getUnsignedByte(); } else { widget.disabledAnimation = -1; }
            widgetIndex = buffer.getUnsignedByte();
            if (widgetIndex !== 0) { widget.enabledAnimation = (widgetIndex - 1 << 8) + buffer.getUnsignedByte(); } else { widget.enabledAnimation = -1; }
            widget.zoom = buffer.getUnsignedLEShort();
            widget.rotationX = buffer.getUnsignedLEShort();
            widget.rotationY = buffer.getUnsignedLEShort();
        }
        if (widget.type === 7) {
            widget.items = Array(widget.width * widget.height).fill(0);
            widget.itemAmounts = Array(widget.width * widget.height).fill(0);
            widget.typeFaceCentered = buffer.getUnsignedByte() === 1;
            const typeFaceCount: number = buffer.getUnsignedByte();
            if (Widget.fonts != null) { widget.typeFaces = Widget.fonts[typeFaceCount]; }
            widget.typeFaceShadowed = buffer.getUnsignedByte() === 1;
            widget.disabledColor = buffer.getInt();
            widget.itemSpritePadsX = buffer.getSignedShort();
            widget.itemSpritePadsY = buffer.getSignedShort();
            widget.isInventory = buffer.getUnsignedByte() === 1;
            widget.options = [null, null, null, null, null];
            for (let optionId: number = 0; optionId < 5; optionId++) {{
                widget.options[optionId] = buffer.getString();
                if (widget.options[optionId].length === 0) { widget.options[optionId] = null; }
            }}
        }
        if (widget.type === 8) { widget.disabledText = buffer.getString(); }
        if (widget.actionType === 2 || widget.type === 2) {
            widget.optionCircumfix = buffer.getString();
            widget.optionText = buffer.getString();
            widget.optionAttributes = buffer.getUnsignedLEShort();
        }
        if (widget.actionType === 1 || widget.actionType === 4 || widget.actionType === 5 || widget.actionType === 6) {
            widget.tooltip = buffer.getString();
            if (widget.tooltip.length === 0) {
                if (widget.actionType === 1) { widget.tooltip = "Ok"; }
                if (widget.actionType === 4) { widget.tooltip = "Select"; }
                if (widget.actionType === 5) { widget.tooltip = "Select"; }
                if (widget.actionType === 6) { widget.tooltip = "Continue"; }
            }
        }
        return widget;
    }

    public static load(widgetArchive: Archive, fonts: TypeFace[], mediaArchive: Archive) {
        // Widget.spriteCache = new Cache(50000);
        const buffer: Buffer = new Buffer(widgetArchive.getFile("data"));
        Widget.mediaArchive = mediaArchive;
        Widget.fonts = fonts;
        let parentId: number = -1;
        const widgetCount: number = buffer.getUnsignedLEShort();
        Widget.interfaces = Array(widgetCount).fill(null);
        Widget.data = Array(widgetCount).fill(0);
        while ((buffer.currentPosition < buffer.buffer.length)) {{
            let widgetIndex: number = buffer.getUnsignedLEShort();
            if (widgetIndex === 65535) {
                parentId = buffer.getUnsignedLEShort();
                widgetIndex = buffer.getUnsignedLEShort();
            }
            const i1: number = buffer.currentPosition;
            const widget: Widget = Widget.parse(parentId, buffer, widgetIndex);
            const temp: number[] = Widget.data[widget.id] = Array((buffer.currentPosition - i1) + 2).fill(0);
            for (let j1: number = i1; j1 < buffer.currentPosition; j1++) {temp[(j1 - i1) + 2] = buffer.buffer[j1]; }
            temp[0] = (((parentId >> 8) as number) | 0);
            temp[1] = ((parentId as number) | 0);
        }}
        Widget.mediaArchive = null;
    }

    public static method200(i: number) {
        if (i === -1) { return; }
        for (let j: number = 0; j < Widget.interfaces.length; j++) {if (Widget.interfaces[j] != null && Widget.interfaces[j].parentId === i && Widget.interfaces[j].type !== 2) { Widget.interfaces[j] = null; }}
    }

    public static setModel(modelType: number, model: Model, modelId: number) {
        Widget.modelCache.removeAll();
        if (model != null && modelType !== 4) { Widget.modelCache.put(model, (modelType << 16) + modelId); }
    }

    public static reset() {
        Widget.interfaces = null;
        Widget.mediaArchive = null;
        Widget.spriteCacheModern = new Map();
        Widget.fonts = null;
        Widget.data = null;
    }
    
    public optionText: string = null;

    public disabledImage: ImageRGB = null;

    public imageY: number[] = null;

    public id: number = 0;

    public itemDeletesDraged: boolean = false;

    public anInt218: number = 0;

    public hiddenUntilHovered: boolean = false;

    public alpha: number = 0;

    public imageX: number[] = null;

    public optionAttributes: number = 0;

    public itemAmounts: number[] = null;

    public unknownOne: number = 0;

    public enabledHoveredColor: number = 0;

    public anInt227: number = 0;

    public anInt228: number = 0;

    public isInventory: boolean = false;

    public disabledText: string = null;

    public anInt231: number = 0;

    public childrenX: number[] = null;

    public unknownTwo: boolean = false;

    public opcodes: number[][] = null;

    public anInt235: number = 0;

    public type: number = 0;

    public typeFaces: TypeFace = null;

    public height: number = 0;

    public filled: boolean = false;

    public disabledColor: number = 0;

    public width: number = 0;

    public contentType: number = 0;

    public itemSpritePadsY: number = 0;

    public enabledImage: ImageRGB = null;

    public typeFaceShadowed: boolean = false;

    public parentId: number = 0;

    public enabledText: string = null;

    public zoom: number = 0;

    public rotationX: number = 0;

    public rotationY: number = 0;

    public hoveredPopup: number = 0;

    public conditionValues: number[] = null;

    public children: number[] = null;

    public anInt259: number = 0;

    public enabledColor: number = 0;

    public disabledHoveredColor: number = 0;

    public options: string[] = null;

    public itemSpritePadsX: number = 0;

    public images: ImageRGB[] = null;

    public enabledModelType: number = 0;

    public enabledModelId: number = 0;

    public tooltip: string = null;

    public items: number[] = null;

    public typeFaceCentered: boolean = false;

    public conditionTypes: number[] = null;

    public itemSwapable: boolean = false;

    public childrenY: number[] = null;

    public optionCircumfix: string = null;

    public modelType: number = 0;

    public modelId: number = 0;

    public scrollLimit: number = 0;

    public disabledAnimation: number = 0;

    public enabledAnimation: number = 0;

    public itemUsable: boolean = false;

    public actionType: number = 0;

    constructor() {
        if (this.optionText === undefined) { this.optionText = null; }
        if (this.disabledImage === undefined) { this.disabledImage = null; }
        if (this.imageY === undefined) { this.imageY = null; }
        if (this.id === undefined) { this.id = 0; }
        if (this.itemDeletesDraged === undefined) { this.itemDeletesDraged = false; }
        if (this.anInt218 === undefined) { this.anInt218 = 0; }
        if (this.hiddenUntilHovered === undefined) { this.hiddenUntilHovered = false; }
        if (this.alpha === undefined) { this.alpha = 0; }
        if (this.imageX === undefined) { this.imageX = null; }
        if (this.optionAttributes === undefined) { this.optionAttributes = 0; }
        if (this.itemAmounts === undefined) { this.itemAmounts = null; }
        if (this.unknownOne === undefined) { this.unknownOne = 0; }
        if (this.enabledHoveredColor === undefined) { this.enabledHoveredColor = 0; }
        if (this.anInt227 === undefined) { this.anInt227 = 0; }
        if (this.anInt228 === undefined) { this.anInt228 = 0; }
        if (this.isInventory === undefined) { this.isInventory = false; }
        if (this.disabledText === undefined) { this.disabledText = null; }
        if (this.anInt231 === undefined) { this.anInt231 = 0; }
        if (this.childrenX === undefined) { this.childrenX = null; }
        if (this.unknownTwo === undefined) { this.unknownTwo = false; }
        if (this.opcodes === undefined) { this.opcodes = null; }
        if (this.anInt235 === undefined) { this.anInt235 = 0; }
        if (this.type === undefined) { this.type = 0; }
        if (this.typeFaces === undefined) { this.typeFaces = null; }
        if (this.height === undefined) { this.height = 0; }
        if (this.filled === undefined) { this.filled = false; }
        if (this.disabledColor === undefined) { this.disabledColor = 0; }
        if (this.width === undefined) { this.width = 0; }
        if (this.contentType === undefined) { this.contentType = 0; }
        if (this.itemSpritePadsY === undefined) { this.itemSpritePadsY = 0; }
        if (this.enabledImage === undefined) { this.enabledImage = null; }
        if (this.typeFaceShadowed === undefined) { this.typeFaceShadowed = false; }
        if (this.parentId === undefined) { this.parentId = 0; }
        if (this.enabledText === undefined) { this.enabledText = null; }
        if (this.zoom === undefined) { this.zoom = 0; }
        if (this.rotationX === undefined) { this.rotationX = 0; }
        if (this.rotationY === undefined) { this.rotationY = 0; }
        if (this.hoveredPopup === undefined) { this.hoveredPopup = 0; }
        if (this.conditionValues === undefined) { this.conditionValues = null; }
        if (this.children === undefined) { this.children = null; }
        if (this.anInt259 === undefined) { this.anInt259 = 0; }
        if (this.enabledColor === undefined) { this.enabledColor = 0; }
        if (this.disabledHoveredColor === undefined) { this.disabledHoveredColor = 0; }
        if (this.options === undefined) { this.options = null; }
        if (this.itemSpritePadsX === undefined) { this.itemSpritePadsX = 0; }
        if (this.images === undefined) { this.images = null; }
        if (this.enabledModelType === undefined) { this.enabledModelType = 0; }
        if (this.enabledModelId === undefined) { this.enabledModelId = 0; }
        if (this.tooltip === undefined) { this.tooltip = null; }
        if (this.items === undefined) { this.items = null; }
        if (this.typeFaceCentered === undefined) { this.typeFaceCentered = false; }
        if (this.conditionTypes === undefined) { this.conditionTypes = null; }
        if (this.itemSwapable === undefined) { this.itemSwapable = false; }
        if (this.childrenY === undefined) { this.childrenY = null; }
        if (this.optionCircumfix === undefined) { this.optionCircumfix = null; }
        if (this.modelType === undefined) { this.modelType = 0; }
        if (this.modelId === undefined) { this.modelId = 0; }
        if (this.scrollLimit === undefined) { this.scrollLimit = 0; }
        if (this.disabledAnimation === undefined) { this.disabledAnimation = 0; }
        if (this.enabledAnimation === undefined) { this.enabledAnimation = 0; }
        if (this.itemUsable === undefined) { this.itemUsable = false; }
        if (this.actionType === undefined) { this.actionType = 0; }
    }

    public swapItems(originalSlot: number, newSlot: number) {
        let originalItem: number = this.items[originalSlot];
        this.items[originalSlot] = this.items[newSlot];
        this.items[newSlot] = originalItem;
        originalItem = this.itemAmounts[originalSlot];
        this.itemAmounts[originalSlot] = this.itemAmounts[newSlot];
        this.itemAmounts[newSlot] = originalItem;
    }

    public getModel(modelType: number, modelId: number): Model {
        let item: ItemDefinition = null;
        if (modelType === 4) {
            item = ItemDefinition.lookup(modelId);
            Widget.anInt280 += item.ambience;
            Widget.anInt243 += item.diffusion;
        }
        let model: Model = Widget.modelCache.get((modelType << 16) + modelId) as Model;
        if (model != null) { return model; }
        if (modelType === 1) { model = Model.getModel(modelId); }
        if (modelType === 2) { model = ActorDefinition.getDefinition(modelId).getHeadModel(); }
        if (modelType === 3) { model = Game.localPlayer.getHeadModel(); }
        if (modelType === 4) { model = item.asStack(50); }
        if (modelType === 5) { model = null; }
        if (model != null) { Widget.modelCache.put(model, (modelType << 16) + modelId); }
        return model;
    }

    public getAnimatedModel(frame1Id: number, frame2Id: number, modelEnabled: boolean): Model {
        let model: Model;
        if (modelEnabled) { model = this.getModel(this.enabledModelType, this.enabledModelId); } else { model = this.getModel(this.modelType, this.modelId); }
        if (model == null) { return null; }
        if (frame2Id === -1 && frame1Id === -1 && model.triangleColorValues == null) { return model; }
        const animatedModel: Model = new Model(true, model, ((lhs, rhs) => lhs && rhs)(Animation.exists(frame2Id), Animation.exists(frame1Id)));
        if (frame2Id !== -1 || frame1Id !== -1) { animatedModel.createBones(); }
        if (frame2Id !== -1) { animatedModel.applyTransform(frame2Id); }
        if (frame1Id !== -1) { animatedModel.applyTransform(frame1Id); }
        animatedModel.applyLighting(64, 768, -50, -10, -50, true);
        return animatedModel;
    }
}

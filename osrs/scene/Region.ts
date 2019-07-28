import { FloorDefinition } from "../cache/def/FloorDefinition";
import { GameObjectDefinition } from "../cache/def/GameObjectDefinition";
import { Rasterizer3D } from "../media/Rasterizer3D";
import { GameObject } from "../media/renderable/GameObject";
import { Model } from "../media/renderable/Model";
import { Renderable } from "../media/renderable/Renderable";
import { Buffer } from "../net/Buffer";
import { OnDemandRequester } from "../net/requester/OnDemandRequester";
import { Scene } from "./Scene";
import { CollisionMap } from "./util/CollisionMap";
import { TiledUtils } from "./util/TiledUtils";

export class Region {
    public static hueRandomizer: number = (((Math.random() * 17.0) as number) | 0) - 8;
    public static anIntArray143: number[] = [0, -1, 0, 1];
    public static lowestPlane: number = 99;

    public static aByte154: number = -80;

    public static anIntArray158: number[] = [1, 2, 4, 8];
    public static anIntArray161: number[] = [1, 0, -1, 0];
    public static onBuildTimePlane: number = 0;

    public static lightnessRandomizer: number = (((Math.random() * 33.0) as number) | 0) - 16;
    public static anIntArray167: number[] = [16, 32, 64, 128];
    public static lowMemory: boolean = true;

    public static calculateNoise(x: number, seed: number): number {
        let n: number = x + seed * 57;
        n = (n << 13) ^ n;
        const noise: number = (n * (n * n * 15731 + 789221) + 1376312589) & 2147483647;
        return (noise >> 19) & 255;
    }

    public static method163(i: number, i_0_: number, i_1_: number): number {
        const i_2_: number = (i / i_1_) | 0;
        const i_3_: number = i & (i_1_ - 1);
        const i_4_: number = (i_0_ / i_1_) | 0;
        const i_5_: number = i_0_ & (i_1_ - 1);
        const i_6_: number = Region.method178(i_2_, i_4_);
        const i_7_: number = Region.method178(i_2_ + 1, i_4_);
        const i_8_: number = Region.method178(i_2_, i_4_ + 1);
        const i_9_: number = Region.method178(i_2_ + 1, i_4_ + 1);
        const i_10_: number = Region.method176(i_6_, i_7_, i_3_, i_1_);
        const i_11_: number = Region.method176(i_8_, i_9_, i_3_, i_1_);
        return Region.method176(i_10_, i_11_, i_5_, i_1_);
    }

    public static method165(
        i: number,
        i_15_: number,
        i_16_: number,
        i_17_: number,
        class46: CollisionMap,
        i_18_: number,
        i_19_: number,
        i_20_: number,
        i_21_: number,
        class22: Scene,
        is: number[][][]
    ) {
        let i_22_: number = is[i_15_][i_19_][i_17_];
        let i_23_: number = is[i_15_][i_19_ + 1][i_17_];
        let i_24_: number = is[i_15_][i_19_ + 1][i_17_ + 1];
        let i_25_: number = is[i_15_][i_19_][i_17_ + 1];
        const i_26_: number = (i_22_ + i_23_ + i_24_ + i_25_) >> 2;
        const class47: GameObjectDefinition = GameObjectDefinition.getDefinition(i);
        if (i_20_ === 0) {
            let i_27_: number = i_19_ + (i_17_ << 7) + (i << 14) + 1073741824;
            if (!class47.actionsBoolean) {
                i_27_ += -2147483648;
            }
            const i_28_: number = (((i_18_ << 6) + i_16_) as number) | 0;
            if (i_16_ === 22) {
                let class50_sub1_sub4: Renderable;
                if (class47.animationId === -1 && class47.childrenIds == null) {
                    class50_sub1_sub4 = class47.getGameObjectModel(22, i_18_, i_22_, i_23_, i_24_, i_25_, -1);
                } else {
                    class50_sub1_sub4 = new GameObject(i, i_18_, 22, i_23_, i_24_, i_22_, i_25_, class47.animationId, true);
                }
                class22.addGroundDecoration(i_19_, i_17_, 669, i_28_, i_27_, i_26_, i_21_, class50_sub1_sub4);
                if (class47.solid && class47.actionsBoolean) {
                    class46.markBlocked(i_19_, i_17_);
                }
            } else if (i_16_ === 10 || i_16_ === 11) {
                let class50_sub1_sub4: Renderable;
                if (class47.animationId === -1 && class47.childrenIds == null) {
                    class50_sub1_sub4 = class47.getGameObjectModel(10, i_18_, i_22_, i_23_, i_24_, i_25_, -1);
                } else {
                    class50_sub1_sub4 = new GameObject(i, i_18_, 10, i_23_, i_24_, i_22_, i_25_, class47.animationId, true);
                }
                if (class50_sub1_sub4 != null) {
                    let i_29_: number = 0;
                    if (i_16_ === 11) {
                        i_29_ += 256;
                    }
                    let i_30_: number;
                    let i_31_: number;
                    if (i_18_ === 1 || i_18_ === 3) {
                        i_30_ = class47.sizeY;
                        i_31_ = class47.sizeX;
                    } else {
                        i_30_ = class47.sizeX;
                        i_31_ = class47.sizeY;
                    }
                    class22.method251(i_21_, i_30_, i_17_, class50_sub1_sub4, i_28_, i_29_, i_19_, -896, i_31_, i_26_, i_27_);
                }
                if (class47.solid) {
                    class46.method413(i_17_, i_18_, class47.sizeY, class47.sizeX, class47.walkable, i_19_, (52 as number) | 0);
                }
            } else if (i_16_ >= 12) {
                let class50_sub1_sub4: Renderable;
                if (class47.animationId === -1 && class47.childrenIds == null) {
                    class50_sub1_sub4 = class47.getGameObjectModel(i_16_, i_18_, i_22_, i_23_, i_24_, i_25_, -1);
                } else {
                    class50_sub1_sub4 = new GameObject(i, i_18_, i_16_, i_23_, i_24_, i_22_, i_25_, class47.animationId, true);
                }
                class22.method251(i_21_, 1, i_17_, class50_sub1_sub4, i_28_, 0, i_19_, -896, 1, i_26_, i_27_);
                if (class47.solid) {
                    class46.method413(i_17_, i_18_, class47.sizeY, class47.sizeX, class47.walkable, i_19_, (52 as number) | 0);
                }
            } else if (i_16_ === 0) {
                let class50_sub1_sub4: Renderable;
                if (class47.animationId === -1 && class47.childrenIds == null) {
                    class50_sub1_sub4 = class47.getGameObjectModel(0, i_18_, i_22_, i_23_, i_24_, i_25_, -1);
                } else {
                    class50_sub1_sub4 = new GameObject(i, i_18_, 0, i_23_, i_24_, i_22_, i_25_, class47.animationId, true);
                }
                class22.method249(Region.anIntArray158[i_18_], class50_sub1_sub4, i_27_, i_17_, i_28_, i_19_, null, i_26_, 0, i_21_);
                if (class47.solid) {
                    class46.markWall(i_19_, i_17_, i_16_, i_18_, class47.walkable);
                }
            } else if (i_16_ === 1) {
                let class50_sub1_sub4: Renderable;
                if (class47.animationId === -1 && class47.childrenIds == null) {
                    class50_sub1_sub4 = class47.getGameObjectModel(1, i_18_, i_22_, i_23_, i_24_, i_25_, -1);
                } else {
                    class50_sub1_sub4 = new GameObject(i, i_18_, 1, i_23_, i_24_, i_22_, i_25_, class47.animationId, true);
                }
                class22.method249(Region.anIntArray167[i_18_], class50_sub1_sub4, i_27_, i_17_, i_28_, i_19_, null, i_26_, 0, i_21_);
                if (class47.solid) {
                    class46.markWall(i_19_, i_17_, i_16_, i_18_, class47.walkable);
                }
            } else if (i_16_ === 2) {
                const i_32_: number = (i_18_ + 1) & 3;
                let class50_sub1_sub4: Renderable;
                let class50_sub1_sub4_33_: Renderable;
                if (class47.animationId === -1 && class47.childrenIds == null) {
                    class50_sub1_sub4 = class47.getGameObjectModel(2, 4 + i_18_, i_22_, i_23_, i_24_, i_25_, -1);
                    class50_sub1_sub4_33_ = class47.getGameObjectModel(2, i_32_, i_22_, i_23_, i_24_, i_25_, -1);
                } else {
                    class50_sub1_sub4 = new GameObject(i, 4 + i_18_, 2, i_23_, i_24_, i_22_, i_25_, class47.animationId, true);
                    class50_sub1_sub4_33_ = new GameObject(i, i_32_, 2, i_23_, i_24_, i_22_, i_25_, class47.animationId, true);
                }
                class22.method249(
                    Region.anIntArray158[i_18_],
                    class50_sub1_sub4,
                    i_27_,
                    i_17_,
                    i_28_,
                    i_19_,
                    class50_sub1_sub4_33_,
                    i_26_,
                    Region.anIntArray158[i_32_],
                    i_21_
                );
                if (class47.solid) {
                    class46.markWall(i_19_, i_17_, i_16_, i_18_, class47.walkable);
                }
            } else if (i_16_ === 3) {
                let class50_sub1_sub4: Renderable;
                if (class47.animationId === -1 && class47.childrenIds == null) {
                    class50_sub1_sub4 = class47.getGameObjectModel(3, i_18_, i_22_, i_23_, i_24_, i_25_, -1);
                } else {
                    class50_sub1_sub4 = new GameObject(i, i_18_, 3, i_23_, i_24_, i_22_, i_25_, class47.animationId, true);
                }
                class22.method249(Region.anIntArray167[i_18_], class50_sub1_sub4, i_27_, i_17_, i_28_, i_19_, null, i_26_, 0, i_21_);
                if (class47.solid) {
                    class46.markWall(i_19_, i_17_, i_16_, i_18_, class47.walkable);
                }
            } else if (i_16_ === 9) {
                let class50_sub1_sub4: Renderable;
                if (class47.animationId === -1 && class47.childrenIds == null) {
                    class50_sub1_sub4 = class47.getGameObjectModel(i_16_, i_18_, i_22_, i_23_, i_24_, i_25_, -1);
                } else {
                    class50_sub1_sub4 = new GameObject(i, i_18_, i_16_, i_23_, i_24_, i_22_, i_25_, class47.animationId, true);
                }
                class22.method251(i_21_, 1, i_17_, class50_sub1_sub4, i_28_, 0, i_19_, -896, 1, i_26_, i_27_);
                if (class47.solid) {
                    class46.method413(i_17_, i_18_, class47.sizeY, class47.sizeX, class47.walkable, i_19_, (52 as number) | 0);
                }
            } else {
                if (class47.adjustToTerrain) {
                    if (i_18_ === 1) {
                        const i_34_: number = i_25_;
                        i_25_ = i_24_;
                        i_24_ = i_23_;
                        i_23_ = i_22_;
                        i_22_ = i_34_;
                    } else if (i_18_ === 2) {
                        let i_35_: number = i_25_;
                        i_25_ = i_23_;
                        i_23_ = i_35_;
                        i_35_ = i_24_;
                        i_24_ = i_22_;
                        i_22_ = i_35_;
                    } else if (i_18_ === 3) {
                        const i_36_: number = i_25_;
                        i_25_ = i_22_;
                        i_22_ = i_23_;
                        i_23_ = i_24_;
                        i_24_ = i_36_;
                    }
                }
                if (i_16_ === 4) {
                    let class50_sub1_sub4: Renderable;
                    if (class47.animationId === -1 && class47.childrenIds == null) {
                        class50_sub1_sub4 = class47.getGameObjectModel(4, 0, i_22_, i_23_, i_24_, i_25_, -1);
                    } else {
                        class50_sub1_sub4 = new GameObject(i, 0, 4, i_23_, i_24_, i_22_, i_25_, class47.animationId, true);
                    }
                    class22.addWallDecoration(
                        i_21_,
                        Region.anIntArray158[i_18_],
                        i_18_ * 512,
                        i_27_,
                        i_28_,
                        i_19_,
                        0,
                        i_17_,
                        0,
                        i_26_,
                        class50_sub1_sub4,
                        -930
                    );
                } else if (i_16_ === 5) {
                    let i_37_: number = 16;
                    const i_38_: number = class22.method267(i_21_, i_19_, i_17_);
                    if (i_38_ > 0) {
                        i_37_ = GameObjectDefinition.getDefinition((i_38_ >> 14) & 32767).unknown4;
                    }
                    let class50_sub1_sub4: Renderable;
                    if (class47.animationId === -1 && class47.childrenIds == null) {
                        class50_sub1_sub4 = class47.getGameObjectModel(4, 0, i_22_, i_23_, i_24_, i_25_, -1);
                    } else {
                        class50_sub1_sub4 = new GameObject(i, 0, 4, i_23_, i_24_, i_22_, i_25_, class47.animationId, true);
                    }
                    class22.addWallDecoration(
                        i_21_,
                        Region.anIntArray158[i_18_],
                        i_18_ * 512,
                        i_27_,
                        i_28_,
                        i_19_,
                        Region.anIntArray143[i_18_] * i_37_,
                        i_17_,
                        Region.anIntArray161[i_18_] * i_37_,
                        i_26_,
                        class50_sub1_sub4,
                        -930
                    );
                } else if (i_16_ === 6) {
                    let class50_sub1_sub4: Renderable;
                    if (class47.animationId === -1 && class47.childrenIds == null) {
                        class50_sub1_sub4 = class47.getGameObjectModel(4, 0, i_22_, i_23_, i_24_, i_25_, -1);
                    } else {
                        class50_sub1_sub4 = new GameObject(i, 0, 4, i_23_, i_24_, i_22_, i_25_, class47.animationId, true);
                    }
                    class22.addWallDecoration(i_21_, 256, i_18_, i_27_, i_28_, i_19_, 0, i_17_, 0, i_26_, class50_sub1_sub4, -930);
                } else if (i_16_ === 7) {
                    let class50_sub1_sub4: Renderable;
                    if (class47.animationId === -1 && class47.childrenIds == null) {
                        class50_sub1_sub4 = class47.getGameObjectModel(4, 0, i_22_, i_23_, i_24_, i_25_, -1);
                    } else {
                        class50_sub1_sub4 = new GameObject(i, 0, 4, i_23_, i_24_, i_22_, i_25_, class47.animationId, true);
                    }
                    class22.addWallDecoration(i_21_, 512, i_18_, i_27_, i_28_, i_19_, 0, i_17_, 0, i_26_, class50_sub1_sub4, -930);
                } else if (i_16_ === 8) {
                    let class50_sub1_sub4: Renderable;
                    if (class47.animationId === -1 && class47.childrenIds == null) {
                        class50_sub1_sub4 = class47.getGameObjectModel(4, 0, i_22_, i_23_, i_24_, i_25_, -1);
                    } else {
                        class50_sub1_sub4 = new GameObject(i, 0, 4, i_23_, i_24_, i_22_, i_25_, class47.animationId, true);
                    }
                    class22.addWallDecoration(i_21_, 768, i_18_, i_27_, i_28_, i_19_, 0, i_17_, 0, i_26_, class50_sub1_sub4, -930);
                }
            }
        }
    }

    public static passiveRequestGameObjectModels(onDemandRequester: OnDemandRequester, buffer: Buffer) {
        let gameObjectId: number = -1;
        while (true) {
            {
                const gameObjectIdOffset: number = buffer.getSmart();
                if (gameObjectIdOffset === 0) {
                    break;
                }
                gameObjectId += gameObjectIdOffset;
                const gameObjectDefinition: GameObjectDefinition = GameObjectDefinition.getDefinition(gameObjectId);
                gameObjectDefinition.passiveRequestModels(onDemandRequester);
                while (true) {
                    {
                        const terminate: number = buffer.getSmart();
                        if (terminate === 0) {
                            break;
                        }
                        buffer.getUnsignedByte();
                    }
                }
            }
        }
    }

    public static method170(i: number, i_162_: number, i_163_: number): boolean {
        const gameObjectDefinition: GameObjectDefinition = GameObjectDefinition.getDefinition(i_163_);
        if (i_162_ !== Region.aByte154) {
            for (let i_164_: number = 1; i_164_ > 0; i_164_++) {
                {
                }
            }
        }
        if (i === 11) {
            i = 10;
        }
        if (i >= 5 && i <= 8) {
            i = 4;
        }
        return gameObjectDefinition.method432(26261, i);
    }

    public static trimHSLLightness(i: number, i_165_: number): number {
        if (i === -1) {
            return 12345678;
        }
        i_165_ = ((i_165_ * (i & 127)) / 128) | 0;
        if (i_165_ < 2) {
            i_165_ = 2;
        } else if (i_165_ > 126) {
            i_165_ = 126;
        }
        return (i & 65408) + i_165_;
    }

    public static method176(i: number, i_226_: number, i_227_: number, i_228_: number): number {
        const i_229_: number = (65536 - Rasterizer3D.COSINE[((i_227_ * 1024) / i_228_) | 0]) >> 1;
        return ((i * (65536 - i_229_)) >> 16) + ((i_226_ * i_229_) >> 16);
    }

    public static method178(i: number, i_233_: number): number {
        const i_234_: number =
            Region.calculateNoise(i - 1, i_233_ - 1) +
            Region.calculateNoise(i + 1, i_233_ - 1) +
            Region.calculateNoise(i - 1, i_233_ + 1) +
            Region.calculateNoise(i + 1, i_233_ + 1);
        const i_235_: number =
            Region.calculateNoise(i - 1, i_233_) +
            Region.calculateNoise(i + 1, i_233_) +
            Region.calculateNoise(i, i_233_ - 1) +
            Region.calculateNoise(i, i_233_ + 1);
        const i_236_: number = Region.calculateNoise(i, i_233_);
        return ((i_234_ / 16) | 0) + ((i_235_ / 8) | 0) + ((i_236_ / 4) | 0);
    }

    public static method181(i: number, i_258_: number, is: number[], i_259_: number): boolean {
        let bool: boolean = true;
        const class50_sub1_sub2: Buffer = new Buffer(is);
        if (i_259_ !== 24515) {
            throw Error("NullPointerException");
        }
        let i_260_: number = -1;
        for (;;) {
            {
                const i_261_: number = class50_sub1_sub2.getSmart();
                if (i_261_ === 0) {
                    break;
                }
                i_260_ += i_261_;
                let i_262_: number = 0;
                let bool_263_: boolean = false;
                for (;;) {
                    {
                        if (bool_263_) {
                            const i_264_: number = class50_sub1_sub2.getSmart();
                            if (i_264_ === 0) {
                                break;
                            }
                            class50_sub1_sub2.getUnsignedByte();
                        } else {
                            const i_265_: number = class50_sub1_sub2.getSmart();
                            if (i_265_ === 0) {
                                break;
                            }
                            i_262_ += i_265_ - 1;
                            const i_266_: number = i_262_ & 63;
                            const i_267_: number = (i_262_ >> 6) & 63;
                            const i_268_: number = class50_sub1_sub2.getUnsignedByte() >> 2;
                            const i_269_: number = i_267_ + i;
                            const i_270_: number = i_266_ + i_258_;
                            if (i_269_ > 0 && i_270_ > 0 && i_269_ < 103 && i_270_ < 103) {
                                const class47: GameObjectDefinition = GameObjectDefinition.getDefinition(i_260_);
                                if (i_268_ !== 22 || !Region.lowMemory || class47.actionsBoolean || class47.unknown) {
                                    bool = class47.isModelCached() && bool;
                                    bool_263_ = true;
                                }
                            }
                        }
                    }
                }
            }
        }
        return bool;
    }

    public static calculateVertexHeight(i: number, i_281_: number): number {
        let mapHeight: number =
            Region.method163(i + 45365, i_281_ + 91923, 4) -
            128 +
            ((Region.method163(i + 10294, i_281_ + 37821, 2) - 128) >> 1) +
            ((Region.method163(i, i_281_, 1) - 128) >> 2);
        mapHeight = (((mapHeight * 0.3) as number) | 0) + 35;
        if (mapHeight < 10) {
            mapHeight = 10;
        } else if (mapHeight > 60) {
            mapHeight = 60;
        }
        return mapHeight;
    }
    public renderRuleFlags: number[][][];

    public aByte139: number = 0;

    public aBoolean140: boolean = true;

    public overlayRotations: number[][][];

    public blendedHue: number[];

    public blendedSaturation: number[];

    public blendedLightness: number[];

    public blendedHueDivisor: number[];

    public blendDirectionTracker: number[];

    public vertexHeights: number[][][];

    public regionSizeX: number;

    public regionSizeY: number;

    public overlayClippingPaths: number[][][];

    public overlayFloorIds: number[][][];

    public aByte156: number = 0;

    public aBoolean157: boolean = true;

    public underlayFloorIds: number[][][];

    public anInt160: number = 20411;

    public tileShadowIntensity: number[][][];

    public tileLightingIntensity: number[][];

    public anInt166: number = 69;

    public tileCullingBitsets: number[][][];

    public constructor(renderRuleFlags: number[][][], regionSizeY: number, regionSizeX: number, vertexHeights: number[][][]) {
        if (this.renderRuleFlags === undefined) {
            this.renderRuleFlags = null;
        }
        if (this.overlayRotations === undefined) {
            this.overlayRotations = null;
        }
        if (this.blendedHue === undefined) {
            this.blendedHue = null;
        }
        if (this.blendedSaturation === undefined) {
            this.blendedSaturation = null;
        }
        if (this.blendedLightness === undefined) {
            this.blendedLightness = null;
        }
        if (this.blendedHueDivisor === undefined) {
            this.blendedHueDivisor = null;
        }
        if (this.blendDirectionTracker === undefined) {
            this.blendDirectionTracker = null;
        }
        if (this.vertexHeights === undefined) {
            this.vertexHeights = null;
        }
        if (this.regionSizeX === undefined) {
            this.regionSizeX = 0;
        }
        if (this.regionSizeY === undefined) {
            this.regionSizeY = 0;
        }
        if (this.overlayClippingPaths === undefined) {
            this.overlayClippingPaths = null;
        }
        if (this.overlayFloorIds === undefined) {
            this.overlayFloorIds = null;
        }
        if (this.underlayFloorIds === undefined) {
            this.underlayFloorIds = null;
        }
        if (this.tileShadowIntensity === undefined) {
            this.tileShadowIntensity = null;
        }
        if (this.tileLightingIntensity === undefined) {
            this.tileLightingIntensity = null;
        }
        if (this.tileCullingBitsets === undefined) {
            this.tileCullingBitsets = null;
        }
        Region.lowestPlane = 99;
        this.regionSizeX = regionSizeX;
        this.regionSizeY = regionSizeY;
        this.vertexHeights = vertexHeights;
        this.renderRuleFlags = renderRuleFlags;
        this.underlayFloorIds = (function(dims) {
            const allocate = function(dims) {
                if (dims.length == 0) {
                    return 0;
                } else {
                    const array = [];
                    for (let i = 0; i < dims[0]; i++) {
                        array.push(allocate(dims.slice(1)));
                    }
                    return array;
                }
            };
            return allocate(dims);
        })([4, this.regionSizeX, this.regionSizeY]) as any;
        this.overlayFloorIds = (function(dims) {
            const allocate = function(dims) {
                if (dims.length == 0) {
                    return 0;
                } else {
                    const array = [];
                    for (let i = 0; i < dims[0]; i++) {
                        array.push(allocate(dims.slice(1)));
                    }
                    return array;
                }
            };
            return allocate(dims);
        })([4, this.regionSizeX, this.regionSizeY]) as any;
        this.overlayClippingPaths = (function(dims) {
            const allocate = function(dims) {
                if (dims.length == 0) {
                    return 0;
                } else {
                    const array = [];
                    for (let i = 0; i < dims[0]; i++) {
                        array.push(allocate(dims.slice(1)));
                    }
                    return array;
                }
            };
            return allocate(dims);
        })([4, this.regionSizeX, this.regionSizeY]) as any;
        this.overlayRotations = (function(dims) {
            const allocate = function(dims) {
                if (dims.length == 0) {
                    return 0;
                } else {
                    const array = [];
                    for (let i = 0; i < dims[0]; i++) {
                        array.push(allocate(dims.slice(1)));
                    }
                    return array;
                }
            };
            return allocate(dims);
        })([4, this.regionSizeX, this.regionSizeY]) as any;
        this.tileCullingBitsets = (function(dims) {
            const allocate = function(dims) {
                if (dims.length == 0) {
                    return 0;
                } else {
                    const array = [];
                    for (let i = 0; i < dims[0]; i++) {
                        array.push(allocate(dims.slice(1)));
                    }
                    return array;
                }
            };
            return allocate(dims);
        })([4, this.regionSizeX + 1, this.regionSizeY + 1]) as any;
        this.tileShadowIntensity = (function(dims) {
            const allocate = function(dims) {
                if (dims.length == 0) {
                    return 0;
                } else {
                    const array = [];
                    for (let i = 0; i < dims[0]; i++) {
                        array.push(allocate(dims.slice(1)));
                    }
                    return array;
                }
            };
            return allocate(dims);
        })([4, this.regionSizeX + 1, this.regionSizeY + 1]) as any;
        this.tileLightingIntensity = (function(dims) {
            const allocate = function(dims) {
                if (dims.length == 0) {
                    return 0;
                } else {
                    const array = [];
                    for (let i = 0; i < dims[0]; i++) {
                        array.push(allocate(dims.slice(1)));
                    }
                    return array;
                }
            };
            return allocate(dims);
        })([this.regionSizeX + 1, this.regionSizeY + 1]) as any;
        this.blendedHue = (s => {
            const a = [];
            while (s-- > 0) {
                a.push(0);
            }
            return a;
        })(this.regionSizeY);
        this.blendedSaturation = (s => {
            const a = [];
            while (s-- > 0) {
                a.push(0);
            }
            return a;
        })(this.regionSizeY);
        this.blendedLightness = (s => {
            const a = [];
            while (s-- > 0) {
                a.push(0);
            }
            return a;
        })(this.regionSizeY);
        this.blendedHueDivisor = (s => {
            const a = [];
            while (s-- > 0) {
                a.push(0);
            }
            return a;
        })(this.regionSizeY);
        this.blendDirectionTracker = (s => {
            const a = [];
            while (s-- > 0) {
                a.push(0);
            }
            return a;
        })(this.regionSizeY);
    }

    public getVisibilityPlaneFor(i: number, i_12_: number, i_13_: number, i_14_: number): number {
        if (i_14_ === this.aByte156) {
        } else {
            return 2;
        }
        if ((this.renderRuleFlags[i_12_][i_13_][i] & 8) !== 0) {
            return 0;
        }
        if (i_12_ > 0 && (this.renderRuleFlags[1][i_13_][i] & 2) !== 0) {
            return i_12_ - 1;
        }
        return i_12_;
    }

    public method166(i: number, i_39_: number, i_40_: number, i_41_: number) {
        if (i === this.anInt160) {
            for (let i_42_: number = 0; i_42_ < 8; i_42_++) {
                {
                    for (let i_43_: number = 0; i_43_ < 8; i_43_++) {
                        this.vertexHeights[i_39_][i_41_ + i_42_][i_40_ + i_43_] = 0;
                    }
                }
            }
            if (i_41_ > 0) {
                for (let i_44_: number = 1; i_44_ < 8; i_44_++) {
                    this.vertexHeights[i_39_][i_41_][i_40_ + i_44_] = this.vertexHeights[i_39_][i_41_ - 1][i_40_ + i_44_];
                }
            }
            if (i_40_ > 0) {
                for (let i_45_: number = 1; i_45_ < 8; i_45_++) {
                    this.vertexHeights[i_39_][i_41_ + i_45_][i_40_] = this.vertexHeights[i_39_][i_41_ + i_45_][i_40_ - 1];
                }
            }
            if (i_41_ > 0 && this.vertexHeights[i_39_][i_41_ - 1][i_40_] !== 0) {
                this.vertexHeights[i_39_][i_41_][i_40_] = this.vertexHeights[i_39_][i_41_ - 1][i_40_];
            } else if (i_40_ > 0 && this.vertexHeights[i_39_][i_41_][i_40_ - 1] !== 0) {
                this.vertexHeights[i_39_][i_41_][i_40_] = this.vertexHeights[i_39_][i_41_][i_40_ - 1];
            } else if (i_41_ > 0 && i_40_ > 0 && this.vertexHeights[i_39_][i_41_ - 1][i_40_ - 1] !== 0) {
                this.vertexHeights[i_39_][i_41_][i_40_] = this.vertexHeights[i_39_][i_41_ - 1][i_40_ - 1];
            }
        }
    }

    public createRegionScene(collisionMaps: CollisionMap[], scene: Scene) {
        for (let plane: number = 0; plane < 4; plane++) {
            {
                for (let x: number = 0; x < 104; x++) {
                    {
                        for (let y: number = 0; y < 104; y++) {
                            {
                                if ((this.renderRuleFlags[plane][x][y] & 1) === 1) {
                                    let originalPlane: number = plane;
                                    if ((this.renderRuleFlags[1][x][y] & 2) === 2) {
                                        originalPlane--;
                                    }
                                    if (originalPlane >= 0) {
                                        collisionMaps[originalPlane].markBlocked(x, y);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        Region.hueRandomizer = Region.hueRandomizer + (((Math.random() * 5.0) as number) | 0) - 2;
        if (Region.hueRandomizer < -8) {
            Region.hueRandomizer = -8;
        }
        if (Region.hueRandomizer > 8) {
            Region.hueRandomizer = 8;
        }
        Region.lightnessRandomizer = Region.lightnessRandomizer + (((Math.random() * 5.0) as number) | 0) - 2;
        if (Region.lightnessRandomizer < -16) {
            Region.lightnessRandomizer = -16;
        }
        if (Region.lightnessRandomizer > 16) {
            Region.lightnessRandomizer = 16;
        }
        for (let plane: number = 0; plane < 4; plane++) {
            {
                const shadowIntensity: number[][] = this.tileShadowIntensity[plane];
                const directionalLightInitialIntensity: number = 96;
                const specularDistributionFactor: number = 768;
                const directionalLightX: number = -50;
                const directionalLightY: number = -10;
                const directionalLightZ: number = -50;
                const directionalLightLength: number =
                    (Math.sqrt(
                        directionalLightX * directionalLightX +
                            directionalLightY * directionalLightY +
                            directionalLightZ * directionalLightZ
                    ) as number) | 0;
                const specularDistribution: number = (specularDistributionFactor * directionalLightLength) >> 8;
                for (let y: number = 1; y < this.regionSizeY - 1; y++) {
                    {
                        for (let x: number = 1; x < this.regionSizeX - 1; x++) {
                            {
                                const xHeightDifference: number = this.vertexHeights[plane][x + 1][y] - this.vertexHeights[plane][x - 1][y];
                                const yHeightDifference: number = this.vertexHeights[plane][x][y + 1] - this.vertexHeights[plane][x][y - 1];
                                const normalizedLength: number =
                                    (Math.sqrt(
                                        xHeightDifference * xHeightDifference + 65536 + yHeightDifference * yHeightDifference
                                    ) as number) | 0;
                                const normalizedNormalX: number = ((xHeightDifference << 8) / normalizedLength) | 0;
                                const normalizedNormalY: number = (65536 / normalizedLength) | 0;
                                const normalizedNormalZ: number = ((yHeightDifference << 8) / normalizedLength) | 0;
                                const directionalLightIntensity: number =
                                    directionalLightInitialIntensity +
                                    (((directionalLightX * normalizedNormalX +
                                        directionalLightY * normalizedNormalY +
                                        directionalLightZ * normalizedNormalZ) /
                                        specularDistribution) |
                                        0);
                                const weightedShadowIntensity: number =
                                    (shadowIntensity[x - 1][y] >> 2) +
                                    (shadowIntensity[x + 1][y] >> 3) +
                                    (shadowIntensity[x][y - 1] >> 2) +
                                    (shadowIntensity[x][y + 1] >> 3) +
                                    (shadowIntensity[x][y] >> 1);
                                this.tileLightingIntensity[x][y] = directionalLightIntensity - weightedShadowIntensity;
                            }
                        }
                    }
                }
                for (let y: number = 0; y < this.regionSizeY; y++) {
                    {
                        this.blendedHue[y] = 0;
                        this.blendedSaturation[y] = 0;
                        this.blendedLightness[y] = 0;
                        this.blendedHueDivisor[y] = 0;
                        this.blendDirectionTracker[y] = 0;
                    }
                }
                for (let x: number = -5; x < this.regionSizeX + 5; x++) {
                    {
                        for (let y: number = 0; y < this.regionSizeY; y++) {
                            {
                                const xPositiveOffset: number = x + 5;
                                if (xPositiveOffset >= 0 && xPositiveOffset < this.regionSizeX) {
                                    const floorId: number = this.underlayFloorIds[plane][xPositiveOffset][y] & 255;
                                    if (floorId > 0) {
                                        const floor: FloorDefinition = FloorDefinition.cache[floorId - 1];
                                        this.blendedHue[y] += floor.hue;
                                        this.blendedSaturation[y] += floor.saturation;
                                        this.blendedLightness[y] += floor.lightness;
                                        this.blendedHueDivisor[y] += floor.hueDivisor;
                                        this.blendDirectionTracker[y]++;
                                    }
                                }
                                const xNegativeOffset: number = x - 5;
                                if (xNegativeOffset >= 0 && xNegativeOffset < this.regionSizeX) {
                                    const floorId: number = this.underlayFloorIds[plane][xNegativeOffset][y] & 255;
                                    if (floorId > 0) {
                                        const floor: FloorDefinition = FloorDefinition.cache[floorId - 1];
                                        this.blendedHue[y] -= floor.hue;
                                        this.blendedSaturation[y] -= floor.saturation;
                                        this.blendedLightness[y] -= floor.lightness;
                                        this.blendedHueDivisor[y] -= floor.hueDivisor;
                                        this.blendDirectionTracker[y]--;
                                    }
                                }
                            }
                        }
                        if (x >= 1 && x < this.regionSizeX - 1) {
                            let i_75_: number = 0;
                            let i_76_: number = 0;
                            let i_77_: number = 0;
                            let i_78_: number = 0;
                            let i_79_: number = 0;
                            for (let y: number = -5; y < this.regionSizeY + 5; y++) {
                                {
                                    const yPositiveOffset: number = y + 5;
                                    if (yPositiveOffset >= 0 && yPositiveOffset < this.regionSizeY) {
                                        i_75_ += this.blendedHue[yPositiveOffset];
                                        i_76_ += this.blendedSaturation[yPositiveOffset];
                                        i_77_ += this.blendedLightness[yPositiveOffset];
                                        i_78_ += this.blendedHueDivisor[yPositiveOffset];
                                        i_79_ += this.blendDirectionTracker[yPositiveOffset];
                                    }
                                    const yNegativeOffset: number = y - 5;
                                    if (yNegativeOffset >= 0 && yNegativeOffset < this.regionSizeY) {
                                        i_75_ -= this.blendedHue[yNegativeOffset];
                                        i_76_ -= this.blendedSaturation[yNegativeOffset];
                                        i_77_ -= this.blendedLightness[yNegativeOffset];
                                        i_78_ -= this.blendedHueDivisor[yNegativeOffset];
                                        i_79_ -= this.blendDirectionTracker[yNegativeOffset];
                                    }
                                    if (
                                        y >= 1 &&
                                        y < this.regionSizeY - 1 &&
                                        (!Region.lowMemory ||
                                            (this.renderRuleFlags[0][x][y] & 2) !== 0 ||
                                            ((this.renderRuleFlags[plane][x][y] & 16) === 0 &&
                                                this.getVisibilityPlaneFor(y, plane, x, (0 as number) | 0) === Region.onBuildTimePlane))
                                    ) {
                                        if (plane < Region.lowestPlane) {
                                            Region.lowestPlane = plane;
                                        }
                                        const underlayFloorId: number = this.underlayFloorIds[plane][x][y] & 255;
                                        const overlayFloorId: number = this.overlayFloorIds[plane][x][y] & 255;
                                        if (underlayFloorId > 0 || overlayFloorId > 0) {
                                            const vertexSouthWest: number = this.vertexHeights[plane][x][y];
                                            const vertexSouthEast: number = this.vertexHeights[plane][x + 1][y];
                                            const vertexNorthEast: number = this.vertexHeights[plane][x + 1][y + 1];
                                            const vertexNorthWest: number = this.vertexHeights[plane][x][y + 1];
                                            const lightSouthWest: number = this.tileLightingIntensity[x][y];
                                            const lightSouthEast: number = this.tileLightingIntensity[x + 1][y];
                                            const lightNorthEast: number = this.tileLightingIntensity[x + 1][y + 1];
                                            const lightNorthWest: number = this.tileLightingIntensity[x][y + 1];
                                            let hslBitsetUnmodified: number = -1;
                                            let hslBitsetRandomized: number = -1;
                                            if (underlayFloorId > 0) {
                                                let hue: number = ((i_75_ * 256) / i_78_) | 0;
                                                const saturation: number = (i_76_ / i_79_) | 0;
                                                let lightness: number = (i_77_ / i_79_) | 0;
                                                hslBitsetUnmodified = this.getHSLBitset(hue, saturation, lightness);
                                                hue = (hue + Region.hueRandomizer) & 255;
                                                lightness += Region.lightnessRandomizer;
                                                if (lightness < 0) {
                                                    lightness = 0;
                                                } else if (lightness > 255) {
                                                    lightness = 255;
                                                }
                                                hslBitsetRandomized = this.getHSLBitset(hue, saturation, lightness);
                                            }
                                            if (plane > 0) {
                                                let bool: boolean = true;
                                                if (underlayFloorId === 0 && this.overlayClippingPaths[plane][x][y] !== 0) {
                                                    bool = false;
                                                }
                                                if (overlayFloorId > 0 && !FloorDefinition.cache[overlayFloorId - 1].occlude) {
                                                    bool = false;
                                                }
                                                if (
                                                    bool &&
                                                    vertexSouthWest === vertexSouthEast &&
                                                    vertexSouthWest === vertexNorthEast &&
                                                    vertexSouthWest === vertexNorthWest
                                                ) {
                                                    this.tileCullingBitsets[plane][x][y] |= 2340;
                                                }
                                            }
                                            let rgbBitsetRandomized: number = 0;
                                            if (hslBitsetUnmodified !== -1) {
                                                rgbBitsetRandomized =
                                                    Rasterizer3D.getRgbLookupTableId[Region.trimHSLLightness(hslBitsetRandomized, 96)];
                                            }
                                            if (overlayFloorId === 0) {
                                                scene.method246(
                                                    plane,
                                                    x,
                                                    y,
                                                    0,
                                                    0,
                                                    -1,
                                                    vertexSouthWest,
                                                    vertexSouthEast,
                                                    vertexNorthEast,
                                                    vertexNorthWest,
                                                    Region.trimHSLLightness(hslBitsetUnmodified, lightSouthWest),
                                                    Region.trimHSLLightness(hslBitsetUnmodified, lightSouthEast),
                                                    Region.trimHSLLightness(hslBitsetUnmodified, lightNorthEast),
                                                    Region.trimHSLLightness(hslBitsetUnmodified, lightNorthWest),
                                                    0,
                                                    0,
                                                    0,
                                                    0,
                                                    rgbBitsetRandomized,
                                                    0
                                                );
                                            } else {
                                                const clippingPath: number = this.overlayClippingPaths[plane][x][y] + 1;
                                                const clippingPathRotation: number = this.overlayRotations[plane][x][y];
                                                const floor: FloorDefinition = FloorDefinition.cache[overlayFloorId - 1];
                                                let textureid: number = floor.textureId;
                                                let hslBitset: number;
                                                let rgbBitset: number;
                                                if (textureid >= 0) {
                                                    rgbBitset = Rasterizer3D.getAverageRgbColorForTexture(textureid, 0);
                                                    hslBitset = -1;
                                                } else if (floor.rgbColor === 16711935) {
                                                    hslBitset = -2;
                                                    textureid = -1;
                                                    rgbBitset = Rasterizer3D.getRgbLookupTableId[this.method182(floor.hslColor2, 96)];
                                                } else {
                                                    hslBitset = this.getHSLBitset(floor.hue2, floor.saturation, floor.lightness);
                                                    rgbBitset = Rasterizer3D.getRgbLookupTableId[this.method182(floor.hslColor2, 96)];
                                                }
                                                scene.method246(
                                                    plane,
                                                    x,
                                                    y,
                                                    clippingPath,
                                                    clippingPathRotation,
                                                    textureid,
                                                    vertexSouthWest,
                                                    vertexSouthEast,
                                                    vertexNorthEast,
                                                    vertexNorthWest,
                                                    Region.trimHSLLightness(hslBitsetUnmodified, lightSouthWest),
                                                    Region.trimHSLLightness(hslBitsetUnmodified, lightSouthEast),
                                                    Region.trimHSLLightness(hslBitsetUnmodified, lightNorthEast),
                                                    Region.trimHSLLightness(hslBitsetUnmodified, lightNorthWest),
                                                    this.method182(hslBitset, lightSouthWest),
                                                    this.method182(hslBitset, lightSouthEast),
                                                    this.method182(hslBitset, lightNorthEast),
                                                    this.method182(hslBitset, lightNorthWest),
                                                    rgbBitsetRandomized,
                                                    rgbBitset
                                                );
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                for (let i_104_: number = 1; i_104_ < this.regionSizeY - 1; i_104_++) {
                    {
                        for (let i_105_: number = 1; i_105_ < this.regionSizeX - 1; i_105_++) {
                            scene.method245(plane, i_105_, i_104_, this.getVisibilityPlaneFor(i_104_, plane, i_105_, (0 as number) | 0));
                        }
                    }
                }
            }
        }
        scene.method272((2 as number) | 0, -10, -50, -50);
        for (let y: number = 0; y < this.regionSizeX; y++) {
            {
                for (let x: number = 0; x < this.regionSizeY; x++) {
                    {
                        if ((this.renderRuleFlags[1][y][x] & 2) === 2) {
                            scene.setBridgeMode(y, x);
                        }
                    }
                }
            }
        }
        let renderRule1: number = 1;
        let renderRule2: number = 2;
        let renderRule3: number = 4;
        for (let currentPlane: number = 0; currentPlane < 4; currentPlane++) {
            {
                if (currentPlane > 0) {
                    renderRule1 <<= 3;
                    renderRule2 <<= 3;
                    renderRule3 <<= 3;
                }
                for (let plane: number = 0; plane <= currentPlane; plane++) {
                    {
                        for (let y: number = 0; y <= this.regionSizeY; y++) {
                            {
                                for (let x: number = 0; x <= this.regionSizeX; x++) {
                                    {
                                        if ((this.tileCullingBitsets[plane][x][y] & renderRule1) !== 0) {
                                            let lowestOcclussionY: number = y;
                                            let higestOcclussionY: number = y;
                                            let lowestOcclussionPlane: number = plane;
                                            let higestOcclussionPlane: number = plane;
                                            for (; lowestOcclussionY > 0; lowestOcclussionY--) {
                                                {
                                                    if ((this.tileCullingBitsets[plane][x][lowestOcclussionY - 1] & renderRule1) === 0) {
                                                        break;
                                                    }
                                                }
                                            }
                                            for (; higestOcclussionY < this.regionSizeY; higestOcclussionY++) {
                                                {
                                                    if ((this.tileCullingBitsets[plane][x][higestOcclussionY + 1] & renderRule1) === 0) {
                                                        break;
                                                    }
                                                }
                                            }
                                            while_0_: for (; lowestOcclussionPlane > 0; lowestOcclussionPlane--) {
                                                {
                                                    for (
                                                        let occludedY: number = lowestOcclussionY;
                                                        occludedY <= higestOcclussionY;
                                                        occludedY++
                                                    ) {
                                                        {
                                                            if (
                                                                (this.tileCullingBitsets[lowestOcclussionPlane - 1][x][occludedY] &
                                                                    renderRule1) ===
                                                                0
                                                            ) {
                                                                break while_0_;
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                            while_1_: for (; higestOcclussionPlane < currentPlane; higestOcclussionPlane++) {
                                                {
                                                    for (
                                                        let occludedY: number = lowestOcclussionY;
                                                        occludedY <= higestOcclussionY;
                                                        occludedY++
                                                    ) {
                                                        {
                                                            if (
                                                                (this.tileCullingBitsets[higestOcclussionPlane + 1][x][occludedY] &
                                                                    renderRule1) ===
                                                                0
                                                            ) {
                                                                break while_1_;
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                            const occlussionSurface: number =
                                                (higestOcclussionPlane + 1 - lowestOcclussionPlane) *
                                                (higestOcclussionY - lowestOcclussionY + 1);
                                            if (occlussionSurface >= 8) {
                                                const highestOcclussionVertexHeightOffset: number = 240;
                                                const highestOcclussionVertexHeight: number =
                                                    this.vertexHeights[higestOcclussionPlane][x][lowestOcclussionY] -
                                                    highestOcclussionVertexHeightOffset;
                                                const lowestOcclussionVertexHeight: number = this.vertexHeights[lowestOcclussionPlane][x][
                                                    lowestOcclussionY
                                                ];
                                                Scene.createCullingOcclussionBox(
                                                    x * 128,
                                                    lowestOcclussionVertexHeight,
                                                    x * 128,
                                                    higestOcclussionY * 128 + 128,
                                                    currentPlane,
                                                    lowestOcclussionY * 128,
                                                    highestOcclussionVertexHeight,
                                                    1
                                                );
                                                for (
                                                    let occludedPlane: number = lowestOcclussionPlane;
                                                    occludedPlane <= higestOcclussionPlane;
                                                    occludedPlane++
                                                ) {
                                                    {
                                                        for (
                                                            let occludedY: number = lowestOcclussionY;
                                                            occludedY <= higestOcclussionY;
                                                            occludedY++
                                                        ) {
                                                            this.tileCullingBitsets[occludedPlane][x][occludedY] &= renderRule1 ^ -1;
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                        if ((this.tileCullingBitsets[plane][x][y] & renderRule2) !== 0) {
                                            let i_127_: number = x;
                                            let i_128_: number = x;
                                            let i_129_: number = plane;
                                            let i_130_: number = plane;
                                            for (; i_127_ > 0; i_127_--) {
                                                {
                                                    if ((this.tileCullingBitsets[plane][i_127_ - 1][y] & renderRule2) === 0) {
                                                        break;
                                                    }
                                                }
                                            }
                                            for (; i_128_ < this.regionSizeX; i_128_++) {
                                                {
                                                    if ((this.tileCullingBitsets[plane][i_128_ + 1][y] & renderRule2) === 0) {
                                                        break;
                                                    }
                                                }
                                            }
                                            while_2_: for (; i_129_ > 0; i_129_--) {
                                                {
                                                    for (let i_131_: number = i_127_; i_131_ <= i_128_; i_131_++) {
                                                        {
                                                            if ((this.tileCullingBitsets[i_129_ - 1][i_131_][y] & renderRule2) === 0) {
                                                                break while_2_;
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                            while_3_: for (; i_130_ < currentPlane; i_130_++) {
                                                {
                                                    for (let i_132_: number = i_127_; i_132_ <= i_128_; i_132_++) {
                                                        {
                                                            if ((this.tileCullingBitsets[i_130_ + 1][i_132_][y] & renderRule2) === 0) {
                                                                break while_3_;
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                            const i_133_: number = (i_130_ + 1 - i_129_) * (i_128_ - i_127_ + 1);
                                            if (i_133_ >= 8) {
                                                const i_134_: number = 240;
                                                const i_135_: number = this.vertexHeights[i_130_][i_127_][y] - i_134_;
                                                const i_136_: number = this.vertexHeights[i_129_][i_127_][y];
                                                Scene.createCullingOcclussionBox(
                                                    i_127_ * 128,
                                                    i_136_,
                                                    i_128_ * 128 + 128,
                                                    y * 128,
                                                    currentPlane,
                                                    y * 128,
                                                    i_135_,
                                                    2
                                                );
                                                for (let i_137_: number = i_129_; i_137_ <= i_130_; i_137_++) {
                                                    {
                                                        for (let i_138_: number = i_127_; i_138_ <= i_128_; i_138_++) {
                                                            this.tileCullingBitsets[i_137_][i_138_][y] &= renderRule2 ^ -1;
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                        if ((this.tileCullingBitsets[plane][x][y] & renderRule3) !== 0) {
                                            let i_139_: number = x;
                                            let i_140_: number = x;
                                            let i_141_: number = y;
                                            let i_142_: number = y;
                                            for (; i_141_ > 0; i_141_--) {
                                                {
                                                    if ((this.tileCullingBitsets[plane][x][i_141_ - 1] & renderRule3) === 0) {
                                                        break;
                                                    }
                                                }
                                            }
                                            for (; i_142_ < this.regionSizeY; i_142_++) {
                                                {
                                                    if ((this.tileCullingBitsets[plane][x][i_142_ + 1] & renderRule3) === 0) {
                                                        break;
                                                    }
                                                }
                                            }
                                            while_4_: for (; i_139_ > 0; i_139_--) {
                                                {
                                                    for (let i_143_: number = i_141_; i_143_ <= i_142_; i_143_++) {
                                                        {
                                                            if ((this.tileCullingBitsets[plane][i_139_ - 1][i_143_] & renderRule3) === 0) {
                                                                break while_4_;
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                            while_5_: for (; i_140_ < this.regionSizeX; i_140_++) {
                                                {
                                                    for (let i_144_: number = i_141_; i_144_ <= i_142_; i_144_++) {
                                                        {
                                                            if ((this.tileCullingBitsets[plane][i_140_ + 1][i_144_] & renderRule3) === 0) {
                                                                break while_5_;
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                            if ((i_140_ - i_139_ + 1) * (i_142_ - i_141_ + 1) >= 4) {
                                                const i_145_: number = this.vertexHeights[plane][i_139_][i_141_];
                                                Scene.createCullingOcclussionBox(
                                                    i_139_ * 128,
                                                    i_145_,
                                                    i_140_ * 128 + 128,
                                                    i_142_ * 128 + 128,
                                                    currentPlane,
                                                    i_141_ * 128,
                                                    i_145_,
                                                    4
                                                );
                                                for (let i_146_: number = i_139_; i_146_ <= i_140_; i_146_++) {
                                                    {
                                                        for (let i_147_: number = i_141_; i_147_ <= i_142_; i_147_++) {
                                                            this.tileCullingBitsets[plane][i_146_][i_147_] &= renderRule3 ^ -1;
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    public method168(
        i: number,
        i_148_: number,
        bool: boolean,
        is: number[],
        i_149_: number,
        i_150_: number,
        i_151_: number,
        class46s: CollisionMap[],
        i_152_: number,
        i_153_: number
    ) {
        if (bool) {
            this.anInt166 = 476;
        }
        for (let i_154_: number = 0; i_154_ < 8; i_154_++) {
            {
                for (let i_155_: number = 0; i_155_ < 8; i_155_++) {
                    {
                        if (i_151_ + i_154_ > 0 && i_151_ + i_154_ < 103 && i_152_ + i_155_ > 0 && i_152_ + i_155_ < 103) {
                            class46s[i_149_].adjacency[i_151_ + i_154_][i_152_ + i_155_] &= ~16777216;
                        }
                    }
                }
            }
        }
        const class50_sub1_sub2: Buffer = new Buffer(is);
        for (let i_156_: number = 0; i_156_ < 4; i_156_++) {
            {
                for (let i_157_: number = 0; i_157_ < 64; i_157_++) {
                    {
                        for (let i_158_: number = 0; i_158_ < 64; i_158_++) {
                            {
                                if (
                                    i_156_ === i_150_ &&
                                    i_157_ >= i_153_ &&
                                    i_157_ < i_153_ + 8 &&
                                    i_158_ >= i_148_ &&
                                    i_158_ < i_148_ + 8
                                ) {
                                    this.method183(
                                        0,
                                        (-61 as number) | 0,
                                        0,
                                        class50_sub1_sub2,
                                        i,
                                        i_151_ + TiledUtils.getRotatedMapChunkX(i_157_ & 7, i_158_ & 7, i),
                                        i_149_,
                                        i_152_ + TiledUtils.getRotatedMapChunkY(i_157_ & 7, i_158_ & 7, i)
                                    );
                                } else {
                                    this.method183(0, (-61 as number) | 0, 0, class50_sub1_sub2, 0, -1, 0, -1);
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    public method172(
        i: number,
        class46s: CollisionMap[],
        class22: Scene,
        bool: boolean,
        is: number[],
        i_166_: number,
        i_167_: number,
        i_168_: number,
        i_169_: number,
        i_170_: number,
        i_171_: number
    ) {
        const class50_sub1_sub2: Buffer = new Buffer(is);
        if (!bool) {
            let i_172_: number = -1;
            for (;;) {
                {
                    const i_173_: number = class50_sub1_sub2.getSmart();
                    if (i_173_ === 0) {
                        break;
                    }
                    i_172_ += i_173_;
                    let i_174_: number = 0;
                    for (;;) {
                        {
                            const i_175_: number = class50_sub1_sub2.getSmart();
                            if (i_175_ === 0) {
                                break;
                            }
                            i_174_ += i_175_ - 1;
                            const i_176_: number = i_174_ & 63;
                            const i_177_: number = (i_174_ >> 6) & 63;
                            const i_178_: number = i_174_ >> 12;
                            const i_179_: number = class50_sub1_sub2.getUnsignedByte();
                            const i_180_: number = i_179_ >> 2;
                            const i_181_: number = i_179_ & 3;
                            if (i_178_ === i_171_ && i_177_ >= i_168_ && i_177_ < i_168_ + 8 && i_176_ >= i_170_ && i_176_ < i_170_ + 8) {
                                const class47: GameObjectDefinition = GameObjectDefinition.getDefinition(i_172_);
                                const i_182_: number =
                                    i_169_ +
                                    TiledUtils.getRotatedLandscapeChunkX(i_167_, class47.sizeY, i_177_ & 7, i_176_ & 7, class47.sizeX);
                                const i_183_: number =
                                    i_166_ +
                                    TiledUtils.getRotatedLandscapeChunkY(i_176_ & 7, class47.sizeY, i_167_, class47.sizeX, i_177_ & 7);
                                if (i_182_ > 0 && i_183_ > 0 && i_182_ < 103 && i_183_ < 103) {
                                    let i_184_: number = i;
                                    if ((this.renderRuleFlags[1][i_182_][i_183_] & 2) === 2) {
                                        i_184_--;
                                    }
                                    let class46: CollisionMap = null;
                                    if (i_184_ >= 0) {
                                        class46 = class46s[i_184_];
                                    }
                                    this.renderObject(
                                        class22,
                                        class46,
                                        i_183_,
                                        i,
                                        i_182_,
                                        this.aByte139,
                                        (i_181_ + i_167_) & 3,
                                        i_180_,
                                        i_172_
                                    );
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    public renderObject(
        scene: Scene,
        collisionMap: CollisionMap,
        y: number,
        plane: number,
        x: number,
        i_187_: number,
        face: number,
        type: number,
        objectId: number
    ) {
        if (
            !Region.lowMemory ||
            (this.renderRuleFlags[0][x][y] & 2) !== 0 ||
            ((this.renderRuleFlags[plane][x][y] & 16) === 0 &&
                this.getVisibilityPlaneFor(y, plane, x, (0 as number) | 0) === Region.onBuildTimePlane)
        ) {
            if (plane < Region.lowestPlane) {
                Region.lowestPlane = plane;
            }
            let vertexHeight: number = this.vertexHeights[plane][x][y];
            let vertexHeightRight: number = this.vertexHeights[plane][x + 1][y];
            let vertexHeightTopRight: number = this.vertexHeights[plane][x + 1][y + 1];
            let vertexHeightTop: number = this.vertexHeights[plane][x][y + 1];
            const vertexMix: number = (vertexHeight + vertexHeightRight + vertexHeightTopRight + vertexHeightTop) >> 2;
            const gameObjectDefinition: GameObjectDefinition = GameObjectDefinition.getDefinition(objectId);
            let hash: number = x + (y << 7) + (objectId << 14) + 1073741824;
            if (!gameObjectDefinition.actionsBoolean) {
                hash += -2147483648;
            }
            const objectConfig: number = (((face << 6) + type) as number) | 0;
            if (type === 22) {
                if (!Region.lowMemory || gameObjectDefinition.actionsBoolean || gameObjectDefinition.unknown) {
                    let renderable: Renderable;
                    if (gameObjectDefinition.animationId === -1 && gameObjectDefinition.childrenIds == null) {
                        renderable = gameObjectDefinition.getGameObjectModel(
                            22,
                            face,
                            vertexHeight,
                            vertexHeightRight,
                            vertexHeightTopRight,
                            vertexHeightTop,
                            -1
                        );
                    } else {
                        renderable = new GameObject(
                            objectId,
                            face,
                            22,
                            vertexHeightRight,
                            vertexHeightTopRight,
                            vertexHeight,
                            vertexHeightTop,
                            gameObjectDefinition.animationId,
                            true
                        );
                    }
                    scene.addGroundDecoration(x, y, 669, objectConfig, hash, vertexMix, plane, renderable);
                    if (gameObjectDefinition.solid && gameObjectDefinition.actionsBoolean && collisionMap != null) {
                        collisionMap.markBlocked(x, y);
                    }
                }
            } else if (type === 10 || type === 11) {
                let renderable: Renderable;
                if (gameObjectDefinition.animationId === -1 && gameObjectDefinition.childrenIds == null) {
                    renderable = gameObjectDefinition.getGameObjectModel(
                        10,
                        face,
                        vertexHeight,
                        vertexHeightRight,
                        vertexHeightTopRight,
                        vertexHeightTop,
                        -1
                    );
                } else {
                    renderable = new GameObject(
                        objectId,
                        face,
                        10,
                        vertexHeightRight,
                        vertexHeightTopRight,
                        vertexHeight,
                        vertexHeightTop,
                        gameObjectDefinition.animationId,
                        true
                    );
                }
                if (renderable != null) {
                    let i_198_: number = 0;
                    if (type === 11) {
                        i_198_ += 256;
                    }
                    let sizeX: number;
                    let sizeY: number;
                    if (face === 1 || face === 3) {
                        sizeX = gameObjectDefinition.sizeY;
                        sizeY = gameObjectDefinition.sizeX;
                    } else {
                        sizeX = gameObjectDefinition.sizeX;
                        sizeY = gameObjectDefinition.sizeY;
                    }
                    if (
                        scene.method251(plane, sizeX, y, renderable, objectConfig, i_198_, x, -896, sizeY, vertexMix, hash) &&
                        gameObjectDefinition.unknown2
                    ) {
                        let model: Model;
                        if (renderable != null && ((renderable instanceof Model) as any)) {
                            model = renderable as Model;
                        } else {
                            model = gameObjectDefinition.getGameObjectModel(
                                10,
                                face,
                                vertexHeight,
                                vertexHeightRight,
                                vertexHeightTopRight,
                                vertexHeightTop,
                                -1
                            );
                        }
                        if (model != null) {
                            for (let sizeXCounter: number = 0; sizeXCounter <= sizeX; sizeXCounter++) {
                                {
                                    for (let sizeYCounter: number = 0; sizeYCounter <= sizeY; sizeYCounter++) {
                                        {
                                            let shadowIntensity: number = (model.shadowIntensity / 4) | 0;
                                            if (shadowIntensity > 30) {
                                                shadowIntensity = 30;
                                            }
                                            if (shadowIntensity > this.tileShadowIntensity[plane][x + sizeXCounter][y + sizeYCounter]) {
                                                this.tileShadowIntensity[plane][x + sizeXCounter][y + sizeYCounter] =
                                                    (shadowIntensity as number) | 0;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                if (gameObjectDefinition.solid && collisionMap != null) {
                    collisionMap.method413(
                        y,
                        face,
                        gameObjectDefinition.sizeY,
                        gameObjectDefinition.sizeX,
                        gameObjectDefinition.walkable,
                        x,
                        (52 as number) | 0
                    );
                }
            } else if (type >= 12) {
                let renderable: Renderable;
                if (gameObjectDefinition.animationId === -1 && gameObjectDefinition.childrenIds == null) {
                    renderable = gameObjectDefinition.getGameObjectModel(
                        type,
                        face,
                        vertexHeight,
                        vertexHeightRight,
                        vertexHeightTopRight,
                        vertexHeightTop,
                        -1
                    );
                } else {
                    renderable = new GameObject(
                        objectId,
                        face,
                        type,
                        vertexHeightRight,
                        vertexHeightTopRight,
                        vertexHeight,
                        vertexHeightTop,
                        gameObjectDefinition.animationId,
                        true
                    );
                }
                scene.method251(plane, 1, y, renderable, objectConfig, 0, x, -896, 1, vertexMix, hash);
                if (type >= 12 && type <= 17 && type !== 13 && plane > 0) {
                    this.tileCullingBitsets[plane][x][y] |= 2340;
                }
                if (gameObjectDefinition.solid && collisionMap != null) {
                    collisionMap.method413(
                        y,
                        face,
                        gameObjectDefinition.sizeY,
                        gameObjectDefinition.sizeX,
                        gameObjectDefinition.walkable,
                        x,
                        (52 as number) | 0
                    );
                }
            } else if (type === 0) {
                let renderable: Renderable;
                if (gameObjectDefinition.animationId === -1 && gameObjectDefinition.childrenIds == null) {
                    renderable = gameObjectDefinition.getGameObjectModel(
                        0,
                        face,
                        vertexHeight,
                        vertexHeightRight,
                        vertexHeightTopRight,
                        vertexHeightTop,
                        -1
                    );
                } else {
                    renderable = new GameObject(
                        objectId,
                        face,
                        0,
                        vertexHeightRight,
                        vertexHeightTopRight,
                        vertexHeight,
                        vertexHeightTop,
                        gameObjectDefinition.animationId,
                        true
                    );
                }
                scene.method249(Region.anIntArray158[face], renderable, hash, y, objectConfig, x, null, vertexMix, 0, plane);
                if (face === 0) {
                    if (gameObjectDefinition.unknown2) {
                        this.tileShadowIntensity[plane][x][y] = (50 as number) | 0;
                        this.tileShadowIntensity[plane][x][y + 1] = (50 as number) | 0;
                    }
                    if (gameObjectDefinition.aBoolean797) {
                        this.tileCullingBitsets[plane][x][y] |= 585;
                    }
                } else if (face === 1) {
                    if (gameObjectDefinition.unknown2) {
                        this.tileShadowIntensity[plane][x][y + 1] = (50 as number) | 0;
                        this.tileShadowIntensity[plane][x + 1][y + 1] = (50 as number) | 0;
                    }
                    if (gameObjectDefinition.aBoolean797) {
                        this.tileCullingBitsets[plane][x][y + 1] |= 1170;
                    }
                } else if (face === 2) {
                    if (gameObjectDefinition.unknown2) {
                        this.tileShadowIntensity[plane][x + 1][y] = (50 as number) | 0;
                        this.tileShadowIntensity[plane][x + 1][y + 1] = (50 as number) | 0;
                    }
                    if (gameObjectDefinition.aBoolean797) {
                        this.tileCullingBitsets[plane][x + 1][y] |= 585;
                    }
                } else if (face === 3) {
                    if (gameObjectDefinition.unknown2) {
                        this.tileShadowIntensity[plane][x][y] = (50 as number) | 0;
                        this.tileShadowIntensity[plane][x + 1][y] = (50 as number) | 0;
                    }
                    if (gameObjectDefinition.aBoolean797) {
                        this.tileCullingBitsets[plane][x][y] |= 1170;
                    }
                }
                if (gameObjectDefinition.solid && collisionMap != null) {
                    collisionMap.markWall(x, y, type, face, gameObjectDefinition.walkable);
                }
                if (gameObjectDefinition.unknown4 !== 16) {
                    scene.method257(y, gameObjectDefinition.unknown4, plane, x);
                }
            } else if (type === 1) {
                let renderable: Renderable;
                if (gameObjectDefinition.animationId === -1 && gameObjectDefinition.childrenIds == null) {
                    renderable = gameObjectDefinition.getGameObjectModel(
                        1,
                        face,
                        vertexHeight,
                        vertexHeightRight,
                        vertexHeightTopRight,
                        vertexHeightTop,
                        -1
                    );
                } else {
                    renderable = new GameObject(
                        objectId,
                        face,
                        1,
                        vertexHeightRight,
                        vertexHeightTopRight,
                        vertexHeight,
                        vertexHeightTop,
                        gameObjectDefinition.animationId,
                        true
                    );
                }
                scene.method249(Region.anIntArray167[face], renderable, hash, y, objectConfig, x, null, vertexMix, 0, plane);
                if (gameObjectDefinition.unknown2) {
                    if (face === 0) {
                        this.tileShadowIntensity[plane][x][y + 1] = (50 as number) | 0;
                    } else if (face === 1) {
                        this.tileShadowIntensity[plane][x + 1][y + 1] = (50 as number) | 0;
                    } else if (face === 2) {
                        this.tileShadowIntensity[plane][x + 1][y] = (50 as number) | 0;
                    } else if (face === 3) {
                        this.tileShadowIntensity[plane][x][y] = (50 as number) | 0;
                    }
                }
                if (gameObjectDefinition.solid && collisionMap != null) {
                    collisionMap.markWall(x, y, type, face, gameObjectDefinition.walkable);
                }
            } else if (type === 2) {
                const i_204_: number = (face + 1) & 3;
                let renderable: Renderable;
                let renderable1: Renderable;
                if (gameObjectDefinition.animationId === -1 && gameObjectDefinition.childrenIds == null) {
                    renderable = gameObjectDefinition.getGameObjectModel(
                        2,
                        4 + face,
                        vertexHeight,
                        vertexHeightRight,
                        vertexHeightTopRight,
                        vertexHeightTop,
                        -1
                    );
                    renderable1 = gameObjectDefinition.getGameObjectModel(
                        2,
                        i_204_,
                        vertexHeight,
                        vertexHeightRight,
                        vertexHeightTopRight,
                        vertexHeightTop,
                        -1
                    );
                } else {
                    renderable = new GameObject(
                        objectId,
                        4 + face,
                        2,
                        vertexHeightRight,
                        vertexHeightTopRight,
                        vertexHeight,
                        vertexHeightTop,
                        gameObjectDefinition.animationId,
                        true
                    );
                    renderable1 = new GameObject(
                        objectId,
                        i_204_,
                        2,
                        vertexHeightRight,
                        vertexHeightTopRight,
                        vertexHeight,
                        vertexHeightTop,
                        gameObjectDefinition.animationId,
                        true
                    );
                }
                scene.method249(
                    Region.anIntArray158[face],
                    renderable,
                    hash,
                    y,
                    objectConfig,
                    x,
                    renderable1,
                    vertexMix,
                    Region.anIntArray158[i_204_],
                    plane
                );
                if (gameObjectDefinition.aBoolean797) {
                    if (face === 0) {
                        this.tileCullingBitsets[plane][x][y] |= 585;
                        this.tileCullingBitsets[plane][x][y + 1] |= 1170;
                    } else if (face === 1) {
                        this.tileCullingBitsets[plane][x][y + 1] |= 1170;
                        this.tileCullingBitsets[plane][x + 1][y] |= 585;
                    } else if (face === 2) {
                        this.tileCullingBitsets[plane][x + 1][y] |= 585;
                        this.tileCullingBitsets[plane][x][y] |= 1170;
                    } else if (face === 3) {
                        this.tileCullingBitsets[plane][x][y] |= 1170;
                        this.tileCullingBitsets[plane][x][y] |= 585;
                    }
                }
                if (gameObjectDefinition.solid && collisionMap != null) {
                    collisionMap.markWall(x, y, type, face, gameObjectDefinition.walkable);
                }
                if (gameObjectDefinition.unknown4 !== 16) {
                    scene.method257(y, gameObjectDefinition.unknown4, plane, x);
                }
            } else if (type === 3) {
                let renderable: Renderable;
                if (gameObjectDefinition.animationId === -1 && gameObjectDefinition.childrenIds == null) {
                    renderable = gameObjectDefinition.getGameObjectModel(
                        3,
                        face,
                        vertexHeight,
                        vertexHeightRight,
                        vertexHeightTopRight,
                        vertexHeightTop,
                        -1
                    );
                } else {
                    renderable = new GameObject(
                        objectId,
                        face,
                        3,
                        vertexHeightRight,
                        vertexHeightTopRight,
                        vertexHeight,
                        vertexHeightTop,
                        gameObjectDefinition.animationId,
                        true
                    );
                }
                scene.method249(Region.anIntArray167[face], renderable, hash, y, objectConfig, x, null, vertexMix, 0, plane);
                if (gameObjectDefinition.unknown2) {
                    if (face === 0) {
                        this.tileShadowIntensity[plane][x][y + 1] = (50 as number) | 0;
                    } else if (face === 1) {
                        this.tileShadowIntensity[plane][x + 1][y + 1] = (50 as number) | 0;
                    } else if (face === 2) {
                        this.tileShadowIntensity[plane][x + 1][y] = (50 as number) | 0;
                    } else if (face === 3) {
                        this.tileShadowIntensity[plane][x][y] = (50 as number) | 0;
                    }
                }
                if (gameObjectDefinition.solid && collisionMap != null) {
                    collisionMap.markWall(x, y, type, face, gameObjectDefinition.walkable);
                }
            } else if (type === 9) {
                let renderable: Renderable;
                if (gameObjectDefinition.animationId === -1 && gameObjectDefinition.childrenIds == null) {
                    renderable = gameObjectDefinition.getGameObjectModel(
                        type,
                        face,
                        vertexHeight,
                        vertexHeightRight,
                        vertexHeightTopRight,
                        vertexHeightTop,
                        -1
                    );
                } else {
                    renderable = new GameObject(
                        objectId,
                        face,
                        type,
                        vertexHeightRight,
                        vertexHeightTopRight,
                        vertexHeight,
                        vertexHeightTop,
                        gameObjectDefinition.animationId,
                        true
                    );
                }
                scene.method251(plane, 1, y, renderable, objectConfig, 0, x, -896, 1, vertexMix, hash);
                if (gameObjectDefinition.solid && collisionMap != null) {
                    collisionMap.method413(
                        y,
                        face,
                        gameObjectDefinition.sizeY,
                        gameObjectDefinition.sizeX,
                        gameObjectDefinition.walkable,
                        x,
                        (52 as number) | 0
                    );
                }
            } else {
                if (gameObjectDefinition.adjustToTerrain) {
                    if (face === 1) {
                        const i_206_: number = vertexHeightTop;
                        vertexHeightTop = vertexHeightTopRight;
                        vertexHeightTopRight = vertexHeightRight;
                        vertexHeightRight = vertexHeight;
                        vertexHeight = i_206_;
                    } else if (face === 2) {
                        let i_207_: number = vertexHeightTop;
                        vertexHeightTop = vertexHeightRight;
                        vertexHeightRight = i_207_;
                        i_207_ = vertexHeightTopRight;
                        vertexHeightTopRight = vertexHeight;
                        vertexHeight = i_207_;
                    } else if (face === 3) {
                        const i_208_: number = vertexHeightTop;
                        vertexHeightTop = vertexHeight;
                        vertexHeight = vertexHeightRight;
                        vertexHeightRight = vertexHeightTopRight;
                        vertexHeightTopRight = i_208_;
                    }
                }
                if (type === 4) {
                    let renderable: Renderable;
                    if (gameObjectDefinition.animationId === -1 && gameObjectDefinition.childrenIds == null) {
                        renderable = gameObjectDefinition.getGameObjectModel(
                            4,
                            0,
                            vertexHeight,
                            vertexHeightRight,
                            vertexHeightTopRight,
                            vertexHeightTop,
                            -1
                        );
                    } else {
                        renderable = new GameObject(
                            objectId,
                            0,
                            4,
                            vertexHeightRight,
                            vertexHeightTopRight,
                            vertexHeight,
                            vertexHeightTop,
                            gameObjectDefinition.animationId,
                            true
                        );
                    }
                    scene.addWallDecoration(
                        plane,
                        Region.anIntArray158[face],
                        face * 512,
                        hash,
                        objectConfig,
                        x,
                        0,
                        y,
                        0,
                        vertexMix,
                        renderable,
                        -930
                    );
                } else if (type === 5) {
                    let offset: number = 16;
                    const i_210_: number = scene.method267(plane, x, y);
                    if (i_210_ > 0) {
                        offset = GameObjectDefinition.getDefinition((i_210_ >> 14) & 32767).unknown4;
                    }
                    let renderable: Renderable;
                    if (gameObjectDefinition.animationId === -1 && gameObjectDefinition.childrenIds == null) {
                        renderable = gameObjectDefinition.getGameObjectModel(
                            4,
                            0,
                            vertexHeight,
                            vertexHeightRight,
                            vertexHeightTopRight,
                            vertexHeightTop,
                            -1
                        );
                    } else {
                        renderable = new GameObject(
                            objectId,
                            0,
                            4,
                            vertexHeightRight,
                            vertexHeightTopRight,
                            vertexHeight,
                            vertexHeightTop,
                            gameObjectDefinition.animationId,
                            true
                        );
                    }
                    scene.addWallDecoration(
                        plane,
                        Region.anIntArray158[face],
                        face * 512,
                        hash,
                        objectConfig,
                        x,
                        Region.anIntArray143[face] * offset,
                        y,
                        Region.anIntArray161[face] * offset,
                        vertexMix,
                        renderable,
                        -930
                    );
                } else if (type === 6) {
                    let renderable: Renderable;
                    if (gameObjectDefinition.animationId === -1 && gameObjectDefinition.childrenIds == null) {
                        renderable = gameObjectDefinition.getGameObjectModel(
                            4,
                            0,
                            vertexHeight,
                            vertexHeightRight,
                            vertexHeightTopRight,
                            vertexHeightTop,
                            -1
                        );
                    } else {
                        renderable = new GameObject(
                            objectId,
                            0,
                            4,
                            vertexHeightRight,
                            vertexHeightTopRight,
                            vertexHeight,
                            vertexHeightTop,
                            gameObjectDefinition.animationId,
                            true
                        );
                    }
                    scene.addWallDecoration(plane, 256, face, hash, objectConfig, x, 0, y, 0, vertexMix, renderable, -930);
                } else if (type === 7) {
                    let renderable: Renderable;
                    if (gameObjectDefinition.animationId === -1 && gameObjectDefinition.childrenIds == null) {
                        renderable = gameObjectDefinition.getGameObjectModel(
                            4,
                            0,
                            vertexHeight,
                            vertexHeightRight,
                            vertexHeightTopRight,
                            vertexHeightTop,
                            -1
                        );
                    } else {
                        renderable = new GameObject(
                            objectId,
                            0,
                            4,
                            vertexHeightRight,
                            vertexHeightTopRight,
                            vertexHeight,
                            vertexHeightTop,
                            gameObjectDefinition.animationId,
                            true
                        );
                    }
                    scene.addWallDecoration(plane, 512, face, hash, objectConfig, x, 0, y, 0, vertexMix, renderable, -930);
                } else if (type === 8) {
                    let renderable: Renderable;
                    if (gameObjectDefinition.animationId === -1 && gameObjectDefinition.childrenIds == null) {
                        renderable = gameObjectDefinition.getGameObjectModel(
                            4,
                            0,
                            vertexHeight,
                            vertexHeightRight,
                            vertexHeightTopRight,
                            vertexHeightTop,
                            -1
                        );
                    } else {
                        renderable = new GameObject(
                            objectId,
                            0,
                            4,
                            vertexHeightRight,
                            vertexHeightTopRight,
                            vertexHeight,
                            vertexHeightTop,
                            gameObjectDefinition.animationId,
                            true
                        );
                    }
                    scene.addWallDecoration(plane, 768, face, hash, objectConfig, x, 0, y, 0, vertexMix, renderable, -930);
                }
            }
        }
    }

    public method174(i: number, bool: boolean, i_211_: number, i_212_: number, is: number[], i_213_: number, class46s: CollisionMap[]) {
        if (bool) {
            this.anInt166 = -379;
        }
        for (let i_214_: number = 0; i_214_ < 4; i_214_++) {
            {
                for (let i_215_: number = 0; i_215_ < 64; i_215_++) {
                    {
                        for (let i_216_: number = 0; i_216_ < 64; i_216_++) {
                            {
                                if (i_212_ + i_215_ > 0 && i_212_ + i_215_ < 103 && i + i_216_ > 0 && i + i_216_ < 103) {
                                    class46s[i_214_].adjacency[i_212_ + i_215_][i + i_216_] &= ~16777216;
                                }
                            }
                        }
                    }
                }
            }
        }
        const class50_sub1_sub2: Buffer = new Buffer(is);
        for (let i_217_: number = 0; i_217_ < 4; i_217_++) {
            {
                for (let i_218_: number = 0; i_218_ < 64; i_218_++) {
                    {
                        for (let i_219_: number = 0; i_219_ < 64; i_219_++) {
                            this.method183(i_213_, (-61 as number) | 0, i_211_, class50_sub1_sub2, 0, i_218_ + i_212_, i_217_, i_219_ + i);
                        }
                    }
                }
            }
        }
    }

    public getHSLBitset(i: number, i_230_: number, i_231_: number): number {
        if (i_231_ > 179) {
            i_230_ = (n => (n < 0 ? Math.ceil(n) : Math.floor(n)))(i_230_ / 2);
        }
        if (i_231_ > 192) {
            i_230_ = (n => (n < 0 ? Math.ceil(n) : Math.floor(n)))(i_230_ / 2);
        }
        if (i_231_ > 217) {
            i_230_ = (n => (n < 0 ? Math.ceil(n) : Math.floor(n)))(i_230_ / 2);
        }
        if (i_231_ > 243) {
            i_230_ = (n => (n < 0 ? Math.ceil(n) : Math.floor(n)))(i_230_ / 2);
        }
        const i_232_: number = (((i / 4) | 0) << 10) + (((i_230_ / 32) | 0) << 7) + ((i_231_ / 2) | 0);
        return i_232_;
    }

    public method179(i: number, class46s: CollisionMap[], i_237_: number, i_238_: number, class22: Scene, is: number[]) {
        if (i_238_ < 0) {
            const class50_sub1_sub2: Buffer = new Buffer(is);
            let i_239_: number = -1;
            for (;;) {
                {
                    const i_240_: number = class50_sub1_sub2.getSmart();
                    if (i_240_ === 0) {
                        break;
                    }
                    i_239_ += i_240_;
                    let i_241_: number = 0;
                    for (;;) {
                        {
                            const i_242_: number = class50_sub1_sub2.getSmart();
                            if (i_242_ === 0) {
                                break;
                            }
                            i_241_ += i_242_ - 1;
                            const i_243_: number = i_241_ & 63;
                            const i_244_: number = (i_241_ >> 6) & 63;
                            const i_245_: number = i_241_ >> 12;
                            const i_246_: number = class50_sub1_sub2.getUnsignedByte();
                            const i_247_: number = i_246_ >> 2;
                            const i_248_: number = i_246_ & 3;
                            const i_249_: number = i_244_ + i_237_;
                            const i_250_: number = i_243_ + i;
                            if (i_249_ > 0 && i_250_ > 0 && i_249_ < 103 && i_250_ < 103) {
                                let i_251_: number = i_245_;
                                if ((this.renderRuleFlags[1][i_249_][i_250_] & 2) === 2) {
                                    i_251_--;
                                }
                                let class46: CollisionMap = null;
                                if (i_251_ >= 0) {
                                    class46 = class46s[i_251_];
                                }
                                this.renderObject(class22, class46, i_250_, i_245_, i_249_, this.aByte139, i_248_, i_247_, i_239_);
                            }
                        }
                    }
                }
            }
        }
    }

    public initiateVertexHeights(xOffset: number, xLength: number, yOffset: number, yLength: number) {
        for (let y: number = yOffset; y <= yOffset + yLength; y++) {
            {
                for (let x: number = xOffset; x <= xOffset + xLength; x++) {
                    {
                        if (x >= 0 && x < this.regionSizeX && y >= 0 && y < this.regionSizeY) {
                            this.tileShadowIntensity[0][x][y] = (127 as number) | 0;
                            if (x === xOffset && x > 0) {
                                this.vertexHeights[0][x][y] = this.vertexHeights[0][x - 1][y];
                            }
                            if (x === xOffset + xLength && x < this.regionSizeX - 1) {
                                this.vertexHeights[0][x][y] = this.vertexHeights[0][x + 1][y];
                            }
                            if (y === yOffset && y > 0) {
                                this.vertexHeights[0][x][y] = this.vertexHeights[0][x][y - 1];
                            }
                            if (y === yOffset + yLength && y < this.regionSizeY - 1) {
                                this.vertexHeights[0][x][y] = this.vertexHeights[0][x][y + 1];
                            }
                        }
                    }
                }
            }
        }
    }

    public method182(i: number, i_271_: number): number {
        if (i === -2) {
            return 12345678;
        }
        if (i === -1) {
            if (i_271_ < 0) {
                i_271_ = 0;
            } else if (i_271_ > 127) {
                i_271_ = 127;
            }
            i_271_ = 127 - i_271_;
            return i_271_;
        }
        i_271_ = ((i_271_ * (i & 127)) / 128) | 0;
        if (i_271_ < 2) {
            i_271_ = 2;
        } else if (i_271_ > 126) {
            i_271_ = 126;
        }
        return (i & 65408) + i_271_;
    }

    public method183(
        i: number,
        i_272_: number,
        i_273_: number,
        class50_sub1_sub2: Buffer,
        i_274_: number,
        i_275_: number,
        i_276_: number,
        i_277_: number
    ) {
        if (i_272_ !== -61) {
            this.aBoolean140 = !this.aBoolean140;
        }
        if (i_275_ >= 0 && i_275_ < 104 && i_277_ >= 0 && i_277_ < 104) {
            this.renderRuleFlags[i_276_][i_275_][i_277_] = (0 as number) | 0;
            for (;;) {
                {
                    const i_278_: number = class50_sub1_sub2.getUnsignedByte();
                    if (i_278_ === 0) {
                        if (i_276_ === 0) {
                            this.vertexHeights[0][i_275_][i_277_] =
                                -Region.calculateVertexHeight(932731 + i_275_ + i, 556238 + i_277_ + i_273_) * 8;
                        } else {
                            this.vertexHeights[i_276_][i_275_][i_277_] = this.vertexHeights[i_276_ - 1][i_275_][i_277_] - 240;
                            break;
                        }
                        break;
                    }
                    if (i_278_ === 1) {
                        let i_279_: number = class50_sub1_sub2.getUnsignedByte();
                        if (i_279_ === 1) {
                            i_279_ = 0;
                        }
                        if (i_276_ === 0) {
                            this.vertexHeights[0][i_275_][i_277_] = -i_279_ * 8;
                        } else {
                            this.vertexHeights[i_276_][i_275_][i_277_] = this.vertexHeights[i_276_ - 1][i_275_][i_277_] - i_279_ * 8;
                            break;
                        }
                        break;
                    }
                    if (i_278_ <= 49) {
                        this.overlayFloorIds[i_276_][i_275_][i_277_] = class50_sub1_sub2.getSignedByte();
                        this.overlayClippingPaths[i_276_][i_275_][i_277_] = ((((i_278_ - 2) / 4) | 0) as number) | 0;
                        this.overlayRotations[i_276_][i_275_][i_277_] = (((i_278_ - 2 + i_274_) & 3) as number) | 0;
                    } else if (i_278_ <= 81) {
                        this.renderRuleFlags[i_276_][i_275_][i_277_] = ((i_278_ - 49) as number) | 0;
                    } else {
                        this.underlayFloorIds[i_276_][i_275_][i_277_] = ((i_278_ - 81) as number) | 0;
                    }
                }
            }
        } else {
            for (;;) {
                {
                    const i_280_: number = class50_sub1_sub2.getUnsignedByte();
                    if (i_280_ === 0) {
                        break;
                    }
                    if (i_280_ === 1) {
                        class50_sub1_sub2.getUnsignedByte();
                        break;
                    }
                    if (i_280_ <= 49) {
                        class50_sub1_sub2.getUnsignedByte();
                    }
                }
            }
        }
    }
}

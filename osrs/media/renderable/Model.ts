import { Buffer } from "../../net/Buffer";
import { Requester } from "../../net/requester/Requester";
import { Animation } from "../Animation";
import { Rasterizer } from "../Rasterizer";
import { Rasterizer3D } from "../Rasterizer3D";
import { Skins } from "../Skins";
import { VertexNormal } from "../VertexNormal";
import { ModelHeader } from "./ModelHeader";
import { Renderable } from "./Renderable";

export class Model extends Renderable {
    public static __static_initialized: boolean = false;

    public static anInt1642: number = 0;
    public static EMPTY_MODEL: Model = new Model();
    public static anIntArray1644: number[] = Array(2000).fill(0);
    public static anIntArray1645: number[] = Array(2000).fill(0);
    public static anIntArray1646: number[] = Array(2000).fill(0);
    public static anIntArray1647: number[] = Array(2000).fill(0);
    public static modelHeaders: ModelHeader[] = null;
    public static requester: Requester = null;
    public static aBooleanArray1684: boolean[] = Array(4096).fill(false);
    public static aBooleanArray1685: boolean[] = Array(4096).fill(false);
    public static anIntArray1686: number[] = Array(4096).fill(0);
    public static anIntArray1687: number[] = Array(4096).fill(0);
    public static anIntArray1688: number[] = Array(4096).fill(0);
    public static anIntArray1689: number[] = Array(4096).fill(0);
    public static anIntArray1690: number[] = Array(4096).fill(0);
    public static anIntArray1691: number[] = Array(4096).fill(0);
    public static anIntArray1692: number[] = Array(4096).fill(0);
    public static anIntArrayArray1693: number[][] = Array(1500).fill(Array(512).fill(0));
    public static anIntArray1694: number[] = Array(12).fill(0);
    public static anIntArrayArray1695: number[][] = Array(12).fill(Array(2000).fill(0));
    public static anIntArray1696: number[] = Array(2000).fill(0);
    public static anIntArray1697: number[] = Array(2000).fill(0);
    public static anIntArray1698: number[] = Array(12).fill(0);
    public static anIntArray1699: number[] = Array(10).fill(0);
    public static anIntArray1700: number[] = Array(10).fill(0);
    public static anIntArray1701: number[] = Array(10).fill(0);
    public static vertexXModifier: number = 0;
    public static vertexYModifier: number = 0;
    public static vertexZModifier: number = 0;
    public static aBoolean1705: boolean = false;
    public static anInt1706: number = 0;
    public static anInt1707: number = 0;
    public static anInt1708: number = 0;
    public static anIntArray1709: number[] = Array(1000).fill(0);
    public static SINE: number[] = Rasterizer3D.SINE;
    public static COSINE: number[] = Rasterizer3D.COSINE;
    public static anIntArray1712: number[] = Rasterizer3D.getRgbLookupTableId;
    public static anIntArray1713: number[] = Rasterizer3D.anIntArray1535;

    public static reset() {
        Model.modelHeaders = null;
        Model.aBooleanArray1684 = null;
        Model.aBooleanArray1685 = null;
        Model.anIntArray1686 = null;
        Model.anIntArray1687 = null;
        Model.anIntArray1688 = null;
        Model.anIntArray1689 = null;
        Model.anIntArray1690 = null;
        Model.anIntArray1691 = null;
        Model.anIntArray1692 = null;
        Model.anIntArrayArray1693 = null;
        Model.anIntArray1694 = null;
        Model.anIntArrayArray1695 = null;
        Model.anIntArray1696 = null;
        Model.anIntArray1697 = null;
        Model.anIntArray1698 = null;
        Model.SINE = null;
        Model.COSINE = null;
        Model.anIntArray1712 = null;
        Model.anIntArray1713 = null;
    }

    public static init(modelCount: number, requester: Requester) {
        Model.modelHeaders = (s => {
            const a = [];
            while (s-- > 0) {
                a.push(null);
            }
            return a;
        })(modelCount);
        Model.requester = requester;
    }

    public static loadModelHeader(modelData: number[], modelId: number) {
        if (modelData == null) {
            const modelHeader: ModelHeader = (Model.modelHeaders[modelId] = new ModelHeader());
            modelHeader.vertexCount = 0;
            modelHeader.triangleCount = 0;
            modelHeader.texturedTriangleCount = 0;
            return;
        }
        const buffer: Buffer = new Buffer(modelData);
        buffer.currentPosition = modelData.length - 18;
        const modelHeader: ModelHeader = (Model.modelHeaders[modelId] = new ModelHeader());
        modelHeader.modelData = modelData;
        modelHeader.vertexCount = buffer.getUnsignedLEShort();
        modelHeader.triangleCount = buffer.getUnsignedLEShort();
        modelHeader.texturedTriangleCount = buffer.getUnsignedByte();
        const useTextures: number = buffer.getUnsignedByte();
        const useTrianglePriority: number = buffer.getUnsignedByte();
        const useTransparency: number = buffer.getUnsignedByte();
        const useTriangleSkinning: number = buffer.getUnsignedByte();
        const useVertexSkinning: number = buffer.getUnsignedByte();
        const xDataLength: number = buffer.getUnsignedLEShort();
        const yDataLength: number = buffer.getUnsignedLEShort();
        const zDataLength: number = buffer.getUnsignedLEShort();
        const triangleDataLength: number = buffer.getUnsignedLEShort();
        let offset: number = 0;
        modelHeader.vertexDirectionOffset = offset;
        offset += modelHeader.vertexCount;
        modelHeader.triangleTypeOffset = offset;
        offset += modelHeader.triangleCount;
        modelHeader.trianglePriorityOffset = offset;
        if (useTrianglePriority === 255) {
            offset += modelHeader.triangleCount;
        } else {
            modelHeader.trianglePriorityOffset = -useTrianglePriority - 1;
        }
        modelHeader.triangleSkinOffset = offset;
        if (useTriangleSkinning === 1) {
            offset += modelHeader.triangleCount;
        } else {
            modelHeader.triangleSkinOffset = -1;
        }
        modelHeader.texturePointerOffset = offset;
        if (useTextures === 1) {
            offset += modelHeader.triangleCount;
        } else {
            modelHeader.texturePointerOffset = -1;
        }
        modelHeader.vertexSkinOffset = offset;
        if (useVertexSkinning === 1) {
            offset += modelHeader.vertexCount;
        } else {
            modelHeader.vertexSkinOffset = -1;
        }
        modelHeader.triangleAlphaOffset = offset;
        if (useTransparency === 1) {
            offset += modelHeader.triangleCount;
        } else {
            modelHeader.triangleAlphaOffset = -1;
        }
        modelHeader.triangleDataOffset = offset;
        offset += triangleDataLength;
        modelHeader.colorDataOffset = offset;
        offset += modelHeader.triangleCount * 2;
        modelHeader.uvMapTriangleOffset = offset;
        offset += modelHeader.texturedTriangleCount * 6;
        modelHeader.xDataOffset = offset;
        offset += xDataLength;
        modelHeader.yDataOffset = offset;
        offset += yDataLength;
        modelHeader.zDataOffset = offset;
        offset += zDataLength;
    }

    public static resetModel(model: number) {
        Model.modelHeaders[model] = null;
    }

    public static getModel(model: number): Model {
        if (Model.modelHeaders == null) {
            return null;
        }
        const modelHeader: ModelHeader = Model.modelHeaders[model];
        if (modelHeader == null) {
            Model.requester.requestModel(model);
            return null;
        } else {
            return new Model(model);
        }
    }

    public static loaded(id: number): boolean {
        if (Model.modelHeaders == null) {
            return false;
        }
        const modelHeader: ModelHeader = Model.modelHeaders[id];
        if (modelHeader == null) {
            Model.requester.requestModel(id);
            return false;
        } else {
            return true;
        }
    }

    public static method597(i: number, j: number, k: number): number {
        if ((k & 2) === 2) {
            if (j < 0) {
                j = 0;
            } else if (j > 127) {
                j = 127;
            }
            j = 127 - j;
            return j;
        }
        j = (j * (i & 127)) >> 7;
        if (j < 2) {
            j = 2;
        } else if (j > 126) {
            j = 126;
        }
        return (i & 65408) + j;
    }


    public anInt1636: number;

    public anInt1637: number;

    public aBoolean1638: boolean;

    public aBoolean1639: boolean;

    public anInt1640: number;

    public aBoolean1641: boolean;

    public vertexCount: number;

    public verticesX: number[];

    public verticesY: number[];

    public verticesZ: number[];

    public triangleCount: number;

    public trianglePointsX: number[];

    public trianglePointsY: number[];

    public trianglePointsZ: number[];

    public anIntArray1656: number[];

    public anIntArray1657: number[];

    public anIntArray1658: number[];

    public texturePoints: number[];

    public trianglePriorities: number[];

    public triangleAlphaValues: number[];

    public triangleColorValues: number[];

    public anInt1663: number;

    public texturedTriangleCount: number;

    public texturedTrianglePointsX: number[];

    public texturedTrianglePointsY: number[];

    public texturedTrianglePointsZ: number[];

    public anInt1668: number;

    public anInt1669: number;

    public anInt1670: number;

    public shadowIntensity: number;

    public maxY: number;

    public anInt1673: number;

    public anInt1674: number;

    public anInt1675: number;

    public vertexSkins: number[];

    public triangleSkinValues: number[];

    public vectorSkin: number[][];

    public triangleSkin: number[][];

    public oneSquareModel: boolean;

    public aClass40Array1681: VertexNormal[];

    public constructor(flag?: any, flag1?: any, i?: any, class50_sub1_sub4_sub4?: any) {
        if (
            (typeof flag === "boolean" || flag === null) &&
            (typeof flag1 === "boolean" || flag1 === null) &&
            (typeof i === "number" || i === null) &&
            ((class50_sub1_sub4_sub4 != null && ((class50_sub1_sub4_sub4 instanceof Model) as any)) || class50_sub1_sub4_sub4 === null)
        ) {
            const __args = arguments;
            super();
            if (this.vertexCount === undefined) {
                this.vertexCount = 0;
            }
            if (this.verticesX === undefined) {
                this.verticesX = null;
            }
            if (this.verticesY === undefined) {
                this.verticesY = null;
            }
            if (this.verticesZ === undefined) {
                this.verticesZ = null;
            }
            if (this.triangleCount === undefined) {
                this.triangleCount = 0;
            }
            if (this.trianglePointsX === undefined) {
                this.trianglePointsX = null;
            }
            if (this.trianglePointsY === undefined) {
                this.trianglePointsY = null;
            }
            if (this.trianglePointsZ === undefined) {
                this.trianglePointsZ = null;
            }
            if (this.anIntArray1656 === undefined) {
                this.anIntArray1656 = null;
            }
            if (this.anIntArray1657 === undefined) {
                this.anIntArray1657 = null;
            }
            if (this.anIntArray1658 === undefined) {
                this.anIntArray1658 = null;
            }
            if (this.texturePoints === undefined) {
                this.texturePoints = null;
            }
            if (this.trianglePriorities === undefined) {
                this.trianglePriorities = null;
            }
            if (this.triangleAlphaValues === undefined) {
                this.triangleAlphaValues = null;
            }
            if (this.triangleColorValues === undefined) {
                this.triangleColorValues = null;
            }
            if (this.anInt1663 === undefined) {
                this.anInt1663 = 0;
            }
            if (this.texturedTriangleCount === undefined) {
                this.texturedTriangleCount = 0;
            }
            if (this.texturedTrianglePointsX === undefined) {
                this.texturedTrianglePointsX = null;
            }
            if (this.texturedTrianglePointsY === undefined) {
                this.texturedTrianglePointsY = null;
            }
            if (this.texturedTrianglePointsZ === undefined) {
                this.texturedTrianglePointsZ = null;
            }
            if (this.anInt1668 === undefined) {
                this.anInt1668 = 0;
            }
            if (this.anInt1669 === undefined) {
                this.anInt1669 = 0;
            }
            if (this.anInt1670 === undefined) {
                this.anInt1670 = 0;
            }
            if (this.shadowIntensity === undefined) {
                this.shadowIntensity = 0;
            }
            if (this.maxY === undefined) {
                this.maxY = 0;
            }
            if (this.anInt1673 === undefined) {
                this.anInt1673 = 0;
            }
            if (this.anInt1674 === undefined) {
                this.anInt1674 = 0;
            }
            if (this.anInt1675 === undefined) {
                this.anInt1675 = 0;
            }
            if (this.vertexSkins === undefined) {
                this.vertexSkins = null;
            }
            if (this.triangleSkinValues === undefined) {
                this.triangleSkinValues = null;
            }
            if (this.vectorSkin === undefined) {
                this.vectorSkin = null;
            }
            if (this.triangleSkin === undefined) {
                this.triangleSkin = null;
            }
            if (this.aClass40Array1681 === undefined) {
                this.aClass40Array1681 = null;
            }
            this.anInt1636 = 932;
            this.anInt1637 = 426;
            this.aBoolean1638 = false;
            this.aBoolean1639 = true;
            this.anInt1640 = -252;
            this.aBoolean1641 = false;
            this.oneSquareModel = false;
            if (this.vertexCount === undefined) {
                this.vertexCount = 0;
            }
            if (this.verticesX === undefined) {
                this.verticesX = null;
            }
            if (this.verticesY === undefined) {
                this.verticesY = null;
            }
            if (this.verticesZ === undefined) {
                this.verticesZ = null;
            }
            if (this.triangleCount === undefined) {
                this.triangleCount = 0;
            }
            if (this.trianglePointsX === undefined) {
                this.trianglePointsX = null;
            }
            if (this.trianglePointsY === undefined) {
                this.trianglePointsY = null;
            }
            if (this.trianglePointsZ === undefined) {
                this.trianglePointsZ = null;
            }
            if (this.anIntArray1656 === undefined) {
                this.anIntArray1656 = null;
            }
            if (this.anIntArray1657 === undefined) {
                this.anIntArray1657 = null;
            }
            if (this.anIntArray1658 === undefined) {
                this.anIntArray1658 = null;
            }
            if (this.texturePoints === undefined) {
                this.texturePoints = null;
            }
            if (this.trianglePriorities === undefined) {
                this.trianglePriorities = null;
            }
            if (this.triangleAlphaValues === undefined) {
                this.triangleAlphaValues = null;
            }
            if (this.triangleColorValues === undefined) {
                this.triangleColorValues = null;
            }
            if (this.anInt1663 === undefined) {
                this.anInt1663 = 0;
            }
            if (this.texturedTriangleCount === undefined) {
                this.texturedTriangleCount = 0;
            }
            if (this.texturedTrianglePointsX === undefined) {
                this.texturedTrianglePointsX = null;
            }
            if (this.texturedTrianglePointsY === undefined) {
                this.texturedTrianglePointsY = null;
            }
            if (this.texturedTrianglePointsZ === undefined) {
                this.texturedTrianglePointsZ = null;
            }
            if (this.anInt1668 === undefined) {
                this.anInt1668 = 0;
            }
            if (this.anInt1669 === undefined) {
                this.anInt1669 = 0;
            }
            if (this.anInt1670 === undefined) {
                this.anInt1670 = 0;
            }
            if (this.shadowIntensity === undefined) {
                this.shadowIntensity = 0;
            }
            if (this.maxY === undefined) {
                this.maxY = 0;
            }
            if (this.anInt1673 === undefined) {
                this.anInt1673 = 0;
            }
            if (this.anInt1674 === undefined) {
                this.anInt1674 = 0;
            }
            if (this.anInt1675 === undefined) {
                this.anInt1675 = 0;
            }
            if (this.vertexSkins === undefined) {
                this.vertexSkins = null;
            }
            if (this.triangleSkinValues === undefined) {
                this.triangleSkinValues = null;
            }
            if (this.vectorSkin === undefined) {
                this.vectorSkin = null;
            }
            if (this.triangleSkin === undefined) {
                this.triangleSkin = null;
            }
            if (this.aClass40Array1681 === undefined) {
                this.aClass40Array1681 = null;
            }
            (() => {
                this.aBoolean1638 = false;
                this.aBoolean1639 = true;
                this.anInt1640 = -252;
                Model.anInt1642;
                Model.anInt1642++;
                this.vertexCount = class50_sub1_sub4_sub4.vertexCount;
                this.triangleCount = class50_sub1_sub4_sub4.triangleCount;
                this.texturedTriangleCount = class50_sub1_sub4_sub4.texturedTriangleCount;
                if (flag) {
                    this.verticesY = (s => {
                        const a = [];
                        while (s-- > 0) {
                            a.push(0);
                        }
                        return a;
                    })(this.vertexCount);
                    for (let j: number = 0; j < this.vertexCount; j++) {
                        this.verticesY[j] = class50_sub1_sub4_sub4.verticesY[j];
                    }
                } else {
                    this.verticesY = class50_sub1_sub4_sub4.verticesY;
                }
                if (flag1) {
                    this.anIntArray1656 = (s => {
                        const a = [];
                        while (s-- > 0) {
                            a.push(0);
                        }
                        return a;
                    })(this.triangleCount);
                    this.anIntArray1657 = (s => {
                        const a = [];
                        while (s-- > 0) {
                            a.push(0);
                        }
                        return a;
                    })(this.triangleCount);
                    this.anIntArray1658 = (s => {
                        const a = [];
                        while (s-- > 0) {
                            a.push(0);
                        }
                        return a;
                    })(this.triangleCount);
                    for (let k: number = 0; k < this.triangleCount; k++) {
                        {
                            this.anIntArray1656[k] = class50_sub1_sub4_sub4.anIntArray1656[k];
                            this.anIntArray1657[k] = class50_sub1_sub4_sub4.anIntArray1657[k];
                            this.anIntArray1658[k] = class50_sub1_sub4_sub4.anIntArray1658[k];
                        }
                    }
                    this.texturePoints = (s => {
                        const a = [];
                        while (s-- > 0) {
                            a.push(0);
                        }
                        return a;
                    })(this.triangleCount);
                    if (class50_sub1_sub4_sub4.texturePoints == null) {
                        for (let l: number = 0; l < this.triangleCount; l++) {
                            this.texturePoints[l] = 0;
                        }
                    } else {
                        for (let i1: number = 0; i1 < this.triangleCount; i1++) {
                            this.texturePoints[i1] = class50_sub1_sub4_sub4.texturePoints[i1];
                        }
                    }
                    this.verticesNormal = (s => {
                        const a = [];
                        while (s-- > 0) {
                            a.push(null);
                        }
                        return a;
                    })(this.vertexCount);
                    for (let j1: number = 0; j1 < this.vertexCount; j1++) {
                        {
                            const class40: VertexNormal = (this.verticesNormal[j1] = new VertexNormal());
                            const class40_1: VertexNormal = (class50_sub1_sub4_sub4 as Renderable).verticesNormal[j1];
                            class40.x = class40_1.x;
                            class40.y = class40_1.y;
                            class40.z = class40_1.z;
                            class40.magnitude = class40_1.magnitude;
                        }
                    }
                    this.aClass40Array1681 = class50_sub1_sub4_sub4.aClass40Array1681;
                } else {
                    this.anIntArray1656 = class50_sub1_sub4_sub4.anIntArray1656;
                    this.anIntArray1657 = class50_sub1_sub4_sub4.anIntArray1657;
                    this.anIntArray1658 = class50_sub1_sub4_sub4.anIntArray1658;
                    this.texturePoints = class50_sub1_sub4_sub4.texturePoints;
                }
                this.verticesX = class50_sub1_sub4_sub4.verticesX;
                this.verticesZ = class50_sub1_sub4_sub4.verticesZ;
                if (i !== 0) {
                    this.aBoolean1638 = !this.aBoolean1638;
                }
                this.triangleColorValues = class50_sub1_sub4_sub4.triangleColorValues;
                this.triangleAlphaValues = class50_sub1_sub4_sub4.triangleAlphaValues;
                this.trianglePriorities = class50_sub1_sub4_sub4.trianglePriorities;
                this.anInt1663 = class50_sub1_sub4_sub4.anInt1663;
                this.trianglePointsX = class50_sub1_sub4_sub4.trianglePointsX;
                this.trianglePointsY = class50_sub1_sub4_sub4.trianglePointsY;
                this.trianglePointsZ = class50_sub1_sub4_sub4.trianglePointsZ;
                this.texturedTrianglePointsX = class50_sub1_sub4_sub4.texturedTrianglePointsX;
                this.texturedTrianglePointsY = class50_sub1_sub4_sub4.texturedTrianglePointsY;
                this.texturedTrianglePointsZ = class50_sub1_sub4_sub4.texturedTrianglePointsZ;
                this.modelHeight = (class50_sub1_sub4_sub4 as Renderable).modelHeight;
                this.maxY = class50_sub1_sub4_sub4.maxY;
                this.shadowIntensity = class50_sub1_sub4_sub4.shadowIntensity;
                this.anInt1674 = class50_sub1_sub4_sub4.anInt1674;
                this.anInt1673 = class50_sub1_sub4_sub4.anInt1673;
                this.anInt1669 = class50_sub1_sub4_sub4.anInt1669;
                this.anInt1670 = class50_sub1_sub4_sub4.anInt1670;
                this.anInt1668 = class50_sub1_sub4_sub4.anInt1668;
            })();
        } else if (
            (typeof flag === "boolean" || flag === null) &&
            ((flag1 != null && ((flag1 instanceof Model) as any)) || flag1 === null) &&
            (typeof i === "boolean" || i === null) &&
            class50_sub1_sub4_sub4 === undefined
        ) {
            const __args = arguments;
            const flag2: any = __args[0];
            const model: any = __args[1];
            const flag3: any = __args[2];
            super();
            if (this.vertexCount === undefined) {
                this.vertexCount = 0;
            }
            if (this.verticesX === undefined) {
                this.verticesX = null;
            }
            if (this.verticesY === undefined) {
                this.verticesY = null;
            }
            if (this.verticesZ === undefined) {
                this.verticesZ = null;
            }
            if (this.triangleCount === undefined) {
                this.triangleCount = 0;
            }
            if (this.trianglePointsX === undefined) {
                this.trianglePointsX = null;
            }
            if (this.trianglePointsY === undefined) {
                this.trianglePointsY = null;
            }
            if (this.trianglePointsZ === undefined) {
                this.trianglePointsZ = null;
            }
            if (this.anIntArray1656 === undefined) {
                this.anIntArray1656 = null;
            }
            if (this.anIntArray1657 === undefined) {
                this.anIntArray1657 = null;
            }
            if (this.anIntArray1658 === undefined) {
                this.anIntArray1658 = null;
            }
            if (this.texturePoints === undefined) {
                this.texturePoints = null;
            }
            if (this.trianglePriorities === undefined) {
                this.trianglePriorities = null;
            }
            if (this.triangleAlphaValues === undefined) {
                this.triangleAlphaValues = null;
            }
            if (this.triangleColorValues === undefined) {
                this.triangleColorValues = null;
            }
            if (this.anInt1663 === undefined) {
                this.anInt1663 = 0;
            }
            if (this.texturedTriangleCount === undefined) {
                this.texturedTriangleCount = 0;
            }
            if (this.texturedTrianglePointsX === undefined) {
                this.texturedTrianglePointsX = null;
            }
            if (this.texturedTrianglePointsY === undefined) {
                this.texturedTrianglePointsY = null;
            }
            if (this.texturedTrianglePointsZ === undefined) {
                this.texturedTrianglePointsZ = null;
            }
            if (this.anInt1668 === undefined) {
                this.anInt1668 = 0;
            }
            if (this.anInt1669 === undefined) {
                this.anInt1669 = 0;
            }
            if (this.anInt1670 === undefined) {
                this.anInt1670 = 0;
            }
            if (this.shadowIntensity === undefined) {
                this.shadowIntensity = 0;
            }
            if (this.maxY === undefined) {
                this.maxY = 0;
            }
            if (this.anInt1673 === undefined) {
                this.anInt1673 = 0;
            }
            if (this.anInt1674 === undefined) {
                this.anInt1674 = 0;
            }
            if (this.anInt1675 === undefined) {
                this.anInt1675 = 0;
            }
            if (this.vertexSkins === undefined) {
                this.vertexSkins = null;
            }
            if (this.triangleSkinValues === undefined) {
                this.triangleSkinValues = null;
            }
            if (this.vectorSkin === undefined) {
                this.vectorSkin = null;
            }
            if (this.triangleSkin === undefined) {
                this.triangleSkin = null;
            }
            if (this.aClass40Array1681 === undefined) {
                this.aClass40Array1681 = null;
            }
            this.anInt1636 = 932;
            this.anInt1637 = 426;
            this.aBoolean1638 = false;
            this.aBoolean1639 = true;
            this.anInt1640 = -252;
            this.aBoolean1641 = false;
            this.oneSquareModel = false;
            if (this.vertexCount === undefined) {
                this.vertexCount = 0;
            }
            if (this.verticesX === undefined) {
                this.verticesX = null;
            }
            if (this.verticesY === undefined) {
                this.verticesY = null;
            }
            if (this.verticesZ === undefined) {
                this.verticesZ = null;
            }
            if (this.triangleCount === undefined) {
                this.triangleCount = 0;
            }
            if (this.trianglePointsX === undefined) {
                this.trianglePointsX = null;
            }
            if (this.trianglePointsY === undefined) {
                this.trianglePointsY = null;
            }
            if (this.trianglePointsZ === undefined) {
                this.trianglePointsZ = null;
            }
            if (this.anIntArray1656 === undefined) {
                this.anIntArray1656 = null;
            }
            if (this.anIntArray1657 === undefined) {
                this.anIntArray1657 = null;
            }
            if (this.anIntArray1658 === undefined) {
                this.anIntArray1658 = null;
            }
            if (this.texturePoints === undefined) {
                this.texturePoints = null;
            }
            if (this.trianglePriorities === undefined) {
                this.trianglePriorities = null;
            }
            if (this.triangleAlphaValues === undefined) {
                this.triangleAlphaValues = null;
            }
            if (this.triangleColorValues === undefined) {
                this.triangleColorValues = null;
            }
            if (this.anInt1663 === undefined) {
                this.anInt1663 = 0;
            }
            if (this.texturedTriangleCount === undefined) {
                this.texturedTriangleCount = 0;
            }
            if (this.texturedTrianglePointsX === undefined) {
                this.texturedTrianglePointsX = null;
            }
            if (this.texturedTrianglePointsY === undefined) {
                this.texturedTrianglePointsY = null;
            }
            if (this.texturedTrianglePointsZ === undefined) {
                this.texturedTrianglePointsZ = null;
            }
            if (this.anInt1668 === undefined) {
                this.anInt1668 = 0;
            }
            if (this.anInt1669 === undefined) {
                this.anInt1669 = 0;
            }
            if (this.anInt1670 === undefined) {
                this.anInt1670 = 0;
            }
            if (this.shadowIntensity === undefined) {
                this.shadowIntensity = 0;
            }
            if (this.maxY === undefined) {
                this.maxY = 0;
            }
            if (this.anInt1673 === undefined) {
                this.anInt1673 = 0;
            }
            if (this.anInt1674 === undefined) {
                this.anInt1674 = 0;
            }
            if (this.anInt1675 === undefined) {
                this.anInt1675 = 0;
            }
            if (this.vertexSkins === undefined) {
                this.vertexSkins = null;
            }
            if (this.triangleSkinValues === undefined) {
                this.triangleSkinValues = null;
            }
            if (this.vectorSkin === undefined) {
                this.vectorSkin = null;
            }
            if (this.triangleSkin === undefined) {
                this.triangleSkin = null;
            }
            if (this.aClass40Array1681 === undefined) {
                this.aClass40Array1681 = null;
            }
            (() => {
                this.aBoolean1638 = false;
                this.aBoolean1639 = true;
                this.anInt1640 = -252;
                Model.anInt1642;
                Model.anInt1642++;
                this.vertexCount = model.vertexCount;
                this.triangleCount = model.triangleCount;
                this.texturedTriangleCount = model.texturedTriangleCount;
                this.verticesX = (s => {
                    const a = [];
                    while (s-- > 0) {
                        a.push(0);
                    }
                    return a;
                })(this.vertexCount);
                this.verticesY = (s => {
                    const a = [];
                    while (s-- > 0) {
                        a.push(0);
                    }
                    return a;
                })(this.vertexCount);
                this.verticesZ = (s => {
                    const a = [];
                    while (s-- > 0) {
                        a.push(0);
                    }
                    return a;
                })(this.vertexCount);
                for (let i: number = 0; i < this.vertexCount; i++) {
                    {
                        this.verticesX[i] = model.verticesX[i];
                        this.verticesY[i] = model.verticesY[i];
                        this.verticesZ[i] = model.verticesZ[i];
                    }
                }
                if (flag2) {
                    this.triangleColorValues = model.triangleColorValues;
                } else {
                    this.triangleColorValues = (s => {
                        const a = [];
                        while (s-- > 0) {
                            a.push(0);
                        }
                        return a;
                    })(this.triangleCount);
                    for (let j: number = 0; j < this.triangleCount; j++) {
                        this.triangleColorValues[j] = model.triangleColorValues[j];
                    }
                }
                if (flag3) {
                    this.triangleAlphaValues = model.triangleAlphaValues;
                } else {
                    this.triangleAlphaValues = (s => {
                        const a = [];
                        while (s-- > 0) {
                            a.push(0);
                        }
                        return a;
                    })(this.triangleCount);
                    if (model.triangleAlphaValues == null) {
                        for (let k: number = 0; k < this.triangleCount; k++) {
                            this.triangleAlphaValues[k] = 0;
                        }
                    } else {
                        for (let l: number = 0; l < this.triangleCount; l++) {
                            this.triangleAlphaValues[l] = model.triangleAlphaValues[l];
                        }
                    }
                }
                this.vertexSkins = model.vertexSkins;
                this.triangleSkinValues = model.triangleSkinValues;
                this.texturePoints = model.texturePoints;
                this.trianglePointsX = model.trianglePointsX;
                this.trianglePointsY = model.trianglePointsY;
                this.trianglePointsZ = model.trianglePointsZ;
                this.trianglePriorities = model.trianglePriorities;
                this.anInt1663 = model.anInt1663;
                this.texturedTrianglePointsX = model.texturedTrianglePointsX;
                this.texturedTrianglePointsY = model.texturedTrianglePointsY;
                this.texturedTrianglePointsZ = model.texturedTrianglePointsZ;
            })();
        } else if (
            (typeof flag === "number" || flag === null) &&
            (typeof flag1 === "number" || flag1 === null) &&
            ((i != null &&
                ((i instanceof Array) as any) &&
                (i.length == 0 || i[0] == null || (i[0] != null && ((i[0] instanceof Model) as any)))) ||
                i === null) &&
            class50_sub1_sub4_sub4 === undefined
        ) {
            const __args = arguments;
            const i: any = __args[0];
            const j: any = __args[1];
            const models: any = __args[2];
            super();
            if (this.vertexCount === undefined) {
                this.vertexCount = 0;
            }
            if (this.verticesX === undefined) {
                this.verticesX = null;
            }
            if (this.verticesY === undefined) {
                this.verticesY = null;
            }
            if (this.verticesZ === undefined) {
                this.verticesZ = null;
            }
            if (this.triangleCount === undefined) {
                this.triangleCount = 0;
            }
            if (this.trianglePointsX === undefined) {
                this.trianglePointsX = null;
            }
            if (this.trianglePointsY === undefined) {
                this.trianglePointsY = null;
            }
            if (this.trianglePointsZ === undefined) {
                this.trianglePointsZ = null;
            }
            if (this.anIntArray1656 === undefined) {
                this.anIntArray1656 = null;
            }
            if (this.anIntArray1657 === undefined) {
                this.anIntArray1657 = null;
            }
            if (this.anIntArray1658 === undefined) {
                this.anIntArray1658 = null;
            }
            if (this.texturePoints === undefined) {
                this.texturePoints = null;
            }
            if (this.trianglePriorities === undefined) {
                this.trianglePriorities = null;
            }
            if (this.triangleAlphaValues === undefined) {
                this.triangleAlphaValues = null;
            }
            if (this.triangleColorValues === undefined) {
                this.triangleColorValues = null;
            }
            if (this.anInt1663 === undefined) {
                this.anInt1663 = 0;
            }
            if (this.texturedTriangleCount === undefined) {
                this.texturedTriangleCount = 0;
            }
            if (this.texturedTrianglePointsX === undefined) {
                this.texturedTrianglePointsX = null;
            }
            if (this.texturedTrianglePointsY === undefined) {
                this.texturedTrianglePointsY = null;
            }
            if (this.texturedTrianglePointsZ === undefined) {
                this.texturedTrianglePointsZ = null;
            }
            if (this.anInt1668 === undefined) {
                this.anInt1668 = 0;
            }
            if (this.anInt1669 === undefined) {
                this.anInt1669 = 0;
            }
            if (this.anInt1670 === undefined) {
                this.anInt1670 = 0;
            }
            if (this.shadowIntensity === undefined) {
                this.shadowIntensity = 0;
            }
            if (this.maxY === undefined) {
                this.maxY = 0;
            }
            if (this.anInt1673 === undefined) {
                this.anInt1673 = 0;
            }
            if (this.anInt1674 === undefined) {
                this.anInt1674 = 0;
            }
            if (this.anInt1675 === undefined) {
                this.anInt1675 = 0;
            }
            if (this.vertexSkins === undefined) {
                this.vertexSkins = null;
            }
            if (this.triangleSkinValues === undefined) {
                this.triangleSkinValues = null;
            }
            if (this.vectorSkin === undefined) {
                this.vectorSkin = null;
            }
            if (this.triangleSkin === undefined) {
                this.triangleSkin = null;
            }
            if (this.aClass40Array1681 === undefined) {
                this.aClass40Array1681 = null;
            }
            this.anInt1636 = 932;
            this.anInt1637 = 426;
            this.aBoolean1638 = false;
            this.aBoolean1639 = true;
            this.anInt1640 = -252;
            this.aBoolean1641 = false;
            this.oneSquareModel = false;
            if (this.vertexCount === undefined) {
                this.vertexCount = 0;
            }
            if (this.verticesX === undefined) {
                this.verticesX = null;
            }
            if (this.verticesY === undefined) {
                this.verticesY = null;
            }
            if (this.verticesZ === undefined) {
                this.verticesZ = null;
            }
            if (this.triangleCount === undefined) {
                this.triangleCount = 0;
            }
            if (this.trianglePointsX === undefined) {
                this.trianglePointsX = null;
            }
            if (this.trianglePointsY === undefined) {
                this.trianglePointsY = null;
            }
            if (this.trianglePointsZ === undefined) {
                this.trianglePointsZ = null;
            }
            if (this.anIntArray1656 === undefined) {
                this.anIntArray1656 = null;
            }
            if (this.anIntArray1657 === undefined) {
                this.anIntArray1657 = null;
            }
            if (this.anIntArray1658 === undefined) {
                this.anIntArray1658 = null;
            }
            if (this.texturePoints === undefined) {
                this.texturePoints = null;
            }
            if (this.trianglePriorities === undefined) {
                this.trianglePriorities = null;
            }
            if (this.triangleAlphaValues === undefined) {
                this.triangleAlphaValues = null;
            }
            if (this.triangleColorValues === undefined) {
                this.triangleColorValues = null;
            }
            if (this.anInt1663 === undefined) {
                this.anInt1663 = 0;
            }
            if (this.texturedTriangleCount === undefined) {
                this.texturedTriangleCount = 0;
            }
            if (this.texturedTrianglePointsX === undefined) {
                this.texturedTrianglePointsX = null;
            }
            if (this.texturedTrianglePointsY === undefined) {
                this.texturedTrianglePointsY = null;
            }
            if (this.texturedTrianglePointsZ === undefined) {
                this.texturedTrianglePointsZ = null;
            }
            if (this.anInt1668 === undefined) {
                this.anInt1668 = 0;
            }
            if (this.anInt1669 === undefined) {
                this.anInt1669 = 0;
            }
            if (this.anInt1670 === undefined) {
                this.anInt1670 = 0;
            }
            if (this.shadowIntensity === undefined) {
                this.shadowIntensity = 0;
            }
            if (this.maxY === undefined) {
                this.maxY = 0;
            }
            if (this.anInt1673 === undefined) {
                this.anInt1673 = 0;
            }
            if (this.anInt1674 === undefined) {
                this.anInt1674 = 0;
            }
            if (this.anInt1675 === undefined) {
                this.anInt1675 = 0;
            }
            if (this.vertexSkins === undefined) {
                this.vertexSkins = null;
            }
            if (this.triangleSkinValues === undefined) {
                this.triangleSkinValues = null;
            }
            if (this.vectorSkin === undefined) {
                this.vectorSkin = null;
            }
            if (this.triangleSkin === undefined) {
                this.triangleSkin = null;
            }
            if (this.aClass40Array1681 === undefined) {
                this.aClass40Array1681 = null;
            }
            (() => {
                this.aBoolean1638 = false;
                this.aBoolean1639 = true;
                this.anInt1640 = -252;
                Model.anInt1642;
                Model.anInt1642++;
                let flag1: boolean = false;
                let flag2: boolean = false;
                let flag3: boolean = false;
                let flag4: boolean = false;
                this.vertexCount = 0;
                this.triangleCount = 0;
                this.texturedTriangleCount = 0;
                this.anInt1663 = -1;
                for (let k: number = 0; k < i; k++) {
                    {
                        const class50_sub1_sub4_sub4: Model = models[k];
                        if (class50_sub1_sub4_sub4 != null) {
                            this.vertexCount += class50_sub1_sub4_sub4.vertexCount;
                            this.triangleCount += class50_sub1_sub4_sub4.triangleCount;
                            this.texturedTriangleCount += class50_sub1_sub4_sub4.texturedTriangleCount;
                            flag1 = class50_sub1_sub4_sub4.texturePoints != null || flag1;
                            if (class50_sub1_sub4_sub4.trianglePriorities != null) {
                                flag2 = true;
                            } else {
                                if (this.anInt1663 === -1) {
                                    this.anInt1663 = class50_sub1_sub4_sub4.anInt1663;
                                }
                                if (this.anInt1663 !== class50_sub1_sub4_sub4.anInt1663) {
                                    flag2 = true;
                                }
                            }
                            flag3 = class50_sub1_sub4_sub4.triangleAlphaValues != null || flag3;
                            flag4 = class50_sub1_sub4_sub4.triangleColorValues != null || flag4;
                        }
                    }
                }
                this.verticesX = (s => {
                    const a = [];
                    while (s-- > 0) {
                        a.push(0);
                    }
                    return a;
                })(this.vertexCount);
                this.verticesY = (s => {
                    const a = [];
                    while (s-- > 0) {
                        a.push(0);
                    }
                    return a;
                })(this.vertexCount);
                this.verticesZ = (s => {
                    const a = [];
                    while (s-- > 0) {
                        a.push(0);
                    }
                    return a;
                })(this.vertexCount);
                this.trianglePointsX = (s => {
                    const a = [];
                    while (s-- > 0) {
                        a.push(0);
                    }
                    return a;
                })(this.triangleCount);
                this.trianglePointsY = (s => {
                    const a = [];
                    while (s-- > 0) {
                        a.push(0);
                    }
                    return a;
                })(this.triangleCount);
                this.trianglePointsZ = (s => {
                    const a = [];
                    while (s-- > 0) {
                        a.push(0);
                    }
                    return a;
                })(this.triangleCount);
                this.anIntArray1656 = (s => {
                    const a = [];
                    while (s-- > 0) {
                        a.push(0);
                    }
                    return a;
                })(this.triangleCount);
                this.anIntArray1657 = (s => {
                    const a = [];
                    while (s-- > 0) {
                        a.push(0);
                    }
                    return a;
                })(this.triangleCount);
                this.anIntArray1658 = (s => {
                    const a = [];
                    while (s-- > 0) {
                        a.push(0);
                    }
                    return a;
                })(this.triangleCount);
                this.texturedTrianglePointsX = (s => {
                    const a = [];
                    while (s-- > 0) {
                        a.push(0);
                    }
                    return a;
                })(this.texturedTriangleCount);
                this.texturedTrianglePointsY = (s => {
                    const a = [];
                    while (s-- > 0) {
                        a.push(0);
                    }
                    return a;
                })(this.texturedTriangleCount);
                this.texturedTrianglePointsZ = (s => {
                    const a = [];
                    while (s-- > 0) {
                        a.push(0);
                    }
                    return a;
                })(this.texturedTriangleCount);
                if (flag1) {
                    this.texturePoints = (s => {
                        const a = [];
                        while (s-- > 0) {
                            a.push(0);
                        }
                        return a;
                    })(this.triangleCount);
                }
                if (flag2) {
                    this.trianglePriorities = (s => {
                        const a = [];
                        while (s-- > 0) {
                            a.push(0);
                        }
                        return a;
                    })(this.triangleCount);
                }
                if (flag3) {
                    this.triangleAlphaValues = (s => {
                        const a = [];
                        while (s-- > 0) {
                            a.push(0);
                        }
                        return a;
                    })(this.triangleCount);
                }
                if (flag4) {
                    this.triangleColorValues = (s => {
                        const a = [];
                        while (s-- > 0) {
                            a.push(0);
                        }
                        return a;
                    })(this.triangleCount);
                }
                this.vertexCount = 0;
                if (j !== 0) {
                    throw Error("NullPointerException");
                }
                this.triangleCount = 0;
                this.texturedTriangleCount = 0;
                let l: number = 0;
                for (let i1: number = 0; i1 < i; i1++) {
                    {
                        const class50_sub1_sub4_sub4_1: Model = models[i1];
                        if (class50_sub1_sub4_sub4_1 != null) {
                            const j1: number = this.vertexCount;
                            for (let k1: number = 0; k1 < class50_sub1_sub4_sub4_1.vertexCount; k1++) {
                                {
                                    this.verticesX[this.vertexCount] = class50_sub1_sub4_sub4_1.verticesX[k1];
                                    this.verticesY[this.vertexCount] = class50_sub1_sub4_sub4_1.verticesY[k1];
                                    this.verticesZ[this.vertexCount] = class50_sub1_sub4_sub4_1.verticesZ[k1];
                                    this.vertexCount++;
                                }
                            }
                            for (let l1: number = 0; l1 < class50_sub1_sub4_sub4_1.triangleCount; l1++) {
                                {
                                    this.trianglePointsX[this.triangleCount] = class50_sub1_sub4_sub4_1.trianglePointsX[l1] + j1;
                                    this.trianglePointsY[this.triangleCount] = class50_sub1_sub4_sub4_1.trianglePointsY[l1] + j1;
                                    this.trianglePointsZ[this.triangleCount] = class50_sub1_sub4_sub4_1.trianglePointsZ[l1] + j1;
                                    this.anIntArray1656[this.triangleCount] = class50_sub1_sub4_sub4_1.anIntArray1656[l1];
                                    this.anIntArray1657[this.triangleCount] = class50_sub1_sub4_sub4_1.anIntArray1657[l1];
                                    this.anIntArray1658[this.triangleCount] = class50_sub1_sub4_sub4_1.anIntArray1658[l1];
                                    if (flag1) {
                                        if (class50_sub1_sub4_sub4_1.texturePoints == null) {
                                            this.texturePoints[this.triangleCount] = 0;
                                        } else {
                                            let i2: number = class50_sub1_sub4_sub4_1.texturePoints[l1];
                                            if ((i2 & 2) === 2) {
                                                i2 += l << 2;
                                            }
                                            this.texturePoints[this.triangleCount] = i2;
                                        }
                                    }
                                    if (flag2) {
                                        if (class50_sub1_sub4_sub4_1.trianglePriorities == null) {
                                            this.trianglePriorities[this.triangleCount] = class50_sub1_sub4_sub4_1.anInt1663;
                                        } else {
                                            this.trianglePriorities[this.triangleCount] = class50_sub1_sub4_sub4_1.trianglePriorities[l1];
                                        }
                                    }
                                    if (flag3) {
                                        if (class50_sub1_sub4_sub4_1.triangleAlphaValues == null) {
                                            this.triangleAlphaValues[this.triangleCount] = 0;
                                        } else {
                                            this.triangleAlphaValues[this.triangleCount] = class50_sub1_sub4_sub4_1.triangleAlphaValues[l1];
                                        }
                                    }
                                    if (flag4 && class50_sub1_sub4_sub4_1.triangleColorValues != null) {
                                        this.triangleColorValues[this.triangleCount] = class50_sub1_sub4_sub4_1.triangleColorValues[l1];
                                    }
                                    this.triangleCount++;
                                }
                            }
                            for (let j2: number = 0; j2 < class50_sub1_sub4_sub4_1.texturedTriangleCount; j2++) {
                                {
                                    this.texturedTrianglePointsX[this.texturedTriangleCount] =
                                        class50_sub1_sub4_sub4_1.texturedTrianglePointsX[j2] + j1;
                                    this.texturedTrianglePointsY[this.texturedTriangleCount] =
                                        class50_sub1_sub4_sub4_1.texturedTrianglePointsY[j2] + j1;
                                    this.texturedTrianglePointsZ[this.texturedTriangleCount] =
                                        class50_sub1_sub4_sub4_1.texturedTrianglePointsZ[j2] + j1;
                                    this.texturedTriangleCount++;
                                }
                            }
                            l += class50_sub1_sub4_sub4_1.texturedTriangleCount;
                        }
                    }
                }
                this.calculateDiagonals();
            })();
        } else if (
            (typeof flag === "number" || flag === null) &&
            ((flag1 != null &&
                ((flag1 instanceof Array) as any) &&
                (flag1.length == 0 || flag1[0] == null || (flag1[0] != null && ((flag1[0] instanceof Model) as any)))) ||
                flag1 === null) &&
            i === undefined &&
            class50_sub1_sub4_sub4 === undefined
        ) {
            const __args = arguments;
            const i: any = __args[0];
            const subModels: any = __args[1];
            super();
            if (this.vertexCount === undefined) {
                this.vertexCount = 0;
            }
            if (this.verticesX === undefined) {
                this.verticesX = null;
            }
            if (this.verticesY === undefined) {
                this.verticesY = null;
            }
            if (this.verticesZ === undefined) {
                this.verticesZ = null;
            }
            if (this.triangleCount === undefined) {
                this.triangleCount = 0;
            }
            if (this.trianglePointsX === undefined) {
                this.trianglePointsX = null;
            }
            if (this.trianglePointsY === undefined) {
                this.trianglePointsY = null;
            }
            if (this.trianglePointsZ === undefined) {
                this.trianglePointsZ = null;
            }
            if (this.anIntArray1656 === undefined) {
                this.anIntArray1656 = null;
            }
            if (this.anIntArray1657 === undefined) {
                this.anIntArray1657 = null;
            }
            if (this.anIntArray1658 === undefined) {
                this.anIntArray1658 = null;
            }
            if (this.texturePoints === undefined) {
                this.texturePoints = null;
            }
            if (this.trianglePriorities === undefined) {
                this.trianglePriorities = null;
            }
            if (this.triangleAlphaValues === undefined) {
                this.triangleAlphaValues = null;
            }
            if (this.triangleColorValues === undefined) {
                this.triangleColorValues = null;
            }
            if (this.anInt1663 === undefined) {
                this.anInt1663 = 0;
            }
            if (this.texturedTriangleCount === undefined) {
                this.texturedTriangleCount = 0;
            }
            if (this.texturedTrianglePointsX === undefined) {
                this.texturedTrianglePointsX = null;
            }
            if (this.texturedTrianglePointsY === undefined) {
                this.texturedTrianglePointsY = null;
            }
            if (this.texturedTrianglePointsZ === undefined) {
                this.texturedTrianglePointsZ = null;
            }
            if (this.anInt1668 === undefined) {
                this.anInt1668 = 0;
            }
            if (this.anInt1669 === undefined) {
                this.anInt1669 = 0;
            }
            if (this.anInt1670 === undefined) {
                this.anInt1670 = 0;
            }
            if (this.shadowIntensity === undefined) {
                this.shadowIntensity = 0;
            }
            if (this.maxY === undefined) {
                this.maxY = 0;
            }
            if (this.anInt1673 === undefined) {
                this.anInt1673 = 0;
            }
            if (this.anInt1674 === undefined) {
                this.anInt1674 = 0;
            }
            if (this.anInt1675 === undefined) {
                this.anInt1675 = 0;
            }
            if (this.vertexSkins === undefined) {
                this.vertexSkins = null;
            }
            if (this.triangleSkinValues === undefined) {
                this.triangleSkinValues = null;
            }
            if (this.vectorSkin === undefined) {
                this.vectorSkin = null;
            }
            if (this.triangleSkin === undefined) {
                this.triangleSkin = null;
            }
            if (this.aClass40Array1681 === undefined) {
                this.aClass40Array1681 = null;
            }
            this.anInt1636 = 932;
            this.anInt1637 = 426;
            this.aBoolean1638 = false;
            this.aBoolean1639 = true;
            this.anInt1640 = -252;
            this.aBoolean1641 = false;
            this.oneSquareModel = false;
            if (this.vertexCount === undefined) {
                this.vertexCount = 0;
            }
            if (this.verticesX === undefined) {
                this.verticesX = null;
            }
            if (this.verticesY === undefined) {
                this.verticesY = null;
            }
            if (this.verticesZ === undefined) {
                this.verticesZ = null;
            }
            if (this.triangleCount === undefined) {
                this.triangleCount = 0;
            }
            if (this.trianglePointsX === undefined) {
                this.trianglePointsX = null;
            }
            if (this.trianglePointsY === undefined) {
                this.trianglePointsY = null;
            }
            if (this.trianglePointsZ === undefined) {
                this.trianglePointsZ = null;
            }
            if (this.anIntArray1656 === undefined) {
                this.anIntArray1656 = null;
            }
            if (this.anIntArray1657 === undefined) {
                this.anIntArray1657 = null;
            }
            if (this.anIntArray1658 === undefined) {
                this.anIntArray1658 = null;
            }
            if (this.texturePoints === undefined) {
                this.texturePoints = null;
            }
            if (this.trianglePriorities === undefined) {
                this.trianglePriorities = null;
            }
            if (this.triangleAlphaValues === undefined) {
                this.triangleAlphaValues = null;
            }
            if (this.triangleColorValues === undefined) {
                this.triangleColorValues = null;
            }
            if (this.anInt1663 === undefined) {
                this.anInt1663 = 0;
            }
            if (this.texturedTriangleCount === undefined) {
                this.texturedTriangleCount = 0;
            }
            if (this.texturedTrianglePointsX === undefined) {
                this.texturedTrianglePointsX = null;
            }
            if (this.texturedTrianglePointsY === undefined) {
                this.texturedTrianglePointsY = null;
            }
            if (this.texturedTrianglePointsZ === undefined) {
                this.texturedTrianglePointsZ = null;
            }
            if (this.anInt1668 === undefined) {
                this.anInt1668 = 0;
            }
            if (this.anInt1669 === undefined) {
                this.anInt1669 = 0;
            }
            if (this.anInt1670 === undefined) {
                this.anInt1670 = 0;
            }
            if (this.shadowIntensity === undefined) {
                this.shadowIntensity = 0;
            }
            if (this.maxY === undefined) {
                this.maxY = 0;
            }
            if (this.anInt1673 === undefined) {
                this.anInt1673 = 0;
            }
            if (this.anInt1674 === undefined) {
                this.anInt1674 = 0;
            }
            if (this.anInt1675 === undefined) {
                this.anInt1675 = 0;
            }
            if (this.vertexSkins === undefined) {
                this.vertexSkins = null;
            }
            if (this.triangleSkinValues === undefined) {
                this.triangleSkinValues = null;
            }
            if (this.vectorSkin === undefined) {
                this.vectorSkin = null;
            }
            if (this.triangleSkin === undefined) {
                this.triangleSkin = null;
            }
            if (this.aClass40Array1681 === undefined) {
                this.aClass40Array1681 = null;
            }
            (() => {
                this.aBoolean1638 = false;
                this.aBoolean1639 = true;
                this.anInt1640 = -252;
                Model.anInt1642;
                Model.anInt1642++;
                let flag: boolean = false;
                let flag1: boolean = false;
                let flag2: boolean = false;
                let flag3: boolean = false;
                this.vertexCount = 0;
                this.triangleCount = 0;
                this.texturedTriangleCount = 0;
                this.anInt1663 = -1;
                for (let j: number = 0; j < i; j++) {
                    {
                        const class50_sub1_sub4_sub4: Model = subModels[j];
                        if (class50_sub1_sub4_sub4 != null) {
                            this.vertexCount += class50_sub1_sub4_sub4.vertexCount;
                            this.triangleCount += class50_sub1_sub4_sub4.triangleCount;
                            this.texturedTriangleCount += class50_sub1_sub4_sub4.texturedTriangleCount;
                            flag = class50_sub1_sub4_sub4.texturePoints != null || flag;
                            if (class50_sub1_sub4_sub4.trianglePriorities != null) {
                                flag1 = true;
                            } else {
                                if (this.anInt1663 === -1) {
                                    this.anInt1663 = class50_sub1_sub4_sub4.anInt1663;
                                }
                                if (this.anInt1663 !== class50_sub1_sub4_sub4.anInt1663) {
                                    flag1 = true;
                                }
                            }
                            flag2 = class50_sub1_sub4_sub4.triangleAlphaValues != null || flag2;
                            flag3 = class50_sub1_sub4_sub4.triangleSkinValues != null || flag3;
                        }
                    }
                }
                this.verticesX = (s => {
                    const a = [];
                    while (s-- > 0) {
                        a.push(0);
                    }
                    return a;
                })(this.vertexCount);
                this.verticesY = (s => {
                    const a = [];
                    while (s-- > 0) {
                        a.push(0);
                    }
                    return a;
                })(this.vertexCount);
                this.verticesZ = (s => {
                    const a = [];
                    while (s-- > 0) {
                        a.push(0);
                    }
                    return a;
                })(this.vertexCount);
                this.vertexSkins = (s => {
                    const a = [];
                    while (s-- > 0) {
                        a.push(0);
                    }
                    return a;
                })(this.vertexCount);
                this.trianglePointsX = (s => {
                    const a = [];
                    while (s-- > 0) {
                        a.push(0);
                    }
                    return a;
                })(this.triangleCount);
                this.trianglePointsY = (s => {
                    const a = [];
                    while (s-- > 0) {
                        a.push(0);
                    }
                    return a;
                })(this.triangleCount);
                this.trianglePointsZ = (s => {
                    const a = [];
                    while (s-- > 0) {
                        a.push(0);
                    }
                    return a;
                })(this.triangleCount);
                this.texturedTrianglePointsX = (s => {
                    const a = [];
                    while (s-- > 0) {
                        a.push(0);
                    }
                    return a;
                })(this.texturedTriangleCount);
                this.texturedTrianglePointsY = (s => {
                    const a = [];
                    while (s-- > 0) {
                        a.push(0);
                    }
                    return a;
                })(this.texturedTriangleCount);
                this.texturedTrianglePointsZ = (s => {
                    const a = [];
                    while (s-- > 0) {
                        a.push(0);
                    }
                    return a;
                })(this.texturedTriangleCount);
                if (flag) {
                    this.texturePoints = (s => {
                        const a = [];
                        while (s-- > 0) {
                            a.push(0);
                        }
                        return a;
                    })(this.triangleCount);
                }
                if (flag1) {
                    this.trianglePriorities = (s => {
                        const a = [];
                        while (s-- > 0) {
                            a.push(0);
                        }
                        return a;
                    })(this.triangleCount);
                }
                if (flag2) {
                    this.triangleAlphaValues = (s => {
                        const a = [];
                        while (s-- > 0) {
                            a.push(0);
                        }
                        return a;
                    })(this.triangleCount);
                }
                if (flag3) {
                    this.triangleSkinValues = (s => {
                        const a = [];
                        while (s-- > 0) {
                            a.push(0);
                        }
                        return a;
                    })(this.triangleCount);
                }
                this.triangleColorValues = (s => {
                    const a = [];
                    while (s-- > 0) {
                        a.push(0);
                    }
                    return a;
                })(this.triangleCount);
                this.vertexCount = 0;
                this.triangleCount = 0;
                this.texturedTriangleCount = 0;
                let k: number = 0;
                for (let l: number = 0; l < i; l++) {
                    {
                        const model_44_: Model = subModels[l];
                        if (model_44_ != null) {
                            for (let i1: number = 0; i1 < model_44_.triangleCount; i1++) {
                                {
                                    if (flag) {
                                        if (model_44_.texturePoints == null) {
                                            this.texturePoints[this.triangleCount] = 0;
                                        } else {
                                            let j1: number = model_44_.texturePoints[i1];
                                            if ((j1 & 2) === 2) {
                                                j1 += k << 2;
                                            }
                                            this.texturePoints[this.triangleCount] = j1;
                                        }
                                    }
                                    if (flag1) {
                                        if (model_44_.trianglePriorities == null) {
                                            this.trianglePriorities[this.triangleCount] = model_44_.anInt1663;
                                        } else {
                                            this.trianglePriorities[this.triangleCount] = model_44_.trianglePriorities[i1];
                                        }
                                    }
                                    if (flag2) {
                                        if (model_44_.triangleAlphaValues == null) {
                                            this.triangleAlphaValues[this.triangleCount] = 0;
                                        } else {
                                            this.triangleAlphaValues[this.triangleCount] = model_44_.triangleAlphaValues[i1];
                                        }
                                    }
                                    if (flag3 && model_44_.triangleSkinValues != null) {
                                        this.triangleSkinValues[this.triangleCount] = model_44_.triangleSkinValues[i1];
                                    }
                                    this.triangleColorValues[this.triangleCount] = model_44_.triangleColorValues[i1];
                                    this.trianglePointsX[this.triangleCount] = this.getFirstIdenticalVertexIndex(
                                        model_44_,
                                        model_44_.trianglePointsX[i1]
                                    );
                                    this.trianglePointsY[this.triangleCount] = this.getFirstIdenticalVertexIndex(
                                        model_44_,
                                        model_44_.trianglePointsY[i1]
                                    );
                                    this.trianglePointsZ[this.triangleCount] = this.getFirstIdenticalVertexIndex(
                                        model_44_,
                                        model_44_.trianglePointsZ[i1]
                                    );
                                    this.triangleCount++;
                                }
                            }
                            for (let k1: number = 0; k1 < model_44_.texturedTriangleCount; k1++) {
                                {
                                    this.texturedTrianglePointsX[this.texturedTriangleCount] = this.getFirstIdenticalVertexIndex(
                                        model_44_,
                                        model_44_.texturedTrianglePointsX[k1]
                                    );
                                    this.texturedTrianglePointsY[this.texturedTriangleCount] = this.getFirstIdenticalVertexIndex(
                                        model_44_,
                                        model_44_.texturedTrianglePointsY[k1]
                                    );
                                    this.texturedTrianglePointsZ[this.texturedTriangleCount] = this.getFirstIdenticalVertexIndex(
                                        model_44_,
                                        model_44_.texturedTrianglePointsZ[k1]
                                    );
                                    this.texturedTriangleCount++;
                                }
                            }
                            k += model_44_.texturedTriangleCount;
                        }
                    }
                }
            })();
        } else if (
            (typeof flag === "number" || flag === null) &&
            flag1 === undefined &&
            i === undefined &&
            class50_sub1_sub4_sub4 === undefined
        ) {
            const __args = arguments;
            const modelId: any = __args[0];
            super();
            if (this.vertexCount === undefined) {
                this.vertexCount = 0;
            }
            if (this.verticesX === undefined) {
                this.verticesX = null;
            }
            if (this.verticesY === undefined) {
                this.verticesY = null;
            }
            if (this.verticesZ === undefined) {
                this.verticesZ = null;
            }
            if (this.triangleCount === undefined) {
                this.triangleCount = 0;
            }
            if (this.trianglePointsX === undefined) {
                this.trianglePointsX = null;
            }
            if (this.trianglePointsY === undefined) {
                this.trianglePointsY = null;
            }
            if (this.trianglePointsZ === undefined) {
                this.trianglePointsZ = null;
            }
            if (this.anIntArray1656 === undefined) {
                this.anIntArray1656 = null;
            }
            if (this.anIntArray1657 === undefined) {
                this.anIntArray1657 = null;
            }
            if (this.anIntArray1658 === undefined) {
                this.anIntArray1658 = null;
            }
            if (this.texturePoints === undefined) {
                this.texturePoints = null;
            }
            if (this.trianglePriorities === undefined) {
                this.trianglePriorities = null;
            }
            if (this.triangleAlphaValues === undefined) {
                this.triangleAlphaValues = null;
            }
            if (this.triangleColorValues === undefined) {
                this.triangleColorValues = null;
            }
            if (this.anInt1663 === undefined) {
                this.anInt1663 = 0;
            }
            if (this.texturedTriangleCount === undefined) {
                this.texturedTriangleCount = 0;
            }
            if (this.texturedTrianglePointsX === undefined) {
                this.texturedTrianglePointsX = null;
            }
            if (this.texturedTrianglePointsY === undefined) {
                this.texturedTrianglePointsY = null;
            }
            if (this.texturedTrianglePointsZ === undefined) {
                this.texturedTrianglePointsZ = null;
            }
            if (this.anInt1668 === undefined) {
                this.anInt1668 = 0;
            }
            if (this.anInt1669 === undefined) {
                this.anInt1669 = 0;
            }
            if (this.anInt1670 === undefined) {
                this.anInt1670 = 0;
            }
            if (this.shadowIntensity === undefined) {
                this.shadowIntensity = 0;
            }
            if (this.maxY === undefined) {
                this.maxY = 0;
            }
            if (this.anInt1673 === undefined) {
                this.anInt1673 = 0;
            }
            if (this.anInt1674 === undefined) {
                this.anInt1674 = 0;
            }
            if (this.anInt1675 === undefined) {
                this.anInt1675 = 0;
            }
            if (this.vertexSkins === undefined) {
                this.vertexSkins = null;
            }
            if (this.triangleSkinValues === undefined) {
                this.triangleSkinValues = null;
            }
            if (this.vectorSkin === undefined) {
                this.vectorSkin = null;
            }
            if (this.triangleSkin === undefined) {
                this.triangleSkin = null;
            }
            if (this.aClass40Array1681 === undefined) {
                this.aClass40Array1681 = null;
            }
            this.anInt1636 = 932;
            this.anInt1637 = 426;
            this.aBoolean1638 = false;
            this.aBoolean1639 = true;
            this.anInt1640 = -252;
            this.aBoolean1641 = false;
            this.oneSquareModel = false;
            if (this.vertexCount === undefined) {
                this.vertexCount = 0;
            }
            if (this.verticesX === undefined) {
                this.verticesX = null;
            }
            if (this.verticesY === undefined) {
                this.verticesY = null;
            }
            if (this.verticesZ === undefined) {
                this.verticesZ = null;
            }
            if (this.triangleCount === undefined) {
                this.triangleCount = 0;
            }
            if (this.trianglePointsX === undefined) {
                this.trianglePointsX = null;
            }
            if (this.trianglePointsY === undefined) {
                this.trianglePointsY = null;
            }
            if (this.trianglePointsZ === undefined) {
                this.trianglePointsZ = null;
            }
            if (this.anIntArray1656 === undefined) {
                this.anIntArray1656 = null;
            }
            if (this.anIntArray1657 === undefined) {
                this.anIntArray1657 = null;
            }
            if (this.anIntArray1658 === undefined) {
                this.anIntArray1658 = null;
            }
            if (this.texturePoints === undefined) {
                this.texturePoints = null;
            }
            if (this.trianglePriorities === undefined) {
                this.trianglePriorities = null;
            }
            if (this.triangleAlphaValues === undefined) {
                this.triangleAlphaValues = null;
            }
            if (this.triangleColorValues === undefined) {
                this.triangleColorValues = null;
            }
            if (this.anInt1663 === undefined) {
                this.anInt1663 = 0;
            }
            if (this.texturedTriangleCount === undefined) {
                this.texturedTriangleCount = 0;
            }
            if (this.texturedTrianglePointsX === undefined) {
                this.texturedTrianglePointsX = null;
            }
            if (this.texturedTrianglePointsY === undefined) {
                this.texturedTrianglePointsY = null;
            }
            if (this.texturedTrianglePointsZ === undefined) {
                this.texturedTrianglePointsZ = null;
            }
            if (this.anInt1668 === undefined) {
                this.anInt1668 = 0;
            }
            if (this.anInt1669 === undefined) {
                this.anInt1669 = 0;
            }
            if (this.anInt1670 === undefined) {
                this.anInt1670 = 0;
            }
            if (this.shadowIntensity === undefined) {
                this.shadowIntensity = 0;
            }
            if (this.maxY === undefined) {
                this.maxY = 0;
            }
            if (this.anInt1673 === undefined) {
                this.anInt1673 = 0;
            }
            if (this.anInt1674 === undefined) {
                this.anInt1674 = 0;
            }
            if (this.anInt1675 === undefined) {
                this.anInt1675 = 0;
            }
            if (this.vertexSkins === undefined) {
                this.vertexSkins = null;
            }
            if (this.triangleSkinValues === undefined) {
                this.triangleSkinValues = null;
            }
            if (this.vectorSkin === undefined) {
                this.vectorSkin = null;
            }
            if (this.triangleSkin === undefined) {
                this.triangleSkin = null;
            }
            if (this.aClass40Array1681 === undefined) {
                this.aClass40Array1681 = null;
            }
            (() => {
                this.aBoolean1638 = false;
                this.aBoolean1639 = true;
                this.anInt1640 = -252;
                Model.anInt1642;
                Model.anInt1642++;
                const modelHeader: ModelHeader = Model.modelHeaders[modelId];
                this.vertexCount = modelHeader.vertexCount;
                this.triangleCount = modelHeader.triangleCount;
                this.texturedTriangleCount = modelHeader.texturedTriangleCount;
                this.verticesX = (s => {
                    const a = [];
                    while (s-- > 0) {
                        a.push(0);
                    }
                    return a;
                })(this.vertexCount);
                this.verticesY = (s => {
                    const a = [];
                    while (s-- > 0) {
                        a.push(0);
                    }
                    return a;
                })(this.vertexCount);
                this.verticesZ = (s => {
                    const a = [];
                    while (s-- > 0) {
                        a.push(0);
                    }
                    return a;
                })(this.vertexCount);
                this.trianglePointsX = (s => {
                    const a = [];
                    while (s-- > 0) {
                        a.push(0);
                    }
                    return a;
                })(this.triangleCount);
                this.trianglePointsY = (s => {
                    const a = [];
                    while (s-- > 0) {
                        a.push(0);
                    }
                    return a;
                })(this.triangleCount);
                this.trianglePointsZ = (s => {
                    const a = [];
                    while (s-- > 0) {
                        a.push(0);
                    }
                    return a;
                })(this.triangleCount);
                this.texturedTrianglePointsX = (s => {
                    const a = [];
                    while (s-- > 0) {
                        a.push(0);
                    }
                    return a;
                })(this.texturedTriangleCount);
                this.texturedTrianglePointsY = (s => {
                    const a = [];
                    while (s-- > 0) {
                        a.push(0);
                    }
                    return a;
                })(this.texturedTriangleCount);
                this.texturedTrianglePointsZ = (s => {
                    const a = [];
                    while (s-- > 0) {
                        a.push(0);
                    }
                    return a;
                })(this.texturedTriangleCount);
                if (modelHeader.vertexSkinOffset >= 0) {
                    this.vertexSkins = (s => {
                        const a = [];
                        while (s-- > 0) {
                            a.push(0);
                        }
                        return a;
                    })(this.vertexCount);
                }
                if (modelHeader.texturePointerOffset >= 0) {
                    this.texturePoints = (s => {
                        const a = [];
                        while (s-- > 0) {
                            a.push(0);
                        }
                        return a;
                    })(this.triangleCount);
                }
                if (modelHeader.trianglePriorityOffset >= 0) {
                    this.trianglePriorities = (s => {
                        const a = [];
                        while (s-- > 0) {
                            a.push(0);
                        }
                        return a;
                    })(this.triangleCount);
                } else {
                    this.anInt1663 = -modelHeader.trianglePriorityOffset - 1;
                }
                if (modelHeader.triangleAlphaOffset >= 0) {
                    this.triangleAlphaValues = (s => {
                        const a = [];
                        while (s-- > 0) {
                            a.push(0);
                        }
                        return a;
                    })(this.triangleCount);
                }
                if (modelHeader.triangleSkinOffset >= 0) {
                    this.triangleSkinValues = (s => {
                        const a = [];
                        while (s-- > 0) {
                            a.push(0);
                        }
                        return a;
                    })(this.triangleCount);
                }
                this.triangleColorValues = (s => {
                    const a = [];
                    while (s-- > 0) {
                        a.push(0);
                    }
                    return a;
                })(this.triangleCount);
                const vertexDirectionOffsetBuffer: Buffer = new Buffer(modelHeader.modelData);
                vertexDirectionOffsetBuffer.currentPosition = modelHeader.vertexDirectionOffset;
                const xDataOffsetBuffer: Buffer = new Buffer(modelHeader.modelData);
                xDataOffsetBuffer.currentPosition = modelHeader.xDataOffset;
                const yDataOffsetBuffer: Buffer = new Buffer(modelHeader.modelData);
                yDataOffsetBuffer.currentPosition = modelHeader.yDataOffset;
                const zDataOffsetBuffer: Buffer = new Buffer(modelHeader.modelData);
                zDataOffsetBuffer.currentPosition = modelHeader.zDataOffset;
                const vertexSkinOffsetBuffer: Buffer = new Buffer(modelHeader.modelData);
                vertexSkinOffsetBuffer.currentPosition = modelHeader.vertexSkinOffset;
                let baseOffsetX: number = 0;
                let baseOffsetY: number = 0;
                let baseOffsetz: number = 0;
                for (let vertex: number = 0; vertex < this.vertexCount; vertex++) {
                    {
                        const flag: number = vertexDirectionOffsetBuffer.getUnsignedByte();
                        let currentOffsetX: number = 0;
                        if ((flag & 1) !== 0) {
                            currentOffsetX = xDataOffsetBuffer.getSignedSmart();
                        }
                        let currentOffsetY: number = 0;
                        if ((flag & 2) !== 0) {
                            currentOffsetY = yDataOffsetBuffer.getSignedSmart();
                        }
                        let currentOffsetZ: number = 0;
                        if ((flag & 4) !== 0) {
                            currentOffsetZ = zDataOffsetBuffer.getSignedSmart();
                        }
                        this.verticesX[vertex] = baseOffsetX + currentOffsetX;
                        this.verticesY[vertex] = baseOffsetY + currentOffsetY;
                        this.verticesZ[vertex] = baseOffsetz + currentOffsetZ;
                        baseOffsetX = this.verticesX[vertex];
                        baseOffsetY = this.verticesY[vertex];
                        baseOffsetz = this.verticesZ[vertex];
                        if (this.vertexSkins != null) {
                            this.vertexSkins[vertex] = vertexSkinOffsetBuffer.getUnsignedByte();
                        }
                    }
                }
                vertexDirectionOffsetBuffer.currentPosition = modelHeader.colorDataOffset;
                xDataOffsetBuffer.currentPosition = modelHeader.texturePointerOffset;
                yDataOffsetBuffer.currentPosition = modelHeader.trianglePriorityOffset;
                zDataOffsetBuffer.currentPosition = modelHeader.triangleAlphaOffset;
                vertexSkinOffsetBuffer.currentPosition = modelHeader.triangleSkinOffset;
                for (let l1: number = 0; l1 < this.triangleCount; l1++) {
                    {
                        this.triangleColorValues[l1] = vertexDirectionOffsetBuffer.getUnsignedLEShort();
                        if (this.texturePoints != null) {
                            this.texturePoints[l1] = xDataOffsetBuffer.getUnsignedByte();
                        }
                        if (this.trianglePriorities != null) {
                            this.trianglePriorities[l1] = yDataOffsetBuffer.getUnsignedByte();
                        }
                        if (this.triangleAlphaValues != null) {
                            this.triangleAlphaValues[l1] = zDataOffsetBuffer.getUnsignedByte();
                        }
                        if (this.triangleSkinValues != null) {
                            this.triangleSkinValues[l1] = vertexSkinOffsetBuffer.getUnsignedByte();
                        }
                    }
                }
                vertexDirectionOffsetBuffer.currentPosition = modelHeader.triangleDataOffset;
                xDataOffsetBuffer.currentPosition = modelHeader.triangleTypeOffset;
                let trianglePointOffsetX: number = 0;
                let trianglePointOffsetY: number = 0;
                let trianglePointOffsetZ: number = 0;
                let offset: number = 0;
                for (let triangle: number = 0; triangle < this.triangleCount; triangle++) {
                    {
                        const type: number = xDataOffsetBuffer.getUnsignedByte();
                        if (type === 1) {
                            trianglePointOffsetX = vertexDirectionOffsetBuffer.getSignedSmart() + offset;
                            offset = trianglePointOffsetX;
                            trianglePointOffsetY = vertexDirectionOffsetBuffer.getSignedSmart() + offset;
                            offset = trianglePointOffsetY;
                            trianglePointOffsetZ = vertexDirectionOffsetBuffer.getSignedSmart() + offset;
                            offset = trianglePointOffsetZ;
                            this.trianglePointsX[triangle] = trianglePointOffsetX;
                            this.trianglePointsY[triangle] = trianglePointOffsetY;
                            this.trianglePointsZ[triangle] = trianglePointOffsetZ;
                        }
                        if (type === 2) {
                            trianglePointOffsetY = trianglePointOffsetZ;
                            trianglePointOffsetZ = vertexDirectionOffsetBuffer.getSignedSmart() + offset;
                            offset = trianglePointOffsetZ;
                            this.trianglePointsX[triangle] = trianglePointOffsetX;
                            this.trianglePointsY[triangle] = trianglePointOffsetY;
                            this.trianglePointsZ[triangle] = trianglePointOffsetZ;
                        }
                        if (type === 3) {
                            trianglePointOffsetX = trianglePointOffsetZ;
                            trianglePointOffsetZ = vertexDirectionOffsetBuffer.getSignedSmart() + offset;
                            offset = trianglePointOffsetZ;
                            this.trianglePointsX[triangle] = trianglePointOffsetX;
                            this.trianglePointsY[triangle] = trianglePointOffsetY;
                            this.trianglePointsZ[triangle] = trianglePointOffsetZ;
                        }
                        if (type === 4) {
                            const oldTrianglePointOffsetX: number = trianglePointOffsetX;
                            trianglePointOffsetX = trianglePointOffsetY;
                            trianglePointOffsetY = oldTrianglePointOffsetX;
                            trianglePointOffsetZ = vertexDirectionOffsetBuffer.getSignedSmart() + offset;
                            offset = trianglePointOffsetZ;
                            this.trianglePointsX[triangle] = trianglePointOffsetX;
                            this.trianglePointsY[triangle] = trianglePointOffsetY;
                            this.trianglePointsZ[triangle] = trianglePointOffsetZ;
                        }
                    }
                }
                vertexDirectionOffsetBuffer.currentPosition = modelHeader.uvMapTriangleOffset;
                for (let triangle: number = 0; triangle < this.texturedTriangleCount; triangle++) {
                    {
                        this.texturedTrianglePointsX[triangle] = vertexDirectionOffsetBuffer.getUnsignedLEShort();
                        this.texturedTrianglePointsY[triangle] = vertexDirectionOffsetBuffer.getUnsignedLEShort();
                        this.texturedTrianglePointsZ[triangle] = vertexDirectionOffsetBuffer.getUnsignedLEShort();
                    }
                }
            })();
        } else if (flag === undefined && flag1 === undefined && i === undefined && class50_sub1_sub4_sub4 === undefined) {
            const __args = arguments;
            super();
            if (this.vertexCount === undefined) {
                this.vertexCount = 0;
            }
            if (this.verticesX === undefined) {
                this.verticesX = null;
            }
            if (this.verticesY === undefined) {
                this.verticesY = null;
            }
            if (this.verticesZ === undefined) {
                this.verticesZ = null;
            }
            if (this.triangleCount === undefined) {
                this.triangleCount = 0;
            }
            if (this.trianglePointsX === undefined) {
                this.trianglePointsX = null;
            }
            if (this.trianglePointsY === undefined) {
                this.trianglePointsY = null;
            }
            if (this.trianglePointsZ === undefined) {
                this.trianglePointsZ = null;
            }
            if (this.anIntArray1656 === undefined) {
                this.anIntArray1656 = null;
            }
            if (this.anIntArray1657 === undefined) {
                this.anIntArray1657 = null;
            }
            if (this.anIntArray1658 === undefined) {
                this.anIntArray1658 = null;
            }
            if (this.texturePoints === undefined) {
                this.texturePoints = null;
            }
            if (this.trianglePriorities === undefined) {
                this.trianglePriorities = null;
            }
            if (this.triangleAlphaValues === undefined) {
                this.triangleAlphaValues = null;
            }
            if (this.triangleColorValues === undefined) {
                this.triangleColorValues = null;
            }
            if (this.anInt1663 === undefined) {
                this.anInt1663 = 0;
            }
            if (this.texturedTriangleCount === undefined) {
                this.texturedTriangleCount = 0;
            }
            if (this.texturedTrianglePointsX === undefined) {
                this.texturedTrianglePointsX = null;
            }
            if (this.texturedTrianglePointsY === undefined) {
                this.texturedTrianglePointsY = null;
            }
            if (this.texturedTrianglePointsZ === undefined) {
                this.texturedTrianglePointsZ = null;
            }
            if (this.anInt1668 === undefined) {
                this.anInt1668 = 0;
            }
            if (this.anInt1669 === undefined) {
                this.anInt1669 = 0;
            }
            if (this.anInt1670 === undefined) {
                this.anInt1670 = 0;
            }
            if (this.shadowIntensity === undefined) {
                this.shadowIntensity = 0;
            }
            if (this.maxY === undefined) {
                this.maxY = 0;
            }
            if (this.anInt1673 === undefined) {
                this.anInt1673 = 0;
            }
            if (this.anInt1674 === undefined) {
                this.anInt1674 = 0;
            }
            if (this.anInt1675 === undefined) {
                this.anInt1675 = 0;
            }
            if (this.vertexSkins === undefined) {
                this.vertexSkins = null;
            }
            if (this.triangleSkinValues === undefined) {
                this.triangleSkinValues = null;
            }
            if (this.vectorSkin === undefined) {
                this.vectorSkin = null;
            }
            if (this.triangleSkin === undefined) {
                this.triangleSkin = null;
            }
            if (this.aClass40Array1681 === undefined) {
                this.aClass40Array1681 = null;
            }
            this.anInt1636 = 932;
            this.anInt1637 = 426;
            this.aBoolean1638 = false;
            this.aBoolean1639 = true;
            this.anInt1640 = -252;
            this.aBoolean1641 = false;
            this.oneSquareModel = false;
            if (this.vertexCount === undefined) {
                this.vertexCount = 0;
            }
            if (this.verticesX === undefined) {
                this.verticesX = null;
            }
            if (this.verticesY === undefined) {
                this.verticesY = null;
            }
            if (this.verticesZ === undefined) {
                this.verticesZ = null;
            }
            if (this.triangleCount === undefined) {
                this.triangleCount = 0;
            }
            if (this.trianglePointsX === undefined) {
                this.trianglePointsX = null;
            }
            if (this.trianglePointsY === undefined) {
                this.trianglePointsY = null;
            }
            if (this.trianglePointsZ === undefined) {
                this.trianglePointsZ = null;
            }
            if (this.anIntArray1656 === undefined) {
                this.anIntArray1656 = null;
            }
            if (this.anIntArray1657 === undefined) {
                this.anIntArray1657 = null;
            }
            if (this.anIntArray1658 === undefined) {
                this.anIntArray1658 = null;
            }
            if (this.texturePoints === undefined) {
                this.texturePoints = null;
            }
            if (this.trianglePriorities === undefined) {
                this.trianglePriorities = null;
            }
            if (this.triangleAlphaValues === undefined) {
                this.triangleAlphaValues = null;
            }
            if (this.triangleColorValues === undefined) {
                this.triangleColorValues = null;
            }
            if (this.anInt1663 === undefined) {
                this.anInt1663 = 0;
            }
            if (this.texturedTriangleCount === undefined) {
                this.texturedTriangleCount = 0;
            }
            if (this.texturedTrianglePointsX === undefined) {
                this.texturedTrianglePointsX = null;
            }
            if (this.texturedTrianglePointsY === undefined) {
                this.texturedTrianglePointsY = null;
            }
            if (this.texturedTrianglePointsZ === undefined) {
                this.texturedTrianglePointsZ = null;
            }
            if (this.anInt1668 === undefined) {
                this.anInt1668 = 0;
            }
            if (this.anInt1669 === undefined) {
                this.anInt1669 = 0;
            }
            if (this.anInt1670 === undefined) {
                this.anInt1670 = 0;
            }
            if (this.shadowIntensity === undefined) {
                this.shadowIntensity = 0;
            }
            if (this.maxY === undefined) {
                this.maxY = 0;
            }
            if (this.anInt1673 === undefined) {
                this.anInt1673 = 0;
            }
            if (this.anInt1674 === undefined) {
                this.anInt1674 = 0;
            }
            if (this.anInt1675 === undefined) {
                this.anInt1675 = 0;
            }
            if (this.vertexSkins === undefined) {
                this.vertexSkins = null;
            }
            if (this.triangleSkinValues === undefined) {
                this.triangleSkinValues = null;
            }
            if (this.vectorSkin === undefined) {
                this.vectorSkin = null;
            }
            if (this.triangleSkin === undefined) {
                this.triangleSkin = null;
            }
            if (this.aClass40Array1681 === undefined) {
                this.aClass40Array1681 = null;
            }
        } else {
            throw new Error("invalid overload");
        }
    }

    public replaceWithModel(model: Model, replaceAlphaValues: boolean) {
        this.vertexCount = model.vertexCount;
        this.triangleCount = model.triangleCount;
        this.texturedTriangleCount = model.texturedTriangleCount;
        if (Model.anIntArray1644.length < this.vertexCount) {
            Model.anIntArray1644 = (s => {
                const a = [];
                while (s-- > 0) {
                    a.push(0);
                }
                return a;
            })(this.vertexCount + 100);
            Model.anIntArray1645 = (s => {
                const a = [];
                while (s-- > 0) {
                    a.push(0);
                }
                return a;
            })(this.vertexCount + 100);
            Model.anIntArray1646 = (s => {
                const a = [];
                while (s-- > 0) {
                    a.push(0);
                }
                return a;
            })(this.vertexCount + 100);
        }
        this.verticesX = Model.anIntArray1644;
        this.verticesY = Model.anIntArray1645;
        this.verticesZ = Model.anIntArray1646;
        for (let vertex: number = 0; vertex < this.vertexCount; vertex++) {
            {
                this.verticesX[vertex] = model.verticesX[vertex];
                this.verticesY[vertex] = model.verticesY[vertex];
                this.verticesZ[vertex] = model.verticesZ[vertex];
            }
        }
        if (replaceAlphaValues) {
            this.triangleAlphaValues = model.triangleAlphaValues;
        } else {
            if (Model.anIntArray1647.length < this.triangleCount) {
                Model.anIntArray1647 = (s => {
                    const a = [];
                    while (s-- > 0) {
                        a.push(0);
                    }
                    return a;
                })(this.triangleCount + 100);
            }
            this.triangleAlphaValues = Model.anIntArray1647;
            if (model.triangleAlphaValues == null) {
                for (let triangle: number = 0; triangle < this.triangleCount; triangle++) {
                    this.triangleAlphaValues[triangle] = 0;
                }
            } else {
                for (let triangle: number = 0; triangle < this.triangleCount; triangle++) {
                    this.triangleAlphaValues[triangle] = model.triangleAlphaValues[triangle];
                }
            }
        }
        this.texturePoints = model.texturePoints;
        this.triangleColorValues = model.triangleColorValues;
        this.trianglePriorities = model.trianglePriorities;
        this.anInt1663 = model.anInt1663;
        this.triangleSkin = model.triangleSkin;
        this.vectorSkin = model.vectorSkin;
        this.trianglePointsX = model.trianglePointsX;
        this.trianglePointsY = model.trianglePointsY;
        this.trianglePointsZ = model.trianglePointsZ;
        this.anIntArray1656 = model.anIntArray1656;
        this.anIntArray1657 = model.anIntArray1657;
        this.anIntArray1658 = model.anIntArray1658;
        this.texturedTrianglePointsX = model.texturedTrianglePointsX;
        this.texturedTrianglePointsY = model.texturedTrianglePointsY;
        this.texturedTrianglePointsZ = model.texturedTrianglePointsZ;
    }

    public getFirstIdenticalVertexIndex(model: Model, vertex: number): number {
        let identicalVertexIndex: number = -1;
        const vertexX: number = model.verticesX[vertex];
        const vertexY: number = model.verticesY[vertex];
        const vertexZ: number = model.verticesZ[vertex];
        for (let index: number = 0; index < this.vertexCount; index++) {
            {
                if (vertexX !== this.verticesX[index] || vertexY !== this.verticesY[index] || vertexZ !== this.verticesZ[index]) {
                    continue;
                }
                identicalVertexIndex = index;
                break;
            }
        }
        if (identicalVertexIndex === -1) {
            this.verticesX[this.vertexCount] = vertexX;
            this.verticesY[this.vertexCount] = vertexY;
            this.verticesZ[this.vertexCount] = vertexZ;
            if (model.vertexSkins != null) {
                this.vertexSkins[this.vertexCount] = model.vertexSkins[vertex];
            }
            identicalVertexIndex = this.vertexCount++;
        }
        return identicalVertexIndex;
    }

    public calculateDiagonals() {
        this.modelHeight = 0;
        this.shadowIntensity = 0;
        this.maxY = 0;
        for (let vertex: number = 0; vertex < this.vertexCount; vertex++) {
            {
                const vertexX: number = this.verticesX[vertex];
                const vertexY: number = this.verticesY[vertex];
                const vertexZ: number = this.verticesZ[vertex];
                if (-vertexY > this.modelHeight) {
                    this.modelHeight = -vertexY;
                }
                if (vertexY > this.maxY) {
                    this.maxY = vertexY;
                }
                const j1: number = vertexX * vertexX + vertexZ * vertexZ;
                if (j1 > this.shadowIntensity) {
                    this.shadowIntensity = j1;
                }
            }
        }
        this.shadowIntensity = ((Math.sqrt(this.shadowIntensity) + 0.99) as number) | 0;
        this.anInt1674 =
            ((Math.sqrt(this.shadowIntensity * this.shadowIntensity + this.modelHeight * this.modelHeight) + 0.99) as number) | 0;
        this.anInt1673 =
            this.anInt1674 + (((Math.sqrt(this.shadowIntensity * this.shadowIntensity + this.maxY * this.maxY) + 0.99) as number) | 0);
    }

    public normalise() {
        this.modelHeight = 0;
        this.maxY = 0;
        for (let j: number = 0; j < this.vertexCount; j++) {
            {
                const k: number = this.verticesY[j];
                if (-k > this.modelHeight) {
                    this.modelHeight = -k;
                }
                if (k > this.maxY) {
                    this.maxY = k;
                }
            }
        }
        this.anInt1674 =
            ((Math.sqrt(this.shadowIntensity * this.shadowIntensity + this.modelHeight * this.modelHeight) + 0.99) as number) | 0;
        this.anInt1673 =
            this.anInt1674 + (((Math.sqrt(this.shadowIntensity * this.shadowIntensity + this.maxY * this.maxY) + 0.99) as number) | 0);
    }

    public method583(i: number) {
        this.modelHeight = 0;
        this.shadowIntensity = 0;
        this.maxY = 0;
        let j: number = 32767;
        let k: number = -32767;
        let l: number = -32767;
        let i1: number = 32767;
        for (let j1: number = 0; j1 < this.vertexCount; j1++) {
            {
                const k1: number = this.verticesX[j1];
                const l1: number = this.verticesY[j1];
                const i2: number = this.verticesZ[j1];
                if (k1 < j) {
                    j = k1;
                }
                if (k1 > k) {
                    k = k1;
                }
                if (i2 < i1) {
                    i1 = i2;
                }
                if (i2 > l) {
                    l = i2;
                }
                if (-l1 > this.modelHeight) {
                    this.modelHeight = -l1;
                }
                if (l1 > this.maxY) {
                    this.maxY = l1;
                }
                const j2: number = k1 * k1 + i2 * i2;
                if (j2 > this.shadowIntensity) {
                    this.shadowIntensity = j2;
                }
            }
        }
        this.shadowIntensity = (Math.sqrt(this.shadowIntensity) as number) | 0;
        this.anInt1674 = (Math.sqrt(this.shadowIntensity * this.shadowIntensity + this.modelHeight * this.modelHeight) as number) | 0;
        this.anInt1673 = this.anInt1674 + ((Math.sqrt(this.shadowIntensity * this.shadowIntensity + this.maxY * this.maxY) as number) | 0);
        this.anInt1669 = (j << 16) + (k & 65535);
        if (i <= 0) {
            this.anInt1637 = 50;
        }
        this.anInt1670 = (l << 16) + (i1 & 65535);
    }

    public createBones() {
        if (this.vertexSkins != null) {
            const ai: number[] = (s => {
                const a = [];
                while (s-- > 0) {
                    a.push(0);
                }
                return a;
            })(256);
            let j: number = 0;
            for (let l: number = 0; l < this.vertexCount; l++) {
                {
                    const j1: number = this.vertexSkins[l];
                    ai[j1]++;
                    if (j1 > j) {
                        j = j1;
                    }
                }
            }
            this.vectorSkin = (s => {
                const a = [];
                while (s-- > 0) {
                    a.push(null);
                }
                return a;
            })(j + 1);
            for (let k1: number = 0; k1 <= j; k1++) {
                {
                    this.vectorSkin[k1] = (s => {
                        const a = [];
                        while (s-- > 0) {
                            a.push(0);
                        }
                        return a;
                    })(ai[k1]);
                    ai[k1] = 0;
                }
            }
            for (let j2: number = 0; j2 < this.vertexCount; j2++) {
                {
                    const l2: number = this.vertexSkins[j2];
                    this.vectorSkin[l2][ai[l2]++] = j2;
                }
            }
            this.vertexSkins = null;
        }
        if (this.triangleSkinValues != null) {
            const ai1: number[] = (s => {
                const a = [];
                while (s-- > 0) {
                    a.push(0);
                }
                return a;
            })(256);
            let k: number = 0;
            for (let i1: number = 0; i1 < this.triangleCount; i1++) {
                {
                    const l1: number = this.triangleSkinValues[i1];
                    ai1[l1]++;
                    if (l1 > k) {
                        k = l1;
                    }
                }
            }
            this.triangleSkin = (s => {
                const a = [];
                while (s-- > 0) {
                    a.push(null);
                }
                return a;
            })(k + 1);
            for (let i2: number = 0; i2 <= k; i2++) {
                {
                    this.triangleSkin[i2] = (s => {
                        const a = [];
                        while (s-- > 0) {
                            a.push(0);
                        }
                        return a;
                    })(ai1[i2]);
                    ai1[i2] = 0;
                }
            }
            for (let k2: number = 0; k2 < this.triangleCount; k2++) {
                {
                    const i3: number = this.triangleSkinValues[k2];
                    this.triangleSkin[i3][ai1[i3]++] = k2;
                }
            }
            this.triangleSkinValues = null;
        }
    }

    public applyTransform(frameId: number) {
        if (this.vectorSkin == null) {
            return;
        }
        if (frameId === -1) {
            return;
        }
        const animation: Animation = Animation.getAnimation(frameId);
        if (animation == null) {
            return;
        }
        const skins: Skins = animation.animationSkins;
        Model.vertexXModifier = 0;
        Model.vertexYModifier = 0;
        Model.vertexZModifier = 0;
        for (let stepId: number = 0; stepId < animation.anInt433; stepId++) {
            {
                const opcode: number = animation.opcodeTable[stepId];
                this.transformStep(
                    skins.opcodes[opcode],
                    skins.skinList[opcode],
                    animation.modifier1[stepId],
                    animation.modifier2[stepId],
                    animation.modifier3[stepId]
                );
            }
        }
    }

    public mixAnimationFrames(i: number, j: number, k: number, ai: number[]) {
        if (k === -1) {
            return;
        }
        if (ai == null || i === -1) {
            this.applyTransform(k);
            return;
        }
        const animation: Animation = Animation.getAnimation(k);
        if (animation == null) {
            return;
        }
        const animation_1: Animation = Animation.getAnimation(i);
        if (animation_1 == null) {
            this.applyTransform(k);
            return;
        }
        const skins: Skins = animation.animationSkins;
        Model.vertexXModifier = 0;
        if (j !== 0) {
            this.aBoolean1641 = !this.aBoolean1641;
        }
        Model.vertexYModifier = 0;
        Model.vertexZModifier = 0;
        let l: number = 0;
        let i1: number = ai[l++];
        for (let j1: number = 0; j1 < animation.anInt433; j1++) {
            {
                let k1: number;
                for (k1 = animation.opcodeTable[j1]; k1 > i1; i1 = ai[l++]) {}
                if (k1 !== i1 || skins.opcodes[k1] === 0) {
                    this.transformStep(
                        skins.opcodes[k1],
                        skins.skinList[k1],
                        animation.modifier1[j1],
                        animation.modifier2[j1],
                        animation.modifier3[j1]
                    );
                }
            }
        }
        Model.vertexXModifier = 0;
        Model.vertexYModifier = 0;
        Model.vertexZModifier = 0;
        l = 0;
        i1 = ai[l++];
        for (let l1: number = 0; l1 < animation_1.anInt433; l1++) {
            {
                let i2: number;
                for (i2 = animation_1.opcodeTable[l1]; i2 > i1; i1 = ai[l++]) {}
                if (i2 === i1 || skins.opcodes[i2] === 0) {
                    this.transformStep(
                        skins.opcodes[i2],
                        skins.skinList[i2],
                        animation_1.modifier1[l1],
                        animation_1.modifier2[l1],
                        animation_1.modifier3[l1]
                    );
                }
            }
        }
    }

    public transformStep(i: number, ai: number[], j: number, k: number, l: number) {
        const i1: number = ai.length;
        if (i === 0) {
            let j1: number = 0;
            Model.vertexXModifier = 0;
            Model.vertexYModifier = 0;
            Model.vertexZModifier = 0;
            for (let k2: number = 0; k2 < i1; k2++) {
                {
                    const l3: number = ai[k2];
                    if (l3 < this.vectorSkin.length) {
                        const ai5: number[] = this.vectorSkin[l3];
                        for (let i5: number = 0; i5 < ai5.length; i5++) {
                            {
                                const j6: number = ai5[i5];
                                Model.vertexXModifier = Model.vertexXModifier + this.verticesX[j6];
                                Model.vertexYModifier = Model.vertexYModifier + this.verticesY[j6];
                                Model.vertexZModifier = Model.vertexZModifier + this.verticesZ[j6];
                                j1++;
                            }
                        }
                    }
                }
            }
            if (j1 > 0) {
                Model.vertexXModifier = ((Model.vertexXModifier / j1) | 0) + j;
                Model.vertexYModifier = ((Model.vertexYModifier / j1) | 0) + k;
                Model.vertexZModifier = ((Model.vertexZModifier / j1) | 0) + l;
                return;
            } else {
                Model.vertexXModifier = j;
                Model.vertexYModifier = k;
                Model.vertexZModifier = l;
                return;
            }
        }
        if (i === 1) {
            for (let k1: number = 0; k1 < i1; k1++) {
                {
                    const l2: number = ai[k1];
                    if (l2 < this.vectorSkin.length) {
                        const ai1: number[] = this.vectorSkin[l2];
                        for (let i4: number = 0; i4 < ai1.length; i4++) {
                            {
                                const j5: number = ai1[i4];
                                this.verticesX[j5] += j;
                                this.verticesY[j5] += k;
                                this.verticesZ[j5] += l;
                            }
                        }
                    }
                }
            }
            return;
        }
        if (i === 2) {
            for (let l1: number = 0; l1 < i1; l1++) {
                {
                    const i3: number = ai[l1];
                    if (i3 < this.vectorSkin.length) {
                        const ai2: number[] = this.vectorSkin[i3];
                        for (let j4: number = 0; j4 < ai2.length; j4++) {
                            {
                                const k5: number = ai2[j4];
                                this.verticesX[k5] -= Model.vertexXModifier;
                                this.verticesY[k5] -= Model.vertexYModifier;
                                this.verticesZ[k5] -= Model.vertexZModifier;
                                const k6: number = (j & 255) * 8;
                                const l6: number = (k & 255) * 8;
                                const i7: number = (l & 255) * 8;
                                if (i7 !== 0) {
                                    const j7: number = Model.SINE[i7];
                                    const i8: number = Model.COSINE[i7];
                                    const l8: number = (this.verticesY[k5] * j7 + this.verticesX[k5] * i8) >> 16;
                                    this.verticesY[k5] = (this.verticesY[k5] * i8 - this.verticesX[k5] * j7) >> 16;
                                    this.verticesX[k5] = l8;
                                }
                                if (k6 !== 0) {
                                    const k7: number = Model.SINE[k6];
                                    const j8: number = Model.COSINE[k6];
                                    const i9: number = (this.verticesY[k5] * j8 - this.verticesZ[k5] * k7) >> 16;
                                    this.verticesZ[k5] = (this.verticesY[k5] * k7 + this.verticesZ[k5] * j8) >> 16;
                                    this.verticesY[k5] = i9;
                                }
                                if (l6 !== 0) {
                                    const l7: number = Model.SINE[l6];
                                    const k8: number = Model.COSINE[l6];
                                    const j9: number = (this.verticesZ[k5] * l7 + this.verticesX[k5] * k8) >> 16;
                                    this.verticesZ[k5] = (this.verticesZ[k5] * k8 - this.verticesX[k5] * l7) >> 16;
                                    this.verticesX[k5] = j9;
                                }
                                this.verticesX[k5] += Model.vertexXModifier;
                                this.verticesY[k5] += Model.vertexYModifier;
                                this.verticesZ[k5] += Model.vertexZModifier;
                            }
                        }
                    }
                }
            }
            return;
        }
        if (i === 3) {
            for (let i2: number = 0; i2 < i1; i2++) {
                {
                    const j3: number = ai[i2];
                    if (j3 < this.vectorSkin.length) {
                        const ai3: number[] = this.vectorSkin[j3];
                        for (let k4: number = 0; k4 < ai3.length; k4++) {
                            {
                                const l5: number = ai3[k4];
                                this.verticesX[l5] -= Model.vertexXModifier;
                                this.verticesY[l5] -= Model.vertexYModifier;
                                this.verticesZ[l5] -= Model.vertexZModifier;
                                this.verticesX[l5] = ((this.verticesX[l5] * j) / 128) | 0;
                                this.verticesY[l5] = ((this.verticesY[l5] * k) / 128) | 0;
                                this.verticesZ[l5] = ((this.verticesZ[l5] * l) / 128) | 0;
                                this.verticesX[l5] += Model.vertexXModifier;
                                this.verticesY[l5] += Model.vertexYModifier;
                                this.verticesZ[l5] += Model.vertexZModifier;
                            }
                        }
                    }
                }
            }
            return;
        }
        if (i === 5 && this.triangleSkin != null && this.triangleAlphaValues != null) {
            for (let j2: number = 0; j2 < i1; j2++) {
                {
                    const k3: number = ai[j2];
                    if (k3 < this.triangleSkin.length) {
                        const ai4: number[] = this.triangleSkin[k3];
                        for (let l4: number = 0; l4 < ai4.length; l4++) {
                            {
                                const i6: number = ai4[l4];
                                this.triangleAlphaValues[i6] += j * 8;
                                if (this.triangleAlphaValues[i6] < 0) {
                                    this.triangleAlphaValues[i6] = 0;
                                }
                                if (this.triangleAlphaValues[i6] > 255) {
                                    this.triangleAlphaValues[i6] = 255;
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    public rotate90Degrees() {
        for (let i: number = 0; i < this.vertexCount; i++) {
            {
                const j: number = this.verticesX[i];
                this.verticesX[i] = this.verticesZ[i];
                this.verticesZ[i] = -j;
            }
        }
    }

    public rotateX(i: number) {
        const k: number = Model.SINE[i];
        const l: number = Model.COSINE[i];
        for (let i1: number = 0; i1 < this.vertexCount; i1++) {
            {
                const j1: number = (this.verticesY[i1] * l - this.verticesZ[i1] * k) >> 16;
                this.verticesZ[i1] = (this.verticesY[i1] * k + this.verticesZ[i1] * l) >> 16;
                this.verticesY[i1] = j1;
            }
        }
    }

    public translate(i: number, j: number, k: number) {
        for (let l: number = 0; l < this.vertexCount; l++) {
            {
                this.verticesX[l] += i;
                this.verticesY[l] += k;
                this.verticesZ[l] += j;
            }
        }
    }

    public replaceColor(oldColor: number, newColor: number) {
        for (let i: number = 0; i < this.triangleCount; i++) {
            if (this.triangleColorValues[i] === oldColor) {
                this.triangleColorValues[i] = newColor;
            }
        }
    }

    public mirror(i: number) {
        if (i !== 0) {
            for (let j: number = 1; j > 0; j++) {}
        }
        for (let k: number = 0; k < this.vertexCount; k++) {
            this.verticesZ[k] = -this.verticesZ[k];
        }
        for (let l: number = 0; l < this.triangleCount; l++) {
            {
                const i1: number = this.trianglePointsX[l];
                this.trianglePointsX[l] = this.trianglePointsZ[l];
                this.trianglePointsZ[l] = i1;
            }
        }
    }

    public scaleT(i: number, j: number, k: number, l: number) {
        for (let i1: number = 0; i1 < this.vertexCount; i1++) {
            {
                this.verticesX[i1] = ((this.verticesX[i1] * l) / 128) | 0;
                this.verticesY[i1] = ((this.verticesY[i1] * i) / 128) | 0;
                this.verticesZ[i1] = ((this.verticesZ[i1] * j) / 128) | 0;
            }
        }
        if (k !== 9) {
            this.anInt1636 = 322;
        }
    }

    public applyLighting(i: number, j: number, k: number, l: number, i1: number, flag: boolean) {
        const j1: number = (Math.sqrt(k * k + l * l + i1 * i1) as number) | 0;
        const k1: number = (j * j1) >> 8;
        if (this.anIntArray1656 == null) {
            this.anIntArray1656 = (s => {
                const a = [];
                while (s-- > 0) {
                    a.push(0);
                }
                return a;
            })(this.triangleCount);
            this.anIntArray1657 = (s => {
                const a = [];
                while (s-- > 0) {
                    a.push(0);
                }
                return a;
            })(this.triangleCount);
            this.anIntArray1658 = (s => {
                const a = [];
                while (s-- > 0) {
                    a.push(0);
                }
                return a;
            })(this.triangleCount);
        }
        if (this.verticesNormal == null) {
            this.verticesNormal = (s => {
                const a = [];
                while (s-- > 0) {
                    a.push(null);
                }
                return a;
            })(this.vertexCount);
            for (let l1: number = 0; l1 < this.vertexCount; l1++) {
                this.verticesNormal[l1] = new VertexNormal();
            }
        }
        for (let i2: number = 0; i2 < this.triangleCount; i2++) {
            {
                const j2: number = this.trianglePointsX[i2];
                const l2: number = this.trianglePointsY[i2];
                const i3: number = this.trianglePointsZ[i2];
                const j3: number = this.verticesX[l2] - this.verticesX[j2];
                const k3: number = this.verticesY[l2] - this.verticesY[j2];
                const l3: number = this.verticesZ[l2] - this.verticesZ[j2];
                const i4: number = this.verticesX[i3] - this.verticesX[j2];
                const j4: number = this.verticesY[i3] - this.verticesY[j2];
                const k4: number = this.verticesZ[i3] - this.verticesZ[j2];
                let l4: number = k3 * k4 - j4 * l3;
                let i5: number = l3 * i4 - k4 * j3;
                let j5: number;
                for (j5 = j3 * j4 - i4 * k3; l4 > 8192 || i5 > 8192 || j5 > 8192 || l4 < -8192 || i5 < -8192 || j5 < -8192; j5 >>= 1) {
                    {
                        l4 >>= 1;
                        i5 >>= 1;
                    }
                }
                let k5: number = (Math.sqrt(l4 * l4 + i5 * i5 + j5 * j5) as number) | 0;
                if (k5 <= 0) {
                    k5 = 1;
                }
                l4 = ((l4 * 256) / k5) | 0;
                i5 = ((i5 * 256) / k5) | 0;
                j5 = ((j5 * 256) / k5) | 0;
                if (this.texturePoints == null || (this.texturePoints[i2] & 1) === 0) {
                    let class40_2: VertexNormal = this.verticesNormal[j2];
                    class40_2.x += l4;
                    class40_2.y += i5;
                    class40_2.z += j5;
                    class40_2.magnitude++;
                    class40_2 = this.verticesNormal[l2];
                    class40_2.x += l4;
                    class40_2.y += i5;
                    class40_2.z += j5;
                    class40_2.magnitude++;
                    class40_2 = this.verticesNormal[i3];
                    class40_2.x += l4;
                    class40_2.y += i5;
                    class40_2.z += j5;
                    class40_2.magnitude++;
                } else {
                    const l5: number = i + (((k * l4 + l * i5 + i1 * j5) / (k1 + ((k1 / 2) | 0))) | 0);
                    this.anIntArray1656[i2] = Model.method597(this.triangleColorValues[i2], l5, this.texturePoints[i2]);
                }
            }
        }
        if (flag) {
            this.method596(i, k1, k, l, i1);
        } else {
            this.aClass40Array1681 = (s => {
                const a = [];
                while (s-- > 0) {
                    a.push(null);
                }
                return a;
            })(this.vertexCount);
            for (let k2: number = 0; k2 < this.vertexCount; k2++) {
                {
                    const class40: VertexNormal = this.verticesNormal[k2];
                    const class40_1: VertexNormal = (this.aClass40Array1681[k2] = new VertexNormal());
                    class40_1.x = class40.x;
                    class40_1.y = class40.y;
                    class40_1.z = class40.z;
                    class40_1.magnitude = class40.magnitude;
                }
            }
            this.anInt1668 = (i << 16) + (k1 & 65535);
        }
        if (flag) {
            this.calculateDiagonals();
            return;
        } else {
            this.method583(426);
            return;
        }
    }

    public method595(i: number, j: number, k: number, l: number) {
        const i1: number = this.anInt1668 >> 16;
        const j1: number = (this.anInt1668 << 16) >> 16;
        if (k !== 0) {
            for (let k1: number = 1; k1 > 0; k1++) {}
        }
        this.method596(i1, j1, l, i, j);
    }

    public method596(i: number, j: number, k: number, l: number, i1: number) {
        for (let j1: number = 0; j1 < this.triangleCount; j1++) {
            {
                const k1: number = this.trianglePointsX[j1];
                const i2: number = this.trianglePointsY[j1];
                const j2: number = this.trianglePointsZ[j1];
                if (this.texturePoints == null) {
                    const i3: number = this.triangleColorValues[j1];
                    let class40: VertexNormal = this.verticesNormal[k1];
                    let k2: number = i + (((k * class40.x + l * class40.y + i1 * class40.z) / (j * class40.magnitude)) | 0);
                    this.anIntArray1656[j1] = Model.method597(i3, k2, 0);
                    class40 = this.verticesNormal[i2];
                    k2 = i + (((k * class40.x + l * class40.y + i1 * class40.z) / (j * class40.magnitude)) | 0);
                    this.anIntArray1657[j1] = Model.method597(i3, k2, 0);
                    class40 = this.verticesNormal[j2];
                    k2 = i + (((k * class40.x + l * class40.y + i1 * class40.z) / (j * class40.magnitude)) | 0);
                    this.anIntArray1658[j1] = Model.method597(i3, k2, 0);
                } else if ((this.texturePoints[j1] & 1) === 0) {
                    const j3: number = this.triangleColorValues[j1];
                    const k3: number = this.texturePoints[j1];
                    let class40_1: VertexNormal = this.verticesNormal[k1];
                    let l2: number = i + (((k * class40_1.x + l * class40_1.y + i1 * class40_1.z) / (j * class40_1.magnitude)) | 0);
                    this.anIntArray1656[j1] = Model.method597(j3, l2, k3);
                    class40_1 = this.verticesNormal[i2];
                    l2 = i + (((k * class40_1.x + l * class40_1.y + i1 * class40_1.z) / (j * class40_1.magnitude)) | 0);
                    this.anIntArray1657[j1] = Model.method597(j3, l2, k3);
                    class40_1 = this.verticesNormal[j2];
                    l2 = i + (((k * class40_1.x + l * class40_1.y + i1 * class40_1.z) / (j * class40_1.magnitude)) | 0);
                    this.anIntArray1658[j1] = Model.method597(j3, l2, k3);
                }
            }
        }
        this.verticesNormal = null;
        this.aClass40Array1681 = null;
        this.vertexSkins = null;
        this.triangleSkinValues = null;
        if (this.texturePoints != null) {
            for (let l1: number = 0; l1 < this.triangleCount; l1++) {
                if ((this.texturePoints[l1] & 2) === 2) {
                    return;
                }
            }
        }
        this.triangleColorValues = null;
    }

    public render(i: number, j: number, k: number, l: number, i1: number, j1: number, k1: number) {
        const l1: number = Rasterizer3D.centerX;
        const i2: number = Rasterizer3D.centerY;
        const j2: number = Model.SINE[i];
        const k2: number = Model.COSINE[i];
        const l2: number = Model.SINE[j];
        const i3: number = Model.COSINE[j];
        const j3: number = Model.SINE[k];
        const k3: number = Model.COSINE[k];
        const l3: number = Model.SINE[l];
        const i4: number = Model.COSINE[l];
        const j4: number = (j1 * l3 + k1 * i4) >> 16;
        for (let k4: number = 0; k4 < this.vertexCount; k4++) {
            {
                let l4: number = this.verticesX[k4];
                let i5: number = this.verticesY[k4];
                let j5: number = this.verticesZ[k4];
                if (k !== 0) {
                    const k5: number = (i5 * j3 + l4 * k3) >> 16;
                    i5 = (i5 * k3 - l4 * j3) >> 16;
                    l4 = k5;
                }
                if (i !== 0) {
                    const l5: number = (i5 * k2 - j5 * j2) >> 16;
                    j5 = (i5 * j2 + j5 * k2) >> 16;
                    i5 = l5;
                }
                if (j !== 0) {
                    const i6: number = (j5 * l2 + l4 * i3) >> 16;
                    j5 = (j5 * i3 - l4 * l2) >> 16;
                    l4 = i6;
                }
                l4 += i1;
                i5 += j1;
                j5 += k1;
                const j6: number = (i5 * i4 - j5 * l3) >> 16;
                j5 = (i5 * l3 + j5 * i4) >> 16;
                i5 = j6;
                Model.anIntArray1688[k4] = j5 - j4;
                Model.anIntArray1686[k4] = l1 + (((l4 << 9) / j5) | 0);
                Model.anIntArray1687[k4] = i2 + (((i5 << 9) / j5) | 0);
                if (this.texturedTriangleCount > 0) {
                    Model.anIntArray1689[k4] = l4;
                    Model.anIntArray1690[k4] = i5;
                    Model.anIntArray1691[k4] = j5;
                }
            }
        }
        try {
            this.method599(false, false, 0);
            return;
        } catch (_ex) {
            return;
        }
    }

    /**
     *
     * @param {number} i
     * @param {number} j
     * @param {number} k
     * @param {number} l
     * @param {number} i1
     * @param {number} j1
     * @param {number} k1
     * @param {number} l1
     * @param {number} i2
     */
    public renderAtPoint(i: number, j: number, k: number, l: number, i1: number, j1: number, k1: number, l1: number, i2: number) {
        const j2: number = (l1 * i1 - j1 * l) >> 16;
        const k2: number = (k1 * j + j2 * k) >> 16;
        const l2: number = (this.shadowIntensity * k) >> 16;
        const i3: number = k2 + l2;
        if (i3 <= 50 || k2 >= 3500) {
            return;
        }
        const j3: number = (l1 * l + j1 * i1) >> 16;
        let k3: number = (j3 - this.shadowIntensity) << 9;
        if (((k3 / i3) | 0) >= Rasterizer.centerX) {
            return;
        }
        let l3: number = (j3 + this.shadowIntensity) << 9;
        if (((l3 / i3) | 0) <= -Rasterizer.centerX) {
            return;
        }
        const i4: number = (k1 * k - j2 * j) >> 16;
        const j4: number = (this.shadowIntensity * j) >> 16;
        let k4: number = (i4 + j4) << 9;
        if (((k4 / i3) | 0) <= -Rasterizer.centerY) {
            return;
        }
        const l4: number = j4 + ((this.modelHeight * k) >> 16);
        let i5: number = (i4 - l4) << 9;
        if (((i5 / i3) | 0) >= Rasterizer.centerY) {
            return;
        }
        const j5: number = l2 + ((this.modelHeight * j) >> 16);
        let flag: boolean = false;
        if (k2 - j5 <= 50) {
            flag = true;
        }
        let flag1: boolean = false;
        if (i2 > 0 && Model.aBoolean1705) {
            let k5: number = k2 - l2;
            if (k5 <= 50) {
                k5 = 50;
            }
            if (j3 > 0) {
                k3 = (n => (n < 0 ? Math.ceil(n) : Math.floor(n)))(k3 / i3);
                l3 = (n => (n < 0 ? Math.ceil(n) : Math.floor(n)))(l3 / k5);
            } else {
                l3 = (n => (n < 0 ? Math.ceil(n) : Math.floor(n)))(l3 / i3);
                k3 = (n => (n < 0 ? Math.ceil(n) : Math.floor(n)))(k3 / k5);
            }
            if (i4 > 0) {
                i5 = (n => (n < 0 ? Math.ceil(n) : Math.floor(n)))(i5 / i3);
                k4 = (n => (n < 0 ? Math.ceil(n) : Math.floor(n)))(k4 / k5);
            } else {
                k4 = (n => (n < 0 ? Math.ceil(n) : Math.floor(n)))(k4 / i3);
                i5 = (n => (n < 0 ? Math.ceil(n) : Math.floor(n)))(i5 / k5);
            }
            const i6: number = Model.anInt1706 - Rasterizer3D.centerX;
            const k6: number = Model.anInt1707 - Rasterizer3D.centerY;
            if (i6 > k3 && i6 < l3 && k6 > i5 && k6 < k4) {
                if (this.oneSquareModel) {
                    Model.anInt1708;
                    Model.anIntArray1709[Model.anInt1708++] = i2;
                } else {
                    flag1 = true;
                }
            }
        }
        const l5: number = Rasterizer3D.centerX;
        const j6: number = Rasterizer3D.centerY;
        let l6: number = 0;
        let i7: number = 0;
        if (i !== 0) {
            l6 = Model.SINE[i];
            i7 = Model.COSINE[i];
        }
        for (let j7: number = 0; j7 < this.vertexCount; j7++) {
            {
                let k7: number = this.verticesX[j7];
                let l7: number = this.verticesY[j7];
                let i8: number = this.verticesZ[j7];
                if (i !== 0) {
                    const j8: number = (i8 * l6 + k7 * i7) >> 16;
                    i8 = (i8 * i7 - k7 * l6) >> 16;
                    k7 = j8;
                }
                k7 += j1;
                l7 += k1;
                i8 += l1;
                let k8: number = (i8 * l + k7 * i1) >> 16;
                i8 = (i8 * i1 - k7 * l) >> 16;
                k7 = k8;
                k8 = (l7 * k - i8 * j) >> 16;
                i8 = (l7 * j + i8 * k) >> 16;
                l7 = k8;
                Model.anIntArray1688[j7] = i8 - k2;
                if (i8 >= 50) {
                    Model.anIntArray1686[j7] = l5 + (((k7 << 9) / i8) | 0);
                    Model.anIntArray1687[j7] = j6 + (((l7 << 9) / i8) | 0);
                } else {
                    Model.anIntArray1686[j7] = -5000;
                    flag = true;
                }
                if (flag || this.texturedTriangleCount > 0) {
                    Model.anIntArray1689[j7] = k7;
                    Model.anIntArray1690[j7] = l7;
                    Model.anIntArray1691[j7] = i8;
                }
            }
        }
        try {
            this.method599(flag, flag1, i2);
            return;
        } catch (_ex) {
            return;
        }
    }

    public method599(flag: boolean, flag1: boolean, i: number) {
        for (let j: number = 0; j < this.anInt1673; j++) {
            Model.anIntArray1692[j] = 0;
        }
        for (let k: number = 0; k < this.triangleCount; k++) {
            if (this.texturePoints == null || this.texturePoints[k] !== -1) {
                const l: number = this.trianglePointsX[k];
                const k1: number = this.trianglePointsY[k];
                const j2: number = this.trianglePointsZ[k];
                const i3: number = Model.anIntArray1686[l];
                const l3: number = Model.anIntArray1686[k1];
                const k4: number = Model.anIntArray1686[j2];
                if (flag && (i3 === -5000 || l3 === -5000 || k4 === -5000)) {
                    Model.aBooleanArray1685[k] = true;
                    const j5: number =
                        (((Model.anIntArray1688[l] + Model.anIntArray1688[k1] + Model.anIntArray1688[j2]) / 3) | 0) +
                        this.anInt1674;
                    Model.anIntArrayArray1693[j5][Model.anIntArray1692[j5]++] = k;
                } else {
                    if (
                        flag1 &&
                        this.method602(
                            Model.anInt1706,
                            Model.anInt1707,
                            Model.anIntArray1687[l],
                            Model.anIntArray1687[k1],
                            Model.anIntArray1687[j2],
                            i3,
                            l3,
                            k4
                        )
                    ) {
                        Model.anInt1708;
                        Model.anIntArray1709[Model.anInt1708++] = i;
                        flag1 = false;
                    }
                    if (
                        (i3 - l3) * (Model.anIntArray1687[j2] - Model.anIntArray1687[k1]) -
                            (Model.anIntArray1687[l] - Model.anIntArray1687[k1]) * (k4 - l3) >
                        0
                    ) {
                        Model.aBooleanArray1685[k] = false;
                        if (
                            i3 < 0 ||
                            l3 < 0 ||
                            k4 < 0 ||
                            i3 > Rasterizer.virtualBottomX ||
                            l3 > Rasterizer.virtualBottomX ||
                            k4 > Rasterizer.virtualBottomX
                        ) {
                            Model.aBooleanArray1684[k] = true;
                        } else {
                            Model.aBooleanArray1684[k] = false;
                        }
                        const k5: number =
                            (((Model.anIntArray1688[l] + Model.anIntArray1688[k1] + Model.anIntArray1688[j2]) / 3) |
                                0) +
                            this.anInt1674;
                        Model.anIntArrayArray1693[k5][Model.anIntArray1692[k5]++] = k;
                    }
                }
            }
        }
        if (this.trianglePriorities == null) {
            for (let i1: number = this.anInt1673 - 1; i1 >= 0; i1--) {
                {
                    const l1: number = Model.anIntArray1692[i1];
                    if (l1 > 0) {
                        const ai: number[] = Model.anIntArrayArray1693[i1];
                        for (let j3: number = 0; j3 < l1; j3++) {
                            this.method600(ai[j3]);
                        }
                    }
                }
            }
            return;
        }
        for (let j1: number = 0; j1 < 12; j1++) {
            {
                Model.anIntArray1694[j1] = 0;
                Model.anIntArray1698[j1] = 0;
            }
        }
        for (let i2: number = this.anInt1673 - 1; i2 >= 0; i2--) {
            {
                const k2: number = Model.anIntArray1692[i2];
                if (k2 > 0) {
                    const ai1: number[] = Model.anIntArrayArray1693[i2];
                    for (let i4: number = 0; i4 < k2; i4++) {
                        {
                            const l4: number = ai1[i4];
                            const l5: number = this.trianglePriorities[l4];
                            const j6: number = Model.anIntArray1694[l5]++;
                            Model.anIntArrayArray1695[l5][j6] = l4;
                            if (l5 < 10) {
                                Model.anIntArray1698[l5] += i2;
                            } else if (l5 === 10) {
                                Model.anIntArray1696[j6] = i2;
                            } else {
                                Model.anIntArray1697[j6] = i2;
                            }
                        }
                    }
                }
            }
        }
        let l2: number = 0;
        if (Model.anIntArray1694[1] > 0 || Model.anIntArray1694[2] > 0) {
            l2 =
                ((Model.anIntArray1698[1] + Model.anIntArray1698[2]) /
                    (Model.anIntArray1694[1] + Model.anIntArray1694[2])) |
                0;
        }
        let k3: number = 0;
        if (Model.anIntArray1694[3] > 0 || Model.anIntArray1694[4] > 0) {
            k3 =
                ((Model.anIntArray1698[3] + Model.anIntArray1698[4]) /
                    (Model.anIntArray1694[3] + Model.anIntArray1694[4])) |
                0;
        }
        let j4: number = 0;
        if (Model.anIntArray1694[6] > 0 || Model.anIntArray1694[8] > 0) {
            j4 =
                ((Model.anIntArray1698[6] + Model.anIntArray1698[8]) /
                    (Model.anIntArray1694[6] + Model.anIntArray1694[8])) |
                0;
        }
        let i6: number = 0;
        let k6: number = Model.anIntArray1694[10];
        let ai2: number[] = Model.anIntArrayArray1695[10];
        let ai3: number[] = Model.anIntArray1696;
        if (i6 === k6) {
            i6 = 0;
            k6 = Model.anIntArray1694[11];
            ai2 = Model.anIntArrayArray1695[11];
            ai3 = Model.anIntArray1697;
        }
        let i5: number;
        if (i6 < k6) {
            i5 = ai3[i6];
        } else {
            i5 = -1000;
        }
        for (let l6: number = 0; l6 < 10; l6++) {
            {
                while (l6 === 0 && i5 > l2) {
                    {
                        this.method600(ai2[i6++]);
                        if (i6 === k6 && ai2 !== Model.anIntArrayArray1695[11]) {
                            i6 = 0;
                            k6 = Model.anIntArray1694[11];
                            ai2 = Model.anIntArrayArray1695[11];
                            ai3 = Model.anIntArray1697;
                        }
                        if (i6 < k6) {
                            i5 = ai3[i6];
                        } else {
                            i5 = -1000;
                        }
                    }
                }
                while (l6 === 3 && i5 > k3) {
                    {
                        this.method600(ai2[i6++]);
                        if (i6 === k6 && ai2 !== Model.anIntArrayArray1695[11]) {
                            i6 = 0;
                            k6 = Model.anIntArray1694[11];
                            ai2 = Model.anIntArrayArray1695[11];
                            ai3 = Model.anIntArray1697;
                        }
                        if (i6 < k6) {
                            i5 = ai3[i6];
                        } else {
                            i5 = -1000;
                        }
                    }
                }
                while (l6 === 5 && i5 > j4) {
                    {
                        this.method600(ai2[i6++]);
                        if (i6 === k6 && ai2 !== Model.anIntArrayArray1695[11]) {
                            i6 = 0;
                            k6 = Model.anIntArray1694[11];
                            ai2 = Model.anIntArrayArray1695[11];
                            ai3 = Model.anIntArray1697;
                        }
                        if (i6 < k6) {
                            i5 = ai3[i6];
                        } else {
                            i5 = -1000;
                        }
                    }
                }
                const i7: number = Model.anIntArray1694[l6];
                const ai4: number[] = Model.anIntArrayArray1695[l6];
                for (let j7: number = 0; j7 < i7; j7++) {
                    this.method600(ai4[j7]);
                }
            }
        }
        while (i5 !== -1000) {
            {
                this.method600(ai2[i6++]);
                if (i6 === k6 && ai2 !== Model.anIntArrayArray1695[11]) {
                    i6 = 0;
                    ai2 = Model.anIntArrayArray1695[11];
                    k6 = Model.anIntArray1694[11];
                    ai3 = Model.anIntArray1697;
                }
                if (i6 < k6) {
                    i5 = ai3[i6];
                } else {
                    i5 = -1000;
                }
            }
        }
    }

    public method600(i: number) {
        if (Model.aBooleanArray1685[i]) {
            this.method601(i);
            return;
        }
        const j: number = this.trianglePointsX[i];
        const k: number = this.trianglePointsY[i];
        const l: number = this.trianglePointsZ[i];
        Rasterizer3D.aBoolean1528 = Model.aBooleanArray1684[i];
        if (this.triangleAlphaValues == null) {
            Rasterizer3D.anInt1531 = 0;
        } else {
            Rasterizer3D.anInt1531 = this.triangleAlphaValues[i];
        }
        let i1: number;
        if (this.texturePoints == null) {
            i1 = 0;
        } else {
            i1 = this.texturePoints[i] & 3;
        }
        if (i1 === 0) {
            Rasterizer3D.method503(
                Model.anIntArray1687[j],
                Model.anIntArray1687[k],
                Model.anIntArray1687[l],
                Model.anIntArray1686[j],
                Model.anIntArray1686[k],
                Model.anIntArray1686[l],
                this.anIntArray1656[i],
                this.anIntArray1657[i],
                this.anIntArray1658[i]
            );
            return;
        }
        if (i1 === 1) {
            Rasterizer3D.method505(
                Model.anIntArray1687[j],
                Model.anIntArray1687[k],
                Model.anIntArray1687[l],
                Model.anIntArray1686[j],
                Model.anIntArray1686[k],
                Model.anIntArray1686[l],
                Model.anIntArray1712[this.anIntArray1656[i]]
            );
            return;
        }
        if (i1 === 2) {
            const j1: number = this.texturePoints[i] >> 2;
            const l1: number = this.texturedTrianglePointsX[j1];
            const j2: number = this.texturedTrianglePointsY[j1];
            const l2: number = this.texturedTrianglePointsZ[j1];
            Rasterizer3D.method507(
                Model.anIntArray1687[j],
                Model.anIntArray1687[k],
                Model.anIntArray1687[l],
                Model.anIntArray1686[j],
                Model.anIntArray1686[k],
                Model.anIntArray1686[l],
                this.anIntArray1656[i],
                this.anIntArray1657[i],
                this.anIntArray1658[i],
                Model.anIntArray1689[l1],
                Model.anIntArray1689[j2],
                Model.anIntArray1689[l2],
                Model.anIntArray1690[l1],
                Model.anIntArray1690[j2],
                Model.anIntArray1690[l2],
                Model.anIntArray1691[l1],
                Model.anIntArray1691[j2],
                Model.anIntArray1691[l2],
                this.triangleColorValues[i]
            );
            return;
        }
        if (i1 === 3) {
            const k1: number = this.texturePoints[i] >> 2;
            const i2: number = this.texturedTrianglePointsX[k1];
            const k2: number = this.texturedTrianglePointsY[k1];
            const i3: number = this.texturedTrianglePointsZ[k1];
            Rasterizer3D.method507(
                Model.anIntArray1687[j],
                Model.anIntArray1687[k],
                Model.anIntArray1687[l],
                Model.anIntArray1686[j],
                Model.anIntArray1686[k],
                Model.anIntArray1686[l],
                this.anIntArray1656[i],
                this.anIntArray1656[i],
                this.anIntArray1656[i],
                Model.anIntArray1689[i2],
                Model.anIntArray1689[k2],
                Model.anIntArray1689[i3],
                Model.anIntArray1690[i2],
                Model.anIntArray1690[k2],
                Model.anIntArray1690[i3],
                Model.anIntArray1691[i2],
                Model.anIntArray1691[k2],
                Model.anIntArray1691[i3],
                this.triangleColorValues[i]
            );
        }
    }

    public method601(i: number) {
        const j: number = Rasterizer3D.centerX;
        const k: number = Rasterizer3D.centerY;
        let l: number = 0;
        const i1: number = this.trianglePointsX[i];
        const j1: number = this.trianglePointsY[i];
        const k1: number = this.trianglePointsZ[i];
        const l1: number = Model.anIntArray1691[i1];
        const i2: number = Model.anIntArray1691[j1];
        const j2: number = Model.anIntArray1691[k1];
        if (l1 >= 50) {
            Model.anIntArray1699[l] = Model.anIntArray1686[i1];
            Model.anIntArray1700[l] = Model.anIntArray1687[i1];
            Model.anIntArray1701[l++] = this.anIntArray1656[i];
        } else {
            const k2: number = Model.anIntArray1689[i1];
            const k3: number = Model.anIntArray1690[i1];
            const k4: number = this.anIntArray1656[i];
            if (j2 >= 50) {
                const k5: number = (50 - l1) * Model.anIntArray1713[j2 - l1];
                Model.anIntArray1699[l] = j + ((((k2 + (((Model.anIntArray1689[k1] - k2) * k5) >> 16)) << 9) / 50) | 0);
                Model.anIntArray1700[l] = k + ((((k3 + (((Model.anIntArray1690[k1] - k3) * k5) >> 16)) << 9) / 50) | 0);
                Model.anIntArray1701[l++] = k4 + (((this.anIntArray1658[i] - k4) * k5) >> 16);
            }
            if (i2 >= 50) {
                const l5: number = (50 - l1) * Model.anIntArray1713[i2 - l1];
                Model.anIntArray1699[l] = j + ((((k2 + (((Model.anIntArray1689[j1] - k2) * l5) >> 16)) << 9) / 50) | 0);
                Model.anIntArray1700[l] = k + ((((k3 + (((Model.anIntArray1690[j1] - k3) * l5) >> 16)) << 9) / 50) | 0);
                Model.anIntArray1701[l++] = k4 + (((this.anIntArray1657[i] - k4) * l5) >> 16);
            }
        }
        if (i2 >= 50) {
            Model.anIntArray1699[l] = Model.anIntArray1686[j1];
            Model.anIntArray1700[l] = Model.anIntArray1687[j1];
            Model.anIntArray1701[l++] = this.anIntArray1657[i];
        } else {
            const l2: number = Model.anIntArray1689[j1];
            const l3: number = Model.anIntArray1690[j1];
            const l4: number = this.anIntArray1657[i];
            if (l1 >= 50) {
                const i6: number = (50 - i2) * Model.anIntArray1713[l1 - i2];
                Model.anIntArray1699[l] = j + ((((l2 + (((Model.anIntArray1689[i1] - l2) * i6) >> 16)) << 9) / 50) | 0);
                Model.anIntArray1700[l] = k + ((((l3 + (((Model.anIntArray1690[i1] - l3) * i6) >> 16)) << 9) / 50) | 0);
                Model.anIntArray1701[l++] = l4 + (((this.anIntArray1656[i] - l4) * i6) >> 16);
            }
            if (j2 >= 50) {
                const j6: number = (50 - i2) * Model.anIntArray1713[j2 - i2];
                Model.anIntArray1699[l] = j + ((((l2 + (((Model.anIntArray1689[k1] - l2) * j6) >> 16)) << 9) / 50) | 0);
                Model.anIntArray1700[l] = k + ((((l3 + (((Model.anIntArray1690[k1] - l3) * j6) >> 16)) << 9) / 50) | 0);
                Model.anIntArray1701[l++] = l4 + (((this.anIntArray1658[i] - l4) * j6) >> 16);
            }
        }
        if (j2 >= 50) {
            Model.anIntArray1699[l] = Model.anIntArray1686[k1];
            Model.anIntArray1700[l] = Model.anIntArray1687[k1];
            Model.anIntArray1701[l++] = this.anIntArray1658[i];
        } else {
            const i3: number = Model.anIntArray1689[k1];
            const i4: number = Model.anIntArray1690[k1];
            const i5: number = this.anIntArray1658[i];
            if (i2 >= 50) {
                const k6: number = (50 - j2) * Model.anIntArray1713[i2 - j2];
                Model.anIntArray1699[l] = j + ((((i3 + (((Model.anIntArray1689[j1] - i3) * k6) >> 16)) << 9) / 50) | 0);
                Model.anIntArray1700[l] = k + ((((i4 + (((Model.anIntArray1690[j1] - i4) * k6) >> 16)) << 9) / 50) | 0);
                Model.anIntArray1701[l++] = i5 + (((this.anIntArray1657[i] - i5) * k6) >> 16);
            }
            if (l1 >= 50) {
                const l6: number = (50 - j2) * Model.anIntArray1713[l1 - j2];
                Model.anIntArray1699[l] = j + ((((i3 + (((Model.anIntArray1689[i1] - i3) * l6) >> 16)) << 9) / 50) | 0);
                Model.anIntArray1700[l] = k + ((((i4 + (((Model.anIntArray1690[i1] - i4) * l6) >> 16)) << 9) / 50) | 0);
                Model.anIntArray1701[l++] = i5 + (((this.anIntArray1656[i] - i5) * l6) >> 16);
            }
        }
        const j3: number = Model.anIntArray1699[0];
        const j4: number = Model.anIntArray1699[1];
        const j5: number = Model.anIntArray1699[2];
        const i7: number = Model.anIntArray1700[0];
        const j7: number = Model.anIntArray1700[1];
        const k7: number = Model.anIntArray1700[2];
        if ((j3 - j4) * (k7 - j7) - (i7 - j7) * (j5 - j4) > 0) {
            Rasterizer3D.aBoolean1528 = false;
            if (l === 3) {
                if (
                    j3 < 0 ||
                    j4 < 0 ||
                    j5 < 0 ||
                    j3 > Rasterizer.virtualBottomX ||
                    j4 > Rasterizer.virtualBottomX ||
                    j5 > Rasterizer.virtualBottomX
                ) {
                    Rasterizer3D.aBoolean1528 = true;
                }
                let l7: number;
                if (this.texturePoints == null) {
                    l7 = 0;
                } else {
                    l7 = this.texturePoints[i] & 3;
                }
                if (l7 === 0) {
                    Rasterizer3D.method503(
                        i7,
                        j7,
                        k7,
                        j3,
                        j4,
                        j5,
                        Model.anIntArray1701[0],
                        Model.anIntArray1701[1],
                        Model.anIntArray1701[2]
                    );
                } else if (l7 === 1) {
                    Rasterizer3D.method505(i7, j7, k7, j3, j4, j5, Model.anIntArray1712[this.anIntArray1656[i]]);
                } else if (l7 === 2) {
                    const j8: number = this.texturePoints[i] >> 2;
                    const k9: number = this.texturedTrianglePointsX[j8];
                    const k10: number = this.texturedTrianglePointsY[j8];
                    const k11: number = this.texturedTrianglePointsZ[j8];
                    Rasterizer3D.method507(
                        i7,
                        j7,
                        k7,
                        j3,
                        j4,
                        j5,
                        Model.anIntArray1701[0],
                        Model.anIntArray1701[1],
                        Model.anIntArray1701[2],
                        Model.anIntArray1689[k9],
                        Model.anIntArray1689[k10],
                        Model.anIntArray1689[k11],
                        Model.anIntArray1690[k9],
                        Model.anIntArray1690[k10],
                        Model.anIntArray1690[k11],
                        Model.anIntArray1691[k9],
                        Model.anIntArray1691[k10],
                        Model.anIntArray1691[k11],
                        this.triangleColorValues[i]
                    );
                } else if (l7 === 3) {
                    const k8: number = this.texturePoints[i] >> 2;
                    const l9: number = this.texturedTrianglePointsX[k8];
                    const l10: number = this.texturedTrianglePointsY[k8];
                    const l11: number = this.texturedTrianglePointsZ[k8];
                    Rasterizer3D.method507(
                        i7,
                        j7,
                        k7,
                        j3,
                        j4,
                        j5,
                        this.anIntArray1656[i],
                        this.anIntArray1656[i],
                        this.anIntArray1656[i],
                        Model.anIntArray1689[l9],
                        Model.anIntArray1689[l10],
                        Model.anIntArray1689[l11],
                        Model.anIntArray1690[l9],
                        Model.anIntArray1690[l10],
                        Model.anIntArray1690[l11],
                        Model.anIntArray1691[l9],
                        Model.anIntArray1691[l10],
                        Model.anIntArray1691[l11],
                        this.triangleColorValues[i]
                    );
                }
            }
            if (l === 4) {
                if (
                    j3 < 0 ||
                    j4 < 0 ||
                    j5 < 0 ||
                    j3 > Rasterizer.virtualBottomX ||
                    j4 > Rasterizer.virtualBottomX ||
                    j5 > Rasterizer.virtualBottomX ||
                    Model.anIntArray1699[3] < 0 ||
                    Model.anIntArray1699[3] > Rasterizer.virtualBottomX
                ) {
                    Rasterizer3D.aBoolean1528 = true;
                }
                let i8: number;
                if (this.texturePoints == null) {
                    i8 = 0;
                } else {
                    i8 = this.texturePoints[i] & 3;
                }
                if (i8 === 0) {
                    Rasterizer3D.method503(
                        i7,
                        j7,
                        k7,
                        j3,
                        j4,
                        j5,
                        Model.anIntArray1701[0],
                        Model.anIntArray1701[1],
                        Model.anIntArray1701[2]
                    );
                    Rasterizer3D.method503(
                        i7,
                        k7,
                        Model.anIntArray1700[3],
                        j3,
                        j5,
                        Model.anIntArray1699[3],
                        Model.anIntArray1701[0],
                        Model.anIntArray1701[2],
                        Model.anIntArray1701[3]
                    );
                    return;
                }
                if (i8 === 1) {
                    const l8: number = Model.anIntArray1712[this.anIntArray1656[i]];
                    Rasterizer3D.method505(i7, j7, k7, j3, j4, j5, l8);
                    Rasterizer3D.method505(i7, k7, Model.anIntArray1700[3], j3, j5, Model.anIntArray1699[3], l8);
                    return;
                }
                if (i8 === 2) {
                    const i9: number = this.texturePoints[i] >> 2;
                    const i10: number = this.texturedTrianglePointsX[i9];
                    const i11: number = this.texturedTrianglePointsY[i9];
                    const i12: number = this.texturedTrianglePointsZ[i9];
                    Rasterizer3D.method507(
                        i7,
                        j7,
                        k7,
                        j3,
                        j4,
                        j5,
                        Model.anIntArray1701[0],
                        Model.anIntArray1701[1],
                        Model.anIntArray1701[2],
                        Model.anIntArray1689[i10],
                        Model.anIntArray1689[i11],
                        Model.anIntArray1689[i12],
                        Model.anIntArray1690[i10],
                        Model.anIntArray1690[i11],
                        Model.anIntArray1690[i12],
                        Model.anIntArray1691[i10],
                        Model.anIntArray1691[i11],
                        Model.anIntArray1691[i12],
                        this.triangleColorValues[i]
                    );
                    Rasterizer3D.method507(
                        i7,
                        k7,
                        Model.anIntArray1700[3],
                        j3,
                        j5,
                        Model.anIntArray1699[3],
                        Model.anIntArray1701[0],
                        Model.anIntArray1701[2],
                        Model.anIntArray1701[3],
                        Model.anIntArray1689[i10],
                        Model.anIntArray1689[i11],
                        Model.anIntArray1689[i12],
                        Model.anIntArray1690[i10],
                        Model.anIntArray1690[i11],
                        Model.anIntArray1690[i12],
                        Model.anIntArray1691[i10],
                        Model.anIntArray1691[i11],
                        Model.anIntArray1691[i12],
                        this.triangleColorValues[i]
                    );
                    return;
                }
                if (i8 === 3) {
                    const j9: number = this.texturePoints[i] >> 2;
                    const j10: number = this.texturedTrianglePointsX[j9];
                    const j11: number = this.texturedTrianglePointsY[j9];
                    const j12: number = this.texturedTrianglePointsZ[j9];
                    Rasterizer3D.method507(
                        i7,
                        j7,
                        k7,
                        j3,
                        j4,
                        j5,
                        this.anIntArray1656[i],
                        this.anIntArray1656[i],
                        this.anIntArray1656[i],
                        Model.anIntArray1689[j10],
                        Model.anIntArray1689[j11],
                        Model.anIntArray1689[j12],
                        Model.anIntArray1690[j10],
                        Model.anIntArray1690[j11],
                        Model.anIntArray1690[j12],
                        Model.anIntArray1691[j10],
                        Model.anIntArray1691[j11],
                        Model.anIntArray1691[j12],
                        this.triangleColorValues[i]
                    );
                    Rasterizer3D.method507(
                        i7,
                        k7,
                        Model.anIntArray1700[3],
                        j3,
                        j5,
                        Model.anIntArray1699[3],
                        this.anIntArray1656[i],
                        this.anIntArray1656[i],
                        this.anIntArray1656[i],
                        Model.anIntArray1689[j10],
                        Model.anIntArray1689[j11],
                        Model.anIntArray1689[j12],
                        Model.anIntArray1690[j10],
                        Model.anIntArray1690[j11],
                        Model.anIntArray1690[j12],
                        Model.anIntArray1691[j10],
                        Model.anIntArray1691[j11],
                        Model.anIntArray1691[j12],
                        this.triangleColorValues[i]
                    );
                }
            }
        }
    }

    public method602(i: number, j: number, k: number, l: number, i1: number, j1: number, k1: number, l1: number): boolean {
        if (j < k && j < l && j < i1) {
            return false;
        }
        if (j > k && j > l && j > i1) {
            return false;
        }
        if (i < j1 && i < k1 && i < l1) {
            return false;
        }
        return i <= j1 || i <= k1 || i <= l1;
    }
}

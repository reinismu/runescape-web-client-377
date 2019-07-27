export class ModelHeader {
    public modelData: number[];

    public vertexCount: number;

    public triangleCount: number;

    public texturedTriangleCount: number;

    public vertexDirectionOffset: number;

    public xDataOffset: number;

    public yDataOffset: number;

    public zDataOffset: number;

    public vertexSkinOffset: number;

    public triangleDataOffset: number;

    public triangleTypeOffset: number;

    public colorDataOffset: number;

    public texturePointerOffset: number;

    public trianglePriorityOffset: number;

    public triangleAlphaOffset: number;

    public triangleSkinOffset: number;

    public uvMapTriangleOffset: number;

    constructor() {
        if (this.modelData === undefined) { this.modelData = null; }
        if (this.vertexCount === undefined) { this.vertexCount = 0; }
        if (this.triangleCount === undefined) { this.triangleCount = 0; }
        if (this.texturedTriangleCount === undefined) { this.texturedTriangleCount = 0; }
        if (this.vertexDirectionOffset === undefined) { this.vertexDirectionOffset = 0; }
        if (this.xDataOffset === undefined) { this.xDataOffset = 0; }
        if (this.yDataOffset === undefined) { this.yDataOffset = 0; }
        if (this.zDataOffset === undefined) { this.zDataOffset = 0; }
        if (this.vertexSkinOffset === undefined) { this.vertexSkinOffset = 0; }
        if (this.triangleDataOffset === undefined) { this.triangleDataOffset = 0; }
        if (this.triangleTypeOffset === undefined) { this.triangleTypeOffset = 0; }
        if (this.colorDataOffset === undefined) { this.colorDataOffset = 0; }
        if (this.texturePointerOffset === undefined) { this.texturePointerOffset = 0; }
        if (this.trianglePriorityOffset === undefined) { this.trianglePriorityOffset = 0; }
        if (this.triangleAlphaOffset === undefined) { this.triangleAlphaOffset = 0; }
        if (this.triangleSkinOffset === undefined) { this.triangleSkinOffset = 0; }
        if (this.uvMapTriangleOffset === undefined) { this.uvMapTriangleOffset = 0; }
    }
}

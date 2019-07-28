export class TiledUtils {
    public static getRotatedMapChunkX(x: number, y: number, rotation: number): number {
        rotation &= 3;
        if (rotation === 0) { return x; }
        if (rotation === 1) { return y; }
        if (rotation === 2) { return 7 - x; } else { return 7 - y; }
    }

    public static getRotatedMapChunkY(x: number, y: number, rotation: number): number {
        rotation &= 3;
        if (rotation === 0) { return y; }
        if (rotation === 1) { return 7 - x; }
        if (rotation === 2) { return 7 - y; } else { return x; }
    }

    public static getRotatedLandscapeChunkX(rotation: number, objectSizeY: number, x: number, y: number, objectSizeX: number): number {
        rotation &= 3;
        if (rotation === 0) { return x; }
        if (rotation === 1) { return y; }
        if (rotation === 2) { return 7 - x - (objectSizeX - 1); } else { return 7 - y - (objectSizeY - 1); }
    }

    public static getRotatedLandscapeChunkY(y: number, objectSizeY: number, rotation: number, objectSizeX: number, x: number): number {
        rotation &= 3;
        if (rotation === 0) { return y; }
        if (rotation === 1) { return 7 - x - (objectSizeX - 1); }
        if (rotation === 2) { return 7 - y - (objectSizeY - 1); } else { return x; }
    }
}

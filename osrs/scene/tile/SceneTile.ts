import { Node } from "../../collection/Node";
import { CameraAngle } from "../CameraAngle";
import { SceneSpawnRequest } from "../SceneSpawnRequest";
import { ComplexTile } from "./ComplexTile";
import { FloorDecoration } from "./FloorDecoration";
import { GenericTile } from "./GenericTile";
import { Wall } from "./Wall";
import { WallDecoration } from "./WallDecoration";

export class SceneTile extends Node {

    public plane: number;

    public x: number;

    public y: number;

    public renderLevel: number;

    public paint: GenericTile;

    public complexTile: ComplexTile;

    public wall: Wall;

    public wallDecoration: WallDecoration;

    public floorDecoration: FloorDecoration;

    public cameraAngle: CameraAngle;

    public sceneSpawnRequestCount: number;

    public sceneSpawnRequests: SceneSpawnRequest[] = [null, null, null, null, null];

    public anIntArray1409: number[] = [0, 0, 0, 0, 0];

    public anInt1410: number;

    public anInt1411: number;

    public draw: boolean;

    public visible: boolean;

    public drawEntities: boolean;

    public wallCullDirection: number;

    public wallUncullDirection: number;

    public wallCullOppositeDirection: number;

    public wallDrawFlags: number;

    public bridge: SceneTile;
    public constructor(i: number, j: number, k: number) {
        super();
        if (this.plane === undefined) { this.plane = 0; }
        if (this.x === undefined) { this.x = 0; }
        if (this.y === undefined) { this.y = 0; }
        if (this.renderLevel === undefined) { this.renderLevel = 0; }
        if (this.paint === undefined) { this.paint = null; }
        if (this.complexTile === undefined) { this.complexTile = null; }
        if (this.wall === undefined) { this.wall = null; }
        if (this.wallDecoration === undefined) { this.wallDecoration = null; }
        if (this.floorDecoration === undefined) { this.floorDecoration = null; }
        if (this.cameraAngle === undefined) { this.cameraAngle = null; }
        if (this.sceneSpawnRequestCount === undefined) { this.sceneSpawnRequestCount = 0; }
        if (this.anInt1410 === undefined) { this.anInt1410 = 0; }
        if (this.anInt1411 === undefined) { this.anInt1411 = 0; }
        if (this.draw === undefined) { this.draw = false; }
        if (this.visible === undefined) { this.visible = false; }
        if (this.drawEntities === undefined) { this.drawEntities = false; }
        if (this.wallCullDirection === undefined) { this.wallCullDirection = 0; }
        if (this.wallUncullDirection === undefined) { this.wallUncullDirection = 0; }
        if (this.wallCullOppositeDirection === undefined) { this.wallCullOppositeDirection = 0; }
        if (this.wallDrawFlags === undefined) { this.wallDrawFlags = 0; }
        if (this.bridge === undefined) { this.bridge = null; }
        this.renderLevel = this.plane = i;
        this.x = j;
        this.y = k;
    }
}

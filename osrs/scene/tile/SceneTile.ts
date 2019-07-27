import { Node } from "../../collection/Node";
import { CameraAngle } from "../CameraAngle";
import { SceneSpawnRequest } from "../SceneSpawnRequest";
import { ComplexTile } from "./ComplexTile";
import { FloorDecoration } from "./FloorDecoration";
import { GenericTile } from "./GenericTile";
import { Wall } from "./Wall";
import { WallDecoration } from "./WallDecoration";

export class SceneTile extends Node {

    public anInt1397: number;

    public anInt1398: number;

    public anInt1399: number;

    public anInt1400: number;

    public genericTile: GenericTile;

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

    public aBoolean1412: boolean;

    public aBoolean1413: boolean;

    public aBoolean1414: boolean;

    public anInt1415: number;

    public anInt1416: number;

    public anInt1417: number;

    public anInt1418: number;

    public aClass50_Sub3_1419: SceneTile;
    public constructor(i: number, j: number, k: number) {
        super();
        if (this.anInt1397 === undefined) { this.anInt1397 = 0; }
        if (this.anInt1398 === undefined) { this.anInt1398 = 0; }
        if (this.anInt1399 === undefined) { this.anInt1399 = 0; }
        if (this.anInt1400 === undefined) { this.anInt1400 = 0; }
        if (this.genericTile === undefined) { this.genericTile = null; }
        if (this.complexTile === undefined) { this.complexTile = null; }
        if (this.wall === undefined) { this.wall = null; }
        if (this.wallDecoration === undefined) { this.wallDecoration = null; }
        if (this.floorDecoration === undefined) { this.floorDecoration = null; }
        if (this.cameraAngle === undefined) { this.cameraAngle = null; }
        if (this.sceneSpawnRequestCount === undefined) { this.sceneSpawnRequestCount = 0; }
        if (this.anInt1410 === undefined) { this.anInt1410 = 0; }
        if (this.anInt1411 === undefined) { this.anInt1411 = 0; }
        if (this.aBoolean1412 === undefined) { this.aBoolean1412 = false; }
        if (this.aBoolean1413 === undefined) { this.aBoolean1413 = false; }
        if (this.aBoolean1414 === undefined) { this.aBoolean1414 = false; }
        if (this.anInt1415 === undefined) { this.anInt1415 = 0; }
        if (this.anInt1416 === undefined) { this.anInt1416 = 0; }
        if (this.anInt1417 === undefined) { this.anInt1417 = 0; }
        if (this.anInt1418 === undefined) { this.anInt1418 = 0; }
        if (this.aClass50_Sub3_1419 === undefined) { this.aClass50_Sub3_1419 = null; }
        this.anInt1400 = this.anInt1397 = i;
        this.anInt1398 = j;
        this.anInt1399 = k;
    }
}

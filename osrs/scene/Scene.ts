import { Node } from "../collection/Node";
import { Rasterizer } from "../media/Rasterizer";
import { Rasterizer3D } from "../media/Rasterizer3D";
import { Model } from "../media/renderable/Model";
import { Renderable } from "../media/renderable/Renderable";
import { VertexNormal } from "../media/VertexNormal";
import { LinkedList } from "../util/LinkedList";
import { CameraAngle } from "./CameraAngle";
import { SceneCluster } from "./SceneCluster";
import { SceneSpawnRequest } from "./SceneSpawnRequest";
import { ComplexTile } from "./tile/ComplexTile";
import { FloorDecoration } from "./tile/FloorDecoration";
import { GenericTile } from "./tile/GenericTile";
import { SceneTile } from "./tile/SceneTile";
import { Wall } from "./tile/Wall";
import { WallDecoration } from "./tile/WallDecoration";

export class Scene {
    public static anInt444: number = 0;

    public static lowMemory: boolean = true;

    public static anInt461: number = 0;

    public static anInt462: number = 0;

    public static cycle: number = 0;

    public static anInt464: number = 0;

    public static anInt465: number = 0;

    public static anInt466: number = 0;

    public static anInt467: number = 0;

    public static screenCenterX: number = 0;

    public static screenCenterZ: number = 0;

    public static cameraX2: number = 0;

    public static cameraY2: number = 0;

    public static cameraZ2: number = 0;

    public static pitchSin: number = 0;

    public static pitchCos: number = 0;

    public static yawSin: number = 0;

    public static yawCos: number = 0;

    public static entityBuffer: SceneSpawnRequest[] = Array(100).fill(null);
    public static anIntArray478: number[] = [53, -53, -53, 53];
    public static anIntArray479: number[] = [-53, -53, 53, 53];
    public static anIntArray480: number[] = [-45, 45, 45, -45];
    public static anIntArray481: number[] = [45, 45, -45, -45];
    public static aBoolean482: boolean = false;

    public static anInt483: number = 0;

    public static anInt484: number = 0;

    public static clickedTileX: number = -1;

    public static anInt486: number = -1;

    public static anInt487: number = 4;

    public static anIntArray488: number[] = Array(Scene.anInt487).fill(0);
    public static aSceneClusterArrayArray554: SceneCluster[][] = Array(Scene.anInt487).fill(Array(500).fill(null));
    public static anInt490: number = 0;

    public static aClass39Array491: SceneCluster[] = Array(500).fill(null);
    public static tileList: LinkedList = new LinkedList();
    public static anIntArray493: number[] = [19, 55, 38, 155, 255, 110, 137, 205, 76];
    public static anIntArray494: number[] = [160, 192, 80, 96, 0, 144, 80, 48, 160];
    public static TILE_WALL_DRAW_FLAGS_1: number[] = [76, 8, 137, 4, 0, 1, 38, 2, 19];
    public static WALL_UNCULL_FLAGS_0: number[] = [0, 0, 2, 0, 0, 2, 1, 1, 0];
    public static anIntArray497: number[] = [2, 0, 0, 2, 0, 0, 0, 4, 4];
    public static anIntArray498: number[] = [0, 4, 4, 8, 0, 0, 8, 0, 0];
    public static anIntArray499: number[] = [1, 1, 0, 0, 0, 8, 0, 0, 8];
    public static anIntArray500: number[] = [
        41,
        39248,
        41,
        4643,
        41,
        41,
        41,
        41,
        41,
        41,
        41,
        41,
        41,
        41,
        41,
        43086,
        41,
        41,
        41,
        41,
        41,
        41,
        41,
        8602,
        41,
        28992,
        41,
        41,
        41,
        41,
        41,
        5056,
        41,
        41,
        41,
        7079,
        41,
        41,
        41,
        41,
        41,
        41,
        41,
        41,
        41,
        41,
        3131,
        41,
        41,
        41
    ];
    public static aBooleanArrayArrayArrayArray506: boolean[][][][] = Array(8).fill(Array(32).fill(Array(51).fill(Array(51).fill(false))));
    public static aBooleanArrayArray507: boolean[][] = null;

    public static anInt508: number = 0;

    public static anInt509: number = 0;

    public static anInt510: number = 0;

    public static anInt511: number = 0;

    public static anInt512: number = 0;

    public static anInt513: number = 0;

    public static method240() {
        Scene.entityBuffer = null;
        Scene.anIntArray488 = null;
        Scene.aSceneClusterArrayArray554 = null;
        Scene.tileList = null;
        Scene.aBooleanArrayArrayArrayArray506 = null;
        Scene.aBooleanArrayArray507 = null;
    }

    public static createCullingOcclussionBox(j: number, k: number, l: number, i1: number, j1: number, k1: number, l1: number, i2: number) {
        const scenecluster: SceneCluster = new SceneCluster();
        scenecluster.anInt675 = (j / 128) | 0;
        scenecluster.anInt676 = (l / 128) | 0;
        scenecluster.anInt677 = (k1 / 128) | 0;
        scenecluster.anInt678 = (i1 / 128) | 0;
        scenecluster.anInt679 = i2;
        scenecluster.anInt680 = j;
        scenecluster.anInt681 = l;
        scenecluster.anInt682 = k1;
        scenecluster.anInt683 = i1;
        scenecluster.anInt684 = l1;
        scenecluster.anInt685 = k;
        Scene.aSceneClusterArrayArray554[j1][Scene.anIntArray488[j1]++] = scenecluster;
    }

    public static method277(l: number, k: number, i1: number, i: number, ai: number[]) {
        Scene.anInt510 = 0;
        Scene.anInt511 = 0;
        Scene.anInt512 = i1;
        Scene.anInt513 = i;
        Scene.anInt508 = (i1 / 2) | 0;
        Scene.anInt509 = (i / 2) | 0;
        const aflag: boolean[][][][] = (function(dims) {
            const allocate = function(dims) {
                if (dims.length == 0) {
                    return false;
                } else {
                    const array = [];
                    for (let i = 0; i < dims[0]; i++) {
                        array.push(allocate(dims.slice(1)));
                    }
                    return array;
                }
            };
            return allocate(dims);
        })([9, 32, 53, 53]) as any;
        for (let j1: number = 128; j1 <= 384; j1 += 32) {
            {
                for (let k1: number = 0; k1 < 2048; k1 += 64) {
                    {
                        Scene.pitchSin = Model.SINE[j1];
                        Scene.pitchCos = Model.COSINE[j1];
                        Scene.yawSin = Model.SINE[k1];
                        Scene.yawCos = Model.COSINE[k1];
                        const i2: number = ((j1 - 128) / 32) | 0;
                        const k2: number = (k1 / 64) | 0;
                        for (let i3: number = -26; i3 <= 26; i3++) {
                            {
                                for (let k3: number = -26; k3 <= 26; k3++) {
                                    {
                                        const l3: number = i3 * 128;
                                        const j4: number = k3 * 128;
                                        let flag1: boolean = false;
                                        for (let l4: number = -l; l4 <= k; l4 += 128) {
                                            {
                                                if (!Scene.method278(j4, l3, Scene.anInt444, ai[i2] + l4)) {
                                                    continue;
                                                }
                                                flag1 = true;
                                                break;
                                            }
                                        }
                                        aflag[i2][k2][i3 + 25 + 1][k3 + 25 + 1] = flag1;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        for (let l1: number = 0; l1 < 8; l1++) {
            {
                for (let j2: number = 0; j2 < 32; j2++) {
                    {
                        for (let l2: number = -25; l2 < 25; l2++) {
                            {
                                for (let j3: number = -25; j3 < 25; j3++) {
                                    {
                                        let flag: boolean = false;
                                        label0: for (let i4: number = -1; i4 <= 1; i4++) {
                                            {
                                                for (let k4: number = -1; k4 <= 1; k4++) {
                                                    {
                                                        if (aflag[l1][j2][l2 + i4 + 25 + 1][j3 + k4 + 25 + 1]) {
                                                            flag = true;
                                                        } else if (aflag[l1][(j2 + 1) % 31][l2 + i4 + 25 + 1][j3 + k4 + 25 + 1]) {
                                                            flag = true;
                                                        } else if (aflag[l1 + 1][j2][l2 + i4 + 25 + 1][j3 + k4 + 25 + 1]) {
                                                            flag = true;
                                                        } else {
                                                            if (!aflag[l1 + 1][(j2 + 1) % 31][l2 + i4 + 25 + 1][j3 + k4 + 25 + 1]) {
                                                                continue;
                                                            }
                                                            flag = true;
                                                        }
                                                        break label0;
                                                    }
                                                }
                                            }
                                        }
                                        Scene.aBooleanArrayArrayArrayArray506[l1][j2][l2 + 25][j3 + 25] = flag;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    public static method278(i: number, j: number, k: number, l: number): boolean {
        const i1: number = (i * Scene.yawSin + j * Scene.yawCos) >> 16;
        const j1: number = (i * Scene.yawCos - j * Scene.yawSin) >> 16;
        const k1: number = (l * Scene.pitchSin + j1 * Scene.pitchCos) >> 16;
        const l1: number = (l * Scene.pitchCos - j1 * Scene.pitchSin) >> 16;
        if (k1 < 50 || k1 > 3500) {
            return false;
        }
        const i2: number = Scene.anInt508 + (((i1 << 9) / k1) | 0);
        const j2: number = Scene.anInt509 + (((l1 << 9) / k1) | 0);
        return i2 >= Scene.anInt510 && i2 <= Scene.anInt512 && j2 >= Scene.anInt511 && j2 <= Scene.anInt513;
    }

    public anInt450: number;

    public anInt452: number;

    public anInt453: number;

    public anInt454: number;

    public anIntArrayArrayArray455: number[][][];

    public tiles: SceneTile[][][];

    public anInt457: number;

    public anInt458: number;

    public sceneSpawnRequests: SceneSpawnRequest[];

    public anIntArrayArrayArray460: number[][][];

    public anIntArray501: number[];

    public anIntArray502: number[];

    public anInt503: number;

    public anIntArrayArray504: number[][] = [
        (s => {
            const a = [];
            while (s-- > 0) {
                a.push(0);
            }
            return a;
        })(16),
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 1, 1],
        [1, 1, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
        [0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 1],
        [0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0],
        [1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 0, 1, 1],
        [1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 1]
    ];

    public anIntArrayArray505: number[][] = [
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
        [12, 8, 4, 0, 13, 9, 5, 1, 14, 10, 6, 2, 15, 11, 7, 3],
        [15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
        [3, 7, 11, 15, 2, 6, 10, 14, 1, 5, 9, 13, 0, 4, 8, 12]
    ];

    public constructor(ai: number[][][], i: number, j: number, k: number, byte0: number) {
        if (this.anInt450 === undefined) {
            this.anInt450 = 0;
        }
        if (this.anInt452 === undefined) {
            this.anInt452 = 0;
        }
        if (this.anInt453 === undefined) {
            this.anInt453 = 0;
        }
        if (this.anInt454 === undefined) {
            this.anInt454 = 0;
        }
        if (this.anIntArrayArrayArray455 === undefined) {
            this.anIntArrayArrayArray455 = null;
        }
        if (this.tiles === undefined) {
            this.tiles = null;
        }
        if (this.anInt457 === undefined) {
            this.anInt457 = 0;
        }
        if (this.anInt458 === undefined) {
            this.anInt458 = 0;
        }
        if (this.sceneSpawnRequests === undefined) {
            this.sceneSpawnRequests = null;
        }
        if (this.anIntArrayArrayArray460 === undefined) {
            this.anIntArrayArrayArray460 = null;
        }
        if (this.anIntArray501 === undefined) {
            this.anIntArray501 = null;
        }
        if (this.anIntArray502 === undefined) {
            this.anIntArray502 = null;
        }
        if (this.anInt503 === undefined) {
            this.anInt503 = 0;
        }
        this.sceneSpawnRequests = Array(5000).fill(null);
        this.anIntArray501 = Array(10000).fill(0);
        this.anIntArray502 = Array(10000).fill(0);
        this.anInt452 = j;
        this.anInt453 = k;
        this.anInt454 = i;
        this.tiles = (function(dims) {
            const allocate = function(dims) {
                if (dims.length == 0) {
                    return null;
                } else {
                    const array = [];
                    for (let i = 0; i < dims[0]; i++) {
                        array.push(allocate(dims.slice(1)));
                    }
                    return array;
                }
            };
            return allocate(dims);
        })([j, k, i]) as any;
        this.anIntArrayArrayArray460 = (function(dims) {
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
        })([j, k + 1, i + 1]) as any;
        this.anIntArrayArrayArray455 = ai;
        this.method241();
    }

    public method241() {
        for (let i: number = 0; i < this.anInt452; i++) {
            {
                for (let j: number = 0; j < this.anInt453; j++) {
                    {
                        for (let i1: number = 0; i1 < this.anInt454; i1++) {
                            this.tiles[i][j][i1] = null;
                        }
                    }
                }
            }
        }
        for (let l: number = 0; l < Scene.anInt487; l++) {
            {
                for (let j1: number = 0; j1 < Scene.anIntArray488[l]; j1++) {
                    Scene.aSceneClusterArrayArray554[l][j1] = null;
                }
                Scene.anIntArray488[l] = 0;
            }
        }
        for (let k1: number = 0; k1 < this.anInt458; k1++) {
            this.sceneSpawnRequests[k1] = null;
        }
        this.anInt458 = 0;
        for (let l1: number = 0; l1 < Scene.entityBuffer.length; l1++) {
            Scene.entityBuffer[l1] = null;
        }
    }

    public method242(i: number) {
        this.anInt457 = i;
        for (let j: number = 0; j < this.anInt453; j++) {
            {
                for (let k: number = 0; k < this.anInt454; k++) {
                    if (this.tiles[i][j][k] == null) {
                        this.tiles[i][j][k] = new SceneTile(i, j, k);
                    }
                }
            }
        }
    }

    public setBridgeMode(i: number, j: number) {
        const scenetile: SceneTile = this.tiles[0][i][j];
        for (let k: number = 0; k < 3; k++) {
            {
                const scenetile_15_: SceneTile = (this.tiles[k][i][j] = this.tiles[k + 1][i][j]);
                if (scenetile_15_ != null) {
                    scenetile_15_.plane--;
                    for (let i1: number = 0; i1 < scenetile_15_.sceneSpawnRequestCount; i1++) {
                        {
                            const sceneSpawnRequest: SceneSpawnRequest = scenetile_15_.sceneSpawnRequests[i1];
                            if (((sceneSpawnRequest.hash >> 29) & 3) === 2 && sceneSpawnRequest.relativeX === i && sceneSpawnRequest.relativeY === j) {
                                sceneSpawnRequest.anInt113--;
                            }
                        }
                    }
                }
            }
        }
        if (this.tiles[0][i][j] == null) {
            this.tiles[0][i][j] = new SceneTile(0, i, j);
        }
        this.tiles[0][i][j].bridge = scenetile;
        this.tiles[3][i][j] = null;
    }

    public method245(i: number, j: number, k: number, l: number) {
        const sceneTile: SceneTile = this.tiles[i][j][k];
        if (sceneTile != null) {
            sceneTile.anInt1411 = l;
        }
    }

    public method246(
        i: number,
        j: number,
        k: number,
        l: number,
        i1: number,
        j1: number,
        k1: number,
        l1: number,
        i2: number,
        j2: number,
        k2: number,
        l2: number,
        i3: number,
        j3: number,
        k3: number,
        l3: number,
        i4: number,
        j4: number,
        k4: number,
        l4: number
    ) {
        if (l === 0) {
            const genericTile: GenericTile = new GenericTile(k2, l2, i3, j3, -1, k4, false);
            for (let i5: number = i; i5 >= 0; i5--) {
                if (this.tiles[i5][j][k] == null) {
                    this.tiles[i5][j][k] = new SceneTile(i5, j, k);
                }
            }
            this.tiles[i][j][k].paint = genericTile;
            return;
        }
        if (l === 1) {
            const genericTile_1: GenericTile = new GenericTile(k3, l3, i4, j4, j1, l4, k1 === l1 && k1 === i2 && k1 === j2);
            for (let j5: number = i; j5 >= 0; j5--) {
                if (this.tiles[j5][j][k] == null) {
                    this.tiles[j5][j][k] = new SceneTile(j5, j, k);
                }
            }
            this.tiles[i][j][k].paint = genericTile_1;
            return;
        }
        const complexTile: ComplexTile = new ComplexTile(j2, k3, i2, k1, j, i3, j3, l4, l2, i4, 0, k2, l, l1, j4, j1, k4, l3, k, i1);
        for (let k5: number = i; k5 >= 0; k5--) {
            if (this.tiles[k5][j][k] == null) {
                this.tiles[k5][j][k] = new SceneTile(k5, j, k);
            }
        }
        this.tiles[i][j][k].complexTile = complexTile;
    }

    public addGroundDecoration(i: number, j: number, k: number, byte0: number, l: number, i1: number, j1: number, renderable: Renderable) {
        if (k <= 0) {
            return;
        }
        if (renderable == null) {
            return;
        }
        const floorDecoration: FloorDecoration = new FloorDecoration();
        floorDecoration.renderable = renderable;
        floorDecoration.y = i * 128 + 64;
        floorDecoration.z = j * 128 + 64;
        floorDecoration.x = i1;
        floorDecoration.hash = l;
        floorDecoration.config = byte0;
        if (this.tiles[j1][i][j] == null) {
            this.tiles[j1][i][j] = new SceneTile(j1, i, j);
        }
        this.tiles[j1][i][j].floorDecoration = floorDecoration;
    }

    public method248(
        i: number,
        plane: number,
        renderable_59_: Renderable,
        renderable: Renderable,
        k: number,
        renderable_58_: Renderable,
        l: number,
        y: number,
        x: number
    ) {
        const cameraAngle: CameraAngle = new CameraAngle();
        cameraAngle.aRenderable150 = renderable_59_;
        cameraAngle.y = x * 128 + 64;
        cameraAngle.z = y * 128 + 64;
        cameraAngle.x = i;
        cameraAngle.anInt179 = k;
        cameraAngle.aRenderable151 = renderable;
        cameraAngle.aRenderable152 = renderable_58_;
        let k1: number = 0;
        const sceneTile: SceneTile = this.tiles[plane][x][y];
        if (sceneTile != null) {
            for (let l1: number = 0; l1 < sceneTile.sceneSpawnRequestCount; l1++) {
                if (
                    sceneTile.sceneSpawnRequests[l1].renderable != null &&
                    ((sceneTile.sceneSpawnRequests[l1].renderable instanceof Model) as any)
                ) {
                    const i2: number = (sceneTile.sceneSpawnRequests[l1].renderable as Model).anInt1675;
                    if (i2 > k1) {
                        k1 = i2;
                    }
                }
            }
        }
        cameraAngle.anInt180 = k1;
        if (this.tiles[plane][x][y] == null) {
            this.tiles[plane][x][y] = new SceneTile(plane, x, y);
        }
        this.tiles[plane][x][y].cameraAngle = cameraAngle;
    }

    public method249(
        faceUnknown: number,
        renderable: Renderable,
        hash: number,
        y: number,
        config: number,
        x: number,
        renderable_68_: Renderable,
        plane: number,
        face: number,
        l1: number
    ) {
        if (renderable != null || renderable_68_ != null) {
            const wall: Wall = new Wall();
            wall.hash = hash;
            wall.config = config;
            wall.x = x * 128 + 64;
            wall.y = y * 128 + 64;
            wall.plane = plane;
            wall.aRenderable769 = renderable;
            wall.aRenderable770 = renderable_68_;
            wall.orientationA = faceUnknown;
            wall.face = face;
            for (let j2: number = l1; j2 >= 0; j2--) {
                if (this.tiles[j2][x][y] == null) {
                    this.tiles[j2][x][y] = new SceneTile(j2, x, y);
                }
            }
            this.tiles[l1][x][y].wall = wall;
        }
    }

    public addWallDecoration(
        plane: number,
        faceUnknown: number,
        face: number,
        hash: number,
        config: number,
        x: number,
        j1: number,
        y: number,
        l1: number,
        z: number,
        renderable: Renderable,
        j2: number
    ) {
        if (renderable != null) {
            const wallDecoration: WallDecoration = new WallDecoration();
            wallDecoration.hash = hash;
            wallDecoration.config = config;
            wallDecoration.y = x * 128 + 64 + l1;
            wallDecoration.x = y * 128 + 64 + j1;
            wallDecoration.plane = z;
            wallDecoration.renderable = renderable;
            wallDecoration.faceUnknown = faceUnknown;
            wallDecoration.face = face;
            for (let planeCounter: number = plane; planeCounter >= 0; planeCounter--) {
                if (this.tiles[planeCounter][x][y] == null) {
                    this.tiles[planeCounter][x][y] = new SceneTile(planeCounter, x, y);
                }
            }
            this.tiles[plane][x][y].wallDecoration = wallDecoration;
        }
    }

    public method251(
        i: number,
        j: number,
        k: number,
        class50_sub1_sub4: Renderable,
        byte0: number,
        l: number,
        i1: number,
        j1: number,
        k1: number,
        l1: number,
        i2: number
    ): boolean {
        while (j1 >= 0) {
            throw Error("NullPointerException()");
        }
        if (class50_sub1_sub4 == null) {
            return true;
        } else {
            const j2: number = i1 * 128 + 64 * j;
            const k2: number = k * 128 + 64 * k1;
            return this.addSceneSpawnRequest(i, i1, k, j, k1, j2, k2, l1, class50_sub1_sub4, l, false, i2, byte0);
        }
    }

    public addEntity(
        i: number,
        entity: Renderable,
        x: number,
        z: number,
        flag: boolean,
        l: number,
        plane: number,
        j1: number,
        y: number,
        l1: number
    ): boolean {
        if (entity == null) {
            return true;
        }
        let i2: number = x - j1;
        let j2: number = y - j1;
        let k2: number = x + j1;
        let l2: number = y + j1;
        if (flag) {
            if (l1 > 640 && l1 < 1408) {
                l2 += 128;
            }
            if (l1 > 1152 && l1 < 1920) {
                k2 += 128;
            }
            if (l1 > 1664 || l1 < 384) {
                j2 -= 128;
            }
            if (l1 > 128 && l1 < 896) {
                i2 -= 128;
            }
        }
        i2 = (n => (n < 0 ? Math.ceil(n) : Math.floor(n)))(i2 / 128);
        j2 = (n => (n < 0 ? Math.ceil(n) : Math.floor(n)))(j2 / 128);
        k2 = (n => (n < 0 ? Math.ceil(n) : Math.floor(n)))(k2 / 128);
        l2 = (n => (n < 0 ? Math.ceil(n) : Math.floor(n)))(l2 / 128);
        return this.addSceneSpawnRequest(plane, i2, j2, k2 - i2 + 1, l2 - j2 + 1, x, y, z, entity, l1, true, i, (0 as number) | 0);
    }

    public addRenderable(
        i: number,
        j: number,
        k: number,
        l: number,
        renderable: Renderable,
        i1: number,
        j1: number,
        k1: number,
        l1: number,
        i2: number,
        j2: number,
        k2: number,
        l2: number
    ): boolean {
        if (renderable == null) {
            return true;
        } else {
            return this.addSceneSpawnRequest(k2, i1, j, j2 - i1 + 1, k1 - j + 1, l1, j1, i, renderable, i2, true, l2, 0);
        }
    }

    public addSceneSpawnRequest(
        i: number,
        j: number,
        k: number,
        l: number,
        i1: number,
        x: number,
        y: number,
        z: number,
        renderable: Renderable,
        i2: number,
        flag: boolean,
        j2: number,
        byte0: number
    ): boolean {
        for (let k2: number = j; k2 < j + l; k2++) {
            {
                for (let l2: number = k; l2 < k + i1; l2++) {
                    {
                        if (k2 < 0 || l2 < 0 || k2 >= this.anInt453 || l2 >= this.anInt454) {
                            return false;
                        }
                        const class50_sub3: SceneTile = this.tiles[i][k2][l2];
                        if (class50_sub3 != null && class50_sub3.sceneSpawnRequestCount >= 5) {
                            return false;
                        }
                    }
                }
            }
        }
        const sceneSpawnRequest: SceneSpawnRequest = new SceneSpawnRequest();
        sceneSpawnRequest.hash = j2;
        sceneSpawnRequest.config = byte0;
        sceneSpawnRequest.anInt113 = i;
        sceneSpawnRequest.x = x;
        sceneSpawnRequest.y = y;
        sceneSpawnRequest.tileHeight = z;
        sceneSpawnRequest.renderable = renderable;
        sceneSpawnRequest.anInt118 = i2;
        sceneSpawnRequest.relativeX = j;
        sceneSpawnRequest.relativeY = k;
        sceneSpawnRequest.offsetX = j + l - 1;
        sceneSpawnRequest.offsetY = k + i1 - 1;
        for (let i3: number = j; i3 < j + l; i3++) {
            {
                for (let j3: number = k; j3 < k + i1; j3++) {
                    {
                        let k3: number = 0;
                        if (i3 > j) {
                            k3++;
                        }
                        if (i3 < j + l - 1) {
                            k3 += 4;
                        }
                        if (j3 > k) {
                            k3 += 8;
                        }
                        if (j3 < k + i1 - 1) {
                            k3 += 2;
                        }
                        for (let l3: number = i; l3 >= 0; l3--) {
                            if (this.tiles[l3][i3][j3] == null) {
                                this.tiles[l3][i3][j3] = new SceneTile(l3, i3, j3);
                            }
                        }
                        const sceneTile: SceneTile = this.tiles[i][i3][j3];
                        sceneTile.sceneSpawnRequests[sceneTile.sceneSpawnRequestCount] = sceneSpawnRequest;
                        sceneTile.anIntArray1409[sceneTile.sceneSpawnRequestCount] = k3;
                        sceneTile.anInt1410 |= k3;
                        sceneTile.sceneSpawnRequestCount++;
                    }
                }
            }
        }
        if (flag) {
            this.sceneSpawnRequests[this.anInt458++] = sceneSpawnRequest;
        }
        return true;
    }

    public method255() {
        for (let j: number = 0; j < this.anInt458; j++) {
            {
                const sceneSpawnRequest: SceneSpawnRequest = this.sceneSpawnRequests[j];
                this.method256(sceneSpawnRequest);
                this.sceneSpawnRequests[j] = null;
            }
        }
        this.anInt458 = 0;
    }

    public method256(sceneSpawnRequest: SceneSpawnRequest) {
        for (let j: number = sceneSpawnRequest.relativeX; j <= sceneSpawnRequest.offsetX; j++) {
            {
                for (let k: number = sceneSpawnRequest.relativeY; k <= sceneSpawnRequest.offsetY; k++) {
                    {
                        const class50_sub3: SceneTile = this.tiles[sceneSpawnRequest.anInt113][j][k];
                        if (class50_sub3 != null) {
                            for (let l: number = 0; l < class50_sub3.sceneSpawnRequestCount; l++) {
                                {
                                    if (class50_sub3.sceneSpawnRequests[l] !== sceneSpawnRequest) {
                                        continue;
                                    }
                                    class50_sub3.sceneSpawnRequestCount--;
                                    for (let i1: number = l; i1 < class50_sub3.sceneSpawnRequestCount; i1++) {
                                        {
                                            class50_sub3.sceneSpawnRequests[i1] = class50_sub3.sceneSpawnRequests[i1 + 1];
                                            class50_sub3.anIntArray1409[i1] = class50_sub3.anIntArray1409[i1 + 1];
                                        }
                                    }
                                    class50_sub3.sceneSpawnRequests[class50_sub3.sceneSpawnRequestCount] = null;
                                    break;
                                }
                            }
                            class50_sub3.anInt1410 = 0;
                            for (let j1: number = 0; j1 < class50_sub3.sceneSpawnRequestCount; j1++) {
                                class50_sub3.anInt1410 |= class50_sub3.anIntArray1409[j1];
                            }
                        }
                    }
                }
            }
        }
    }

    public method257(i: number, j: number, k: number, l: number) {
        const sceneTile: SceneTile = this.tiles[k][l][i];
        if (sceneTile == null) {
            return;
        }
        const wallDecoration: WallDecoration = sceneTile.wallDecoration;
        if (wallDecoration == null) {
            return;
        }
        const j1: number = l * 128 + 64;
        const k1: number = i * 128 + 64;
        wallDecoration.y = j1 + ((((wallDecoration.y - j1) * j) / 16) | 0);
        wallDecoration.x = k1 + ((((wallDecoration.x - k1) * j) / 16) | 0);
    }

    public method258(i: number, j: number, k: number, flag: boolean) {
        const class50_sub3: SceneTile = this.tiles[j][k][i];
        if (class50_sub3 == null) {
            return;
        }
        class50_sub3.wall = null;
    }

    public method259(flag: boolean, i: number, j: number, k: number) {
        const class50_sub3: SceneTile = this.tiles[k][i][j];
        if (flag) {
            return;
        }
        if (class50_sub3 == null) {
            return;
        } else {
            class50_sub3.wallDecoration = null;
            return;
        }
    }

    public method260(i: number, j: number, k: number, l: number) {
        if (k >= 0) {
            return;
        }
        const class50_sub3: SceneTile = this.tiles[j][l][i];
        if (class50_sub3 == null) {
            return;
        }
        for (let i1: number = 0; i1 < class50_sub3.sceneSpawnRequestCount; i1++) {
            {
                const sceneSpawnRequest: SceneSpawnRequest = class50_sub3.sceneSpawnRequests[i1];
                if (((sceneSpawnRequest.hash >> 29) & 3) === 2 && sceneSpawnRequest.relativeX === l && sceneSpawnRequest.relativeY === i) {
                    this.method256(sceneSpawnRequest);
                    return;
                }
            }
        }
    }

    public method261(i: number, j: number, flag: boolean, k: number) {
        const class50_sub3: SceneTile = this.tiles[k][i][j];
        if (class50_sub3 == null) {
            return;
        }
        class50_sub3.floorDecoration = null;
        if (!flag) {
            for (let l: number = 1; l > 0; l++) {}
        }
    }

    public clearGroundItem(i: number, j: number, k: number) {
        const class50_sub3: SceneTile = this.tiles[i][j][k];
        if (class50_sub3 == null) {
            return;
        } else {
            class50_sub3.cameraAngle = null;
            return;
        }
    }

    public method263(i: number, j: number, k: number, l: number): Wall {
        const class50_sub3: SceneTile = this.tiles[i][k][l];
        if (j !== 17734) {
            throw Error("NullPointerException()");
        }
        if (class50_sub3 == null) {
            return null;
        } else {
            return class50_sub3.wall;
        }
    }

    public method264(i: number, j: number, k: number, flag: boolean): WallDecoration {
        const class50_sub3: SceneTile = this.tiles[i][k][j];
        if (flag) {
            throw Error("NullPointerException()");
        }
        if (class50_sub3 == null) {
            return null;
        } else {
            return class50_sub3.wallDecoration;
        }
    }

    public method265(i: number, byte0: number, j: number, k: number): SceneSpawnRequest {
        if (byte0 !== 32) {
            for (let l: number = 1; l > 0; l++) {}
        }
        const class50_sub3: SceneTile = this.tiles[k][i][j];
        if (class50_sub3 == null) {
            return null;
        }
        for (let i1: number = 0; i1 < class50_sub3.sceneSpawnRequestCount; i1++) {
            {
                const sceneSpawnRequest: SceneSpawnRequest = class50_sub3.sceneSpawnRequests[i1];
                if (((sceneSpawnRequest.hash >> 29) & 3) === 2 && sceneSpawnRequest.relativeX === i && sceneSpawnRequest.relativeY === j) {
                    return sceneSpawnRequest;
                }
            }
        }
        return null;
    }

    public method266(i: number, j: number, k: number, l: number): FloorDecoration {
        if (k !== 0) {
            throw Error("NullPointerException()");
        }
        const class50_sub3: SceneTile = this.tiles[i][l][j];
        if (class50_sub3 == null || class50_sub3.floorDecoration == null) {
            return null;
        } else {
            return class50_sub3.floorDecoration;
        }
    }

    public method267(i: number, j: number, k: number): number {
        const class50_sub3: SceneTile = this.tiles[i][j][k];
        if (class50_sub3 == null || class50_sub3.wall == null) {
            return 0;
        } else {
            return class50_sub3.wall.hash;
        }
    }

    public method268(i: number, byte0: number, j: number, k: number): number {
        const class50_sub3: SceneTile = this.tiles[j][i][k];
        if (class50_sub3 == null || class50_sub3.wallDecoration == null) {
            return 0;
        } else {
            return class50_sub3.wallDecoration.hash;
        }
    }

    public method269(i: number, j: number, k: number): number {
        const class50_sub3: SceneTile = this.tiles[i][j][k];
        if (class50_sub3 == null) {
            return 0;
        }
        for (let l: number = 0; l < class50_sub3.sceneSpawnRequestCount; l++) {
            {
                const sceneSpawnRequest: SceneSpawnRequest = class50_sub3.sceneSpawnRequests[l];
                if (((sceneSpawnRequest.hash >> 29) & 3) === 2 && sceneSpawnRequest.relativeX === j && sceneSpawnRequest.relativeY === k) {
                    return sceneSpawnRequest.hash;
                }
            }
        }
        return 0;
    }

    public getFloorDecorationHash(i: number, j: number, k: number): number {
        const class50_sub3: SceneTile = this.tiles[i][j][k];
        if (class50_sub3 == null || class50_sub3.floorDecoration == null) {
            return 0;
        } else {
            return class50_sub3.floorDecoration.hash;
        }
    }

    public method271(i: number, j: number, k: number, l: number): number {
        const class50_sub3: SceneTile = this.tiles[i][j][k];
        if (class50_sub3 == null) {
            return -1;
        }
        if (class50_sub3.wall != null && class50_sub3.wall.hash === l) {
            return class50_sub3.wall.config & 255;
        }
        if (class50_sub3.wallDecoration != null && class50_sub3.wallDecoration.hash === l) {
            return class50_sub3.wallDecoration.config & 255;
        }
        if (class50_sub3.floorDecoration != null && class50_sub3.floorDecoration.hash === l) {
            return class50_sub3.floorDecoration.config & 255;
        }
        for (let i1: number = 0; i1 < class50_sub3.sceneSpawnRequestCount; i1++) {
            if (class50_sub3.sceneSpawnRequests[i1].hash === l) {
                return class50_sub3.sceneSpawnRequests[i1].config & 255;
            }
        }
        return -1;
    }

    public method272(byte0: number, i: number, j: number, k: number) {
        for (let l: number = 0; l < this.anInt452; l++) {
            {
                for (let i1: number = 0; i1 < this.anInt453; i1++) {
                    {
                        for (let j1: number = 0; j1 < this.anInt454; j1++) {
                            {
                                const class50_sub3: SceneTile = this.tiles[l][i1][j1];
                                if (class50_sub3 != null) {
                                    const wall: Wall = class50_sub3.wall;
                                    if (wall != null && wall.aRenderable769 != null && wall.aRenderable769.verticesNormal != null) {
                                        this.method274(j1, l, 0, 1, wall.aRenderable769 as Model, i1, 1);
                                        if (wall.aRenderable770 != null && wall.aRenderable770.verticesNormal != null) {
                                            this.method274(j1, l, 0, 1, wall.aRenderable770 as Model, i1, 1);
                                            this.method275(wall.aRenderable769 as Model, wall.aRenderable770 as Model, 0, 0, 0, false);
                                            (wall.aRenderable770 as Model).method595(i, j, 0, k);
                                        }
                                        (wall.aRenderable769 as Model).method595(i, j, 0, k);
                                    }
                                    for (let k1: number = 0; k1 < class50_sub3.sceneSpawnRequestCount; k1++) {
                                        {
                                            const sceneSpawnRequest: SceneSpawnRequest = class50_sub3.sceneSpawnRequests[k1];
                                            if (
                                                sceneSpawnRequest != null &&
                                                sceneSpawnRequest.renderable != null &&
                                                sceneSpawnRequest.renderable.verticesNormal != null
                                            ) {
                                                this.method274(
                                                    j1,
                                                    l,
                                                    0,
                                                    sceneSpawnRequest.offsetX - sceneSpawnRequest.relativeX + 1,
                                                    sceneSpawnRequest.renderable as Model,
                                                    i1,
                                                    sceneSpawnRequest.offsetY - sceneSpawnRequest.relativeY + 1
                                                );
                                                (sceneSpawnRequest.renderable as Model).method595(i, j, 0, k);
                                            }
                                        }
                                    }
                                    const floorDecoration: FloorDecoration = class50_sub3.floorDecoration;
                                    if (floorDecoration != null && floorDecoration.renderable.verticesNormal != null) {
                                        this.method273(i1, floorDecoration.renderable as Model, j1, l, 0);
                                        (floorDecoration.renderable as Model).method595(i, j, 0, k);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        if (byte0 === 2) {
            byte0 = 0;
        }
    }

    public method273(i: number, class50_sub1_sub4_sub4: Model, j: number, k: number, l: number) {
        if (l !== 0) {
            return;
        }
        if (i < this.anInt453) {
            const class50_sub3: SceneTile = this.tiles[k][i + 1][j];
            if (
                class50_sub3 != null &&
                class50_sub3.floorDecoration != null &&
                class50_sub3.floorDecoration.renderable.verticesNormal != null
            ) {
                this.method275(class50_sub1_sub4_sub4, class50_sub3.floorDecoration.renderable as Model, 128, 0, 0, true);
            }
        }
        if (j < this.anInt453) {
            const class50_sub3_1: SceneTile = this.tiles[k][i][j + 1];
            if (
                class50_sub3_1 != null &&
                class50_sub3_1.floorDecoration != null &&
                class50_sub3_1.floorDecoration.renderable.verticesNormal != null
            ) {
                this.method275(class50_sub1_sub4_sub4, class50_sub3_1.floorDecoration.renderable as Model, 0, 0, 128, true);
            }
        }
        if (i < this.anInt453 && j < this.anInt454) {
            const class50_sub3_2: SceneTile = this.tiles[k][i + 1][j + 1];
            if (
                class50_sub3_2 != null &&
                class50_sub3_2.floorDecoration != null &&
                class50_sub3_2.floorDecoration.renderable.verticesNormal != null
            ) {
                this.method275(class50_sub1_sub4_sub4, class50_sub3_2.floorDecoration.renderable as Model, 128, 0, 128, true);
            }
        }
        if (i < this.anInt453 && j > 0) {
            const class50_sub3_3: SceneTile = this.tiles[k][i + 1][j - 1];
            if (
                class50_sub3_3 != null &&
                class50_sub3_3.floorDecoration != null &&
                class50_sub3_3.floorDecoration.renderable.verticesNormal != null
            ) {
                this.method275(class50_sub1_sub4_sub4, class50_sub3_3.floorDecoration.renderable as Model, 128, 0, -128, true);
            }
        }
    }

    public method274(i: number, j: number, k: number, l: number, class50_sub1_sub4_sub4: Model, i1: number, j1: number) {
        let flag: boolean = true;
        let k1: number = i1;
        const l1: number = i1 + l;
        const i2: number = i - 1;
        const j2: number = i + j1;
        for (let k2: number = j; k2 <= j + 1; k2++) {
            if (k2 !== this.anInt452) {
                for (let l2: number = k1; l2 <= l1; l2++) {
                    if (l2 >= 0 && l2 < this.anInt453) {
                        for (let i3: number = i2; i3 <= j2; i3++) {
                            if (i3 >= 0 && i3 < this.anInt454 && (!flag || l2 >= l1 || i3 >= j2 || (i3 < i && l2 !== i1))) {
                                const class50_sub3: SceneTile = this.tiles[k2][l2][i3];
                                if (class50_sub3 != null) {
                                    const j3: number =
                                        (((this.anIntArrayArrayArray455[k2][l2][i3] +
                                            this.anIntArrayArrayArray455[k2][l2 + 1][i3] +
                                            this.anIntArrayArrayArray455[k2][l2][i3 + 1] +
                                            this.anIntArrayArrayArray455[k2][l2 + 1][i3 + 1]) /
                                            4) |
                                            0) -
                                        (((this.anIntArrayArrayArray455[j][i1][i] +
                                            this.anIntArrayArrayArray455[j][i1 + 1][i] +
                                            this.anIntArrayArrayArray455[j][i1][i + 1] +
                                            this.anIntArrayArrayArray455[j][i1 + 1][i + 1]) /
                                            4) |
                                            0);
                                    const wall: Wall = class50_sub3.wall;
                                    if (wall != null && wall.aRenderable769 != null && wall.aRenderable769.verticesNormal != null) {
                                        this.method275(
                                            class50_sub1_sub4_sub4,
                                            wall.aRenderable769 as Model,
                                            (l2 - i1) * 128 + (1 - l) * 64,
                                            j3,
                                            (i3 - i) * 128 + (1 - j1) * 64,
                                            flag
                                        );
                                    }
                                    if (wall != null && wall.aRenderable770 != null && wall.aRenderable770.verticesNormal != null) {
                                        this.method275(
                                            class50_sub1_sub4_sub4,
                                            wall.aRenderable770 as Model,
                                            (l2 - i1) * 128 + (1 - l) * 64,
                                            j3,
                                            (i3 - i) * 128 + (1 - j1) * 64,
                                            flag
                                        );
                                    }
                                    for (let k3: number = 0; k3 < class50_sub3.sceneSpawnRequestCount; k3++) {
                                        {
                                            const sceneSpawnRequest: SceneSpawnRequest = class50_sub3.sceneSpawnRequests[k3];
                                            if (
                                                sceneSpawnRequest != null &&
                                                sceneSpawnRequest.renderable != null &&
                                                sceneSpawnRequest.renderable.verticesNormal != null
                                            ) {
                                                const l3: number = sceneSpawnRequest.offsetX - sceneSpawnRequest.relativeX + 1;
                                                const i4: number = sceneSpawnRequest.offsetY - sceneSpawnRequest.relativeY + 1;
                                                this.method275(
                                                    class50_sub1_sub4_sub4,
                                                    sceneSpawnRequest.renderable as Model,
                                                    (sceneSpawnRequest.relativeX - i1) * 128 + (l3 - l) * 64,
                                                    j3,
                                                    (sceneSpawnRequest.relativeY - i) * 128 + (i4 - j1) * 64,
                                                    flag
                                                );
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                k1--;
                flag = false;
            }
        }
        if (k === 0) {
        }
    }

    public method275(class50_sub1_sub4_sub4: Model, class50_sub1_sub4_sub4_1: Model, i: number, j: number, k: number, flag: boolean) {
        this.anInt503++;
        let l: number = 0;
        const ai: number[] = class50_sub1_sub4_sub4_1.verticesX;
        const i1: number = class50_sub1_sub4_sub4_1.vertexCount;
        const j1: number = class50_sub1_sub4_sub4_1.anInt1669 >> 16;
        const k1: number = (class50_sub1_sub4_sub4_1.anInt1669 << 16) >> 16;
        const l1: number = class50_sub1_sub4_sub4_1.anInt1670 >> 16;
        const i2: number = (class50_sub1_sub4_sub4_1.anInt1670 << 16) >> 16;
        for (let j2: number = 0; j2 < class50_sub1_sub4_sub4.vertexCount; j2++) {
            {
                const class40: VertexNormal = (class50_sub1_sub4_sub4 as Renderable).verticesNormal[j2];
                const class40_1: VertexNormal = class50_sub1_sub4_sub4.aClass40Array1681[j2];
                if (class40_1.magnitude !== 0) {
                    const i3: number = class50_sub1_sub4_sub4.verticesY[j2] - j;
                    if (i3 <= class50_sub1_sub4_sub4_1.maxY) {
                        const j3: number = class50_sub1_sub4_sub4.verticesX[j2] - i;
                        if (j3 >= j1 && j3 <= k1) {
                            const k3: number = class50_sub1_sub4_sub4.verticesZ[j2] - k;
                            if (k3 >= i2 && k3 <= l1) {
                                for (let l3: number = 0; l3 < i1; l3++) {
                                    {
                                        const class40_2: VertexNormal = (class50_sub1_sub4_sub4_1 as Renderable).verticesNormal[l3];
                                        const class40_3: VertexNormal = class50_sub1_sub4_sub4_1.aClass40Array1681[l3];
                                        if (
                                            j3 === ai[l3] &&
                                            k3 === class50_sub1_sub4_sub4_1.verticesZ[l3] &&
                                            i3 === class50_sub1_sub4_sub4_1.verticesY[l3] &&
                                            class40_3.magnitude !== 0
                                        ) {
                                            class40.x += class40_3.x;
                                            class40.y += class40_3.y;
                                            class40.z += class40_3.z;
                                            class40.magnitude += class40_3.magnitude;
                                            class40_2.x += class40_1.x;
                                            class40_2.y += class40_1.y;
                                            class40_2.z += class40_1.z;
                                            class40_2.magnitude += class40_1.magnitude;
                                            l++;
                                            this.anIntArray501[j2] = this.anInt503;
                                            this.anIntArray502[l3] = this.anInt503;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        if (l < 3 || !flag) {
            return;
        }
        for (let k2: number = 0; k2 < class50_sub1_sub4_sub4.triangleCount; k2++) {
            if (
                this.anIntArray501[class50_sub1_sub4_sub4.trianglePointsX[k2]] === this.anInt503 &&
                this.anIntArray501[class50_sub1_sub4_sub4.trianglePointsY[k2]] === this.anInt503 &&
                this.anIntArray501[class50_sub1_sub4_sub4.trianglePointsZ[k2]] === this.anInt503
            ) {
                class50_sub1_sub4_sub4.texturePoints[k2] = -1;
            }
        }
        for (let l2: number = 0; l2 < class50_sub1_sub4_sub4_1.triangleCount; l2++) {
            if (
                this.anIntArray502[class50_sub1_sub4_sub4_1.trianglePointsX[l2]] === this.anInt503 &&
                this.anIntArray502[class50_sub1_sub4_sub4_1.trianglePointsY[l2]] === this.anInt503 &&
                this.anIntArray502[class50_sub1_sub4_sub4_1.trianglePointsZ[l2]] === this.anInt503
            ) {
                class50_sub1_sub4_sub4_1.texturePoints[l2] = -1;
            }
        }
    }

    public renderMinimapDot(ai: number[], i: number, j: number, k: number, l: number, i1: number) {
        const class50_sub3: SceneTile = this.tiles[k][l][i1];
        if (class50_sub3 == null) {
            return;
        }
        const genericTile: GenericTile = class50_sub3.paint;
        if (genericTile != null) {
            const j1: number = genericTile.rgbColor;
            if (j1 === 0) {
                return;
            }
            for (let k1: number = 0; k1 < 4; k1++) {
                {
                    ai[i] = j1;
                    ai[i + 1] = j1;
                    ai[i + 2] = j1;
                    ai[i + 3] = j1;
                    i += j;
                }
            }
            return;
        }
        const complexTile: ComplexTile = class50_sub3.complexTile;
        if (complexTile == null) {
            return;
        }
        const l1: number = complexTile.anInt414;
        const i2: number = complexTile.anInt415;
        const j2: number = complexTile.anInt416;
        const k2: number = complexTile.anInt417;
        const ai1: number[] = this.anIntArrayArray504[l1];
        const ai2: number[] = this.anIntArrayArray505[i2];
        let l2: number = 0;
        if (j2 !== 0) {
            for (let i3: number = 0; i3 < 4; i3++) {
                {
                    ai[i] = ai1[ai2[l2++]] !== 0 ? k2 : j2;
                    ai[i + 1] = ai1[ai2[l2++]] !== 0 ? k2 : j2;
                    ai[i + 2] = ai1[ai2[l2++]] !== 0 ? k2 : j2;
                    ai[i + 3] = ai1[ai2[l2++]] !== 0 ? k2 : j2;
                    i += j;
                }
            }
            return;
        }
        for (let j3: number = 0; j3 < 4; j3++) {
            {
                if (ai1[ai2[l2++]] !== 0) {
                    ai[i] = k2;
                }
                if (ai1[ai2[l2++]] !== 0) {
                    ai[i + 1] = k2;
                }
                if (ai1[ai2[l2++]] !== 0) {
                    ai[i + 2] = k2;
                }
                if (ai1[ai2[l2++]] !== 0) {
                    ai[i + 3] = k2;
                }
                i += j;
            }
        }
    }

    public method279(i: number, j: number, k: number) {
        Scene.aBoolean482 = true;
        Scene.anInt483 = j;
        Scene.anInt484 = k;
        Scene.clickedTileX = -1;
        if (i !== 0) {
            return;
        } else {
            Scene.anInt486 = -1;
            return;
        }
    }

    public method280(i: number, j: number, k: number, l: number, i1: number, j1: number, k1: number) {
        if (i < 0) {
            i = 0;
        } else if (i >= this.anInt453 * 128) {
            i = this.anInt453 * 128 - 1;
        }
        if (i1 < 0) {
            i1 = 0;
        } else if (i1 >= this.anInt454 * 128) {
            i1 = this.anInt454 * 128 - 1;
        }
        Scene.cycle++;
        Scene.pitchSin = Model.SINE[k1];
        Scene.pitchCos = Model.COSINE[k1];
        Scene.yawSin = Model.SINE[j1];
        Scene.yawCos = Model.COSINE[j1];
        Scene.aBooleanArrayArray507 = Scene.aBooleanArrayArrayArrayArray506[((k1 - 128) / 32) | 0][(j1 / 64) | 0];
        Scene.cameraX2 = i;
        Scene.cameraY2 = l;
        Scene.cameraZ2 = i1;
        Scene.screenCenterX = (i / 128) | 0;
        Scene.screenCenterZ = (i1 / 128) | 0;
        Scene.anInt462 = j;
        Scene.anInt464 = Scene.screenCenterX - 25;
        if (k !== 0) {
            return;
        }
        if (Scene.anInt464 < 0) {
            Scene.anInt464 = 0;
        }
        Scene.anInt466 = Scene.screenCenterZ - 25;
        if (Scene.anInt466 < 0) {
            Scene.anInt466 = 0;
        }
        Scene.anInt465 = Scene.screenCenterX + 25;
        if (Scene.anInt465 > this.anInt453) {
            Scene.anInt465 = this.anInt453;
        }
        Scene.anInt467 = Scene.screenCenterZ + 25;
        if (Scene.anInt467 > this.anInt454) {
            Scene.anInt467 = this.anInt454;
        }
        this.method286();
        Scene.anInt461 = 0;
        for (let l1: number = this.anInt457; l1 < this.anInt452; l1++) {
            {
                const aclass50_sub3: SceneTile[][] = this.tiles[l1];
                for (let j2: number = Scene.anInt464; j2 < Scene.anInt465; j2++) {
                    {
                        for (let l2: number = Scene.anInt466; l2 < Scene.anInt467; l2++) {
                            {
                                const class50_sub3: SceneTile = aclass50_sub3[j2][l2];
                                if (class50_sub3 != null) {
                                    if (
                                        class50_sub3.anInt1411 > j ||
                                        (!Scene.aBooleanArrayArray507[j2 - Scene.screenCenterX + 25][l2 - Scene.screenCenterZ + 25] &&
                                            this.anIntArrayArrayArray455[l1][j2][l2] - l < 2000)
                                    ) {
                                        class50_sub3.draw = false;
                                        class50_sub3.visible = false;
                                        class50_sub3.wallCullDirection = 0;
                                    } else {
                                        class50_sub3.draw = true;
                                        class50_sub3.visible = true;
                                        if (class50_sub3.sceneSpawnRequestCount > 0) {
                                            class50_sub3.drawEntities = true;
                                        } else {
                                            class50_sub3.drawEntities = false;
                                        }
                                        Scene.anInt461++;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        for (let i2: number = this.anInt457; i2 < this.anInt452; i2++) {
            {
                const aclass50_sub3_1: SceneTile[][] = this.tiles[i2];
                for (let i3: number = -25; i3 <= 0; i3++) {
                    {
                        const j3: number = Scene.screenCenterX + i3;
                        const l3: number = Scene.screenCenterX - i3;
                        if (j3 >= Scene.anInt464 || l3 < Scene.anInt465) {
                            for (let j4: number = -25; j4 <= 0; j4++) {
                                {
                                    const l4: number = Scene.screenCenterZ + j4;
                                    const j5: number = Scene.screenCenterZ - j4;
                                    if (j3 >= Scene.anInt464) {
                                        if (l4 >= Scene.anInt466) {
                                            const class50_sub3_1: SceneTile = aclass50_sub3_1[j3][l4];
                                            if (class50_sub3_1 != null && class50_sub3_1.draw) {
                                                this.drawTile(class50_sub3_1, true);
                                            }
                                        }
                                        if (j5 < Scene.anInt467) {
                                            const class50_sub3_2: SceneTile = aclass50_sub3_1[j3][j5];
                                            if (class50_sub3_2 != null && class50_sub3_2.draw) {
                                                this.drawTile(class50_sub3_2, true);
                                            }
                                        }
                                    }
                                    if (l3 < Scene.anInt465) {
                                        if (l4 >= Scene.anInt466) {
                                            const class50_sub3_3: SceneTile = aclass50_sub3_1[l3][l4];
                                            if (class50_sub3_3 != null && class50_sub3_3.draw) {
                                                this.drawTile(class50_sub3_3, true);
                                            }
                                        }
                                        if (j5 < Scene.anInt467) {
                                            const class50_sub3_4: SceneTile = aclass50_sub3_1[l3][j5];
                                            if (class50_sub3_4 != null && class50_sub3_4.draw) {
                                                this.drawTile(class50_sub3_4, true);
                                            }
                                        }
                                    }
                                    if (Scene.anInt461 === 0) {
                                        Scene.aBoolean482 = false;
                                        return;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        for (let k2: number = this.anInt457; k2 < this.anInt452; k2++) {
            {
                const aclass50_sub3_2: SceneTile[][] = this.tiles[k2];
                for (let k3: number = -25; k3 <= 0; k3++) {
                    {
                        const i4: number = Scene.screenCenterX + k3;
                        const k4: number = Scene.screenCenterX - k3;
                        if (i4 >= Scene.anInt464 || k4 < Scene.anInt465) {
                            for (let i5: number = -25; i5 <= 0; i5++) {
                                {
                                    const k5: number = Scene.screenCenterZ + i5;
                                    const l5: number = Scene.screenCenterZ - i5;
                                    if (i4 >= Scene.anInt464) {
                                        if (k5 >= Scene.anInt466) {
                                            const class50_sub3_5: SceneTile = aclass50_sub3_2[i4][k5];
                                            if (class50_sub3_5 != null && class50_sub3_5.draw) {
                                                this.drawTile(class50_sub3_5, false);
                                            }
                                        }
                                        if (l5 < Scene.anInt467) {
                                            const class50_sub3_6: SceneTile = aclass50_sub3_2[i4][l5];
                                            if (class50_sub3_6 != null && class50_sub3_6.draw) {
                                                this.drawTile(class50_sub3_6, false);
                                            }
                                        }
                                    }
                                    if (k4 < Scene.anInt465) {
                                        if (k5 >= Scene.anInt466) {
                                            const class50_sub3_7: SceneTile = aclass50_sub3_2[k4][k5];
                                            if (class50_sub3_7 != null && class50_sub3_7.draw) {
                                                this.drawTile(class50_sub3_7, false);
                                            }
                                        }
                                        if (l5 < Scene.anInt467) {
                                            const class50_sub3_8: SceneTile = aclass50_sub3_2[k4][l5];
                                            if (class50_sub3_8 != null && class50_sub3_8.draw) {
                                                this.drawTile(class50_sub3_8, false);
                                            }
                                        }
                                    }
                                    if (Scene.anInt461 === 0) {
                                        Scene.aBoolean482 = false;
                                        return;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        Scene.aBoolean482 = false;
    }

    public drawTile(tile: SceneTile, flag: boolean) {
        Scene.tileList.insertBack(tile);
        do {
            {
                let tileFromList: SceneTile;
                do {
                    {
                        tileFromList = Scene.tileList.removeFirst() as SceneTile;
                        if (tileFromList == null) {
                            return;
                        }
                    }
                } while (!tileFromList.visible);
                const i: number = tileFromList.x;
                const j: number = tileFromList.y;
                const k: number = tileFromList.plane;
                const l: number = tileFromList.renderLevel;
                const aclass50_sub3: SceneTile[][] = this.tiles[k];
                if (tileFromList.draw) {
                    if (flag) {
                        if (k > 0) {
                            const class50_sub3_2: SceneTile = this.tiles[k - 1][i][j];
                            if (class50_sub3_2 != null && class50_sub3_2.visible) {
                                continue;
                            }
                        }
                        if (i <= Scene.screenCenterX && i > Scene.anInt464) {
                            const class50_sub3_3: SceneTile = aclass50_sub3[i - 1][j];
                            if (
                                class50_sub3_3 != null &&
                                class50_sub3_3.visible &&
                                (class50_sub3_3.draw || (tileFromList.anInt1410 & 1) === 0)
                            ) {
                                continue;
                            }
                        }
                        if (i >= Scene.screenCenterX && i < Scene.anInt465 - 1) {
                            const class50_sub3_4: SceneTile = aclass50_sub3[i + 1][j];
                            if (
                                class50_sub3_4 != null &&
                                class50_sub3_4.visible &&
                                (class50_sub3_4.draw || (tileFromList.anInt1410 & 4) === 0)
                            ) {
                                continue;
                            }
                        }
                        if (j <= Scene.screenCenterZ && j > Scene.anInt466) {
                            const class50_sub3_5: SceneTile = aclass50_sub3[i][j - 1];
                            if (
                                class50_sub3_5 != null &&
                                class50_sub3_5.visible &&
                                (class50_sub3_5.draw || (tileFromList.anInt1410 & 8) === 0)
                            ) {
                                continue;
                            }
                        }
                        if (j >= Scene.screenCenterZ && j < Scene.anInt467 - 1) {
                            const class50_sub3_6: SceneTile = aclass50_sub3[i][j + 1];
                            if (
                                class50_sub3_6 != null &&
                                class50_sub3_6.visible &&
                                (class50_sub3_6.draw || (tileFromList.anInt1410 & 2) === 0)
                            ) {
                                continue;
                            }
                        }
                    } else {
                        flag = true;
                    }
                    tileFromList.draw = false;
                    if (tileFromList.bridge != null) {
                        const class50_sub3_7: SceneTile = tileFromList.bridge;
                        if (class50_sub3_7.paint != null) {
                            if (!this.isTileOccluded(0, i, j)) {
                                this.drawTileUnderlay(
                                    class50_sub3_7.paint,
                                    0,
                                    Scene.pitchSin,
                                    Scene.pitchCos,
                                    Scene.yawSin,
                                    Scene.yawCos,
                                    i,
                                    j
                                );
                            }
                        } else if (class50_sub3_7.complexTile != null && !this.isTileOccluded(0, i, j)) {
                            this.drawTileOverlay(
                                Scene.pitchCos,
                                Scene.yawCos,
                                class50_sub3_7.complexTile,
                                Scene.pitchSin,
                                j,
                                i,
                                Scene.yawSin,
                                (3 as number) | 0
                            );
                        }
                        const wall: Wall = class50_sub3_7.wall;
                        if (wall != null) {
                            wall.aRenderable769.renderAtPoint(
                                0,
                                Scene.pitchSin,
                                Scene.pitchCos,
                                Scene.yawSin,
                                Scene.yawCos,
                                wall.x - Scene.cameraX2,
                                wall.plane - Scene.cameraY2,
                                wall.y - Scene.cameraZ2,
                                wall.hash
                            );
                        }
                        for (let i2: number = 0; i2 < class50_sub3_7.sceneSpawnRequestCount; i2++) {
                            {
                                const sceneSpawnRequest: SceneSpawnRequest = class50_sub3_7.sceneSpawnRequests[i2];
                                if (sceneSpawnRequest != null) {
                                    sceneSpawnRequest.renderable.renderAtPoint(
                                        sceneSpawnRequest.anInt118,
                                        Scene.pitchSin,
                                        Scene.pitchCos,
                                        Scene.yawSin,
                                        Scene.yawCos,
                                        sceneSpawnRequest.x - Scene.cameraX2,
                                        sceneSpawnRequest.tileHeight - Scene.cameraY2,
                                        sceneSpawnRequest.y - Scene.cameraZ2,
                                        sceneSpawnRequest.hash
                                    );
                                }
                            }
                        }
                    }
                    let flag1: boolean = false;
                    if (tileFromList.paint != null) {
                        if (!this.isTileOccluded(l, i, j)) {
                            flag1 = true;
                            this.drawTileUnderlay(
                                tileFromList.paint,
                                l,
                                Scene.pitchSin,
                                Scene.pitchCos,
                                Scene.yawSin,
                                Scene.yawCos,
                                i,
                                j
                            );
                        }
                    } else if (tileFromList.complexTile != null && !this.isTileOccluded(l, i, j)) {
                        flag1 = true;
                        this.drawTileOverlay(
                            Scene.pitchCos,
                            Scene.yawCos,
                            tileFromList.complexTile,
                            Scene.pitchSin,
                            j,
                            i,
                            Scene.yawSin,
                            (3 as number) | 0
                        );
                    }
                    let j1: number = 0;
                    let j2: number = 0;
                    const wall_3: Wall = tileFromList.wall;
                    const wallDecoration_1: WallDecoration = tileFromList.wallDecoration;
                    if (wall_3 != null || wallDecoration_1 != null) {
                        if (Scene.screenCenterX === i) {
                            j1++;
                        } else if (Scene.screenCenterX < i) {
                            j1 += 2;
                        }
                        if (Scene.screenCenterZ === j) {
                            j1 += 3;
                        } else if (Scene.screenCenterZ > j) {
                            j1 += 6;
                        }
                        j2 = Scene.anIntArray493[j1];
                        tileFromList.wallDrawFlags = Scene.TILE_WALL_DRAW_FLAGS_1[j1];
                    }
                    if (wall_3 != null) {
                        if ((wall_3.orientationA & Scene.anIntArray494[j1]) !== 0) {
                            if (wall_3.orientationA === 16) {
                                tileFromList.wallCullDirection = 3;
                                tileFromList.wallUncullDirection = Scene.WALL_UNCULL_FLAGS_0[j1];
                                tileFromList.wallCullOppositeDirection = 3 - tileFromList.wallUncullDirection;
                            } else if (wall_3.orientationA === 32) {
                                tileFromList.wallCullDirection = 6;
                                tileFromList.wallUncullDirection = Scene.anIntArray497[j1];
                                tileFromList.wallCullOppositeDirection = 6 - tileFromList.wallUncullDirection;
                            } else if (wall_3.orientationA === 64) {
                                tileFromList.wallCullDirection = 12;
                                tileFromList.wallUncullDirection = Scene.anIntArray498[j1];
                                tileFromList.wallCullOppositeDirection = 12 - tileFromList.wallUncullDirection;
                            } else {
                                tileFromList.wallCullDirection = 9;
                                tileFromList.wallUncullDirection = Scene.anIntArray499[j1];
                                tileFromList.wallCullOppositeDirection = 9 - tileFromList.wallUncullDirection;
                            }
                        } else {
                            tileFromList.wallCullDirection = 0;
                        }
                        if ((wall_3.orientationA & j2) !== 0 && !this.isWallOccluded(l, i, j, wall_3.orientationA)) {
                            wall_3.aRenderable769.renderAtPoint(
                                0,
                                Scene.pitchSin,
                                Scene.pitchCos,
                                Scene.yawSin,
                                Scene.yawCos,
                                wall_3.x - Scene.cameraX2,
                                wall_3.plane - Scene.cameraY2,
                                wall_3.y - Scene.cameraZ2,
                                wall_3.hash
                            );
                        }
                        if ((wall_3.face & j2) !== 0 && !this.isWallOccluded(l, i, j, wall_3.face)) {
                            wall_3.aRenderable770.renderAtPoint(
                                0,
                                Scene.pitchSin,
                                Scene.pitchCos,
                                Scene.yawSin,
                                Scene.yawCos,
                                wall_3.x - Scene.cameraX2,
                                wall_3.plane - Scene.cameraY2,
                                wall_3.y - Scene.cameraZ2,
                                wall_3.hash
                            );
                        }
                    }
                    if (wallDecoration_1 != null && !this.isOccluded(l, i, j, wallDecoration_1.renderable.modelHeight)) {
                        if ((wallDecoration_1.faceUnknown & j2) !== 0) {
                            wallDecoration_1.renderable.renderAtPoint(
                                wallDecoration_1.face,
                                Scene.pitchSin,
                                Scene.pitchCos,
                                Scene.yawSin,
                                Scene.yawCos,
                                wallDecoration_1.y - Scene.cameraX2,
                                wallDecoration_1.plane - Scene.cameraY2,
                                wallDecoration_1.x - Scene.cameraZ2,
                                wallDecoration_1.hash
                            );
                        } else if ((wallDecoration_1.faceUnknown & 768) !== 0) {
                            const j4: number = wallDecoration_1.y - Scene.cameraX2;
                            const l5: number = wallDecoration_1.plane - Scene.cameraY2;
                            const k6: number = wallDecoration_1.x - Scene.cameraZ2;
                            const i8: number = wallDecoration_1.face;
                            let k9: number;
                            if (i8 === 1 || i8 === 2) {
                                k9 = -j4;
                            } else {
                                k9 = j4;
                            }
                            let k10: number;
                            if (i8 === 2 || i8 === 3) {
                                k10 = -k6;
                            } else {
                                k10 = k6;
                            }
                            if ((wallDecoration_1.faceUnknown & 256) !== 0 && k10 < k9) {
                                const i11: number = j4 + Scene.anIntArray478[i8];
                                const k11: number = k6 + Scene.anIntArray479[i8];
                                wallDecoration_1.renderable.renderAtPoint(
                                    i8 * 512 + 256,
                                    Scene.pitchSin,
                                    Scene.pitchCos,
                                    Scene.yawSin,
                                    Scene.yawCos,
                                    i11,
                                    l5,
                                    k11,
                                    wallDecoration_1.hash
                                );
                            }
                            if ((wallDecoration_1.faceUnknown & 512) !== 0 && k10 > k9) {
                                const j11: number = j4 + Scene.anIntArray480[i8];
                                const l11: number = k6 + Scene.anIntArray481[i8];
                                wallDecoration_1.renderable.renderAtPoint(
                                    (i8 * 512 + 1280) & 2047,
                                    Scene.pitchSin,
                                    Scene.pitchCos,
                                    Scene.yawSin,
                                    Scene.yawCos,
                                    j11,
                                    l5,
                                    l11,
                                    wallDecoration_1.hash
                                );
                            }
                        }
                    }
                    if (flag1) {
                        const floorDecoration: FloorDecoration = tileFromList.floorDecoration;
                        if (floorDecoration != null) {
                            floorDecoration.renderable.renderAtPoint(
                                0,
                                Scene.pitchSin,
                                Scene.pitchCos,
                                Scene.yawSin,
                                Scene.yawCos,
                                floorDecoration.y - Scene.cameraX2,
                                floorDecoration.x - Scene.cameraY2,
                                floorDecoration.z - Scene.cameraZ2,
                                floorDecoration.hash
                            );
                        }
                        const cameraAngle_1: CameraAngle = tileFromList.cameraAngle;
                        if (cameraAngle_1 != null && cameraAngle_1.anInt180 === 0) {
                            if (cameraAngle_1.aRenderable151 != null) {
                                cameraAngle_1.aRenderable151.renderAtPoint(
                                    0,
                                    Scene.pitchSin,
                                    Scene.pitchCos,
                                    Scene.yawSin,
                                    Scene.yawCos,
                                    cameraAngle_1.y - Scene.cameraX2,
                                    cameraAngle_1.x - Scene.cameraY2,
                                    cameraAngle_1.z - Scene.cameraZ2,
                                    cameraAngle_1.anInt179
                                );
                            }
                            if (cameraAngle_1.aRenderable152 != null) {
                                cameraAngle_1.aRenderable152.renderAtPoint(
                                    0,
                                    Scene.pitchSin,
                                    Scene.pitchCos,
                                    Scene.yawSin,
                                    Scene.yawCos,
                                    cameraAngle_1.y - Scene.cameraX2,
                                    cameraAngle_1.x - Scene.cameraY2,
                                    cameraAngle_1.z - Scene.cameraZ2,
                                    cameraAngle_1.anInt179
                                );
                            }
                            if (cameraAngle_1.aRenderable150 != null) {
                                cameraAngle_1.aRenderable150.renderAtPoint(
                                    0,
                                    Scene.pitchSin,
                                    Scene.pitchCos,
                                    Scene.yawSin,
                                    Scene.yawCos,
                                    cameraAngle_1.y - Scene.cameraX2,
                                    cameraAngle_1.x - Scene.cameraY2,
                                    cameraAngle_1.z - Scene.cameraZ2,
                                    cameraAngle_1.anInt179
                                );
                            }
                        }
                    }
                    const k4: number = tileFromList.anInt1410;
                    if (k4 !== 0) {
                        if (i < Scene.screenCenterX && (k4 & 4) !== 0) {
                            const class50_sub3_17: SceneTile = aclass50_sub3[i + 1][j];
                            if (class50_sub3_17 != null && class50_sub3_17.visible) {
                                Scene.tileList.insertBack(class50_sub3_17);
                            }
                        }
                        if (j < Scene.screenCenterZ && (k4 & 2) !== 0) {
                            const class50_sub3_18: SceneTile = aclass50_sub3[i][j + 1];
                            if (class50_sub3_18 != null && class50_sub3_18.visible) {
                                Scene.tileList.insertBack(class50_sub3_18);
                            }
                        }
                        if (i > Scene.screenCenterX && (k4 & 1) !== 0) {
                            const class50_sub3_19: SceneTile = aclass50_sub3[i - 1][j];
                            if (class50_sub3_19 != null && class50_sub3_19.visible) {
                                Scene.tileList.insertBack(class50_sub3_19);
                            }
                        }
                        if (j > Scene.screenCenterZ && (k4 & 8) !== 0) {
                            const class50_sub3_20: SceneTile = aclass50_sub3[i][j - 1];
                            if (class50_sub3_20 != null && class50_sub3_20.visible) {
                                Scene.tileList.insertBack(class50_sub3_20);
                            }
                        }
                    }
                }
                if (tileFromList.wallCullDirection !== 0) {
                    let flag2: boolean = true;
                    for (let k1: number = 0; k1 < tileFromList.sceneSpawnRequestCount; k1++) {
                        {
                            if (
                                tileFromList.sceneSpawnRequests[k1].cycle === Scene.cycle ||
                                (tileFromList.anIntArray1409[k1] & tileFromList.wallCullDirection) !== tileFromList.wallUncullDirection
                            ) {
                                continue;
                            }
                            flag2 = false;
                            break;
                        }
                    }
                    if (flag2) {
                        const wall_1: Wall = tileFromList.wall;
                        if (!this.isWallOccluded(l, i, j, wall_1.orientationA)) {
                            wall_1.aRenderable769.renderAtPoint(
                                0,
                                Scene.pitchSin,
                                Scene.pitchCos,
                                Scene.yawSin,
                                Scene.yawCos,
                                wall_1.x - Scene.cameraX2,
                                wall_1.plane - Scene.cameraY2,
                                wall_1.y - Scene.cameraZ2,
                                wall_1.hash
                            );
                        }
                        tileFromList.wallCullDirection = 0;
                    }
                }
                if (tileFromList.drawEntities) {
                    try {
                        const i1: number = tileFromList.sceneSpawnRequestCount;
                        tileFromList.drawEntities = false;
                        let l1: number = 0;
                        label0: for (let k2: number = 0; k2 < i1; k2++) {
                            {
                                const sceneSpawnRequest_1: SceneSpawnRequest = tileFromList.sceneSpawnRequests[k2];
                                if (sceneSpawnRequest_1.cycle === Scene.cycle) {
                                    continue;
                                }
                                for (let k3: number = sceneSpawnRequest_1.relativeX; k3 <= sceneSpawnRequest_1.offsetX; k3++) {
                                    {
                                        for (let l4: number = sceneSpawnRequest_1.relativeY; l4 <= sceneSpawnRequest_1.offsetY; l4++) {
                                            {
                                                const class50_sub3_21: SceneTile = aclass50_sub3[k3][l4];
                                                if (class50_sub3_21.draw) {
                                                    tileFromList.drawEntities = true;
                                                } else {
                                                    if (class50_sub3_21.wallCullDirection === 0) {
                                                        continue;
                                                    }
                                                    let l6: number = 0;
                                                    if (k3 > sceneSpawnRequest_1.relativeX) {
                                                        l6++;
                                                    }
                                                    if (k3 < sceneSpawnRequest_1.offsetX) {
                                                        l6 += 4;
                                                    }
                                                    if (l4 > sceneSpawnRequest_1.relativeY) {
                                                        l6 += 8;
                                                    }
                                                    if (l4 < sceneSpawnRequest_1.offsetY) {
                                                        l6 += 2;
                                                    }
                                                    if ((l6 & class50_sub3_21.wallCullDirection) !== tileFromList.wallCullOppositeDirection) {
                                                        continue;
                                                    }
                                                    tileFromList.drawEntities = true;
                                                }
                                                continue label0;
                                            }
                                        }
                                    }
                                }
                                Scene.entityBuffer[l1++] = sceneSpawnRequest_1;
                                let i5: number = Scene.screenCenterX - sceneSpawnRequest_1.relativeX;
                                const i6: number = sceneSpawnRequest_1.offsetX - Scene.screenCenterX;
                                if (i6 > i5) {
                                    i5 = i6;
                                }
                                const i7: number = Scene.screenCenterZ - sceneSpawnRequest_1.relativeY;
                                const j8: number = sceneSpawnRequest_1.offsetY - Scene.screenCenterZ;
                                if (j8 > i7) {
                                    sceneSpawnRequest_1.anInt123 = i5 + j8;
                                } else {
                                    sceneSpawnRequest_1.anInt123 = i5 + i7;
                                }
                            }
                        }
                        while (l1 > 0) {
                            {
                                let i3: number = -50;
                                let l3: number = -1;
                                for (let j5: number = 0; j5 < l1; j5++) {
                                    {
                                        const sceneSpawnRequest_2: SceneSpawnRequest = Scene.entityBuffer[j5];
                                        if (sceneSpawnRequest_2.cycle !== Scene.cycle) {
                                            if (sceneSpawnRequest_2.anInt123 > i3) {
                                                i3 = sceneSpawnRequest_2.anInt123;
                                                l3 = j5;
                                            } else if (sceneSpawnRequest_2.anInt123 === i3) {
                                                const j7: number = sceneSpawnRequest_2.x - Scene.cameraX2;
                                                const k8: number = sceneSpawnRequest_2.y - Scene.cameraZ2;
                                                const l9: number = Scene.entityBuffer[l3].x - Scene.cameraX2;
                                                const l10: number = Scene.entityBuffer[l3].y - Scene.cameraZ2;
                                                if (j7 * j7 + k8 * k8 > l9 * l9 + l10 * l10) {
                                                    l3 = j5;
                                                }
                                            }
                                        }
                                    }
                                }
                                if (l3 === -1) {
                                    break;
                                }
                                const sceneSpawnRequest_3: SceneSpawnRequest = Scene.entityBuffer[l3];
                                sceneSpawnRequest_3.cycle = Scene.cycle;
                                if (
                                    !this.isAreaOccluded(
                                        l,
                                        sceneSpawnRequest_3.relativeX,
                                        sceneSpawnRequest_3.offsetX,
                                        sceneSpawnRequest_3.relativeY,
                                        sceneSpawnRequest_3.offsetY,
                                        sceneSpawnRequest_3.renderable.modelHeight
                                    )
                                ) {
                                    sceneSpawnRequest_3.renderable.renderAtPoint(
                                        sceneSpawnRequest_3.anInt118,
                                        Scene.pitchSin,
                                        Scene.pitchCos,
                                        Scene.yawSin,
                                        Scene.yawCos,
                                        sceneSpawnRequest_3.x - Scene.cameraX2,
                                        sceneSpawnRequest_3.tileHeight - Scene.cameraY2,
                                        sceneSpawnRequest_3.y - Scene.cameraZ2,
                                        sceneSpawnRequest_3.hash
                                    );
                                }
                                for (let k7: number = sceneSpawnRequest_3.relativeX; k7 <= sceneSpawnRequest_3.offsetX; k7++) {
                                    {
                                        for (let l8: number = sceneSpawnRequest_3.relativeY; l8 <= sceneSpawnRequest_3.offsetY; l8++) {
                                            {
                                                const class50_sub3_22: SceneTile = aclass50_sub3[k7][l8];
                                                if (class50_sub3_22.wallCullDirection !== 0) {
                                                    Scene.tileList.insertBack(class50_sub3_22);
                                                } else if ((k7 !== i || l8 !== j) && class50_sub3_22.visible) {
                                                    Scene.tileList.insertBack(class50_sub3_22);
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        if (tileFromList.drawEntities) {
                            continue;
                        }
                    } catch (_ex) {
                        tileFromList.drawEntities = false;
                    }
                }
                if (!tileFromList.visible || tileFromList.wallCullDirection !== 0) {
                    continue;
                }
                if (i <= Scene.screenCenterX && i > Scene.anInt464) {
                    const class50_sub3_8: SceneTile = aclass50_sub3[i - 1][j];
                    if (class50_sub3_8 != null && class50_sub3_8.visible) {
                        continue;
                    }
                }
                if (i >= Scene.screenCenterX && i < Scene.anInt465 - 1) {
                    const class50_sub3_9: SceneTile = aclass50_sub3[i + 1][j];
                    if (class50_sub3_9 != null && class50_sub3_9.visible) {
                        continue;
                    }
                }
                if (j <= Scene.screenCenterZ && j > Scene.anInt466) {
                    const class50_sub3_10: SceneTile = aclass50_sub3[i][j - 1];
                    if (class50_sub3_10 != null && class50_sub3_10.visible) {
                        continue;
                    }
                }
                if (j >= Scene.screenCenterZ && j < Scene.anInt467 - 1) {
                    const class50_sub3_11: SceneTile = aclass50_sub3[i][j + 1];
                    if (class50_sub3_11 != null && class50_sub3_11.visible) {
                        continue;
                    }
                }
                tileFromList.visible = false;
                Scene.anInt461--;
                const cameraAngle: CameraAngle = tileFromList.cameraAngle;
                if (cameraAngle != null && cameraAngle.anInt180 !== 0) {
                    if (cameraAngle.aRenderable151 != null) {
                        cameraAngle.aRenderable151.renderAtPoint(
                            0,
                            Scene.pitchSin,
                            Scene.pitchCos,
                            Scene.yawSin,
                            Scene.yawCos,
                            cameraAngle.y - Scene.cameraX2,
                            cameraAngle.x - Scene.cameraY2 - cameraAngle.anInt180,
                            cameraAngle.z - Scene.cameraZ2,
                            cameraAngle.anInt179
                        );
                    }
                    if (cameraAngle.aRenderable152 != null) {
                        cameraAngle.aRenderable152.renderAtPoint(
                            0,
                            Scene.pitchSin,
                            Scene.pitchCos,
                            Scene.yawSin,
                            Scene.yawCos,
                            cameraAngle.y - Scene.cameraX2,
                            cameraAngle.x - Scene.cameraY2 - cameraAngle.anInt180,
                            cameraAngle.z - Scene.cameraZ2,
                            cameraAngle.anInt179
                        );
                    }
                    if (cameraAngle.aRenderable150 != null) {
                        cameraAngle.aRenderable150.renderAtPoint(
                            0,
                            Scene.pitchSin,
                            Scene.pitchCos,
                            Scene.yawSin,
                            Scene.yawCos,
                            cameraAngle.y - Scene.cameraX2,
                            cameraAngle.x - Scene.cameraY2 - cameraAngle.anInt180,
                            cameraAngle.z - Scene.cameraZ2,
                            cameraAngle.anInt179
                        );
                    }
                }
                if (tileFromList.wallDrawFlags !== 0) {
                    const wallDecoration: WallDecoration = tileFromList.wallDecoration;
                    if (wallDecoration != null && !this.isOccluded(l, i, j, wallDecoration.renderable.modelHeight)) {
                        if ((wallDecoration.faceUnknown & tileFromList.wallDrawFlags) !== 0) {
                            wallDecoration.renderable.renderAtPoint(
                                wallDecoration.face,
                                Scene.pitchSin,
                                Scene.pitchCos,
                                Scene.yawSin,
                                Scene.yawCos,
                                wallDecoration.y - Scene.cameraX2,
                                wallDecoration.plane - Scene.cameraY2,
                                wallDecoration.x - Scene.cameraZ2,
                                wallDecoration.hash
                            );
                        } else if ((wallDecoration.faceUnknown & 768) !== 0) {
                            const l2: number = wallDecoration.y - Scene.cameraX2;
                            const j3: number = wallDecoration.plane - Scene.cameraY2;
                            const i4: number = wallDecoration.x - Scene.cameraZ2;
                            const k5: number = wallDecoration.face;
                            let j6: number;
                            if (k5 === 1 || k5 === 2) {
                                j6 = -l2;
                            } else {
                                j6 = l2;
                            }
                            let l7: number;
                            if (k5 === 2 || k5 === 3) {
                                l7 = -i4;
                            } else {
                                l7 = i4;
                            }
                            if ((wallDecoration.faceUnknown & 256) !== 0 && l7 >= j6) {
                                const i9: number = l2 + Scene.anIntArray478[k5];
                                const i10: number = i4 + Scene.anIntArray479[k5];
                                wallDecoration.renderable.renderAtPoint(
                                    k5 * 512 + 256,
                                    Scene.pitchSin,
                                    Scene.pitchCos,
                                    Scene.yawSin,
                                    Scene.yawCos,
                                    i9,
                                    j3,
                                    i10,
                                    wallDecoration.hash
                                );
                            }
                            if ((wallDecoration.faceUnknown & 512) !== 0 && l7 <= j6) {
                                const j9: number = l2 + Scene.anIntArray480[k5];
                                const j10: number = i4 + Scene.anIntArray481[k5];
                                wallDecoration.renderable.renderAtPoint(
                                    (k5 * 512 + 1280) & 2047,
                                    Scene.pitchSin,
                                    Scene.pitchCos,
                                    Scene.yawSin,
                                    Scene.yawCos,
                                    j9,
                                    j3,
                                    j10,
                                    wallDecoration.hash
                                );
                            }
                        }
                    }
                    const wall_2: Wall = tileFromList.wall;
                    if (wall_2 != null) {
                        if ((wall_2.face & tileFromList.wallDrawFlags) !== 0 && !this.isWallOccluded(l, i, j, wall_2.face)) {
                            wall_2.aRenderable770.renderAtPoint(
                                0,
                                Scene.pitchSin,
                                Scene.pitchCos,
                                Scene.yawSin,
                                Scene.yawCos,
                                wall_2.x - Scene.cameraX2,
                                wall_2.plane - Scene.cameraY2,
                                wall_2.y - Scene.cameraZ2,
                                wall_2.hash
                            );
                        }
                        if ((wall_2.orientationA & tileFromList.wallDrawFlags) !== 0 && !this.isWallOccluded(l, i, j, wall_2.orientationA)) {
                            wall_2.aRenderable769.renderAtPoint(
                                0,
                                Scene.pitchSin,
                                Scene.pitchCos,
                                Scene.yawSin,
                                Scene.yawCos,
                                wall_2.x - Scene.cameraX2,
                                wall_2.plane - Scene.cameraY2,
                                wall_2.y - Scene.cameraZ2,
                                wall_2.hash
                            );
                        }
                    }
                }
                if (k < this.anInt452 - 1) {
                    const class50_sub3_12: SceneTile = this.tiles[k + 1][i][j];
                    if (class50_sub3_12 != null && class50_sub3_12.visible) {
                        Scene.tileList.insertBack(class50_sub3_12);
                    }
                }
                if (i < Scene.screenCenterX) {
                    const class50_sub3_13: SceneTile = aclass50_sub3[i + 1][j];
                    if (class50_sub3_13 != null && class50_sub3_13.visible) {
                        Scene.tileList.insertBack(class50_sub3_13);
                    }
                }
                if (j < Scene.screenCenterZ) {
                    const class50_sub3_14: SceneTile = aclass50_sub3[i][j + 1];
                    if (class50_sub3_14 != null && class50_sub3_14.visible) {
                        Scene.tileList.insertBack(class50_sub3_14);
                    }
                }
                if (i > Scene.screenCenterX) {
                    const class50_sub3_15: SceneTile = aclass50_sub3[i - 1][j];
                    if (class50_sub3_15 != null && class50_sub3_15.visible) {
                        Scene.tileList.insertBack(class50_sub3_15);
                    }
                }
                if (j > Scene.screenCenterZ) {
                    const class50_sub3_16: SceneTile = aclass50_sub3[i][j - 1];
                    if (class50_sub3_16 != null && class50_sub3_16.visible) {
                        Scene.tileList.insertBack(class50_sub3_16);
                    }
                }
            }
        } while (true);
    }

    public drawTileUnderlay(genericTile: GenericTile, i: number, j: number, k: number, l: number, i1: number, j1: number, k1: number) {
        let l1: number;
        let i2: number = (l1 = (j1 << 7) - Scene.cameraX2);
        let j2: number;
        let k2: number = (j2 = (k1 << 7) - Scene.cameraZ2);
        let l2: number;
        let i3: number = (l2 = i2 + 128);
        let j3: number;
        let k3: number = (j3 = k2 + 128);
        let l3: number = this.anIntArrayArrayArray455[i][j1][k1] - Scene.cameraY2;
        let i4: number = this.anIntArrayArrayArray455[i][j1 + 1][k1] - Scene.cameraY2;
        let j4: number = this.anIntArrayArrayArray455[i][j1 + 1][k1 + 1] - Scene.cameraY2;
        let k4: number = this.anIntArrayArrayArray455[i][j1][k1 + 1] - Scene.cameraY2;
        let l4: number = (k2 * l + i2 * i1) >> 16;
        k2 = (k2 * i1 - i2 * l) >> 16;
        i2 = l4;
        l4 = (l3 * k - k2 * j) >> 16;
        k2 = (l3 * j + k2 * k) >> 16;
        l3 = l4;
        if (k2 < 50) {
            return;
        }
        l4 = (j2 * l + i3 * i1) >> 16;
        j2 = (j2 * i1 - i3 * l) >> 16;
        i3 = l4;
        l4 = (i4 * k - j2 * j) >> 16;
        j2 = (i4 * j + j2 * k) >> 16;
        i4 = l4;
        if (j2 < 50) {
            return;
        }
        l4 = (k3 * l + l2 * i1) >> 16;
        k3 = (k3 * i1 - l2 * l) >> 16;
        l2 = l4;
        l4 = (j4 * k - k3 * j) >> 16;
        k3 = (j4 * j + k3 * k) >> 16;
        j4 = l4;
        if (k3 < 50) {
            return;
        }
        l4 = (j3 * l + l1 * i1) >> 16;
        j3 = (j3 * i1 - l1 * l) >> 16;
        l1 = l4;
        l4 = (k4 * k - j3 * j) >> 16;
        j3 = (k4 * j + j3 * k) >> 16;
        k4 = l4;
        if (j3 < 50) {
            return;
        }
        const i5: number = Rasterizer3D.centerX + (((i2 << 9) / k2) | 0);
        const j5: number = Rasterizer3D.centerY + (((l3 << 9) / k2) | 0);
        const k5: number = Rasterizer3D.centerX + (((i3 << 9) / j2) | 0);
        const l5: number = Rasterizer3D.centerY + (((i4 << 9) / j2) | 0);
        const i6: number = Rasterizer3D.centerX + (((l2 << 9) / k3) | 0);
        const j6: number = Rasterizer3D.centerY + (((j4 << 9) / k3) | 0);
        const k6: number = Rasterizer3D.centerX + (((l1 << 9) / j3) | 0);
        const l6: number = Rasterizer3D.centerY + (((k4 << 9) / j3) | 0);
        Rasterizer3D.anInt1531 = 0;
        if ((i6 - k6) * (l5 - l6) - (j6 - l6) * (k5 - k6) > 0) {
            Rasterizer3D.aBoolean1528 = false;
            if (
                i6 < 0 ||
                k6 < 0 ||
                k5 < 0 ||
                i6 > Rasterizer.virtualBottomX ||
                k6 > Rasterizer.virtualBottomX ||
                k5 > Rasterizer.virtualBottomX
            ) {
                Rasterizer3D.aBoolean1528 = true;
            }
            if (Scene.aBoolean482 && this.method285(Scene.anInt483, Scene.anInt484, j6, l6, l5, i6, k6, k5)) {
                Scene.clickedTileX = j1;
                Scene.anInt486 = k1;
            }
            if (genericTile.texture === -1) {
                if (genericTile.anInt97 !== 12345678) {
                    Rasterizer3D.method503(j6, l6, l5, i6, k6, k5, genericTile.anInt97, genericTile.anInt98, genericTile.anInt96);
                }
            } else if (!Scene.lowMemory) {
                if (genericTile.flat) {
                    Rasterizer3D.method507(
                        j6,
                        l6,
                        l5,
                        i6,
                        k6,
                        k5,
                        genericTile.anInt97,
                        genericTile.anInt98,
                        genericTile.anInt96,
                        i2,
                        i3,
                        l1,
                        l3,
                        i4,
                        k4,
                        k2,
                        j2,
                        j3,
                        genericTile.texture
                    );
                } else {
                    Rasterizer3D.method507(
                        j6,
                        l6,
                        l5,
                        i6,
                        k6,
                        k5,
                        genericTile.anInt97,
                        genericTile.anInt98,
                        genericTile.anInt96,
                        l2,
                        l1,
                        i3,
                        j4,
                        k4,
                        i4,
                        k3,
                        j3,
                        j2,
                        genericTile.texture
                    );
                }
            } else {
                const i7: number = Scene.anIntArray500[genericTile.texture];
                Rasterizer3D.method503(
                    j6,
                    l6,
                    l5,
                    i6,
                    k6,
                    k5,
                    this.method284(genericTile.anInt97, i7, 0),
                    this.method284(genericTile.anInt98, i7, 0),
                    this.method284(genericTile.anInt96, i7, 0)
                );
            }
        }
        if ((i5 - k5) * (l6 - l5) - (j5 - l5) * (k6 - k5) > 0) {
            Rasterizer3D.aBoolean1528 = false;
            if (
                i5 < 0 ||
                k5 < 0 ||
                k6 < 0 ||
                i5 > Rasterizer.virtualBottomX ||
                k5 > Rasterizer.virtualBottomX ||
                k6 > Rasterizer.virtualBottomX
            ) {
                Rasterizer3D.aBoolean1528 = true;
            }
            if (Scene.aBoolean482 && this.method285(Scene.anInt483, Scene.anInt484, j5, l5, l6, i5, k5, k6)) {
                Scene.clickedTileX = j1;
                Scene.anInt486 = k1;
            }
            if (genericTile.texture === -1) {
                if (genericTile.anInt95 !== 12345678) {
                    Rasterizer3D.method503(j5, l5, l6, i5, k5, k6, genericTile.anInt95, genericTile.anInt96, genericTile.anInt98);
                    return;
                }
            } else {
                if (!Scene.lowMemory) {
                    Rasterizer3D.method507(
                        j5,
                        l5,
                        l6,
                        i5,
                        k5,
                        k6,
                        genericTile.anInt95,
                        genericTile.anInt96,
                        genericTile.anInt98,
                        i2,
                        i3,
                        l1,
                        l3,
                        i4,
                        k4,
                        k2,
                        j2,
                        j3,
                        genericTile.texture
                    );
                    return;
                }
                const j7: number = Scene.anIntArray500[genericTile.texture];
                Rasterizer3D.method503(
                    j5,
                    l5,
                    l6,
                    i5,
                    k5,
                    k6,
                    this.method284(genericTile.anInt95, j7, 0),
                    this.method284(genericTile.anInt96, j7, 0),
                    this.method284(genericTile.anInt98, j7, 0)
                );
            }
        }
    }

    public drawTileOverlay(i: number, j: number, complexTile: ComplexTile, k: number, l: number, i1: number, j1: number, byte0: number) {
        let k1: number = complexTile.anIntArray403.length;
        for (let l1: number = 0; l1 < k1; l1++) {
            {
                let i2: number = complexTile.anIntArray403[l1] - Scene.cameraX2;
                let k2: number = complexTile.anIntArray404[l1] - Scene.cameraY2;
                let i3: number = complexTile.anIntArray405[l1] - Scene.cameraZ2;
                let k3: number = (i3 * j1 + i2 * j) >> 16;
                i3 = (i3 * j - i2 * j1) >> 16;
                i2 = k3;
                k3 = (k2 * i - i3 * k) >> 16;
                i3 = (k2 * k + i3 * i) >> 16;
                k2 = k3;
                if (i3 < 50) {
                    return;
                }
                if (complexTile.anIntArray412 != null) {
                    ComplexTile.anIntArray420[l1] = i2;
                    ComplexTile.anIntArray421[l1] = k2;
                    ComplexTile.anIntArray422[l1] = i3;
                }
                ComplexTile.anIntArray418[l1] = Rasterizer3D.centerX + (((i2 << 9) / i3) | 0);
                ComplexTile.anIntArray419[l1] = Rasterizer3D.centerY + (((k2 << 9) / i3) | 0);
            }
        }
        Rasterizer3D.anInt1531 = 0;
        k1 = complexTile.anIntArray409.length;
        if (byte0 !== 3) {
            return;
        }
        for (let j2: number = 0; j2 < k1; j2++) {
            {
                const l2: number = complexTile.anIntArray409[j2];
                const j3: number = complexTile.anIntArray410[j2];
                const l3: number = complexTile.anIntArray411[j2];
                const i4: number = ComplexTile.anIntArray418[l2];
                const j4: number = ComplexTile.anIntArray418[j3];
                const k4: number = ComplexTile.anIntArray418[l3];
                const l4: number = ComplexTile.anIntArray419[l2];
                const i5: number = ComplexTile.anIntArray419[j3];
                const j5: number = ComplexTile.anIntArray419[l3];
                if ((i4 - j4) * (j5 - i5) - (l4 - i5) * (k4 - j4) > 0) {
                    Rasterizer3D.aBoolean1528 = false;
                    if (
                        i4 < 0 ||
                        j4 < 0 ||
                        k4 < 0 ||
                        i4 > Rasterizer.virtualBottomX ||
                        j4 > Rasterizer.virtualBottomX ||
                        k4 > Rasterizer.virtualBottomX
                    ) {
                        Rasterizer3D.aBoolean1528 = true;
                    }
                    if (Scene.aBoolean482 && this.method285(Scene.anInt483, Scene.anInt484, l4, i5, j5, i4, j4, k4)) {
                        Scene.clickedTileX = i1;
                        Scene.anInt486 = l;
                    }
                    if (complexTile.anIntArray412 == null || complexTile.anIntArray412[j2] === -1) {
                        if (complexTile.anIntArray406[j2] !== 12345678) {
                            Rasterizer3D.method503(
                                l4,
                                i5,
                                j5,
                                i4,
                                j4,
                                k4,
                                complexTile.anIntArray406[j2],
                                complexTile.anIntArray407[j2],
                                complexTile.anIntArray408[j2]
                            );
                        }
                    } else if (!Scene.lowMemory) {
                        if (complexTile.aBoolean413) {
                            Rasterizer3D.method507(
                                l4,
                                i5,
                                j5,
                                i4,
                                j4,
                                k4,
                                complexTile.anIntArray406[j2],
                                complexTile.anIntArray407[j2],
                                complexTile.anIntArray408[j2],
                                ComplexTile.anIntArray420[0],
                                ComplexTile.anIntArray420[1],
                                ComplexTile.anIntArray420[3],
                                ComplexTile.anIntArray421[0],
                                ComplexTile.anIntArray421[1],
                                ComplexTile.anIntArray421[3],
                                ComplexTile.anIntArray422[0],
                                ComplexTile.anIntArray422[1],
                                ComplexTile.anIntArray422[3],
                                complexTile.anIntArray412[j2]
                            );
                        } else {
                            Rasterizer3D.method507(
                                l4,
                                i5,
                                j5,
                                i4,
                                j4,
                                k4,
                                complexTile.anIntArray406[j2],
                                complexTile.anIntArray407[j2],
                                complexTile.anIntArray408[j2],
                                ComplexTile.anIntArray420[l2],
                                ComplexTile.anIntArray420[j3],
                                ComplexTile.anIntArray420[l3],
                                ComplexTile.anIntArray421[l2],
                                ComplexTile.anIntArray421[j3],
                                ComplexTile.anIntArray421[l3],
                                ComplexTile.anIntArray422[l2],
                                ComplexTile.anIntArray422[j3],
                                ComplexTile.anIntArray422[l3],
                                complexTile.anIntArray412[j2]
                            );
                        }
                    } else {
                        const k5: number = Scene.anIntArray500[complexTile.anIntArray412[j2]];
                        Rasterizer3D.method503(
                            l4,
                            i5,
                            j5,
                            i4,
                            j4,
                            k4,
                            this.method284(complexTile.anIntArray406[j2], k5, 0),
                            this.method284(complexTile.anIntArray407[j2], k5, 0),
                            this.method284(complexTile.anIntArray408[j2], k5, 0)
                        );
                    }
                }
            }
        }
    }

    public method284(i: number, j: number, k: number): number {
        i = 127 - i;
        i = ((i * (j & 127)) / 160) | 0;
        if (i < 2) {
            i = 2;
        } else if (i > 126) {
            i = 126;
        }
        return (j & 65408) + i;
    }

    public method285(i: number, j: number, k: number, l: number, i1: number, j1: number, k1: number, l1: number): boolean {
        if (j < k && j < l && j < i1) {
            return false;
        }
        if (j > k && j > l && j > i1) {
            return false;
        }
        if (i < j1 && i < k1 && i < l1) {
            return false;
        }
        if (i > j1 && i > k1 && i > l1) {
            return false;
        }
        const i2: number = (j - k) * (k1 - j1) - (i - j1) * (l - k);
        const j2: number = (j - i1) * (j1 - l1) - (i - l1) * (k - i1);
        const k2: number = (j - l) * (l1 - k1) - (i - k1) * (i1 - l);
        return i2 * k2 > 0 && k2 * j2 > 0;
    }

    public method286() {
        const j: number = Scene.anIntArray488[Scene.anInt462];
        const aclass39: SceneCluster[] = Scene.aSceneClusterArrayArray554[Scene.anInt462];
        Scene.anInt490 = 0;
        for (let k: number = 0; k < j; k++) {
            {
                const class39: SceneCluster = aclass39[k];
                if (class39.anInt679 === 1) {
                    const l: number = class39.anInt675 - Scene.screenCenterX + 25;
                    if (l < 0 || l > 50) {
                        continue;
                    }
                    let k1: number = class39.anInt677 - Scene.screenCenterZ + 25;
                    if (k1 < 0) {
                        k1 = 0;
                    }
                    let j2: number = class39.anInt678 - Scene.screenCenterZ + 25;
                    if (j2 > 50) {
                        j2 = 50;
                    }
                    let flag: boolean = false;
                    while (k1 <= j2) {
                        if (Scene.aBooleanArrayArray507[l][k1++]) {
                            flag = true;
                            break;
                        }
                    }
                    if (!flag) {
                        continue;
                    }
                    let j3: number = Scene.cameraX2 - class39.anInt680;
                    if (j3 > 32) {
                        class39.anInt686 = 1;
                    } else {
                        if (j3 >= -32) {
                            continue;
                        }
                        class39.anInt686 = 2;
                        j3 = -j3;
                    }
                    class39.anInt689 = (((class39.anInt682 - Scene.cameraZ2) << 8) / j3) | 0;
                    class39.anInt690 = (((class39.anInt683 - Scene.cameraZ2) << 8) / j3) | 0;
                    class39.anInt691 = (((class39.anInt684 - Scene.cameraY2) << 8) / j3) | 0;
                    class39.anInt692 = (((class39.anInt685 - Scene.cameraY2) << 8) / j3) | 0;
                    Scene.aClass39Array491[Scene.anInt490++] = class39;
                    continue;
                }
                if (class39.anInt679 === 2) {
                    const i1: number = class39.anInt677 - Scene.screenCenterZ + 25;
                    if (i1 < 0 || i1 > 50) {
                        continue;
                    }
                    let l1: number = class39.anInt675 - Scene.screenCenterX + 25;
                    if (l1 < 0) {
                        l1 = 0;
                    }
                    let k2: number = class39.anInt676 - Scene.screenCenterX + 25;
                    if (k2 > 50) {
                        k2 = 50;
                    }
                    let flag1: boolean = false;
                    while (l1 <= k2) {
                        if (Scene.aBooleanArrayArray507[l1++][i1]) {
                            flag1 = true;
                            break;
                        }
                    }
                    if (!flag1) {
                        continue;
                    }
                    let k3: number = Scene.cameraZ2 - class39.anInt682;
                    if (k3 > 32) {
                        class39.anInt686 = 3;
                    } else {
                        if (k3 >= -32) {
                            continue;
                        }
                        class39.anInt686 = 4;
                        k3 = -k3;
                    }
                    class39.anInt687 = (((class39.anInt680 - Scene.cameraX2) << 8) / k3) | 0;
                    class39.anInt688 = (((class39.anInt681 - Scene.cameraX2) << 8) / k3) | 0;
                    class39.anInt691 = (((class39.anInt684 - Scene.cameraY2) << 8) / k3) | 0;
                    class39.anInt692 = (((class39.anInt685 - Scene.cameraY2) << 8) / k3) | 0;
                    Scene.aClass39Array491[Scene.anInt490++] = class39;
                } else if (class39.anInt679 === 4) {
                    const j1: number = class39.anInt684 - Scene.cameraY2;
                    if (j1 > 128) {
                        let i2: number = class39.anInt677 - Scene.screenCenterZ + 25;
                        if (i2 < 0) {
                            i2 = 0;
                        }
                        let l2: number = class39.anInt678 - Scene.screenCenterZ + 25;
                        if (l2 > 50) {
                            l2 = 50;
                        }
                        if (i2 <= l2) {
                            let i3: number = class39.anInt675 - Scene.screenCenterX + 25;
                            if (i3 < 0) {
                                i3 = 0;
                            }
                            let l3: number = class39.anInt676 - Scene.screenCenterX + 25;
                            if (l3 > 50) {
                                l3 = 50;
                            }
                            let flag2: boolean = false;
                            label0: for (let i4: number = i3; i4 <= l3; i4++) {
                                {
                                    for (let j4: number = i2; j4 <= l2; j4++) {
                                        {
                                            if (!Scene.aBooleanArrayArray507[i4][j4]) {
                                                continue;
                                            }
                                            flag2 = true;
                                            break label0;
                                        }
                                    }
                                }
                            }
                            if (flag2) {
                                class39.anInt686 = 5;
                                class39.anInt687 = (((class39.anInt680 - Scene.cameraX2) << 8) / j1) | 0;
                                class39.anInt688 = (((class39.anInt681 - Scene.cameraX2) << 8) / j1) | 0;
                                class39.anInt689 = (((class39.anInt682 - Scene.cameraZ2) << 8) / j1) | 0;
                                class39.anInt690 = (((class39.anInt683 - Scene.cameraZ2) << 8) / j1) | 0;
                                Scene.aClass39Array491[Scene.anInt490++] = class39;
                            }
                        }
                    }
                }
            }
        }
    }

    public isTileOccluded(i: number, j: number, k: number): boolean {
        const l: number = this.anIntArrayArrayArray460[i][j][k];
        if (l === -Scene.cycle) {
            return false;
        }
        if (l === Scene.cycle) {
            return true;
        }
        const i1: number = j << 7;
        const j1: number = k << 7;
        if (
            this.method291(i1 + 1, this.anIntArrayArrayArray455[i][j][k], j1 + 1) &&
            this.method291(i1 + 128 - 1, this.anIntArrayArrayArray455[i][j + 1][k], j1 + 1) &&
            this.method291(i1 + 128 - 1, this.anIntArrayArrayArray455[i][j + 1][k + 1], j1 + 128 - 1) &&
            this.method291(i1 + 1, this.anIntArrayArrayArray455[i][j][k + 1], j1 + 128 - 1)
        ) {
            this.anIntArrayArrayArray460[i][j][k] = Scene.cycle;
            return true;
        } else {
            this.anIntArrayArrayArray460[i][j][k] = -Scene.cycle;
            return false;
        }
    }

    public isWallOccluded(i: number, j: number, k: number, l: number): boolean {
        if (!this.isTileOccluded(i, j, k)) {
            return false;
        }
        const i1: number = j << 7;
        const j1: number = k << 7;
        const k1: number = this.anIntArrayArrayArray455[i][j][k] - 1;
        const l1: number = k1 - 120;
        const i2: number = k1 - 230;
        const j2: number = k1 - 238;
        if (l < 16) {
            if (l === 1) {
                if (i1 > Scene.cameraX2) {
                    if (!this.method291(i1, k1, j1)) {
                        return false;
                    }
                    if (!this.method291(i1, k1, j1 + 128)) {
                        return false;
                    }
                }
                if (i > 0) {
                    if (!this.method291(i1, l1, j1)) {
                        return false;
                    }
                    if (!this.method291(i1, l1, j1 + 128)) {
                        return false;
                    }
                }
                if (!this.method291(i1, i2, j1)) {
                    return false;
                }
                return this.method291(i1, i2, j1 + 128);
            }
            if (l === 2) {
                if (j1 < Scene.cameraZ2) {
                    if (!this.method291(i1, k1, j1 + 128)) {
                        return false;
                    }
                    if (!this.method291(i1 + 128, k1, j1 + 128)) {
                        return false;
                    }
                }
                if (i > 0) {
                    if (!this.method291(i1, l1, j1 + 128)) {
                        return false;
                    }
                    if (!this.method291(i1 + 128, l1, j1 + 128)) {
                        return false;
                    }
                }
                if (!this.method291(i1, i2, j1 + 128)) {
                    return false;
                }
                return this.method291(i1 + 128, i2, j1 + 128);
            }
            if (l === 4) {
                if (i1 < Scene.cameraX2) {
                    if (!this.method291(i1 + 128, k1, j1)) {
                        return false;
                    }
                    if (!this.method291(i1 + 128, k1, j1 + 128)) {
                        return false;
                    }
                }
                if (i > 0) {
                    if (!this.method291(i1 + 128, l1, j1)) {
                        return false;
                    }
                    if (!this.method291(i1 + 128, l1, j1 + 128)) {
                        return false;
                    }
                }
                if (!this.method291(i1 + 128, i2, j1)) {
                    return false;
                }
                return this.method291(i1 + 128, i2, j1 + 128);
            }
            if (l === 8) {
                if (j1 > Scene.cameraZ2) {
                    if (!this.method291(i1, k1, j1)) {
                        return false;
                    }
                    if (!this.method291(i1 + 128, k1, j1)) {
                        return false;
                    }
                }
                if (i > 0) {
                    if (!this.method291(i1, l1, j1)) {
                        return false;
                    }
                    if (!this.method291(i1 + 128, l1, j1)) {
                        return false;
                    }
                }
                if (!this.method291(i1, i2, j1)) {
                    return false;
                }
                return this.method291(i1 + 128, i2, j1);
            }
        }
        if (!this.method291(i1 + 64, j2, j1 + 64)) {
            return false;
        }
        if (l === 16) {
            return this.method291(i1, i2, j1 + 128);
        }
        if (l === 32) {
            return this.method291(i1 + 128, i2, j1 + 128);
        }
        if (l === 64) {
            return this.method291(i1 + 128, i2, j1);
        }
        if (l === 128) {
            return this.method291(i1, i2, j1);
        } else {
            console.info("Warning unsupported wall type");
            return true;
        }
    }

    public isOccluded(i: number, j: number, k: number, l: number): boolean {
        if (!this.isTileOccluded(i, j, k)) {
            return false;
        }
        const i1: number = j << 7;
        const j1: number = k << 7;
        return (
            this.method291(i1 + 1, this.anIntArrayArrayArray455[i][j][k] - l, j1 + 1) &&
            this.method291(i1 + 128 - 1, this.anIntArrayArrayArray455[i][j + 1][k] - l, j1 + 1) &&
            this.method291(i1 + 128 - 1, this.anIntArrayArrayArray455[i][j + 1][k + 1] - l, j1 + 128 - 1) &&
            this.method291(i1 + 1, this.anIntArrayArrayArray455[i][j][k + 1] - l, j1 + 128 - 1)
        );
    }

    public isAreaOccluded(i: number, j: number, k: number, l: number, i1: number, j1: number): boolean {
        if (j === k && l === i1) {
            if (!this.isTileOccluded(i, j, l)) {
                return false;
            }
            const k1: number = j << 7;
            const i2: number = l << 7;
            return (
                this.method291(k1 + 1, this.anIntArrayArrayArray455[i][j][l] - j1, i2 + 1) &&
                this.method291(k1 + 128 - 1, this.anIntArrayArrayArray455[i][j + 1][l] - j1, i2 + 1) &&
                this.method291(k1 + 128 - 1, this.anIntArrayArrayArray455[i][j + 1][l + 1] - j1, i2 + 128 - 1) &&
                this.method291(k1 + 1, this.anIntArrayArrayArray455[i][j][l + 1] - j1, i2 + 128 - 1)
            );
        }
        for (let l1: number = j; l1 <= k; l1++) {
            {
                for (let j2: number = l; j2 <= i1; j2++) {
                    if (this.anIntArrayArrayArray460[i][l1][j2] === -Scene.cycle) {
                        return false;
                    }
                }
            }
        }
        const k2: number = (j << 7) + 1;
        const l2: number = (l << 7) + 2;
        const i3: number = this.anIntArrayArrayArray455[i][j][l] - j1;
        if (!this.method291(k2, i3, l2)) {
            return false;
        }
        const j3: number = (k << 7) - 1;
        if (!this.method291(j3, i3, l2)) {
            return false;
        }
        const k3: number = (i1 << 7) - 1;
        if (!this.method291(k2, i3, k3)) {
            return false;
        }
        return this.method291(j3, i3, k3);
    }

    public method291(i: number, j: number, k: number): boolean {
        for (let l: number = 0; l < Scene.anInt490; l++) {
            {
                const class39: SceneCluster = Scene.aClass39Array491[l];
                if (class39.anInt686 === 1) {
                    const i1: number = class39.anInt680 - i;
                    if (i1 > 0) {
                        const j2: number = class39.anInt682 + ((class39.anInt689 * i1) >> 8);
                        const k3: number = class39.anInt683 + ((class39.anInt690 * i1) >> 8);
                        const l4: number = class39.anInt684 + ((class39.anInt691 * i1) >> 8);
                        const i6: number = class39.anInt685 + ((class39.anInt692 * i1) >> 8);
                        if (k >= j2 && k <= k3 && j >= l4 && j <= i6) {
                            return true;
                        }
                    }
                } else if (class39.anInt686 === 2) {
                    const j1: number = i - class39.anInt680;
                    if (j1 > 0) {
                        const k2: number = class39.anInt682 + ((class39.anInt689 * j1) >> 8);
                        const l3: number = class39.anInt683 + ((class39.anInt690 * j1) >> 8);
                        const i5: number = class39.anInt684 + ((class39.anInt691 * j1) >> 8);
                        const j6: number = class39.anInt685 + ((class39.anInt692 * j1) >> 8);
                        if (k >= k2 && k <= l3 && j >= i5 && j <= j6) {
                            return true;
                        }
                    }
                } else if (class39.anInt686 === 3) {
                    const k1: number = class39.anInt682 - k;
                    if (k1 > 0) {
                        const l2: number = class39.anInt680 + ((class39.anInt687 * k1) >> 8);
                        const i4: number = class39.anInt681 + ((class39.anInt688 * k1) >> 8);
                        const j5: number = class39.anInt684 + ((class39.anInt691 * k1) >> 8);
                        const k6: number = class39.anInt685 + ((class39.anInt692 * k1) >> 8);
                        if (i >= l2 && i <= i4 && j >= j5 && j <= k6) {
                            return true;
                        }
                    }
                } else if (class39.anInt686 === 4) {
                    const l1: number = k - class39.anInt682;
                    if (l1 > 0) {
                        const i3: number = class39.anInt680 + ((class39.anInt687 * l1) >> 8);
                        const j4: number = class39.anInt681 + ((class39.anInt688 * l1) >> 8);
                        const k5: number = class39.anInt684 + ((class39.anInt691 * l1) >> 8);
                        const l6: number = class39.anInt685 + ((class39.anInt692 * l1) >> 8);
                        if (i >= i3 && i <= j4 && j >= k5 && j <= l6) {
                            return true;
                        }
                    }
                } else if (class39.anInt686 === 5) {
                    const i2: number = j - class39.anInt684;
                    if (i2 > 0) {
                        const j3: number = class39.anInt680 + ((class39.anInt687 * i2) >> 8);
                        const k4: number = class39.anInt681 + ((class39.anInt688 * i2) >> 8);
                        const l5: number = class39.anInt682 + ((class39.anInt689 * i2) >> 8);
                        const i7: number = class39.anInt683 + ((class39.anInt690 * i2) >> 8);
                        if (i >= j3 && i <= k4 && k >= l5 && k <= i7) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }
}

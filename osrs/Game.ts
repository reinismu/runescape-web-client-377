import cacheData from "./../client_cache/*.dat";
import cacheIndices from "./../client_cache/*.idx*";
import { Index } from "./cache/Index";
import { Archive } from "./cache/Archive";
import { TypeFace } from "./cache/media/TypeFace";
import { GameShell } from "./GameShell";
import { ProducingGraphicsBuffer } from "./media/ProducingGraphicsBuffer";
import { Rasterizer } from "./media/Rasterizer";
import { ImageRGB } from "./cache/media/ImageRGB";
import { IndexedImage } from "./cache/media/IndexedImage";
import { Buffer } from "./net/Buffer";
import { Scene } from "./scene/Scene";
import { CollisionMap } from "./scene/util/CollisionMap";
import { Socket } from "./net/Socket";
import { OnDemandRequester } from "./net/requester/OnDemandRequester";
import { Animation } from "./media/Animation";
import { Model } from "./media/renderable/Model";
import { OnDemandNode } from "./net/requester/OnDemandNode";
import { Region } from "./scene/Region";
import { Rasterizer3D } from "./media/Rasterizer3D";
import { AnimationSequence } from "./cache/media/AnimationSequence";
import { GameObjectDefinition } from "./cache/def/GameObjectDefinition";
import { FloorDefinition } from "./cache/def/FloorDefinition";
import { ItemDefinition } from "./cache/def/ItemDefinition";
import { ActorDefinition } from "./cache/def/ActorDefinition";
import { IdentityKit } from "./cache/media/IdentityKit";
import { SpotAnimation } from "./cache/media/SpotAnimation";
import { Varp } from "./cache/cfg/Varp";
import { Varbit } from "./cache/cfg/Varbit";
import { SoundTrack } from "./sound/SoundTrack";
import { Widget } from "./cache/media/Widget";
import { MouseCapturer } from "./util/MouseCapturer";
import { ChatCensor } from "./cache/cfg/ChatCensor";
import { GameObject } from "./media/renderable/GameObject";
import { Player } from "./media/renderable/actor/Player";

interface GameConfig {
    host: string;
}

const sleep = milliseconds => {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
};

function init_SKILL_EXPERIENCE() {
    const bitfield = Array(99).fill(0);
    let value: number = 0;
    for (let level: number = 0; level < 99; level++) {
        {
            const realLevel: number = level + 1;
            const expDiff: number = (((realLevel as number) + 300.0 * Math.pow(2.0, (realLevel as number) / 7.0)) as number) | 0;
            value += expDiff;
            bitfield[level] = (value / 4) | 0;
        }
    }
    return bitfield;
}

function init_BITFIELD_MAX_VALUE() {
    const bitfield = Array(32).fill(0);
    let value = 2;
    for (let k: number = 0; k < 32; k++) {
        {
            bitfield[k] = value - 1;
            value += value;
        }
    }
    return bitfield;
}

export class Game extends GameShell {
    public static pulseCycle: number = 0;
    public static portOffset: number = 0;
    public static BITFIELD_MAX_VALUE: number[] = init_BITFIELD_MAX_VALUE();
    public static SKILL_EXPERIENCE: number[] = init_SKILL_EXPERIENCE();
    public static memberServer: boolean = true;
    public static lowMemory: boolean = true;
    public static localPlayer: Player = null;
    static playerColours: number[][] = [
        [6798, 107, 10283, 16, 4797, 7744, 5799, 4634, 33697, 22433, 2983, 54193],
        [8741, 12, 64030, 43162, 7735, 8404, 1701, 38430, 24094, 10153, 56621, 4783, 1341, 16578, 35003, 25239],
        [25238, 8742, 12, 64030, 43162, 7735, 8404, 1701, 38430, 24094, 10153, 56621, 4783, 1341, 16578, 35003],
        [4626, 11146, 6439, 12, 4758, 10270],
        [4550, 4537, 5681, 5673, 5790, 6806, 8076, 4574]
    ];
    static SKIN_COLOURS: number[] = [9104, 10275, 7595, 3610, 7975, 8526, 918, 38802, 24466, 10145, 58654, 5027, 1457, 16565, 34991, 25486];

    public stores: Index[] = [];
    public archiveHashes: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0]; // currently unused
    titleArchive: Archive = null;
    fontSmall: TypeFace = null;
    fontNormal: TypeFace = null;
    fontBold: TypeFace = null;
    fontFancy: TypeFace = null;
    flameLeftBackground: ProducingGraphicsBuffer = null;
    flameRightBackground: ProducingGraphicsBuffer = null;
    aClass18_1198: ProducingGraphicsBuffer = null;
    aClass18_1199: ProducingGraphicsBuffer = null;
    aClass18_1200: ProducingGraphicsBuffer = null;
    aClass18_1203: ProducingGraphicsBuffer = null;
    aClass18_1204: ProducingGraphicsBuffer = null;
    aClass18_1205: ProducingGraphicsBuffer = null;
    aClass18_1206: ProducingGraphicsBuffer = null;
    chatboxProducingGraphicsBuffer: ProducingGraphicsBuffer = null;
    aClass18_1157: ProducingGraphicsBuffer = null;
    aClass18_1156: ProducingGraphicsBuffer = null;
    aClass18_1158: ProducingGraphicsBuffer = null;
    aClass18_1108: ProducingGraphicsBuffer = null;
    aClass18_1109: ProducingGraphicsBuffer = null;
    aBoolean1046: boolean = false;
    titleboxImage: IndexedImage = null;
    titleboxButtonImage: IndexedImage = null;
    titleFlameEmblem: any[];
    anImageRGB1226: ImageRGB = null;
    anImageRGB1227: ImageRGB = null;
    anIntArray1311: number[];
    anIntArray1312: number[];
    anIntArray1313: number[];
    anIntArray1310: number[];
    anIntArray1176: number[];
    anIntArray1177: number[];
    anIntArray1084: number[];
    anIntArray1085: number[];
    startedRenderingFlames: boolean = false;
    shouldRenderFlames: boolean = false;
    packetSize: number = 0;
    aBoolean1320: boolean = false;
    flameCycle: number = 0;
    anInt1238: number = 0;
    anIntArray1166: number[] = (s => {
        const a = [];
        while (s-- > 0) {
            a.push(0);
        }
        return a;
    })(256);
    public outBuffer: Buffer = Buffer.allocate(1);
    anInt1047: number = 0;
    anInt1048: number = 0;
    anInt1322: number = 0;
    aString1027: string = null;
    aBoolean1243: boolean = false;
    renderDelay: number = 0;
    currentSceneTileFlags: number[][][] = null;
    anIntArrayArrayArray891: number[][][] = null;
    currentScene: Scene = null;
    currentCollisionMap: CollisionMap[] = Array(4).fill(null);
    minimapImage: ImageRGB = null;
    loggedIn: boolean = false;
    gameConfig: GameConfig = {
        host: "localhost"
    } as GameConfig;
    onDemandRequester: OnDemandRequester = null;
    opcode: number = 0;
    redrawTabArea: boolean = false;
    backDialogueId: number = -1;
    nextSong: number = 0;
    dialogueId: number = -1;
    redrawChatbox: boolean = false;
    loadingStage: number = 0;
    aByteArrayArray838: number[][] = null;
    anIntArray857: number[] = null;
    anIntArray858: number[] = null;
    aByteArrayArray1232: number[][] = null;
    songChanging: boolean = true;
    musicEnabled: boolean = true;
    widgetSettings: number[] = Array(2000).fill(0);
    inventoryBackgroundImage: IndexedImage = null;
    chatboxBackgroundImage: IndexedImage = null;
    minimapBackgroundImage: IndexedImage = null;
    anIndexedImage1052: IndexedImage = null;
    anIndexedImage1053: IndexedImage = null;
    anIndexedImage1054: IndexedImage = null;
    tabIcon: IndexedImage[] = Array(13).fill(null);
    minimapCompass: ImageRGB = null;
    minimapEdge: ImageRGB = null;
    aClass50_Sub1_Sub1_Sub3Array1153: IndexedImage[] = Array(100).fill(null);
    worldMapHintIcons: ImageRGB[] = Array(100).fill(null);
    aClass50_Sub1_Sub1_Sub1Array1182: ImageRGB[] = Array(20).fill(null);
    aClass50_Sub1_Sub1_Sub1Array1288: ImageRGB[] = Array(32).fill(null);
    aClass50_Sub1_Sub1_Sub1Array1079: ImageRGB[] = Array(32).fill(null);
    aClass50_Sub1_Sub1_Sub1Array954: ImageRGB[] = Array(32).fill(null);
    aClass50_Sub1_Sub1_Sub1_1037: ImageRGB = null;
    aClass50_Sub1_Sub1_Sub1_1086: ImageRGB = null;
    mapFlagMarker: ImageRGB = null;
    mapdotItem: ImageRGB = null;
    mapdotActor: ImageRGB = null;
    mapdotPlayer: ImageRGB = null;
    mapdotFriend: ImageRGB = null;
    mapdotTeammate: ImageRGB = null;
    cursorCross: ImageRGB[] = Array(8).fill(null);
    scrollbarUp: IndexedImage = null;
    scrollbarDown: IndexedImage = null;
    aClass50_Sub1_Sub1_Sub3_880: IndexedImage = null;
    aClass50_Sub1_Sub1_Sub3_881: IndexedImage = null;
    aClass50_Sub1_Sub1_Sub3_882: IndexedImage = null;
    aClass50_Sub1_Sub1_Sub3_883: IndexedImage = null;
    aClass50_Sub1_Sub1_Sub3_884: IndexedImage = null;
    aClass50_Sub1_Sub1_Sub3_983: IndexedImage = null;
    aClass50_Sub1_Sub1_Sub3_984: IndexedImage = null;
    aClass50_Sub1_Sub1_Sub3_985: IndexedImage = null;
    aClass50_Sub1_Sub1_Sub3_986: IndexedImage = null;
    aClass50_Sub1_Sub1_Sub3_987: IndexedImage = null;
    moderatorIcon: IndexedImage[] = Array(2).fill(null);
    anIntArray1180: number[] = Array(33).fill(0);
    anIntArray1286: number[] = Array(33).fill(0);
    anIntArray1019: number[] = Array(151).fill(0);
    anIntArray920: number[] = Array(151).fill(0);
    anIntArray1003: number[] = null;
    chatboxLineOffsets: number[] = null;
    anIntArray1001: number[] = null;
    anIntArray1002: number[] = null;
    mouseCapturer: MouseCapturer = null;
    aClass18_906: ProducingGraphicsBuffer = null;
    aClass18_907: ProducingGraphicsBuffer = null;
    aClass18_908: ProducingGraphicsBuffer = null;
    aClass18_909: ProducingGraphicsBuffer = null;
    aClass18_910: ProducingGraphicsBuffer = null;
    aClass18_911: ProducingGraphicsBuffer = null;
    aClass18_912: ProducingGraphicsBuffer = null;
    aClass18_913: ProducingGraphicsBuffer = null;
    aClass18_914: ProducingGraphicsBuffer = null;

    runBound = this.run.bind(this);

    constructor(canvas: HTMLCanvasElement) {
        super(canvas);
    }

    public async startUp() {
        this.drawLoadingText(20, "Starting up");
        await this.initStores();
        this.initArchives();
        this.initTypeFaces();

        await this.prepareTitleBackground();
        await this.prepareTitle();

        const configArchive: Archive = this.requestArchive(2, "config", this.archiveHashes[2], 30, "config");
        const archiveInterface: Archive = this.requestArchive(3, "interface", this.archiveHashes[3], 35, "interface");
        const archiveMedia: Archive = this.requestArchive(4, "media", this.archiveHashes[4], 40, "2d gameGraphics");
        const textureArchive: Archive = this.requestArchive(6, "textures", this.archiveHashes[6], 45, "textures");
        const chatArchive: Archive = this.requestArchive(7, "wordenc", this.archiveHashes[7], 50, "chat system");
        const soundArchive: Archive = this.requestArchive(8, "sounds", this.archiveHashes[8], 55, "sound effects");

        this.currentSceneTileFlags = Array<Array<Array<number>>>(4).fill(Array<Array<number>>(104).fill(Array<number>(104).fill(0)));
        this.anIntArrayArrayArray891 = Array<Array<Array<number>>>(4).fill(Array<Array<number>>(105).fill(Array<number>(105).fill(0)));

        this.currentScene = new Scene(this.anIntArrayArrayArray891, 104, 4, 104, 5);
        for (let j: number = 0; j < 4; j++) {
            this.currentCollisionMap[j] = new CollisionMap(104, 104);
        }
        this.minimapImage = ImageRGB.from(512, 512);
        const versionListArchive: Archive = this.requestArchive(5, "versionlist", this.archiveHashes[5], 60, "update list");
        this.drawLoadingText(60, "Connecting to update server");

        this.onDemandRequester = new OnDemandRequester();
        this.onDemandRequester.init(versionListArchive, this);
        Animation.method235(this.onDemandRequester.animCount());
        Model.init(this.onDemandRequester.fileCount(0), this.onDemandRequester);

        // TODO fix sound
        // if (!Game.lowMemory) {
        //     this.nextSong = 0;
        //     try {
        //         this.nextSong = javaemul.internal.IntegerHelper.parseInt(this.getParameter("music"));
        //     } catch (ignored) {
        //     }
        //     this.songChanging = true;
        //     this.onDemandRequester.request(2, this.nextSong);
        //     while ((this.onDemandRequester.immediateRequestsCount() > 0)) {{
        //         this.method77(false);
        //         try {
        //             java.lang.Thread.sleep(100);
        //         } catch (ignored) {
        //         }
        //         if (this.onDemandRequester.requestFails > 3) {
        //             this.method19("ondemand");
        //             return;
        //         }
        //     }}
        // }

        this.drawLoadingText(65, "Requesting animations");

        let fileRequestCount: number = this.onDemandRequester.fileCount(1);
        for (let i: number = 0; i < fileRequestCount; i++) {
            this.onDemandRequester.request(1, i);
        }
        while (this.onDemandRequester.immediateRequestsCount() > 0) {
            await sleep(100);
            const total: number = fileRequestCount - this.onDemandRequester.immediateRequestsCount();
            if (total > 0) {
                this.drawLoadingText(65, "Loading animations - " + (((total * 100) / fileRequestCount) | 0) + "%");
            }
            this.method77(false);
            if (this.onDemandRequester.requestFails > 3) {
                this.method19("ondemand");
                return;
            }
        }
        this.drawLoadingText(70, "Requesting models");

        fileRequestCount = this.onDemandRequester.fileCount(0);
        for (let i: number = 0; i < fileRequestCount; i++) {
            {
                const id: number = this.onDemandRequester.modelId(i);
                if ((id & 1) !== 0) {
                    this.onDemandRequester.request(0, i);
                }
            }
        }
        fileRequestCount = this.onDemandRequester.immediateRequestsCount();
        while (this.onDemandRequester.immediateRequestsCount() > 0) {
            {
                const total: number = fileRequestCount - this.onDemandRequester.immediateRequestsCount();
                if (total > 0) {
                    this.drawLoadingText(70, "Loading models - " + (((total * 100) / fileRequestCount) | 0) + "%");
                }
                this.method77(false);
                try {
                    await sleep(100);
                } catch (ignored) {}
            }
        }

        if (this.stores[0] != null) {
            this.drawLoadingText(75, "Requesting maps");
            this.onDemandRequester.request(3, this.onDemandRequester.regId(0, 47, 48, 0));
            this.onDemandRequester.request(3, this.onDemandRequester.regId(0, 47, 48, 1));
            this.onDemandRequester.request(3, this.onDemandRequester.regId(0, 48, 48, 0));
            this.onDemandRequester.request(3, this.onDemandRequester.regId(0, 48, 48, 1));
            this.onDemandRequester.request(3, this.onDemandRequester.regId(0, 49, 48, 0));
            this.onDemandRequester.request(3, this.onDemandRequester.regId(0, 49, 48, 1));
            this.onDemandRequester.request(3, this.onDemandRequester.regId(0, 47, 47, 0));
            this.onDemandRequester.request(3, this.onDemandRequester.regId(0, 47, 47, 1));
            this.onDemandRequester.request(3, this.onDemandRequester.regId(0, 48, 47, 0));
            this.onDemandRequester.request(3, this.onDemandRequester.regId(0, 48, 47, 1));
            this.onDemandRequester.request(3, this.onDemandRequester.regId(0, 48, 148, 0));
            this.onDemandRequester.request(3, this.onDemandRequester.regId(0, 48, 148, 1));
            fileRequestCount = this.onDemandRequester.immediateRequestsCount();
            while (this.onDemandRequester.immediateRequestsCount() > 0) {
                {
                    const total: number = fileRequestCount - this.onDemandRequester.immediateRequestsCount();
                    if (total > 0) {
                        this.drawLoadingText(75, "Loading maps - " + (((total * 100) / fileRequestCount) | 0) + "%");
                    }
                    this.method77(false);
                    try {
                        await sleep(100);
                    } catch (ignored) {}
                }
            }
        }

        fileRequestCount = this.onDemandRequester.fileCount(0);
        for (let i: number = 0; i < fileRequestCount; i++) {
            {
                const id: number = this.onDemandRequester.modelId(i);
                let priority: number = 0;
                if ((id & 8) !== 0) {
                    priority = 10;
                } else if ((id & 32) !== 0) {
                    priority = 9;
                } else if ((id & 16) !== 0) {
                    priority = 8;
                } else if ((id & 64) !== 0) {
                    priority = 7;
                } else if ((id & 128) !== 0) {
                    priority = 6;
                } else if ((id & 2) !== 0) {
                    priority = 5;
                } else if ((id & 4) !== 0) {
                    priority = 4;
                }
                if ((id & 1) !== 0) {
                    priority = 3;
                }
                if (priority !== 0) {
                    this.onDemandRequester.setPriority(priority, 0, i);
                }
            }
        }
        this.onDemandRequester.preloadRegions(Game.memberServer);
        if (!Game.lowMemory) {
            fileRequestCount = this.onDemandRequester.fileCount(2);
            for (let i: number = 1; i < fileRequestCount; i++) {
                {
                    if (this.onDemandRequester.midiIdEqualsOne(i)) {
                        this.onDemandRequester.setPriority((1 as number) | 0, 2, i);
                    }
                }
            }
        }
        fileRequestCount = this.onDemandRequester.fileCount(0);
        for (let i: number = 0; i < fileRequestCount; i++) {
            {
                const id: number = this.onDemandRequester.modelId(i);
                if (id === 0 && this.onDemandRequester.anInt1350 < 200) {
                    this.onDemandRequester.setPriority((1 as number) | 0, 0, i);
                }
            }
        }
        this.drawLoadingText(80, "Unpacking media");

        this.inventoryBackgroundImage = new IndexedImage(archiveMedia, "invback", 0);
        this.chatboxBackgroundImage = new IndexedImage(archiveMedia, "chatback", 0);
        this.minimapBackgroundImage = new IndexedImage(archiveMedia, "mapback", 0);
        this.anIndexedImage1052 = new IndexedImage(archiveMedia, "backbase1", 0);
        this.anIndexedImage1053 = new IndexedImage(archiveMedia, "backbase2", 0);
        this.anIndexedImage1054 = new IndexedImage(archiveMedia, "backhmid1", 0);

        for (let i: number = 0; i < 13; i++) {
            this.tabIcon[i] = new IndexedImage(archiveMedia, "sideicons", i);
        }
        this.minimapCompass = ImageRGB.fromArchive(archiveMedia, "compass", 0);
        this.minimapEdge = ImageRGB.fromArchive(archiveMedia, "mapedge", 0);
        this.minimapEdge.trim();

        for (let i: number = 0; i < 72; i++) {
            this.aClass50_Sub1_Sub1_Sub3Array1153[i] = new IndexedImage(archiveMedia, "mapscene", i);
        }
        for (let i: number = 0; i < 70; i++) {
            this.worldMapHintIcons[i] = ImageRGB.fromArchive(archiveMedia, "mapfunction", i);
        }
        for (let i: number = 0; i < 5; i++) {
            this.aClass50_Sub1_Sub1_Sub1Array1182[i] = ImageRGB.fromArchive(archiveMedia, "hitmarks", i);
        }
        for (let i: number = 0; i < 6; i++) {
            this.aClass50_Sub1_Sub1_Sub1Array1288[i] = ImageRGB.fromArchive(archiveMedia, "headicons_pk", i);
        }
        for (let i: number = 0; i < 9; i++) {
            this.aClass50_Sub1_Sub1_Sub1Array1079[i] = ImageRGB.fromArchive(archiveMedia, "headicons_prayer", i);
        }
        for (let i: number = 0; i < 6; i++) {
            this.aClass50_Sub1_Sub1_Sub1Array954[i] = ImageRGB.fromArchive(archiveMedia, "headicons_hint", i);
        }

        this.aClass50_Sub1_Sub1_Sub1_1086 = ImageRGB.fromArchive(archiveMedia, "overlay_multiway", 0);
        this.mapFlagMarker = ImageRGB.fromArchive(archiveMedia, "mapmarker", 0);
        this.aClass50_Sub1_Sub1_Sub1_1037 = ImageRGB.fromArchive(archiveMedia, "mapmarker", 1);
        for (let i: number = 0; i < 8; i++) {
            this.cursorCross[i] = ImageRGB.fromArchive(archiveMedia, "cross", i);
        }
        this.mapdotItem = ImageRGB.fromArchive(archiveMedia, "mapdots", 0);
        this.mapdotActor = ImageRGB.fromArchive(archiveMedia, "mapdots", 1);
        this.mapdotPlayer = ImageRGB.fromArchive(archiveMedia, "mapdots", 2);
        this.mapdotFriend = ImageRGB.fromArchive(archiveMedia, "mapdots", 3);
        this.mapdotTeammate = ImageRGB.fromArchive(archiveMedia, "mapdots", 4);
        this.scrollbarUp = new IndexedImage(archiveMedia, "scrollbar", 0);
        this.scrollbarDown = new IndexedImage(archiveMedia, "scrollbar", 1);
        this.aClass50_Sub1_Sub1_Sub3_880 = new IndexedImage(archiveMedia, "redstone1", 0);
        this.aClass50_Sub1_Sub1_Sub3_881 = new IndexedImage(archiveMedia, "redstone2", 0);
        this.aClass50_Sub1_Sub1_Sub3_882 = new IndexedImage(archiveMedia, "redstone3", 0);
        this.aClass50_Sub1_Sub1_Sub3_883 = new IndexedImage(archiveMedia, "redstone1", 0);
        this.aClass50_Sub1_Sub1_Sub3_883.flipHorizontal();
        this.aClass50_Sub1_Sub1_Sub3_884 = new IndexedImage(archiveMedia, "redstone2", 0);
        this.aClass50_Sub1_Sub1_Sub3_884.flipHorizontal();
        this.aClass50_Sub1_Sub1_Sub3_983 = new IndexedImage(archiveMedia, "redstone1", 0);
        this.aClass50_Sub1_Sub1_Sub3_983.flipVertical();
        this.aClass50_Sub1_Sub1_Sub3_984 = new IndexedImage(archiveMedia, "redstone2", 0);
        this.aClass50_Sub1_Sub1_Sub3_984.flipVertical();
        this.aClass50_Sub1_Sub1_Sub3_985 = new IndexedImage(archiveMedia, "redstone3", 0);
        this.aClass50_Sub1_Sub1_Sub3_985.flipVertical();
        this.aClass50_Sub1_Sub1_Sub3_986 = new IndexedImage(archiveMedia, "redstone1", 0);
        this.aClass50_Sub1_Sub1_Sub3_986.flipHorizontal();
        this.aClass50_Sub1_Sub1_Sub3_986.flipVertical();
        this.aClass50_Sub1_Sub1_Sub3_987 = new IndexedImage(archiveMedia, "redstone2", 0);
        this.aClass50_Sub1_Sub1_Sub3_987.flipHorizontal();
        this.aClass50_Sub1_Sub1_Sub3_987.flipVertical();

        for (let i: number = 0; i < 2; i++) {
            this.moderatorIcon[i] = new IndexedImage(archiveMedia, "mod_icons", i);
        }
        let image: ImageRGB = ImageRGB.fromArchive(archiveMedia, "backleft1", 0);
        this.aClass18_906 = new ProducingGraphicsBuffer(image.width, image.height);
        image.drawInverse(0, 0);
        image = ImageRGB.fromArchive(archiveMedia, "backleft2", 0);
        this.aClass18_907 = new ProducingGraphicsBuffer(image.width, image.height);
        image.drawInverse(0, 0);
        image = ImageRGB.fromArchive(archiveMedia, "backright1", 0);
        this.aClass18_908 = new ProducingGraphicsBuffer(image.width, image.height);
        image.drawInverse(0, 0);
        image = ImageRGB.fromArchive(archiveMedia, "backright2", 0);
        this.aClass18_909 = new ProducingGraphicsBuffer(image.width, image.height);
        image.drawInverse(0, 0);
        image = ImageRGB.fromArchive(archiveMedia, "backtop1", 0);
        this.aClass18_910 = new ProducingGraphicsBuffer(image.width, image.height);
        image.drawInverse(0, 0);
        image = ImageRGB.fromArchive(archiveMedia, "backvmid1", 0);
        this.aClass18_911 = new ProducingGraphicsBuffer(image.width, image.height);
        image.drawInverse(0, 0);
        image = ImageRGB.fromArchive(archiveMedia, "backvmid2", 0);
        this.aClass18_912 = new ProducingGraphicsBuffer(image.width, image.height);
        image.drawInverse(0, 0);
        image = ImageRGB.fromArchive(archiveMedia, "backvmid3", 0);
        this.aClass18_913 = new ProducingGraphicsBuffer(image.width, image.height);
        image.drawInverse(0, 0);
        image = ImageRGB.fromArchive(archiveMedia, "backhmid2", 0);
        this.aClass18_914 = new ProducingGraphicsBuffer(image.width, image.height);
        image.drawInverse(0, 0);
        const offset: number = (((Math.random() * 41.0) as number) | 0) - 20;
        const red: number = (((Math.random() * 21.0 - 10) as number) | 0) + offset;
        const green: number = (((Math.random() * 21.0 - 10) as number) | 0) + offset;
        const blue: number = (((Math.random() * 21.0 - 10) as number) | 0) + offset;
        for (let i: number = 0; i < 100; i++) {
            {
                if (this.worldMapHintIcons[i] != null) {
                    this.worldMapHintIcons[i].adjustRGB(red, green, blue);
                }
                if (this.aClass50_Sub1_Sub1_Sub3Array1153[i] != null) {
                    this.aClass50_Sub1_Sub1_Sub3Array1153[i].mixPalette(red, green, blue);
                }
            }
        }
        this.drawLoadingText(83, "Unpacking textures");

        Rasterizer3D.loadIndexedImages(textureArchive);
        Rasterizer3D.method501(0.8);
        Rasterizer3D.method496(20);
        this.drawLoadingText(86, "Unpacking config");
        AnimationSequence.load(configArchive);
        GameObjectDefinition.load(configArchive);
        FloorDefinition.load(configArchive);
        ItemDefinition.load(configArchive);
        ActorDefinition.load(configArchive);
        IdentityKit.load(configArchive);
        SpotAnimation.load(configArchive);
        Varp.load(configArchive);
        Varbit.load(configArchive);
        ItemDefinition.memberServer = Game.memberServer;
        if (!Game.lowMemory) {
            this.drawLoadingText(90, "Unpacking sounds");
            const bytes: number[] = soundArchive.getFile("sounds.dat");
            const buffer: Buffer = new Buffer(bytes);
            SoundTrack.load(buffer);
        }
        this.drawLoadingText(95, "Unpacking interfaces");

        const typefaces: TypeFace[] = [this.fontSmall, this.fontNormal, this.fontBold, this.fontFancy];
        Widget.load(archiveInterface, typefaces, archiveMedia);
        this.drawLoadingText(100, "Preparing game engine");

        for (let y: number = 0; y < 33; y++) {
            {
                let minWidth: number = 999;
                let maxWidth: number = 0;
                for (let x: number = 0; x < 34; x++) {
                    {
                        if (this.minimapBackgroundImage.pixels[x + y * this.minimapBackgroundImage.width] === 0) {
                            if (minWidth === 999) {
                                minWidth = x;
                            }
                            continue;
                        }
                        if (minWidth === 999) {
                            continue;
                        }
                        maxWidth = x;
                        break;
                    }
                }
                this.anIntArray1180[y] = minWidth;
                this.anIntArray1286[y] = maxWidth - minWidth;
            }
        }
        for (let y: number = 5; y < 156; y++) {
            {
                let minWidth: number = 999;
                let maxWidth: number = 0;
                for (let x: number = 25; x < 172; x++) {
                    {
                        if (this.minimapBackgroundImage.pixels[x + y * this.minimapBackgroundImage.width] === 0 && (x > 34 || y > 34)) {
                            if (minWidth === 999) {
                                minWidth = x;
                            }
                            continue;
                        }
                        if (minWidth === 999) {
                            continue;
                        }
                        maxWidth = x;
                        break;
                    }
                }
                this.anIntArray1019[y - 5] = minWidth - 25;
                this.anIntArray920[y - 5] = maxWidth - minWidth;
            }
        }
        Rasterizer3D.method494(765, 503);
        this.anIntArray1003 = Rasterizer3D.lineOffsets;
        Rasterizer3D.method494(479, 96);
        this.chatboxLineOffsets = Rasterizer3D.lineOffsets;
        Rasterizer3D.method494(190, 261);
        this.anIntArray1001 = Rasterizer3D.lineOffsets;
        Rasterizer3D.method494(512, 334);
        this.anIntArray1002 = Rasterizer3D.lineOffsets;
        const ai: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (let i: number = 0; i < 9; i++) {
            {
                const j9: number = 128 + i * 32 + 15;
                const k9: number = 600 + j9 * 3;
                const l9: number = Rasterizer3D.SINE[j9];
                ai[i] = (k9 * l9) >> 16;
            }
        }
        Scene.method277(500, 800, 512, 334, ai);
        ChatCensor.load(chatArchive);
        this.mouseCapturer = new MouseCapturer(this);
        this.mouseCapturer.run();
        GameObject.client = this;
        GameObjectDefinition.client = this;
        ActorDefinition.client = this;
    }

    public method19(s: string) {
        try {
            console.error("Error: " + s);
        } catch (exception) {
            console.error(exception.message, exception);
        }
        this.exit();
    }

    public method77(flag: boolean) {
        if (flag) {
            this.opcode = -1;
        }
        do {
            {
                let onDemandDone: OnDemandNode;
                do {
                    {
                        onDemandDone = this.onDemandRequester.next();
                        if (onDemandDone == null) {
                            return;
                        }
                        if (onDemandDone.type === 0) {
                            Model.loadModelHeader(onDemandDone.buffer, onDemandDone.id);
                            if ((this.onDemandRequester.modelId(onDemandDone.id) & 98) !== 0) {
                                this.redrawTabArea = true;
                                if (this.backDialogueId !== -1 || this.dialogueId !== -1) {
                                    this.redrawChatbox = true;
                                }
                            }
                        }
                        if (onDemandDone.type === 1 && onDemandDone.buffer != null) {
                            Animation.method236(onDemandDone.buffer);
                        }
                        if (onDemandDone.type === 2 && onDemandDone.id === this.nextSong && onDemandDone.buffer != null) {
                            this.method24(this.songChanging, onDemandDone.buffer, 659);
                        }
                        if (onDemandDone.type === 3 && this.loadingStage === 1) {
                            for (let i: number = 0; i < this.aByteArrayArray838.length; i++) {
                                {
                                    if (this.anIntArray857[i] === onDemandDone.id) {
                                        this.aByteArrayArray838[i] = onDemandDone.buffer;
                                        if (onDemandDone.buffer == null) {
                                            this.anIntArray857[i] = -1;
                                        }
                                        break;
                                    }
                                    if (this.anIntArray858[i] !== onDemandDone.id) {
                                        continue;
                                    }
                                    this.aByteArrayArray1232[i] = onDemandDone.buffer;
                                    if (onDemandDone.buffer == null) {
                                        this.anIntArray858[i] = -1;
                                    }
                                    break;
                                }
                            }
                        }
                    }
                } while (onDemandDone.type !== 93 || !this.onDemandRequester.method334(onDemandDone.id, false));
                Region.passiveRequestGameObjectModels(this.onDemandRequester, new Buffer(onDemandDone.buffer));
            }
        } while (true);
    }

    public method24(flag: boolean, abyte0: number[], i: number) {
        if (!this.musicEnabled) {
            return;
        } else {
            // TODO music fix
            // SignLink.fadeMidi = flag ? 1 : 0;
            // SignLink.saveMidi(abyte0, abyte0.length);
            // i = (71 / i | 0);
            return;
        }
    }

    public async openSocket(port: number): Promise<Socket> {
        const socket = new Socket(this.gameConfig.host, port);
        await socket.connect();
        return socket;
    }

    async resetTitleScreen() {
        if (this.aClass18_1198 != null) {
            return;
        }
        this.imageProducer = null;
        this.chatboxProducingGraphicsBuffer = null;
        this.aClass18_1157 = null;
        this.aClass18_1156 = null;
        this.aClass18_1158 = null;
        this.aClass18_1108 = null;
        this.aClass18_1109 = null;
        this.flameLeftBackground = new ProducingGraphicsBuffer(128, 265);
        Rasterizer.resetPixels();
        this.flameRightBackground = new ProducingGraphicsBuffer(128, 265);
        Rasterizer.resetPixels();
        this.aClass18_1198 = new ProducingGraphicsBuffer(509, 171);
        Rasterizer.resetPixels();
        this.aClass18_1199 = new ProducingGraphicsBuffer(360, 132);
        Rasterizer.resetPixels();
        this.aClass18_1200 = new ProducingGraphicsBuffer(360, 200);
        Rasterizer.resetPixels();
        this.aClass18_1203 = new ProducingGraphicsBuffer(202, 238);
        Rasterizer.resetPixels();
        this.aClass18_1204 = new ProducingGraphicsBuffer(203, 238);
        Rasterizer.resetPixels();
        this.aClass18_1205 = new ProducingGraphicsBuffer(74, 94);
        Rasterizer.resetPixels();
        this.aClass18_1206 = new ProducingGraphicsBuffer(75, 94);
        Rasterizer.resetPixels();
        if (this.titleArchive != null) {
            await this.prepareTitleBackground();
            await this.prepareTitle();
        }
        this.aBoolean1046 = true;
    }

    async prepareTitle() {
        this.titleboxImage = new IndexedImage(this.titleArchive, "titlebox", 0);
        this.titleboxButtonImage = new IndexedImage(this.titleArchive, "titlebutton", 0);
        this.titleFlameEmblem = (s => {
            const a = [];
            while (s-- > 0) {
                a.push(null);
            }
            return a;
        })(12);
        for (let i: number = 0; i < 12; i++) {
            this.titleFlameEmblem[i] = new IndexedImage(this.titleArchive, "runes", i);
        }
        this.anImageRGB1226 = ImageRGB.from(128, 265);
        this.anImageRGB1227 = ImageRGB.from(128, 265);
        this.anImageRGB1226.pixels = [...this.flameLeftBackground.pixels];
        this.anImageRGB1227.pixels = [...this.flameRightBackground.pixels];
        this.anIntArray1311 = (s => {
            const a = [];
            while (s-- > 0) {
                a.push(0);
            }
            return a;
        })(256);
        for (let l: number = 0; l < 64; l++) {
            this.anIntArray1311[l] = l * 262144;
        }
        for (let i1: number = 0; i1 < 64; i1++) {
            this.anIntArray1311[i1 + 64] = 16711680 + 1024 * i1;
        }
        for (let j1: number = 0; j1 < 64; j1++) {
            this.anIntArray1311[j1 + 128] = 16776960 + 4 * j1;
        }
        for (let k1: number = 0; k1 < 64; k1++) {
            this.anIntArray1311[k1 + 192] = 16777215;
        }
        this.anIntArray1312 = (s => {
            const a = [];
            while (s-- > 0) {
                a.push(0);
            }
            return a;
        })(256);
        for (let l1: number = 0; l1 < 64; l1++) {
            this.anIntArray1312[l1] = l1 * 1024;
        }
        for (let i2: number = 0; i2 < 64; i2++) {
            this.anIntArray1312[i2 + 64] = 65280 + 4 * i2;
        }
        for (let j2: number = 0; j2 < 64; j2++) {
            this.anIntArray1312[j2 + 128] = 65535 + 262144 * j2;
        }
        for (let k2: number = 0; k2 < 64; k2++) {
            this.anIntArray1312[k2 + 192] = 16777215;
        }
        this.anIntArray1313 = (s => {
            const a = [];
            while (s-- > 0) {
                a.push(0);
            }
            return a;
        })(256);
        for (let l2: number = 0; l2 < 64; l2++) {
            this.anIntArray1313[l2] = l2 * 4;
        }
        for (let i3: number = 0; i3 < 64; i3++) {
            this.anIntArray1313[i3 + 64] = 255 + 262144 * i3;
        }
        for (let j3: number = 0; j3 < 64; j3++) {
            this.anIntArray1313[j3 + 128] = 16711935 + 1024 * j3;
        }
        for (let k3: number = 0; k3 < 64; k3++) {
            this.anIntArray1313[k3 + 192] = 16777215;
        }
        this.anIntArray1310 = (s => {
            const a = [];
            while (s-- > 0) {
                a.push(0);
            }
            return a;
        })(256);
        this.anIntArray1176 = (s => {
            const a = [];
            while (s-- > 0) {
                a.push(0);
            }
            return a;
        })(32768);
        this.anIntArray1177 = (s => {
            const a = [];
            while (s-- > 0) {
                a.push(0);
            }
            return a;
        })(32768);
        this.method83(null, 0);
        this.anIntArray1084 = (s => {
            const a = [];
            while (s-- > 0) {
                a.push(0);
            }
            return a;
        })(32768);
        this.anIntArray1085 = (s => {
            const a = [];
            while (s-- > 0) {
                a.push(0);
            }
            return a;
        })(32768);
        await this.drawLoadingText(10, "Connecting to fileserver");
        if (!this.startedRenderingFlames) {
            this.shouldRenderFlames = true;
            this.startedRenderingFlames = true;
            // await this.run();
        }
    }

    public async drawLoadingText(i: number, s: string) {
        this.anInt1322 = i;
        this.aString1027 = s;
        await this.resetTitleScreen();
        if (this.titleArchive == null) {
            await super.drawLoadingText(i, s);
            return;
        }
        this.aClass18_1200.createRasterizer();
        const c: string = "\u0168";
        const c1: string = "\u00c8";
        const byte0: number = 20;
        this.fontBold.drawStringLeft(
            "RuneScape is loading - please wait...",
            ((c => (c.charCodeAt == null ? (c as any) : c.charCodeAt(0)))(c) / 2) | 0,
            (((c => (c.charCodeAt == null ? (c as any) : c.charCodeAt(0)))(c1) / 2) | 0) - 26 - byte0,
            16777215
        );
        const j: number = (((c => (c.charCodeAt == null ? (c as any) : c.charCodeAt(0)))(c1) / 2) | 0) - 18 - byte0;
        Rasterizer.drawUnfilledRectangle(
            (((c => (c.charCodeAt == null ? (c as any) : c.charCodeAt(0)))(c) / 2) | 0) - 152,
            j,
            304,
            34,
            9179409
        );
        Rasterizer.drawUnfilledRectangle(
            (((c => (c.charCodeAt == null ? (c as any) : c.charCodeAt(0)))(c) / 2) | 0) - 151,
            j + 1,
            302,
            32,
            0
        );
        Rasterizer.drawFilledRectangle(
            (((c => (c.charCodeAt == null ? (c as any) : c.charCodeAt(0)))(c) / 2) | 0) - 150,
            j + 2,
            i * 3,
            30,
            9179409
        );
        Rasterizer.drawFilledRectangle(
            (((c => (c.charCodeAt == null ? (c as any) : c.charCodeAt(0)))(c) / 2) | 0) - 150 + i * 3,
            j + 2,
            300 - i * 3,
            30,
            0
        );
        this.fontBold.drawStringLeft(
            s,
            ((c => (c.charCodeAt == null ? (c as any) : c.charCodeAt(0)))(c) / 2) | 0,
            (((c => (c.charCodeAt == null ? (c as any) : c.charCodeAt(0)))(c1) / 2) | 0) + 5 - byte0,
            16777215
        );
        this.aClass18_1200.drawGraphics(202, 171, this.gameGraphics);
        if (this.aBoolean1046) {
            this.aBoolean1046 = false;
            if (!this.aBoolean1243) {
                this.flameLeftBackground.drawGraphics(0, 0, this.gameGraphics);
                this.flameRightBackground.drawGraphics(637, 0, this.gameGraphics);
            }
            this.aClass18_1198.drawGraphics(128, 0, this.gameGraphics);
            this.aClass18_1199.drawGraphics(202, 371, this.gameGraphics);
            this.aClass18_1203.drawGraphics(0, 265, this.gameGraphics);
            this.aClass18_1204.drawGraphics(562, 265, this.gameGraphics);
            this.aClass18_1205.drawGraphics(128, 171, this.gameGraphics);
            this.aClass18_1206.drawGraphics(562, 171, this.gameGraphics);
        }
    }

    public method83(class50_sub1_sub1_sub3: IndexedImage, i: number) {
        this.packetSize += i;
        const j: number = 256;
        for (let k: number = 0; k < this.anIntArray1176.length; k++) {
            this.anIntArray1176[k] = 0;
        }
        for (let l: number = 0; l < 5000; l++) {
            {
                const i1: number = (((Math.random() * 128.0 * j) as number) as number) | 0;
                this.anIntArray1176[i1] = ((Math.random() * 256.0) as number) | 0;
            }
        }
        for (let j1: number = 0; j1 < 20; j1++) {
            {
                for (let k1: number = 1; k1 < j - 1; k1++) {
                    {
                        for (let i2: number = 1; i2 < 127; i2++) {
                            {
                                const k2: number = i2 + (k1 << 7);
                                this.anIntArray1177[k2] =
                                    ((this.anIntArray1176[k2 - 1] +
                                        this.anIntArray1176[k2 + 1] +
                                        this.anIntArray1176[k2 - 128] +
                                        this.anIntArray1176[k2 + 128]) /
                                        4) |
                                    0;
                            }
                        }
                    }
                }
                const ai: number[] = this.anIntArray1176;
                this.anIntArray1176 = this.anIntArray1177;
                this.anIntArray1177 = ai;
            }
        }
        if (class50_sub1_sub1_sub3 != null) {
            let l1: number = 0;
            for (let j2: number = 0; j2 < class50_sub1_sub1_sub3.height; j2++) {
                {
                    for (let l2: number = 0; l2 < class50_sub1_sub1_sub3.width; l2++) {
                        if (class50_sub1_sub1_sub3.pixels[l1++] !== 0) {
                            const i3: number = l2 + 16 + class50_sub1_sub1_sub3.xDrawOffset;
                            const j3: number = j2 + 16 + class50_sub1_sub1_sub3.yDrawOffset;
                            const k3: number = i3 + (j3 << 7);
                            this.anIntArray1176[k3] = 0;
                        }
                    }
                }
            }
        }
    }

    public async run(): Promise<number> {
        const currentMilis = new Date().getTime();
        if (currentMilis > this.renderDelay) {
            let delay = 0;
            if (this.shouldRenderFlames) {
                delay = this.processFlamesCycle();
            } else {
                delay = await super.run();
                if (this.gameState == -2) {
                    return;
                }
            }

            this.renderDelay = new Date().getTime() + delay;
        }
        requestAnimationFrame(this.runBound);
    }

    processFlamesCycle(): number {
        this.aBoolean1320 = true;
        try {
            if (!this.startedRenderingFlames) {
                this.aBoolean1320 = false;
                return;
            }
            this.flameCycle++;
            this.calculateFlamePositions();
            this.calculateFlamePositions();
            this.renderFlames();
        } catch (ignored) {}
        return 20;
    }

    calculateFlamePositions() {
        const c: number = 256;
        for (let x: number = 10; x < 117; x++) {
            {
                const rand: number = ((Math.random() * 100.0) as number) | 0;
                if (rand < 50) {
                    this.anIntArray1084[x + ((c - 2) << 7)] = 255;
                }
            }
        }
        for (let i: number = 0; i < 100; i++) {
            {
                const x: number = (((Math.random() * 124.0) as number) | 0) + 2;
                const y: number = (((Math.random() * 128.0) as number) | 0) + 128;
                const pixel: number = x + (y << 7);
                this.anIntArray1084[pixel] = 192;
            }
        }
        for (let y: number = 1; y < c - 1; y++) {
            {
                for (let x: number = 1; x < 127; x++) {
                    {
                        const pixel: number = x + (y << 7);
                        this.anIntArray1085[pixel] =
                            ((this.anIntArray1084[pixel - 1] +
                                this.anIntArray1084[pixel + 1] +
                                this.anIntArray1084[pixel - 128] +
                                this.anIntArray1084[pixel + 128]) /
                                4) |
                            0;
                    }
                }
            }
        }
        this.anInt1238 += 128;
        if (this.anInt1238 > this.anIntArray1176.length) {
            this.anInt1238 -= this.anIntArray1176.length;
            const rand: number = ((Math.random() * 12.0) as number) | 0;
            this.method83(this.titleFlameEmblem[rand], 0);
        }
        for (let y: number = 1; y < c - 1; y++) {
            {
                for (let x: number = 1; x < 127; x++) {
                    {
                        const pixel: number = x + (y << 7);
                        let i4: number =
                            this.anIntArray1085[pixel + 128] -
                            ((this.anIntArray1176[(pixel + this.anInt1238) & (this.anIntArray1176.length - 1)] / 5) | 0);
                        if (i4 < 0) {
                            i4 = 0;
                        }
                        this.anIntArray1084[pixel] = i4;
                    }
                }
            }
        }
        for (let i: number = 0; i < c - 1; i++) {
            this.anIntArray1166[i] = this.anIntArray1166[i + 1];
        }
        this.anIntArray1166[c - 1] =
            ((Math.sin(Game.pulseCycle / 14.0) * 16.0 +
                Math.sin(Game.pulseCycle / 15.0) * 14.0 +
                Math.sin(Game.pulseCycle / 16.0) * 12.0) as number) | 0;
        if (this.anInt1047 > 0) {
            this.anInt1047 -= 4;
        }
        if (this.anInt1048 > 0) {
            this.anInt1048 -= 4;
        }
        if (this.anInt1047 === 0 && this.anInt1048 === 0) {
            const rand: number = (Math.random() * 2000.0) | 0;
            if (rand === 0) {
                this.anInt1047 = 1024;
            }
            if (rand === 1) {
                this.anInt1048 = 1024;
            }
        }
    }

    renderFlames() {
        const c: number = 256;
        if (this.anInt1047 > 0) {
            for (let j: number = 0; j < 256; j++) {
                {
                    if (this.anInt1047 > 768) {
                        this.anIntArray1310[j] = this.someFlameLogic(
                            this.anIntArray1311[j],
                            this.anIntArray1312[j],
                            1024 - this.anInt1047,
                            8
                        );
                    } else if (this.anInt1047 > 256) {
                        this.anIntArray1310[j] = this.anIntArray1312[j];
                    } else {
                        this.anIntArray1310[j] = this.someFlameLogic(
                            this.anIntArray1312[j],
                            this.anIntArray1311[j],
                            256 - this.anInt1047,
                            8
                        );
                    }
                }
            }
        } else if (this.anInt1048 > 0) {
            for (let k: number = 0; k < 256; k++) {
                {
                    if (this.anInt1048 > 768) {
                        this.anIntArray1310[k] = this.someFlameLogic(
                            this.anIntArray1311[k],
                            this.anIntArray1313[k],
                            1024 - this.anInt1048,
                            8
                        );
                    } else if (this.anInt1048 > 256) {
                        this.anIntArray1310[k] = this.anIntArray1313[k];
                    } else {
                        this.anIntArray1310[k] = this.someFlameLogic(
                            this.anIntArray1313[k],
                            this.anIntArray1311[k],
                            256 - this.anInt1048,
                            8
                        );
                    }
                }
            }
        } else {
            this.anIntArray1310 = [...this.anIntArray1311];
        }
        this.flameLeftBackground.pixels = [...this.anImageRGB1226.pixels];
        let j1: number = 0;
        let k1: number = 1152;
        for (let l1: number = 1; l1 < c - 1; l1++) {
            {
                const i2: number = ((this.anIntArray1166[l1] * (c - l1)) / c) | 0;
                let k2: number = 22 + i2;
                if (k2 < 0) {
                    k2 = 0;
                }
                j1 += k2;
                for (let i3: number = k2; i3 < 128; i3++) {
                    {
                        let k3: number = this.anIntArray1084[j1++];
                        if (k3 !== 0) {
                            const i4: number = k3;
                            const k4: number = 256 - k3;
                            k3 = this.anIntArray1310[k3];
                            const i5: number = this.flameLeftBackground.pixels[k1];
                            this.flameLeftBackground.pixels[k1++] =
                                ((((k3 & 16711935) * i4 + (i5 & 16711935) * k4) & -16711936) +
                                    (((k3 & 65280) * i4 + (i5 & 65280) * k4) & 16711680)) >>
                                8;
                        } else {
                            k1++;
                        }
                    }
                }
                k1 += k2;
            }
        }
        this.flameLeftBackground.drawGraphics(0, 0, this.gameGraphics);
        this.flameRightBackground.pixels = [...this.anImageRGB1227.pixels];
        j1 = 0;
        k1 = 1176;
        for (let l2: number = 1; l2 < c - 1; l2++) {
            {
                const j3: number = ((this.anIntArray1166[l2] * (c - l2)) / c) | 0;
                const l3: number = 103 - j3;
                k1 += j3;
                for (let j4: number = 0; j4 < l3; j4++) {
                    {
                        let l4: number = this.anIntArray1084[j1++];
                        if (l4 !== 0) {
                            const j5: number = l4;
                            const k5: number = 256 - l4;
                            l4 = this.anIntArray1310[l4];
                            const l5: number = this.flameRightBackground.pixels[k1];
                            this.flameRightBackground.pixels[k1++] =
                                ((((l4 & 16711935) * j5 + (l5 & 16711935) * k5) & -16711936) +
                                    (((l4 & 65280) * j5 + (l5 & 65280) * k5) & 16711680)) >>
                                8;
                        } else {
                            k1++;
                        }
                    }
                }
                j1 += 128 - l3;
                k1 += 128 - l3 - j3;
            }
        }
        this.flameRightBackground.drawGraphics(637, 0, this.gameGraphics);
    }

    public someFlameLogic(i: number, j: number, k: number, l: number): number {
        if (l < 8 || l > 8) {
            this.outBuffer.putByte(235);
        }
        const i1: number = 256 - k;
        return ((((i & 16711935) * i1 + (j & 16711935) * k) & -16711936) + (((i & 65280) * i1 + (j & 65280) * k) & 16711680)) >> 8;
    }

    async initStores() {
        const promises = await Promise.all([
            this.getFile(cacheData.main_file_cache),
            this.getFile(cacheIndices.main_file_cache[0]),
            this.getFile(cacheIndices.main_file_cache[1]),
            this.getFile(cacheIndices.main_file_cache[2]),
            this.getFile(cacheIndices.main_file_cache[3]),
            this.getFile(cacheIndices.main_file_cache[4])
        ]);
        const main = promises[0];
        for (let type = 0; type < 5; type++) {
            this.stores.push(new Index(type + 1, 0x927c0, main, promises[1 + type]));
        }
        console.log("stores initialized");
    }

    async prepareTitleBackground() {
        const jpgBytes = this.titleArchive.getFile("title.dat");
        let abyte0: Uint8Array = new Uint8Array(jpgBytes);
        let class50_sub1_sub1_sub1: ImageRGB = await ImageRGB.fromJpg(abyte0);
        this.flameLeftBackground.createRasterizer();
        class50_sub1_sub1_sub1.drawInverse(0, 0);
        this.flameRightBackground.createRasterizer();
        class50_sub1_sub1_sub1.drawInverse(-637, 0);
        this.aClass18_1198.createRasterizer();
        class50_sub1_sub1_sub1.drawInverse(-128, 0);
        this.aClass18_1199.createRasterizer();
        class50_sub1_sub1_sub1.drawInverse(-202, -371);
        this.aClass18_1200.createRasterizer();
        class50_sub1_sub1_sub1.drawInverse(-202, -171);
        this.aClass18_1203.createRasterizer();
        class50_sub1_sub1_sub1.drawInverse(0, -265);
        this.aClass18_1204.createRasterizer();
        class50_sub1_sub1_sub1.drawInverse(-562, -265);
        this.aClass18_1205.createRasterizer();
        class50_sub1_sub1_sub1.drawInverse(-128, -171);
        this.aClass18_1206.createRasterizer();
        class50_sub1_sub1_sub1.drawInverse(-562, -171);
        let ai: number[] = (s => {
            const a = [];
            while (s-- > 0) {
                a.push(0);
            }
            return a;
        })(class50_sub1_sub1_sub1.width);
        for (let i: number = 0; i < class50_sub1_sub1_sub1.height; i++) {
            {
                for (let j: number = 0; j < class50_sub1_sub1_sub1.width; j++) {
                    ai[j] = class50_sub1_sub1_sub1.pixels[class50_sub1_sub1_sub1.width - j - 1 + class50_sub1_sub1_sub1.width * i];
                }
                for (let l: number = 0; l < class50_sub1_sub1_sub1.width; l++) {
                    class50_sub1_sub1_sub1.pixels[l + class50_sub1_sub1_sub1.width * i] = ai[l];
                }
            }
        }
        this.flameLeftBackground.createRasterizer();
        class50_sub1_sub1_sub1.drawInverse(382, 0);
        this.flameRightBackground.createRasterizer();
        class50_sub1_sub1_sub1.drawInverse(-255, 0);
        this.aClass18_1198.createRasterizer();
        class50_sub1_sub1_sub1.drawInverse(254, 0);
        this.aClass18_1199.createRasterizer();
        class50_sub1_sub1_sub1.drawInverse(180, -371);
        this.aClass18_1200.createRasterizer();
        class50_sub1_sub1_sub1.drawInverse(180, -171);
        this.aClass18_1203.createRasterizer();
        class50_sub1_sub1_sub1.drawInverse(382, -265);
        this.aClass18_1204.createRasterizer();
        class50_sub1_sub1_sub1.drawInverse(-180, -265);
        this.aClass18_1205.createRasterizer();
        class50_sub1_sub1_sub1.drawInverse(254, -171);
        this.aClass18_1206.createRasterizer();
        class50_sub1_sub1_sub1.drawInverse(-180, -171);
        class50_sub1_sub1_sub1 = ImageRGB.fromArchive(this.titleArchive, "logo", 0);
        this.aClass18_1198.createRasterizer();
        class50_sub1_sub1_sub1.drawImage(18, 382 - ((class50_sub1_sub1_sub1.width / 2) | 0) - 128);
        class50_sub1_sub1_sub1 = null;
        abyte0 = null;
        ai = null;
    }

    initArchives() {
        console.log("initArchives");
        this.titleArchive = this.requestArchive(1, "title", this.archiveHashes[1], 25, "title screen");
    }

    initTypeFaces() {
        console.log("initTypeFaces");
        this.fontSmall = new TypeFace(false, this.titleArchive, "p11_full");
        this.fontNormal = new TypeFace(false, this.titleArchive, "p12_full");
        this.fontBold = new TypeFace(false, this.titleArchive, "b12_full");
        this.fontFancy = new TypeFace(true, this.titleArchive, "q8_full");
    }

    requestArchive(id: number, file: string, expectedCrc: number, x: number, displayName: string): Archive {
        // In rs it does web requests, hash checks and updates
        return new Archive(this.stores[0].get(id));
    }

    async getFile(fileUrl: string): Promise<ArrayBuffer> {
        const resp = await fetch(fileUrl);
        return resp.arrayBuffer();
    }
}

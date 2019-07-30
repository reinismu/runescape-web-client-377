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
import { Node } from "./collection/Node";
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
import { Npc } from "./media/renderable/actor/Npc";
import { Graphics } from "./graphics/Graphics";
import { Color } from "./graphics/Color";
import { Font } from "./graphics/Font";
import { TextUtils } from "./util/TextUtils";
import { SignLink } from "./util/SignLink";
import { BufferedConnection } from "./net/BufferedConnection";
import { Configuration } from "./Configuration";
import { ISAACCipher } from "./net/ISAACCipher";
import { LinkedList } from "./util/LinkedList";
import { PacketConstants } from "./util/PacketConstants";
import { SoundPlayer } from "./sound/SoundPlayer";
import { Item } from "./media/renderable/Item";
import { Renderable } from "./media/renderable/Renderable";
import { SpawnObjectNode } from "./scene/SpawnObjectNode";
import { Wall } from "./scene/tile/Wall";
import { WallDecoration } from "./scene/tile/WallDecoration";
import { SceneSpawnRequest } from "./scene/SceneSpawnRequest";
import { FloorDecoration } from "./scene/tile/FloorDecoration";
import { Projectile } from "./media/renderable/Projectile";
import { GameAnimableObject } from "./media/renderable/GameAnimableObject";
import { Actor } from "./media/renderable/actor/Actor";
import { SkillConstants } from "./util/SkillConstants";
import { ChatEncoder } from "./util/ChatEncoder";
import { Actions } from "./Actions";
import { tsMethodSignature } from "@babel/types";
import { ParallelExecutor, sleep } from "./ParallelExecutor";

function init_SKILL_EXPERIENCE() {
    const bitfield = Array(99).fill(0);
    let value: number = 0;
    for (let level: number = 0; level < 99; level++) {
        const realLevel: number = level + 1;
        const expDiff: number = (((realLevel as number) + 300.0 * Math.pow(2.0, (realLevel as number) / 7.0)) as number) | 0;
        value += expDiff;
        bitfield[level] = (value / 4) | 0;
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
    public static parallelExecutor: ParallelExecutor = new ParallelExecutor();

    public static pulseCycle: number = 0;
    public static portOffset: number = 0;
    public static BITFIELD_MAX_VALUE: number[] = init_BITFIELD_MAX_VALUE();
    public static SKILL_EXPERIENCE: number[] = init_SKILL_EXPERIENCE();
    public static memberServer: boolean = true;
    public static lowMemory: boolean = false;
    public static localPlayer: Player = null;
    static playerColours: number[][] = [
        [6798, 107, 10283, 16, 4797, 7744, 5799, 4634, 33697, 22433, 2983, 54193],
        [8741, 12, 64030, 43162, 7735, 8404, 1701, 38430, 24094, 10153, 56621, 4783, 1341, 16578, 35003, 25239],
        [25238, 8742, 12, 64030, 43162, 7735, 8404, 1701, 38430, 24094, 10153, 56621, 4783, 1341, 16578, 35003],
        [4626, 11146, 6439, 12, 4758, 10270],
        [4550, 4537, 5681, 5673, 5790, 6806, 8076, 4574]
    ];
    static SKIN_COLOURS: number[] = [9104, 10275, 7595, 3610, 7975, 8526, 918, 38802, 24466, 10145, 58654, 5027, 1457, 16565, 34991, 25486];
    public static VALID_CHARACTERS: string =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!\"\u00a3$%^&*()-_=+[{]};:'@#~,<.>/?\\| ";
    public static anInt1309: number = 0;

    public stores: Index[] = [];
    public archiveHashes: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0]; // currently unused
    static accountFlagged: boolean = false;
    static aBoolean1190: boolean = true;
    static anInt1100: number = 0;
    static anInt1165: number = 0;
    static anInt1235: number = 0;
    static anInt1052: number = 0;
    static anInt1139: number = 0;
    static anInt841: number = 0;
    static anInt1230: number = 0;
    static anInt1013: number = 0;
    static anInt1049: number = 0;
    static anInt1162: number = 0;
    static aBoolean1242: boolean = true;
    static aBoolean1207: boolean = false;
    static anInt1082: number = 0;
    static world: number = 10;
    static aBoolean963: boolean = true;
    static anInt1160: number = 0;
    static fps: boolean = true;
    static anInt1237: number = 0;
    static anInt1168: number = 0;
    static anInt978: number = 0;
    static anInt895: number = 0;

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
    isRenderingFlames: boolean = false;
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
    renderDelay: number = 0;
    currentSceneTileFlags: number[][][] = null;
    anIntArrayArrayArray891: number[][][] = null;
    currentScene: Scene = null;
    currentCollisionMap: CollisionMap[] = Array(4).fill(null);
    minimapImage: ImageRGB = null;
    loggedIn: boolean = false;
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
    mapscenes: IndexedImage[] = Array(100).fill(null);
    worldMapHintIcons: ImageRGB[] = Array(100).fill(null);
    hitmarks: ImageRGB[] = Array(20).fill(null);
    headiconsPks: ImageRGB[] = Array(32).fill(null);
    headiconsPrayers: ImageRGB[] = Array(32).fill(null);
    headiconsHints: ImageRGB[] = Array(32).fill(null);
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

    startUpError: boolean = false;
    aBoolean1016: boolean = false;
    aBoolean1097: boolean = false;
    buffer: Buffer = Buffer.allocate(1);
    username: string = "Promises";
    password: string = "Testing";
    aBoolean1283: boolean;

    loginScreenState: number = 0;
    anInt977: number = 0;
    statusLineOne: string = "";
    statusLineTwo: string = "";
    anInt850: number = 0;
    anInt1094: number = 0;
    gameConnection: BufferedConnection = null;
    tempBuffer: Buffer = Buffer.allocate(1);
    incomingRandom: ISAACCipher = null;
    playerRights: number = 0;
    aLong902: number = 0;
    duplicateClickCount: number = 0;
    aBoolean1275: boolean = true;
    lastOpcode: number = 0;
    secondLastOpcode: number = 0;
    thirdLastOpcode: number = 0;
    timeoutCounter: number = 0;
    systemUpdateTime: number = 0;
    anInt873: number = 0;
    anInt1197: number = 0;
    menuActionRow: number = 0;
    menuOpen: boolean = false;
    chatMessages: string[] = Array(100).fill(null);
    itemSelected: number = 0;
    widgetSelected: number = 0;
    currentSound: number = 0;
    anInt1009: number = 0;
    anInt1255: number = 0;
    anInt916: number = 0;
    anInt1233: number = 0;
    cameraHorizontal: number = 0;
    minimapState: number = 0;
    anInt1276: number = -1;
    destinationX: number = 0;
    destinationY: number = 0;
    localPlayerCount: number = 0;
    anInt1133: number = 0;
    anInt968: number = 2048;
    players: Player[] = Array(this.anInt968).fill(null);
    cachedAppearances: Buffer[] = Array(this.anInt968).fill(null);
    npcs: Npc[] = Array(16384).fill(null);
    thisPlayerId: number = 2047;
    aClass6_1282: LinkedList = new LinkedList();
    aClass6_1210: LinkedList = new LinkedList();
    groundItems: LinkedList[][][] = Array(4).fill(Array(104).fill(Array(104).fill(null)));
    aClass6_1261: LinkedList = new LinkedList();
    friendListStatus: number = 0;
    friendsCount: number = 0;
    openInterfaceId: number = -1;
    anInt1053: number = -1;
    anInt960: number = -1;
    anInt1089: number = -1;
    anInt1279: number = -1;
    aBoolean1239: boolean = false;
    anInt1285: number = 3;
    inputType: number = 0;
    messagePromptRaised: boolean = false;
    clickToContinueString: string = null;
    anInt1319: number = 0;
    anInt1213: number = -1;
    characterEditChangeGenger: boolean = true;
    characterEditColors: number[] = Array(5).fill(0);
    aStringArray1069: string[] = Array(5).fill(null);
    aBooleanArray1070: boolean[] = Array(5).fill(false);
    aLong1229: number = 0;
    aBoolean1277: boolean = false;
    characterEditIdentityKits: number[] = Array(7).fill(0);
    aClass18_1110: ProducingGraphicsBuffer = null;
    useJaggrab: boolean = Configuration.JAGGRAB_ENABLED;
    jaggrabSocket: Socket = null;
    sound: number[] = Array(50).fill(0);
    soundType: number[] = Array(50).fill(0);
    soundDelay: number[] = Array(50).fill(0);
    aBoolean1301: boolean = true;
    anIntArray1005: number[] = Array(2000).fill(0);
    currentSong: number;
    previousSong: number = 0;
    anInt1300: number = 0;
    anInt998: number = 0;
    anInt1223: number = 0;
    anInt955: number = 0;
    anInt1011: number = 0;
    anInt1012: number = 0;
    anInt1264: number = 0;
    aBoolean1265: boolean = false;
    anInt1251: number = 128;
    plane: number = 0;
    aBoolean953: boolean = false;
    coordinates: number[] = null;
    nextTopLeftTileX: number = 0;
    nextTopRightTileY: number = 0;
    aBoolean1163: boolean = false;
    aBoolean1209: boolean = false;
    chunkX: number = 0;
    chunkY: number = 0;
    constructedMapPalette: number[][][] = Array(4).fill(Array(13).fill(Array(13).fill(0)));
    anInt1072: number = 20411;
    aBoolean1067: boolean = false;
    minimapHintCount: number = 0;
    minimapHint: ImageRGB[] = Array(1000).fill(null);
    minimapHintX: number[] = Array(1000).fill(0);
    minimapHintY: number[] = Array(1000).fill(0);
    aBoolean950: boolean = false;
    inputInputMessage: string = "";
    publicChatMode: number = 0;
    privateChatMode: number = 0;
    tradeMode: number = 0;
    aBoolean1212: boolean = false;
    anInt1226: number = 0;
    anInt847: number = 0;
    anInt848: number = 0;
    anInt844: number = 0;
    anInt845: number = 0;
    anInt846: number = 0;
    anInt1151: number = 0;
    oriented: boolean = false;
    anInt993: number = 0;
    anInt994: number = 0;
    anInt995: number = 0;
    anInt996: number = 0;
    anInt997: number = 0;
    cameraX: number = 0;
    cameraZ: number = 0;
    cameraY: number = 0;
    cameraPitch: number = 0;
    cameraYaw: number = 0;
    aBooleanArray927: boolean[] = Array(5).fill(false);
    anIntArray1105: number[] = Array(5).fill(0);
    anIntArray852: number[] = Array(5).fill(0);
    anIntArray991: number[] = Array(5).fill(0);
    quakeTimes: number[] = Array(5).fill(0);
    friends: number[] = Array(200).fill(0); // TODO fix longs
    friendWorlds: number[] = Array(200).fill(0);
    friendUsernames: string[] = Array(200).fill(null);
    anIntArray1032: number[] = [0, 0, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3];
    placementX: number = 0;
    placementY: number = 0;
    thisPlayerServerId: number = -1;
    anIntArray843: number[] = Array(SkillConstants.SKILL_COUNT).fill(0);
    anIntArray1029: number[] = Array(SkillConstants.SKILL_COUNT).fill(0);
    anIntArray1054: number[] = Array(SkillConstants.SKILL_COUNT).fill(0);
    topLeftTileX: number = 0;
    topLeftTileY: number = 0;
    anInt1324: number = 0;
    anInt874: number = 0;
    anInt875: number = 0;
    anInt876: number = 0;
    anInt877: number = 0;
    anInt878: number = 0;
    aBoolean1038: boolean = true;
    ignoresCount: number = 0;
    ignores: number[] = Array(100).fill(0); // TODO fix longs
    anIntArray1081: number[] = [1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1];
    playerMembers: number = 0;
    removePlayerCount: number = 0;
    updatedPlayerCount: number = 0;
    removePlayers: number[] = Array(1000).fill(0);
    anIntArray1134: number[] = Array(16384).fill(0);
    aByte1317: number = -58;
    anInt1281: number = -939;
    updatedPlayers: number[] = Array(this.anInt968).fill(0);
    anInt1140: number = -110;
    playerList: number[] = Array(this.anInt968).fill(0);
    chatTypes: number[] = Array(100).fill(0);
    chatPlayerNames: string[] = Array(100).fill(null);
    inTutorialIsland: boolean = false;
    chatBuffer: Buffer = new Buffer(Array(5000).fill(0));
    anInt1083: number = 0;
    anInt1075: number = 0;
    anInt1208: number = 0;
    anInt1170: number = 0;
    anInt1273: number = 0;
    anInt1215: number = 0;
    anInt992: number = 0;
    lastAddress: number = 0;
    anInt1034: number = 0;
    anInt1030: number = 0;
    anIntArray1258: number[] = Array(100).fill(0);
    anInt1152: number = 0;
    anInt1328: number = 409;
    aByte1143: number = -80;
    aByte1066: number = 1;
    anInt1175: number = -89;
    anInt1055: number = 2;
    soundVolume: number[] = Array(50).fill(0);
    aLong1172: number = 0; // TODO fix long
    anInt1257: number = 0;
    anInt1272: number = -1;
    anInt935: number = -1;
    anInt1222: number = 0;
    anInt928: number = -100;
    tickDelta: number = 0;
    crossType: number = 0;
    crossIndex: number = 0;
    atInventoryInterfaceType: number = 0;
    atInventoryLoopCycle: number = 0;
    activeInterfaceType: number = 0;
    anInt1269: number = 0;
    anInt1114: number = 0;
    anInt1115: number = 0;
    aBoolean1155: boolean = false;
    lastActiveInvInterface: number = 0;
    modifiedWidgetId: number = 0;
    mouseInvInterfaceIndex: number = 0;
    selectedInventorySlot: number = 0;
    aByte1161: number = 97;
    anInt1020: number = 0;
    anInt1021: number = 0;
    anInt1044: number = 0;
    anInt1284: number = 0;
    anInt1129: number = 0;
    anInt893: number = 0;
    anInt1118: number = 0;
    anInt853: number = 0;
    anInt854: number = 2;
    anInt1010: number = 2;
    anInt1256: number = 1;
    anInt1045: number = 0;
    anInt917: number = 2;
    anInt1234: number = 1;
    anInt872: number = 0;
    menuActionTexts: string[] = Array(500).fill(null);
    menuActionTypes: number[] = Array(500).fill(0);
    anInt1004: number = 0;
    anInt915: number = 0;
    anInt1315: number = 0;
    anInt1302: number = 0;
    anInt1178: number = 300;
    anInt1280: number = 0;
    anInt1106: number = 0;
    firstMenuOperand: number[] = Array(500).fill(0);
    secondMenuOperand: number[] = Array(500).fill(0);
    selectedMenuActions: number[] = Array(500).fill(0);
    aBoolean1127: boolean = false;
    anInt1303: number = 0;
    anInt1148: number = 0;
    anInt1147: number = 0;
    aString1150: string = null;
    selectedWidgetName: string = null;
    anInt1173: number = 0;
    anIntArrayArray885: number[][] = Array(104).fill(Array(104).fill(0));
    cost: number[][] = Array(104).fill(Array(104).fill(0));
    anIntArray1123: number[] = Array(4000).fill(0);
    anIntArray1124: number[] = Array(4000).fill(0);
    anInt1126: number = 0;
    aBoolean1014: boolean = false;
    anInt851: number = 0;
    anInt1304: number = 0;
    menuClickX: number = 0;
    menuClickY: number = 0;
    anInt1307: number = 0;
    anInt1308: number = 0;
    anInt1330: number = 0;
    anInt1331: number = 0;
    anInt1149: number = 0;
    anInt1172: number = 0;
    reportedName: string = "";
    reportMutePlayer: boolean = false;
    reportAbuseInterfaceID: number = -1;
    chatMessage: string = "";
    friendsListAction: number = 0;
    aLong1141: number = 0; // TODO fix long
    chatboxInputMessage: string = "";
    anInt1154: number = -916;
    anInt1262: number = 0;
    anInt1263: number = 0;
    anInt1186: number = 0;
    anInt1187: number = 0;
    anInt1289: number = 0;
    chatboxInput: string = "";
    anInt1236: number = 326;
    anInt1107: number = 78;
    aClass13_1249: Widget = new Widget();
    anInt862: number = 0;
    anInt865: number = 0;
    aClass50_Sub1_Sub1_Sub1_1102: ImageRGB = null;
    aClass50_Sub1_Sub1_Sub1_1103: ImageRGB = null;
    anInt931: number = 0x23201b;
    anInt1080: number = 0x4d4233;
    anInt1135: number = 0x766654;
    anInt921: number = 8;
    anInt1287: number = 0x332d25;
    anInt1138: number = 0;
    anIntArrayArray886: number[][] = Array(104).fill(Array(104).fill(0));
    anInt939: number = 0;
    screenX: number = -1;
    screenY: number = -1;
    anInt940: number = 50;
    anIntArray944: number[] = Array(this.anInt940).fill(0);
    anIntArray943: number[] = Array(this.anInt940).fill(0);
    anIntArray941: number[] = Array(this.anInt940).fill(0);
    anIntArray942: number[] = Array(this.anInt940).fill(0);
    anIntArray945: number[] = Array(this.anInt940).fill(0);
    anIntArray946: number[] = Array(this.anInt940).fill(0);
    anIntArray947: number[] = Array(this.anInt940).fill(0);
    aStringArray948: string[] = Array(this.anInt940).fill(null);
    anIntArray842: number[] = [0xffff00, 0xff0000, 65280, 65535, 0xff00ff, 0xffffff];
    anInt1056: number = 3;
    anIntArray1290: number[] = [17, 24, 34, 40];
    aByteArray1245: number[] = Array(16384).fill(0);
    aByte956: number = 1;
    aString861: string = "";
    aStringArray863: string[] = Array(100).fill(null);
    aBoolean959: boolean = true;
    anIntArray864: number[] = Array(100).fill(0);
    anInt1119: number = -30658;

    public static getCombatLevelColour(user: number, opponent: number): string {
        const difference: number = user - opponent;
        if (difference < -9) {
            return "@red@";
        }
        if (difference < -6) {
            return "@or3@";
        }
        if (difference < -3) {
            return "@or2@";
        }
        if (difference < 0) {
            return "@or1@";
        }
        if (difference > 9) {
            return "@gre@";
        }
        if (difference > 6) {
            return "@gr3@";
        }
        if (difference > 3) {
            return "@gr2@";
        }
        if (difference > 0) {
            return "@gr1@";
        } else {
            return "@yel@";
        }
    }

    public static getShortenedAmountText(coins: number): string {
        if (coins < 100000) {
            return /* valueOf */ new String(coins).toString();
        }
        if (coins < 10000000) {
            return ((coins / 1000) | 0) + "K";
        } else {
            return ((coins / 1000000) | 0) + "M";
        }
    }

    public static setHighMemory() {
        Scene.lowMemory = false;
        Rasterizer3D.lowMemory = false;
        Game.lowMemory = false;
        Region.lowMemory = false;
        GameObjectDefinition.lowMemory = false;
    }

    public static setLowMemory() {
        Scene.lowMemory = true;
        Rasterizer3D.lowMemory = true;
        Game.lowMemory = true;
        Region.lowMemory = true;
        GameObjectDefinition.lowMemory = true;
    }

    public static getFullAmountText(amount: number): string {
        let string: string = /* valueOf */ new String(amount).toString();
        for (let index: number = string.length - 3; index > 0; index -= 3) {
            string = string.substring(0, index) + "," + string.substring(index);
        }
        if (string.length > 8) {
            string = "@gre@" + string.substring(0, string.length - 8) + " million @whi@(" + string + ")";
        } else if (string.length > 4) {
            string = "@cya@" + string.substring(0, string.length - 4) + "K @whi@(" + string + ")";
        }
        return " " + string;
    }

    constructor(canvas: HTMLCanvasElement) {
        super(canvas);
    }

    public async doLogic() {

        if (this.aBoolean1016 || this.startUpError || this.aBoolean1097) {
            return;
        }
        Game.pulseCycle++;
        if (!this.loggedIn) {
            await this.method149(-724);
        } else {
            await this.processGame();
        }
        this.method77(false);
    }

    public async repaintGame() {
        if (this.aBoolean1016 || this.startUpError || this.aBoolean1097) {
            this.drawError();
            return;
        }
        Game.anInt1309++;
        if (!this.loggedIn) {
            await this.drawLoginScreen(false);
        } else {
            this.drawGame();
        }
        this.anInt1094 = 0;
    }

    public drawGame() {
        // Not responsible for actual game drawing
        if (this.anInt1053 !== -1 && (this.loadingStage === 2 || this.imageProducer != null)) {
            if (this.loadingStage === 2) {
                this.method88(this.tickDelta, this.anInt1053, (5 as number) | 0);
                if (this.anInt960 !== -1) {
                    this.method88(this.tickDelta, this.anInt960, (5 as number) | 0);
                }
                this.tickDelta = 0;
                this.method147(this.anInt1140);
                this.imageProducer.createRasterizer();
                Rasterizer3D.lineOffsets = this.anIntArray1003;
                Rasterizer.resetPixels();
                this.aBoolean1046 = true;
                const class13: Widget = Widget.forId(this.anInt1053);
                if (class13.width === 512 && class13.height === 334 && class13.type === 0) {
                    class13.width = 765;
                    class13.height = 503;
                }
                this.method142(0, 0, class13, 0, 8);
                if (this.anInt960 !== -1) {
                    const class13_1: Widget = Widget.forId(this.anInt960);
                    if (class13_1.width === 512 && class13_1.height === 334 && class13_1.type === 0) {
                        class13_1.width = 765;
                        class13_1.height = 503;
                    }
                    this.method142(0, 0, class13_1, 0, 8);
                }
                if (!this.menuOpen) {
                    this.processRightClick(-521);
                    this.drawMenuTooltip();
                } else {
                    this.method128(false);
                }
            }
            this.imageProducer.drawGraphics(0, 0, this.gameGraphics);
            return;
        }
        if (this.aBoolean1046) {
            this.method122();
            this.aBoolean1046 = false;
            this.aClass18_906.drawGraphics(0, 4, this.gameGraphics);
            this.aClass18_907.drawGraphics(0, 357, this.gameGraphics);
            this.aClass18_908.drawGraphics(722, 4, this.gameGraphics);
            this.aClass18_909.drawGraphics(743, 205, this.gameGraphics);
            this.aClass18_910.drawGraphics(0, 0, this.gameGraphics);
            this.aClass18_911.drawGraphics(516, 4, this.gameGraphics);
            this.aClass18_912.drawGraphics(516, 205, this.gameGraphics);
            this.aClass18_913.drawGraphics(496, 357, this.gameGraphics);
            this.aClass18_914.drawGraphics(0, 338, this.gameGraphics);
            this.redrawTabArea = true;
            this.redrawChatbox = true;
            this.aBoolean950 = true;
            this.aBoolean1212 = true;
            if (this.loadingStage !== 2) {
                this.aClass18_1158.drawGraphics(4, 4, this.gameGraphics);
                this.aClass18_1157.drawGraphics(550, 4, this.gameGraphics);
            }
            Game.anInt1237++;
            if (Game.anInt1237 > 85) {
                Game.anInt1237 = 0;
                this.outBuffer.putOpcode(168);
            }
        }
        if (this.loadingStage === 2) {
            this.drawGameView();
        }
        if (this.menuOpen && this.anInt1304 === 1) {
            this.redrawTabArea = true;
        }
        if (this.anInt1089 !== -1) {
            const flag: boolean = this.method88(this.tickDelta, this.anInt1089, (5 as number) | 0);
            if (flag) {
                this.redrawTabArea = true;
            }
        }
        if (this.atInventoryInterfaceType === 2) {
            this.redrawTabArea = true;
        }
        if (this.activeInterfaceType === 2) {
            this.redrawTabArea = true;
        }
        if (this.redrawTabArea) {
            this.redrawTabs();
            this.redrawTabArea = false;
        }
        if (this.backDialogueId === -1 && this.inputType === 0) {
            this.aClass13_1249.anInt231 = this.anInt1107 - this.anInt851 - 77;
            if (this.mouseX > 448 && this.mouseX < 560 && this.mouseY > 332) {
                this.method42(this.anInt1107, 0, this.aClass13_1249, (102 as number) | 0, this.mouseY - 357, -1, this.mouseX - 17, 77, 463);
            }
            let j: number = this.anInt1107 - 77 - this.aClass13_1249.anInt231;
            if (j < 0) {
                j = 0;
            }
            if (j > this.anInt1107 - 77) {
                j = this.anInt1107 - 77;
            }
            if (this.anInt851 !== j) {
                this.anInt851 = j;
                this.redrawChatbox = true;
            }
        }
        if (this.backDialogueId === -1 && this.inputType === 3) {
            const k: number = this.anInt862 * 14 + 7;
            this.aClass13_1249.anInt231 = this.anInt865;
            if (this.mouseX > 448 && this.mouseX < 560 && this.mouseY > 332) {
                this.method42(k, 0, this.aClass13_1249, (102 as number) | 0, this.mouseY - 357, -1, this.mouseX - 17, 77, 463);
            }
            let i1: number = this.aClass13_1249.anInt231;
            if (i1 < 0) {
                i1 = 0;
            }
            if (i1 > k - 77) {
                i1 = k - 77;
            }
            if (this.anInt865 !== i1) {
                this.anInt865 = i1;
                this.redrawChatbox = true;
            }
        }
        if (this.backDialogueId !== -1) {
            const flag1: boolean = this.method88(this.tickDelta, this.backDialogueId, (5 as number) | 0);
            if (flag1) {
                this.redrawChatbox = true;
            }
        }
        if (this.atInventoryInterfaceType === 3) {
            this.redrawChatbox = true;
        }
        if (this.activeInterfaceType === 3) {
            this.redrawChatbox = true;
        }
        if (this.clickToContinueString != null) {
            this.redrawChatbox = true;
        }
        if (this.menuOpen && this.anInt1304 === 2) {
            this.redrawChatbox = true;
        }
        if (this.redrawChatbox) {
            this.renderChatbox();
            this.redrawChatbox = false;
        }
        if (this.loadingStage === 2) {
            this.renderMinimap();
            this.aClass18_1157.drawGraphics(550, 4, this.gameGraphics);
        }
        if (this.anInt1213 !== -1) {
            this.aBoolean950 = true;
        }
        if (this.aBoolean950) {
            if (this.anInt1213 !== -1 && this.anInt1213 === this.anInt1285) {
                this.anInt1213 = -1;
                this.outBuffer.putOpcode(119);
                this.outBuffer.putByte(this.anInt1285);
            }
            this.aBoolean950 = false;
            this.aClass18_1110.createRasterizer();
            this.anIndexedImage1054.drawImage(0, 0);
            if (this.anInt1089 === -1) {
                if (this.anIntArray1081[this.anInt1285] !== -1) {
                    if (this.anInt1285 === 0) {
                        this.aClass50_Sub1_Sub1_Sub3_880.drawImage(22, 10);
                    }
                    if (this.anInt1285 === 1) {
                        this.aClass50_Sub1_Sub1_Sub3_881.drawImage(54, 8);
                    }
                    if (this.anInt1285 === 2) {
                        this.aClass50_Sub1_Sub1_Sub3_881.drawImage(82, 8);
                    }
                    if (this.anInt1285 === 3) {
                        this.aClass50_Sub1_Sub1_Sub3_882.drawImage(110, 8);
                    }
                    if (this.anInt1285 === 4) {
                        this.aClass50_Sub1_Sub1_Sub3_884.drawImage(153, 8);
                    }
                    if (this.anInt1285 === 5) {
                        this.aClass50_Sub1_Sub1_Sub3_884.drawImage(181, 8);
                    }
                    if (this.anInt1285 === 6) {
                        this.aClass50_Sub1_Sub1_Sub3_883.drawImage(209, 9);
                    }
                }
                if (this.anIntArray1081[0] !== -1 && (this.anInt1213 !== 0 || Game.pulseCycle % 20 < 10)) {
                    this.tabIcon[0].drawImage(29, 13);
                }
                if (this.anIntArray1081[1] !== -1 && (this.anInt1213 !== 1 || Game.pulseCycle % 20 < 10)) {
                    this.tabIcon[1].drawImage(53, 11);
                }
                if (this.anIntArray1081[2] !== -1 && (this.anInt1213 !== 2 || Game.pulseCycle % 20 < 10)) {
                    this.tabIcon[2].drawImage(82, 11);
                }
                if (this.anIntArray1081[3] !== -1 && (this.anInt1213 !== 3 || Game.pulseCycle % 20 < 10)) {
                    this.tabIcon[3].drawImage(115, 12);
                }
                if (this.anIntArray1081[4] !== -1 && (this.anInt1213 !== 4 || Game.pulseCycle % 20 < 10)) {
                    this.tabIcon[4].drawImage(153, 13);
                }
                if (this.anIntArray1081[5] !== -1 && (this.anInt1213 !== 5 || Game.pulseCycle % 20 < 10)) {
                    this.tabIcon[5].drawImage(180, 11);
                }
                if (this.anIntArray1081[6] !== -1 && (this.anInt1213 !== 6 || Game.pulseCycle % 20 < 10)) {
                    this.tabIcon[6].drawImage(208, 13);
                }
            }
            this.aClass18_1110.drawGraphics(516, 160, this.gameGraphics);
            this.aClass18_1109.createRasterizer();
            this.anIndexedImage1053.drawImage(0, 0);
            if (this.anInt1089 === -1) {
                if (this.anIntArray1081[this.anInt1285] !== -1) {
                    if (this.anInt1285 === 7) {
                        this.aClass50_Sub1_Sub1_Sub3_983.drawImage(42, 0);
                    }
                    if (this.anInt1285 === 8) {
                        this.aClass50_Sub1_Sub1_Sub3_984.drawImage(74, 0);
                    }
                    if (this.anInt1285 === 9) {
                        this.aClass50_Sub1_Sub1_Sub3_984.drawImage(102, 0);
                    }
                    if (this.anInt1285 === 10) {
                        this.aClass50_Sub1_Sub1_Sub3_985.drawImage(130, 1);
                    }
                    if (this.anInt1285 === 11) {
                        this.aClass50_Sub1_Sub1_Sub3_987.drawImage(173, 0);
                    }
                    if (this.anInt1285 === 12) {
                        this.aClass50_Sub1_Sub1_Sub3_987.drawImage(201, 0);
                    }
                    if (this.anInt1285 === 13) {
                        this.aClass50_Sub1_Sub1_Sub3_986.drawImage(229, 0);
                    }
                }
                if (this.anIntArray1081[8] !== -1 && (this.anInt1213 !== 8 || Game.pulseCycle % 20 < 10)) {
                    this.tabIcon[7].drawImage(74, 2);
                }
                if (this.anIntArray1081[9] !== -1 && (this.anInt1213 !== 9 || Game.pulseCycle % 20 < 10)) {
                    this.tabIcon[8].drawImage(102, 3);
                }
                if (this.anIntArray1081[10] !== -1 && (this.anInt1213 !== 10 || Game.pulseCycle % 20 < 10)) {
                    this.tabIcon[9].drawImage(137, 4);
                }
                if (this.anIntArray1081[11] !== -1 && (this.anInt1213 !== 11 || Game.pulseCycle % 20 < 10)) {
                    this.tabIcon[10].drawImage(174, 2);
                }
                if (this.anIntArray1081[12] !== -1 && (this.anInt1213 !== 12 || Game.pulseCycle % 20 < 10)) {
                    this.tabIcon[11].drawImage(201, 2);
                }
                if (this.anIntArray1081[13] !== -1 && (this.anInt1213 !== 13 || Game.pulseCycle % 20 < 10)) {
                    this.tabIcon[12].drawImage(226, 2);
                }
            }
            this.aClass18_1109.drawGraphics(496, 466, this.gameGraphics);
            this.aClass18_1158.createRasterizer();
            Rasterizer3D.lineOffsets = this.anIntArray1002;
        }
        if (this.aBoolean1212) {
            this.aBoolean1212 = false;
            this.aClass18_1108.createRasterizer();
            this.anIndexedImage1052.drawImage(0, 0);
            this.fontNormal.drawStringCenter("Public chat", 55, 28, 16777215, true);
            if (this.publicChatMode === 0) {
                this.fontNormal.drawStringCenter("On", 55, 41, 65280, true);
            }
            if (this.publicChatMode === 1) {
                this.fontNormal.drawStringCenter("Friends", 55, 41, 16776960, true);
            }
            if (this.publicChatMode === 2) {
                this.fontNormal.drawStringCenter("Off", 55, 41, 16711680, true);
            }
            if (this.publicChatMode === 3) {
                this.fontNormal.drawStringCenter("Hide", 55, 41, 65535, true);
            }
            this.fontNormal.drawStringCenter("Private chat", 184, 28, 16777215, true);
            if (this.privateChatMode === 0) {
                this.fontNormal.drawStringCenter("On", 184, 41, 65280, true);
            }
            if (this.privateChatMode === 1) {
                this.fontNormal.drawStringCenter("Friends", 184, 41, 16776960, true);
            }
            if (this.privateChatMode === 2) {
                this.fontNormal.drawStringCenter("Off", 184, 41, 16711680, true);
            }
            this.fontNormal.drawStringCenter("Trade/compete", 324, 28, 16777215, true);
            if (this.tradeMode === 0) {
                this.fontNormal.drawStringCenter("On", 324, 41, 65280, true);
            }
            if (this.tradeMode === 1) {
                this.fontNormal.drawStringCenter("Friends", 324, 41, 16776960, true);
            }
            if (this.tradeMode === 2) {
                this.fontNormal.drawStringCenter("Off", 324, 41, 16711680, true);
            }
            this.fontNormal.drawStringCenter("Report abuse", 458, 33, 16777215, true);
            this.aClass18_1108.drawGraphics(0, 453, this.gameGraphics);
            this.aClass18_1158.createRasterizer();
            Rasterizer3D.lineOffsets = this.anIntArray1002;
        }
        this.tickDelta = 0;
    }

    /*private*/ public renderMinimap() {
        this.aClass18_1157.createRasterizer();
        if (this.minimapState === 2) {
            const mmBackgroundPixels: number[] = this.minimapBackgroundImage.pixels;
            const rasterPixels: number[] = Rasterizer.pixels;
            const pixelCount: number = mmBackgroundPixels.length;
            for (let i: number = 0; i < pixelCount; i++) {
                if (mmBackgroundPixels[i] === 0) {
                    rasterPixels[i] = 0;
                }
            }
            this.minimapCompass.shapeImageToPixels$int$int$int$int$int_A$int$int$int$int_A$int(
                0,
                33,
                25,
                33,
                this.anIntArray1286,
                0,
                this.cameraHorizontal,
                256,
                this.anIntArray1180,
                25
            );
            this.aClass18_1158.createRasterizer();
            Rasterizer3D.lineOffsets = this.anIntArray1002;
            return;
        }
        const angle: number = (this.cameraHorizontal + this.anInt916) & 2047;
        const centerX: number = 48 + ((Game.localPlayer.worldX / 32) | 0);
        const centerY: number = 464 - ((Game.localPlayer.worldY / 32) | 0);
        this.minimapImage.shapeImageToPixels$int$int$int$int$int_A$int$int$int$int_A$int(
            5,
            151,
            centerX,
            146,
            this.anIntArray920,
            25,
            angle,
            256 + this.anInt1233,
            this.anIntArray1019,
            centerY
        );
        this.minimapCompass.shapeImageToPixels$int$int$int$int$int_A$int$int$int$int_A$int(
            0,
            33,
            25,
            33,
            this.anIntArray1286,
            0,
            this.cameraHorizontal,
            256,
            this.anIntArray1180,
            25
        );
        for (let i: number = 0; i < this.minimapHintCount; i++) {
            {
                const hintX: number = this.minimapHintX[i] * 4 + 2 - ((Game.localPlayer.worldX / 32) | 0);
                const hintY: number = this.minimapHintY[i] * 4 + 2 - ((Game.localPlayer.worldY / 32) | 0);
                this.drawOnMinimap(this.minimapHint[i], hintX, hintY);
            }
        }
        for (let x: number = 0; x < 104; x++) {
            {
                for (let y: number = 0; y < 104; y++) {
                    {
                        const itemList: LinkedList = this.groundItems[this.plane][x][y];
                        if (itemList != null) {
                            const itemX: number = x * 4 + 2 - ((Game.localPlayer.worldX / 32) | 0);
                            const itemY: number = y * 4 + 2 - ((Game.localPlayer.worldY / 32) | 0);
                            this.drawOnMinimap(this.mapdotItem, itemX, itemY);
                        }
                    }
                }
            }
        }
        for (let i: number = 0; i < this.anInt1133; i++) {
            {
                const npc: Npc = this.npcs[this.anIntArray1134[i]];
                if (npc != null && npc.isVisible()) {
                    let definition: ActorDefinition = npc.npcDefinition;
                    if (definition.childrenIds != null) {
                        definition = definition.getChildDefinition();
                    }
                    if (definition != null && definition.minimapVisible && definition.clickable) {
                        const npcX: number = ((npc.worldX / 32) | 0) - ((Game.localPlayer.worldX / 32) | 0);
                        const npcY: number = ((npc.worldY / 32) | 0) - ((Game.localPlayer.worldY / 32) | 0);
                        this.drawOnMinimap(this.mapdotActor, npcX, npcY);
                    }
                }
            }
        }
        for (let i: number = 0; i < this.localPlayerCount; i++) {
            {
                const player: Player = this.players[this.playerList[i]];
                if (player != null && player.isVisible()) {
                    const playerX: number = ((player.worldX / 32) | 0) - ((Game.localPlayer.worldX / 32) | 0);
                    const playerY: number = ((player.worldY / 32) | 0) - ((Game.localPlayer.worldY / 32) | 0);
                    const name: number = TextUtils.nameToLong(player.playerName);
                    let isFriend: boolean = false;
                    let isTeammate: boolean = false;
                    for (let x: number = 0; x < this.friendsCount; x++) {
                        {
                            if (name !== this.friends[x] || this.friendWorlds[x] === 0) {
                                continue;
                            }
                            isFriend = true;
                            break;
                        }
                    }
                    if (Game.localPlayer.teamId !== 0 && player.teamId !== 0 && Game.localPlayer.teamId === player.teamId) {
                        isTeammate = true;
                    }
                    if (isFriend) {
                        this.drawOnMinimap(this.mapdotFriend, playerX, playerY);
                    } else if (isTeammate) {
                        this.drawOnMinimap(this.mapdotTeammate, playerX, playerY);
                    } else {
                        this.drawOnMinimap(this.mapdotPlayer, playerX, playerY);
                    }
                }
            }
        }
        if (this.anInt1197 !== 0 && Game.pulseCycle % 20 < 10) {
            if (this.anInt1197 === 1 && this.anInt1226 >= 0 && this.anInt1226 < this.npcs.length) {
                const npc: Npc = this.npcs[this.anInt1226];
                if (npc != null) {
                    const npcX: number = ((npc.worldX / 32) | 0) - ((Game.localPlayer.worldX / 32) | 0);
                    const npcY: number = ((npc.worldY / 32) | 0) - ((Game.localPlayer.worldY / 32) | 0);
                    this.drawMinimap(this.aClass50_Sub1_Sub1_Sub1_1037, npcX, npcY);
                }
            }
            if (this.anInt1197 === 2) {
                const hintX: number = (this.anInt844 - this.nextTopLeftTileX) * 4 + 2 - ((Game.localPlayer.worldX / 32) | 0);
                const hintY: number = (this.anInt845 - this.nextTopRightTileY) * 4 + 2 - ((Game.localPlayer.worldY / 32) | 0);
                this.drawMinimap(this.aClass50_Sub1_Sub1_Sub1_1037, hintX, hintY);
            }
            if (this.anInt1197 === 10 && this.anInt1151 >= 0 && this.anInt1151 < this.players.length) {
                const player: Player = this.players[this.anInt1151];
                if (player != null) {
                    const playerX: number = ((player.worldX / 32) | 0) - ((Game.localPlayer.worldX / 32) | 0);
                    const playerY: number = ((player.worldY / 32) | 0) - ((Game.localPlayer.worldY / 32) | 0);
                    this.drawMinimap(this.aClass50_Sub1_Sub1_Sub1_1037, playerX, playerY);
                }
            }
        }
        if (this.destinationX !== 0) {
            const flagX: number = this.destinationX * 4 + 2 - ((Game.localPlayer.worldX / 32) | 0);
            const flagY: number = this.destinationY * 4 + 2 - ((Game.localPlayer.worldY / 32) | 0);
            this.drawOnMinimap(this.mapFlagMarker, flagX, flagY);
        }
        Rasterizer.drawFilledRectangle(97, 78, 3, 3, 16777215);
        this.aClass18_1158.createRasterizer();
        Rasterizer3D.lineOffsets = this.anIntArray1002;
    }

    public drawMinimap(sprite: ImageRGB, x: number, y: number) {
        const r: number = x * x + y * y;
        if (r > 4225 && r < 90000) {
            const theta: number = (this.cameraHorizontal + this.anInt916) & 2047;
            let sin: number = Model.SINE[theta];
            let cos: number = Model.COSINE[theta];
            sin = ((sin * 256) / (this.anInt1233 + 256)) | 0;
            cos = ((cos * 256) / (this.anInt1233 + 256)) | 0;
            const l1: number = (y * sin + x * cos) >> 16;
            const i2: number = (y * cos - x * sin) >> 16;
            const d: number = Math.atan2(l1, i2);
            const j2: number = ((Math.sin(d) * 63.0) as number) | 0;
            const k2: number = ((Math.cos(d) * 57.0) as number) | 0;
            this.minimapEdge.method466(256, 15, 94 + j2 + 4 - 10, 15, 20, this.anInt1119, 20, d, 83 - k2 - 20);
            return;
        } else {
            this.drawOnMinimap(sprite, x, y);
            return;
        }
    }

    public drawOnMinimap(sprite: ImageRGB, x: number, y: number) {
        if (sprite == null) {
            return;
        }
        const k: number = (this.cameraHorizontal + this.anInt916) & 2047;
        const l: number = x * x + y * y;
        if (l > 6400) {
            return;
        }
        let i1: number = Model.SINE[k];
        let j1: number = Model.COSINE[k];
        i1 = ((i1 * 256) / (this.anInt1233 + 256)) | 0;
        j1 = ((j1 * 256) / (this.anInt1233 + 256)) | 0;
        const k1: number = (y * i1 + x * j1) >> 16;
        const l1: number = (y * j1 - x * i1) >> 16;
        if (l > 2500) {
            sprite.method467(
                this.minimapBackgroundImage,
                83 - l1 - ((sprite.maxHeight / 2) | 0) - 4,
                -49993,
                94 + k1 - ((sprite.maxWidth / 2) | 0) + 4
            );
            return;
        } else {
            sprite.drawImage(83 - l1 - ((sprite.maxHeight / 2) | 0) - 4, 94 + k1 - ((sprite.maxWidth / 2) | 0) + 4);
            return;
        }
    }

    /*private*/ public renderChatbox() {
        this.chatboxProducingGraphicsBuffer.createRasterizer();
        Rasterizer3D.lineOffsets = this.chatboxLineOffsets;
        this.chatboxBackgroundImage.drawImage(0, 0);
        if (this.messagePromptRaised) {
            this.fontBold.drawStringLeft(this.chatboxInputMessage, 239, 40, 0);
            this.fontBold.drawStringLeft(this.chatMessage + "*", 239, 60, 128);
        } else if (this.inputType === 1) {
            this.fontBold.drawStringLeft("Enter amount:", 239, 40, 0);
            this.fontBold.drawStringLeft(this.inputInputMessage + "*", 239, 60, 128);
        } else if (this.inputType === 2) {
            this.fontBold.drawStringLeft("Enter name:", 239, 40, 0);
            this.fontBold.drawStringLeft(this.inputInputMessage + "*", 239, 60, 128);
        } else if (this.inputType === 3) {
            if (
                !/* equals */ (((o1: any, o2: any) => {
                    if (o1 && o1.equals) {
                        return o1.equals(o2);
                    } else {
                        return o1 === o2;
                    }
                })(this.inputInputMessage, this.aString861) as any)
            ) {
                this.method14(this.inputInputMessage, 2);
                this.aString861 = this.inputInputMessage;
            }
            const typeFace: TypeFace = this.fontNormal;
            Rasterizer.setCoordinates(0, 0, 77, 463);
            for (let i: number = 0; i < this.anInt862; i++) {
                {
                    const y: number = 18 + i * 14 - this.anInt865;
                    if (y > 0 && y < 110) {
                        typeFace.drawStringLeft(this.aStringArray863[i], 239, y, 0);
                    }
                }
            }
            Rasterizer.resetCoordinates();
            if (this.anInt862 > 5) {
                this.method56(true, this.anInt865, 463, 77, this.anInt862 * 14 + 7, 0);
            }
            if (this.inputInputMessage.length === 0) {
                this.fontBold.drawStringLeft("Enter object name", 239, 40, 255);
            } else if (this.anInt862 === 0) {
                this.fontBold.drawStringLeft("No matching objects found, please shorten search", 239, 40, 0);
            }
            typeFace.drawStringLeft(this.inputInputMessage + "*", 239, 90, 0);
            Rasterizer.drawHorizontalLine(0, 77, 479, 0);
        } else if (this.clickToContinueString != null) {
            this.fontBold.drawStringLeft(this.clickToContinueString, 239, 40, 0);
            this.fontBold.drawStringLeft("Click to continue", 239, 60, 128);
        } else if (this.backDialogueId !== -1) {
            this.method142(0, 0, Widget.forId(this.backDialogueId), 0, 8);
        } else if (this.dialogueId !== -1) {
            this.method142(0, 0, Widget.forId(this.dialogueId), 0, 8);
        } else {
            const typeFace: TypeFace = this.fontNormal;
            let line: number = 0;
            Rasterizer.setCoordinates(0, 0, 77, 463);
            for (let i: number = 0; i < 100; i++) {
                {
                    if (this.chatMessages[i] != null) {
                        let name: string = this.chatPlayerNames[i];
                        const type: number = this.chatTypes[i];
                        const y: number = 70 - line * 14 + this.anInt851;
                        let privilege: number = 0;
                        if (
                            name != null &&
                            /* startsWith */ ((str, searchString, position = 0) =>
                                str.substr(position, searchString.length) === searchString)(name, "@cr1@")
                        ) {
                            name = name.substring(5);
                            privilege = 1;
                        }
                        if (
                            name != null &&
                            /* startsWith */ ((str, searchString, position = 0) =>
                                str.substr(position, searchString.length) === searchString)(name, "@cr2@")
                        ) {
                            name = name.substring(5);
                            privilege = 2;
                        }
                        if (type === 0) {
                            if (y > 0 && y < 110) {
                                typeFace.drawString(this.chatMessages[i], 4, y, 0);
                            }
                            line++;
                        }
                        if (
                            (type === 1 || type === 2) &&
                            (type === 1 || this.publicChatMode === 0 || (this.publicChatMode === 1 && this.method148(13292, name)))
                        ) {
                            if (y > 0 && y < 110) {
                                let x: number = 4;
                                if (privilege === 1) {
                                    this.moderatorIcon[0].drawImage(x, y - 12);
                                    x += 14;
                                }
                                if (privilege === 2) {
                                    this.moderatorIcon[1].drawImage(x, y - 12);
                                    x += 14;
                                }
                                typeFace.drawString(name + ":", x, y, 0);
                                x += typeFace.getStringEffectWidth(name) + 8;
                                typeFace.drawString(this.chatMessages[i], x, y, 255);
                            }
                            line++;
                        }
                        if (
                            (type === 3 || type === 7) &&
                            this.anInt1223 === 0 &&
                            (type === 7 || this.privateChatMode === 0 || (this.privateChatMode === 1 && this.method148(13292, name)))
                        ) {
                            if (y > 0 && y < 110) {
                                let x: number = 4;
                                typeFace.drawString("From", x, y, 0);
                                x += typeFace.getStringEffectWidth("From ");
                                if (privilege === 1) {
                                    this.moderatorIcon[0].drawImage(x, y - 12);
                                    x += 14;
                                }
                                if (privilege === 2) {
                                    this.moderatorIcon[1].drawImage(x, y - 12);
                                    x += 14;
                                }
                                typeFace.drawString(name + ":", x, y, 0);
                                x += typeFace.getStringEffectWidth(name) + 8;
                                typeFace.drawString(this.chatMessages[i], x, y, 8388608);
                            }
                            line++;
                        }
                        if (type === 4 && (this.tradeMode === 0 || (this.tradeMode === 1 && this.method148(13292, name)))) {
                            if (y > 0 && y < 110) {
                                typeFace.drawString(name + " " + this.chatMessages[i], 4, y, 8388736);
                            }
                            line++;
                        }
                        if (type === 5 && this.anInt1223 === 0 && this.privateChatMode < 2) {
                            if (y > 0 && y < 110) {
                                typeFace.drawString(this.chatMessages[i], 4, y, 8388608);
                            }
                            line++;
                        }
                        if (type === 6 && this.anInt1223 === 0 && this.privateChatMode < 2) {
                            if (y > 0 && y < 110) {
                                typeFace.drawString("To " + name + ":", 4, y, 0);
                                typeFace.drawString(this.chatMessages[i], 12 + typeFace.getStringEffectWidth("To " + name), y, 8388608);
                            }
                            line++;
                        }
                        if (type === 8 && (this.tradeMode === 0 || (this.tradeMode === 1 && this.method148(13292, name)))) {
                            if (y > 0 && y < 110) {
                                typeFace.drawString(name + " " + this.chatMessages[i], 4, y, 8270336);
                            }
                            line++;
                        }
                    }
                }
            }
            Rasterizer.resetCoordinates();
            this.anInt1107 = line * 14 + 7;
            if (this.anInt1107 < 78) {
                this.anInt1107 = 78;
            }
            this.method56(true, this.anInt1107 - this.anInt851 - 77, 463, 77, this.anInt1107, 0);
            let name: string;
            if (Game.localPlayer != null && Game.localPlayer.playerName != null) {
                name = Game.localPlayer.playerName;
            } else {
                name = TextUtils.formatName(this.username);
            }
            typeFace.drawString(name + ":", 4, 90, 0);
            typeFace.drawString(this.chatboxInput + "*", 6 + typeFace.getStringEffectWidth(name + ": "), 90, 255);
            Rasterizer.drawHorizontalLine(0, 77, 479, 0);
        }
        if (this.menuOpen && this.anInt1304 === 2) {
            this.method128(false);
        }
        this.chatboxProducingGraphicsBuffer.drawGraphics(17, 357, this.gameGraphics);
        this.aClass18_1158.createRasterizer();
        Rasterizer3D.lineOffsets = this.anIntArray1002;
    }

    // TODO looks scetchy double check
    public method14(s: string, i: number) {
        if (s == null || s.length === 0) {
            this.anInt862 = 0;
            return;
        }
        let s1: string = s;
        const as: string[] = (s => {
            const a = [];
            while (s-- > 0) {
                a.push(null);
            }
            return a;
        })(100);
        let j: number = 0;
        do {
            {
                const k: number = s1.indexOf(" ");
                if (k === -1) {
                    break;
                }
                const s2: string = s1.substring(0, k).trim();
                if (s2.length > 0) {
                    as[j++] = s2.toLowerCase();
                }
                s1 = s1.substring(k + 1);
            }
        } while (true);
        s1 = s1.trim();
        if (s1.length > 0) {
            as[j++] = s1.toLowerCase();
        }
        this.anInt862 = 0;
        if (i !== 2) {
            this.aBoolean959 = !this.aBoolean959;
        }
        label0: for (let l: number = 0; l < ItemDefinition.count; l++) {
            {
                const class16: ItemDefinition = ItemDefinition.lookup(l);
                if (class16.notedTemplateId !== -1 || class16.name == null) {
                    continue;
                }
                const s3: string = class16.name.toLowerCase();
                for (let i1: number = 0; i1 < j; i1++) {
                    if (s3.indexOf(as[i1]) === -1) {
                        continue label0;
                    }
                }
                this.aStringArray863[this.anInt862] = s3;
                this.anIntArray864[this.anInt862] = l;
                this.anInt862++;
                if (this.anInt862 >= this.aStringArray863.length) {
                    return;
                }
            }
        }
    }

    public redrawTabs() {
        this.aClass18_1156.createRasterizer();
        Rasterizer3D.lineOffsets = this.anIntArray1001;
        this.inventoryBackgroundImage.drawImage(0, 0);
        if (this.anInt1089 !== -1) {
            this.method142(0, 0, Widget.forId(this.anInt1089), 0, 8);
        } else if (this.anIntArray1081[this.anInt1285] !== -1) {
            this.method142(0, 0, Widget.forId(this.anIntArray1081[this.anInt1285]), 0, 8);
        }
        if (this.menuOpen && this.anInt1304 === 1) {
            this.method128(false);
        }
        this.aClass18_1156.drawGraphics(553, 205, this.gameGraphics);
        this.aClass18_1158.createRasterizer();
        Rasterizer3D.lineOffsets = this.anIntArray1002;
    }

    public drawGameView() {
        this.anInt1138++;
        this.processPlayerAdditions(true);
        this.method57(true);
        this.processPlayerAdditions(false);
        this.method57(false);
        this.method51(false);
        this.method76(-992);
        if (!this.oriented) {
            let j: number = this.anInt1251;
            if (((this.anInt1289 / 256) | 0) > j) {
                j = (this.anInt1289 / 256) | 0;
            }
            if (this.aBooleanArray927[4] && this.anIntArray852[4] + 128 > j) {
                j = this.anIntArray852[4] + 128;
            }
            const l: number = (this.cameraHorizontal + this.anInt1255) & 2047;
            this.setCameraPosition(
                this.anInt1262,
                this.anInt1263,
                this.getTileHeight(Game.localPlayer.worldY, Game.localPlayer.worldX, (9 as number) | 0, this.plane) - 50,
                j,
                l
            );
        }
        let k: number;
        if (!this.oriented) {
            k = this.method117((1 as number) | 0);
        } else {
            k = this.method118(-276);
        }
        const i1: number = this.cameraX;
        const j1: number = this.cameraZ;
        const k1: number = this.cameraY;
        const l1: number = this.cameraPitch;
        const i2: number = this.cameraYaw;

        for (let j2: number = 0; j2 < 5; j2++) {
            if (this.aBooleanArray927[j2]) {
                const k2: number =
                    (((((((Math.random() * (this.anIntArray1105[j2] * 2 + 1)) as number) - this.anIntArray1105[j2]) as number) +
                        Math.sin((this.quakeTimes[j2] as number) * ((this.anIntArray991[j2] as number) / 100.0)) *
                            this.anIntArray852[j2]) as number) as number) | 0;
                if (j2 === 0) {
                    this.cameraX += k2;
                }
                if (j2 === 1) {
                    this.cameraZ += k2;
                }
                if (j2 === 2) {
                    this.cameraY += k2;
                }
                if (j2 === 3) {
                    this.cameraYaw = (this.cameraYaw + k2) & 2047;
                }
                if (j2 === 4) {
                    this.cameraPitch += k2;
                    if (this.cameraPitch < 128) {
                        this.cameraPitch = 128;
                    }
                    if (this.cameraPitch > 383) {
                        this.cameraPitch = 383;
                    }
                }
            }
        }
        const l2: number = Rasterizer3D.anInt1547;
        Model.aBoolean1705 = true;
        Model.anInt1708 = 0;
        Model.anInt1706 = this.mouseX - 4;
        Model.anInt1707 = this.mouseY - 4;
        Rasterizer.resetPixels();
        this.currentScene.method280(this.cameraX, k, 0, this.cameraZ, this.cameraY, this.cameraYaw, this.cameraPitch);
        this.currentScene.method255();
        this.method121(false);
        this.method127(true);
        this.method65(l2);
        this.renderGameView();
        this.aClass18_1158.drawGraphics(4, 4, this.gameGraphics);
        this.cameraX = i1;
        this.cameraZ = j1;
        this.cameraY = k1;
        this.cameraPitch = l1;
        this.cameraYaw = i2;
    }

    /*private*/ public renderGameView() {
        this.renderSplitPrivateMessages();
        if (this.crossType === 1) {
            this.cursorCross[(this.crossIndex / 100) | 0].drawImage(this.anInt1021 - 8 - 4, this.anInt1020 - 8 - 4);
        }
        if (this.crossType === 2) {
            this.cursorCross[4 + ((this.crossIndex / 100) | 0)].drawImage(this.anInt1021 - 8 - 4, this.anInt1020 - 8 - 4);
        }
        if (this.anInt1279 !== -1) {
            this.method88(this.tickDelta, this.anInt1279, (5 as number) | 0);
            this.method142(0, 0, Widget.forId(this.anInt1279), 0, 8);
        }
        if (this.openInterfaceId !== -1) {
            this.method88(this.tickDelta, this.openInterfaceId, (5 as number) | 0);
            this.method142(0, 0, Widget.forId(this.openInterfaceId), 0, 8);
        }
        this.setTutorialIslandFlag();
        if (!this.menuOpen) {
            this.processRightClick(-521);
            this.drawMenuTooltip();
        } else if (this.anInt1304 === 0) {
            this.method128(false);
        }
        if (this.anInt1319 === 1) {
            this.aClass50_Sub1_Sub1_Sub1_1086.drawImage(296, 472);
        }
        if (Game.fps) {
            let y: number = 20;
            let colour: number = 16776960;
            if (this.fps < 30 && Game.lowMemory) {
                colour = 16711680;
            }
            if (this.fps < 20 && !Game.lowMemory) {
                colour = 16711680;
            }
            this.fontNormal.drawStringRight("Fps:" + this.fps, 507, y, colour);
            y += 15;
            // const runtime: java.lang.Runtime = java.lang.Runtime.getRuntime();
            const memoryUsed: number = 1337; //(((((n) => n < 0 ? Math.ceil(n) : Math.floor(n))((runtime.totalMemory() - runtime.freeMemory()) / 1024)) as number) | 0);
            colour = 16776960;
            if (memoryUsed > 33554432 && Game.lowMemory) {
                colour = 16711680;
            }
            if (memoryUsed > 67108864 && !Game.lowMemory) {
                colour = 16711680;
            }
            this.fontNormal.drawStringRight("Mem:" + memoryUsed + "k", 507, y, colour);
        }
        if (this.systemUpdateTime !== 0) {
            let seconds: number = (this.systemUpdateTime / 50) | 0;
            const minutes: number = (seconds / 60) | 0;
            seconds %= 60;
            if (seconds < 10) {
                this.fontNormal.drawString("System update in: " + minutes + ":0" + seconds, 4, 329, 16776960);
            } else {
                this.fontNormal.drawString("System update in: " + minutes + ":" + seconds, 4, 329, 16776960);
            }
            Game.anInt895++;
            if (Game.anInt895 > 112) {
                Game.anInt895 = 0;
                this.outBuffer.putOpcode(197);
                this.outBuffer.putInt(0);
            }
        }
    }

    public method128(flag: boolean) {
        if (flag) {
            this.outBuffer.putByte(23);
        }
        const i: number = this.menuClickX;
        const j: number = this.menuClickY;
        const k: number = this.anInt1307;
        const l: number = this.anInt1308;
        const i1: number = 6116423;
        Rasterizer.drawFilledRectangle(i, j, k, l, i1);
        Rasterizer.drawFilledRectangle(i + 1, j + 1, k - 2, 16, 0);
        Rasterizer.drawUnfilledRectangle(i + 1, j + 18, k - 2, l - 19, 0);
        this.fontBold.drawString("Choose Option", i + 3, j + 14, i1);
        let j1: number = this.mouseX;
        let k1: number = this.mouseY;
        if (this.anInt1304 === 0) {
            j1 -= 4;
            k1 -= 4;
        }
        if (this.anInt1304 === 1) {
            j1 -= 553;
            k1 -= 205;
        }
        if (this.anInt1304 === 2) {
            j1 -= 17;
            k1 -= 357;
        }
        for (let l1: number = 0; l1 < this.menuActionRow; l1++) {
            {
                const i2: number = j + 31 + (this.menuActionRow - 1 - l1) * 15;
                let j2: number = 16777215;
                if (j1 > i && j1 < i + k && k1 > i2 - 13 && k1 < i2 + 3) {
                    j2 = 16776960;
                }
                this.fontBold.drawShadowedString(this.menuActionTexts[l1], i + 3, i2, true, j2);
            }
        }
    }

    /*private*/ public setTutorialIslandFlag() {
        const x: number = (Game.localPlayer.worldX >> 7) + this.nextTopLeftTileX;
        const y: number = (Game.localPlayer.worldY >> 7) + this.nextTopRightTileY;
        this.inTutorialIsland = false;
        if (x >= 3053 && x <= 3156 && y >= 3056 && y <= 3136) {
            this.inTutorialIsland = true;
        }
        if (x >= 3072 && x <= 3118 && y >= 9492 && y <= 9535) {
            this.inTutorialIsland = true;
        }
        if (this.inTutorialIsland && x >= 3139 && x <= 3199 && y >= 3008 && y <= 3062) {
            this.inTutorialIsland = false;
        }
    }

    /*private*/ public renderSplitPrivateMessages() {
        if (this.anInt1223 === 0) {
            return;
        }
        const typeFace: TypeFace = this.fontNormal;
        let line: number = 0;
        if (this.systemUpdateTime !== 0) {
            line = 1;
        }
        for (let i: number = 0; i < 100; i++) {
            {
                if (this.chatMessages[i] != null) {
                    const type: number = this.chatTypes[i];
                    let name: string = this.chatPlayerNames[i];
                    let privilege: number = 0;
                    if (
                        name != null &&
                        /* startsWith */ ((str, searchString, position = 0) => str.substr(position, searchString.length) === searchString)(
                            name,
                            "@cr1@"
                        )
                    ) {
                        name = name.substring(5);
                        privilege = 1;
                    }
                    if (
                        name != null &&
                        /* startsWith */ ((str, searchString, position = 0) => str.substr(position, searchString.length) === searchString)(
                            name,
                            "@cr2@"
                        )
                    ) {
                        name = name.substring(5);
                        privilege = 2;
                    }
                    if (
                        (type === 3 || type === 7) &&
                        (type === 7 || this.privateChatMode === 0 || (this.privateChatMode === 1 && this.method148(13292, name)))
                    ) {
                        const y: number = 329 - line * 13;
                        let x: number = 4;
                        typeFace.drawString("From", x, y, 0);
                        typeFace.drawString("From", x, y - 1, 65535);
                        x += typeFace.getStringEffectWidth("From ");
                        if (privilege === 1) {
                            this.moderatorIcon[0].drawImage(x, y - 12);
                            x += 14;
                        }
                        if (privilege === 2) {
                            this.moderatorIcon[1].drawImage(x, y - 12);
                            x += 14;
                        }
                        typeFace.drawString(name + ": " + this.chatMessages[i], x, y, 0);
                        typeFace.drawString(name + ": " + this.chatMessages[i], x, y - 1, 65535);
                        if (++line >= 5) {
                            return;
                        }
                    }
                    if (type === 5 && this.privateChatMode < 2) {
                        const y: number = 329 - line * 13;
                        typeFace.drawString(this.chatMessages[i], 4, y, 0);
                        typeFace.drawString(this.chatMessages[i], 4, y - 1, 65535);
                        if (++line >= 5) {
                            return;
                        }
                    }
                    if (type === 6 && this.privateChatMode < 2) {
                        const y: number = 329 - line * 13;
                        typeFace.drawString("To " + name + ": " + this.chatMessages[i], 4, y, 0);
                        typeFace.drawString("To " + name + ": " + this.chatMessages[i], 4, y - 1, 65535);
                        if (++line >= 5) {
                            return;
                        }
                    }
                }
            }
        }
    }

    public method118(i: number): number {
        const j: number = this.getTileHeight(this.cameraY, this.cameraX, (9 as number) | 0, this.plane);
        while (i >= 0) {
            this.opcode = this.buffer.getUnsignedByte();
        }
        if (j - this.cameraZ < 800 && (this.currentSceneTileFlags[this.plane][this.cameraX >> 7][this.cameraY >> 7] & 4) !== 0) {
            return this.plane;
        } else {
            return 3;
        }
    }

    public method117(byte0: number): number {
        let i: number = 3;
        if (byte0 === this.aByte956) {
            byte0 = 0;
        } else {
            this.startUp();
        }
        if (this.cameraPitch < 310) {
            Game.anInt978++;
            if (Game.anInt978 > 1457) {
                Game.anInt978 = 0;
                this.outBuffer.putOpcode(244);
                this.outBuffer.putByte(0);
                const j: number = this.outBuffer.currentPosition;
                this.outBuffer.putByte(219);
                this.outBuffer.putShort(37745);
                this.outBuffer.putByte(61);
                this.outBuffer.putShort(43756);
                this.outBuffer.putShort(((Math.random() * 65536.0) as number) | 0);
                this.outBuffer.putByte(((Math.random() * 256.0) as number) | 0);
                this.outBuffer.putShort(51171);
                if ((((Math.random() * 2.0) as number) | 0) === 0) {
                    this.outBuffer.putShort(15808);
                }
                this.outBuffer.putByte(97);
                this.outBuffer.putByte(((Math.random() * 256.0) as number) | 0);
                this.outBuffer.putLength(this.outBuffer.currentPosition - j);
            }
            let k: number = this.cameraX >> 7;
            let l: number = this.cameraY >> 7;
            const i1: number = Game.localPlayer.worldX >> 7;
            const j1: number = Game.localPlayer.worldY >> 7;
            if ((this.currentSceneTileFlags[this.plane][k][l] & 4) !== 0) {
                i = this.plane;
            }
            let k1: number;
            if (i1 > k) {
                k1 = i1 - k;
            } else {
                k1 = k - i1;
            }
            let l1: number;
            if (j1 > l) {
                l1 = j1 - l;
            } else {
                l1 = l - j1;
            }
            if (k1 > l1) {
                const i2: number = ((l1 * 65536) / k1) | 0;
                let k2: number = 32768;
                while (k !== i1) {
                    {
                        if (k < i1) {
                            k++;
                        } else if (k > i1) {
                            k--;
                        }
                        if ((this.currentSceneTileFlags[this.plane][k][l] & 4) !== 0) {
                            i = this.plane;
                        }
                        k2 += i2;
                        if (k2 >= 65536) {
                            k2 -= 65536;
                            if (l < j1) {
                                l++;
                            } else if (l > j1) {
                                l--;
                            }
                            if ((this.currentSceneTileFlags[this.plane][k][l] & 4) !== 0) {
                                i = this.plane;
                            }
                        }
                    }
                }
            } else {
                const j2: number = ((k1 * 65536) / l1) | 0;
                let l2: number = 32768;
                while (l !== j1) {
                    {
                        if (l < j1) {
                            l++;
                        } else if (l > j1) {
                            l--;
                        }
                        if ((this.currentSceneTileFlags[this.plane][k][l] & 4) !== 0) {
                            i = this.plane;
                        }
                        l2 += j2;
                        if (l2 >= 65536) {
                            l2 -= 65536;
                            if (k < i1) {
                                k++;
                            } else if (k > i1) {
                                k--;
                            }
                            if ((this.currentSceneTileFlags[this.plane][k][l] & 4) !== 0) {
                                i = this.plane;
                            }
                        }
                    }
                }
            }
        }
        if ((this.currentSceneTileFlags[this.plane][Game.localPlayer.worldX >> 7][Game.localPlayer.worldY >> 7] & 4) !== 0) {
            i = this.plane;
        }
        return i;
    }

    /*private*/ public setCameraPosition(x: number, y: number, z: number, pitch: number, yaw: number) {
        const pitchDifference: number = (2048 - pitch) & 2047;
        const yawDifference: number = (2048 - yaw) & 2047;
        let xOffset: number = 0;
        let zOffset: number = 0;
        let yOffset: number = 600 + pitch * 3;
        if (pitchDifference !== 0) {
            const sine: number = Model.SINE[pitchDifference];
            const cosine: number = Model.COSINE[pitchDifference];
            const temp: number = (zOffset * cosine - yOffset * sine) >> 16;
            yOffset = (zOffset * sine + yOffset * cosine) >> 16;
            zOffset = temp;
        }
        if (yawDifference !== 0) {
            const sine: number = Model.SINE[yawDifference];
            const cosine: number = Model.COSINE[yawDifference];
            const temp: number = (yOffset * sine + xOffset * cosine) >> 16;
            yOffset = (yOffset * cosine - xOffset * sine) >> 16;
            xOffset = temp;
        }
        this.cameraX = x - xOffset;
        this.cameraZ = z - zOffset;
        this.cameraY = y - yOffset;
        this.cameraPitch = pitch;
        this.cameraYaw = yaw;
    }

    public method76(i: number) {
        while (i >= 0) {
            this.groundItems = null;
        }
        for (
            let gameAnimableObject: GameAnimableObject = this.aClass6_1210.first() as GameAnimableObject;
            gameAnimableObject != null;
            gameAnimableObject = this.aClass6_1210.next() as GameAnimableObject
        ) {
            if (gameAnimableObject.plane !== this.plane || gameAnimableObject.transformCompleted) {
                gameAnimableObject.remove();
            } else if (Game.pulseCycle >= gameAnimableObject.loopCycle) {
                gameAnimableObject.nextFrame(this.tickDelta);
                if (gameAnimableObject.transformCompleted) {
                    gameAnimableObject.remove();
                } else {
                    this.currentScene.addEntity(
                        -1,
                        gameAnimableObject,
                        gameAnimableObject.x,
                        gameAnimableObject.z,
                        false,
                        0,
                        gameAnimableObject.plane,
                        60,
                        gameAnimableObject.y,
                        0
                    );
                }
            }
        }
    }

    public method65(i: number) {
        if (!Game.lowMemory) {
            for (let k: number = 0; k < this.anIntArray1290.length; k++) {
                {
                    const l: number = this.anIntArray1290[k];
                    if (Rasterizer3D.anIntArray1546[l] >= i) {
                        const class50_sub1_sub1_sub3: IndexedImage = Rasterizer3D.aClass50_Sub1_Sub1_Sub3Array1540[l];
                        const i1: number = class50_sub1_sub1_sub3.width * class50_sub1_sub1_sub3.height - 1;
                        const j1: number = class50_sub1_sub1_sub3.width * this.tickDelta * 2;
                        const abyte0: number[] = class50_sub1_sub1_sub3.pixels;
                        const abyte1: number[] = this.aByteArray1245;
                        for (let k1: number = 0; k1 <= i1; k1++) {
                            abyte1[k1] = abyte0[(k1 - j1) & i1];
                        }
                        class50_sub1_sub1_sub3.pixels = abyte1;
                        this.aByteArray1245 = abyte0;
                        Rasterizer3D.method499(l, 9);
                    }
                }
            }
        }
    }

    public method127(flag: boolean) {
        if (!flag) {
            this.anInt1056 = this.incomingRandom.nextInt();
        }
        if (this.anInt1197 !== 2) {
            return;
        }
        this.worldToScreen(
            ((this.anInt844 - this.nextTopLeftTileX) << 7) + this.anInt847,
            this.anInt846 * 2,
            ((this.anInt845 - this.nextTopRightTileY) << 7) + this.anInt848
        );
        if (this.screenX > -1 && Game.pulseCycle % 20 < 10) {
            this.headiconsHints[0].drawImage(this.screenY - 28, this.screenX - 12);
        }
    }

    public method51(flag: boolean) {
        let class50_sub1_sub4_sub2: Projectile = this.aClass6_1282.first() as Projectile;
        if (flag) {
            this.anInt1328 = 153;
        }
        for (; class50_sub1_sub4_sub2 != null; class50_sub1_sub4_sub2 = this.aClass6_1282.next() as Projectile) {
            if (class50_sub1_sub4_sub2.sceneId !== this.plane || Game.pulseCycle > class50_sub1_sub4_sub2.endCycle) {
                class50_sub1_sub4_sub2.remove();
            } else if (Game.pulseCycle >= class50_sub1_sub4_sub2.delay) {
                if (class50_sub1_sub4_sub2.targetedEntityId > 0) {
                    const class50_sub1_sub4_sub3_sub1: Npc = this.npcs[class50_sub1_sub4_sub2.targetedEntityId - 1];
                    if (
                        class50_sub1_sub4_sub3_sub1 != null &&
                        class50_sub1_sub4_sub3_sub1.worldX >= 0 &&
                        class50_sub1_sub4_sub3_sub1.worldX < 13312 &&
                        class50_sub1_sub4_sub3_sub1.worldY >= 0 &&
                        class50_sub1_sub4_sub3_sub1.worldY < 13312
                    ) {
                        class50_sub1_sub4_sub2.trackTarget(
                            class50_sub1_sub4_sub3_sub1.worldX,
                            class50_sub1_sub4_sub3_sub1.worldY,
                            this.getTileHeight(
                                class50_sub1_sub4_sub3_sub1.worldY,
                                class50_sub1_sub4_sub3_sub1.worldX,
                                (9 as number) | 0,
                                class50_sub1_sub4_sub2.sceneId
                            ) - class50_sub1_sub4_sub2.endHeight,
                            Game.pulseCycle
                        );
                    }
                }
                if (class50_sub1_sub4_sub2.targetedEntityId < 0) {
                    const i: number = -class50_sub1_sub4_sub2.targetedEntityId - 1;
                    let class50_sub1_sub4_sub3_sub2: Player;
                    if (i === this.thisPlayerServerId) {
                        class50_sub1_sub4_sub3_sub2 = Game.localPlayer;
                    } else {
                        class50_sub1_sub4_sub3_sub2 = this.players[i];
                    }
                    if (
                        class50_sub1_sub4_sub3_sub2 != null &&
                        class50_sub1_sub4_sub3_sub2.worldX >= 0 &&
                        class50_sub1_sub4_sub3_sub2.worldX < 13312 &&
                        class50_sub1_sub4_sub3_sub2.worldY >= 0 &&
                        class50_sub1_sub4_sub3_sub2.worldY < 13312
                    ) {
                        class50_sub1_sub4_sub2.trackTarget(
                            class50_sub1_sub4_sub3_sub2.worldX,
                            class50_sub1_sub4_sub3_sub2.worldY,
                            this.getTileHeight(
                                class50_sub1_sub4_sub3_sub2.worldY,
                                class50_sub1_sub4_sub3_sub2.worldX,
                                (9 as number) | 0,
                                class50_sub1_sub4_sub2.sceneId
                            ) - class50_sub1_sub4_sub2.endHeight,
                            Game.pulseCycle
                        );
                    }
                }
                class50_sub1_sub4_sub2.move(this.tickDelta);
                this.currentScene.addEntity(
                    -1,
                    class50_sub1_sub4_sub2,
                    (class50_sub1_sub4_sub2.currentX as number) | 0,
                    (class50_sub1_sub4_sub2.currentHeight as number) | 0,
                    false,
                    0,
                    this.plane,
                    60,
                    (class50_sub1_sub4_sub2.currentY as number) | 0,
                    class50_sub1_sub4_sub2.anInt1562
                );
            }
        }
        Game.anInt1168++;
        if (Game.anInt1168 > 51) {
            Game.anInt1168 = 0;
            this.outBuffer.putOpcode(248);
        }
    }

    public method57(flag: boolean) {
        for (let j: number = 0; j < this.anInt1133; j++) {
            {
                const class50_sub1_sub4_sub3_sub1: Npc = this.npcs[this.anIntArray1134[j]];
                let k: number = 0x20000000 + (this.anIntArray1134[j] << 14);
                if (
                    class50_sub1_sub4_sub3_sub1 == null ||
                    !class50_sub1_sub4_sub3_sub1.isVisible() ||
                    class50_sub1_sub4_sub3_sub1.npcDefinition.visible !== flag ||
                    !class50_sub1_sub4_sub3_sub1.npcDefinition.method360()
                ) {
                    continue;
                }
                const l: number = class50_sub1_sub4_sub3_sub1.worldX >> 7;
                const i1: number = class50_sub1_sub4_sub3_sub1.worldY >> 7;
                if (l < 0 || l >= 104 || i1 < 0 || i1 >= 104) {
                    continue;
                }
                if (
                    class50_sub1_sub4_sub3_sub1.boundaryDimension === 1 &&
                    (class50_sub1_sub4_sub3_sub1.worldX & 127) === 64 &&
                    (class50_sub1_sub4_sub3_sub1.worldY & 127) === 64
                ) {
                    if (this.anIntArrayArray886[l][i1] === this.anInt1138) {
                        continue;
                    }
                    this.anIntArrayArray886[l][i1] = this.anInt1138;
                }
                if (!class50_sub1_sub4_sub3_sub1.npcDefinition.clickable) {
                    k += 0x80000000;
                }
                this.currentScene.addEntity(
                    k,
                    class50_sub1_sub4_sub3_sub1,
                    class50_sub1_sub4_sub3_sub1.worldX,
                    this.getTileHeight(class50_sub1_sub4_sub3_sub1.worldY, class50_sub1_sub4_sub3_sub1.worldX, (9 as number) | 0, this.plane),
                    class50_sub1_sub4_sub3_sub1.aBoolean1592,
                    0,
                    this.plane,
                    (class50_sub1_sub4_sub3_sub1.boundaryDimension - 1) * 64 + 60,
                    class50_sub1_sub4_sub3_sub1.worldY,
                    class50_sub1_sub4_sub3_sub1.anInt1612
                );
            }
        }
    }

    public method121(flag: boolean) {
        this.anInt939 = 0;
        for (let i: number = -1; i < this.localPlayerCount + this.anInt1133; i++) {
            {
                let obj: Actor;
                if (i === -1) {
                    obj = Game.localPlayer;
                } else if (i < this.localPlayerCount) {
                    obj = this.players[this.playerList[i]];
                } else {
                    obj = this.npcs[this.anIntArray1134[i - this.localPlayerCount]];
                }
                if (obj == null || !(obj as Actor).isVisible()) {
                    continue;
                }
                if (obj != null && (obj instanceof Npc)) {
                    let class37: ActorDefinition = obj.npcDefinition;
                    if (class37.childrenIds != null) {
                        class37 = class37.getChildDefinition();
                    }
                    if (class37 == null) {
                        continue;
                    }
                }
                if (i < this.localPlayerCount) {
                    let k: number = 30;
                    const player: Player = obj as Player;
                    if (player.skullIconId !== -1 || player.prayerIconId !== -1) {
                        this.actorWorldToScreen(obj as Actor, (obj as Actor).modelHeight + 15);
                        if (this.screenX > -1) {
                            if (player.skullIconId !== -1) {
                                this.headiconsPks[player.skullIconId].drawImage(
                                    this.screenY - k,
                                    this.screenX - 12
                                );
                                k += 25;
                            }
                            if (player.prayerIconId !== -1) {
                                this.headiconsPrayers[player.prayerIconId].drawImage(
                                    this.screenY - k,
                                    this.screenX - 12
                                );
                                k += 25;
                            }
                        }
                    }
                    if (i >= 0 && this.anInt1197 === 10 && this.anInt1151 === this.playerList[i]) {
                        this.actorWorldToScreen(obj as Actor,  (obj as Actor).modelHeight + 15);
                        if (this.screenX > -1) {
                            this.headiconsHints[1].drawImage(this.screenY - k, this.screenX - 12);
                        }
                    }
                } else {
                    const actorDef: ActorDefinition = (obj as Npc).npcDefinition;
                    if (actorDef.headIcon >= 0 && actorDef.headIcon < this.headiconsPrayers.length) {
                        this.actorWorldToScreen(obj as Actor, (obj as Actor).modelHeight + 15);
                        if (this.screenX > -1) {
                            this.headiconsPrayers[actorDef.headIcon].drawImage(this.screenY - 30, this.screenX - 12);
                        }
                    }
                    if (
                        this.anInt1197 === 1 &&
                        this.anInt1226 === this.anIntArray1134[i - this.localPlayerCount] &&
                        Game.pulseCycle % 20 < 10
                    ) {
                        this.actorWorldToScreen(obj as Actor, (obj as Actor).modelHeight + 15);
                        if (this.screenX > -1) {
                            this.headiconsHints[0].drawImage(this.screenY - 28, this.screenX - 12);
                        }
                    }
                }
                if (
                    obj.forcedChat != null &&
                    (i >= this.localPlayerCount ||
                        this.publicChatMode === 0 ||
                        this.publicChatMode === 3 ||
                        (this.publicChatMode === 1 && this.method148(13292, (obj as Player).playerName)))
                ) {
                    this.actorWorldToScreen(obj as Actor, (obj as Actor).modelHeight);
                    if (this.screenX > -1 && this.anInt939 < this.anInt940) {
                        this.anIntArray944[this.anInt939] = (this.fontBold.getStringWidth((obj as Actor).forcedChat) / 2) | 0;
                        this.anIntArray943[this.anInt939] = this.fontBold.characterDefaultHeight;
                        this.anIntArray941[this.anInt939] = this.screenX;
                        this.anIntArray942[this.anInt939] = this.screenY;
                        this.anIntArray945[this.anInt939] = (obj as Actor).textColour;
                        this.anIntArray946[this.anInt939] = (obj as Actor).textEffect;
                        this.anIntArray947[this.anInt939] = (obj as Actor).textCycle;
                        this.aStringArray948[this.anInt939++] = (obj as Actor).forcedChat;
                        if (this.anInt998 === 0 && (obj as Actor).textEffect >= 1 && (obj as Actor).textEffect <= 3) {
                            this.anIntArray943[this.anInt939] += 10;
                            this.anIntArray942[this.anInt939] += 5;
                        }
                        if (this.anInt998 === 0 && (obj as Actor).textEffect === 4) {
                            this.anIntArray944[this.anInt939] = 60;
                        }
                        if (this.anInt998 === 0 && (obj as Actor).textEffect === 5) {
                            this.anIntArray943[this.anInt939] += 5;
                        }
                    }
                }
                if ((obj as Actor).endCycle > Game.pulseCycle) {
                    this.actorWorldToScreen(obj as Actor, (obj as Actor).modelHeight + 15);
                    if (this.screenX > -1) {
                        let l: number = (((obj as Actor).anInt1596 * 30) / (obj as Actor).anInt1597) | 0;
                        if (l > 30) {
                            l = 30;
                        }
                        Rasterizer.drawFilledRectangle(this.screenX - 15, this.screenY - 3, l, 5, 65280);
                        Rasterizer.drawFilledRectangle(this.screenX - 15 + l, this.screenY - 3, 30 - l, 5, 16711680);
                    }
                }
                for (let i1: number = 0; i1 < 4; i1++) {
                    if ((obj as Actor).hitCycles[i1] > Game.pulseCycle) {
                        this.actorWorldToScreen(obj as Actor, ((obj as Actor).modelHeight / 2) | 0);
                        if (this.screenX > -1) {
                            if (i1 === 1) {
                                this.screenY -= 20;
                            }
                            if (i1 === 2) {
                                this.screenX -= 15;
                                this.screenY -= 10;
                            }
                            if (i1 === 3) {
                                this.screenX += 15;
                                this.screenY -= 10;
                            }
                            this.hitmarks[(obj as Actor).hitTypes[i1]].drawImage(
                                this.screenY - 12,
                                this.screenX - 12
                            );
                            this.fontSmall.drawStringLeft(
                                /* valueOf */ new String((obj as Actor).hitDamages[i1]).toString(),
                                this.screenX,
                                this.screenY + 4,
                                0
                            );
                            this.fontSmall.drawStringLeft(
                                /* valueOf */ new String((obj as Actor).hitDamages[i1]).toString(),
                                this.screenX - 1,
                                this.screenY + 3,
                                16777215
                            );
                        }
                    }
                }
            }
        }
        for (let j: number = 0; j < this.anInt939; j++) {
            {
                const j1: number = this.anIntArray941[j];
                let k1: number = this.anIntArray942[j];
                const l1: number = this.anIntArray944[j];
                const i2: number = this.anIntArray943[j];
                let flag1: boolean = true;
                while (flag1) {
                    {
                        flag1 = false;
                        for (let j2: number = 0; j2 < j; j2++) {
                            if (
                                k1 + 2 > this.anIntArray942[j2] - this.anIntArray943[j2] &&
                                k1 - i2 < this.anIntArray942[j2] + 2 &&
                                j1 - l1 < this.anIntArray941[j2] + this.anIntArray944[j2] &&
                                j1 + l1 > this.anIntArray941[j2] - this.anIntArray944[j2] &&
                                this.anIntArray942[j2] - this.anIntArray943[j2] < k1
                            ) {
                                k1 = this.anIntArray942[j2] - this.anIntArray943[j2];
                                flag1 = true;
                            }
                        }
                    }
                }
                this.screenX = this.anIntArray941[j];
                this.screenY = this.anIntArray942[j] = k1;
                const s: string = this.aStringArray948[j];
                if (this.anInt998 === 0) {
                    let k2: number = 16776960;
                    if (this.anIntArray945[j] < 6) {
                        k2 = this.anIntArray842[this.anIntArray945[j]];
                    }
                    if (this.anIntArray945[j] === 6) {
                        k2 = this.anInt1138 % 20 >= 10 ? 16776960 : 16711680;
                    }
                    if (this.anIntArray945[j] === 7) {
                        k2 = this.anInt1138 % 20 >= 10 ? 65535 : 255;
                    }
                    if (this.anIntArray945[j] === 8) {
                        k2 = this.anInt1138 % 20 >= 10 ? 8454016 : 45056;
                    }
                    if (this.anIntArray945[j] === 9) {
                        const l2: number = 150 - this.anIntArray947[j];
                        if (l2 < 50) {
                            k2 = 16711680 + 1280 * l2;
                        } else if (l2 < 100) {
                            k2 = 16776960 - 327680 * (l2 - 50);
                        } else if (l2 < 150) {
                            k2 = 65280 + 5 * (l2 - 100);
                        }
                    }
                    if (this.anIntArray945[j] === 10) {
                        const i3: number = 150 - this.anIntArray947[j];
                        if (i3 < 50) {
                            k2 = 16711680 + 5 * i3;
                        } else if (i3 < 100) {
                            k2 = 16711935 - 327680 * (i3 - 50);
                        } else if (i3 < 150) {
                            k2 = 255 + 327680 * (i3 - 100) - 5 * (i3 - 100);
                        }
                    }
                    if (this.anIntArray945[j] === 11) {
                        const j3: number = 150 - this.anIntArray947[j];
                        if (j3 < 50) {
                            k2 = 16777215 - 327685 * j3;
                        } else if (j3 < 100) {
                            k2 = 65280 + 327685 * (j3 - 50);
                        } else if (j3 < 150) {
                            k2 = 16777215 - 327680 * (j3 - 100);
                        }
                    }
                    if (this.anIntArray946[j] === 0) {
                        this.fontBold.drawStringLeft(s, this.screenX, this.screenY + 1, 0);
                        this.fontBold.drawStringLeft(s, this.screenX, this.screenY, k2);
                    }
                    if (this.anIntArray946[j] === 1) {
                        this.fontBold.drawCenteredStringWaveY(s, this.screenX, this.screenY + 1, this.anInt1138, 0);
                        this.fontBold.drawCenteredStringWaveY(s, this.screenX, this.screenY, this.anInt1138, k2);
                    }
                    if (this.anIntArray946[j] === 2) {
                        this.fontBold.drawCeneteredStringWaveXY(s, this.screenX, this.screenY + 1, this.anInt1138, 0);
                        this.fontBold.drawCeneteredStringWaveXY(s, this.screenX, this.screenY, this.anInt1138, k2);
                    }
                    if (this.anIntArray946[j] === 3) {
                        this.fontBold.drawCenteredStringWaveXYMove(
                            s,
                            this.screenX,
                            this.screenY + 1,
                            this.anInt1138,
                            150 - this.anIntArray947[j],
                            0
                        );
                        this.fontBold.drawCenteredStringWaveXYMove(
                            s,
                            this.screenX,
                            this.screenY,
                            this.anInt1138,
                            150 - this.anIntArray947[j],
                            k2
                        );
                    }
                    if (this.anIntArray946[j] === 4) {
                        const k3: number = this.fontBold.getStringWidth(s);
                        const i4: number = (((150 - this.anIntArray947[j]) * (k3 + 100)) / 150) | 0;
                        Rasterizer.setCoordinates(0, this.screenX - 50, 334, this.screenX + 50);
                        this.fontBold.drawString(s, this.screenX + 50 - i4, this.screenY + 1, 0);
                        this.fontBold.drawString(s, this.screenX + 50 - i4, this.screenY, k2);
                        Rasterizer.resetCoordinates();
                    }
                    if (this.anIntArray946[j] === 5) {
                        const l3: number = 150 - this.anIntArray947[j];
                        let j4: number = 0;
                        if (l3 < 25) {
                            j4 = l3 - 25;
                        } else if (l3 > 125) {
                            j4 = l3 - 125;
                        }
                        Rasterizer.setCoordinates(this.screenY - this.fontBold.characterDefaultHeight - 1, 0, this.screenY + 5, 512);
                        this.fontBold.drawStringLeft(s, this.screenX, this.screenY + 1 + j4, 0);
                        this.fontBold.drawStringLeft(s, this.screenX, this.screenY + j4, k2);
                        Rasterizer.resetCoordinates();
                    }
                } else {
                    this.fontBold.drawStringLeft(s, this.screenX, this.screenY + 1, 0);
                    this.fontBold.drawStringLeft(s, this.screenX, this.screenY, 16776960);
                }
            }
        }
        if (flag) {
            this.opcode = -1;
        }
    }

    public actorWorldToScreen(actor: Actor, modelHeight: number) {
        this.worldToScreen(actor.worldX, modelHeight, actor.worldY);
    }

    public worldToScreen(worldX: number, worldZ: number, worldY: number) {
        if (worldX < 128 || worldY < 128 || worldX > 13056 || worldY > 13056) {
            this.screenX = -1;
            this.screenY = -1;
            return;
        }
        let i1: number = this.getTileHeight(worldY, worldX, 9, this.plane) - worldZ;
        worldX -= this.cameraX;
        i1 -= this.cameraZ;
        worldY -= this.cameraY;
        const j1: number = Model.SINE[this.cameraPitch];
        const k1: number = Model.COSINE[this.cameraPitch];
        const l1: number = Model.SINE[this.cameraYaw];
        const i2: number = Model.COSINE[this.cameraYaw];
        let j2: number = (worldY * l1 + worldX * i2) >> 16;
        worldY = (worldY * i2 - worldX * l1) >> 16;
        worldX = j2;
        j2 = (i1 * k1 - worldY * j1) >> 16;
        worldY = (i1 * j1 + worldY * k1) >> 16;

        i1 = j2;
        if (worldY >= 50) {
            this.screenX = Rasterizer3D.centerX + (((worldX << 9) / worldY) | 0);
            this.screenY = Rasterizer3D.centerY + (((i1 << 9) / worldY) | 0);
            return;
        } else {
            this.screenX = -1;
            this.screenY = -1;
            return;
        }
    }

    public processPlayerAdditions(priority: boolean) {
        if (Game.localPlayer.worldX >> 7 === this.destinationX && Game.localPlayer.worldY >> 7 === this.destinationY) {
            this.destinationX = 0;
        }
        let count: number = this.localPlayerCount;
        if (priority) {
            count = 1;
        }
        for (let index: number = 0; index < count; index++) {
            {
                let player: Player;
                let key: number;
                if (priority) {
                    player = Game.localPlayer;
                    key = this.thisPlayerId << 14;
                } else {
                    player = this.players[this.playerList[index]];
                    key = this.playerList[index] << 14;
                }
                if (player == null || !player.isVisible()) {
                    continue;
                }
                player.aBoolean1763 = false;
                if (
                    ((Game.lowMemory && this.localPlayerCount > 50) || this.localPlayerCount > 200) &&
                    !priority &&
                    player.movementAnimation === player.idleAnimation
                ) {
                    player.aBoolean1763 = true;
                }
                const viewportX: number = player.worldX >> 7;
                const viewportY: number = player.worldY >> 7;
                if (viewportX < 0 || viewportX >= 104 || viewportY < 0 || viewportY >= 104) {
                    continue;
                }
                if (
                    player.playerModel != null &&
                    Game.pulseCycle >= player.objectAppearanceStartTick &&
                    Game.pulseCycle < player.objectAppearanceEndTick
                ) {
                    player.aBoolean1763 = false;
                    player.anInt1750 = this.getTileHeight(player.worldY, player.worldX, (9 as number) | 0, this.plane);
                    this.currentScene.addRenderable(
                        player.anInt1750,
                        player.anInt1769,
                        60,
                        7,
                        player,
                        player.anInt1768,
                        player.worldY,
                        player.anInt1771,
                        player.worldX,
                        player.anInt1612,
                        player.anInt1770,
                        this.plane,
                        key
                    );
                    continue;
                }
                if ((player.worldX & 127) === 64 && (player.worldY & 127) === 64) {
                    if (this.anIntArrayArray886[viewportX][viewportY] === this.anInt1138) {
                        continue;
                    }
                    this.anIntArrayArray886[viewportX][viewportY] = this.anInt1138;
                }
                player.anInt1750 = this.getTileHeight(player.worldY, player.worldX, (9 as number) | 0, this.plane);
                this.currentScene.addEntity(
                    key,
                    player,
                    player.worldX,
                    player.anInt1750,
                    player.aBoolean1592,
                    0,
                    this.plane,
                    60,
                    player.worldY,
                    player.anInt1612
                );
            }
        }
    }

    /*private*/ public drawMenuTooltip() {
        if (this.menuActionRow < 2 && this.itemSelected === 0 && this.widgetSelected === 0) {
            return;
        }
        let str: string;
        if (this.itemSelected === 1 && this.menuActionRow < 2) {
            str = "Use " + this.aString1150 + " with...";
        } else if (this.widgetSelected === 1 && this.menuActionRow < 2) {
            str = this.selectedWidgetName + "...";
        } else {
            str = this.menuActionTexts[this.menuActionRow - 1];
        }
        if (this.menuActionRow > 2) {
            str = str + "@whi@ / " + (this.menuActionRow - 2) + " more options";
        }
        this.fontBold.drawShadowedSeededAlphaString(str, 4, 15, 16777215, (Game.pulseCycle / 1000) | 0);
    }

    public method142(i: number, j: number, class13: Widget, k: number, l: number) {
        if (class13.type !== 0 || class13.children == null) {
            return;
        }
        if (class13.hiddenUntilHovered && this.anInt1302 !== class13.id && this.anInt1280 !== class13.id && this.anInt1106 !== class13.id) {
            return;
        }
        const i1: number = Rasterizer.topX;
        const j1: number = Rasterizer.topY;
        const k1: number = Rasterizer.bottomX;
        const l1: number = Rasterizer.bottomY;
        Rasterizer.setCoordinates(i, j, i + class13.height, j + class13.width);
        const i2: number = class13.children.length;
        if (l !== 8) {
            this.opcode = -1;
        }
        for (let j2: number = 0; j2 < i2; j2++) {
            {
                let k2: number = class13.childrenX[j2] + j;
                let l2: number = class13.childrenY[j2] + i - k;
                const child: Widget = Widget.forId(class13.children[j2]);
                k2 += child.anInt228;
                l2 += child.anInt259;
                if (child.contentType > 0) {
                    this.method103((2 as number) | 0, child);
                }
                if (child.type === 0) {
                    if (child.anInt231 > child.scrollLimit - child.height) {
                        child.anInt231 = child.scrollLimit - child.height;
                    }
                    if (child.anInt231 < 0) {
                        child.anInt231 = 0;
                    }
                    this.method142(l2, k2, child, child.anInt231, 8);
                    if (child.scrollLimit > child.height) {
                        this.method56(true, child.anInt231, k2 + child.width, child.height, child.scrollLimit, l2);
                    }
                } else if (child.type !== 1) {
                    if (child.type === 2) {
                        let i3: number = 0;
                        for (let i4: number = 0; i4 < child.height; i4++) {
                            {
                                for (let j5: number = 0; j5 < child.width; j5++) {
                                    {
                                        let i6: number = k2 + j5 * (32 + child.itemSpritePadsX);
                                        let l6: number = l2 + i4 * (32 + child.itemSpritePadsY);
                                        if (i3 < 20) {
                                            i6 += child.imageX[i3];
                                            l6 += child.imageY[i3];
                                        }
                                        if (child.items[i3] > 0) {
                                            let i7: number = 0;
                                            let j8: number = 0;
                                            const l10: number = child.items[i3] - 1;
                                            if (
                                                (i6 > Rasterizer.topX - 32 &&
                                                    i6 < Rasterizer.bottomX &&
                                                    l6 > Rasterizer.topY - 32 &&
                                                    l6 < Rasterizer.bottomY) ||
                                                (this.activeInterfaceType !== 0 && this.selectedInventorySlot === i3)
                                            ) {
                                                let k11: number = 0;
                                                if (this.itemSelected === 1 && this.anInt1147 === i3 && this.anInt1148 === child.id) {
                                                    k11 = 16777215;
                                                }
                                                const class50_sub1_sub1_sub1_2: ImageRGB = ItemDefinition.sprite(
                                                    l10,
                                                    child.itemAmounts[i3],
                                                    k11
                                                );
                                                if (class50_sub1_sub1_sub1_2 != null) {
                                                    if (
                                                        this.activeInterfaceType !== 0 &&
                                                        this.selectedInventorySlot === i3 &&
                                                        this.modifiedWidgetId === child.id
                                                    ) {
                                                        i7 = this.mouseX - this.anInt1114;
                                                        j8 = this.mouseY - this.anInt1115;
                                                        if (i7 < 5 && i7 > -5) {
                                                            i7 = 0;
                                                        }
                                                        if (j8 < 5 && j8 > -5) {
                                                            j8 = 0;
                                                        }
                                                        if (this.anInt1269 < 5) {
                                                            i7 = 0;
                                                            j8 = 0;
                                                        }
                                                        class50_sub1_sub1_sub1_2.drawImageAlpha(i6 + i7, l6 + j8, 128);
                                                        if (l6 + j8 < Rasterizer.topY && class13.anInt231 > 0) {
                                                            let i12: number = ((this.tickDelta * (Rasterizer.topY - l6 - j8)) / 3) | 0;
                                                            if (i12 > this.tickDelta * 10) {
                                                                i12 = this.tickDelta * 10;
                                                            }
                                                            if (i12 > class13.anInt231) {
                                                                i12 = class13.anInt231;
                                                            }
                                                            class13.anInt231 -= i12;
                                                            this.anInt1115 += i12;
                                                        }
                                                        if (
                                                            l6 + j8 + 32 > Rasterizer.bottomY &&
                                                            class13.anInt231 < class13.scrollLimit - class13.height
                                                        ) {
                                                            let j12: number =
                                                                ((this.tickDelta * (l6 + j8 + 32 - Rasterizer.bottomY)) / 3) | 0;
                                                            if (j12 > this.tickDelta * 10) {
                                                                j12 = this.tickDelta * 10;
                                                            }
                                                            if (j12 > class13.scrollLimit - class13.height - class13.anInt231) {
                                                                j12 = class13.scrollLimit - class13.height - class13.anInt231;
                                                            }
                                                            class13.anInt231 += j12;
                                                            this.anInt1115 -= j12;
                                                        }
                                                    } else if (
                                                        this.atInventoryInterfaceType !== 0 &&
                                                        this.anInt1331 === i3 &&
                                                        this.anInt1330 === child.id
                                                    ) {
                                                        class50_sub1_sub1_sub1_2.drawImageAlpha(i6, l6, 128);
                                                    } else {
                                                        class50_sub1_sub1_sub1_2.drawImage(l6, i6);
                                                    }
                                                    if (class50_sub1_sub1_sub1_2.maxWidth === 33 || child.itemAmounts[i3] !== 1) {
                                                        const k12: number = child.itemAmounts[i3];
                                                        this.fontSmall.drawString(
                                                            Game.getShortenedAmountText(k12),
                                                            i6 + 1 + i7,
                                                            l6 + 10 + j8,
                                                            0
                                                        );
                                                        this.fontSmall.drawString(
                                                            Game.getShortenedAmountText(k12),
                                                            i6 + i7,
                                                            l6 + 9 + j8,
                                                            16776960
                                                        );
                                                    }
                                                }
                                            }
                                        } else if (child.images != null && i3 < 20) {
                                            const class50_sub1_sub1_sub1_1: ImageRGB = child.images[i3];
                                            if (class50_sub1_sub1_sub1_1 != null) {
                                                class50_sub1_sub1_sub1_1.drawImage(l6, i6);
                                            }
                                        }
                                        i3++;
                                    }
                                }
                            }
                        }
                    } else if (child.type === 3) {
                        let flag: boolean = false;
                        if (this.anInt1106 === child.id || this.anInt1280 === child.id || this.anInt1302 === child.id) {
                            flag = true;
                        }
                        let j3: number;
                        if (this.method95(child, -693)) {
                            j3 = child.enabledColor;
                            if (flag && child.enabledHoveredColor !== 0) {
                                j3 = child.enabledHoveredColor;
                            }
                        } else {
                            j3 = child.disabledColor;
                            if (flag && child.disabledHoveredColor !== 0) {
                                j3 = child.disabledHoveredColor;
                            }
                        }
                        if (child.alpha === 0) {
                            if (child.filled) {
                                Rasterizer.drawFilledRectangle(k2, l2, child.width, child.height, j3);
                            } else {
                                Rasterizer.drawUnfilledRectangle(k2, l2, child.width, child.height, j3);
                            }
                        } else if (child.filled) {
                            Rasterizer.drawFilledRectangleAlhpa(k2, l2, child.width, child.height, j3, 256 - (child.alpha & 255));
                        } else {
                            Rasterizer.drawUnfilledRectangleAlpha(k2, l2, child.width, child.height, j3, 256 - (child.alpha & 255));
                        }
                    } else if (child.type === 4) {
                        const class50_sub1_sub1_sub2: TypeFace = child.typeFaces;
                        let s: string = child.disabledText;
                        let flag1: boolean = false;
                        if (this.anInt1106 === child.id || this.anInt1280 === child.id || this.anInt1302 === child.id) {
                            flag1 = true;
                        }
                        let j4: number;
                        if (this.method95(child, -693)) {
                            j4 = child.enabledColor;
                            if (flag1 && child.enabledHoveredColor !== 0) {
                                j4 = child.enabledHoveredColor;
                            }
                            if (child.enabledText.length > 0) {
                                s = child.enabledText;
                            }
                        } else {
                            j4 = child.disabledColor;
                            if (flag1 && child.disabledHoveredColor !== 0) {
                                j4 = child.disabledHoveredColor;
                            }
                        }
                        if (child.actionType === 6 && this.aBoolean1239) {
                            s = "Please wait...";
                            j4 = child.disabledColor;
                        }
                        if (Rasterizer.width === 479) {
                            if (j4 === 16776960) {
                                j4 = 255;
                            }
                            if (j4 === 49152) {
                                j4 = 16777215;
                            }
                        }
                        for (
                            let j7: number = l2 + class50_sub1_sub1_sub2.characterDefaultHeight;
                            s.length > 0;
                            j7 += class50_sub1_sub1_sub2.characterDefaultHeight
                        ) {
                            {
                                if (s.indexOf("%") !== -1) {
                                    do {
                                        {
                                            const k8: number = s.indexOf("%1");
                                            if (k8 === -1) {
                                                break;
                                            }
                                            s = s.substring(0, k8) + this.method89(this.method129(3, 0, child), 8) + s.substring(k8 + 2);
                                        }
                                    } while (true);
                                    do {
                                        {
                                            const l8: number = s.indexOf("%2");
                                            if (l8 === -1) {
                                                break;
                                            }
                                            s = s.substring(0, l8) + this.method89(this.method129(3, 1, child), 8) + s.substring(l8 + 2);
                                        }
                                    } while (true);
                                    do {
                                        {
                                            const i9: number = s.indexOf("%3");
                                            if (i9 === -1) {
                                                break;
                                            }
                                            s = s.substring(0, i9) + this.method89(this.method129(3, 2, child), 8) + s.substring(i9 + 2);
                                        }
                                    } while (true);
                                    do {
                                        {
                                            const j9: number = s.indexOf("%4");
                                            if (j9 === -1) {
                                                break;
                                            }
                                            s = s.substring(0, j9) + this.method89(this.method129(3, 3, child), 8) + s.substring(j9 + 2);
                                        }
                                    } while (true);
                                    do {
                                        {
                                            const k9: number = s.indexOf("%5");
                                            if (k9 === -1) {
                                                break;
                                            }
                                            s = s.substring(0, k9) + this.method89(this.method129(3, 4, child), 8) + s.substring(k9 + 2);
                                        }
                                    } while (true);
                                }
                                const l9: number = s.indexOf("\\n");
                                let s3: string;
                                if (l9 !== -1) {
                                    s3 = s.substring(0, l9);
                                    s = s.substring(l9 + 2);
                                } else {
                                    s3 = s;
                                    s = "";
                                }
                                if (child.typeFaceCentered) {
                                    class50_sub1_sub1_sub2.drawStringCenter(
                                        s3,
                                        k2 + ((child.width / 2) | 0),
                                        j7,
                                        j4,
                                        child.typeFaceShadowed
                                    );
                                } else {
                                    class50_sub1_sub1_sub2.drawShadowedString(s3, k2, j7, child.typeFaceShadowed, j4);
                                }
                            }
                        }
                    } else if (child.type === 5) {
                        let class50_sub1_sub1_sub1: ImageRGB;
                        if (this.method95(child, -693)) {
                            class50_sub1_sub1_sub1 = child.enabledImage;
                        } else {
                            class50_sub1_sub1_sub1 = child.disabledImage;
                        }
                        switch (child.id) {
                            case 1164:
                            case 1167:
                            case 1170:
                            case 1174:
                            case 1540:
                            case 1541:
                            case 7455:
                                class50_sub1_sub1_sub1 = child.enabledImage;
                                break;
                            default:
                                break;
                        }
                        if (class50_sub1_sub1_sub1 != null) {
                            class50_sub1_sub1_sub1.drawImage(l2, k2);
                        }
                    } else if (child.type === 6) {
                        const k3: number = Rasterizer3D.centerX;
                        const k4: number = Rasterizer3D.centerY;
                        Rasterizer3D.centerX = k2 + ((child.width / 2) | 0);
                        Rasterizer3D.centerY = l2 + ((child.height / 2) | 0);
                        const k5: number = (Rasterizer3D.SINE[child.rotationX] * child.zoom) >> 16;
                        const j6: number = (Rasterizer3D.COSINE[child.rotationX] * child.zoom) >> 16;
                        const flag2: boolean = this.method95(child, -693);
                        let k7: number;
                        if (flag2) {
                            k7 = child.enabledAnimation;
                        } else {
                            k7 = child.disabledAnimation;
                        }
                        let class50_sub1_sub4_sub4: Model;
                        if (k7 === -1) {
                            class50_sub1_sub4_sub4 = child.getAnimatedModel(-1, -1, flag2);
                        } else {
                            const class14: AnimationSequence = AnimationSequence.animations[k7];
                            class50_sub1_sub4_sub4 = child.getAnimatedModel(
                                class14.frame1Ids[child.anInt235],
                                class14.getPrimaryFrame[child.anInt235],
                                flag2
                            );
                        }
                        if (class50_sub1_sub4_sub4 != null) {
                            class50_sub1_sub4_sub4.render(0, child.rotationY, 0, child.rotationX, 0, k5, j6);
                        }
                        Rasterizer3D.centerX = k3;
                        Rasterizer3D.centerY = k4;
                    } else {
                        if (child.type === 7) {
                            const class50_sub1_sub1_sub2_1: TypeFace = child.typeFaces;
                            let l4: number = 0;
                            for (let l5: number = 0; l5 < child.height; l5++) {
                                {
                                    for (let k6: number = 0; k6 < child.width; k6++) {
                                        {
                                            if (child.items[l4] > 0) {
                                                const class16: ItemDefinition = ItemDefinition.lookup(child.items[l4] - 1);
                                                let s6: string = /* valueOf */ new String(class16.name).toString();
                                                if (class16.stackable || child.itemAmounts[l4] !== 1) {
                                                    s6 = s6 + " x" + Game.getFullAmountText(child.itemAmounts[l4]);
                                                }
                                                const i10: number = k2 + k6 * (115 + child.itemSpritePadsX);
                                                const i11: number = l2 + l5 * (12 + child.itemSpritePadsY);
                                                if (child.typeFaceCentered) {
                                                    class50_sub1_sub1_sub2_1.drawStringCenter(
                                                        s6,
                                                        i10 + ((child.width / 2) | 0),
                                                        i11,
                                                        child.disabledColor,
                                                        child.typeFaceShadowed
                                                    );
                                                } else {
                                                    class50_sub1_sub1_sub2_1.drawShadowedString(
                                                        s6,
                                                        i10,
                                                        i11,
                                                        child.typeFaceShadowed,
                                                        child.disabledColor
                                                    );
                                                }
                                            }
                                            l4++;
                                        }
                                    }
                                }
                            }
                        }
                        if (
                            child.type === 8 &&
                            (this.anInt1284 === child.id || this.anInt1044 === child.id || this.anInt1129 === child.id) &&
                            this.anInt893 === 100
                        ) {
                            let l3: number = 0;
                            let i5: number = 0;
                            const class50_sub1_sub1_sub2_2: TypeFace = this.fontNormal;
                            for (let s1: string = child.disabledText; s1.length > 0; ) {
                                {
                                    const l7: number = s1.indexOf("\\n");
                                    let s4: string;
                                    if (l7 !== -1) {
                                        s4 = s1.substring(0, l7);
                                        s1 = s1.substring(l7 + 2);
                                    } else {
                                        s4 = s1;
                                        s1 = "";
                                    }
                                    const j10: number = class50_sub1_sub1_sub2_2.getStringEffectWidth(s4);
                                    if (j10 > l3) {
                                        l3 = j10;
                                    }
                                    i5 += class50_sub1_sub1_sub2_2.characterDefaultHeight + 1;
                                }
                            }
                            l3 += 6;
                            i5 += 7;
                            let i8: number = k2 + child.width - 5 - l3;
                            let k10: number = l2 + child.height + 5;
                            if (i8 < k2 + 5) {
                                i8 = k2 + 5;
                            }
                            if (i8 + l3 > j + class13.width) {
                                i8 = j + class13.width - l3;
                            }
                            if (k10 + i5 > i + class13.height) {
                                k10 = i + class13.height - i5;
                            }
                            Rasterizer.drawFilledRectangle(i8, k10, l3, i5, 16777120);
                            Rasterizer.drawUnfilledRectangle(i8, k10, l3, i5, 0);
                            let s2: string = child.disabledText;
                            for (
                                let j11: number = k10 + class50_sub1_sub1_sub2_2.characterDefaultHeight + 2;
                                s2.length > 0;
                                j11 += class50_sub1_sub1_sub2_2.characterDefaultHeight + 1
                            ) {
                                {
                                    const l11: number = s2.indexOf("\\n");
                                    let s5: string;
                                    if (l11 !== -1) {
                                        s5 = s2.substring(0, l11);
                                        s2 = s2.substring(l11 + 2);
                                    } else {
                                        s5 = s2;
                                        s2 = "";
                                    }
                                    class50_sub1_sub1_sub2_2.drawShadowedString(s5, i8 + 3, j11, false, 0);
                                }
                            }
                        }
                    }
                }
            }
        }
        Rasterizer.setCoordinates(j1, i1, l1, k1);
    }

    public method89(i: number, j: number): string {
        if (j < 8 || j > 8) {
            throw Error("NullPointerException");
        }
        if (i < 999999999) {
            return /* valueOf */ new String(i).toString();
        } else {
            return "*";
        }
    }

    public method56(flag: boolean, i: number, j: number, k: number, l: number, i1: number) {
        this.scrollbarUp.drawImage(j, i1);
        this.scrollbarDown.drawImage(j, i1 + k - 16);
        Rasterizer.drawFilledRectangle(j, i1 + 16, 16, k - 32, this.anInt931);
        let j1: number = (((k - 32) * k) / l) | 0;
        if (j1 < 8) {
            j1 = 8;
        }
        const k1: number = (((k - 32 - j1) * i) / (l - k)) | 0;
        Rasterizer.drawFilledRectangle(j, i1 + 16 + k1, 16, j1, this.anInt1080);
        Rasterizer.drawVerticalLine(j, i1 + 16 + k1, j1, this.anInt1135);
        Rasterizer.drawVerticalLine(j + 1, i1 + 16 + k1, j1, this.anInt1135);
        if (!flag) {
            this.anInt921 = -136;
        }
        Rasterizer.drawHorizontalLine(j, i1 + 16 + k1, 16, this.anInt1135);
        Rasterizer.drawHorizontalLine(j, i1 + 17 + k1, 16, this.anInt1135);
        Rasterizer.drawVerticalLine(j + 15, i1 + 16 + k1, j1, this.anInt1287);
        Rasterizer.drawVerticalLine(j + 14, i1 + 17 + k1, j1 - 1, this.anInt1287);
        Rasterizer.drawHorizontalLine(j, i1 + 15 + k1 + j1, 16, this.anInt1287);
        Rasterizer.drawHorizontalLine(j + 1, i1 + 14 + k1 + j1, 15, this.anInt1287);
    }

    public method103(byte0: number, class13: Widget) {
        if (byte0 === 2) {
            byte0 = 0;
        } else {
            this.anInt1004 = -82;
        }
        let i: number = class13.contentType;
        if ((i >= 1 && i <= 100) || (i >= 701 && i <= 800)) {
            if (i === 1 && this.friendListStatus === 0) {
                class13.disabledText = "Loading friend list";
                class13.actionType = 0;
                return;
            }
            if (i === 1 && this.friendListStatus === 1) {
                class13.disabledText = "Connecting to friendserver";
                class13.actionType = 0;
                return;
            }
            if (i === 2 && this.friendListStatus !== 2) {
                class13.disabledText = "Please wait...";
                class13.actionType = 0;
                return;
            }
            let j: number = this.friendsCount;
            if (this.friendListStatus !== 2) {
                j = 0;
            }
            if (i > 700) {
                i -= 601;
            } else {
                i--;
            }
            if (i >= j) {
                class13.disabledText = "";
                class13.actionType = 0;
                return;
            } else {
                class13.disabledText = this.friendUsernames[i];
                class13.actionType = 1;
                return;
            }
        }
        if ((i >= 101 && i <= 200) || (i >= 801 && i <= 900)) {
            let k: number = this.friendsCount;
            if (this.friendListStatus !== 2) {
                k = 0;
            }
            if (i > 800) {
                i -= 701;
            } else {
                i -= 101;
            }
            if (i >= k) {
                class13.disabledText = "";
                class13.actionType = 0;
                return;
            }
            if (this.friendWorlds[i] === 0) {
                class13.disabledText = "@red@Offline";
            } else if (this.friendWorlds[i] < 200) {
                if (this.friendWorlds[i] === Game.world) {
                    class13.disabledText = "@gre@World" + (this.friendWorlds[i] - 9);
                } else {
                    class13.disabledText = "@yel@World" + (this.friendWorlds[i] - 9);
                }
            } else if (this.friendWorlds[i] === Game.world) {
                class13.disabledText = "@gre@Classic" + (this.friendWorlds[i] - 219);
            } else {
                class13.disabledText = "@yel@Classic" + (this.friendWorlds[i] - 219);
            }
            class13.actionType = 1;
            return;
        }
        if (i === 203) {
            let l: number = this.friendsCount;
            if (this.friendListStatus !== 2) {
                l = 0;
            }
            class13.scrollLimit = l * 15 + 20;
            if (class13.scrollLimit <= class13.height) {
                class13.scrollLimit = class13.height + 1;
            }
            return;
        }
        if (i >= 401 && i <= 500) {
            if ((i -= 401) === 0 && this.friendListStatus === 0) {
                class13.disabledText = "Loading ignore list";
                class13.actionType = 0;
                return;
            }
            if (i === 1 && this.friendListStatus === 0) {
                class13.disabledText = "Please wait...";
                class13.actionType = 0;
                return;
            }
            let i1: number = this.ignoresCount;
            if (this.friendListStatus === 0) {
                i1 = 0;
            }
            if (i >= i1) {
                class13.disabledText = "";
                class13.actionType = 0;
                return;
            } else {
                class13.disabledText = TextUtils.formatName(TextUtils.longToName(this.ignores[i]));
                class13.actionType = 1;
                return;
            }
        }
        if (i === 503) {
            class13.scrollLimit = this.ignoresCount * 15 + 20;
            if (class13.scrollLimit <= class13.height) {
                class13.scrollLimit = class13.height + 1;
            }
            return;
        }
        if (i === 327) {
            class13.rotationX = 150;
            class13.rotationY = (((Math.sin((Game.pulseCycle as number) / 40.0) * 256.0) as number) | 0) & 2047;
            if (this.aBoolean1277) {
                for (let j1: number = 0; j1 < 7; j1++) {
                    {
                        const i2: number = this.characterEditIdentityKits[j1];
                        if (i2 >= 0 && !IdentityKit.cache[i2].isBodyModelCached()) {
                            return;
                        }
                    }
                }
                this.aBoolean1277 = false;
                const aclass50_sub1_sub4_sub4: Model[] = [null, null, null, null, null, null, null];
                let j2: number = 0;
                for (let k2: number = 0; k2 < 7; k2++) {
                    {
                        const l2: number = this.characterEditIdentityKits[k2];
                        if (l2 >= 0) {
                            aclass50_sub1_sub4_sub4[j2++] = IdentityKit.cache[l2].getBodyModel();
                        }
                    }
                }
                const class50_sub1_sub4_sub4: Model = new Model(j2, aclass50_sub1_sub4_sub4);
                for (let i3: number = 0; i3 < 5; i3++) {
                    if (this.characterEditColors[i3] !== 0) {
                        class50_sub1_sub4_sub4.replaceColor(
                            Game.playerColours[i3][0],
                            Game.playerColours[i3][this.characterEditColors[i3]]
                        );
                        if (i3 === 1) {
                            class50_sub1_sub4_sub4.replaceColor(Game.SKIN_COLOURS[0], Game.SKIN_COLOURS[this.characterEditColors[i3]]);
                        }
                    }
                }
                class50_sub1_sub4_sub4.createBones();
                class50_sub1_sub4_sub4.applyTransform(AnimationSequence.animations[Game.localPlayer.idleAnimation].getPrimaryFrame[0]);
                class50_sub1_sub4_sub4.applyLighting(64, 850, -30, -50, -30, true);
                class13.modelType = 5;
                class13.modelId = 0;
                Widget.setModel(5, class50_sub1_sub4_sub4, 0);
            }
            return;
        }
        if (i === 324) {
            if (this.aClass50_Sub1_Sub1_Sub1_1102 == null) {
                this.aClass50_Sub1_Sub1_Sub1_1102 = class13.disabledImage;
                this.aClass50_Sub1_Sub1_Sub1_1103 = class13.enabledImage;
            }
            if (this.characterEditChangeGenger) {
                class13.disabledImage = this.aClass50_Sub1_Sub1_Sub1_1103;
                return;
            } else {
                class13.disabledImage = this.aClass50_Sub1_Sub1_Sub1_1102;
                return;
            }
        }
        if (i === 325) {
            if (this.aClass50_Sub1_Sub1_Sub1_1102 == null) {
                this.aClass50_Sub1_Sub1_Sub1_1102 = class13.disabledImage;
                this.aClass50_Sub1_Sub1_Sub1_1103 = class13.enabledImage;
            }
            if (this.characterEditChangeGenger) {
                class13.disabledImage = this.aClass50_Sub1_Sub1_Sub1_1102;
                return;
            } else {
                class13.disabledImage = this.aClass50_Sub1_Sub1_Sub1_1103;
                return;
            }
        }
        if (i === 600) {
            class13.disabledText = this.reportedName;
            if (Game.pulseCycle % 20 < 10) {
                class13.disabledText += "|";
                return;
            } else {
                class13.disabledText += " ";
                return;
            }
        }
        if (i === 620) {
            if (this.playerRights >= 1) {
                if (this.reportMutePlayer) {
                    class13.disabledColor = 16711680;
                    class13.disabledText = "Moderator option: Mute player for 48 hours: <ON>";
                } else {
                    class13.disabledColor = 16777215;
                    class13.disabledText = "Moderator option: Mute player for 48 hours: <OFF>";
                }
            } else {
                class13.disabledText = "";
            }
        }
        if (i === 660) {
            const k1: number = this.anInt1170 - this.anInt1215;
            let s1: string;
            if (k1 <= 0) {
                s1 = "earlier today";
            } else if (k1 === 1) {
                s1 = "yesterday";
            } else {
                s1 = k1 + " days ago";
            }
            class13.disabledText = "You last logged in @red@" + s1 + "@bla@ from: @red@" + SignLink.dns;
        }
        if (i === 661) {
            if (this.anInt1034 === 0) {
                class13.disabledText =
                    "\\nYou have not yet set any recovery questions.\\nIt is @lre@strongly@yel@ recommended that you do so.\\n\\nIf you don't you will be @lre@unable to recover your\\n@lre@password@yel@ if you forget it, or it is stolen.";
            } else if (this.anInt1034 <= this.anInt1170) {
                class13.disabledText = "\\n\\nRecovery Questions Last Set:\\n@gre@" + this.getDate(this.anInt1034);
            } else {
                const l1: number = this.anInt1170 + 14 - this.anInt1034;
                let s2: string;
                if (l1 <= 0) {
                    s2 = "Earlier today";
                } else if (l1 === 1) {
                    s2 = "Yesterday";
                } else {
                    s2 = l1 + " days ago";
                }
                class13.disabledText =
                    s2 +
                    " you requested@lre@ new recovery\\n@lre@questions.@yel@ The requested change will occur\\non: @lre@" +
                    this.getDate(this.anInt1034) +
                    "\\n\\nIf you do not remember making this request\\ncancel it immediately, and change your password.";
            }
        }
        if (i === 662) {
            let s: string;
            if (this.anInt1273 === 0) {
                s = "@yel@0 unread messages";
            } else if (this.anInt1273 === 1) {
                s = "@gre@1 unread message";
            } else {
                s = "@gre@" + this.anInt1273 + " unread messages";
            }
            class13.disabledText = "You have " + s + "\\nin your message centre.";
        }
        if (i === 663) {
            if (this.anInt1083 <= 0 || this.anInt1083 > this.anInt1170 + 10) {
                class13.disabledText = "Last password change:\\n@gre@Never changed";
            } else {
                class13.disabledText = "Last password change:\\n@gre@" + this.getDate(this.anInt1083);
            }
        }
        if (i === 665) {
            if (this.anInt992 > 2 && !Game.memberServer) {
                class13.disabledText =
                    "This is a non-members\\nworld. To enjoy your\\nmembers benefits we\\nrecommend you play on a\\nmembers world instead.";
            } else if (this.anInt992 > 2) {
                class13.disabledText = "\\n\\nYou have @gre@" + this.anInt992 + "@yel@ days of\\nmember credit remaining.";
            } else if (this.anInt992 > 0) {
                class13.disabledText =
                    "You have @gre@" +
                    this.anInt992 +
                    "@yel@ days of\\nmember credit remaining.\\n\\n@lre@Credit low! Renew now\\n@lre@to avoid losing members.";
            } else {
                class13.disabledText =
                    "You are not a member.\\n\\nChoose to subscribe and\\nyou'll get loads of extra\\nbenefits and features.";
            }
        }
        if (i === 667) {
            if (this.anInt992 > 2 && !Game.memberServer) {
                class13.disabledText =
                    "To switch to a members-only world:\\n1) Logout and return to the world selection page.\\n2) Choose one of the members world with a gold star next to it's name.\\n\\nIf you prefer you can continue to use this world,\\nbut members only features will be unavailable here.";
            } else if (this.anInt992 > 0) {
                class13.disabledText =
                    "To extend or cancel a subscription:\\n1) Logout and return to the frontpage of this website.\\n2)Choose the relevant option from the 'membership' section.\\n\\nNote: If you are a credit card subscriber a top-up payment will\\nautomatically be taken when 3 days credit remain.\\n(unless you cancel your subscription, which can be done at any time.)";
            } else {
                class13.disabledText =
                    "To initializeApplication a subscripton:\\n1) Logout and return to the frontpage of this website.\\n2) Choose 'Start a new subscription'";
            }
        }
        if (i === 668) {
            if (this.anInt1034 > this.anInt1170) {
                class13.disabledText =
                    "To cancel this request:\\n1) Logout and return to the frontpage of this website.\\n2) Choose 'Cancel recovery questions'.";
                return;
            }
            class13.disabledText =
                "To change your recovery questions:\\n1) Logout and return to the frontpage of this website.\\n2) Choose 'Set new recovery questions'.";
        }
    }

    /*private*/ public getDate(time: number): string {
        if (time > this.anInt1170 + 10) {
            return "Unknown";
        } else {
            const date: Date = new Date(((n => (n < 0 ? Math.ceil(n) : Math.floor(n)))(time as number) + 11745) * 86400000);
            const day = date.getDay();
            const month = date.getMonth();
            const year = date.getFullYear();
            const monthNames: string[] = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            return day + "-" + monthNames[month] + "-" + year;
        }
    }

    public method147(i: number) {
        if (this.imageProducer != null) {
            return;
        }
        this.method141();
        this.aClass18_1198 = null;
        this.aClass18_1199 = null;
        this.aClass18_1200 = null;
        if (i >= 0) {
            this.anInt1004 = -4;
        }
        this.flameLeftBackground = null;
        this.flameRightBackground = null;
        this.aClass18_1203 = null;
        this.aClass18_1204 = null;
        this.aClass18_1205 = null;
        this.aClass18_1206 = null;
        this.chatboxProducingGraphicsBuffer = null;
        this.aClass18_1157 = null;
        this.aClass18_1156 = null;
        this.aClass18_1158 = null;
        this.aClass18_1108 = null;
        this.aClass18_1109 = null;
        this.aClass18_1110 = null;
        this.imageProducer = new ProducingGraphicsBuffer(765, 503);
        this.aBoolean1046 = true;
    }

    public method88(i: number, j: number, byte0: number): boolean {
        let flag: boolean = false;
        const class13: Widget = Widget.forId(j);
        for (let k: number = 0; k < class13.children.length; k++) {
            {
                if (class13.children[k] === -1) {
                    break;
                }
                const class13_1: Widget = Widget.forId(class13.children[k]);
                if (class13_1.type === 0) {
                    flag = this.method88(i, class13_1.id, (5 as number) | 0) || flag;
                }
                if (class13_1.type === 6 && (class13_1.disabledAnimation !== -1 || class13_1.enabledAnimation !== -1)) {
                    const flag1: boolean = this.method95(class13_1, -693);
                    let i1: number;
                    if (flag1) {
                        i1 = class13_1.enabledAnimation;
                    } else {
                        i1 = class13_1.disabledAnimation;
                    }
                    if (i1 !== -1) {
                        const class14: AnimationSequence = AnimationSequence.animations[i1];
                        for (class13_1.anInt227 += i; class13_1.anInt227 > class14.getFrameLength(class13_1.anInt235); ) {
                            {
                                class13_1.anInt227 -= class14.getFrameLength(class13_1.anInt235);
                                class13_1.anInt235++;
                                if (class13_1.anInt235 >= class14.frameCount) {
                                    class13_1.anInt235 -= class14.frameStep;
                                    if (class13_1.anInt235 < 0 || class13_1.anInt235 >= class14.frameCount) {
                                        class13_1.anInt235 = 0;
                                    }
                                }
                                flag = true;
                            }
                        }
                    }
                }
                if (class13_1.type === 6 && class13_1.anInt218 !== 0) {
                    let l: number = class13_1.anInt218 >> 16;
                    let j1: number = (class13_1.anInt218 << 16) >> 16;
                    l *= i;
                    j1 *= i;
                    class13_1.rotationX = (class13_1.rotationX + l) & 2047;
                    class13_1.rotationY = (class13_1.rotationY + j1) & 2047;
                    flag = true;
                }
            }
        }
        if (byte0 === 5) {
            byte0 = 0;
        } else {
            this.anInt1236 = -424;
        }
        return flag;
    }

    public method95(class13: Widget, i: number): boolean {
        if (i >= 0) {
            this.anInt1175 = 276;
        }
        if (class13.conditionTypes == null) {
            return false;
        }
        for (let j: number = 0; j < class13.conditionTypes.length; j++) {
            {
                const k: number = this.method129(3, j, class13);
                const l: number = class13.conditionValues[j];
                if (class13.conditionTypes[j] === 2) {
                    if (k >= l) {
                        return false;
                    }
                } else if (class13.conditionTypes[j] === 3) {
                    if (k <= l) {
                        return false;
                    }
                } else if (class13.conditionTypes[j] === 4) {
                    if (k === l) {
                        return false;
                    }
                } else if (k !== l) {
                    return false;
                }
            }
        }
        return true;
    }

    public method129(i: number, j: number, class13: Widget): number {
        if (i !== 3) {
            return this.anInt1222;
        }
        if (class13.opcodes == null || j >= class13.opcodes.length) {
            return -2;
        }
        try {
            const ai: number[] = class13.opcodes[j];
            let k: number = 0;
            let l: number = 0;
            let i1: number = 0;
            do {
                {
                    const j1: number = ai[l++];
                    let k1: number = 0;
                    let byte0: number = 0;
                    if (j1 === 0) {
                        return k;
                    }
                    if (j1 === 1) {
                        k1 = this.anIntArray1029[ai[l++]];
                    }
                    if (j1 === 2) {
                        k1 = this.anIntArray1054[ai[l++]];
                    }
                    if (j1 === 3) {
                        k1 = this.anIntArray843[ai[l++]];
                    }
                    if (j1 === 4) {
                        const class13_1: Widget = Widget.forId(ai[l++]);
                        const k2: number = ai[l++];
                        if (k2 >= 0 && k2 < ItemDefinition.count && (!ItemDefinition.lookup(k2).members || Game.memberServer)) {
                            for (let j3: number = 0; j3 < class13_1.items.length; j3++) {
                                if (class13_1.items[j3] === k2 + 1) {
                                    k1 += class13_1.itemAmounts[j3];
                                }
                            }
                        }
                    }
                    if (j1 === 5) {
                        k1 = this.widgetSettings[ai[l++]];
                    }
                    if (j1 === 6) {
                        k1 = Game.SKILL_EXPERIENCE[this.anIntArray1054[ai[l++]] - 1];
                    }
                    if (j1 === 7) {
                        k1 = ((this.widgetSettings[ai[l++]] * 100) / 46875) | 0;
                    }
                    if (j1 === 8) {
                        k1 = Game.localPlayer.combatLevel;
                    }
                    if (j1 === 9) {
                        for (let l1: number = 0; l1 < SkillConstants.SKILL_COUNT; l1++) {
                            if (SkillConstants.SKILL_TOGGLES[l1]) {
                                k1 += this.anIntArray1054[l1];
                            }
                        }
                    }
                    if (j1 === 10) {
                        const class13_2: Widget = Widget.forId(ai[l++]);
                        const l2: number = ai[l++] + 1;
                        if (l2 >= 0 && l2 < ItemDefinition.count && (!ItemDefinition.lookup(l2).members || Game.memberServer)) {
                            for (let k3: number = 0; k3 < class13_2.items.length; k3++) {
                                {
                                    if (class13_2.items[k3] !== l2) {
                                        continue;
                                    }
                                    k1 = 999999999;
                                    break;
                                }
                            }
                        }
                    }
                    if (j1 === 11) {
                        k1 = this.anInt1324;
                    }
                    if (j1 === 12) {
                        k1 = this.anInt1030;
                    }
                    if (j1 === 13) {
                        const i2: number = this.widgetSettings[ai[l++]];
                        const i3: number = ai[l++];
                        k1 = (i2 & (1 << i3)) === 0 ? 0 : 1;
                    }
                    if (j1 === 14) {
                        const j2: number = ai[l++];
                        const class49: Varbit = Varbit.cache[j2];
                        const l3: number = class49.configId;
                        const i4: number = class49.leastSignificantBit;
                        const j4: number = class49.mostSignificantBit;
                        const k4: number = Game.BITFIELD_MAX_VALUE[j4 - i4];
                        k1 = (this.widgetSettings[l3] >> i4) & k4;
                    }
                    if (j1 === 15) {
                        byte0 = 1;
                    }
                    if (j1 === 16) {
                        byte0 = 2;
                    }
                    if (j1 === 17) {
                        byte0 = 3;
                    }
                    if (j1 === 18) {
                        k1 = (Game.localPlayer.worldX >> 7) + this.nextTopLeftTileX;
                    }
                    if (j1 === 19) {
                        k1 = (Game.localPlayer.worldY >> 7) + this.nextTopRightTileY;
                    }
                    if (j1 === 20) {
                        k1 = ai[l++];
                    }
                    if (byte0 === 0) {
                        if (i1 === 0) {
                            k += k1;
                        }
                        if (i1 === 1) {
                            k -= k1;
                        }
                        if (i1 === 2 && k1 !== 0) {
                            k = (n => (n < 0 ? Math.ceil(n) : Math.floor(n)))(k / k1);
                        }
                        if (i1 === 3) {
                            k *= k1;
                        }
                        i1 = 0;
                    } else {
                        i1 = byte0;
                    }
                }
            } while (true);
        } catch (_ex) {
            return -1;
        }
    }

    public async drawLoginScreen(flag: boolean) {
        await this.resetTitleScreen();
        this.aClass18_1200.createRasterizer();
        this.titleboxImage.drawImage(0, 0);
        const c: string = "\u0168";
        const c1: string = "\u00c8";
        if (this.loginScreenState === 0) {
            let j: number = (((c => (c.charCodeAt == null ? (c as any) : c.charCodeAt(0)))(c1) / 2) | 0) + 80;
            this.fontSmall.drawStringCenter(
                this.onDemandRequester.message,
                ((c => (c.charCodeAt == null ? (c as any) : c.charCodeAt(0)))(c) / 2) | 0,
                j,
                7711145,
                true
            );
            j = (((c => (c.charCodeAt == null ? (c as any) : c.charCodeAt(0)))(c1) / 2) | 0) - 20;
            this.fontBold.drawStringCenter(
                "Welcome to RuneScape",
                ((c => (c.charCodeAt == null ? (c as any) : c.charCodeAt(0)))(c) / 2) | 0,
                j,
                16776960,
                true
            );
            j += 30;
            let i1: number = (((c => (c.charCodeAt == null ? (c as any) : c.charCodeAt(0)))(c) / 2) | 0) - 80;
            const l1: number = (((c => (c.charCodeAt == null ? (c as any) : c.charCodeAt(0)))(c1) / 2) | 0) + 20;
            this.titleboxButtonImage.drawImage(i1 - 73, l1 - 20);
            this.fontBold.drawStringCenter("New User", i1, l1 + 5, 16777215, true);
            i1 = (((c => (c.charCodeAt == null ? (c as any) : c.charCodeAt(0)))(c) / 2) | 0) + 80;
            this.titleboxButtonImage.drawImage(i1 - 73, l1 - 20);
            this.fontBold.drawStringCenter("Existing User", i1, l1 + 5, 16777215, true);
        }
        if (this.loginScreenState === 2) {
            let k: number = (((c => (c.charCodeAt == null ? (c as any) : c.charCodeAt(0)))(c1) / 2) | 0) - 40;
            if (this.statusLineOne.length > 0) {
                this.fontBold.drawStringCenter(
                    this.statusLineOne,
                    ((c => (c.charCodeAt == null ? (c as any) : c.charCodeAt(0)))(c) / 2) | 0,
                    k - 15,
                    16776960,
                    true
                );
                this.fontBold.drawStringCenter(
                    this.statusLineTwo,
                    ((c => (c.charCodeAt == null ? (c as any) : c.charCodeAt(0)))(c) / 2) | 0,
                    k,
                    16776960,
                    true
                );
                k += 30;
            } else {
                this.fontBold.drawStringCenter(
                    this.statusLineTwo,
                    ((c => (c.charCodeAt == null ? (c as any) : c.charCodeAt(0)))(c) / 2) | 0,
                    k - 7,
                    16776960,
                    true
                );
                k += 30;
            }
            this.fontBold.drawShadowedString(
                "Username: " + this.username + (((lhs, rhs) => lhs && rhs)(this.anInt977 === 0, Game.pulseCycle % 40 < 20) ? "@yel@|" : ""),
                (((c => (c.charCodeAt == null ? (c as any) : c.charCodeAt(0)))(c) / 2) | 0) - 90,
                k,
                true,
                16777215
            );
            k += 15;
            this.fontBold.drawShadowedString(
                "Password: " +
                    TextUtils.censorPassword(this.password) +
                    (((lhs, rhs) => lhs && rhs)(this.anInt977 === 1, Game.pulseCycle % 40 < 20) ? "@yel@|" : ""),
                (((c => (c.charCodeAt == null ? (c as any) : c.charCodeAt(0)))(c) / 2) | 0) - 88,
                k,
                true,
                16777215
            );
            k += 15;
            if (!flag) {
                let j1: number = (((c => (c.charCodeAt == null ? (c as any) : c.charCodeAt(0)))(c) / 2) | 0) - 80;
                const i2: number = (((c => (c.charCodeAt == null ? (c as any) : c.charCodeAt(0)))(c1) / 2) | 0) + 50;
                this.titleboxButtonImage.drawImage(j1 - 73, i2 - 20);
                this.fontBold.drawStringCenter("Login", j1, i2 + 5, 16777215, true);
                j1 = (((c => (c.charCodeAt == null ? (c as any) : c.charCodeAt(0)))(c) / 2) | 0) + 80;
                this.titleboxButtonImage.drawImage(j1 - 73, i2 - 20);
                this.fontBold.drawStringCenter("Cancel", j1, i2 + 5, 16777215, true);
            }
        }
        if (this.loginScreenState === 3) {
            this.fontBold.drawStringCenter(
                "Create a free account",
                ((c => (c.charCodeAt == null ? (c as any) : c.charCodeAt(0)))(c) / 2) | 0,
                (((c => (c.charCodeAt == null ? (c as any) : c.charCodeAt(0)))(c1) / 2) | 0) - 60,
                16776960,
                true
            );
            let l: number = (((c => (c.charCodeAt == null ? (c as any) : c.charCodeAt(0)))(c1) / 2) | 0) - 35;
            this.fontBold.drawStringCenter(
                "To create a new account you need to",
                ((c => (c.charCodeAt == null ? (c as any) : c.charCodeAt(0)))(c) / 2) | 0,
                l,
                16777215,
                true
            );
            l += 15;
            this.fontBold.drawStringCenter(
                "go back to the main RuneScape webpage",
                ((c => (c.charCodeAt == null ? (c as any) : c.charCodeAt(0)))(c) / 2) | 0,
                l,
                16777215,
                true
            );
            l += 15;
            this.fontBold.drawStringCenter(
                "and choose the 'create account'",
                ((c => (c.charCodeAt == null ? (c as any) : c.charCodeAt(0)))(c) / 2) | 0,
                l,
                16777215,
                true
            );
            l += 15;
            this.fontBold.drawStringCenter(
                "button near the top of that page.",
                ((c => (c.charCodeAt == null ? (c as any) : c.charCodeAt(0)))(c) / 2) | 0,
                l,
                16777215,
                true
            );
            l += 15;
            const k1: number = ((c => (c.charCodeAt == null ? (c as any) : c.charCodeAt(0)))(c) / 2) | 0;
            const j2: number = (((c => (c.charCodeAt == null ? (c as any) : c.charCodeAt(0)))(c1) / 2) | 0) + 50;
            this.titleboxButtonImage.drawImage(k1 - 73, j2 - 20);
            this.fontBold.drawStringCenter("Cancel", k1, j2 + 5, 16777215, true);
        }
        this.aClass18_1200.drawGraphics(202, 171, this.gameGraphics);
        if (this.aBoolean1046) {
            this.aBoolean1046 = false;
            this.aClass18_1198.drawGraphics(128, 0, this.gameGraphics);
            this.aClass18_1199.drawGraphics(202, 371, this.gameGraphics);
            this.aClass18_1203.drawGraphics(0, 265, this.gameGraphics);
            this.aClass18_1204.drawGraphics(562, 265, this.gameGraphics);
            this.aClass18_1205.drawGraphics(128, 171, this.gameGraphics);
            this.aClass18_1206.drawGraphics(562, 171, this.gameGraphics);
        }
    }

    public drawError() {
        const g: Graphics = this.gameGraphics;
        g.setColor(Color.black);
        g.fillRect(0, 0, 765, 503);
        this.setFrameRate(1);
        if (this.startUpError) {
            this.startedRenderingFlames = false;
            g.setFont(new Font("Helvetica", 1, 16));
            g.setColor(Color.yellow);
            let j: number = 35;
            g.drawString("Sorry, an error has occured whilst loading RuneScape", 30, j);
            j += 50;
            g.setColor(Color.white);
            g.drawString("To fix this try the following (in order):", 30, j);
            j += 50;
            g.setColor(Color.white);
            g.setFont(new Font("Helvetica", 1, 12));
            g.drawString("1: Try closing ALL open web-browser windows, and reloading", 30, j);
            j += 30;
            g.drawString("2: Try clearing your web-browsers cache from tools->internet options", 30, j);
            j += 30;
            g.drawString("3: Try using a different game-world", 30, j);
            j += 30;
            g.drawString("4: Try rebooting your computer", 30, j);
            j += 30;
            g.drawString("5: Try selecting a different version of Java from the play-game menu", 30, j);
        }
        if (this.aBoolean1097) {
            this.startedRenderingFlames = false;
            g.setFont(new Font("Helvetica", 1, 20));
            g.setColor(Color.white);
            g.drawString("Error - unable to load game!", 50, 50);
            g.drawString("To play RuneScape make sure you play from", 50, 100);
            g.drawString("http://www.runescape.com", 50, 150);
        }
        if (this.aBoolean1016) {
            this.startedRenderingFlames = false;
            g.setColor(Color.yellow);
            let k: number = 35;
            g.drawString("Error a copy of RuneScape already appears to be loaded", 30, k);
            k += 50;
            g.setColor(Color.white);
            g.drawString("To fix this try the following (in order):", 30, k);
            k += 50;
            g.setColor(Color.white);
            g.setFont(new Font("Helvetica", 1, 12));
            g.drawString("1: Try closing ALL open web-browser windows, and reloading", 30, k);
            k += 30;
            g.drawString("2: Try rebooting your computer, and reloading", 30, k);
            k += 30;
        }
    }

    public async method149(i: number) {
        while (i >= 0) {
            this.opcode = this.buffer.getUnsignedByte();
        }
        if (this.loginScreenState === 0) {
            let j: number = ((this.width / 2) | 0) - 80;
            let i1: number = ((this.height / 2) | 0) + 20;
            i1 += 20;
            if (
                this.clickType === 1 &&
                this.clickX >= j - 75 &&
                this.clickX <= j + 75 &&
                this.clickY >= i1 - 20 &&
                this.clickY <= i1 + 20
            ) {
                this.loginScreenState = 3;
                this.anInt977 = 0;
            }
            j = ((this.width / 2) | 0) + 80;
            if (
                this.clickType === 1 &&
                this.clickX >= j - 75 &&
                this.clickX <= j + 75 &&
                this.clickY >= i1 - 20 &&
                this.clickY <= i1 + 20
            ) {
                this.statusLineOne = "";
                this.statusLineTwo = "Enter your username & password.";
                this.loginScreenState = 2;
                this.anInt977 = 0;
                return;
            }
        } else {
            if (this.loginScreenState === 2) {
                let k: number = ((this.height / 2) | 0) - 40;
                k += 30;
                k += 25;
                if (this.clickType === 1 && this.clickY >= k - 15 && this.clickY < k) {
                    this.anInt977 = 0;
                }
                k += 15;
                if (this.clickType === 1 && this.clickY >= k - 15 && this.clickY < k) {
                    this.anInt977 = 1;
                }
                k += 15;
                let j1: number = ((this.width / 2) | 0) - 80;
                let l1: number = ((this.height / 2) | 0) + 50;
                l1 += 20;
                if (
                    this.clickType === 1 &&
                    this.clickX >= j1 - 75 &&
                    this.clickX <= j1 + 75 &&
                    this.clickY >= l1 - 20 &&
                    this.clickY <= l1 + 20
                ) {
                    this.anInt850 = 0;
                    await this.login(this.username, this.password, false);
                    if (this.loggedIn) {
                        return;
                    }
                }
                j1 = ((this.width / 2) | 0) + 80;
                if (
                    this.clickType === 1 &&
                    this.clickX >= j1 - 75 &&
                    this.clickX <= j1 + 75 &&
                    this.clickY >= l1 - 20 &&
                    this.clickY <= l1 + 20
                ) {
                    this.loginScreenState = 0;
                    this.username = "";
                    this.password = "";
                }
                do {
                    {
                        const i2: number = this.readCharacter();
                        if (i2 === -1) {
                            break;
                        }
                        let flag: boolean = false;
                        for (let j2: number = 0; j2 < Game.VALID_CHARACTERS.length; j2++) {
                            {
                                if (i2 != (c => (c.charCodeAt == null ? (c as any) : c.charCodeAt(0)))(Game.VALID_CHARACTERS.charAt(j2))) {
                                    continue;
                                }
                                flag = true;
                                break;
                            }
                        }
                        if (this.anInt977 === 0) {
                            if (i2 === 8 && this.username.length > 0) {
                                this.username = this.username.substring(0, this.username.length - 1);
                            }
                            if (i2 === 9 || i2 === 10 || i2 === 13) {
                                this.anInt977 = 1;
                            }
                            if (flag) {
                                this.username += String.fromCharCode(i2);
                            }
                            if (this.username.length > 12) {
                                this.username = this.username.substring(0, 12);
                            }
                        } else if (this.anInt977 === 1) {
                            if (i2 === 8 && this.password.length > 0) {
                                this.password = this.password.substring(0, this.password.length - 1);
                            }
                            if (i2 === 9 || i2 === 10 || i2 === 13) {
                                this.anInt977 = 0;
                            }
                            if (flag) {
                                this.password += String.fromCharCode(i2);
                            }
                            if (this.password.length > 20) {
                                this.password = this.password.substring(0, 20);
                            }
                        }
                    }
                } while (true);
                return;
            }
            if (this.loginScreenState === 3) {
                const l: number = (this.width / 2) | 0;
                let k1: number = ((this.height / 2) | 0) + 50;
                k1 += 20;
                if (
                    this.clickType === 1 &&
                    this.clickX >= l - 75 &&
                    this.clickX <= l + 75 &&
                    this.clickY >= k1 - 20 &&
                    this.clickY <= k1 + 20
                ) {
                    this.loginScreenState = 0;
                }
            }
        }
    }

    public async login(username: string, password: string, reconnecting: boolean) {
        SignLink.errorName = username;
        try {
            if (!reconnecting) {
                this.statusLineOne = "";
                this.statusLineTwo = "Connecting to server...";
                await this.drawLoginScreen(true);
            }
            this.gameConnection = new BufferedConnection(this, await this.openSocket(Configuration.GAME_PORT + Game.portOffset));
            const base37name: number = TextUtils.nameToLong(username);
            const hash: number = (((base37name >> 16) & 31) as number) | 0;
            this.outBuffer.currentPosition = 0;
            this.outBuffer.putByte(14);
            this.outBuffer.putByte(hash);
            this.gameConnection.write(2, 0, this.outBuffer.buffer);
            for (let j: number = 0; j < 8; j++) {
                await this.gameConnection.read$();
            }
            let responseCode: number = await this.gameConnection.read$();
            const initialResponseCode: number = responseCode;
            if (responseCode === 0) {
                await this.gameConnection.read$byte_A$int$int(this.buffer.buffer, 0, 8);
                this.buffer.currentPosition = 0;
                const seed: number[] = [0, 0, 0, 0];
                seed[0] = ((Math.random() * 9.9999999e7) as number) | 0;
                seed[1] = ((Math.random() * 9.9999999e7) as number) | 0;
                seed[2] = this.buffer.getInt();
                seed[3] = this.buffer.getInt();
                this.outBuffer.currentPosition = 0;
                this.outBuffer.putByte(10);
                this.outBuffer.putInt(seed[0]);
                this.outBuffer.putInt(seed[1]);
                this.outBuffer.putInt(seed[2]);
                this.outBuffer.putInt(seed[3]);
                this.outBuffer.putInt(SignLink.uid);
                this.outBuffer.putString(username);
                this.outBuffer.putString(password);
                if (Configuration.RSA_ENABLED) {
                    this.outBuffer.encrypt(Configuration.RSA_MODULUS, Configuration.RSA_PUBLIC_KEY);
                }
                this.tempBuffer.currentPosition = 0;
                if (reconnecting) {
                    this.tempBuffer.putByte(18);
                } else {
                    this.tempBuffer.putByte(16);
                }
                this.tempBuffer.putByte(this.outBuffer.currentPosition + 36 + 1 + 1 + 2);
                this.tempBuffer.putByte(255);
                this.tempBuffer.putShort(SignLink.CLIENT_REVISION);
                this.tempBuffer.putByte(Game.lowMemory ? 1 : 0);
                for (let i: number = 0; i < 9; i++) {
                    this.tempBuffer.putInt(this.archiveHashes[i]);
                }
                this.tempBuffer.putBytes(this.outBuffer.buffer, 0, this.outBuffer.currentPosition);
                this.outBuffer.random = new ISAACCipher(seed);
                for (let i: number = 0; i < 4; i++) {
                    seed[i] += 50;
                }
                this.incomingRandom = new ISAACCipher(seed);
                this.gameConnection.write(this.tempBuffer.currentPosition, 0, this.tempBuffer.buffer);
                responseCode = await this.gameConnection.read$();
            }
            if (responseCode === 1) {
                try {
                    await sleep(500);
                } catch (ignored) {}
                this.login(username, password, reconnecting);
                return;
            }
            if (responseCode === 2) {
                this.playerRights = await this.gameConnection.read$();
                Game.accountFlagged = (await this.gameConnection.read$()) === 1;
                this.aLong902 = 0;
                this.duplicateClickCount = 0;
                this.mouseCapturer.coord = 0;
                this.awtFocus = true;
                this.aBoolean1275 = true;
                this.loggedIn = true;
                this.outBuffer.currentPosition = 0;
                this.buffer.currentPosition = 0;
                this.opcode = -1;
                this.lastOpcode = -1;
                this.secondLastOpcode = -1;
                this.thirdLastOpcode = -1;
                this.packetSize = 0;
                this.timeoutCounter = 0;
                this.systemUpdateTime = 0;
                this.anInt873 = 0;
                this.anInt1197 = 0;
                this.menuActionRow = 0;
                this.menuOpen = false;
                this.idleTime = 0;
                for (let j1: number = 0; j1 < 100; j1++) {
                    this.chatMessages[j1] = null;
                }
                this.itemSelected = 0;
                this.widgetSelected = 0;
                this.loadingStage = 0;
                this.currentSound = 0;
                this.anInt850 = (((Math.random() * 100.0) as number) | 0) - 50;
                this.anInt1009 = (((Math.random() * 110.0) as number) | 0) - 55;
                this.anInt1255 = (((Math.random() * 80.0) as number) | 0) - 40;
                this.anInt916 = (((Math.random() * 120.0) as number) | 0) - 60;
                this.anInt1233 = (((Math.random() * 30.0) as number) | 0) - 20;
                this.cameraHorizontal = ((((Math.random() * 20.0) as number) | 0) - 10) & 2047;
                this.minimapState = 0;
                this.anInt1276 = -1;
                this.destinationX = 0;
                this.destinationY = 0;
                this.localPlayerCount = 0;
                this.anInt1133 = 0;
                for (let i2: number = 0; i2 < this.anInt968; i2++) {
                    {
                        this.players[i2] = null;
                        this.cachedAppearances[i2] = null;
                    }
                }
                for (let k2: number = 0; k2 < 16384; k2++) {
                    this.npcs[k2] = null;
                }
                Game.localPlayer = this.players[this.thisPlayerId] = new Player();
                this.aClass6_1282.getNodeCount();
                this.aClass6_1210.getNodeCount();
                for (let l2: number = 0; l2 < 4; l2++) {
                    {
                        for (let i3: number = 0; i3 < 104; i3++) {
                            {
                                for (let k3: number = 0; k3 < 104; k3++) {
                                    this.groundItems[l2][i3][k3] = null;
                                }
                            }
                        }
                    }
                }
                this.aClass6_1261 = new LinkedList();
                this.friendListStatus = 0;
                this.friendsCount = 0;
                this.method44(Game.aBoolean1190, this.dialogueId);
                this.dialogueId = -1;
                this.method44(Game.aBoolean1190, this.backDialogueId);
                this.backDialogueId = -1;
                this.method44(Game.aBoolean1190, this.openInterfaceId);
                this.openInterfaceId = -1;
                this.method44(Game.aBoolean1190, this.anInt1053);
                this.anInt1053 = -1;
                this.method44(Game.aBoolean1190, this.anInt960);
                this.anInt960 = -1;
                this.method44(Game.aBoolean1190, this.anInt1089);
                this.anInt1089 = -1;
                this.method44(Game.aBoolean1190, this.anInt1279);
                this.anInt1279 = -1;
                this.aBoolean1239 = false;
                this.anInt1285 = 3;
                this.inputType = 0;
                this.menuOpen = false;
                this.messagePromptRaised = false;
                this.clickToContinueString = null;
                this.anInt1319 = 0;
                this.anInt1213 = -1;
                this.characterEditChangeGenger = true;
                this.method25();
                for (let j3: number = 0; j3 < 5; j3++) {
                    this.characterEditColors[j3] = 0;
                }
                for (let l3: number = 0; l3 < 5; l3++) {
                    {
                        this.aStringArray1069[l3] = null;
                        this.aBooleanArray1070[l3] = false;
                    }
                }
                Game.anInt1100 = 0;
                Game.anInt1165 = 0;
                Game.anInt1235 = 0;
                Game.anInt1052 = 0;
                Game.anInt1139 = 0;
                Game.anInt841 = 0;
                Game.anInt1230 = 0;
                Game.anInt1013 = 0;
                Game.anInt1049 = 0;
                Game.anInt1162 = 0;
                await this.method122();
                return;
            }
            if (responseCode === 3) {
                this.statusLineOne = "";
                this.statusLineTwo = "Invalid username or password.";
                return;
            }
            if (responseCode === 4) {
                this.statusLineOne = "Your account has been disabled.";
                this.statusLineTwo = "Please check your message-centre for details.";
                return;
            }
            if (responseCode === 5) {
                this.statusLineOne = "Your account is already logged in.";
                this.statusLineTwo = "Try again in 60 secs...";
                return;
            }
            if (responseCode === 6) {
                this.statusLineOne = "RuneScape has been updated!";
                this.statusLineTwo = "Please reload this page.";
                return;
            }
            if (responseCode === 7) {
                this.statusLineOne = "This world is full.";
                this.statusLineTwo = "Please use a different world.";
                return;
            }
            if (responseCode === 8) {
                this.statusLineOne = "Unable to connect.";
                this.statusLineTwo = "Login server offline.";
                return;
            }
            if (responseCode === 9) {
                this.statusLineOne = "Login limit exceeded.";
                this.statusLineTwo = "Too many connections from your address.";
                return;
            }
            if (responseCode === 10) {
                this.statusLineOne = "Unable to connect.";
                this.statusLineTwo = "Bad session id.";
                return;
            }
            if (responseCode === 12) {
                this.statusLineOne = "You need a members account to login to this world.";
                this.statusLineTwo = "Please subscribe, or use a different world.";
                return;
            }
            if (responseCode === 13) {
                this.statusLineOne = "Could not complete login.";
                this.statusLineTwo = "Please try using a different world.";
                return;
            }
            if (responseCode === 14) {
                this.statusLineOne = "The server is being updated.";
                this.statusLineTwo = "Please wait 1 minute and try again.";
                return;
            }
            if (responseCode === 15) {
                this.loggedIn = true;
                this.outBuffer.currentPosition = 0;
                this.buffer.currentPosition = 0;
                this.opcode = -1;
                this.lastOpcode = -1;
                this.secondLastOpcode = -1;
                this.thirdLastOpcode = -1;
                this.packetSize = 0;
                this.timeoutCounter = 0;
                this.systemUpdateTime = 0;
                this.menuActionRow = 0;
                this.menuOpen = false;
                this.aLong1229 = new Date().getTime();
                return;
            }
            if (responseCode === 16) {
                this.statusLineOne = "Login attempts exceeded.";
                this.statusLineTwo = "Please wait 1 minute and try again.";
                return;
            }
            if (responseCode === 17) {
                this.statusLineOne = "You are standing in a members-only area.";
                this.statusLineTwo = "To play on this world move to a free area first";
                return;
            }
            if (responseCode === 18) {
                this.statusLineOne = "Account locked as we suspect it has been stolen.";
                this.statusLineTwo = "Press 'recover a locked account' on front page.";
                return;
            }
            if (responseCode === 20) {
                this.statusLineOne = "Invalid loginserver requested";
                this.statusLineTwo = "Please try using a different world.";
                return;
            }
            if (responseCode === 21) {
                let time: number = await this.gameConnection.read$();
                for (time += 3; time >= 0; time--) {
                    {
                        this.statusLineOne = "You have only just left another world";
                        this.statusLineTwo = "Your profile will be transferred in: " + time;
                        await this.drawLoginScreen(true);
                        try {
                            await sleep(1200);
                        } catch (ignored) {}
                    }
                }
                this.login(username, password, reconnecting);
                return;
            }
            if (responseCode === 22) {
                this.statusLineOne = "Malformed login packet.";
                this.statusLineTwo = "Please try again.";
                return;
            }
            if (responseCode === 23) {
                this.statusLineOne = "No reply from loginserver.";
                this.statusLineTwo = "Please try again.";
                return;
            }
            if (responseCode === 24) {
                this.statusLineOne = "Error loading your profile.";
                this.statusLineTwo = "Please contact customer support.";
                return;
            }
            if (responseCode === 25) {
                this.statusLineOne = "Unexpected loginserver response.";
                this.statusLineTwo = "Please try using a different world.";
                return;
            }
            if (responseCode === 26) {
                this.statusLineOne = "This computers address has been blocked";
                this.statusLineTwo = "as it was used to break our rules";
                return;
            }
            if (responseCode === -1) {
                if (initialResponseCode === 0) {
                    if (this.anInt850 < 2) {
                        try {
                            await sleep(2000);
                        } catch (ignored) {}
                        this.anInt850++;
                        this.login(username, password, reconnecting);
                        return;
                    } else {
                        this.statusLineOne = "No response from loginserver";
                        this.statusLineTwo = "Please wait 1 minute and try again.";
                        return;
                    }
                } else {
                    this.statusLineOne = "No response from server";
                    this.statusLineTwo = "Please try using a different world.";
                    return;
                }
            } else {
                console.info("response:" + responseCode);
                this.statusLineOne = "Unexpected server response";
                this.statusLineTwo = "Please try using a different world.";
                return;
            }
        } catch (ex) {
            this.statusLineOne = "";
        }
        this.statusLineTwo = "Error connecting to server.";
    }

    public async processGame() {
        if (this.systemUpdateTime > 1) {
            this.systemUpdateTime--;
        }
        if (this.anInt873 > 0) {
            this.anInt873--;
        }
        for (let i: number = 0; i < 5; i++) {
            if (!(await this.parseIncomingPacket())) {
                break;
            }
        }
        if (!this.loggedIn) {
            return;
        }
        {
            if (Game.accountFlagged) {
                if (this.clickType !== 0 || this.mouseCapturer.coord >= 40) {
                    this.outBuffer.putOpcode(171);
                    this.outBuffer.putByte(0);
                    const i2: number = this.outBuffer.currentPosition;
                    let i3: number = 0;
                    for (let i4: number = 0; i4 < this.mouseCapturer.coord; i4++) {
                        {
                            if (i2 - this.outBuffer.currentPosition >= 240) {
                                break;
                            }
                            i3++;
                            let k4: number = this.mouseCapturer.coordsY[i4];
                            if (k4 < 0) {
                                k4 = 0;
                            } else if (k4 > 502) {
                                k4 = 502;
                            }
                            let j5: number = this.mouseCapturer.coordsX[i4];
                            if (j5 < 0) {
                                j5 = 0;
                            } else if (j5 > 764) {
                                j5 = 764;
                            }
                            let l5: number = k4 * 765 + j5;
                            if (this.mouseCapturer.coordsY[i4] === -1 && this.mouseCapturer.coordsX[i4] === -1) {
                                j5 = -1;
                                k4 = -1;
                                l5 = 524287;
                            }
                            if (j5 === this.anInt1011 && k4 === this.anInt1012) {
                                if (this.duplicateClickCount < 2047) {
                                    this.duplicateClickCount++;
                                }
                            } else {
                                let i6: number = j5 - this.anInt1011;
                                this.anInt1011 = j5;
                                let j6: number = k4 - this.anInt1012;
                                this.anInt1012 = k4;
                                if (this.duplicateClickCount < 8 && i6 >= -32 && i6 <= 31 && j6 >= -32 && j6 <= 31) {
                                    i6 += 32;
                                    j6 += 32;
                                    this.outBuffer.putShort((this.duplicateClickCount << 12) + (i6 << 6) + j6);
                                    this.duplicateClickCount = 0;
                                } else if (this.duplicateClickCount < 8) {
                                    this.outBuffer.putTriByte(8388608 + (this.duplicateClickCount << 19) + l5);
                                    this.duplicateClickCount = 0;
                                } else {
                                    this.outBuffer.putInt(-1073741824 + (this.duplicateClickCount << 19) + l5);
                                    this.duplicateClickCount = 0;
                                }
                            }
                        }
                    }
                    this.outBuffer.putLength(this.outBuffer.currentPosition - i2);
                    if (i3 >= this.mouseCapturer.coord) {
                        this.mouseCapturer.coord = 0;
                    } else {
                        this.mouseCapturer.coord -= i3;
                        for (let l4: number = 0; l4 < this.mouseCapturer.coord; l4++) {
                            {
                                this.mouseCapturer.coordsX[l4] = this.mouseCapturer.coordsX[l4 + i3];
                                this.mouseCapturer.coordsY[l4] = this.mouseCapturer.coordsY[l4 + i3];
                            }
                        }
                    }
                }
            } else {
                this.mouseCapturer.coord = 0;
            }
        }
        if (this.clickType !== 0) {
            let l: number = (n => (n < 0 ? Math.ceil(n) : Math.floor(n)))((this.clickTime - this.aLong902) / 50);
            if (l > 4095) {
                l = 4095;
            }
            this.aLong902 = this.clickTime;
            let j2: number = this.clickY;
            if (j2 < 0) {
                j2 = 0;
            } else if (j2 > 502) {
                j2 = 502;
            }
            let j3: number = this.clickX;
            if (j3 < 0) {
                j3 = 0;
            } else if (j3 > 764) {
                j3 = 764;
            }
            const j4: number = j2 * 765 + j3;
            let i5: number = 0;
            if (this.clickType === 2) {
                i5 = 1;
            }
            const k5: number = (l as number) | 0;
            this.outBuffer.putOpcode(19);
            this.outBuffer.putInt((k5 << 20) + (i5 << 19) + j4);
        }
        if (this.anInt1264 > 0) {
            this.anInt1264--;
        }
        if (this.keyStatus[1] === 1 || this.keyStatus[2] === 1 || this.keyStatus[3] === 1 || this.keyStatus[4] === 1) {
            this.aBoolean1265 = true;
        }
        if (this.aBoolean1265 && this.anInt1264 <= 0) {
            this.anInt1264 = 20;
            this.aBoolean1265 = false;
            this.outBuffer.putOpcode(140);
            this.outBuffer.putLEShortDup(this.anInt1251);
            this.outBuffer.putLEShortDup(this.cameraHorizontal);
        }
        if (this.awtFocus && !this.aBoolean1275) {
            this.aBoolean1275 = true;
            this.outBuffer.putOpcode(187);
            this.outBuffer.putByte(1);
        }
        if (!this.awtFocus && this.aBoolean1275) {
            this.aBoolean1275 = false;
            this.outBuffer.putOpcode(187);
            this.outBuffer.putByte(0);
        }
        this.method143((-40 as number) | 0);
        this.method36(16220);
        this.method152();
        this.timeoutCounter++;
        if (this.timeoutCounter > 750) {
            this.dropClient();
        }
        this.method100(0);
        this.method67(-37214);
        this.processActorOverheadText();
        this.tickDelta++;
        if (this.crossType !== 0) {
            this.crossIndex += 20;
            if (this.crossIndex >= 400) {
                this.crossType = 0;
            }
        }
        if (this.atInventoryInterfaceType !== 0) {
            this.atInventoryLoopCycle++;
            if (this.atInventoryLoopCycle >= 15) {
                if (this.atInventoryInterfaceType === 2) {
                    this.redrawTabArea = true;
                }
                if (this.atInventoryInterfaceType === 3) {
                    this.redrawChatbox = true;
                }
                this.atInventoryInterfaceType = 0;
            }
        }
        if (this.activeInterfaceType !== 0) {
            this.anInt1269++;
            if (
                this.mouseX > this.anInt1114 + 5 ||
                this.mouseX < this.anInt1114 - 5 ||
                this.mouseY > this.anInt1115 + 5 ||
                this.mouseY < this.anInt1115 - 5
            ) {
                this.aBoolean1155 = true;
            }
            if (this.mouseButtonPressed === 0) {
                if (this.activeInterfaceType === 2) {
                    this.redrawTabArea = true;
                }
                if (this.activeInterfaceType === 3) {
                    this.redrawChatbox = true;
                }
                this.activeInterfaceType = 0;
                if (this.aBoolean1155 && this.anInt1269 >= 5) {
                    this.lastActiveInvInterface = -1;
                    this.processRightClick(-521);
                    if (
                        this.lastActiveInvInterface === this.modifiedWidgetId &&
                        this.mouseInvInterfaceIndex !== this.selectedInventorySlot
                    ) {
                        const childInterface: Widget = Widget.forId(this.modifiedWidgetId);
                        let i1: number = 0;
                        if (this.anInt955 === 1 && childInterface.contentType === 206) {
                            i1 = 1;
                        }
                        if (childInterface.items[this.mouseInvInterfaceIndex] <= 0) {
                            i1 = 0;
                        }
                        if (childInterface.itemDeletesDraged) {
                            const k2: number = this.selectedInventorySlot;
                            const k3: number = this.mouseInvInterfaceIndex;
                            childInterface.items[k3] = childInterface.items[k2];
                            childInterface.itemAmounts[k3] = childInterface.itemAmounts[k2];
                            childInterface.items[k2] = -1;
                            childInterface.itemAmounts[k2] = 0;
                        } else if (i1 === 1) {
                            let l2: number = this.selectedInventorySlot;
                            for (const l3: number = this.mouseInvInterfaceIndex; l2 !== l3; ) {
                                if (l2 > l3) {
                                    childInterface.swapItems(l2, l2 - 1);
                                    l2--;
                                } else if (l2 < l3) {
                                    childInterface.swapItems(l2, l2 + 1);
                                    l2++;
                                }
                            }
                        } else {
                            childInterface.swapItems(this.selectedInventorySlot, this.mouseInvInterfaceIndex);
                        }
                        this.outBuffer.putOpcode(123);
                        this.outBuffer.putLEShortAdded(this.mouseInvInterfaceIndex);
                        this.outBuffer.putByteAdded(i1);
                        this.outBuffer.putShortAdded(this.modifiedWidgetId);
                        this.outBuffer.putLEShortDup(this.selectedInventorySlot);
                    }
                } else if (
                    (this.anInt1300 === 1 || this.menuHasAddFriend(this.menuActionRow - 1, this.aByte1161)) &&
                    this.menuActionRow > 2
                ) {
                    this.determineMenuSize();
                } else if (this.menuActionRow > 0) {
                    this.processMenuActions(this.menuActionRow - 1);
                }
                this.atInventoryLoopCycle = 10;
                this.clickType = 0;
            }
        }
        if (Scene.clickedTileX !== -1) {
            const dstX: number = Scene.clickedTileX;
            const dstY: number = Scene.anInt486;
            const flag: boolean = this.walk(
                true,
                false,
                dstY,
                Game.localPlayer.pathY[0],
                0,
                0,
                0,
                0,
                dstX,
                0,
                0,
                Game.localPlayer.pathX[0]
            );
            Scene.clickedTileX = -1;
            if (flag) {
                this.anInt1020 = this.clickX;
                this.anInt1021 = this.clickY;
                this.crossType = 1;
                this.crossIndex = 0;
            }
        }
        if (this.clickType === 1 && this.clickToContinueString != null) {
            this.clickToContinueString = null;
            this.redrawChatbox = true;
            this.clickType = 0;
        }
        this.processMenuClick();
        if (this.anInt1053 === -1) {
            this.method146((4 as number) | 0);
            this.method21(false);
            this.method39(true);
        }
        if (this.mouseButtonPressed === 1 || this.clickType === 1) {
            this.anInt1094++;
        }
        if (this.anInt1284 !== 0 || this.anInt1044 !== 0 || this.anInt1129 !== 0) {
            if (this.anInt893 < 100) {
                this.anInt893++;
                if (this.anInt893 === 100) {
                    if (this.anInt1284 !== 0) {
                        this.redrawChatbox = true;
                    }
                    if (this.anInt1044 !== 0) {
                        this.redrawTabArea = true;
                    }
                }
            }
        } else if (this.anInt893 > 0) {
            this.anInt893--;
        }
        if (this.loadingStage === 2) {
            this.checkForGameUsages(409);
        }
        if (this.loadingStage === 2 && this.oriented) {
            this.calculateCameraPosition();
        }
        for (let k: number = 0; k < 5; k++) {
            this.quakeTimes[k]++;
        }
        this.manageTextInputs();
        this.idleTime++;
        if (this.idleTime > 4500) {
            this.anInt873 = 250;
            this.idleTime -= 500;
            this.outBuffer.putOpcode(202);
        }
        this.anInt1118++;
        if (this.anInt1118 > 500) {
            this.anInt1118 = 0;
            const k1: number = ((Math.random() * 8.0) as number) | 0;
            if ((k1 & 1) === 1) {
                this.anInt853 += this.anInt854;
            }
            if ((k1 & 2) === 2) {
                this.anInt1009 += this.anInt1010;
            }
            if ((k1 & 4) === 4) {
                this.anInt1255 += this.anInt1256;
            }
        }
        if (this.anInt853 < -50) {
            this.anInt854 = 2;
        }
        if (this.anInt853 > 50) {
            this.anInt854 = -2;
        }
        if (this.anInt1009 < -55) {
            this.anInt1010 = 2;
        }
        if (this.anInt1009 > 55) {
            this.anInt1010 = -2;
        }
        if (this.anInt1255 < -40) {
            this.anInt1256 = 1;
        }
        if (this.anInt1255 > 40) {
            this.anInt1256 = -1;
        }
        this.anInt1045++;
        if (this.anInt1045 > 500) {
            this.anInt1045 = 0;
            const l1: number = ((Math.random() * 8.0) as number) | 0;
            if ((l1 & 1) === 1) {
                this.anInt916 += this.anInt917;
            }
            if ((l1 & 2) === 2) {
                this.anInt1233 += this.anInt1234;
            }
        }
        if (this.anInt916 < -60) {
            this.anInt917 = 2;
        }
        if (this.anInt916 > 60) {
            this.anInt917 = -2;
        }
        if (this.anInt1233 < -20) {
            this.anInt1234 = 1;
        }
        if (this.anInt1233 > 10) {
            this.anInt1234 = -1;
        }
        this.anInt872++;
        if (this.anInt872 > 50) {
            this.outBuffer.putOpcode(40);
        }
        try {
            if (this.gameConnection != null && this.outBuffer.currentPosition > 0) {
                this.gameConnection.write(this.outBuffer.currentPosition, 0, this.outBuffer.buffer);
                this.outBuffer.currentPosition = 0;
                this.anInt872 = 0;
                return;
            }
        } catch (__e) {
            // if (__e != null && __e instanceof IOException as any) {
            //     this.dropClient();
            //     return;

            // }
            if (__e != null && ((__e instanceof Error) as any)) {
                const exception: Error = __e as Error;
                this.logout();
            }
        }
    }

    public method138() {
        console.info("============");
        console.info("flame-cycle:" + this.flameCycle);
        if (this.onDemandRequester != null) {
            console.info("Od-cycle:" + this.onDemandRequester.cycle);
        }
        console.info("loop-cycle:" + Game.pulseCycle);
        console.info("draw-cycle:" + Game.anInt1309);
        console.info("ptype:" + this.opcode);
        console.info("psize:" + this.packetSize);
        if (this.gameConnection != null) {
            this.gameConnection.printDebug();
        }
        this.dumpRequested = true;
    }

    public manageTextInputs() {
        while (true) {
            {
                const key: number = this.readCharacter();
                if (key === -1) {
                    break;
                }
                if (this.openInterfaceId !== -1 && this.openInterfaceId === this.reportAbuseInterfaceID) {
                    if (key === 8 && this.reportedName.length > 0) {
                        this.reportedName = this.reportedName.substring(0, this.reportedName.length - 1);
                    }
                    if (
                        ((key >= 97 && key <= 122) || (key >= 65 && key <= 90) || (key >= 48 && key <= 57) || key === 32) &&
                        this.reportedName.length < 12
                    ) {
                        this.reportedName += String.fromCharCode(key);
                    }
                } else if (this.messagePromptRaised) {
                    if (key >= 32 && key <= 122 && this.chatMessage.length < 80) {
                        this.chatMessage += String.fromCharCode(key);
                        this.redrawChatbox = true;
                    }
                    if (key === 8 && this.chatMessage.length > 0) {
                        this.chatMessage = this.chatMessage.substring(0, this.chatMessage.length - 1);
                        this.redrawChatbox = true;
                    }
                    if (key === 13 || key === 10) {
                        this.messagePromptRaised = false;
                        this.redrawChatbox = true;
                        if (this.friendsListAction === 1) {
                            const l: number = TextUtils.nameToLong(this.chatMessage);
                            this.addFriend(l);
                        }
                        if (this.friendsListAction === 2 && this.friendsCount > 0) {
                            const l1: number = TextUtils.nameToLong(this.chatMessage);
                            this.removeFriend(l1);
                        }
                        if (this.friendsListAction === 3 && this.chatMessage.length > 0) {
                            this.outBuffer.putOpcode(227);
                            this.outBuffer.putByte(0);
                            const j: number = this.outBuffer.currentPosition;
                            this.outBuffer.putLong(this.aLong1141);
                            ChatEncoder.put(this.chatMessage, this.outBuffer);
                            this.outBuffer.putLength(this.outBuffer.currentPosition - j);
                            this.chatMessage = ChatEncoder.formatChatMessage(this.chatMessage);
                            this.addChatMessage(TextUtils.formatName(TextUtils.longToName(this.aLong1141)), this.chatMessage, 6);
                            if (this.privateChatMode === 2) {
                                this.privateChatMode = 1;
                                this.aBoolean1212 = true;
                                this.outBuffer.putOpcode(176);
                                this.outBuffer.putByte(this.publicChatMode);
                                this.outBuffer.putByte(this.privateChatMode);
                                this.outBuffer.putByte(this.tradeMode);
                            }
                        }
                        if (this.friendsListAction === 4 && this.ignoresCount < 100) {
                            const l2: number = TextUtils.nameToLong(this.chatMessage);
                            this.addIgnore(this.anInt1154, l2);
                        }
                        if (this.friendsListAction === 5 && this.ignoresCount > 0) {
                            const l3: number = TextUtils.nameToLong(this.chatMessage);
                            this.removeIgnore(325, l3);
                        }
                    }
                } else if (this.inputType === 1) {
                    if (key >= 48 && key <= 57 && this.inputInputMessage.length < 10) {
                        this.inputInputMessage += String.fromCharCode(key);
                        this.redrawChatbox = true;
                    }
                    if (key === 8 && this.inputInputMessage.length > 0) {
                        this.inputInputMessage = this.inputInputMessage.substring(0, this.inputInputMessage.length - 1);
                        this.redrawChatbox = true;
                    }
                    if (key === 13 || key === 10) {
                        if (this.inputInputMessage.length > 0) {
                            let k: number = 0;
                            try {
                                k = parseInt(this.inputInputMessage);
                            } catch (_ex) {}
                            this.outBuffer.putOpcode(75);
                            this.outBuffer.putInt(k);
                        }
                        this.inputType = 0;
                        this.redrawChatbox = true;
                    }
                } else if (this.inputType === 2) {
                    if (key >= 32 && key <= 122 && this.inputInputMessage.length < 12) {
                        this.inputInputMessage += String.fromCharCode(key);
                        this.redrawChatbox = true;
                    }
                    if (key === 8 && this.inputInputMessage.length > 0) {
                        this.inputInputMessage = this.inputInputMessage.substring(0, this.inputInputMessage.length - 1);
                        this.redrawChatbox = true;
                    }
                    if (key === 13 || key === 10) {
                        if (this.inputInputMessage.length > 0) {
                            this.outBuffer.putOpcode(206);
                            this.outBuffer.putLong(TextUtils.nameToLong(this.inputInputMessage));
                        }
                        this.inputType = 0;
                        this.redrawChatbox = true;
                    }
                } else if (this.inputType === 3) {
                    if (key >= 32 && key <= 122 && this.inputInputMessage.length < 40) {
                        this.inputInputMessage += String.fromCharCode(key);
                        this.redrawChatbox = true;
                    }
                    if (key === 8 && this.inputInputMessage.length > 0) {
                        this.inputInputMessage = this.inputInputMessage.substring(0, this.inputInputMessage.length - 1);
                        this.redrawChatbox = true;
                    }
                } else if (this.backDialogueId === -1 && this.anInt1053 === -1) {
                    if (key >= 32 && key <= 122 && this.chatboxInput.length < 80) {
                        this.chatboxInput += String.fromCharCode(key);
                        this.redrawChatbox = true;
                    }
                    if (key === 8 && this.chatboxInput.length > 0) {
                        this.chatboxInput = this.chatboxInput.substring(0, this.chatboxInput.length - 1);
                        this.redrawChatbox = true;
                    }
                    if ((key === 13 || key === 10) && this.chatboxInput.length > 0) {
                        if (this.playerRights === 2) {
                            if (
                                /* equals */ ((o1: any, o2: any) => {
                                    if (o1 && o1.equals) {
                                        return o1.equals(o2);
                                    } else {
                                        return o1 === o2;
                                    }
                                })(this.chatboxInput, "::clientdrop") as any
                            ) {
                                this.dropClient();
                            }
                            if (
                                /* equals */ ((o1: any, o2: any) => {
                                    if (o1 && o1.equals) {
                                        return o1.equals(o2);
                                    } else {
                                        return o1 === o2;
                                    }
                                })(this.chatboxInput, "::lag") as any
                            ) {
                                this.method138();
                            }
                            if (
                                /* equals */ ((o1: any, o2: any) => {
                                    if (o1 && o1.equals) {
                                        return o1.equals(o2);
                                    } else {
                                        return o1 === o2;
                                    }
                                })(this.chatboxInput, "::prefetchmusic") as any
                            ) {
                                for (let i_417_: number = 0; i_417_ < this.onDemandRequester.fileCount(2); i_417_++) {
                                    this.onDemandRequester.setPriority((1 as number) | 0, 2, i_417_);
                                }
                            }
                            if (
                                /* equals */ ((o1: any, o2: any) => {
                                    if (o1 && o1.equals) {
                                        return o1.equals(o2);
                                    } else {
                                        return o1 === o2;
                                    }
                                })(this.chatboxInput, "::fpson") as any
                            ) {
                                Game.fps = true;
                            }
                            if (
                                /* equals */ ((o1: any, o2: any) => {
                                    if (o1 && o1.equals) {
                                        return o1.equals(o2);
                                    } else {
                                        return o1 === o2;
                                    }
                                })(this.chatboxInput, "::fpsoff") as any
                            ) {
                                Game.fps = false;
                            }
                            if (
                                /* equals */ ((o1: any, o2: any) => {
                                    if (o1 && o1.equals) {
                                        return o1.equals(o2);
                                    } else {
                                        return o1 === o2;
                                    }
                                })(this.chatboxInput, "::noclip") as any
                            ) {
                                for (let j1: number = 0; j1 < 4; j1++) {
                                    {
                                        for (let k1: number = 1; k1 < 103; k1++) {
                                            {
                                                for (let j2: number = 1; j2 < 103; j2++) {
                                                    this.currentCollisionMap[j1].adjacency[k1][j2] = 0;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        if (
                            /* startsWith */ ((str, searchString, position = 0) =>
                                str.substr(position, searchString.length) === searchString)(this.chatboxInput, "::")
                        ) {
                            this.outBuffer.putOpcode(56);
                            this.outBuffer.putByte(this.chatboxInput.length - 1);
                            this.outBuffer.putString(this.chatboxInput.substring(2));
                        } else {
                            let s: string = this.chatboxInput.toLowerCase();
                            let colourCode: number = 0;
                            if (
                                /* startsWith */ ((str, searchString, position = 0) =>
                                    str.substr(position, searchString.length) === searchString)(s, "yellow:")
                            ) {
                                colourCode = 0;
                                this.chatboxInput = this.chatboxInput.substring(7);
                            } else if (
                                /* startsWith */ ((str, searchString, position = 0) =>
                                    str.substr(position, searchString.length) === searchString)(s, "red:")
                            ) {
                                colourCode = 1;
                                this.chatboxInput = this.chatboxInput.substring(4);
                            } else if (
                                /* startsWith */ ((str, searchString, position = 0) =>
                                    str.substr(position, searchString.length) === searchString)(s, "green:")
                            ) {
                                colourCode = 2;
                                this.chatboxInput = this.chatboxInput.substring(6);
                            } else if (
                                /* startsWith */ ((str, searchString, position = 0) =>
                                    str.substr(position, searchString.length) === searchString)(s, "cyan:")
                            ) {
                                colourCode = 3;
                                this.chatboxInput = this.chatboxInput.substring(5);
                            } else if (
                                /* startsWith */ ((str, searchString, position = 0) =>
                                    str.substr(position, searchString.length) === searchString)(s, "purple:")
                            ) {
                                colourCode = 4;
                                this.chatboxInput = this.chatboxInput.substring(7);
                            } else if (
                                /* startsWith */ ((str, searchString, position = 0) =>
                                    str.substr(position, searchString.length) === searchString)(s, "white:")
                            ) {
                                colourCode = 5;
                                this.chatboxInput = this.chatboxInput.substring(6);
                            } else if (
                                /* startsWith */ ((str, searchString, position = 0) =>
                                    str.substr(position, searchString.length) === searchString)(s, "flash1:")
                            ) {
                                colourCode = 6;
                                this.chatboxInput = this.chatboxInput.substring(7);
                            } else if (
                                /* startsWith */ ((str, searchString, position = 0) =>
                                    str.substr(position, searchString.length) === searchString)(s, "flash2:")
                            ) {
                                colourCode = 7;
                                this.chatboxInput = this.chatboxInput.substring(7);
                            } else if (
                                /* startsWith */ ((str, searchString, position = 0) =>
                                    str.substr(position, searchString.length) === searchString)(s, "flash3:")
                            ) {
                                colourCode = 8;
                                this.chatboxInput = this.chatboxInput.substring(7);
                            } else if (
                                /* startsWith */ ((str, searchString, position = 0) =>
                                    str.substr(position, searchString.length) === searchString)(s, "glow1:")
                            ) {
                                colourCode = 9;
                                this.chatboxInput = this.chatboxInput.substring(6);
                            } else if (
                                /* startsWith */ ((str, searchString, position = 0) =>
                                    str.substr(position, searchString.length) === searchString)(s, "glow2:")
                            ) {
                                colourCode = 10;
                                this.chatboxInput = this.chatboxInput.substring(6);
                            } else if (
                                /* startsWith */ ((str, searchString, position = 0) =>
                                    str.substr(position, searchString.length) === searchString)(s, "glow3:")
                            ) {
                                colourCode = 11;
                                this.chatboxInput = this.chatboxInput.substring(6);
                            }
                            s = this.chatboxInput.toLowerCase();
                            let effectCode: number = 0;
                            if (
                                /* startsWith */ ((str, searchString, position = 0) =>
                                    str.substr(position, searchString.length) === searchString)(s, "wave:")
                            ) {
                                effectCode = 1;
                                this.chatboxInput = this.chatboxInput.substring(5);
                            } else if (
                                /* startsWith */ ((str, searchString, position = 0) =>
                                    str.substr(position, searchString.length) === searchString)(s, "wave2:")
                            ) {
                                effectCode = 2;
                                this.chatboxInput = this.chatboxInput.substring(6);
                            } else if (
                                /* startsWith */ ((str, searchString, position = 0) =>
                                    str.substr(position, searchString.length) === searchString)(s, "shake:")
                            ) {
                                effectCode = 3;
                                this.chatboxInput = this.chatboxInput.substring(6);
                            } else if (
                                /* startsWith */ ((str, searchString, position = 0) =>
                                    str.substr(position, searchString.length) === searchString)(s, "scroll:")
                            ) {
                                effectCode = 4;
                                this.chatboxInput = this.chatboxInput.substring(7);
                            } else if (
                                /* startsWith */ ((str, searchString, position = 0) =>
                                    str.substr(position, searchString.length) === searchString)(s, "slide:")
                            ) {
                                effectCode = 5;
                                this.chatboxInput = this.chatboxInput.substring(6);
                            }
                            this.outBuffer.putOpcode(49);
                            this.outBuffer.putByte(0);
                            const bufPos: number = this.outBuffer.currentPosition;
                            this.outBuffer.putByteNegated(colourCode);
                            this.outBuffer.putByteAdded(effectCode);
                            this.chatBuffer.currentPosition = 0;
                            ChatEncoder.put(this.chatboxInput, this.chatBuffer);
                            this.outBuffer.putBytes(this.chatBuffer.buffer, 0, this.chatBuffer.currentPosition);
                            this.outBuffer.putLength(this.outBuffer.currentPosition - bufPos);
                            this.chatboxInput = ChatEncoder.formatChatMessage(this.chatboxInput);
                            this.chatboxInput = ChatCensor.censorString(this.chatboxInput);
                            Game.localPlayer.forcedChat = this.chatboxInput;
                            Game.localPlayer.textColour = colourCode;
                            Game.localPlayer.textEffect = effectCode;
                            Game.localPlayer.textCycle = 150;
                            if (this.playerRights === 2) {
                                this.addChatMessage("@cr2@" + Game.localPlayer.playerName, Game.localPlayer.forcedChat, 2);
                            } else if (this.playerRights === 1) {
                                this.addChatMessage("@cr1@" + Game.localPlayer.playerName, Game.localPlayer.forcedChat, 2);
                            } else {
                                this.addChatMessage(Game.localPlayer.playerName, Game.localPlayer.forcedChat, 2);
                            }
                            if (this.publicChatMode === 2) {
                                this.publicChatMode = 3;
                                this.aBoolean1212 = true;
                                this.outBuffer.putOpcode(176);
                                this.outBuffer.putByte(this.publicChatMode);
                                this.outBuffer.putByte(this.privateChatMode);
                                this.outBuffer.putByte(this.tradeMode);
                            }
                        }
                        this.chatboxInput = "";
                        this.redrawChatbox = true;
                    }
                }
            }
        }
    }

    public calculateCameraPosition() {
        let i: number = this.anInt874 * 128 + 64;
        let j: number = this.anInt875 * 128 + 64;
        let k: number = this.getTileHeight(j, i, (9 as number) | 0, this.plane) - this.anInt876;
        if (this.cameraX < i) {
            this.cameraX += this.anInt877 + ((((i - this.cameraX) * this.anInt878) / 1000) | 0);
            if (this.cameraX > i) {
                this.cameraX = i;
            }
        }
        if (this.cameraX > i) {
            this.cameraX -= this.anInt877 + ((((this.cameraX - i) * this.anInt878) / 1000) | 0);
            if (this.cameraX < i) {
                this.cameraX = i;
            }
        }
        if (this.cameraZ < k) {
            this.cameraZ += this.anInt877 + ((((k - this.cameraZ) * this.anInt878) / 1000) | 0);
            if (this.cameraZ > k) {
                this.cameraZ = k;
            }
        }
        if (this.cameraZ > k) {
            this.cameraZ -= this.anInt877 + ((((this.cameraZ - k) * this.anInt878) / 1000) | 0);
            if (this.cameraZ < k) {
                this.cameraZ = k;
            }
        }
        if (this.cameraY < j) {
            this.cameraY += this.anInt877 + ((((j - this.cameraY) * this.anInt878) / 1000) | 0);
            if (this.cameraY > j) {
                this.cameraY = j;
            }
        }
        if (this.cameraY > j) {
            this.cameraY -= this.anInt877 + ((((this.cameraY - j) * this.anInt878) / 1000) | 0);
            if (this.cameraY < j) {
                this.cameraY = j;
            }
        }
        i = this.anInt993 * 128 + 64;
        j = this.anInt994 * 128 + 64;
        k = this.getTileHeight(j, i, (9 as number) | 0, this.plane) - this.anInt995;
        const l: number = i - this.cameraX;
        const i1: number = k - this.cameraZ;
        const j1: number = j - this.cameraY;
        const k1: number = (Math.sqrt(l * l + j1 * j1) as number) | 0;
        let l1: number = (((Math.atan2(i1, k1) * 325.949) as number) | 0) & 2047;
        const j2: number = (((Math.atan2(l, j1) * -325.949) as number) | 0) & 2047;
        if (l1 < 128) {
            l1 = 128;
        }
        if (l1 > 383) {
            l1 = 383;
        }
        if (this.cameraPitch < l1) {
            this.cameraPitch += this.anInt996 + ((((l1 - this.cameraPitch) * this.anInt997) / 1000) | 0);
            if (this.cameraPitch > l1) {
                this.cameraPitch = l1;
            }
        }
        if (this.cameraPitch > l1) {
            this.cameraPitch -= this.anInt996 + ((((this.cameraPitch - l1) * this.anInt997) / 1000) | 0);
            if (this.cameraPitch < l1) {
                this.cameraPitch = l1;
            }
        }
        let k2: number = j2 - this.cameraYaw;
        if (k2 > 1024) {
            k2 -= 2048;
        }
        if (k2 < -1024) {
            k2 += 2048;
        }
        if (k2 > 0) {
            this.cameraYaw += this.anInt996 + (((k2 * this.anInt997) / 1000) | 0);
            this.cameraYaw &= 2047;
        }
        if (k2 < 0) {
            this.cameraYaw -= this.anInt996 + (((-k2 * this.anInt997) / 1000) | 0);
            this.cameraYaw &= 2047;
        }
        let l2: number = j2 - this.cameraYaw;
        if (l2 > 1024) {
            l2 -= 2048;
        }
        if (l2 < -1024) {
            l2 += 2048;
        }
        if ((l2 < 0 && k2 > 0) || (l2 > 0 && k2 < 0)) {
            this.cameraYaw = j2;
        }
    }

    public checkForGameUsages(i: number) {
        i = (61 / i) | 0;
        try {
            const j: number = Game.localPlayer.worldX + this.anInt853;
            const k: number = Game.localPlayer.worldY + this.anInt1009;
            if (this.anInt1262 - j < -500 || this.anInt1262 - j > 500 || this.anInt1263 - k < -500 || this.anInt1263 - k > 500) {
                this.anInt1262 = j;
                this.anInt1263 = k;
            }
            if (this.anInt1262 !== j) {
                this.anInt1262 += ((j - this.anInt1262) / 16) | 0;
            }
            if (this.anInt1263 !== k) {
                this.anInt1263 += ((k - this.anInt1263) / 16) | 0;
            }
            if (this.keyStatus[1] === 1) {
                this.anInt1186 += ((-24 - this.anInt1186) / 2) | 0;
            } else if (this.keyStatus[2] === 1) {
                this.anInt1186 += ((24 - this.anInt1186) / 2) | 0;
            } else {
                this.anInt1186 = (n => (n < 0 ? Math.ceil(n) : Math.floor(n)))(this.anInt1186 / 2);
            }
            if (this.keyStatus[3] === 1) {
                this.anInt1187 += ((12 - this.anInt1187) / 2) | 0;
            } else if (this.keyStatus[4] === 1) {
                this.anInt1187 += ((-12 - this.anInt1187) / 2) | 0;
            } else {
                this.anInt1187 = (n => (n < 0 ? Math.ceil(n) : Math.floor(n)))(this.anInt1187 / 2);
            }
            this.cameraHorizontal = (this.cameraHorizontal + ((this.anInt1186 / 2) | 0)) & 2047;
            this.anInt1251 += (this.anInt1187 / 2) | 0;
            if (this.anInt1251 < 128) {
                this.anInt1251 = 128;
            }
            if (this.anInt1251 > 383) {
                this.anInt1251 = 383;
            }
            const l: number = this.anInt1262 >> 7;
            const i1: number = this.anInt1263 >> 7;
            const j1: number = this.getTileHeight(this.anInt1263, this.anInt1262, (9 as number) | 0, this.plane);
            let k1: number = 0;
            if (l > 3 && i1 > 3 && l < 100 && i1 < 100) {
                for (let l1: number = l - 4; l1 <= l + 4; l1++) {
                    {
                        for (let j2: number = i1 - 4; j2 <= i1 + 4; j2++) {
                            {
                                let k2: number = this.plane;
                                if (k2 < 3 && (this.currentSceneTileFlags[1][l1][j2] & 2) === 2) {
                                    k2++;
                                }
                                const l2: number = j1 - this.anIntArrayArrayArray891[k2][l1][j2];
                                if (l2 > k1) {
                                    k1 = l2;
                                }
                            }
                        }
                    }
                }
            }
            let i2: number = k1 * 192;
            if (i2 > 98048) {
                i2 = 98048;
            }
            if (i2 < 32768) {
                i2 = 32768;
            }
            if (i2 > this.anInt1289) {
                this.anInt1289 += ((i2 - this.anInt1289) / 24) | 0;
                return;
            }
            if (i2 < this.anInt1289) {
                this.anInt1289 += ((i2 - this.anInt1289) / 80) | 0;
                return;
            }
        } catch (_ex) {
            SignLink.reportError(
                "glfc_ex " +
                    Game.localPlayer.worldX +
                    "," +
                    Game.localPlayer.worldY +
                    "," +
                    this.anInt1262 +
                    "," +
                    this.anInt1263 +
                    "," +
                    this.chunkX +
                    "," +
                    this.chunkY +
                    "," +
                    this.nextTopLeftTileX +
                    "," +
                    this.nextTopRightTileY
            );
            throw Error("eek");
        }
    }

    public method39(flag: boolean) {
        if (!flag) {
            this.groundItems = null;
        }
        if (this.clickType === 1) {
            if (this.clickX >= 6 && this.clickX <= 106 && this.clickY >= 467 && this.clickY <= 499) {
                this.publicChatMode = (this.publicChatMode + 1) % 4;
                this.aBoolean1212 = true;
                this.redrawChatbox = true;
                this.outBuffer.putOpcode(176);
                this.outBuffer.putByte(this.publicChatMode);
                this.outBuffer.putByte(this.privateChatMode);
                this.outBuffer.putByte(this.tradeMode);
            }
            if (this.clickX >= 135 && this.clickX <= 235 && this.clickY >= 467 && this.clickY <= 499) {
                this.privateChatMode = (this.privateChatMode + 1) % 3;
                this.aBoolean1212 = true;
                this.redrawChatbox = true;
                this.outBuffer.putOpcode(176);
                this.outBuffer.putByte(this.publicChatMode);
                this.outBuffer.putByte(this.privateChatMode);
                this.outBuffer.putByte(this.tradeMode);
            }
            if (this.clickX >= 273 && this.clickX <= 373 && this.clickY >= 467 && this.clickY <= 499) {
                this.tradeMode = (this.tradeMode + 1) % 3;
                this.aBoolean1212 = true;
                this.redrawChatbox = true;
                this.outBuffer.putOpcode(176);
                this.outBuffer.putByte(this.publicChatMode);
                this.outBuffer.putByte(this.privateChatMode);
                this.outBuffer.putByte(this.tradeMode);
            }
            if (this.clickX >= 412 && this.clickX <= 512 && this.clickY >= 467 && this.clickY <= 499) {
                if (this.openInterfaceId === -1) {
                    this.closeWidgets();
                    this.reportedName = "";
                    this.reportMutePlayer = false;
                    this.reportAbuseInterfaceID = this.openInterfaceId = Widget.anInt246;
                } else {
                    this.addChatMessage("", "Please close the interface you have open before using 'report abuse'", 0);
                }

                Game.anInt1160++;
                if (Game.anInt1160 > 161) {
                    Game.anInt1160 = 0;
                    this.outBuffer.putOpcode(22);
                    this.outBuffer.putShort(38304);
                }
            }
        }
    }

    public method21(flag: boolean) {
        if (flag) {
            return;
        }
        if (this.clickType === 1) {
            if (this.clickX >= 539 && this.clickX <= 573 && this.clickY >= 169 && this.clickY < 205 && this.anIntArray1081[0] !== -1) {
                this.redrawTabArea = true;
                this.anInt1285 = 0;
                this.aBoolean950 = true;
            }
            if (this.clickX >= 569 && this.clickX <= 599 && this.clickY >= 168 && this.clickY < 205 && this.anIntArray1081[1] !== -1) {
                this.redrawTabArea = true;
                this.anInt1285 = 1;
                this.aBoolean950 = true;
            }
            if (this.clickX >= 597 && this.clickX <= 627 && this.clickY >= 168 && this.clickY < 205 && this.anIntArray1081[2] !== -1) {
                this.redrawTabArea = true;
                this.anInt1285 = 2;
                this.aBoolean950 = true;
            }
            if (this.clickX >= 625 && this.clickX <= 669 && this.clickY >= 168 && this.clickY < 203 && this.anIntArray1081[3] !== -1) {
                this.redrawTabArea = true;
                this.anInt1285 = 3;
                this.aBoolean950 = true;
            }
            if (this.clickX >= 666 && this.clickX <= 696 && this.clickY >= 168 && this.clickY < 205 && this.anIntArray1081[4] !== -1) {
                this.redrawTabArea = true;
                this.anInt1285 = 4;
                this.aBoolean950 = true;
            }
            if (this.clickX >= 694 && this.clickX <= 724 && this.clickY >= 168 && this.clickY < 205 && this.anIntArray1081[5] !== -1) {
                this.redrawTabArea = true;
                this.anInt1285 = 5;
                this.aBoolean950 = true;
            }
            if (this.clickX >= 722 && this.clickX <= 756 && this.clickY >= 169 && this.clickY < 205 && this.anIntArray1081[6] !== -1) {
                this.redrawTabArea = true;
                this.anInt1285 = 6;
                this.aBoolean950 = true;
            }
            if (this.clickX >= 540 && this.clickX <= 574 && this.clickY >= 466 && this.clickY < 502 && this.anIntArray1081[7] !== -1) {
                this.redrawTabArea = true;
                this.anInt1285 = 7;
                this.aBoolean950 = true;
            }
            if (this.clickX >= 572 && this.clickX <= 602 && this.clickY >= 466 && this.clickY < 503 && this.anIntArray1081[8] !== -1) {
                this.redrawTabArea = true;
                this.anInt1285 = 8;
                this.aBoolean950 = true;
            }
            if (this.clickX >= 599 && this.clickX <= 629 && this.clickY >= 466 && this.clickY < 503 && this.anIntArray1081[9] !== -1) {
                this.redrawTabArea = true;
                this.anInt1285 = 9;
                this.aBoolean950 = true;
            }
            if (this.clickX >= 627 && this.clickX <= 671 && this.clickY >= 467 && this.clickY < 502 && this.anIntArray1081[10] !== -1) {
                this.redrawTabArea = true;
                this.anInt1285 = 10;
                this.aBoolean950 = true;
            }
            if (this.clickX >= 669 && this.clickX <= 699 && this.clickY >= 466 && this.clickY < 503 && this.anIntArray1081[11] !== -1) {
                this.redrawTabArea = true;
                this.anInt1285 = 11;
                this.aBoolean950 = true;
            }
            if (this.clickX >= 696 && this.clickX <= 726 && this.clickY >= 466 && this.clickY < 503 && this.anIntArray1081[12] !== -1) {
                this.redrawTabArea = true;
                this.anInt1285 = 12;
                this.aBoolean950 = true;
            }
            if (this.clickX >= 724 && this.clickX <= 758 && this.clickY >= 466 && this.clickY < 502 && this.anIntArray1081[13] !== -1) {
                this.redrawTabArea = true;
                this.anInt1285 = 13;
                this.aBoolean950 = true;
            }
        }
    }

    public method146(byte0: number) {
        if (byte0 !== 4) {
            return;
        }
        if (this.minimapState !== 0) {
            return;
        }
        if (this.clickType === 1) {
            let i: number = this.clickX - 25 - 550;
            let j: number = this.clickY - 5 - 4;
            if (i >= 0 && j >= 0 && i < 146 && j < 151) {
                i -= 73;
                j -= 75;
                const k: number = (this.cameraHorizontal + this.anInt916) & 2047;
                let l: number = Rasterizer3D.SINE[k];
                let i1: number = Rasterizer3D.COSINE[k];
                l = (l * (this.anInt1233 + 256)) >> 8;
                i1 = (i1 * (this.anInt1233 + 256)) >> 8;
                const j1: number = (j * l + i * i1) >> 11;
                const k1: number = (j * i1 - i * l) >> 11;
                const l1: number = (Game.localPlayer.worldX + j1) >> 7;
                const i2: number = (Game.localPlayer.worldY - k1) >> 7;
                const flag: boolean = this.walk(
                    true,
                    false,
                    i2,
                    Game.localPlayer.pathY[0],
                    0,
                    0,
                    1,
                    0,
                    l1,
                    0,
                    0,
                    Game.localPlayer.pathX[0]
                );
                if (flag) {
                    this.outBuffer.putByte(i);
                    this.outBuffer.putByte(j);
                    this.outBuffer.putShort(this.cameraHorizontal);
                    this.outBuffer.putByte(57);
                    this.outBuffer.putByte(this.anInt916);
                    this.outBuffer.putByte(this.anInt1233);
                    this.outBuffer.putByte(89);
                    this.outBuffer.putShort(Game.localPlayer.worldX);
                    this.outBuffer.putShort(Game.localPlayer.worldY);
                    this.outBuffer.putByte(this.anInt1126);
                    this.outBuffer.putByte(63);
                }
            }
        }
    }

    public processMenuClick() {
        if (this.activeInterfaceType !== 0) {
            return;
        }
        let meta: number = this.clickType;
        if (this.widgetSelected === 1 && this.clickX >= 516 && this.clickY >= 160 && this.clickX <= 765 && this.clickY <= 205) {
            meta = 0;
        }
        if (this.menuOpen) {
            if (meta !== 1) {
                let x: number = this.mouseX;
                let y: number = this.mouseY;
                if (this.anInt1304 === 0) {
                    x -= 4;
                    y -= 4;
                }
                if (this.anInt1304 === 1) {
                    x -= 553;
                    y -= 205;
                }
                if (this.anInt1304 === 2) {
                    x -= 17;
                    y -= 357;
                }
                if (
                    x < this.menuClickX - 10 ||
                    x > this.menuClickX + this.anInt1307 + 10 ||
                    y < this.menuClickY - 10 ||
                    y > this.menuClickY + this.anInt1308 + 10
                ) {
                    this.menuOpen = false;
                    if (this.anInt1304 === 1) {
                        this.redrawTabArea = true;
                    }
                    if (this.anInt1304 === 2) {
                        this.redrawChatbox = true;
                    }
                }
            }
            if (meta === 1) {
                const menuX: number = this.menuClickX;
                const menuY: number = this.menuClickY;
                const dx: number = this.anInt1307;
                let x: number = this.clickX;
                let y: number = this.clickY;
                if (this.anInt1304 === 0) {
                    x -= 4;
                    y -= 4;
                }
                if (this.anInt1304 === 1) {
                    x -= 553;
                    y -= 205;
                }
                if (this.anInt1304 === 2) {
                    x -= 17;
                    y -= 357;
                }
                let id: number = -1;
                for (let row: number = 0; row < this.menuActionRow; row++) {
                    {
                        const k3: number = menuY + 31 + (this.menuActionRow - 1 - row) * 15;
                        if (x > menuX && x < menuX + dx && y > k3 - 13 && y < k3 + 3) {
                            id = row;
                        }
                    }
                }
                if (id !== -1) {
                    this.processMenuActions(id);
                }
                this.menuOpen = false;
                if (this.anInt1304 === 1) {
                    this.redrawTabArea = true;
                }
                if (this.anInt1304 === 2) {
                    this.redrawChatbox = true;
                    return;
                }
            }
        } else {
            if (meta === 1 && this.menuActionRow > 0) {
                const action: number = this.menuActionTypes[this.menuActionRow - 1];
                if (
                    action === 9 ||
                    action === 225 ||
                    action === 444 ||
                    action === 564 ||
                    action === 894 ||
                    action === 961 ||
                    action === 399 ||
                    action === 324 ||
                    action === 227 ||
                    action === 891 ||
                    action === 52 ||
                    action === Actions.EXAMINE_ITEM
                ) {
                    const item: number = this.firstMenuOperand[this.menuActionRow - 1];
                    const id: number = this.secondMenuOperand[this.menuActionRow - 1];
                    const widget: Widget = Widget.forId(id);
                    if (widget.itemSwapable || widget.itemDeletesDraged) {
                        this.aBoolean1155 = false;
                        this.anInt1269 = 0;
                        this.modifiedWidgetId = id;
                        this.selectedInventorySlot = item;
                        this.activeInterfaceType = 2;
                        this.anInt1114 = this.clickX;
                        this.anInt1115 = this.clickY;
                        if (Widget.forId(id).parentId === this.openInterfaceId) {
                            this.activeInterfaceType = 1;
                        }
                        if (Widget.forId(id).parentId === this.backDialogueId) {
                            this.activeInterfaceType = 3;
                        }
                        return;
                    }
                }
            }
            if (
                meta === 1 &&
                (this.anInt1300 === 1 || this.menuHasAddFriend(this.menuActionRow - 1, this.aByte1161)) &&
                this.menuActionRow > 2
            ) {
                meta = 2;
            }
            if (meta === 1 && this.menuActionRow > 0) {
                this.processMenuActions(this.menuActionRow - 1);
            }
            if (meta === 2 && this.menuActionRow > 0) {
                this.determineMenuSize();
            }
        }
    }

    /*private*/ public determineMenuSize() {
        let width: number = this.fontBold.getStringEffectWidth("Choose Option");
        for (let i: number = 0; i < this.menuActionRow; i++) {
            {
                const rowWidth: number = this.fontBold.getStringEffectWidth(this.menuActionTexts[i]);
                if (rowWidth > width) {
                    width = rowWidth;
                }
            }
        }
        width += 8;
        const height: number = 15 * this.menuActionRow + 21;
        if (this.clickX > 4 && this.clickY > 4 && this.clickX < 516 && this.clickY < 338) {
            let x: number = this.clickX - 4 - ((width / 2) | 0);
            if (x + width > 512) {
                x = 512 - width;
            }
            if (x < 0) {
                x = 0;
            }
            let y: number = this.clickY - 4;
            if (y + height > 334) {
                y = 334 - height;
            }
            if (y < 0) {
                y = 0;
            }
            this.menuOpen = true;
            this.anInt1304 = 0;
            this.menuClickX = x;
            this.menuClickY = y;
            this.anInt1307 = width;
            this.anInt1308 = height + 1;
        }
        if (this.clickX > 553 && this.clickY > 205 && this.clickX < 743 && this.clickY < 466) {
            let x: number = this.clickX - 553 - ((width / 2) | 0);
            if (x < 0) {
                x = 0;
            } else if (x + width > 190) {
                x = 190 - width;
            }
            let y: number = this.clickY - 205;
            if (y < 0) {
                y = 0;
            } else if (y + height > 261) {
                y = 261 - height;
            }
            this.menuOpen = true;
            this.anInt1304 = 1;
            this.menuClickX = x;
            this.menuClickY = y;
            this.anInt1307 = width;
            this.anInt1308 = height + 1;
        }
        if (this.clickX > 17 && this.clickY > 357 && this.clickX < 496 && this.clickY < 453) {
            let x: number = this.clickX - 17 - ((width / 2) | 0);
            if (x < 0) {
                x = 0;
            } else if (x + width > 479) {
                x = 479 - width;
            }
            let y: number = this.clickY - 357;
            if (y < 0) {
                y = 0;
            } else if (y + height > 96) {
                y = 96 - height;
            }
            this.menuOpen = true;
            this.anInt1304 = 2;
            this.menuClickX = x;
            this.menuClickY = y;
            this.anInt1307 = width;
            this.anInt1308 = height + 1;
        }
    }

    public walk(
        flag: boolean,
        flag1: boolean,
        dstY: number,
        srcY: number,
        k: number,
        l: number,
        packetType: number,
        j1: number,
        dstX: number,
        l1: number,
        i2: number,
        srcX: number
    ): boolean {
        const byte0: number = 104;
        const byte1: number = 104;
        for (let x: number = 0; x < byte0; x++) {
            {
                for (let y: number = 0; y < byte1; y++) {
                    {
                        this.anIntArrayArray885[x][y] = 0;
                        this.cost[x][y] = 99999999;
                    }
                }
            }
        }
        let curX: number = srcX;
        let curY: number = srcY;
        this.anIntArrayArray885[srcX][srcY] = 99;
        this.cost[srcX][srcY] = 0;
        let k3: number = 0;
        let l3: number = 0;
        this.anIntArray1123[k3] = srcX;
        this.anIntArray1124[k3++] = srcY;
        let flag2: boolean = false;
        const i4: number = this.anIntArray1123.length;
        const masks: number[][] = this.currentCollisionMap[this.plane].adjacency;
        while (l3 !== k3) {
            {
                curX = this.anIntArray1123[l3];
                curY = this.anIntArray1124[l3];
                l3 = (l3 + 1) % i4;
                if (curX === dstX && curY === dstY) {
                    flag2 = true;
                    break;
                }
                if (j1 !== 0) {
                    if ((j1 < 5 || j1 === 10) && this.currentCollisionMap[this.plane].reachedWall(curX, curY, dstX, dstY, j1 - 1, i2)) {
                        flag2 = true;
                        break;
                    }
                    if (j1 < 10 && this.currentCollisionMap[this.plane].reachedWallDecoration(curX, curY, dstX, dstY, j1 - 1, i2)) {
                        flag2 = true;
                        break;
                    }
                }
                if (k !== 0 && l !== 0 && this.currentCollisionMap[this.plane].reachedFacingObject(curX, curY, dstX, dstY, k, l, l1)) {
                    flag2 = true;
                    break;
                }
                const nextCost: number = this.cost[curX][curY] + 1;
                if (curX > 0 && this.anIntArrayArray885[curX - 1][curY] === 0 && (masks[curX - 1][curY] & 19398920) === 0) {
                    this.anIntArray1123[k3] = curX - 1;
                    this.anIntArray1124[k3] = curY;
                    k3 = (k3 + 1) % i4;
                    this.anIntArrayArray885[curX - 1][curY] = 2;
                    this.cost[curX - 1][curY] = nextCost;
                }
                if (curX < byte0 - 1 && this.anIntArrayArray885[curX + 1][curY] === 0 && (masks[curX + 1][curY] & 19399040) === 0) {
                    this.anIntArray1123[k3] = curX + 1;
                    this.anIntArray1124[k3] = curY;
                    k3 = (k3 + 1) % i4;
                    this.anIntArrayArray885[curX + 1][curY] = 8;
                    this.cost[curX + 1][curY] = nextCost;
                }
                if (curY > 0 && this.anIntArrayArray885[curX][curY - 1] === 0 && (masks[curX][curY - 1] & 19398914) === 0) {
                    this.anIntArray1123[k3] = curX;
                    this.anIntArray1124[k3] = curY - 1;
                    k3 = (k3 + 1) % i4;
                    this.anIntArrayArray885[curX][curY - 1] = 1;
                    this.cost[curX][curY - 1] = nextCost;
                }
                if (curY < byte1 - 1 && this.anIntArrayArray885[curX][curY + 1] === 0 && (masks[curX][curY + 1] & 19398944) === 0) {
                    this.anIntArray1123[k3] = curX;
                    this.anIntArray1124[k3] = curY + 1;
                    k3 = (k3 + 1) % i4;
                    this.anIntArrayArray885[curX][curY + 1] = 4;
                    this.cost[curX][curY + 1] = nextCost;
                }
                if (
                    curX > 0 &&
                    curY > 0 &&
                    this.anIntArrayArray885[curX - 1][curY - 1] === 0 &&
                    (masks[curX - 1][curY - 1] & 19398926) === 0 &&
                    (masks[curX - 1][curY] & 19398920) === 0 &&
                    (masks[curX][curY - 1] & 19398914) === 0
                ) {
                    this.anIntArray1123[k3] = curX - 1;
                    this.anIntArray1124[k3] = curY - 1;
                    k3 = (k3 + 1) % i4;
                    this.anIntArrayArray885[curX - 1][curY - 1] = 3;
                    this.cost[curX - 1][curY - 1] = nextCost;
                }
                if (
                    curX < byte0 - 1 &&
                    curY > 0 &&
                    this.anIntArrayArray885[curX + 1][curY - 1] === 0 &&
                    (masks[curX + 1][curY - 1] & 19399043) === 0 &&
                    (masks[curX + 1][curY] & 19399040) === 0 &&
                    (masks[curX][curY - 1] & 19398914) === 0
                ) {
                    this.anIntArray1123[k3] = curX + 1;
                    this.anIntArray1124[k3] = curY - 1;
                    k3 = (k3 + 1) % i4;
                    this.anIntArrayArray885[curX + 1][curY - 1] = 9;
                    this.cost[curX + 1][curY - 1] = nextCost;
                }
                if (
                    curX > 0 &&
                    curY < byte1 - 1 &&
                    this.anIntArrayArray885[curX - 1][curY + 1] === 0 &&
                    (masks[curX - 1][curY + 1] & 19398968) === 0 &&
                    (masks[curX - 1][curY] & 19398920) === 0 &&
                    (masks[curX][curY + 1] & 19398944) === 0
                ) {
                    this.anIntArray1123[k3] = curX - 1;
                    this.anIntArray1124[k3] = curY + 1;
                    k3 = (k3 + 1) % i4;
                    this.anIntArrayArray885[curX - 1][curY + 1] = 6;
                    this.cost[curX - 1][curY + 1] = nextCost;
                }
                if (
                    curX < byte0 - 1 &&
                    curY < byte1 - 1 &&
                    this.anIntArrayArray885[curX + 1][curY + 1] === 0 &&
                    (masks[curX + 1][curY + 1] & 19399136) === 0 &&
                    (masks[curX + 1][curY] & 19399040) === 0 &&
                    (masks[curX][curY + 1] & 19398944) === 0
                ) {
                    this.anIntArray1123[k3] = curX + 1;
                    this.anIntArray1124[k3] = curY + 1;
                    k3 = (k3 + 1) % i4;
                    this.anIntArrayArray885[curX + 1][curY + 1] = 12;
                    this.cost[curX + 1][curY + 1] = nextCost;
                }
            }
        }
        this.anInt1126 = 0;
        if (!flag2) {
            if (flag) {
                let l4: number = 1000;
                let j5: number = 100;
                const byte2: number = 10;
                for (let i6: number = dstX - byte2; i6 <= dstX + byte2; i6++) {
                    {
                        for (let k6: number = dstY - byte2; k6 <= dstY + byte2; k6++) {
                            if (i6 >= 0 && k6 >= 0 && i6 < 104 && k6 < 104 && this.cost[i6][k6] < 100) {
                                let i7: number = 0;
                                if (i6 < dstX) {
                                    i7 = dstX - i6;
                                } else if (i6 > dstX + k - 1) {
                                    i7 = i6 - (dstX + k - 1);
                                }
                                let j7: number = 0;
                                if (k6 < dstY) {
                                    j7 = dstY - k6;
                                } else if (k6 > dstY + l - 1) {
                                    j7 = k6 - (dstY + l - 1);
                                }
                                const k7: number = i7 * i7 + j7 * j7;
                                if (k7 < l4 || (k7 === l4 && this.cost[i6][k6] < j5)) {
                                    l4 = k7;
                                    j5 = this.cost[i6][k6];
                                    curX = i6;
                                    curY = k6;
                                }
                            }
                        }
                    }
                }
                if (l4 === 1000) {
                    return false;
                }
                if (curX === srcX && curY === srcY) {
                    return false;
                }
                this.anInt1126 = 1;
            } else {
                return false;
            }
        }
        l3 = 0;
        if (flag1) {
            this.startUp();
        }
        this.anIntArray1123[l3] = curX;
        this.anIntArray1124[l3++] = curY;
        let k5: number;
        for (
            let i5: number = (k5 = this.anIntArrayArray885[curX][curY]);
            curX !== srcX || curY !== srcY;
            i5 = this.anIntArrayArray885[curX][curY]
        ) {
            {
                if (i5 !== k5) {
                    k5 = i5;
                    this.anIntArray1123[l3] = curX;
                    this.anIntArray1124[l3++] = curY;
                }
                if ((i5 & 2) !== 0) {
                    curX++;
                } else if ((i5 & 8) !== 0) {
                    curX--;
                }
                if ((i5 & 1) !== 0) {
                    curY++;
                } else if ((i5 & 4) !== 0) {
                    curY--;
                }
            }
        }
        if (l3 > 0) {
            let j4: number = l3;
            if (j4 > 25) {
                j4 = 25;
            }
            l3--;
            const l5: number = this.anIntArray1123[l3];
            const j6: number = this.anIntArray1124[l3];
            if (packetType === 0) {
                this.outBuffer.putOpcode(28);
                this.outBuffer.putByte(j4 + j4 + 3);
            }
            if (packetType === 1) {
                this.outBuffer.putOpcode(213);
                this.outBuffer.putByte(j4 + j4 + 3 + 14);
            }
            if (packetType === 2) {
                this.outBuffer.putOpcode(247);
                this.outBuffer.putByte(j4 + j4 + 3);
            }
            this.outBuffer.putLEShortAdded(l5 + this.nextTopLeftTileX);
            this.outBuffer.putByte(this.keyStatus[5] !== 1 ? 0 : 1);
            this.outBuffer.putLEShortAdded(j6 + this.nextTopRightTileY);
            this.destinationX = this.anIntArray1123[0];
            this.destinationY = this.anIntArray1124[0];
            for (let l6: number = 1; l6 < j4; l6++) {
                {
                    l3--;
                    this.outBuffer.putByte(this.anIntArray1123[l3] - l5);
                    this.outBuffer.putByteSubtracted(this.anIntArray1124[l3] - j6);
                }
            }
            return true;
        }
        return packetType !== 1;
    }

    public menuHasAddFriend(i: number, byte0: number): boolean {
        if (i < 0) {
            return false;
        }
        let j: number = this.menuActionTypes[i];
        if (byte0 !== 97) {
            throw Error("NullPointerException");
        }
        if (j >= 2000) {
            j -= 2000;
        }
        return j === 762;
    }

    public processRightClick(i: number) {
        if (this.activeInterfaceType !== 0) {
            return;
        }
        this.menuActionTexts[0] = "Cancel";
        this.menuActionTypes[0] = 1016;
        this.menuActionRow = 1;
        if (i >= 0) {
            this.anInt1004 = this.incomingRandom.nextInt() | 0;
        }
        if (this.anInt1053 !== -1) {
            this.anInt915 = 0;
            this.anInt1315 = 0;
            this.method66(0, Widget.forId(this.anInt1053), 0, 0, 0, this.mouseX, 23658, this.mouseY);
            if (this.anInt915 !== this.anInt1302) {
                this.anInt1302 = this.anInt915;
            }
            if (this.anInt1315 !== this.anInt1129) {
                this.anInt1129 = this.anInt1315;
            }
            return;
        }
        this.method111(this.anInt1178);
        this.anInt915 = 0;
        this.anInt1315 = 0;
        if (this.mouseX > 4 && this.mouseY > 4 && this.mouseX < 516 && this.mouseY < 338) {
            if (this.openInterfaceId !== -1) {
                this.method66(4, Widget.forId(this.openInterfaceId), 0, 0, 4, this.mouseX, 23658, this.mouseY);
            } else {
                this.method43((7 as number) | 0);
            }
        }
        if (this.anInt915 !== this.anInt1302) {
            this.anInt1302 = this.anInt915;
        }
        if (this.anInt1315 !== this.anInt1129) {
            this.anInt1129 = this.anInt1315;
        }
        this.anInt915 = 0;
        this.anInt1315 = 0;
        if (this.mouseX > 553 && this.mouseY > 205 && this.mouseX < 743 && this.mouseY < 466) {
            if (this.anInt1089 !== -1) {
                this.method66(205, Widget.forId(this.anInt1089), 1, 0, 553, this.mouseX, 23658, this.mouseY);
            } else if (this.anIntArray1081[this.anInt1285] !== -1) {
                this.method66(205, Widget.forId(this.anIntArray1081[this.anInt1285]), 1, 0, 553, this.mouseX, 23658, this.mouseY);
            }
        }
        if (this.anInt915 !== this.anInt1280) {
            this.redrawTabArea = true;
            this.anInt1280 = this.anInt915;
        }
        if (this.anInt1315 !== this.anInt1044) {
            this.redrawTabArea = true;
            this.anInt1044 = this.anInt1315;
        }
        this.anInt915 = 0;
        this.anInt1315 = 0;
        if (this.mouseX > 17 && this.mouseY > 357 && this.mouseX < 496 && this.mouseY < 453) {
            if (this.backDialogueId !== -1) {
                this.method66(357, Widget.forId(this.backDialogueId), 2, 0, 17, this.mouseX, 23658, this.mouseY);
            } else if (this.dialogueId !== -1) {
                this.method66(357, Widget.forId(this.dialogueId), 3, 0, 17, this.mouseX, 23658, this.mouseY);
            } else if (this.mouseY < 434 && this.mouseX < 426 && this.inputType === 0) {
                this.method113(466, this.mouseX - 17, this.mouseY - 357);
            }
        }
        if ((this.backDialogueId !== -1 || this.dialogueId !== -1) && this.anInt915 !== this.anInt1106) {
            this.redrawChatbox = true;
            this.anInt1106 = this.anInt915;
        }
        if ((this.backDialogueId !== -1 || this.dialogueId !== -1) && this.anInt1315 !== this.anInt1284) {
            this.redrawChatbox = true;
            this.anInt1284 = this.anInt1315;
        }
        for (let flag: boolean = false; !flag; ) {
            {
                flag = true;
                for (let j: number = 0; j < this.menuActionRow - 1; j++) {
                    if (this.menuActionTypes[j] < 1000 && this.menuActionTypes[j + 1] > 1000) {
                        const s: string = this.menuActionTexts[j];
                        this.menuActionTexts[j] = this.menuActionTexts[j + 1];
                        this.menuActionTexts[j + 1] = s;
                        let k: number = this.menuActionTypes[j];
                        this.menuActionTypes[j] = this.menuActionTypes[j + 1];
                        this.menuActionTypes[j + 1] = k;
                        k = this.firstMenuOperand[j];
                        this.firstMenuOperand[j] = this.firstMenuOperand[j + 1];
                        this.firstMenuOperand[j + 1] = k;
                        k = this.secondMenuOperand[j];
                        this.secondMenuOperand[j] = this.secondMenuOperand[j + 1];
                        this.secondMenuOperand[j + 1] = k;
                        k = this.selectedMenuActions[j];
                        this.selectedMenuActions[j] = this.selectedMenuActions[j + 1];
                        this.selectedMenuActions[j + 1] = k;
                        flag = false;
                    }
                }
            }
        }
    }

    public method113(i: number, j: number, k: number) {
        let l: number = 0;
        i = (44 / i) | 0;
        for (let i1: number = 0; i1 < 100; i1++) {
            {
                if (this.chatMessages[i1] == null) {
                    continue;
                }
                const j1: number = this.chatTypes[i1];
                const k1: number = 70 - l * 14 + this.anInt851 + 4;
                if (k1 < -20) {
                    break;
                }
                let s: string = this.chatPlayerNames[i1];
                if (
                    s != null &&
                    /* startsWith */ ((str, searchString, position = 0) => str.substr(position, searchString.length) === searchString)(
                        s,
                        "@cr1@"
                    )
                ) {
                    s = s.substring(5);
                }
                if (
                    s != null &&
                    /* startsWith */ ((str, searchString, position = 0) => str.substr(position, searchString.length) === searchString)(
                        s,
                        "@cr2@"
                    )
                ) {
                    s = s.substring(5);
                }
                if (j1 === 0) {
                    l++;
                }
                if (
                    (j1 === 1 || j1 === 2) &&
                    (j1 === 1 || this.publicChatMode === 0 || (this.publicChatMode === 1 && this.method148(13292, s)))
                ) {
                    if (
                        k > k1 - 14 &&
                        k <= k1 &&
                        !/* equals */ (((o1: any, o2: any) => {
                            if (o1 && o1.equals) {
                                return o1.equals(o2);
                            } else {
                                return o1 === o2;
                            }
                        })(s, Game.localPlayer.playerName) as any)
                    ) {
                        if (this.playerRights >= 1) {
                            this.menuActionTexts[this.menuActionRow] = "Report abuse @whi@" + s;
                            this.menuActionTypes[this.menuActionRow] = 507;
                            this.menuActionRow++;
                        }
                        this.menuActionTexts[this.menuActionRow] = "Add ignore @whi@" + s;
                        this.menuActionTypes[this.menuActionRow] = 574;
                        this.menuActionRow++;
                        this.menuActionTexts[this.menuActionRow] = "Add friend @whi@" + s;
                        this.menuActionTypes[this.menuActionRow] = 762;
                        this.menuActionRow++;
                    }
                    l++;
                }
                if (
                    (j1 === 3 || j1 === 7) &&
                    this.anInt1223 === 0 &&
                    (j1 === 7 || this.privateChatMode === 0 || (this.privateChatMode === 1 && this.method148(13292, s)))
                ) {
                    if (k > k1 - 14 && k <= k1) {
                        if (this.playerRights >= 1) {
                            this.menuActionTexts[this.menuActionRow] = "Report abuse @whi@" + s;
                            this.menuActionTypes[this.menuActionRow] = 507;
                            this.menuActionRow++;
                        }
                        this.menuActionTexts[this.menuActionRow] = "Add ignore @whi@" + s;
                        this.menuActionTypes[this.menuActionRow] = 574;
                        this.menuActionRow++;
                        this.menuActionTexts[this.menuActionRow] = "Add friend @whi@" + s;
                        this.menuActionTypes[this.menuActionRow] = 762;
                        this.menuActionRow++;
                    }
                    l++;
                }
                if (j1 === 4 && (this.tradeMode === 0 || (this.tradeMode === 1 && this.method148(13292, s)))) {
                    if (k > k1 - 14 && k <= k1) {
                        this.menuActionTexts[this.menuActionRow] = "Accept trade @whi@" + s;
                        this.menuActionTypes[this.menuActionRow] = 544;
                        this.menuActionRow++;
                    }
                    l++;
                }
                if ((j1 === 5 || j1 === 6) && this.anInt1223 === 0 && this.privateChatMode < 2) {
                    l++;
                }
                if (j1 === 8 && (this.tradeMode === 0 || (this.tradeMode === 1 && this.method148(13292, s)))) {
                    if (k > k1 - 14 && k <= k1) {
                        this.menuActionTexts[this.menuActionRow] = "Accept challenge @whi@" + s;
                        this.menuActionTypes[this.menuActionRow] = 695;
                        this.menuActionRow++;
                    }
                    l++;
                }
            }
        }
    }

    public method43(byte0: number) {
        if (this.itemSelected === 0 && this.widgetSelected === 0) {
            this.menuActionTexts[this.menuActionRow] = "Walk here";
            this.menuActionTypes[this.menuActionRow] = 14;
            this.firstMenuOperand[this.menuActionRow] = this.mouseX;
            this.secondMenuOperand[this.menuActionRow] = this.mouseY;
            this.menuActionRow++;
        }
        let i: number = -1;
        if (byte0 !== 7) {
            this.opcode = -1;
        }
        for (let j: number = 0; j < Model.anInt1708; j++) {
            {
                const k: number = Model.anIntArray1709[j];
                const l: number = k & 127;
                const i1: number = (k >> 7) & 127;
                const j1: number = (k >> 29) & 3;
                const k1: number = (k >> 14) & 32767;
                if (k === i) {
                    continue;
                }
                i = k;
                if (j1 === 2 && this.currentScene.method271(this.plane, l, i1, k) >= 0) {
                    let class47: GameObjectDefinition = GameObjectDefinition.getDefinition(k1);
                    if (class47.childrenIds != null) {
                        class47 = class47.getChildDefinition();
                    }
                    if (class47 == null) {
                        continue;
                    }
                    if (this.itemSelected === 1) {
                        this.menuActionTexts[this.menuActionRow] = "Use " + this.aString1150 + " with @cya@" + class47.name;
                        this.menuActionTypes[this.menuActionRow] = 467;
                        this.selectedMenuActions[this.menuActionRow] = k;
                        this.firstMenuOperand[this.menuActionRow] = l;
                        this.secondMenuOperand[this.menuActionRow] = i1;
                        this.menuActionRow++;
                    } else if (this.widgetSelected === 1) {
                        if ((this.anInt1173 & 4) === 4) {
                            this.menuActionTexts[this.menuActionRow] = this.selectedWidgetName + " @cya@" + class47.name;
                            this.menuActionTypes[this.menuActionRow] = 376;
                            this.selectedMenuActions[this.menuActionRow] = k;
                            this.firstMenuOperand[this.menuActionRow] = l;
                            this.secondMenuOperand[this.menuActionRow] = i1;
                            this.menuActionRow++;
                        }
                    } else {
                        if (class47.options != null) {
                            for (let l1: number = 4; l1 >= 0; l1--) {
                                if (class47.options[l1] != null) {
                                    this.menuActionTexts[this.menuActionRow] = class47.options[l1] + " @cya@" + class47.name;
                                    if (l1 === 0) {
                                        this.menuActionTypes[this.menuActionRow] = 35;
                                    }
                                    if (l1 === 1) {
                                        this.menuActionTypes[this.menuActionRow] = 389;
                                    }
                                    if (l1 === 2) {
                                        this.menuActionTypes[this.menuActionRow] = 888;
                                    }
                                    if (l1 === 3) {
                                        this.menuActionTypes[this.menuActionRow] = 892;
                                    }
                                    if (l1 === 4) {
                                        this.menuActionTypes[this.menuActionRow] = 1280;
                                    }
                                    this.selectedMenuActions[this.menuActionRow] = k;
                                    this.firstMenuOperand[this.menuActionRow] = l;
                                    this.secondMenuOperand[this.menuActionRow] = i1;
                                    this.menuActionRow++;
                                }
                            }
                        }
                        this.menuActionTexts[this.menuActionRow] = "Examine @cya@" + class47.name;
                        this.menuActionTypes[this.menuActionRow] = 1412;
                        this.selectedMenuActions[this.menuActionRow] = class47.id << 14;
                        this.firstMenuOperand[this.menuActionRow] = l;
                        this.secondMenuOperand[this.menuActionRow] = i1;
                        this.menuActionRow++;
                    }
                }
                if (j1 === 1) {
                    const class50_sub1_sub4_sub3_sub1: Npc = this.npcs[k1];
                    if (
                        class50_sub1_sub4_sub3_sub1.npcDefinition.boundaryDimension === 1 &&
                        (class50_sub1_sub4_sub3_sub1.worldX & 127) === 64 &&
                        (class50_sub1_sub4_sub3_sub1.worldY & 127) === 64
                    ) {
                        for (let i2: number = 0; i2 < this.anInt1133; i2++) {
                            {
                                const class50_sub1_sub4_sub3_sub1_1: Npc = this.npcs[this.anIntArray1134[i2]];
                                if (
                                    class50_sub1_sub4_sub3_sub1_1 != null &&
                                    class50_sub1_sub4_sub3_sub1_1 !== class50_sub1_sub4_sub3_sub1 &&
                                    class50_sub1_sub4_sub3_sub1_1.npcDefinition.boundaryDimension === 1 &&
                                    class50_sub1_sub4_sub3_sub1_1.worldX === class50_sub1_sub4_sub3_sub1.worldX &&
                                    class50_sub1_sub4_sub3_sub1_1.worldY === class50_sub1_sub4_sub3_sub1.worldY
                                ) {
                                    this.method82(
                                        class50_sub1_sub4_sub3_sub1_1.npcDefinition,
                                        i1,
                                        l,
                                        this.anIntArray1134[i2],
                                        (-76 as number) | 0
                                    );
                                }
                            }
                        }
                        for (let k2: number = 0; k2 < this.localPlayerCount; k2++) {
                            {
                                const class50_sub1_sub4_sub3_sub2_1: Player = this.players[this.playerList[k2]];
                                if (
                                    class50_sub1_sub4_sub3_sub2_1 != null &&
                                    class50_sub1_sub4_sub3_sub2_1.worldX === class50_sub1_sub4_sub3_sub1.worldX &&
                                    class50_sub1_sub4_sub3_sub2_1.worldY === class50_sub1_sub4_sub3_sub1.worldY
                                ) {
                                    this.method38(this.playerList[k2], i1, l, class50_sub1_sub4_sub3_sub2_1, 0);
                                }
                            }
                        }
                    }
                    this.method82(class50_sub1_sub4_sub3_sub1.npcDefinition, i1, l, k1, (-76 as number) | 0);
                }
                if (j1 === 0) {
                    const class50_sub1_sub4_sub3_sub2: Player = this.players[k1];
                    if ((class50_sub1_sub4_sub3_sub2.worldX & 127) === 64 && (class50_sub1_sub4_sub3_sub2.worldY & 127) === 64) {
                        for (let j2: number = 0; j2 < this.anInt1133; j2++) {
                            {
                                const class50_sub1_sub4_sub3_sub1_2: Npc = this.npcs[this.anIntArray1134[j2]];
                                if (
                                    class50_sub1_sub4_sub3_sub1_2 != null &&
                                    class50_sub1_sub4_sub3_sub1_2.npcDefinition.boundaryDimension === 1 &&
                                    class50_sub1_sub4_sub3_sub1_2.worldX === class50_sub1_sub4_sub3_sub2.worldX &&
                                    class50_sub1_sub4_sub3_sub1_2.worldY === class50_sub1_sub4_sub3_sub2.worldY
                                ) {
                                    this.method82(
                                        class50_sub1_sub4_sub3_sub1_2.npcDefinition,
                                        i1,
                                        l,
                                        this.anIntArray1134[j2],
                                        (-76 as number) | 0
                                    );
                                }
                            }
                        }
                        for (let l2: number = 0; l2 < this.localPlayerCount; l2++) {
                            {
                                const class50_sub1_sub4_sub3_sub2_2: Player = this.players[this.playerList[l2]];
                                if (
                                    class50_sub1_sub4_sub3_sub2_2 != null &&
                                    class50_sub1_sub4_sub3_sub2_2 !== class50_sub1_sub4_sub3_sub2 &&
                                    class50_sub1_sub4_sub3_sub2_2.worldX === class50_sub1_sub4_sub3_sub2.worldX &&
                                    class50_sub1_sub4_sub3_sub2_2.worldY === class50_sub1_sub4_sub3_sub2.worldY
                                ) {
                                    this.method38(this.playerList[l2], i1, l, class50_sub1_sub4_sub3_sub2_2, 0);
                                }
                            }
                        }
                    }
                    this.method38(k1, i1, l, class50_sub1_sub4_sub3_sub2, 0);
                }
                if (j1 === 3) {
                    const class6: LinkedList = this.groundItems[this.plane][l][i1];
                    if (class6 != null) {
                        for (
                            let class50_sub1_sub4_sub1: Item = class6.last() as Item;
                            class50_sub1_sub4_sub1 != null;
                            class50_sub1_sub4_sub1 = class6.previous() as Item
                        ) {
                            {
                                const class16: ItemDefinition = ItemDefinition.lookup(class50_sub1_sub4_sub1.itemId);
                                if (this.itemSelected === 1) {
                                    this.menuActionTexts[this.menuActionRow] = "Use " + this.aString1150 + " with @lre@" + class16.name;
                                    this.menuActionTypes[this.menuActionRow] = 100;
                                    this.selectedMenuActions[this.menuActionRow] = class50_sub1_sub4_sub1.itemId;
                                    this.firstMenuOperand[this.menuActionRow] = l;
                                    this.secondMenuOperand[this.menuActionRow] = i1;
                                    this.menuActionRow++;
                                } else if (this.widgetSelected === 1) {
                                    if ((this.anInt1173 & 1) === 1) {
                                        this.menuActionTexts[this.menuActionRow] = this.selectedWidgetName + " @lre@" + class16.name;
                                        this.menuActionTypes[this.menuActionRow] = 199;
                                        this.selectedMenuActions[this.menuActionRow] = class50_sub1_sub4_sub1.itemId;
                                        this.firstMenuOperand[this.menuActionRow] = l;
                                        this.secondMenuOperand[this.menuActionRow] = i1;
                                        this.menuActionRow++;
                                    }
                                } else {
                                    for (let i3: number = 4; i3 >= 0; i3--) {
                                        if (class16.groundActions != null && class16.groundActions[i3] != null) {
                                            this.menuActionTexts[this.menuActionRow] = class16.groundActions[i3] + " @lre@" + class16.name;
                                            if (i3 === 0) {
                                                this.menuActionTypes[this.menuActionRow] = 68;
                                            }
                                            if (i3 === 1) {
                                                this.menuActionTypes[this.menuActionRow] = 26;
                                            }
                                            if (i3 === 2) {
                                                this.menuActionTypes[this.menuActionRow] = 684;
                                            }
                                            if (i3 === 3) {
                                                this.menuActionTypes[this.menuActionRow] = 930;
                                            }
                                            if (i3 === 4) {
                                                this.menuActionTypes[this.menuActionRow] = 270;
                                            }
                                            this.selectedMenuActions[this.menuActionRow] = class50_sub1_sub4_sub1.itemId;
                                            this.firstMenuOperand[this.menuActionRow] = l;
                                            this.secondMenuOperand[this.menuActionRow] = i1;
                                            this.menuActionRow++;
                                        } else if (i3 === 2) {
                                            this.menuActionTexts[this.menuActionRow] = "Take @lre@" + class16.name;
                                            this.menuActionTypes[this.menuActionRow] = 684;
                                            this.selectedMenuActions[this.menuActionRow] = class50_sub1_sub4_sub1.itemId;
                                            this.firstMenuOperand[this.menuActionRow] = l;
                                            this.secondMenuOperand[this.menuActionRow] = i1;
                                            this.menuActionRow++;
                                        }
                                    }
                                    this.menuActionTexts[this.menuActionRow] = "Examine @lre@" + class16.name;
                                    this.menuActionTypes[this.menuActionRow] = 1564;
                                    this.selectedMenuActions[this.menuActionRow] = class50_sub1_sub4_sub1.itemId;
                                    this.firstMenuOperand[this.menuActionRow] = l;
                                    this.secondMenuOperand[this.menuActionRow] = i1;
                                    this.menuActionRow++;
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    public method38(i: number, j: number, k: number, class50_sub1_sub4_sub3_sub2: Player, l: number) {
        if (class50_sub1_sub4_sub3_sub2 === Game.localPlayer) {
            return;
        }
        if (this.menuActionRow >= 400) {
            return;
        }
        if (l !== 0) {
            Game.aBoolean963 = !Game.aBoolean963;
        }
        let s: string;
        if (class50_sub1_sub4_sub3_sub2.anInt1759 === 0) {
            s =
                class50_sub1_sub4_sub3_sub2.playerName +
                Game.getCombatLevelColour(Game.localPlayer.combatLevel, class50_sub1_sub4_sub3_sub2.combatLevel) +
                " (level-" +
                class50_sub1_sub4_sub3_sub2.combatLevel +
                ")";
        } else {
            s = class50_sub1_sub4_sub3_sub2.playerName + " (skill-" + class50_sub1_sub4_sub3_sub2.anInt1759 + ")";
        }
        if (this.itemSelected === 1) {
            this.menuActionTexts[this.menuActionRow] = "Use " + this.aString1150 + " with @whi@" + s;
            this.menuActionTypes[this.menuActionRow] = 596;
            this.selectedMenuActions[this.menuActionRow] = i;
            this.firstMenuOperand[this.menuActionRow] = k;
            this.secondMenuOperand[this.menuActionRow] = j;
            this.menuActionRow++;
        } else if (this.widgetSelected === 1) {
            if ((this.anInt1173 & 8) === 8) {
                this.menuActionTexts[this.menuActionRow] = this.selectedWidgetName + " @whi@" + s;
                this.menuActionTypes[this.menuActionRow] = 918;
                this.selectedMenuActions[this.menuActionRow] = i;
                this.firstMenuOperand[this.menuActionRow] = k;
                this.secondMenuOperand[this.menuActionRow] = j;
                this.menuActionRow++;
            }
        } else {
            for (let i1: number = 4; i1 >= 0; i1--) {
                if (this.aStringArray1069[i1] != null) {
                    this.menuActionTexts[this.menuActionRow] = this.aStringArray1069[i1] + " @whi@" + s;
                    let c: string = "\u0000";
                    if (
                        /* equalsIgnoreCase */ ((o1, o2) => o1.toUpperCase() === (o2 === null ? o2 : o2.toUpperCase()))(
                            this.aStringArray1069[i1],
                            "attack"
                        )
                    ) {
                        if (class50_sub1_sub4_sub3_sub2.combatLevel > Game.localPlayer.combatLevel) {
                            c = "\u07d0";
                        }
                        if (Game.localPlayer.teamId !== 0 && class50_sub1_sub4_sub3_sub2.teamId !== 0) {
                            if (Game.localPlayer.teamId === class50_sub1_sub4_sub3_sub2.teamId) {
                                c = "\u07d0";
                            } else {
                                c = "\u0000";
                            }
                        }
                    } else if (this.aBooleanArray1070[i1]) {
                        c = "\u07d0";
                    }
                    if (i1 === 0) {
                        this.menuActionTypes[this.menuActionRow] = 200 + (c => (c.charCodeAt == null ? (c as any) : c.charCodeAt(0)))(c);
                    }
                    if (i1 === 1) {
                        this.menuActionTypes[this.menuActionRow] = 493 + (c => (c.charCodeAt == null ? (c as any) : c.charCodeAt(0)))(c);
                    }
                    if (i1 === 2) {
                        this.menuActionTypes[this.menuActionRow] = 408 + (c => (c.charCodeAt == null ? (c as any) : c.charCodeAt(0)))(c);
                    }
                    if (i1 === 3) {
                        this.menuActionTypes[this.menuActionRow] = 677 + (c => (c.charCodeAt == null ? (c as any) : c.charCodeAt(0)))(c);
                    }
                    if (i1 === 4) {
                        this.menuActionTypes[this.menuActionRow] = 876 + (c => (c.charCodeAt == null ? (c as any) : c.charCodeAt(0)))(c);
                    }
                    this.selectedMenuActions[this.menuActionRow] = i;
                    this.firstMenuOperand[this.menuActionRow] = k;
                    this.secondMenuOperand[this.menuActionRow] = j;
                    this.menuActionRow++;
                }
            }
        }
        for (let j1: number = 0; j1 < this.menuActionRow; j1++) {
            if (this.menuActionTypes[j1] === 14) {
                this.menuActionTexts[j1] = "Walk here @whi@" + s;
                return;
            }
        }
    }

    public method82(class37: ActorDefinition, i: number, j: number, k: number, byte0: number) {
        if (byte0 !== -76) {
            this.groundItems = null;
        }
        if (this.menuActionRow >= 400) {
            return;
        }
        if (class37.childrenIds != null) {
            class37 = class37.getChildDefinition();
        }
        if (class37 == null) {
            return;
        }
        if (!class37.clickable) {
            return;
        }
        let s: string = class37.name;
        if (class37.combatLevel !== 0) {
            s = s + Game.getCombatLevelColour(Game.localPlayer.combatLevel, class37.combatLevel) + " (level-" + class37.combatLevel + ")";
        }
        if (this.itemSelected === 1) {
            this.menuActionTexts[this.menuActionRow] = "Use " + this.aString1150 + " with @yel@" + s;
            this.menuActionTypes[this.menuActionRow] = 347;
            this.selectedMenuActions[this.menuActionRow] = k;
            this.firstMenuOperand[this.menuActionRow] = j;
            this.secondMenuOperand[this.menuActionRow] = i;
            this.menuActionRow++;
            return;
        }
        if (this.widgetSelected === 1) {
            if ((this.anInt1173 & 2) === 2) {
                this.menuActionTexts[this.menuActionRow] = this.selectedWidgetName + " @yel@" + s;
                this.menuActionTypes[this.menuActionRow] = 67;
                this.selectedMenuActions[this.menuActionRow] = k;
                this.firstMenuOperand[this.menuActionRow] = j;
                this.secondMenuOperand[this.menuActionRow] = i;
                this.menuActionRow++;
                return;
            }
        } else {
            if (class37.actions != null) {
                for (let l: number = 4; l >= 0; l--) {
                    if (
                        class37.actions[l] != null &&
                        !/* equalsIgnoreCase */ ((o1, o2) => o1.toUpperCase() === (o2 === null ? o2 : o2.toUpperCase()))(
                            class37.actions[l],
                            "attack"
                        )
                    ) {
                        this.menuActionTexts[this.menuActionRow] = class37.actions[l] + " @yel@" + s;
                        if (l === 0) {
                            this.menuActionTypes[this.menuActionRow] = 318;
                        }
                        if (l === 1) {
                            this.menuActionTypes[this.menuActionRow] = 921;
                        }
                        if (l === 2) {
                            this.menuActionTypes[this.menuActionRow] = 118;
                        }
                        if (l === 3) {
                            this.menuActionTypes[this.menuActionRow] = 553;
                        }
                        if (l === 4) {
                            this.menuActionTypes[this.menuActionRow] = 432;
                        }
                        this.selectedMenuActions[this.menuActionRow] = k;
                        this.firstMenuOperand[this.menuActionRow] = j;
                        this.secondMenuOperand[this.menuActionRow] = i;
                        this.menuActionRow++;
                    }
                }
            }
            if (class37.actions != null) {
                for (let i1: number = 4; i1 >= 0; i1--) {
                    if (
                        class37.actions[i1] != null &&
                        /* equalsIgnoreCase */ ((o1, o2) => o1.toUpperCase() === (o2 === null ? o2 : o2.toUpperCase()))(
                            class37.actions[i1],
                            "attack"
                        )
                    ) {
                        let c: string = "\u0000";
                        if (class37.combatLevel > Game.localPlayer.combatLevel) {
                            c = "\u07d0";
                        }
                        this.menuActionTexts[this.menuActionRow] = class37.actions[i1] + " @yel@" + s;
                        if (i1 === 0) {
                            this.menuActionTypes[this.menuActionRow] =
                                318 + (c => (c.charCodeAt == null ? (c as any) : c.charCodeAt(0)))(c);
                        }
                        if (i1 === 1) {
                            this.menuActionTypes[this.menuActionRow] =
                                921 + (c => (c.charCodeAt == null ? (c as any) : c.charCodeAt(0)))(c);
                        }
                        if (i1 === 2) {
                            this.menuActionTypes[this.menuActionRow] =
                                118 + (c => (c.charCodeAt == null ? (c as any) : c.charCodeAt(0)))(c);
                        }
                        if (i1 === 3) {
                            this.menuActionTypes[this.menuActionRow] =
                                553 + (c => (c.charCodeAt == null ? (c as any) : c.charCodeAt(0)))(c);
                        }
                        if (i1 === 4) {
                            this.menuActionTypes[this.menuActionRow] =
                                432 + (c => (c.charCodeAt == null ? (c as any) : c.charCodeAt(0)))(c);
                        }
                        this.selectedMenuActions[this.menuActionRow] = k;
                        this.firstMenuOperand[this.menuActionRow] = j;
                        this.secondMenuOperand[this.menuActionRow] = i;
                        this.menuActionRow++;
                    }
                }
            }
            this.menuActionTexts[this.menuActionRow] = "Examine @yel@" + s;
            this.menuActionTypes[this.menuActionRow] = 1668;
            this.selectedMenuActions[this.menuActionRow] = k;
            this.firstMenuOperand[this.menuActionRow] = j;
            this.secondMenuOperand[this.menuActionRow] = i;
            this.menuActionRow++;
        }
    }

    public method111(i: number) {
        i = (21 / i) | 0;
        if (this.anInt1223 === 0) {
            return;
        }
        let j: number = 0;
        if (this.systemUpdateTime !== 0) {
            j = 1;
        }
        for (let k: number = 0; k < 100; k++) {
            if (this.chatMessages[k] != null) {
                const l: number = this.chatTypes[k];
                let s: string = this.chatPlayerNames[k];
                if (
                    s != null &&
                    /* startsWith */ ((str, searchString, position = 0) => str.substr(position, searchString.length) === searchString)(
                        s,
                        "@cr1@"
                    )
                ) {
                    s = s.substring(5);
                }
                if (
                    s != null &&
                    /* startsWith */ ((str, searchString, position = 0) => str.substr(position, searchString.length) === searchString)(
                        s,
                        "@cr2@"
                    )
                ) {
                    s = s.substring(5);
                }
                if (
                    (l === 3 || l === 7) &&
                    (l === 7 || this.privateChatMode === 0 || (this.privateChatMode === 1 && this.method148(13292, s)))
                ) {
                    const i1: number = 329 - j * 13;
                    if (this.mouseX > 4 && this.mouseY - 4 > i1 - 10 && this.mouseY - 4 <= i1 + 3) {
                        let j1: number = this.fontNormal.getStringEffectWidth("From:  " + s + this.chatMessages[k]) + 25;
                        if (j1 > 450) {
                            j1 = 450;
                        }
                        if (this.mouseX < 4 + j1) {
                            if (this.playerRights >= 1) {
                                this.menuActionTexts[this.menuActionRow] = "Report abuse @whi@" + s;
                                this.menuActionTypes[this.menuActionRow] = 2507;
                                this.menuActionRow++;
                            }
                            this.menuActionTexts[this.menuActionRow] = "Add ignore @whi@" + s;
                            this.menuActionTypes[this.menuActionRow] = 2574;
                            this.menuActionRow++;
                            this.menuActionTexts[this.menuActionRow] = "Add friend @whi@" + s;
                            this.menuActionTypes[this.menuActionRow] = 2762;
                            this.menuActionRow++;
                        }
                    }
                    if (++j >= 5) {
                        return;
                    }
                }
                if ((l === 5 || l === 6) && this.privateChatMode < 2 && ++j >= 5) {
                    return;
                }
            }
        }
    }

    public method148(i: number, s: string): boolean {
        if (s == null) {
            return false;
        }
        for (let j: number = 0; j < this.friendsCount; j++) {
            if (
                /* equalsIgnoreCase */ ((o1, o2) => o1.toUpperCase() === (o2 === null ? o2 : o2.toUpperCase()))(s, this.friendUsernames[j])
            ) {
                return true;
            }
        }
        if (i !== 13292) {
            this.aBoolean1014 = !this.aBoolean1014;
        }
        return /* equalsIgnoreCase */ ((o1, o2) => o1.toUpperCase() === (o2 === null ? o2 : o2.toUpperCase()))(
            s,
            Game.localPlayer.playerName
        );
    }

    public method66(i: number, class13: Widget, j: number, k: number, l: number, i1: number, j1: number, k1: number) {
        if (j1 !== 23658) {
            return;
        }
        if (class13.type !== 0 || class13.children == null || class13.hiddenUntilHovered) {
            return;
        }
        if (i1 < l || k1 < i || i1 > l + class13.width || k1 > i + class13.height) {
            return;
        }
        const l1: number = class13.children.length;
        for (let i2: number = 0; i2 < l1; i2++) {
            {
                let j2: number = class13.childrenX[i2] + l;
                let k2: number = class13.childrenY[i2] + i - k;
                const child: Widget = Widget.forId(class13.children[i2]);
                j2 += child.anInt228;
                k2 += child.anInt259;
                if (
                    (child.hoveredPopup >= 0 || child.disabledHoveredColor !== 0) &&
                    i1 >= j2 &&
                    k1 >= k2 &&
                    i1 < j2 + child.width &&
                    k1 < k2 + child.height
                ) {
                    if (child.hoveredPopup >= 0) {
                        this.anInt915 = child.hoveredPopup;
                    } else {
                        this.anInt915 = child.id;
                    }
                }
                if (child.type === 8 && i1 >= j2 && k1 >= k2 && i1 < j2 + child.width && k1 < k2 + child.height) {
                    this.anInt1315 = child.id;
                }
                if (child.type === 0) {
                    this.method66(k2, child, j, child.anInt231, j2, i1, 23658, k1);
                    if (child.scrollLimit > child.height) {
                        this.method42(child.scrollLimit, k2, child, (102 as number) | 0, k1, j, i1, child.height, j2 + child.width);
                    }
                } else {
                    if (child.actionType === 1 && i1 >= j2 && k1 >= k2 && i1 < j2 + child.width && k1 < k2 + child.height) {
                        let flag: boolean = false;
                        if (child.contentType !== 0) {
                            flag = this.processFriendListClick(child);
                        }
                        if (!flag) {
                            this.menuActionTexts[this.menuActionRow] = child.tooltip;
                            this.menuActionTypes[this.menuActionRow] = 352;
                            this.secondMenuOperand[this.menuActionRow] = child.id;
                            this.menuActionRow++;
                        }
                    }
                    if (
                        child.actionType === 2 &&
                        this.widgetSelected === 0 &&
                        i1 >= j2 &&
                        k1 >= k2 &&
                        i1 < j2 + child.width &&
                        k1 < k2 + child.height
                    ) {
                        let circumfix: string = child.optionCircumfix;
                        if (circumfix.indexOf(" ") !== -1) {
                            circumfix = circumfix.substring(0, circumfix.indexOf(" "));
                        }
                        this.menuActionTexts[this.menuActionRow] = circumfix + " @gre@" + child.optionText;
                        this.menuActionTypes[this.menuActionRow] = Actions.USABLE_WIDGET;
                        this.secondMenuOperand[this.menuActionRow] = child.id;
                        this.menuActionRow++;
                    }
                    if (child.actionType === 3 && i1 >= j2 && k1 >= k2 && i1 < j2 + child.width && k1 < k2 + child.height) {
                        this.menuActionTexts[this.menuActionRow] = "Close";
                        if (j === 3) {
                            this.menuActionTypes[this.menuActionRow] = 55;
                        } else {
                            this.menuActionTypes[this.menuActionRow] = Actions.CLOSE_WIDGETS;
                        }
                        this.secondMenuOperand[this.menuActionRow] = child.id;
                        this.menuActionRow++;
                    }
                    if (child.actionType === 4 && i1 >= j2 && k1 >= k2 && i1 < j2 + child.width && k1 < k2 + child.height) {
                        this.menuActionTexts[this.menuActionRow] = child.tooltip;
                        this.menuActionTypes[this.menuActionRow] = 890;
                        this.secondMenuOperand[this.menuActionRow] = child.id;
                        this.menuActionRow++;
                    }
                    if (child.actionType === 5 && i1 >= j2 && k1 >= k2 && i1 < j2 + child.width && k1 < k2 + child.height) {
                        this.menuActionTexts[this.menuActionRow] = child.tooltip;
                        this.menuActionTypes[this.menuActionRow] = 518;
                        this.secondMenuOperand[this.menuActionRow] = child.id;
                        this.menuActionRow++;
                    }
                    if (
                        child.actionType === 6 &&
                        !this.aBoolean1239 &&
                        i1 >= j2 &&
                        k1 >= k2 &&
                        i1 < j2 + child.width &&
                        k1 < k2 + child.height
                    ) {
                        this.menuActionTexts[this.menuActionRow] = child.tooltip;
                        this.menuActionTypes[this.menuActionRow] = Actions.CLICK_TO_CONTINUE;
                        this.secondMenuOperand[this.menuActionRow] = child.id;
                        this.menuActionRow++;
                    }
                    if (child.type === 2) {
                        let l2: number = 0;
                        for (let i3: number = 0; i3 < child.height; i3++) {
                            {
                                for (let j3: number = 0; j3 < child.width; j3++) {
                                    {
                                        let k3: number = j2 + j3 * (32 + child.itemSpritePadsX);
                                        let l3: number = k2 + i3 * (32 + child.itemSpritePadsY);
                                        if (l2 < 20) {
                                            k3 += child.imageX[l2];
                                            l3 += child.imageY[l2];
                                        }
                                        if (i1 >= k3 && k1 >= l3 && i1 < k3 + 32 && k1 < l3 + 32) {
                                            this.mouseInvInterfaceIndex = l2;
                                            this.lastActiveInvInterface = child.id;
                                            if (child.items[l2] > 0) {
                                                const definition: ItemDefinition = ItemDefinition.lookup(child.items[l2] - 1);
                                                if (this.itemSelected === 1 && child.isInventory) {
                                                    if (child.id !== this.anInt1148 || l2 !== this.anInt1147) {
                                                        this.menuActionTexts[this.menuActionRow] =
                                                            "Use " + this.aString1150 + " with @lre@" + definition.name;
                                                        this.menuActionTypes[this.menuActionRow] = 903;
                                                        this.selectedMenuActions[this.menuActionRow] = definition.id;
                                                        this.firstMenuOperand[this.menuActionRow] = l2;
                                                        this.secondMenuOperand[this.menuActionRow] = child.id;
                                                        this.menuActionRow++;
                                                    }
                                                } else if (this.widgetSelected === 1 && child.isInventory) {
                                                    if ((this.anInt1173 & 16) === 16) {
                                                        this.menuActionTexts[this.menuActionRow] =
                                                            this.selectedWidgetName + " @lre@" + definition.name;
                                                        this.menuActionTypes[this.menuActionRow] = 361;
                                                        this.selectedMenuActions[this.menuActionRow] = definition.id;
                                                        this.firstMenuOperand[this.menuActionRow] = l2;
                                                        this.secondMenuOperand[this.menuActionRow] = child.id;
                                                        this.menuActionRow++;
                                                    }
                                                } else {
                                                    if (child.isInventory) {
                                                        for (let i4: number = 4; i4 >= 3; i4--) {
                                                            if (
                                                                definition.inventoryActions != null &&
                                                                definition.inventoryActions[i4] != null
                                                            ) {
                                                                this.menuActionTexts[this.menuActionRow] =
                                                                    definition.inventoryActions[i4] + " @lre@" + definition.name;
                                                                if (i4 === 3) {
                                                                    this.menuActionTypes[this.menuActionRow] = 227;
                                                                }
                                                                if (i4 === 4) {
                                                                    this.menuActionTypes[this.menuActionRow] = 891;
                                                                }
                                                                this.selectedMenuActions[this.menuActionRow] = definition.id;
                                                                this.firstMenuOperand[this.menuActionRow] = l2;
                                                                this.secondMenuOperand[this.menuActionRow] = child.id;
                                                                this.menuActionRow++;
                                                            } else if (i4 === 4) {
                                                                this.menuActionTexts[this.menuActionRow] = "Drop @lre@" + definition.name;
                                                                this.menuActionTypes[this.menuActionRow] = 891;
                                                                this.selectedMenuActions[this.menuActionRow] = definition.id;
                                                                this.firstMenuOperand[this.menuActionRow] = l2;
                                                                this.secondMenuOperand[this.menuActionRow] = child.id;
                                                                this.menuActionRow++;
                                                            }
                                                        }
                                                    }
                                                    if (child.itemUsable) {
                                                        this.menuActionTexts[this.menuActionRow] = "Use @lre@" + definition.name;
                                                        this.menuActionTypes[this.menuActionRow] = 52;
                                                        this.selectedMenuActions[this.menuActionRow] = definition.id;
                                                        this.firstMenuOperand[this.menuActionRow] = l2;
                                                        this.secondMenuOperand[this.menuActionRow] = child.id;
                                                        this.menuActionRow++;
                                                    }
                                                    if (child.isInventory && definition.inventoryActions != null) {
                                                        for (let j4: number = 2; j4 >= 0; j4--) {
                                                            if (definition.inventoryActions[j4] != null) {
                                                                this.menuActionTexts[this.menuActionRow] =
                                                                    definition.inventoryActions[j4] + " @lre@" + definition.name;
                                                                if (j4 === 0) {
                                                                    this.menuActionTypes[this.menuActionRow] = 961;
                                                                }
                                                                if (j4 === 1) {
                                                                    this.menuActionTypes[this.menuActionRow] = 399;
                                                                }
                                                                if (j4 === 2) {
                                                                    this.menuActionTypes[this.menuActionRow] = 324;
                                                                }
                                                                this.selectedMenuActions[this.menuActionRow] = definition.id;
                                                                this.firstMenuOperand[this.menuActionRow] = l2;
                                                                this.secondMenuOperand[this.menuActionRow] = child.id;
                                                                this.menuActionRow++;
                                                            }
                                                        }
                                                    }
                                                    if (child.options != null) {
                                                        for (let k4: number = 4; k4 >= 0; k4--) {
                                                            if (child.options[k4] != null) {
                                                                this.menuActionTexts[this.menuActionRow] =
                                                                    child.options[k4] + " @lre@" + definition.name;
                                                                if (k4 === 0) {
                                                                    this.menuActionTypes[this.menuActionRow] = 9;
                                                                }
                                                                if (k4 === 1) {
                                                                    this.menuActionTypes[this.menuActionRow] = 225;
                                                                }
                                                                if (k4 === 2) {
                                                                    this.menuActionTypes[this.menuActionRow] = 444;
                                                                }
                                                                if (k4 === 3) {
                                                                    this.menuActionTypes[this.menuActionRow] = 564;
                                                                }
                                                                if (k4 === 4) {
                                                                    this.menuActionTypes[this.menuActionRow] = 894;
                                                                }
                                                                this.selectedMenuActions[this.menuActionRow] = definition.id;
                                                                this.firstMenuOperand[this.menuActionRow] = l2;
                                                                this.secondMenuOperand[this.menuActionRow] = child.id;
                                                                this.menuActionRow++;
                                                            }
                                                        }
                                                    }
                                                    this.menuActionTexts[this.menuActionRow] = "Examine @lre@" + definition.name;
                                                    this.menuActionTypes[this.menuActionRow] = Actions.EXAMINE_ITEM;
                                                    this.selectedMenuActions[this.menuActionRow] = definition.id;
                                                    this.firstMenuOperand[this.menuActionRow] = l2;
                                                    this.secondMenuOperand[this.menuActionRow] = child.id;
                                                    this.menuActionRow++;
                                                }
                                            }
                                        }
                                        l2++;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    public processFriendListClick(widget: Widget): boolean {
        let row: number = widget.contentType;
        if ((row >= 1 && row <= 200) || (row >= 701 && row <= 900)) {
            if (row >= 801) {
                row -= 701;
            } else if (row >= 701) {
                row -= 601;
            } else if (row >= 101) {
                row -= 101;
            } else {
                row--;
            }
            this.menuActionTexts[this.menuActionRow] = "Remove @whi@" + this.friendUsernames[row];
            this.menuActionTypes[this.menuActionRow] = Actions.REMOVE_FRIEND;
            this.menuActionRow++;
            this.menuActionTexts[this.menuActionRow] = "Message @whi@" + this.friendUsernames[row];
            this.menuActionTypes[this.menuActionRow] = Actions.PRIVATE_MESSAGE;
            this.menuActionRow++;
            return true;
        }
        if (row >= 401 && row <= 500) {
            this.menuActionTexts[this.menuActionRow] = "Remove @whi@" + widget.disabledText;
            this.menuActionTypes[this.menuActionRow] = Actions.REMOVE_FRIEND;
            this.menuActionRow++;
            return true;
        } else {
            return false;
        }
    }

    public method42(i: number, j: number, class13: Widget, byte0: number, k: number, l: number, i1: number, j1: number, k1: number) {
        if (this.aBoolean1127) {
            this.anInt1303 = 32;
        } else {
            this.anInt1303 = 0;
        }
        this.aBoolean1127 = false;
        if (byte0 !== 102) {
            for (let l1: number = 1; l1 > 0; l1++) {}
        }
        if (i1 >= k1 && i1 < k1 + 16 && k >= j && k < j + 16) {
            class13.anInt231 -= this.anInt1094 * 4;
            if (l === 1) {
                this.redrawTabArea = true;
            }
            if (l === 2 || l === 3) {
                this.redrawChatbox = true;
            }
            return;
        }
        if (i1 >= k1 && i1 < k1 + 16 && k >= j + j1 - 16 && k < j + j1) {
            class13.anInt231 += this.anInt1094 * 4;
            if (l === 1) {
                this.redrawTabArea = true;
            }
            if (l === 2 || l === 3) {
                this.redrawChatbox = true;
            }
            return;
        }
        if (i1 >= k1 - this.anInt1303 && i1 < k1 + 16 + this.anInt1303 && k >= j + 16 && k < j + j1 - 16 && this.anInt1094 > 0) {
            let i2: number = (((j1 - 32) * j1) / i) | 0;
            if (i2 < 8) {
                i2 = 8;
            }
            const j2: number = k - j - 16 - ((i2 / 2) | 0);
            const k2: number = j1 - 32 - i2;
            class13.anInt231 = (((i - j1) * j2) / k2) | 0;
            if (l === 1) {
                this.redrawTabArea = true;
            }
            if (l === 2 || l === 3) {
                this.redrawChatbox = true;
            }
            this.aBoolean1127 = true;
        }
    }

    /*private*/ public processActorOverheadText() {
        for (let i: number = -1; i < this.localPlayerCount; i++) {
            {
                const index: number = i === -1 ? this.thisPlayerId : this.playerList[i];
                const player: Player = this.players[index];
                if (player != null && player.textCycle > 0) {
                    player.textCycle--;
                    if (player.textCycle === 0) {
                        player.forcedChat = null;
                    }
                }
            }
        }
        for (let i: number = 0; i < this.anInt1133; i++) {
            {
                const index: number = this.anIntArray1134[i];
                const npc: Npc = this.npcs[index];
                if (npc != null && npc.textCycle > 0) {
                    npc.textCycle--;
                    if (npc.textCycle === 0) {
                        npc.forcedChat = null;
                    }
                }
            }
        }
    }

    public method67(i: number) {
        for (let j: number = 0; j < this.anInt1133; j++) {
            {
                const k: number = this.anIntArray1134[j];
                const class50_sub1_sub4_sub3_sub1: Npc = this.npcs[k];
                if (class50_sub1_sub4_sub3_sub1 != null) {
                    this.method68(
                        class50_sub1_sub4_sub3_sub1.npcDefinition.boundaryDimension,
                        (-97 as number) | 0,
                        class50_sub1_sub4_sub3_sub1
                    );
                }
            }
        }
        if (i !== -37214) {
            this.outBuffer.putByte(41);
        }
    }

    public method68(i: number, byte0: number, actor: Actor) {
        if (actor.worldX < 128 || actor.worldY < 128 || actor.worldX >= 13184 || actor.worldY >= 13184) {
            actor.emoteAnimation = -1;
            actor.graphic = -1;
            actor.anInt1606 = 0;
            actor.anInt1607 = 0;
            actor.worldX = actor.pathX[0] * 128 + actor.boundaryDimension * 64;
            actor.worldY = actor.pathY[0] * 128 + actor.boundaryDimension * 64;
            actor.resetPath();
        }
        if (actor === Game.localPlayer && (actor.worldX < 1536 || actor.worldY < 1536 || actor.worldX >= 11776 || actor.worldY >= 11776)) {
            actor.emoteAnimation = -1;
            actor.graphic = -1;
            actor.anInt1606 = 0;
            actor.anInt1607 = 0;
            actor.worldX = actor.pathX[0] * 128 + actor.boundaryDimension * 64;
            actor.worldY = actor.pathY[0] * 128 + actor.boundaryDimension * 64;
            actor.resetPath();
        }
        if (actor.anInt1606 > Game.pulseCycle) {
            this.method69(actor, true);
        } else if (actor.anInt1607 >= Game.pulseCycle) {
            this.method70(actor, -31135);
        } else {
            this.method71(actor, 0);
        }
        this.method72((8 as number) | 0, actor);
        this.method73(actor, -136);
        if (byte0 === -97) {
        }
    }

    public method72(byte0: number, class50_sub1_sub4_sub3: Actor) {
        if (byte0 !== 8) {
            this.anInt928 = this.incomingRandom.nextInt() | 0;
        }
        if (class50_sub1_sub4_sub3.anInt1600 === 0) {
            return;
        }
        if (class50_sub1_sub4_sub3.anInt1609 !== -1 && class50_sub1_sub4_sub3.anInt1609 < 32768) {
            const class50_sub1_sub4_sub3_sub1: Npc = this.npcs[class50_sub1_sub4_sub3.anInt1609];
            if (class50_sub1_sub4_sub3_sub1 != null) {
                const l: number = class50_sub1_sub4_sub3.worldX - class50_sub1_sub4_sub3_sub1.worldX;
                const j1: number = class50_sub1_sub4_sub3.worldY - class50_sub1_sub4_sub3_sub1.worldY;
                if (l !== 0 || j1 !== 0) {
                    class50_sub1_sub4_sub3.nextStepOrientation = (((Math.atan2(l, j1) * 325.949) as number) | 0) & 2047;
                }
            }
        }
        if (class50_sub1_sub4_sub3.anInt1609 >= 32768) {
            let i: number = class50_sub1_sub4_sub3.anInt1609 - 32768;
            if (i === this.thisPlayerServerId) {
                i = this.thisPlayerId;
            }
            const class50_sub1_sub4_sub3_sub2: Player = this.players[i];
            if (class50_sub1_sub4_sub3_sub2 != null) {
                const k1: number = class50_sub1_sub4_sub3.worldX - class50_sub1_sub4_sub3_sub2.worldX;
                const l1: number = class50_sub1_sub4_sub3.worldY - class50_sub1_sub4_sub3_sub2.worldY;
                if (k1 !== 0 || l1 !== 0) {
                    class50_sub1_sub4_sub3.nextStepOrientation = (((Math.atan2(k1, l1) * 325.949) as number) | 0) & 2047;
                }
            }
        }
        if (
            (class50_sub1_sub4_sub3.anInt1598 !== 0 || class50_sub1_sub4_sub3.anInt1599 !== 0) &&
            (class50_sub1_sub4_sub3.pathLength === 0 || class50_sub1_sub4_sub3.anInt1623 > 0)
        ) {
            const j: number =
                class50_sub1_sub4_sub3.worldX - (class50_sub1_sub4_sub3.anInt1598 - this.nextTopLeftTileX - this.nextTopLeftTileX) * 64;
            const i1: number =
                class50_sub1_sub4_sub3.worldY - (class50_sub1_sub4_sub3.anInt1599 - this.nextTopRightTileY - this.nextTopRightTileY) * 64;
            if (j !== 0 || i1 !== 0) {
                class50_sub1_sub4_sub3.nextStepOrientation = (((Math.atan2(j, i1) * 325.949) as number) | 0) & 2047;
            }
            class50_sub1_sub4_sub3.anInt1598 = 0;
            class50_sub1_sub4_sub3.anInt1599 = 0;
        }
        const k: number = (class50_sub1_sub4_sub3.nextStepOrientation - class50_sub1_sub4_sub3.anInt1612) & 2047;
        if (k !== 0) {
            if (k < class50_sub1_sub4_sub3.anInt1600 || k > 2048 - class50_sub1_sub4_sub3.anInt1600) {
                class50_sub1_sub4_sub3.anInt1612 = class50_sub1_sub4_sub3.nextStepOrientation;
            } else if (k > 1024) {
                class50_sub1_sub4_sub3.anInt1612 -= class50_sub1_sub4_sub3.anInt1600;
            } else {
                class50_sub1_sub4_sub3.anInt1612 += class50_sub1_sub4_sub3.anInt1600;
            }
            class50_sub1_sub4_sub3.anInt1612 &= 2047;
            if (
                class50_sub1_sub4_sub3.movementAnimation === class50_sub1_sub4_sub3.idleAnimation &&
                class50_sub1_sub4_sub3.anInt1612 !== class50_sub1_sub4_sub3.nextStepOrientation
            ) {
                if (class50_sub1_sub4_sub3.standTurnAnimationId !== -1) {
                    class50_sub1_sub4_sub3.movementAnimation = class50_sub1_sub4_sub3.standTurnAnimationId;
                    return;
                }
                class50_sub1_sub4_sub3.movementAnimation = class50_sub1_sub4_sub3.walkAnimationId;
            }
        }
    }

    public method73(class50_sub1_sub4_sub3: Actor, i: number) {
        while (i >= 0) {
            this.anInt1328 = this.incomingRandom.nextInt() | 0;
        }
        class50_sub1_sub4_sub3.aBoolean1592 = false;
        if (class50_sub1_sub4_sub3.movementAnimation !== -1) {
            const class14: AnimationSequence = AnimationSequence.animations[class50_sub1_sub4_sub3.movementAnimation];
            class50_sub1_sub4_sub3.anInt1590++;
            if (
                class50_sub1_sub4_sub3.displayedMovementFrames < class14.frameCount &&
                class50_sub1_sub4_sub3.anInt1590 > class14.getFrameLength(class50_sub1_sub4_sub3.displayedMovementFrames)
            ) {
                class50_sub1_sub4_sub3.anInt1590 = 1;
                class50_sub1_sub4_sub3.displayedMovementFrames++;
            }
            if (class50_sub1_sub4_sub3.displayedMovementFrames >= class14.frameCount) {
                class50_sub1_sub4_sub3.anInt1590 = 1;
                class50_sub1_sub4_sub3.displayedMovementFrames = 0;
            }
        }
        if (class50_sub1_sub4_sub3.graphic !== -1 && Game.pulseCycle >= class50_sub1_sub4_sub3.anInt1617) {
            if (class50_sub1_sub4_sub3.currentAnimation < 0) {
                class50_sub1_sub4_sub3.currentAnimation = 0;
            }
            const class14_1: AnimationSequence = SpotAnimation.cache[class50_sub1_sub4_sub3.graphic].sequences;
            class50_sub1_sub4_sub3.anInt1616++;
            if (
                class50_sub1_sub4_sub3.currentAnimation < class14_1.frameCount &&
                class50_sub1_sub4_sub3.anInt1616 > class14_1.getFrameLength(class50_sub1_sub4_sub3.currentAnimation)
            ) {
                class50_sub1_sub4_sub3.anInt1616 = 1;
                class50_sub1_sub4_sub3.currentAnimation++;
            }
            if (
                class50_sub1_sub4_sub3.currentAnimation >= class14_1.frameCount &&
                (class50_sub1_sub4_sub3.currentAnimation < 0 || class50_sub1_sub4_sub3.currentAnimation >= class14_1.frameCount)
            ) {
                class50_sub1_sub4_sub3.graphic = -1;
            }
        }
        if (class50_sub1_sub4_sub3.emoteAnimation !== -1 && class50_sub1_sub4_sub3.animationDelay <= 1) {
            const class14_2: AnimationSequence = AnimationSequence.animations[class50_sub1_sub4_sub3.emoteAnimation];
            if (
                class14_2.anInt305 === 1 &&
                class50_sub1_sub4_sub3.anInt1613 > 0 &&
                class50_sub1_sub4_sub3.anInt1606 <= Game.pulseCycle &&
                class50_sub1_sub4_sub3.anInt1607 < Game.pulseCycle
            ) {
                class50_sub1_sub4_sub3.animationDelay = 1;
                return;
            }
        }
        if (class50_sub1_sub4_sub3.emoteAnimation !== -1 && class50_sub1_sub4_sub3.animationDelay === 0) {
            const class14_3: AnimationSequence = AnimationSequence.animations[class50_sub1_sub4_sub3.emoteAnimation];
            class50_sub1_sub4_sub3.anInt1626++;
            if (
                class50_sub1_sub4_sub3.displayedEmoteFrames < class14_3.frameCount &&
                class50_sub1_sub4_sub3.anInt1626 > class14_3.getFrameLength(class50_sub1_sub4_sub3.displayedEmoteFrames)
            ) {
                class50_sub1_sub4_sub3.anInt1626 = 1;
                class50_sub1_sub4_sub3.displayedEmoteFrames++;
            }
            if (class50_sub1_sub4_sub3.displayedEmoteFrames >= class14_3.frameCount) {
                class50_sub1_sub4_sub3.displayedEmoteFrames -= class14_3.frameStep;
                class50_sub1_sub4_sub3.anInt1628++;
                if (class50_sub1_sub4_sub3.anInt1628 >= class14_3.anInt304) {
                    class50_sub1_sub4_sub3.emoteAnimation = -1;
                }
                if (
                    class50_sub1_sub4_sub3.displayedEmoteFrames < 0 ||
                    class50_sub1_sub4_sub3.displayedEmoteFrames >= class14_3.frameCount
                ) {
                    class50_sub1_sub4_sub3.emoteAnimation = -1;
                }
            }
            class50_sub1_sub4_sub3.aBoolean1592 = class14_3.aBoolean300;
        }
        if (class50_sub1_sub4_sub3.animationDelay > 0) {
            class50_sub1_sub4_sub3.animationDelay--;
        }
    }

    public method71(class50_sub1_sub4_sub3: Actor, i: number) {
        class50_sub1_sub4_sub3.movementAnimation = class50_sub1_sub4_sub3.idleAnimation;
        if (class50_sub1_sub4_sub3.pathLength === 0) {
            class50_sub1_sub4_sub3.anInt1623 = 0;
            return;
        }
        if (class50_sub1_sub4_sub3.emoteAnimation !== -1 && class50_sub1_sub4_sub3.animationDelay === 0) {
            const class14: AnimationSequence = AnimationSequence.animations[class50_sub1_sub4_sub3.emoteAnimation];
            if (class50_sub1_sub4_sub3.anInt1613 > 0 && class14.anInt305 === 0) {
                class50_sub1_sub4_sub3.anInt1623++;
                return;
            }
            if (class50_sub1_sub4_sub3.anInt1613 <= 0 && class14.priority === 0) {
                class50_sub1_sub4_sub3.anInt1623++;
                return;
            }
        }
        const j: number = class50_sub1_sub4_sub3.worldX;
        const k: number = class50_sub1_sub4_sub3.worldY;
        const l: number =
            class50_sub1_sub4_sub3.pathX[class50_sub1_sub4_sub3.pathLength - 1] * 128 + class50_sub1_sub4_sub3.boundaryDimension * 64;
        const i1: number =
            class50_sub1_sub4_sub3.pathY[class50_sub1_sub4_sub3.pathLength - 1] * 128 + class50_sub1_sub4_sub3.boundaryDimension * 64;
        if (l - j > 256 || l - j < -256 || i1 - k > 256 || i1 - k < -256) {
            class50_sub1_sub4_sub3.worldX = l;
            class50_sub1_sub4_sub3.worldY = i1;
            return;
        }
        if (j < l) {
            if (k < i1) {
                class50_sub1_sub4_sub3.nextStepOrientation = 1280;
            } else if (k > i1) {
                class50_sub1_sub4_sub3.nextStepOrientation = 1792;
            } else {
                class50_sub1_sub4_sub3.nextStepOrientation = 1536;
            }
        } else if (j > l) {
            if (k < i1) {
                class50_sub1_sub4_sub3.nextStepOrientation = 768;
            } else if (k > i1) {
                class50_sub1_sub4_sub3.nextStepOrientation = 256;
            } else {
                class50_sub1_sub4_sub3.nextStepOrientation = 512;
            }
        } else if (k < i1) {
            class50_sub1_sub4_sub3.nextStepOrientation = 1024;
        } else {
            class50_sub1_sub4_sub3.nextStepOrientation = 0;
        }
        let j1: number = (class50_sub1_sub4_sub3.nextStepOrientation - class50_sub1_sub4_sub3.anInt1612) & 2047;
        if (j1 > 1024) {
            j1 -= 2048;
        }
        let k1: number = class50_sub1_sub4_sub3.turnAroundAnimationId;
        if (i !== 0) {
            this.outBuffer.putByte(34);
        }
        if (j1 >= -256 && j1 <= 256) {
            k1 = class50_sub1_sub4_sub3.walkAnimationId;
        } else if (j1 >= 256 && j1 < 768) {
            k1 = class50_sub1_sub4_sub3.turnLeftAnimationId;
        } else if (j1 >= -768 && j1 <= -256) {
            k1 = class50_sub1_sub4_sub3.turnRightAnimationId;
        }
        if (k1 === -1) {
            k1 = class50_sub1_sub4_sub3.walkAnimationId;
        }
        class50_sub1_sub4_sub3.movementAnimation = k1;
        let l1: number = 4;
        if (
            class50_sub1_sub4_sub3.anInt1612 !== class50_sub1_sub4_sub3.nextStepOrientation &&
            class50_sub1_sub4_sub3.anInt1609 === -1 &&
            class50_sub1_sub4_sub3.anInt1600 !== 0
        ) {
            l1 = 2;
        }
        if (class50_sub1_sub4_sub3.pathLength > 2) {
            l1 = 6;
        }
        if (class50_sub1_sub4_sub3.pathLength > 3) {
            l1 = 8;
        }
        if (class50_sub1_sub4_sub3.anInt1623 > 0 && class50_sub1_sub4_sub3.pathLength > 1) {
            l1 = 8;
            class50_sub1_sub4_sub3.anInt1623--;
        }
        if (class50_sub1_sub4_sub3.runningQueue[class50_sub1_sub4_sub3.pathLength - 1]) {
            l1 <<= 1;
        }
        if (
            l1 >= 8 &&
            class50_sub1_sub4_sub3.movementAnimation === class50_sub1_sub4_sub3.walkAnimationId &&
            class50_sub1_sub4_sub3.runAnimationId !== -1
        ) {
            class50_sub1_sub4_sub3.movementAnimation = class50_sub1_sub4_sub3.runAnimationId;
        }
        if (j < l) {
            class50_sub1_sub4_sub3.worldX += l1;
            if (class50_sub1_sub4_sub3.worldX > l) {
                class50_sub1_sub4_sub3.worldX = l;
            }
        } else if (j > l) {
            class50_sub1_sub4_sub3.worldX -= l1;
            if (class50_sub1_sub4_sub3.worldX < l) {
                class50_sub1_sub4_sub3.worldX = l;
            }
        }
        if (k < i1) {
            class50_sub1_sub4_sub3.worldY += l1;
            if (class50_sub1_sub4_sub3.worldY > i1) {
                class50_sub1_sub4_sub3.worldY = i1;
            }
        } else if (k > i1) {
            class50_sub1_sub4_sub3.worldY -= l1;
            if (class50_sub1_sub4_sub3.worldY < i1) {
                class50_sub1_sub4_sub3.worldY = i1;
            }
        }
        if (class50_sub1_sub4_sub3.worldX === l && class50_sub1_sub4_sub3.worldY === i1) {
            class50_sub1_sub4_sub3.pathLength--;
            if (class50_sub1_sub4_sub3.anInt1613 > 0) {
                class50_sub1_sub4_sub3.anInt1613--;
            }
        }
    }

    public method69(class50_sub1_sub4_sub3: Actor, flag: boolean) {
        if (!flag) {
            Game.aBoolean963 = !Game.aBoolean963;
        }
        const i: number = class50_sub1_sub4_sub3.anInt1606 - Game.pulseCycle;
        const j: number = class50_sub1_sub4_sub3.anInt1602 * 128 + class50_sub1_sub4_sub3.boundaryDimension * 64;
        const k: number = class50_sub1_sub4_sub3.anInt1604 * 128 + class50_sub1_sub4_sub3.boundaryDimension * 64;
        class50_sub1_sub4_sub3.worldX += ((j - class50_sub1_sub4_sub3.worldX) / i) | 0;
        class50_sub1_sub4_sub3.worldY += ((k - class50_sub1_sub4_sub3.worldY) / i) | 0;
        class50_sub1_sub4_sub3.anInt1623 = 0;
        if (class50_sub1_sub4_sub3.anInt1608 === 0) {
            class50_sub1_sub4_sub3.nextStepOrientation = 1024;
        }
        if (class50_sub1_sub4_sub3.anInt1608 === 1) {
            class50_sub1_sub4_sub3.nextStepOrientation = 1536;
        }
        if (class50_sub1_sub4_sub3.anInt1608 === 2) {
            class50_sub1_sub4_sub3.nextStepOrientation = 0;
        }
        if (class50_sub1_sub4_sub3.anInt1608 === 3) {
            class50_sub1_sub4_sub3.nextStepOrientation = 512;
        }
    }

    public method70(class50_sub1_sub4_sub3: Actor, i: number) {
        if (
            class50_sub1_sub4_sub3.anInt1607 === Game.pulseCycle ||
            class50_sub1_sub4_sub3.emoteAnimation === -1 ||
            class50_sub1_sub4_sub3.animationDelay !== 0 ||
            class50_sub1_sub4_sub3.anInt1626 + 1 >
                AnimationSequence.animations[class50_sub1_sub4_sub3.emoteAnimation].getFrameLength(
                    class50_sub1_sub4_sub3.displayedEmoteFrames
                )
        ) {
            const j: number = class50_sub1_sub4_sub3.anInt1607 - class50_sub1_sub4_sub3.anInt1606;
            const k: number = Game.pulseCycle - class50_sub1_sub4_sub3.anInt1606;
            const l: number = class50_sub1_sub4_sub3.anInt1602 * 128 + class50_sub1_sub4_sub3.boundaryDimension * 64;
            const i1: number = class50_sub1_sub4_sub3.anInt1604 * 128 + class50_sub1_sub4_sub3.boundaryDimension * 64;
            const j1: number = class50_sub1_sub4_sub3.anInt1603 * 128 + class50_sub1_sub4_sub3.boundaryDimension * 64;
            const k1: number = class50_sub1_sub4_sub3.anInt1605 * 128 + class50_sub1_sub4_sub3.boundaryDimension * 64;
            class50_sub1_sub4_sub3.worldX = ((l * (j - k) + j1 * k) / j) | 0;
            class50_sub1_sub4_sub3.worldY = ((i1 * (j - k) + k1 * k) / j) | 0;
        }
        class50_sub1_sub4_sub3.anInt1623 = 0;
        if (class50_sub1_sub4_sub3.anInt1608 === 0) {
            class50_sub1_sub4_sub3.nextStepOrientation = 1024;
        }
        if (class50_sub1_sub4_sub3.anInt1608 === 1) {
            class50_sub1_sub4_sub3.nextStepOrientation = 1536;
        }
        if (class50_sub1_sub4_sub3.anInt1608 === 2) {
            class50_sub1_sub4_sub3.nextStepOrientation = 0;
        }
        if (class50_sub1_sub4_sub3.anInt1608 === 3) {
            class50_sub1_sub4_sub3.nextStepOrientation = 512;
        }
        class50_sub1_sub4_sub3.anInt1612 = class50_sub1_sub4_sub3.nextStepOrientation;
        if (i === -31135) {
        }
    }

    public method100(i: number) {
        for (let j: number = -1; j < this.localPlayerCount; j++) {
            {
                let k: number;
                if (j === -1) {
                    k = this.thisPlayerId;
                } else {
                    k = this.playerList[j];
                }
                const class50_sub1_sub4_sub3_sub2: Player = this.players[k];
                if (class50_sub1_sub4_sub3_sub2 != null) {
                    this.method68(1, (-97 as number) | 0, class50_sub1_sub4_sub3_sub2);
                }
            }
        }
        if (i < this.anInt1222 || i > this.anInt1222) {
            for (let l: number = 1; l > 0; l++) {}
        }
    }

    public dropClient() {
        if (this.anInt873 > 0) {
            this.logout();
            return;
        }
        this.method125("Please wait - attempting to reestablish", "Connection lost");
        this.minimapState = 0;
        this.destinationX = 0;
        const class17: BufferedConnection = this.gameConnection;
        this.loggedIn = false;
        this.anInt850 = 0;
        this.login(this.username, this.password, true);
        if (!this.loggedIn) {
            this.logout();
        }
        try {
            class17.close();
            return;
        } catch (_ex) {
            return;
        }
    }

    public method116(j: number, abyte0: number[]): boolean {
        if (abyte0 == null) {
            return true;
        } else {
            return SignLink.saveWave(abyte0, j);
        }
    }

    public method152() {
        for (let index: number = 0; index < this.currentSound; index++) {
            {
                let flag1: boolean = false;
                try {
                    const stream: Buffer = SoundTrack.data(this.sound[index], this.soundType[index]);
                    // TODO fix sound
                    new SoundPlayer(
                        null /*new ByteArrayInputStream(stream.buffer, 0, stream.currentPosition)*/,
                        this.soundVolume[index],
                        this.soundDelay[index]
                    );
                    if (
                        new Date().getTime() +
                            (n => (n < 0 ? Math.ceil(n) : Math.floor(n)))(((stream.currentPosition / 22) | 0) as number) >
                        this.aLong1172 + (n => (n < 0 ? Math.ceil(n) : Math.floor(n)))(((this.anInt1257 / 22) | 0) as number)
                    ) {
                        this.anInt1257 = stream.currentPosition;
                        this.aLong1172 = new Date().getTime();
                        if (this.method116(stream.currentPosition, Array.from(stream.buffer))) {
                            this.anInt1272 = this.sound[index];
                            this.anInt935 = this.soundType[index];
                        } else {
                            flag1 = true;
                        }
                    }
                } catch (exception) {
                    if (SignLink.__reportError) {
                        this.outBuffer.putOpcode(80);
                        this.outBuffer.putShort(this.sound[index] & 32767);
                    } else {
                        this.outBuffer.putOpcode(80);
                        this.outBuffer.putShort(-1);
                    }
                }
                if (!flag1 || this.soundDelay[index] === -5) {
                    this.currentSound--;
                    for (let j: number = index; j < this.currentSound; j++) {
                        {
                            this.sound[j] = this.sound[j + 1];
                            this.soundType[j] = this.soundType[j + 1];
                            this.soundDelay[j] = this.soundDelay[j + 1];
                            this.soundVolume[j] = this.soundVolume[j + 1];
                        }
                    }
                    index--;
                } else {
                    this.soundDelay[index] = -5;
                }
            }
        }
        if (this.previousSong > 0) {
            this.previousSong -= 20;
            if (this.previousSong < 0) {
                this.previousSong = 0;
            }
            if (this.previousSong === 0 && this.musicEnabled && !Game.lowMemory) {
                this.nextSong = this.currentSong;
                this.songChanging = true;
                this.onDemandRequester.request(2, this.nextSong);
            }
        }
    }

    public method36(i: number) {
        if (i !== 16220) {
            this.anInt1328 = 458;
        }
        if (this.loadingStage === 2) {
            for (
                let spawnObjectNode: SpawnObjectNode = this.aClass6_1261.first() as SpawnObjectNode;
                spawnObjectNode != null;
                spawnObjectNode = this.aClass6_1261.next() as SpawnObjectNode
            ) {
                {
                    if (spawnObjectNode.anInt1390 > 0) {
                        spawnObjectNode.anInt1390--;
                    }
                    if (spawnObjectNode.anInt1390 === 0) {
                        if (
                            spawnObjectNode.anInt1387 < 0 ||
                            Region.method170(spawnObjectNode.anInt1389, this.aByte1143, spawnObjectNode.anInt1387)
                        ) {
                            this.method45(
                                spawnObjectNode.anInt1388,
                                spawnObjectNode.anInt1393,
                                spawnObjectNode.anInt1387,
                                spawnObjectNode.anInt1394,
                                spawnObjectNode.anInt1391,
                                spawnObjectNode.anInt1389,
                                (1 as number) | 0,
                                spawnObjectNode.anInt1392
                            );
                            spawnObjectNode.remove();
                        }
                    } else {
                        if (spawnObjectNode.anInt1395 > 0) {
                            spawnObjectNode.anInt1395--;
                        }
                        if (
                            spawnObjectNode.anInt1395 === 0 &&
                            spawnObjectNode.anInt1393 >= 1 &&
                            spawnObjectNode.anInt1394 >= 1 &&
                            spawnObjectNode.anInt1393 <= 102 &&
                            spawnObjectNode.anInt1394 <= 102 &&
                            (spawnObjectNode.anInt1384 < 0 ||
                                Region.method170(spawnObjectNode.anInt1386, this.aByte1143, spawnObjectNode.anInt1384))
                        ) {
                            this.method45(
                                spawnObjectNode.anInt1385,
                                spawnObjectNode.anInt1393,
                                spawnObjectNode.anInt1384,
                                spawnObjectNode.anInt1394,
                                spawnObjectNode.anInt1391,
                                spawnObjectNode.anInt1386,
                                (1 as number) | 0,
                                spawnObjectNode.anInt1392
                            );
                            spawnObjectNode.anInt1395 = -1;
                            if (spawnObjectNode.anInt1384 === spawnObjectNode.anInt1387 && spawnObjectNode.anInt1387 === -1) {
                                spawnObjectNode.remove();
                            } else if (
                                spawnObjectNode.anInt1384 === spawnObjectNode.anInt1387 &&
                                spawnObjectNode.anInt1385 === spawnObjectNode.anInt1388 &&
                                spawnObjectNode.anInt1386 === spawnObjectNode.anInt1389
                            ) {
                                spawnObjectNode.remove();
                            }
                        }
                    }
                }
            }
        }
    }

    public method45(i: number, j: number, k: number, l: number, i1: number, j1: number, byte0: number, k1: number) {
        if (byte0 !== this.aByte1066) {
            this.anInt1175 = -380;
        }
        if (j >= 1 && l >= 1 && j <= 102 && l <= 102) {
            if (Game.lowMemory && i1 !== this.plane) {
                return;
            }
            let l1: number = 0;
            if (k1 === 0) {
                l1 = this.currentScene.method267(i1, j, l);
            }
            if (k1 === 1) {
                l1 = this.currentScene.method268(j, (4 as number) | 0, i1, l);
            }
            if (k1 === 2) {
                l1 = this.currentScene.method269(i1, j, l);
            }
            if (k1 === 3) {
                l1 = this.currentScene.getFloorDecorationHash(i1, j, l);
            }
            if (l1 !== 0) {
                const l2: number = this.currentScene.method271(i1, j, l, l1);
                const i2: number = (l1 >> 14) & 32767;
                const j2: number = l2 & 31;
                const k2: number = l2 >> 6;
                if (k1 === 0) {
                    this.currentScene.method258(l, i1, j, true);
                    const class47: GameObjectDefinition = GameObjectDefinition.getDefinition(i2);
                    if (class47.solid) {
                        this.currentCollisionMap[i1].unmarkWall(k2, j, l, j2, class47.walkable);
                    }
                }
                if (k1 === 1) {
                    this.currentScene.method259(false, j, l, i1);
                }
                if (k1 === 2) {
                    this.currentScene.method260(l, i1, -779, j);
                    const class47_1: GameObjectDefinition = GameObjectDefinition.getDefinition(i2);
                    if (j + class47_1.sizeX > 103 || l + class47_1.sizeX > 103 || j + class47_1.sizeY > 103 || l + class47_1.sizeY > 103) {
                        return;
                    }
                    if (class47_1.solid) {
                        this.currentCollisionMap[i1].unmarkSolidOccupant(
                            this.anInt1055,
                            l,
                            j,
                            k2,
                            class47_1.sizeY,
                            class47_1.walkable,
                            class47_1.sizeX
                        );
                    }
                }
                if (k1 === 3) {
                    this.currentScene.method261(j, l, true, i1);
                    const class47_2: GameObjectDefinition = GameObjectDefinition.getDefinition(i2);
                    if (class47_2.solid && class47_2.actionsBoolean) {
                        this.currentCollisionMap[i1].unmarkConcealed(j, l);
                    }
                }
            }
            if (k >= 0) {
                let i3: number = i1;
                if (i3 < 3 && (this.currentSceneTileFlags[1][j][l] & 2) === 2) {
                    i3++;
                }
                Region.method165(k, i3, j1, l, this.currentCollisionMap[i1], i, j, 0, i1, this.currentScene, this.anIntArrayArrayArray891);
            }
        }
    }

    public async parseIncomingPacket(): Promise<boolean> {
        if (this.gameConnection == null) {
            return false;
        }
        try {
            let available: number = this.gameConnection.getAvailable();
            if (available === 0) {
                return false;
            }
            if (this.opcode === -1) {
                await this.gameConnection.read$byte_A$int$int(this.buffer.buffer, 0, 1);
                this.opcode = this.buffer.buffer[0] & 255;
                if (this.incomingRandom != null) {
                    this.opcode = (this.opcode - this.incomingRandom.nextInt()) & 255;
                }
                console.log("Received packet with opcode: " + this.opcode);
                this.packetSize = PacketConstants.PACKET_SIZES[this.opcode];
                available--;
            }
            if (this.packetSize === -1) {
                if (available > 0) {
                    await this.gameConnection.read$byte_A$int$int(this.buffer.buffer, 0, 1);
                    this.packetSize = this.buffer.buffer[0] & 255;
                    available--;
                } else {
                    return false;
                }
            }
            if (this.packetSize === -2) {
                if (available > 1) {
                    await this.gameConnection.read$byte_A$int$int(this.buffer.buffer, 0, 2);
                    this.buffer.currentPosition = 0;
                    this.packetSize = this.buffer.getUnsignedLEShort();
                    available -= 2;
                } else {
                    return false;
                }
            }
            if (available < this.packetSize) {
                return false;
            }
            this.buffer.currentPosition = 0;
            await this.gameConnection.read$byte_A$int$int(this.buffer.buffer, 0, this.packetSize);
            this.timeoutCounter = 0;
            this.thirdLastOpcode = this.secondLastOpcode;
            this.secondLastOpcode = this.lastOpcode;
            this.lastOpcode = this.opcode;
            if (this.opcode === 166) {
                const l: number = this.buffer.method552();
                const l10: number = this.buffer.method552();
                const interfaceId: number = this.buffer.getUnsignedLEShort();
                const class13_5: Widget = Widget.forId(interfaceId);
                class13_5.anInt228 = l10;
                class13_5.anInt259 = l;
                this.opcode = -1;
                return true;
            }
            if (this.opcode === 186) {
                const i1: number = this.buffer.method550();
                const interfaceId: number = this.buffer.getLittleShortA();
                const l16: number = this.buffer.method550();
                const i22: number = this.buffer.method549();
                Widget.forId(interfaceId).rotationX = i1;
                Widget.forId(interfaceId).rotationY = i22;
                Widget.forId(interfaceId).zoom = l16;
                this.opcode = -1;
                return true;
            }
            if (this.opcode === 216) {
                const j1: number = this.buffer.getLittleShortA();
                const interfaceId: number = this.buffer.getLittleShortA();
                Widget.forId(interfaceId).modelType = 1;
                Widget.forId(interfaceId).modelId = j1;
                this.opcode = -1;
                return true;
            }
            if (this.opcode === 26) {
                const k1: number = this.buffer.getUnsignedLEShort();
                const k11: number = this.buffer.getUnsignedByte();
                const i17: number = this.buffer.getUnsignedLEShort();
                if (i17 === 65535) {
                    if (this.currentSound < 50) {
                        this.sound[this.currentSound] = (k1 as number) | 0;
                        this.soundType[this.currentSound] = k11;
                        this.soundDelay[this.currentSound] = 0;
                        this.currentSound++;
                    }
                } else if (this.aBoolean1301 && !Game.lowMemory && this.currentSound < 50) {
                    this.sound[this.currentSound] = k1;
                    this.soundType[this.currentSound] = k11;
                    this.soundDelay[this.currentSound] = i17 + SoundTrack.trackDelays[k1];
                    this.currentSound++;
                }
                this.opcode = -1;
                return true;
            }
            if (this.opcode === 182) {
                const l1: number = this.buffer.method550();
                const byte0: number = this.buffer.getSignedByteSubtracted();
                this.anIntArray1005[l1] = byte0;
                if (this.widgetSettings[l1] !== byte0) {
                    this.widgetSettings[l1] = byte0;
                    this.updateVarp(0, l1);
                    this.redrawTabArea = true;
                    if (this.dialogueId !== -1) {
                        this.redrawChatbox = true;
                    }
                }
                this.opcode = -1;
                return true;
            }
            if (this.opcode === 13) {
                for (let i2: number = 0; i2 < this.players.length; i2++) {
                    if (this.players[i2] != null) {
                        this.players[i2].emoteAnimation = -1;
                    }
                }
                for (let l11: number = 0; l11 < this.npcs.length; l11++) {
                    if (this.npcs[l11] != null) {
                        this.npcs[l11].emoteAnimation = -1;
                    }
                }
                this.opcode = -1;
                return true;
            }
            if (this.opcode === 156) {
                this.minimapState = this.buffer.getUnsignedByte();
                this.opcode = -1;
                return true;
            }
            if (this.opcode === 162) {
                const j2: number = this.buffer.method550();
                const interfaceId: number = this.buffer.method549();
                Widget.forId(interfaceId).modelType = 2;
                Widget.forId(interfaceId).modelId = j2;
                this.opcode = -1;
                return true;
            }
            if (this.opcode === 109) {
                const k2: number = this.buffer.getUnsignedLEShort();
                this.method112((36 as number) | 0, k2);
                if (this.anInt1089 !== -1) {
                    this.method44(Game.aBoolean1190, this.anInt1089);
                    this.anInt1089 = -1;
                    this.redrawTabArea = true;
                    this.aBoolean950 = true;
                }
                if (this.anInt1053 !== -1) {
                    this.method44(Game.aBoolean1190, this.anInt1053);
                    this.anInt1053 = -1;
                    this.aBoolean1046 = true;
                }
                if (this.anInt960 !== -1) {
                    this.method44(Game.aBoolean1190, this.anInt960);
                    this.anInt960 = -1;
                }
                if (this.openInterfaceId !== -1) {
                    this.method44(Game.aBoolean1190, this.openInterfaceId);
                    this.openInterfaceId = -1;
                }
                if (this.backDialogueId !== k2) {
                    this.method44(Game.aBoolean1190, this.backDialogueId);
                    this.backDialogueId = k2;
                }
                this.aBoolean1239 = false;
                this.redrawChatbox = true;
                this.opcode = -1;
                return true;
            }
            if (this.opcode === 220) {
                let songID: number = this.buffer.getLittleShortA();
                if (songID === 65535) {
                    songID = -1;
                }
                if (songID !== this.currentSong && this.musicEnabled && !Game.lowMemory && this.previousSong === 0) {
                    this.nextSong = songID;
                    this.songChanging = true;
                    this.onDemandRequester.request(2, this.nextSong);
                }
                this.currentSong = songID;
                this.opcode = -1;
                return true;
            }
            if (this.opcode === 249) {
                const fileId: number = this.buffer.method549();
                const j12: number = this.buffer.method554();
                if (this.musicEnabled && !Game.lowMemory) {
                    this.nextSong = fileId;
                    this.songChanging = false;
                    this.onDemandRequester.request(2, this.nextSong);
                    this.previousSong = j12;
                }
                this.opcode = -1;
                return true;
            }
            if (this.opcode === 158) {
                const j3: number = this.buffer.method552();
                if (j3 !== this.dialogueId) {
                    this.method44(Game.aBoolean1190, this.dialogueId);
                    this.dialogueId = j3;
                }
                this.redrawChatbox = true;
                this.opcode = -1;
                return true;
            }
            if (this.opcode === 218) {
                const interfaceId: number = this.buffer.getUnsignedLEShort();
                const rgb: number = this.buffer.method550();
                const j17: number = (rgb >> 10) & 31;
                const j22: number = (rgb >> 5) & 31;
                const l24: number = rgb & 31;
                Widget.forId(interfaceId).disabledColor = (j17 << 19) + (j22 << 11) + (l24 << 3);
                this.opcode = -1;
                return true;
            }
            if (this.opcode === 157) {
                const slot: number = this.buffer.getByteNegated();
                let option: string = this.buffer.getString();
                const alwaysOnTop: number = this.buffer.getUnsignedByte();
                if (slot >= 1 && slot <= 5) {
                    if (/* equalsIgnoreCase */ ((o1, o2) => o1.toUpperCase() === (o2 === null ? o2 : o2.toUpperCase()))(option, "null")) {
                        option = null;
                    }
                    this.aStringArray1069[slot - 1] = option;
                    this.aBooleanArray1070[slot - 1] = alwaysOnTop === 0;
                }
                this.opcode = -1;
                return true;
            }
            if (this.opcode === 6) {
                this.messagePromptRaised = false;
                this.inputType = 2;
                this.inputInputMessage = "";
                this.redrawChatbox = true;
                this.opcode = -1;
                return true;
            }
            if (this.opcode === 201) {
                this.publicChatMode = this.buffer.getUnsignedByte();
                this.privateChatMode = this.buffer.getUnsignedByte();
                this.tradeMode = this.buffer.getUnsignedByte();
                this.aBoolean1212 = true;
                this.redrawChatbox = true;
                this.opcode = -1;
                return true;
            }
            if (this.opcode === 199) {
                this.anInt1197 = this.buffer.getUnsignedByte();
                if (this.anInt1197 === 1) {
                    this.anInt1226 = this.buffer.getUnsignedLEShort();
                }
                if (this.anInt1197 >= 2 && this.anInt1197 <= 6) {
                    if (this.anInt1197 === 2) {
                        this.anInt847 = 64;
                        this.anInt848 = 64;
                    }
                    if (this.anInt1197 === 3) {
                        this.anInt847 = 0;
                        this.anInt848 = 64;
                    }
                    if (this.anInt1197 === 4) {
                        this.anInt847 = 128;
                        this.anInt848 = 64;
                    }
                    if (this.anInt1197 === 5) {
                        this.anInt847 = 64;
                        this.anInt848 = 0;
                    }
                    if (this.anInt1197 === 6) {
                        this.anInt847 = 64;
                        this.anInt848 = 128;
                    }
                    this.anInt1197 = 2;
                    this.anInt844 = this.buffer.getUnsignedLEShort();
                    this.anInt845 = this.buffer.getUnsignedLEShort();
                    this.anInt846 = this.buffer.getUnsignedByte();
                }
                if (this.anInt1197 === 10) {
                    this.anInt1151 = this.buffer.getUnsignedLEShort();
                }
                this.opcode = -1;
                return true;
            }
            if (this.opcode === 167) {
                this.oriented = true;
                this.anInt993 = this.buffer.getUnsignedByte();
                this.anInt994 = this.buffer.getUnsignedByte();
                this.anInt995 = this.buffer.getUnsignedLEShort();
                this.anInt996 = this.buffer.getUnsignedByte();
                this.anInt997 = this.buffer.getUnsignedByte();
                if (this.anInt997 >= 100) {
                    const i4: number = this.anInt993 * 128 + 64;
                    const l12: number = this.anInt994 * 128 + 64;
                    const l17: number = this.getTileHeight(l12, i4, (9 as number) | 0, this.plane) - this.anInt995;
                    const k22: number = i4 - this.cameraX;
                    const i25: number = l17 - this.cameraZ;
                    const k27: number = l12 - this.cameraY;
                    const i30: number = (Math.sqrt(k22 * k22 + k27 * k27) as number) | 0;
                    this.cameraPitch = (((Math.atan2(i25, i30) * 325.949) as number) | 0) & 2047;
                    this.cameraYaw = (((Math.atan2(k22, k27) * -325.949) as number) | 0) & 2047;
                    if (this.cameraPitch < 128) {
                        this.cameraPitch = 128;
                    }
                    if (this.cameraPitch > 383) {
                        this.cameraPitch = 383;
                    }
                }
                this.opcode = -1;
                return true;
            }
            if (this.opcode === 5) {
                this.logout();
                this.opcode = -1;
                return false;
            }
            if (this.opcode === 115) {
                const j4: number = this.buffer.method557();
                const i13: number = this.buffer.method549();
                this.anIntArray1005[i13] = j4;
                if (this.widgetSettings[i13] !== j4) {
                    this.widgetSettings[i13] = j4;
                    this.updateVarp(0, i13);
                    this.redrawTabArea = true;
                    if (this.dialogueId !== -1) {
                        this.redrawChatbox = true;
                    }
                }
                this.opcode = -1;
                return true;
            }
            if (this.opcode === 29) {
                if (this.anInt1089 !== -1) {
                    this.method44(Game.aBoolean1190, this.anInt1089);
                    this.anInt1089 = -1;
                    this.redrawTabArea = true;
                    this.aBoolean950 = true;
                }
                if (this.backDialogueId !== -1) {
                    this.method44(Game.aBoolean1190, this.backDialogueId);
                    this.backDialogueId = -1;
                    this.redrawChatbox = true;
                }
                if (this.anInt1053 !== -1) {
                    this.method44(Game.aBoolean1190, this.anInt1053);
                    this.anInt1053 = -1;
                    this.aBoolean1046 = true;
                }
                if (this.anInt960 !== -1) {
                    this.method44(Game.aBoolean1190, this.anInt960);
                    this.anInt960 = -1;
                }
                if (this.openInterfaceId !== -1) {
                    this.method44(Game.aBoolean1190, this.openInterfaceId);
                    this.openInterfaceId = -1;
                }
                if (this.inputType !== 0) {
                    this.inputType = 0;
                    this.redrawChatbox = true;
                }
                this.aBoolean1239 = false;
                this.opcode = -1;
                return true;
            }
            if (this.opcode === 76) {
                this.anInt1083 = this.buffer.method549();
                this.anInt1075 = this.buffer.getLittleShortA();
                this.buffer.getUnsignedLEShort();
                this.anInt1208 = this.buffer.getUnsignedLEShort();
                this.anInt1170 = this.buffer.method549();
                this.anInt1273 = this.buffer.method550();
                this.anInt1215 = this.buffer.method550();
                this.anInt992 = this.buffer.getUnsignedLEShort();
                this.lastAddress = this.buffer.method555();
                this.anInt1034 = this.buffer.getLittleShortA();
                this.buffer.getByteAdded();
                SignLink.dnsLookup(TextUtils.decodeAddress(this.lastAddress));
                this.opcode = -1;
                return true;
            }
            if (this.opcode === 63) {
                const message: string = this.buffer.getString();
                if (
                    /* endsWith */ ((str, searchString) => {
                        const pos = str.length - searchString.length;
                        const lastIndex = str.indexOf(searchString, pos);
                        return lastIndex !== -1 && lastIndex === pos;
                    })(message, ":tradereq:")
                ) {
                    const s3: string = message.substring(0, message.indexOf(":"));
                    const l18: number = TextUtils.nameToLong(s3);
                    let flag1: boolean = false;
                    for (let l27: number = 0; l27 < this.ignoresCount; l27++) {
                        {
                            if (this.ignores[l27] !== l18) {
                                continue;
                            }
                            flag1 = true;
                            break;
                        }
                    }
                    if (!flag1 && !this.inTutorialIsland) {
                        this.addChatMessage(s3, "wishes to trade with you.", 4);
                    }
                } else if (
                    /* endsWith */ ((str, searchString) => {
                        const pos = str.length - searchString.length;
                        const lastIndex = str.indexOf(searchString, pos);
                        return lastIndex !== -1 && lastIndex === pos;
                    })(message, ":duelreq:")
                ) {
                    const s4: string = message.substring(0, message.indexOf(":"));
                    const l19: number = TextUtils.nameToLong(s4);
                    let flag2: boolean = false;
                    for (let i28: number = 0; i28 < this.ignoresCount; i28++) {
                        {
                            if (this.ignores[i28] !== l19) {
                                continue;
                            }
                            flag2 = true;
                            break;
                        }
                    }
                    if (!flag2 && !this.inTutorialIsland) {
                        this.addChatMessage(s4, "wishes to duel with you.", 8);
                    }
                } else if (
                    /* endsWith */ ((str, searchString) => {
                        const pos = str.length - searchString.length;
                        const lastIndex = str.indexOf(searchString, pos);
                        return lastIndex !== -1 && lastIndex === pos;
                    })(message, ":chalreq:")
                ) {
                    const s5: string = message.substring(0, message.indexOf(":"));
                    const l20: number = TextUtils.nameToLong(s5);
                    let flag3: boolean = false;
                    for (let j28: number = 0; j28 < this.ignoresCount; j28++) {
                        {
                            if (this.ignores[j28] !== l20) {
                                continue;
                            }
                            flag3 = true;
                            break;
                        }
                    }
                    if (!flag3 && !this.inTutorialIsland) {
                        const s8: string = message.substring(message.indexOf(":") + 1, message.length - 9);
                        this.addChatMessage(s5, s8, 8);
                    }
                } else {
                    this.addChatMessage("", message, 0);
                }
                this.opcode = -1;
                return true;
            }
            if (this.opcode === 50) {
                const k4: number = this.buffer.getSignedShort();
                if (k4 >= 0) {
                    this.method112((36 as number) | 0, k4);
                }
                if (k4 !== this.anInt1279) {
                    this.method44(Game.aBoolean1190, this.anInt1279);
                    this.anInt1279 = k4;
                }
                this.opcode = -1;
                return true;
            }
            if (this.opcode === 82) {
                const flag: boolean = this.buffer.getUnsignedByte() === 1;
                const interfaceId: number = this.buffer.getUnsignedLEShort();
                Widget.forId(interfaceId).hiddenUntilHovered = flag;
                this.opcode = -1;
                return true;
            }
            if (this.opcode === 174) {
                if (this.anInt1285 === 12) {
                    this.redrawTabArea = true;
                }
                this.anInt1030 = this.buffer.getSignedShort();
                this.opcode = -1;
                return true;
            }
            if (this.opcode === 233) {
                this.anInt1319 = this.buffer.getUnsignedByte();
                this.opcode = -1;
                return true;
            }
            if (this.opcode === 61) {
                this.destinationX = 0;
                this.opcode = -1;
                return true;
            }
            if (this.opcode === 128) {
                const l4: number = this.buffer.method550();
                const k13: number = this.buffer.getLittleShortA();
                if (this.backDialogueId !== -1) {
                    this.method44(Game.aBoolean1190, this.backDialogueId);
                    this.backDialogueId = -1;
                    this.redrawChatbox = true;
                }
                if (this.anInt1053 !== -1) {
                    this.method44(Game.aBoolean1190, this.anInt1053);
                    this.anInt1053 = -1;
                    this.aBoolean1046 = true;
                }
                if (this.anInt960 !== -1) {
                    this.method44(Game.aBoolean1190, this.anInt960);
                    this.anInt960 = -1;
                }
                if (this.openInterfaceId !== l4) {
                    this.method44(Game.aBoolean1190, this.openInterfaceId);
                    this.openInterfaceId = l4;
                }
                if (this.anInt1089 !== k13) {
                    this.method44(Game.aBoolean1190, this.anInt1089);
                    this.anInt1089 = k13;
                }
                if (this.inputType !== 0) {
                    this.inputType = 0;
                    this.redrawChatbox = true;
                }
                this.redrawTabArea = true;
                this.aBoolean950 = true;
                this.aBoolean1239 = false;
                this.opcode = -1;
                return true;
            }
            if (this.opcode === 67) {
                const i5: number = this.buffer.getUnsignedByte();
                const l13: number = this.buffer.getUnsignedByte();
                const i18: number = this.buffer.getUnsignedByte();
                const l22: number = this.buffer.getUnsignedByte();
                this.aBooleanArray927[i5] = true;
                this.anIntArray1105[i5] = l13;
                this.anIntArray852[i5] = i18;
                this.anIntArray991[i5] = l22;
                this.quakeTimes[i5] = 0;
                this.opcode = -1;
                return true;
            }
            if (this.opcode === 134) {
                this.redrawTabArea = true;
                const interfaceId: number = this.buffer.getUnsignedLEShort();
                const inter: Widget = Widget.forId(interfaceId);
                while (this.buffer.currentPosition < this.packetSize) {
                    {
                        const slot: number = this.buffer.getSmart();
                        const id: number = this.buffer.getUnsignedLEShort();
                        let amount: number = this.buffer.getUnsignedByte();
                        if (amount === 255) {
                            amount = this.buffer.getInt();
                        }
                        if (slot >= 0 && slot < inter.items.length) {
                            inter.items[slot] = id;
                            inter.itemAmounts[slot] = amount;
                        }
                    }
                }
                this.opcode = -1;
                return true;
            }
            if (this.opcode === 78) {
                const friend: number = this.buffer.getLong();
                const nodeId: number = this.buffer.getUnsignedByte();
                let s7: string = TextUtils.formatName(TextUtils.longToName(friend));
                for (let k25: number = 0; k25 < this.friendsCount; k25++) {
                    {
                        if (friend !== this.friends[k25]) {
                            continue;
                        }
                        if (this.friendWorlds[k25] !== nodeId) {
                            this.friendWorlds[k25] = nodeId;
                            this.redrawTabArea = true;
                            if (nodeId > 0) {
                                this.addChatMessage("", s7 + " has logged in.", 5);
                            }
                            if (nodeId === 0) {
                                this.addChatMessage("", s7 + " has logged out.", 5);
                            }
                        }
                        s7 = null;
                        break;
                    }
                }
                if (s7 != null && this.friendsCount < 200) {
                    this.friends[this.friendsCount] = friend;
                    this.friendUsernames[this.friendsCount] = s7;
                    this.friendWorlds[this.friendsCount] = nodeId;
                    this.friendsCount++;
                    this.redrawTabArea = true;
                }
                for (let flag5: boolean = false; !flag5; ) {
                    {
                        flag5 = true;
                        for (let j30: number = 0; j30 < this.friendsCount - 1; j30++) {
                            if (
                                (this.friendWorlds[j30] !== Game.world && this.friendWorlds[j30 + 1] === Game.world) ||
                                (this.friendWorlds[j30] === 0 && this.friendWorlds[j30 + 1] !== 0)
                            ) {
                                const l31: number = this.friendWorlds[j30];
                                this.friendWorlds[j30] = this.friendWorlds[j30 + 1];
                                this.friendWorlds[j30 + 1] = l31;
                                const s10: string = this.friendUsernames[j30];
                                this.friendUsernames[j30] = this.friendUsernames[j30 + 1];
                                this.friendUsernames[j30 + 1] = s10;
                                const l33: number = this.friends[j30];
                                this.friends[j30] = this.friends[j30 + 1];
                                this.friends[j30 + 1] = l33;
                                this.redrawTabArea = true;
                                flag5 = false;
                            }
                        }
                    }
                }
                this.opcode = -1;
                return true;
            }
            if (this.opcode === 58) {
                this.messagePromptRaised = false;
                this.inputType = 1;
                this.inputInputMessage = "";
                this.redrawChatbox = true;
                this.opcode = -1;
                return true;
            }
            if (this.opcode === 252) {
                this.anInt1285 = this.buffer.getByteNegated();
                this.redrawTabArea = true;
                this.aBoolean950 = true;
                this.opcode = -1;
                return true;
            }
            if (this.opcode === 40) {
                this.placementY = this.buffer.getByteSubtracted();
                this.placementX = this.buffer.getByteNegated();
                for (let k5: number = this.placementX; k5 < this.placementX + 8; k5++) {
                    {
                        for (let i14: number = this.placementY; i14 < this.placementY + 8; i14++) {
                            if (this.groundItems[this.plane][k5][i14] != null) {
                                this.groundItems[this.plane][k5][i14] = null;
                                this.processGroundItems(k5, i14);
                            }
                        }
                    }
                }
                for (
                    let spawnObjectNode: SpawnObjectNode = this.aClass6_1261.first() as SpawnObjectNode;
                    spawnObjectNode != null;
                    spawnObjectNode = this.aClass6_1261.next() as SpawnObjectNode
                ) {
                    if (
                        spawnObjectNode.anInt1393 >= this.placementX &&
                        spawnObjectNode.anInt1393 < this.placementX + 8 &&
                        spawnObjectNode.anInt1394 >= this.placementY &&
                        spawnObjectNode.anInt1394 < this.placementY + 8 &&
                        spawnObjectNode.anInt1391 === this.plane
                    ) {
                        spawnObjectNode.anInt1390 = 0;
                    }
                }
                this.opcode = -1;
                return true;
            }
            if (this.opcode === 255) {
                const interfaceId: number = this.buffer.getLittleShortA();
                Widget.forId(interfaceId).modelType = 3;
                if (Game.localPlayer.npcDefinition == null) {
                    Widget.forId(interfaceId).modelId =
                        (Game.localPlayer.appearanceColors[0] << 25) +
                        (Game.localPlayer.appearanceColors[4] << 20) +
                        (Game.localPlayer.appearance[0] << 15) +
                        (Game.localPlayer.appearance[8] << 10) +
                        (Game.localPlayer.appearance[11] << 5) +
                        Game.localPlayer.appearance[1];
                } else {
                    Widget.forId(interfaceId).modelId = ((305419896 + Game.localPlayer.npcDefinition.id) as number) | 0;
                }
                this.opcode = -1;
                return true;
            }
            if (this.opcode === 135) {
                const l6: number = this.buffer.getLong();
                const i19: number = this.buffer.getInt();
                const j23: number = this.buffer.getUnsignedByte();
                let flag4: boolean = false;
                for (let k28: number = 0; k28 < 100; k28++) {
                    {
                        if (this.anIntArray1258[k28] !== i19) {
                            continue;
                        }
                        flag4 = true;
                        break;
                    }
                }
                if (j23 <= 1) {
                    for (let k30: number = 0; k30 < this.ignoresCount; k30++) {
                        {
                            if (this.ignores[k30] !== l6) {
                                continue;
                            }
                            flag4 = true;
                            break;
                        }
                    }
                }
                if (!flag4 && !this.inTutorialIsland) {
                    try {
                        this.anIntArray1258[this.anInt1152] = i19;
                        this.anInt1152 = (this.anInt1152 + 1) % 100;
                        let s9: string = ChatEncoder.get(this.packetSize - 13, this.buffer);
                        if (j23 !== 3) {
                            s9 = ChatCensor.censorString(s9);
                        }
                        if (j23 === 2 || j23 === 3) {
                            this.addChatMessage("@cr2@" + TextUtils.formatName(TextUtils.longToName(l6)), s9, 7);
                        } else if (j23 === 1) {
                            this.addChatMessage("@cr1@" + TextUtils.formatName(TextUtils.longToName(l6)), s9, 7);
                        } else {
                            this.addChatMessage(TextUtils.formatName(TextUtils.longToName(l6)), s9, 3);
                        }
                    } catch (exception1) {
                        SignLink.reportError("cde1");
                    }
                }
                this.opcode = -1;
                return true;
            }
            if (this.opcode === 183) {
                this.placementX = this.buffer.getUnsignedByte();
                this.placementY = this.buffer.getByteAdded();
                while (this.buffer.currentPosition < this.packetSize) {
                    {
                        const j6: number = this.buffer.getUnsignedByte();
                        this.parsePlacementPacket(this.buffer, j6);
                    }
                }
                this.opcode = -1;
                return true;
            }
            if (this.opcode === 159) {
                const interfaceId: number = this.buffer.getLittleShortA();
                this.method112((36 as number) | 0, interfaceId);
                if (this.anInt1089 !== -1) {
                    this.method44(Game.aBoolean1190, this.anInt1089);
                    this.anInt1089 = -1;
                    this.redrawTabArea = true;
                    this.aBoolean950 = true;
                }
                if (this.backDialogueId !== -1) {
                    this.method44(Game.aBoolean1190, this.backDialogueId);
                    this.backDialogueId = -1;
                    this.redrawChatbox = true;
                }
                if (this.anInt1053 !== -1) {
                    this.method44(Game.aBoolean1190, this.anInt1053);
                    this.anInt1053 = -1;
                    this.aBoolean1046 = true;
                }
                if (this.anInt960 !== -1) {
                    this.method44(Game.aBoolean1190, this.anInt960);
                    this.anInt960 = -1;
                }
                if (this.openInterfaceId !== interfaceId) {
                    this.method44(Game.aBoolean1190, this.openInterfaceId);
                    this.openInterfaceId = interfaceId;
                }
                if (this.inputType !== 0) {
                    this.inputType = 0;
                    this.redrawChatbox = true;
                }
                this.aBoolean1239 = false;
                this.opcode = -1;
                return true;
            }
            if (this.opcode === 246) {
                const i7: number = this.buffer.getLittleShortA();
                this.method112((36 as number) | 0, i7);
                if (this.backDialogueId !== -1) {
                    this.method44(Game.aBoolean1190, this.backDialogueId);
                    this.backDialogueId = -1;
                    this.redrawChatbox = true;
                }
                if (this.anInt1053 !== -1) {
                    this.method44(Game.aBoolean1190, this.anInt1053);
                    this.anInt1053 = -1;
                    this.aBoolean1046 = true;
                }
                if (this.anInt960 !== -1) {
                    this.method44(Game.aBoolean1190, this.anInt960);
                    this.anInt960 = -1;
                }
                if (this.openInterfaceId !== -1) {
                    this.method44(Game.aBoolean1190, this.openInterfaceId);
                    this.openInterfaceId = -1;
                }
                if (this.anInt1089 !== i7) {
                    this.method44(Game.aBoolean1190, this.anInt1089);
                    this.anInt1089 = i7;
                }
                if (this.inputType !== 0) {
                    this.inputType = 0;
                    this.redrawChatbox = true;
                }
                this.redrawTabArea = true;
                this.aBoolean950 = true;
                this.aBoolean1239 = false;
                this.opcode = -1;
                return true;
            }
            if (this.opcode === 49) {
                this.redrawTabArea = true;
                const j7: number = this.buffer.getByteNegated();
                const j14: number = this.buffer.getUnsignedByte();
                const j19: number = this.buffer.getInt();
                this.anIntArray843[j7] = j19;
                this.anIntArray1029[j7] = j14;
                this.anIntArray1054[j7] = 1;
                for (let k23: number = 0; k23 < 98; k23++) {
                    if (j19 >= Game.SKILL_EXPERIENCE[k23]) {
                        this.anIntArray1054[j7] = k23 + 2;
                    }
                }
                this.opcode = -1;
                return true;
            }
            if (this.opcode === 206) {
                this.redrawTabArea = true;
                const interfaceId: number = this.buffer.getUnsignedLEShort();
                const inter: Widget = Widget.forId(interfaceId);
                const items: number = this.buffer.getUnsignedLEShort();
                for (let item: number = 0; item < items; item++) {
                    {
                        inter.items[item] = this.buffer.getLittleShortA();
                        let amount: number = this.buffer.getByteNegated();
                        if (amount === 255) {
                            amount = this.buffer.method555();
                        }
                        inter.itemAmounts[item] = amount;
                    }
                }
                for (let i26: number = items; i26 < inter.items.length; i26++) {
                    {
                        inter.items[i26] = 0;
                        inter.itemAmounts[i26] = 0;
                    }
                }
                this.opcode = -1;
                return true;
            }
            if (this.opcode === 222 || this.opcode === 53) {
                let tmpChunkX: number = this.chunkX;
                let tmpChunkY: number = this.chunkY;
                if (this.opcode === 222) {
                    tmpChunkY = this.buffer.getUnsignedLEShort();
                    tmpChunkX = this.buffer.getLittleShortA();
                    this.aBoolean1163 = false;
                }
                if (this.opcode === 53) {
                    tmpChunkX = this.buffer.method550();
                    this.buffer.initBitAccess();
                    for (let z: number = 0; z < 4; z++) {
                        {
                            for (let x: number = 0; x < 13; x++) {
                                {
                                    for (let y: number = 0; y < 13; y++) {
                                        {
                                            const flag: number = this.buffer.getBits(1);
                                            if (flag === 1) {
                                                this.constructedMapPalette[z][x][y] = this.buffer.getBits(26);
                                            } else {
                                                this.constructedMapPalette[z][x][y] = -1;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    this.buffer.finishBitAccess();
                    tmpChunkY = this.buffer.method550();
                    this.aBoolean1163 = true;
                }
                if (this.chunkX === tmpChunkX && this.chunkY === tmpChunkY && this.loadingStage === 2) {
                    this.opcode = -1;
                    return true;
                }
                this.chunkX = tmpChunkX;
                this.chunkY = tmpChunkY;
                this.nextTopLeftTileX = (this.chunkX - 6) * 8;
                this.nextTopRightTileY = (this.chunkY - 6) * 8;
                this.aBoolean1067 = false;
                if ((((this.chunkX / 8) | 0) === 48 || ((this.chunkX / 8) | 0) === 49) && ((this.chunkY / 8) | 0) === 48) {
                    this.aBoolean1067 = true;
                }
                if (((this.chunkX / 8) | 0) === 48 && ((this.chunkY / 8) | 0) === 148) {
                    this.aBoolean1067 = true;
                }
                this.loadingStage = 1;
                this.aLong1229 = new Date().getTime();
                this.method125(null, "Loading - please wait.");
                if (this.opcode === 222) {
                    let count: number = 0;
                    for (let fileX: number = ((this.chunkX - 6) / 8) | 0; fileX <= (((this.chunkX + 6) / 8) | 0); fileX++) {
                        {
                            for (let fileY: number = ((this.chunkY - 6) / 8) | 0; fileY <= (((this.chunkY + 6) / 8) | 0); fileY++) {
                                count++;
                            }
                        }
                    }
                    this.aByteArrayArray838 = (s => {
                        const a = [];
                        while (s-- > 0) {
                            a.push(null);
                        }
                        return a;
                    })(count);
                    this.aByteArrayArray1232 = (s => {
                        const a = [];
                        while (s-- > 0) {
                            a.push(null);
                        }
                        return a;
                    })(count);
                    this.coordinates = (s => {
                        const a = [];
                        while (s-- > 0) {
                            a.push(0);
                        }
                        return a;
                    })(count);
                    this.anIntArray857 = (s => {
                        const a = [];
                        while (s-- > 0) {
                            a.push(0);
                        }
                        return a;
                    })(count);
                    this.anIntArray858 = (s => {
                        const a = [];
                        while (s-- > 0) {
                            a.push(0);
                        }
                        return a;
                    })(count);
                    count = 0;
                    for (let fileX: number = ((this.chunkX - 6) / 8) | 0; fileX <= (((this.chunkX + 6) / 8) | 0); fileX++) {
                        {
                            for (let fileY: number = ((this.chunkY - 6) / 8) | 0; fileY <= (((this.chunkY + 6) / 8) | 0); fileY++) {
                                {
                                    this.coordinates[count] = (fileX << 8) + fileY;
                                    if (
                                        this.aBoolean1067 &&
                                        (fileY === 49 || fileY === 149 || fileY === 147 || fileX === 50 || (fileX === 49 && fileY === 47))
                                    ) {
                                        this.anIntArray857[count] = -1;
                                        this.anIntArray858[count] = -1;
                                        count++;
                                    } else {
                                        const l30: number = (this.anIntArray857[count] = this.onDemandRequester.regId(0, fileX, fileY, 0));
                                        if (l30 !== -1) {
                                            this.onDemandRequester.request(3, l30);
                                        }
                                        const i32: number = (this.anIntArray858[count] = this.onDemandRequester.regId(0, fileX, fileY, 1));
                                        if (i32 !== -1) {
                                            this.onDemandRequester.request(3, i32);
                                        }
                                        count++;
                                    }
                                }
                            }
                        }
                    }
                }
                if (this.opcode === 53) {
                    let uniqueCount: number = 0;
                    const fileIndices: number[] = (s => {
                        const a = [];
                        while (s-- > 0) {
                            a.push(0);
                        }
                        return a;
                    })(676);
                    for (let tileZ: number = 0; tileZ < 4; tileZ++) {
                        {
                            for (let tileX: number = 0; tileX < 13; tileX++) {
                                {
                                    for (let tileY: number = 0; tileY < 13; tileY++) {
                                        {
                                            const data: number = this.constructedMapPalette[tileZ][tileX][tileY];
                                            if (data !== -1) {
                                                const chunkX: number = (data >> 14) & 1023;
                                                const chunkY: number = (data >> 3) & 2047;
                                                let fileIndex: number = (((chunkX / 8) | 0) << 8) + ((chunkY / 8) | 0);
                                                for (let pos: number = 0; pos < uniqueCount; pos++) {
                                                    {
                                                        if (fileIndices[pos] !== fileIndex) {
                                                            continue;
                                                        }
                                                        fileIndex = -1;
                                                        break;
                                                    }
                                                }
                                                if (fileIndex !== -1) {
                                                    fileIndices[uniqueCount++] = fileIndex;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    this.aByteArrayArray838 = (s => {
                        const a = [];
                        while (s-- > 0) {
                            a.push(null);
                        }
                        return a;
                    })(uniqueCount);
                    this.aByteArrayArray1232 = (s => {
                        const a = [];
                        while (s-- > 0) {
                            a.push(null);
                        }
                        return a;
                    })(uniqueCount);
                    this.coordinates = (s => {
                        const a = [];
                        while (s-- > 0) {
                            a.push(0);
                        }
                        return a;
                    })(uniqueCount);
                    this.anIntArray857 = (s => {
                        const a = [];
                        while (s-- > 0) {
                            a.push(0);
                        }
                        return a;
                    })(uniqueCount);
                    this.anIntArray858 = (s => {
                        const a = [];
                        while (s-- > 0) {
                            a.push(0);
                        }
                        return a;
                    })(uniqueCount);
                    for (let pos: number = 0; pos < uniqueCount; pos++) {
                        {
                            const j31: number = (this.coordinates[pos] = fileIndices[pos]);
                            const fileX: number = (j31 >> 8) & 255;
                            const fileY: number = j31 & 255;
                            const i34: number = (this.anIntArray857[pos] = this.onDemandRequester.regId(0, fileX, fileY, 0));
                            if (i34 !== -1) {
                                this.onDemandRequester.request(3, i34);
                            }
                            const k34: number = (this.anIntArray858[pos] = this.onDemandRequester.regId(0, fileX, fileY, 1));
                            if (k34 !== -1) {
                                this.onDemandRequester.request(3, k34);
                            }
                        }
                    }
                }
                const deltaX: number = this.nextTopLeftTileX - this.topLeftTileX;
                const deltaY: number = this.nextTopRightTileY - this.topLeftTileY;
                this.topLeftTileX = this.nextTopLeftTileX;
                this.topLeftTileY = this.nextTopRightTileY;
                for (let id: number = 0; id < 16384; id++) {
                    {
                        const npc: Npc = this.npcs[id];
                        if (npc != null) {
                            for (let pos: number = 0; pos < 10; pos++) {
                                {
                                    (npc as Actor).pathX[pos] -= deltaX;
                                    (npc as Actor).pathY[pos] -= deltaY;
                                }
                            }
                            npc.worldX -= deltaX * 128;
                            npc.worldY -= deltaY * 128;
                        }
                    }
                }
                for (let id: number = 0; id < this.anInt968; id++) {
                    {
                        const player: Player = this.players[id];
                        if (player != null) {
                            for (let pos: number = 0; pos < 10; pos++) {
                                {
                                    (player as Actor).pathX[pos] -= deltaX;
                                    (player as Actor).pathY[pos] -= deltaY;
                                }
                            }
                            player.worldX -= deltaX * 128;
                            player.worldY -= deltaY * 128;
                        }
                    }
                }
                this.aBoolean1209 = true;
                let byte1: number = 0;
                let byte2: number = 104;
                let byte3: number = 1;
                if (deltaX < 0) {
                    byte1 = 103;
                    byte2 = -1;
                    byte3 = -1;
                }
                let byte4: number = 0;
                let byte5: number = 104;
                let byte6: number = 1;
                if (deltaY < 0) {
                    byte4 = 103;
                    byte5 = -1;
                    byte6 = -1;
                }
                for (let i35: number = byte1; i35 !== byte2; i35 += byte3) {
                    {
                        for (let j35: number = byte4; j35 !== byte5; j35 += byte6) {
                            {
                                const k35: number = i35 + deltaX;
                                const l35: number = j35 + deltaY;
                                for (let i36: number = 0; i36 < 4; i36++) {
                                    if (k35 >= 0 && l35 >= 0 && k35 < 104 && l35 < 104) {
                                        this.groundItems[i36][i35][j35] = this.groundItems[i36][k35][l35];
                                    } else {
                                        this.groundItems[i36][i35][j35] = null;
                                    }
                                }
                            }
                        }
                    }
                }
                for (
                    let spawnObjectNode_1: SpawnObjectNode = this.aClass6_1261.first() as SpawnObjectNode;
                    spawnObjectNode_1 != null;
                    spawnObjectNode_1 = this.aClass6_1261.next() as SpawnObjectNode
                ) {
                    {
                        spawnObjectNode_1.anInt1393 -= deltaX;
                        spawnObjectNode_1.anInt1394 -= deltaY;
                        if (
                            spawnObjectNode_1.anInt1393 < 0 ||
                            spawnObjectNode_1.anInt1394 < 0 ||
                            spawnObjectNode_1.anInt1393 >= 104 ||
                            spawnObjectNode_1.anInt1394 >= 104
                        ) {
                            spawnObjectNode_1.remove();
                        }
                    }
                }
                if (this.destinationX !== 0) {
                    this.destinationX -= deltaX;
                    this.destinationY -= deltaY;
                }
                this.oriented = false;
                this.opcode = -1;
                return true;
            }
            if (this.opcode === 190) {
                this.systemUpdateTime = this.buffer.method549() * 30;
                this.opcode = -1;
                return true;
            }
            if (
                this.opcode === 41 ||
                this.opcode === 121 ||
                this.opcode === 203 ||
                this.opcode === 106 ||
                this.opcode === 59 ||
                this.opcode === 181 ||
                this.opcode === 208 ||
                this.opcode === 107 ||
                this.opcode === 142 ||
                this.opcode === 88 ||
                this.opcode === 152
            ) {
                this.parsePlacementPacket(this.buffer, this.opcode);
                this.opcode = -1;
                return true;
            }
            if (this.opcode === 125) {
                if (this.anInt1285 === 12) {
                    this.redrawTabArea = true;
                }
                this.anInt1324 = this.buffer.getUnsignedByte();
                this.opcode = -1;
                return true;
            }
            if (this.opcode === 21) {
                const scale: number = this.buffer.getUnsignedLEShort();
                const itemId: number = this.buffer.method549();
                const interfaceId: number = this.buffer.getLittleShortA();
                if (itemId === 65535) {
                    Widget.forId(interfaceId).modelType = 0;
                    this.opcode = -1;
                    return true;
                } else {
                    const class16: ItemDefinition = ItemDefinition.lookup(itemId);
                    Widget.forId(interfaceId).modelType = 4;
                    Widget.forId(interfaceId).modelId = itemId;
                    Widget.forId(interfaceId).rotationX = class16.modelRotationX;
                    Widget.forId(interfaceId).rotationY = class16.modelRotationY;
                    Widget.forId(interfaceId).zoom = ((class16.modelScale * 100) / scale) | 0;
                    this.opcode = -1;
                    return true;
                }
            }
            if (this.opcode === 3) {
                this.oriented = true;
                this.anInt874 = this.buffer.getUnsignedByte();
                this.anInt875 = this.buffer.getUnsignedByte();
                this.anInt876 = this.buffer.getUnsignedLEShort();
                this.anInt877 = this.buffer.getUnsignedByte();
                this.anInt878 = this.buffer.getUnsignedByte();
                if (this.anInt878 >= 100) {
                    this.cameraX = this.anInt874 * 128 + 64;
                    this.cameraY = this.anInt875 * 128 + 64;
                    this.cameraZ = this.getTileHeight(this.cameraY, this.cameraX, (9 as number) | 0, this.plane) - this.anInt876;
                }
                this.opcode = -1;
                return true;
            }
            if (this.opcode === 2) {
                const interfaceId: number = this.buffer.getLittleShortA();
                const i15: number = this.buffer.method553();
                const class13_3: Widget = Widget.forId(interfaceId);
                if (class13_3.disabledAnimation !== i15 || i15 === -1) {
                    class13_3.disabledAnimation = i15;
                    class13_3.anInt235 = 0;
                    class13_3.anInt227 = 0;
                }
                this.opcode = -1;
                return true;
            }
            if (this.opcode === 71) {
                this.method48(this.buffer, this.aBoolean1038, this.packetSize);
                this.opcode = -1;
                return true;
            }
            if (this.opcode === 226) {
                this.ignoresCount = (this.packetSize / 8) | 0;
                for (let k8: number = 0; k8 < this.ignoresCount; k8++) {
                    this.ignores[k8] = this.buffer.getLong();
                }
                this.opcode = -1;
                return true;
            }
            if (this.opcode === 10) {
                const l8: number = this.buffer.getByteSubtracted();
                let j15: number = this.buffer.method550();
                if (j15 === 65535) {
                    j15 = -1;
                }
                if (this.anIntArray1081[l8] !== j15) {
                    this.method44(Game.aBoolean1190, this.anIntArray1081[l8]);
                    this.anIntArray1081[l8] = j15;
                }
                this.redrawTabArea = true;
                this.aBoolean950 = true;
                this.opcode = -1;
                return true;
            }
            if (this.opcode === 219) {
                const interfaceId: number = this.buffer.method549();
                const class13_2: Widget = Widget.forId(interfaceId);
                for (let k21: number = 0; k21 < class13_2.items.length; k21++) {
                    {
                        class13_2.items[k21] = -1;
                        class13_2.items[k21] = 0;
                    }
                }
                this.opcode = -1;
                return true;
            }
            if (this.opcode === 238) {
                this.anInt1213 = this.buffer.getUnsignedByte();
                if (this.anInt1213 === this.anInt1285) {
                    if (this.anInt1213 === 3) {
                        this.anInt1285 = 1;
                    } else {
                        this.anInt1285 = 3;
                    }
                    this.redrawTabArea = true;
                }
                this.opcode = -1;
                return true;
            }
            if (this.opcode === 148) {
                this.oriented = false;
                for (let j9: number = 0; j9 < 5; j9++) {
                    this.aBooleanArray927[j9] = false;
                }
                this.opcode = -1;
                return true;
            }
            if (this.opcode === 126) {
                this.playerMembers = this.buffer.getUnsignedByte();
                this.thisPlayerServerId = this.buffer.method549();
                this.opcode = -1;
                return true;
            }
            if (this.opcode === 75) {
                this.placementX = this.buffer.getByteNegated();
                this.placementY = this.buffer.getByteAdded();
                this.opcode = -1;
                return true;
            }
            if (this.opcode === 253) {
                const k9: number = this.buffer.method549();
                const k15: number = this.buffer.method550();
                this.method112((36 as number) | 0, k15);
                if (k9 !== -1) {
                    this.method112((36 as number) | 0, k9);
                }
                if (this.openInterfaceId !== -1) {
                    this.method44(Game.aBoolean1190, this.openInterfaceId);
                    this.openInterfaceId = -1;
                }
                if (this.anInt1089 !== -1) {
                    this.method44(Game.aBoolean1190, this.anInt1089);
                    this.anInt1089 = -1;
                }
                if (this.backDialogueId !== -1) {
                    this.method44(Game.aBoolean1190, this.backDialogueId);
                    this.backDialogueId = -1;
                }
                if (this.anInt1053 !== k15) {
                    this.method44(Game.aBoolean1190, this.anInt1053);
                    this.anInt1053 = k15;
                }
                if (this.anInt960 !== k15) {
                    this.method44(Game.aBoolean1190, this.anInt960);
                    this.anInt960 = k9;
                }
                this.inputType = 0;
                this.aBoolean1239 = false;
                this.opcode = -1;
                return true;
            }
            if (this.opcode === 251) {
                this.friendListStatus = this.buffer.getUnsignedByte();
                this.redrawTabArea = true;
                this.opcode = -1;
                return true;
            }
            if (this.opcode === 18) {
                const l9: number = this.buffer.getUnsignedLEShort();
                const interfaceId: number = this.buffer.method550();
                const l21: number = this.buffer.method549();
                Widget.forId(interfaceId).anInt218 = (l9 << 16) + l21;
                this.opcode = -1;
                return true;
            }
            if (this.opcode === 90) {
                this.updatePlayers(this.packetSize, this.buffer);
                this.aBoolean1209 = false;
                this.opcode = -1;
                return true;
            }
            if (this.opcode === 113) {
                for (let i10: number = 0; i10 < this.widgetSettings.length; i10++) {
                    if (this.widgetSettings[i10] !== this.anIntArray1005[i10]) {
                        this.widgetSettings[i10] = this.anIntArray1005[i10];
                        this.updateVarp(0, i10);
                        this.redrawTabArea = true;
                    }
                }
                this.opcode = -1;
                return true;
            }
            if (this.opcode === 232) {
                const j10: number = this.buffer.getLittleShortA();
                const s6: string = this.buffer.getString();
                Widget.forId(j10).disabledText = s6;
                if (Widget.forId(j10).parentId === this.anIntArray1081[this.anInt1285]) {
                    this.redrawTabArea = true;
                }
                this.opcode = -1;
                return true;
            }
            if (this.opcode === 200) {
                const interfaceId: number = this.buffer.getUnsignedLEShort();
                let i16: number = this.buffer.getLittleShortA();
                const class13_4: Widget = Widget.forId(interfaceId);
                if (class13_4 != null && class13_4.type === 0) {
                    if (i16 < 0) {
                        i16 = 0;
                    }
                    if (i16 > class13_4.scrollLimit - class13_4.height) {
                        i16 = class13_4.scrollLimit - class13_4.height;
                    }
                    class13_4.anInt231 = i16;
                }
                this.opcode = -1;
                return true;
            }
            SignLink.reportError(
                "T1 - " + this.opcode + "," + this.packetSize + " - " + this.secondLastOpcode + "," + this.thirdLastOpcode
            );
            this.logout();
        } catch (__e) {
            // if (__e != null && __e instanceof IOException as any) {
            //     this.dropClient();

            // }
            if (__e != null && ((__e instanceof Error) as any)) {
                const exception: Error = __e as Error;
                let s1: string =
                    "T2 - " +
                    this.opcode +
                    "," +
                    this.secondLastOpcode +
                    "," +
                    this.thirdLastOpcode +
                    " - " +
                    this.packetSize +
                    "," +
                    (this.nextTopLeftTileX + Game.localPlayer.pathX[0]) +
                    "," +
                    (this.nextTopRightTileY + Game.localPlayer.pathY[0]) +
                    " - ";
                for (let j16: number = 0; j16 < this.packetSize && j16 < 50; j16++) {
                    s1 = s1 + this.buffer.buffer[j16] + ",";
                }
                SignLink.reportError(s1);
                this.logout();
                console.error(exception.message, exception);
            }
        }
        return true;
    }

    public method48(class50_sub1_sub2: Buffer, flag: boolean, i: number) {
        this.loggedIn = flag && this.loggedIn;
        this.removePlayerCount = 0;
        this.updatedPlayerCount = 0;
        this.method46(i, (-58 as number) | 0, class50_sub1_sub2);
        this.method132(class50_sub1_sub2, i, false);
        this.method62(class50_sub1_sub2, i, 838);
        for (let j: number = 0; j < this.removePlayerCount; j++) {
            {
                const k: number = this.removePlayers[j];
                if (this.npcs[k].pulseCycle !== Game.pulseCycle) {
                    this.npcs[k].npcDefinition = null;
                    this.npcs[k] = null;
                }
            }
        }
        if (class50_sub1_sub2.currentPosition !== i) {
            SignLink.reportError(
                this.username + " size mismatch in getnpcpos - coord:" + class50_sub1_sub2.currentPosition + " psize:" + i
            );
            throw Error("eek");
        }
        for (let l: number = 0; l < this.anInt1133; l++) {
            if (this.npcs[this.anIntArray1134[l]] == null) {
                SignLink.reportError(this.username + " null entry in npc list - coord:" + l + " size:" + this.anInt1133);
                throw Error("eek");
            }
        }
    }

    /*private*/ public updatePlayers(size: number, buffer: Buffer) {
        this.removePlayerCount = 0;
        this.updatedPlayerCount = 0;
        this.updateLocalPlayerMovement(buffer);
        this.updateOtherPlayerMovement(buffer);
        this.addNewPlayers(size, buffer);
        this.parsePlayerBlocks(buffer);
        for (let i: number = 0; i < this.removePlayerCount; i++) {
            {
                const index: number = this.removePlayers[i];
                if (this.players[index].pulseCycle !== Game.pulseCycle) {
                    this.players[index] = null;
                }
            }
        }
        if (buffer.currentPosition !== size) {
            SignLink.reportError("Error packet size mismatch in getplayer coord:" + buffer.currentPosition + " psize:" + size);
            throw Error("eek");
        }
        for (let i: number = 0; i < this.localPlayerCount; i++) {
            {
                if (this.players[this.playerList[i]] == null) {
                    SignLink.reportError(this.username + " null entry in pl list - coord:" + i + " size:" + this.localPlayerCount);
                    throw Error("eek");
                }
            }
        }
    }

    /*private*/ public parsePlayerBlocks(buffer: Buffer) {
        for (let i: number = 0; i < this.updatedPlayerCount; i++) {
            {
                const id: number = this.updatedPlayers[i];
                const player: Player = this.players[id];
                let mask: number = buffer.getUnsignedByte();
                if ((mask & 32) !== 0) {
                    mask += buffer.getUnsignedByte() << 8;
                }
                this.parsePlayerBlock(id, player, mask, buffer);
            }
        }
    }

    public addChatMessage(name: string, message: string, type: number) {
        if (type === 0 && this.dialogueId !== -1) {
            this.clickToContinueString = message;
            this.clickType = 0;
        }
        if (this.backDialogueId === -1) {
            this.redrawChatbox = true;
        }
        for (let index: number = 99; index > 0; index--) {
            {
                this.chatTypes[index] = this.chatTypes[index - 1];
                this.chatPlayerNames[index] = this.chatPlayerNames[index - 1];
                this.chatMessages[index] = this.chatMessages[index - 1];
            }
        }
        this.chatTypes[0] = type;
        this.chatPlayerNames[0] = name;
        this.chatMessages[0] = message;
    }

    /*private*/ public parsePlayerBlock(id: number, player: Player, mask: number, buffer: Buffer) {
        if ((mask & 8) !== 0) {
            let animation: number = buffer.getUnsignedLEShort();
            if (animation === 65535) {
                animation = -1;
            }
            const delay: number = buffer.getByteSubtracted();
            if (animation === player.emoteAnimation && animation !== -1) {
                const mode: number = AnimationSequence.animations[animation].anInt307;
                if (mode === 1) {
                    player.displayedEmoteFrames = 0;
                    player.anInt1626 = 0;
                    player.animationDelay = delay;
                    player.anInt1628 = 0;
                }
                if (mode === 2) {
                    player.anInt1628 = 0;
                }
            } else if (
                animation === -1 ||
                player.emoteAnimation === -1 ||
                AnimationSequence.animations[animation].anInt301 >= AnimationSequence.animations[player.emoteAnimation].anInt301
            ) {
                player.emoteAnimation = animation;
                player.displayedEmoteFrames = 0;
                player.anInt1626 = 0;
                player.animationDelay = delay;
                player.anInt1628 = 0;
                player.anInt1613 = player.pathLength;
            }
        }
        if ((mask & 16) !== 0) {
            player.forcedChat = buffer.getString();
            if ((c => (c.charCodeAt == null ? (c as any) : c.charCodeAt(0)))(player.forcedChat.charAt(0)) == "~".charCodeAt(0)) {
                player.forcedChat = player.forcedChat.substring(1);
                this.addChatMessage(player.playerName, player.forcedChat, 2);
            } else if (player === Game.localPlayer) {
                this.addChatMessage(player.playerName, player.forcedChat, 2);
            }
            player.textColour = 0;
            player.textEffect = 0;
            player.textCycle = 150;
        }
        if ((mask & 256) !== 0) {
            player.anInt1602 = buffer.getByteAdded();
            player.anInt1604 = buffer.getByteNegated();
            player.anInt1603 = buffer.getByteSubtracted();
            player.anInt1605 = buffer.getUnsignedByte();
            player.anInt1606 = buffer.getUnsignedLEShort() + Game.pulseCycle;
            player.anInt1607 = buffer.method550() + Game.pulseCycle;
            player.anInt1608 = buffer.getUnsignedByte();
            player.resetPath();
        }
        if ((mask & 1) !== 0) {
            player.anInt1609 = buffer.method550();
            if (player.anInt1609 === 65535) {
                player.anInt1609 = -1;
            }
        }
        if ((mask & 2) !== 0) {
            player.anInt1598 = buffer.getUnsignedLEShort();
            player.anInt1599 = buffer.getUnsignedLEShort();
        }
        if ((mask & 512) !== 0) {
            player.graphic = buffer.method550();
            const heightAndDelay: number = buffer.method556();
            player.spotAnimationDelay = heightAndDelay >> 16;
            player.anInt1617 = Game.pulseCycle + (heightAndDelay & 65535);
            player.currentAnimation = 0;
            player.anInt1616 = 0;
            if (player.anInt1617 > Game.pulseCycle) {
                player.currentAnimation = -1;
            }
            if (player.graphic === 65535) {
                player.graphic = -1;
            }
        }
        if ((mask & 4) !== 0) {
            const size: number = buffer.getUnsignedByte();
            const bytes: number[] = (s => {
                const a = [];
                while (s-- > 0) {
                    a.push(0);
                }
                return a;
            })(size);
            const appearance: Buffer = new Buffer(bytes);
            buffer.getBytesReverse(bytes, 0, size);
            this.cachedAppearances[id] = appearance;
            player.updateAppearance(appearance);
        }
        if ((mask & 1024) !== 0) {
            const damage: number = buffer.getByteAdded();
            const type: number = buffer.getByteSubtracted();
            player.updateHits(type, damage, Game.pulseCycle);
            player.endCycle = Game.pulseCycle + 300;
            player.anInt1596 = buffer.getByteNegated();
            player.anInt1597 = buffer.getUnsignedByte();
        }
        if ((mask & 64) !== 0) {
            const effectsAndColour: number = buffer.getUnsignedLEShort();
            const rights: number = buffer.getByteNegated();
            const length: number = buffer.getByteAdded();
            const currentPosition: number = buffer.currentPosition;
            if (player.playerName != null && player.visible) {
                const nameLong: number = TextUtils.nameToLong(player.playerName);
                let ignored: boolean = false;
                if (rights <= 1) {
                    for (let i: number = 0; i < this.ignoresCount; i++) {
                        {
                            if (this.ignores[i] !== nameLong) {
                                continue;
                            }
                            ignored = true;
                            break;
                        }
                    }
                }
                if (!ignored && !this.inTutorialIsland) {
                    try {
                        this.chatBuffer.currentPosition = 0;
                        buffer.getBytesAdded(Array.from(this.chatBuffer.buffer), 0, length);
                        this.chatBuffer.currentPosition = 0;
                        const message: string = ChatCensor.censorString(ChatEncoder.get(length, this.chatBuffer));
                        player.forcedChat = message;
                        player.textColour = effectsAndColour >> 8;
                        player.textEffect = effectsAndColour & 255;
                        player.textCycle = 150;
                        if (rights === 2 || rights === 3) {
                            this.addChatMessage("@cr2@" + player.playerName, message, 1);
                        } else if (rights === 1) {
                            this.addChatMessage("@cr1@" + player.playerName, message, 1);
                        } else {
                            this.addChatMessage(player.playerName, message, 2);
                        }
                    } catch (exception) {
                        SignLink.reportError("cde2");
                    }
                }
            }
            buffer.currentPosition = currentPosition + length;
        }
        if ((mask & 128) !== 0) {
            const damage: number = buffer.getByteSubtracted();
            const type: number = buffer.getByteNegated();
            player.updateHits(type, damage, Game.pulseCycle);
            player.endCycle = Game.pulseCycle + 300;
            player.anInt1596 = buffer.getByteSubtracted();
            player.anInt1597 = buffer.getUnsignedByte();
        }
    }
    /*private*/ public addNewPlayers(size: number, buffer: Buffer) {
        while (buffer.bitPosition + 10 < size * 8) {
            {
                const id: number = buffer.getBits(11);
                if (id === 2047) {
                    break;
                }
                if (this.players[id] == null) {
                    this.players[id] = new Player();
                    if (this.cachedAppearances[id] != null) {
                        this.players[id].updateAppearance(this.cachedAppearances[id]);
                    }
                }
                this.playerList[this.localPlayerCount++] = id;
                const player: Player = this.players[id];
                player.pulseCycle = Game.pulseCycle;
                let x: number = buffer.getBits(5);
                if (x > 15) {
                    x -= 32;
                }
                const updated: number = buffer.getBits(1);
                if (updated === 1) {
                    this.updatedPlayers[this.updatedPlayerCount++] = id;
                }
                const discardQueue: number = buffer.getBits(1);
                let y: number = buffer.getBits(5);
                if (y > 15) {
                    y -= 32;
                }
                player.setPosition(Game.localPlayer.pathX[0] + x, Game.localPlayer.pathY[0] + y, discardQueue === 1);
            }
        }
        buffer.finishBitAccess();
    }
    /*private*/ public updateOtherPlayerMovement(buffer: Buffer) {
        const playerCount: number = buffer.getBits(8);
        if (playerCount < this.localPlayerCount) {
            for (let i: number = playerCount; i < this.localPlayerCount; i++) {
                this.removePlayers[this.removePlayerCount++] = this.playerList[i];
            }
        }
        if (playerCount > this.localPlayerCount) {
            SignLink.reportError(this.username + " Too many players");
            throw Error("eek");
        }
        this.localPlayerCount = 0;
        for (let i: number = 0; i < playerCount; i++) {
            {
                const id: number = this.playerList[i];
                const player: Player = this.players[id];
                const updated: number = buffer.getBits(1);
                if (updated === 0) {
                    this.playerList[this.localPlayerCount++] = id;
                    player.pulseCycle = Game.pulseCycle;
                } else {
                    const moveType: number = buffer.getBits(2);
                    if (moveType === 0) {
                        this.playerList[this.localPlayerCount++] = id;
                        player.pulseCycle = Game.pulseCycle;
                        this.updatedPlayers[this.updatedPlayerCount++] = id;
                    } else if (moveType === 1) {
                        this.playerList[this.localPlayerCount++] = id;
                        player.pulseCycle = Game.pulseCycle;
                        const direction: number = buffer.getBits(3);
                        player.move(direction, false);
                        const blockUpdateRequired: number = buffer.getBits(1);
                        if (blockUpdateRequired === 1) {
                            this.updatedPlayers[this.updatedPlayerCount++] = id;
                        }
                    } else if (moveType === 2) {
                        this.playerList[this.localPlayerCount++] = id;
                        player.pulseCycle = Game.pulseCycle;
                        const direction1: number = buffer.getBits(3);
                        player.move(direction1, true);
                        const direction2: number = buffer.getBits(3);
                        player.move(direction2, true);
                        const updateRequired: number = buffer.getBits(1);
                        if (updateRequired === 1) {
                            this.updatedPlayers[this.updatedPlayerCount++] = id;
                        }
                    } else if (moveType === 3) {
                        this.removePlayers[this.removePlayerCount++] = id;
                    }
                }
            }
        }
    }

    /*private*/ public updateLocalPlayerMovement(buffer: Buffer) {
        buffer.initBitAccess();
        const moved: number = buffer.getBits(1);
        if (moved === 0) {
            return;
        }
        const moveType: number = buffer.getBits(2);
        if (moveType === 0) {
            this.updatedPlayers[this.updatedPlayerCount++] = this.thisPlayerId;
            return;
        }
        if (moveType === 1) {
            const direction: number = buffer.getBits(3);
            Game.localPlayer.move(direction, false);
            const blockUpdateRequired: number = buffer.getBits(1);
            if (blockUpdateRequired === 1) {
                this.updatedPlayers[this.updatedPlayerCount++] = this.thisPlayerId;
            }
            return;
        }
        if (moveType === 2) {
            const direction1: number = buffer.getBits(3);
            Game.localPlayer.move(direction1, true);
            const direction2: number = buffer.getBits(3);
            Game.localPlayer.move(direction2, true);
            const blockUpdateRequired: number = buffer.getBits(1);
            if (blockUpdateRequired === 1) {
                this.updatedPlayers[this.updatedPlayerCount++] = this.thisPlayerId;
            }
            return;
        }
        if (moveType === 3) {
            const discardWalkingQueue: number = buffer.getBits(1);
            this.plane = buffer.getBits(2);
            const localY: number = buffer.getBits(7);
            const localX: number = buffer.getBits(7);
            const blockUpdateRequired: number = buffer.getBits(1);
            if (blockUpdateRequired === 1) {
                this.updatedPlayers[this.updatedPlayerCount++] = this.thisPlayerId;
            }
            Game.localPlayer.setPosition(localX, localY, discardWalkingQueue === 1);
        }
    }

    public method62(class50_sub1_sub2: Buffer, i: number, j: number) {
        j = (24 / j) | 0;
        for (let k: number = 0; k < this.updatedPlayerCount; k++) {
            {
                const l: number = this.updatedPlayers[k];
                const class50_sub1_sub4_sub3_sub1: Npc = this.npcs[l];
                const i1: number = class50_sub1_sub2.getUnsignedByte();
                if ((i1 & 1) !== 0) {
                    class50_sub1_sub4_sub3_sub1.npcDefinition = ActorDefinition.getDefinition(class50_sub1_sub2.method550());
                    class50_sub1_sub4_sub3_sub1.boundaryDimension = class50_sub1_sub4_sub3_sub1.npcDefinition.boundaryDimension;
                    class50_sub1_sub4_sub3_sub1.anInt1600 = class50_sub1_sub4_sub3_sub1.npcDefinition.degreesToTurn;
                    class50_sub1_sub4_sub3_sub1.walkAnimationId = class50_sub1_sub4_sub3_sub1.npcDefinition.walkAnimationId;
                    class50_sub1_sub4_sub3_sub1.turnAroundAnimationId = class50_sub1_sub4_sub3_sub1.npcDefinition.turnAroundAnimationId;
                    class50_sub1_sub4_sub3_sub1.turnRightAnimationId = class50_sub1_sub4_sub3_sub1.npcDefinition.turnRightAnimationId;
                    class50_sub1_sub4_sub3_sub1.turnLeftAnimationId = class50_sub1_sub4_sub3_sub1.npcDefinition.turnLeftAnimationId;
                    class50_sub1_sub4_sub3_sub1.idleAnimation = class50_sub1_sub4_sub3_sub1.npcDefinition.standAnimationId;
                }
                if ((i1 & 64) !== 0) {
                    class50_sub1_sub4_sub3_sub1.anInt1609 = class50_sub1_sub2.method549();
                    if (class50_sub1_sub4_sub3_sub1.anInt1609 === 65535) {
                        class50_sub1_sub4_sub3_sub1.anInt1609 = -1;
                    }
                }
                if ((i1 & 128) !== 0) {
                    const j1: number = class50_sub1_sub2.getByteAdded();
                    const j2: number = class50_sub1_sub2.getByteAdded();
                    class50_sub1_sub4_sub3_sub1.updateHits(j2, j1, Game.pulseCycle);
                    class50_sub1_sub4_sub3_sub1.endCycle = Game.pulseCycle + 300;
                    class50_sub1_sub4_sub3_sub1.anInt1596 = class50_sub1_sub2.getUnsignedByte();
                    class50_sub1_sub4_sub3_sub1.anInt1597 = class50_sub1_sub2.getByteSubtracted();
                }
                if ((i1 & 4) !== 0) {
                    class50_sub1_sub4_sub3_sub1.graphic = class50_sub1_sub2.getUnsignedLEShort();
                    const k1: number = class50_sub1_sub2.method556();
                    class50_sub1_sub4_sub3_sub1.spotAnimationDelay = k1 >> 16;
                    class50_sub1_sub4_sub3_sub1.anInt1617 = Game.pulseCycle + (k1 & 65535);
                    class50_sub1_sub4_sub3_sub1.currentAnimation = 0;
                    class50_sub1_sub4_sub3_sub1.anInt1616 = 0;
                    if (class50_sub1_sub4_sub3_sub1.anInt1617 > Game.pulseCycle) {
                        class50_sub1_sub4_sub3_sub1.currentAnimation = -1;
                    }
                    if (class50_sub1_sub4_sub3_sub1.graphic === 65535) {
                        class50_sub1_sub4_sub3_sub1.graphic = -1;
                    }
                }
                if ((i1 & 32) !== 0) {
                    class50_sub1_sub4_sub3_sub1.forcedChat = class50_sub1_sub2.getString();
                    class50_sub1_sub4_sub3_sub1.textCycle = 100;
                }
                if ((i1 & 8) !== 0) {
                    class50_sub1_sub4_sub3_sub1.anInt1598 = class50_sub1_sub2.getLittleShortA();
                    class50_sub1_sub4_sub3_sub1.anInt1599 = class50_sub1_sub2.method549();
                }
                if ((i1 & 2) !== 0) {
                    let l1: number = class50_sub1_sub2.getUnsignedLEShort();
                    if (l1 === 65535) {
                        l1 = -1;
                    }
                    const k2: number = class50_sub1_sub2.getByteSubtracted();
                    if (l1 === class50_sub1_sub4_sub3_sub1.emoteAnimation && l1 !== -1) {
                        const i3: number = AnimationSequence.animations[l1].anInt307;
                        if (i3 === 1) {
                            class50_sub1_sub4_sub3_sub1.displayedEmoteFrames = 0;
                            class50_sub1_sub4_sub3_sub1.anInt1626 = 0;
                            class50_sub1_sub4_sub3_sub1.animationDelay = k2;
                            class50_sub1_sub4_sub3_sub1.anInt1628 = 0;
                        }
                        if (i3 === 2) {
                            class50_sub1_sub4_sub3_sub1.anInt1628 = 0;
                        }
                    } else if (
                        l1 === -1 ||
                        class50_sub1_sub4_sub3_sub1.emoteAnimation === -1 ||
                        AnimationSequence.animations[l1].anInt301 >=
                            AnimationSequence.animations[class50_sub1_sub4_sub3_sub1.emoteAnimation].anInt301
                    ) {
                        class50_sub1_sub4_sub3_sub1.emoteAnimation = l1;
                        class50_sub1_sub4_sub3_sub1.displayedEmoteFrames = 0;
                        class50_sub1_sub4_sub3_sub1.anInt1626 = 0;
                        class50_sub1_sub4_sub3_sub1.animationDelay = k2;
                        class50_sub1_sub4_sub3_sub1.anInt1628 = 0;
                        class50_sub1_sub4_sub3_sub1.anInt1613 = class50_sub1_sub4_sub3_sub1.pathLength;
                    }
                }
                if ((i1 & 16) !== 0) {
                    const i2: number = class50_sub1_sub2.getByteSubtracted();
                    const l2: number = class50_sub1_sub2.getByteSubtracted();
                    class50_sub1_sub4_sub3_sub1.updateHits(l2, i2, Game.pulseCycle);
                    class50_sub1_sub4_sub3_sub1.endCycle = Game.pulseCycle + 300;
                    class50_sub1_sub4_sub3_sub1.anInt1596 = class50_sub1_sub2.getUnsignedByte();
                    class50_sub1_sub4_sub3_sub1.anInt1597 = class50_sub1_sub2.getByteNegated();
                }
            }
        }
    }

    public method132(class50_sub1_sub2: Buffer, i: number, flag: boolean) {
        if (flag) {
            this.anInt1140 = 287;
        }
        while (class50_sub1_sub2.bitPosition + 21 < i * 8) {
            {
                const j: number = class50_sub1_sub2.getBits(14);
                if (j === 16383) {
                    break;
                }
                if (this.npcs[j] == null) {
                    this.npcs[j] = new Npc();
                }
                const npc: Npc = this.npcs[j];
                this.anIntArray1134[this.anInt1133++] = j;
                npc.pulseCycle = Game.pulseCycle;
                const k: number = class50_sub1_sub2.getBits(1);
                if (k === 1) {
                    this.updatedPlayers[this.updatedPlayerCount++] = j;
                }
                let l: number = class50_sub1_sub2.getBits(5);
                if (l > 15) {
                    l -= 32;
                }
                let i1: number = class50_sub1_sub2.getBits(5);
                if (i1 > 15) {
                    i1 -= 32;
                }
                const j1: number = class50_sub1_sub2.getBits(1);
                npc.npcDefinition = ActorDefinition.getDefinition(class50_sub1_sub2.getBits(13));
                npc.boundaryDimension = npc.npcDefinition.boundaryDimension;
                npc.anInt1600 = npc.npcDefinition.degreesToTurn;
                npc.walkAnimationId = npc.npcDefinition.walkAnimationId;
                npc.turnAroundAnimationId = npc.npcDefinition.turnAroundAnimationId;
                npc.turnRightAnimationId = npc.npcDefinition.turnRightAnimationId;
                npc.turnLeftAnimationId = npc.npcDefinition.turnLeftAnimationId;
                npc.idleAnimation = npc.npcDefinition.standAnimationId;
                npc.setPosition(Game.localPlayer.pathX[0] + i1, Game.localPlayer.pathY[0] + l, j1 === 1);
            }
        }
        class50_sub1_sub2.finishBitAccess();
    }

    public method46(i: number, byte0: number, buffer: Buffer) {
        buffer.initBitAccess();
        const j: number = buffer.getBits(8);
        if (byte0 !== this.aByte1317) {
            this.anInt1281 = -460;
        }
        if (j < this.anInt1133) {
            for (let k: number = j; k < this.anInt1133; k++) {
                this.removePlayers[this.removePlayerCount++] = this.anIntArray1134[k];
            }
        }
        if (j > this.anInt1133) {
            SignLink.reportError(this.username + " Too many npcs");
            throw Error("eek");
        }
        this.anInt1133 = 0;
        for (let l: number = 0; l < j; l++) {
            {
                const i1: number = this.anIntArray1134[l];
                const npc: Npc = this.npcs[i1];
                const updateRequired: number = buffer.getBits(1);
                if (updateRequired === 0) {
                    this.anIntArray1134[this.anInt1133++] = i1;
                    npc.pulseCycle = Game.pulseCycle;
                } else {
                    const moveType: number = buffer.getBits(2);
                    if (moveType === 0) {
                        this.anIntArray1134[this.anInt1133++] = i1;
                        npc.pulseCycle = Game.pulseCycle;
                        this.updatedPlayers[this.updatedPlayerCount++] = i1;
                    } else if (moveType === 1) {
                        this.anIntArray1134[this.anInt1133++] = i1;
                        npc.pulseCycle = Game.pulseCycle;
                        const direction: number = buffer.getBits(3);
                        npc.move(direction, false);
                        const blockUpdateRequired: number = buffer.getBits(1);
                        if (blockUpdateRequired === 1) {
                            this.updatedPlayers[this.updatedPlayerCount++] = i1;
                        }
                    } else if (moveType === 2) {
                        this.anIntArray1134[this.anInt1133++] = i1;
                        npc.pulseCycle = Game.pulseCycle;
                        const direction1: number = buffer.getBits(3);
                        npc.move(direction1, true);
                        const direction2: number = buffer.getBits(3);
                        npc.move(direction2, true);
                        const blockUpdateRequired: number = buffer.getBits(1);
                        if (blockUpdateRequired === 1) {
                            this.updatedPlayers[this.updatedPlayerCount++] = i1;
                        }
                    } else if (moveType === 3) {
                        this.removePlayers[this.removePlayerCount++] = i1;
                    }
                }
            }
        }
    }

    public method145(
        flag: boolean,
        i: number,
        j: number,
        k: number,
        l: number,
        i1: number,
        j1: number,
        k1: number,
        l1: number,
        i2: number
    ) {
        let spawnObjectNode: SpawnObjectNode = null;
        for (
            let spawnObjectNode_1: SpawnObjectNode = this.aClass6_1261.first() as SpawnObjectNode;
            spawnObjectNode_1 != null;
            spawnObjectNode_1 = this.aClass6_1261.next() as SpawnObjectNode
        ) {
            {
                if (
                    spawnObjectNode_1.anInt1391 !== i ||
                    spawnObjectNode_1.anInt1393 !== j ||
                    spawnObjectNode_1.anInt1394 !== i2 ||
                    spawnObjectNode_1.anInt1392 !== l1
                ) {
                    continue;
                }
                spawnObjectNode = spawnObjectNode_1;
                break;
            }
        }
        if (spawnObjectNode == null) {
            spawnObjectNode = new SpawnObjectNode();
            spawnObjectNode.anInt1391 = i;
            spawnObjectNode.anInt1392 = l1;
            spawnObjectNode.anInt1393 = j;
            spawnObjectNode.anInt1394 = i2;
            this.method140((-61 as number) | 0, spawnObjectNode);
            this.aClass6_1261.insertBack(spawnObjectNode);
        }
        spawnObjectNode.anInt1384 = j1;
        spawnObjectNode.anInt1386 = i1;
        spawnObjectNode.anInt1385 = k;
        spawnObjectNode.anInt1395 = k1;
        spawnObjectNode.anInt1390 = l;
        this.loggedIn = flag && this.loggedIn;
    }

    public parsePlacementPacket(buf: Buffer, opcode: number) {
        if (opcode === 203) {
            const k: number = buf.getUnsignedLEShort();
            const j3: number = buf.getUnsignedByte();
            const i6: number = j3 >> 2;
            const rotation: number = j3 & 3;
            const k11: number = this.anIntArray1032[i6];
            let byte0: number = buf.getSignedByteNegated();
            const offset: number = buf.getByteAdded();
            const x: number = this.placementX + ((offset >> 4) & 7);
            const y: number = this.placementY + (offset & 7);
            let byte1: number = buf.getSignedByteAdded();
            const l19: number = buf.method550();
            const id: number = buf.method549();
            let byte2: number = buf.getSignedByte();
            let byte3: number = buf.getSignedByteAdded();
            const l21: number = buf.getUnsignedLEShort();
            let player: Player;
            if (id === this.thisPlayerServerId) {
                player = Game.localPlayer;
            } else {
                player = this.players[id];
            }
            if (player != null) {
                const class47: GameObjectDefinition = GameObjectDefinition.getDefinition(k);
                const i22: number = this.anIntArrayArrayArray891[this.plane][x][y];
                const j22: number = this.anIntArrayArrayArray891[this.plane][x + 1][y];
                const k22: number = this.anIntArrayArrayArray891[this.plane][x + 1][y + 1];
                const l22: number = this.anIntArrayArrayArray891[this.plane][x][y + 1];
                const class50_sub1_sub4_sub4: Model = class47.getGameObjectModel(i6, rotation, i22, j22, k22, l22, -1);
                if (class50_sub1_sub4_sub4 != null) {
                    this.method145(true, this.plane, x, 0, l19 + 1, 0, -1, l21 + 1, k11, y);
                    player.objectAppearanceStartTick = l21 + Game.pulseCycle;
                    player.objectAppearanceEndTick = l19 + Game.pulseCycle;
                    player.playerModel = class50_sub1_sub4_sub4;
                    let i23: number = class47.sizeX;
                    let j23: number = class47.sizeY;
                    if (rotation === 1 || rotation === 3) {
                        i23 = class47.sizeY;
                        j23 = class47.sizeX;
                    }
                    player.anInt1743 = x * 128 + i23 * 64;
                    player.anInt1745 = y * 128 + j23 * 64;
                    player.anInt1744 = this.getTileHeight(player.anInt1745, player.anInt1743, (9 as number) | 0, this.plane);
                    if (byte1 > byte0) {
                        const byte4: number = byte1;
                        byte1 = byte0;
                        byte0 = byte4;
                    }
                    if (byte3 > byte2) {
                        const byte5: number = byte3;
                        byte3 = byte2;
                        byte2 = byte5;
                    }
                    player.anInt1768 = x + byte1;
                    player.anInt1770 = x + byte0;
                    player.anInt1769 = y + byte3;
                    player.anInt1771 = y + byte2;
                }
            }
        }
        if (opcode === 106) {
            const offset: number = buf.getByteAdded();
            const x: number = this.placementX + ((offset >> 4) & 7);
            const y: number = this.placementY + (offset & 7);
            const amount: number = buf.getLittleShortA();
            const id: number = buf.method550();
            const playerId: number = buf.method550();
            if (x >= 0 && y >= 0 && x < 104 && y < 104 && playerId !== this.thisPlayerServerId) {
                const item: Item = new Item();
                item.itemId = id;
                item.itemCount = amount;
                if (this.groundItems[this.plane][x][y] == null) {
                    this.groundItems[this.plane][x][y] = new LinkedList();
                }
                this.groundItems[this.plane][x][y].insertBack(item);
                this.processGroundItems(x, y);
            }
            return;
        }
        if (opcode === 142) {
            const i1: number = buf.getUnsignedLEShort();
            const l3: number = buf.getByteAdded();
            let k6: number = l3 >> 2;
            const j9: number = l3 & 3;
            const i12: number = this.anIntArray1032[k6];
            const j14: number = buf.getUnsignedByte();
            const x: number = this.placementX + ((j14 >> 4) & 7);
            const y: number = this.placementY + (j14 & 7);
            if (x >= 0 && y >= 0 && x < 103 && y < 103) {
                const l18: number = this.anIntArrayArrayArray891[this.plane][x][y];
                const j19: number = this.anIntArrayArrayArray891[this.plane][x + 1][y];
                const i20: number = this.anIntArrayArrayArray891[this.plane][x + 1][y + 1];
                const l20: number = this.anIntArrayArrayArray891[this.plane][x][y + 1];
                if (i12 === 0) {
                    const wall: Wall = this.currentScene.method263(this.plane, 17734, x, y);
                    if (wall != null) {
                        const k21: number = (wall.hash >> 14) & 32767;
                        if (k6 === 2) {
                            wall.aRenderable769 = new GameObject(k21, 4 + j9, 2, j19, i20, l18, l20, i1, false);
                            wall.aRenderable770 = new GameObject(k21, (j9 + 1) & 3, 2, j19, i20, l18, l20, i1, false);
                        } else {
                            wall.aRenderable769 = new GameObject(k21, j9, k6, j19, i20, l18, l20, i1, false);
                        }
                    }
                }
                if (i12 === 1) {
                    const wallDecoration: WallDecoration = this.currentScene.method264(this.plane, y, x, false);
                    if (wallDecoration != null) {
                        wallDecoration.renderable = new GameObject(
                            (wallDecoration.hash >> 14) & 32767,
                            0,
                            4,
                            j19,
                            i20,
                            l18,
                            l20,
                            i1,
                            false
                        );
                    }
                }
                if (i12 === 2) {
                    const sceneSpawnRequest: SceneSpawnRequest = this.currentScene.method265(x, (32 as number) | 0, y, this.plane);
                    if (k6 === 11) {
                        k6 = 10;
                    }
                    if (sceneSpawnRequest != null) {
                        sceneSpawnRequest.aRenderable601 = new GameObject(
                            (sceneSpawnRequest.anInt125 >> 14) & 32767,
                            j9,
                            k6,
                            j19,
                            i20,
                            l18,
                            l20,
                            i1,
                            false
                        );
                    }
                }
                if (i12 === 3) {
                    const floorDecoration: FloorDecoration = this.currentScene.method266(this.plane, y, 0, x);
                    if (floorDecoration != null) {
                        floorDecoration.renderable = new GameObject(
                            (floorDecoration.hash >> 14) & 32767,
                            j9,
                            22,
                            j19,
                            i20,
                            l18,
                            l20,
                            i1,
                            false
                        );
                    }
                }
            }
            return;
        }
        if (opcode === 107) {
            const id: number = buf.getUnsignedLEShort();
            const offset: number = buf.getByteNegated();
            const x: number = this.placementX + ((offset >> 4) & 7);
            const y: number = this.placementY + (offset & 7);
            const amount: number = buf.method550();
            if (x >= 0 && y >= 0 && x < 104 && y < 104) {
                const item: Item = new Item();
                item.itemId = id;
                item.itemCount = amount;
                if (this.groundItems[this.plane][x][y] == null) {
                    this.groundItems[this.plane][x][y] = new LinkedList();
                }
                this.groundItems[this.plane][x][y].insertBack(item);
                this.processGroundItems(x, y);
            }
            return;
        }
        if (opcode === 121) {
            const offset: number = buf.getUnsignedByte();
            const x: number = this.placementX + ((offset >> 4) & 7);
            const y: number = this.placementY + (offset & 7);
            const id: number = buf.getUnsignedLEShort();
            const amount: number = buf.getUnsignedLEShort();
            const newAmount: number = buf.getUnsignedLEShort();
            if (x >= 0 && y >= 0 && x < 104 && y < 104) {
                const list: LinkedList = this.groundItems[this.plane][x][y];
                if (list != null) {
                    for (let item: Item = list.first() as Item; item != null; item = list.next() as Item) {
                        {
                            if (item.itemId !== (id & 32767) || item.itemCount !== amount) {
                                continue;
                            }
                            item.itemCount = newAmount;
                            break;
                        }
                    }
                    this.processGroundItems(x, y);
                }
            }
            return;
        }
        if (opcode === 181) {
            const offset: number = buf.getUnsignedByte();
            let x: number = this.placementX + ((offset >> 4) & 7);
            let y: number = this.placementY + (offset & 7);
            let i10: number = x + buf.getSignedByte();
            let l12: number = y + buf.getSignedByte();
            const l14: number = buf.getSignedShort();
            const k16: number = buf.getUnsignedLEShort();
            const i18: number = buf.getUnsignedByte() * 4;
            const i19: number = buf.getUnsignedByte() * 4;
            const k19: number = buf.getUnsignedLEShort();
            const j20: number = buf.getUnsignedLEShort();
            const i21: number = buf.getUnsignedByte();
            const j21: number = buf.getUnsignedByte();
            if (x >= 0 && y >= 0 && x < 104 && y < 104 && i10 >= 0 && l12 >= 0 && i10 < 104 && l12 < 104 && k16 !== 65535) {
                x = x * 128 + 64;
                y = y * 128 + 64;
                i10 = i10 * 128 + 64;
                l12 = l12 * 128 + 64;
                const class50_sub1_sub4_sub2: Projectile = new Projectile(
                    this.plane,
                    i19,
                    j21,
                    y,
                    k16,
                    j20 + Game.pulseCycle,
                    i21,
                    l14,
                    this.getTileHeight(y, x, (9 as number) | 0, this.plane) - i18,
                    x,
                    k19 + Game.pulseCycle
                );
                class50_sub1_sub4_sub2.trackTarget(
                    i10,
                    l12,
                    this.getTileHeight(l12, i10, (9 as number) | 0, this.plane) - i19,
                    k19 + Game.pulseCycle
                );
                this.aClass6_1282.insertBack(class50_sub1_sub4_sub2);
            }
            return;
        }
        if (opcode === 41) {
            const offset: number = buf.getUnsignedByte();
            const x: number = this.placementX + ((offset >> 4) & 7);
            const y: number = this.placementY + (offset & 7);
            const soundId: number = buf.getUnsignedLEShort();
            const i13: number = buf.getUnsignedByte();
            const i15: number = (i13 >> 4) & 15;
            const type: number = i13 & 7;
            if (
                Game.localPlayer.pathX[0] >= x - i15 &&
                Game.localPlayer.pathX[0] <= x + i15 &&
                Game.localPlayer.pathY[0] >= y - i15 &&
                Game.localPlayer.pathY[0] <= y + i15 &&
                this.aBoolean1301 &&
                !Game.lowMemory &&
                this.currentSound < 50
            ) {
                this.sound[this.currentSound] = soundId;
                this.soundType[this.currentSound] = type;
                this.soundDelay[this.currentSound] = SoundTrack.trackDelays[soundId];
                this.currentSound++;
            }
        }
        if (opcode === 59) {
            const j2: number = buf.getUnsignedByte();
            let i5: number = this.placementX + ((j2 >> 4) & 7);
            let l7: number = this.placementY + (j2 & 7);
            const k10: number = buf.getUnsignedLEShort();
            const j13: number = buf.getUnsignedByte();
            const j15: number = buf.getUnsignedLEShort();
            if (i5 >= 0 && l7 >= 0 && i5 < 104 && l7 < 104) {
                i5 = i5 * 128 + 64;
                l7 = l7 * 128 + 64;
                const gameAnimableObject: GameAnimableObject = new GameAnimableObject(
                    this.plane,
                    Game.pulseCycle,
                    j15,
                    k10,
                    this.getTileHeight(l7, i5, (9 as number) | 0, this.plane) - j13,
                    l7,
                    i5
                );
                this.aClass6_1210.insertBack(gameAnimableObject);
            }
            return;
        }
        if (opcode === 152) {
            const k2: number = buf.getByteNegated();
            const j5: number = k2 >> 2;
            const i8: number = k2 & 3;
            const l10: number = this.anIntArray1032[j5];
            const k13: number = buf.getLittleShortA();
            const k15: number = buf.getByteAdded();
            const i17: number = this.placementX + ((k15 >> 4) & 7);
            const j18: number = this.placementY + (k15 & 7);
            if (i17 >= 0 && j18 >= 0 && i17 < 104 && j18 < 104) {
                this.method145(true, this.plane, i17, i8, -1, j5, k13, 0, l10, j18);
            }
            return;
        }
        if (opcode === 208) {
            const id: number = buf.method550();
            const offset: number = buf.getByteAdded();
            const x: number = this.placementX + ((offset >> 4) & 7);
            const y: number = this.placementY + (offset & 7);
            if (x >= 0 && y >= 0 && x < 104 && y < 104) {
                const list: LinkedList = this.groundItems[this.plane][x][y];
                if (list != null) {
                    for (let item: Item = list.first() as Item; item != null; item = list.next() as Item) {
                        {
                            if (item.itemId !== (id & 32767)) {
                                continue;
                            }
                            item.remove();
                            break;
                        }
                    }
                    if (list.first() == null) {
                        this.groundItems[this.plane][x][y] = null;
                    }
                    this.processGroundItems(x, y);
                }
            }
            return;
        }
        if (opcode === 88) {
            const i3: number = buf.getByteSubtracted();
            const l5: number = this.placementX + ((i3 >> 4) & 7);
            const k8: number = this.placementY + (i3 & 7);
            const j11: number = buf.getByteSubtracted();
            const l13: number = j11 >> 2;
            const l15: number = j11 & 3;
            const j17: number = this.anIntArray1032[l13];
            if (l5 >= 0 && k8 >= 0 && l5 < 104 && k8 < 104) {
                this.method145(true, this.plane, l5, l15, -1, l13, -1, 0, j17, k8);
            }
        }
    }

    public logout() {
        try {
            if (this.gameConnection != null) {
                this.gameConnection.close();
            }
        } catch (_ex) {}
        this.gameConnection = null;
        this.loggedIn = false;
        this.loginScreenState = 0;
        this.username = "";
        this.password = "";
        this.resetModelCaches();
        this.currentScene.method241();
        for (let plane: number = 0; plane < 4; plane++) {
            this.currentCollisionMap[plane].reset();
        }
        this.stopMidi();
        this.currentSong = -1;
        this.nextSong = -1;
        this.previousSong = 0;
    }

    public method143(byte0: number) {
        if (byte0 !== -40) {
            Game.aBoolean1207 = !Game.aBoolean1207;
        }
        if (Game.lowMemory && this.loadingStage === 2 && Region.onBuildTimePlane !== this.plane) {
            this.method125(null, "Loading - please wait.");
            this.loadingStage = 1;
            this.aLong1229 = new Date().getTime();
        }
        if (this.loadingStage === 1) {
            const i: number = this.method144(5);
            if (i !== 0 && new Date().getTime() - this.aLong1229 > 360000) {
                SignLink.reportError(
                    this.username +
                        " glcfb serverseed_meh ," +
                        i +
                        "," +
                        Game.lowMemory +
                        "," +
                        this.stores[0] +
                        "," +
                        this.onDemandRequester.immediateRequestsCount() +
                        "," +
                        this.plane +
                        "," +
                        this.chunkX +
                        "," +
                        this.chunkY
                );
                this.aLong1229 = new Date().getTime();
            }
        }
        if (this.loadingStage === 2 && this.plane !== this.anInt1276) {
            this.anInt1276 = this.plane;
            this.renderViewport(this.plane);
        }
    }

    public method150(i: number, j: number, k: number, l: number, i1: number, j1: number) {
        let k1: number = this.currentScene.method267(j, k, i);
        i1 = (62 / i1) | 0;
        if (k1 !== 0) {
            const l1: number = this.currentScene.method271(j, k, i, k1);
            const k2: number = (l1 >> 6) & 3;
            const i3: number = l1 & 31;
            let k3: number = j1;
            if (k1 > 0) {
                k3 = l;
            }
            const ai: number[] = this.minimapImage.pixels;
            const k4: number = 24624 + k * 4 + (103 - i) * 512 * 4;
            const i5: number = (k1 >> 14) & 32767;
            const class47_2: GameObjectDefinition = GameObjectDefinition.getDefinition(i5);
            if (class47_2.anInt795 !== -1) {
                const class50_sub1_sub1_sub3_2: IndexedImage = this.mapscenes[class47_2.anInt795];
                if (class50_sub1_sub1_sub3_2 != null) {
                    const i6: number = ((class47_2.sizeX * 4 - class50_sub1_sub1_sub3_2.width) / 2) | 0;
                    const j6: number = ((class47_2.sizeY * 4 - class50_sub1_sub1_sub3_2.height) / 2) | 0;
                    class50_sub1_sub1_sub3_2.drawImage(48 + k * 4 + i6, 48 + (104 - i - class47_2.sizeY) * 4 + j6);
                }
            } else {
                if (i3 === 0 || i3 === 2) {
                    if (k2 === 0) {
                        ai[k4] = k3;
                        ai[k4 + 512] = k3;
                        ai[k4 + 1024] = k3;
                        ai[k4 + 1536] = k3;
                    } else if (k2 === 1) {
                        ai[k4] = k3;
                        ai[k4 + 1] = k3;
                        ai[k4 + 2] = k3;
                        ai[k4 + 3] = k3;
                    } else if (k2 === 2) {
                        ai[k4 + 3] = k3;
                        ai[k4 + 3 + 512] = k3;
                        ai[k4 + 3 + 1024] = k3;
                        ai[k4 + 3 + 1536] = k3;
                    } else if (k2 === 3) {
                        ai[k4 + 1536] = k3;
                        ai[k4 + 1536 + 1] = k3;
                        ai[k4 + 1536 + 2] = k3;
                        ai[k4 + 1536 + 3] = k3;
                    }
                }
                if (i3 === 3) {
                    if (k2 === 0) {
                        ai[k4] = k3;
                    } else if (k2 === 1) {
                        ai[k4 + 3] = k3;
                    } else if (k2 === 2) {
                        ai[k4 + 3 + 1536] = k3;
                    } else if (k2 === 3) {
                        ai[k4 + 1536] = k3;
                    }
                }
                if (i3 === 2) {
                    if (k2 === 3) {
                        ai[k4] = k3;
                        ai[k4 + 512] = k3;
                        ai[k4 + 1024] = k3;
                        ai[k4 + 1536] = k3;
                    } else if (k2 === 0) {
                        ai[k4] = k3;
                        ai[k4 + 1] = k3;
                        ai[k4 + 2] = k3;
                        ai[k4 + 3] = k3;
                    } else if (k2 === 1) {
                        ai[k4 + 3] = k3;
                        ai[k4 + 3 + 512] = k3;
                        ai[k4 + 3 + 1024] = k3;
                        ai[k4 + 3 + 1536] = k3;
                    } else if (k2 === 2) {
                        ai[k4 + 1536] = k3;
                        ai[k4 + 1536 + 1] = k3;
                        ai[k4 + 1536 + 2] = k3;
                        ai[k4 + 1536 + 3] = k3;
                    }
                }
            }
        }
        k1 = this.currentScene.method269(j, k, i);
        if (k1 !== 0) {
            const i2: number = this.currentScene.method271(j, k, i, k1);
            const l2: number = (i2 >> 6) & 3;
            const j3: number = i2 & 31;
            const l3: number = (k1 >> 14) & 32767;
            const class47_1: GameObjectDefinition = GameObjectDefinition.getDefinition(l3);
            if (class47_1.anInt795 !== -1) {
                const class50_sub1_sub1_sub3_1: IndexedImage = this.mapscenes[class47_1.anInt795];
                if (class50_sub1_sub1_sub3_1 != null) {
                    const j5: number = ((class47_1.sizeX * 4 - class50_sub1_sub1_sub3_1.width) / 2) | 0;
                    const k5: number = ((class47_1.sizeY * 4 - class50_sub1_sub1_sub3_1.height) / 2) | 0;
                    class50_sub1_sub1_sub3_1.drawImage(48 + k * 4 + j5, 48 + (104 - i - class47_1.sizeY) * 4 + k5);
                }
            } else if (j3 === 9) {
                let l4: number = 15658734;
                if (k1 > 0) {
                    l4 = 15597568;
                }
                const ai1: number[] = this.minimapImage.pixels;
                const l5: number = 24624 + k * 4 + (103 - i) * 512 * 4;
                if (l2 === 0 || l2 === 2) {
                    ai1[l5 + 1536] = l4;
                    ai1[l5 + 1024 + 1] = l4;
                    ai1[l5 + 512 + 2] = l4;
                    ai1[l5 + 3] = l4;
                } else {
                    ai1[l5] = l4;
                    ai1[l5 + 512 + 1] = l4;
                    ai1[l5 + 1024 + 2] = l4;
                    ai1[l5 + 1536 + 3] = l4;
                }
            }
        }
        k1 = this.currentScene.getFloorDecorationHash(j, k, i);
        if (k1 !== 0) {
            const j2: number = (k1 >> 14) & 32767;
            const class47: GameObjectDefinition = GameObjectDefinition.getDefinition(j2);
            if (class47.anInt795 !== -1) {
                const class50_sub1_sub1_sub3: IndexedImage = this.mapscenes[class47.anInt795];
                if (class50_sub1_sub1_sub3 != null) {
                    const i4: number = ((class47.sizeX * 4 - class50_sub1_sub1_sub3.width) / 2) | 0;
                    const j4: number = ((class47.sizeY * 4 - class50_sub1_sub1_sub3.height) / 2) | 0;
                    class50_sub1_sub1_sub3.drawImage(48 + k * 4 + i4, 48 + (104 - i - class47.sizeY) * 4 + j4);
                }
            }
        }
    }

    public renderViewport(plane: number) {
        const pixels: number[] = this.minimapImage.pixels;
        const pixelAmount: number = pixels.length;
        for (let pixel: number = 0; pixel < pixelAmount; pixel++) {
            pixels[pixel] = 0;
        }
        for (let viewportY: number = 1; viewportY < 103; viewportY++) {
            {
                let drawPoint: number = 24628 + (103 - viewportY) * 512 * 4;
                for (let viewportX: number = 1; viewportX < 103; viewportX++) {
                    {
                        if ((this.currentSceneTileFlags[plane][viewportX][viewportY] & 24) === 0) {
                            this.currentScene.renderMinimapDot(pixels, drawPoint, 512, plane, viewportX, viewportY);
                        }
                        if (plane < 3 && (this.currentSceneTileFlags[plane + 1][viewportX][viewportY] & 8) !== 0) {
                            this.currentScene.renderMinimapDot(pixels, drawPoint, 512, plane + 1, viewportX, viewportY);
                        }
                        drawPoint += 4;
                    }
                }
            }
        }
        const primaryColour: number =
            ((238 + (((Math.random() * 20.0) as number) | 0) - 10) << 16) +
            ((238 + (((Math.random() * 20.0) as number) | 0) - 10) << 8) +
            (238 + (((Math.random() * 20.0) as number) | 0) - 10);
        const secondaryColour: number = (238 + (((Math.random() * 20.0) as number) | 0) - 10) << 16;
        this.minimapImage.createRasterizer();
        for (let viewportY: number = 1; viewportY < 103; viewportY++) {
            {
                for (let viewportX: number = 1; viewportX < 103; viewportX++) {
                    {
                        if ((this.currentSceneTileFlags[plane][viewportX][viewportY] & 24) === 0) {
                            this.method150(viewportY, plane, viewportX, secondaryColour, 563, primaryColour);
                        }
                        if (plane < 3 && (this.currentSceneTileFlags[plane + 1][viewportX][viewportY] & 8) !== 0) {
                            this.method150(viewportY, plane + 1, viewportX, secondaryColour, 563, primaryColour);
                        }
                    }
                }
            }
        }
        if (this.aClass18_1158 != null) {
            this.aClass18_1158.createRasterizer();
            Rasterizer3D.lineOffsets = this.anIntArray1002;
        }
        Game.anInt1082++;
        if (Game.anInt1082 > 177) {
            Game.anInt1082 = 0;
            this.outBuffer.putOpcode(173);
            this.outBuffer.putTriByte(2657152);
        }
        this.minimapHintCount = 0;
        for (let viewportX: number = 0; viewportX < 104; viewportX++) {
            {
                for (let viewportY: number = 0; viewportY < 104; viewportY++) {
                    {
                        let floorHash: number = this.currentScene.getFloorDecorationHash(this.plane, viewportX, viewportY);
                        if (floorHash !== 0) {
                            floorHash = (floorHash >> 14) & 32767;
                            const icon: number = GameObjectDefinition.getDefinition(floorHash).icon;
                            if (icon >= 0) {
                                let drawPointX: number = viewportX;
                                let drawPointY: number = viewportY;
                                if (icon !== 22 && icon !== 29 && icon !== 34 && icon !== 36 && icon !== 46 && icon !== 47 && icon !== 48) {
                                    const regionWidth: number = 104;
                                    const regionHeight: number = 104;
                                    const flags: number[][] = this.currentCollisionMap[this.plane].adjacency;
                                    for (let off: number = 0; off < 10; off++) {
                                        {
                                            const randPlane: number = ((Math.random() * 4.0) as number) | 0;
                                            if (
                                                randPlane === 0 &&
                                                drawPointX > 0 &&
                                                drawPointX > viewportX - 3 &&
                                                (flags[drawPointX - 1][drawPointY] & 19398920) === 0
                                            ) {
                                                drawPointX--;
                                            }
                                            if (
                                                randPlane === 1 &&
                                                drawPointX < regionWidth - 1 &&
                                                drawPointX < viewportX + 3 &&
                                                (flags[drawPointX + 1][drawPointY] & 19399040) === 0
                                            ) {
                                                drawPointX++;
                                            }
                                            if (
                                                randPlane === 2 &&
                                                drawPointY > 0 &&
                                                drawPointY > viewportY - 3 &&
                                                (flags[drawPointX][drawPointY - 1] & 19398914) === 0
                                            ) {
                                                drawPointY--;
                                            }
                                            if (
                                                randPlane === 3 &&
                                                drawPointY < regionHeight - 1 &&
                                                drawPointY < viewportY + 3 &&
                                                (flags[drawPointX][drawPointY + 1] & 19398944) === 0
                                            ) {
                                                drawPointY++;
                                            }
                                        }
                                    }
                                }
                                this.minimapHint[this.minimapHintCount] = this.worldMapHintIcons[icon];
                                this.minimapHintX[this.minimapHintCount] = drawPointX;
                                this.minimapHintY[this.minimapHintCount] = drawPointY;
                                this.minimapHintCount++;
                            }
                        }
                    }
                }
            }
        }
    }

    public method144(i: number): number {
        for (let j: number = 0; j < this.aByteArrayArray838.length; j++) {
            {
                if (this.aByteArrayArray838[j] == null && this.anIntArray857[j] !== -1) {
                    return -1;
                }
                if (this.aByteArrayArray1232[j] == null && this.anIntArray858[j] !== -1) {
                    return -2;
                }
            }
        }
        let flag: boolean = true;
        if (i < 5 || i > 5) {
            this.aBoolean953 = !this.aBoolean953;
        }
        for (let k: number = 0; k < this.aByteArrayArray838.length; k++) {
            {
                const abyte0: number[] = this.aByteArrayArray1232[k];
                if (abyte0 != null) {
                    let l: number = (this.coordinates[k] >> 8) * 64 - this.nextTopLeftTileX;
                    let i1: number = (this.coordinates[k] & 255) * 64 - this.nextTopRightTileY;
                    if (this.aBoolean1163) {
                        l = 10;
                        i1 = 10;
                    }
                    flag = Region.method181(l, i1, abyte0, 24515) && flag;
                }
            }
        }
        if (!flag) {
            return -3;
        }
        if (this.aBoolean1209) {
            return -4;
        } else {
            this.loadingStage = 2;
            Region.onBuildTimePlane = this.plane;
            this.method93(175);
            this.outBuffer.putOpcode(6);
            return 0;
        }
    }

    public resetModelCaches() {
        GameObjectDefinition.modelCache.removeAll();
        GameObjectDefinition.animatedModelCache.removeAll();
        ActorDefinition.modelCache.removeAll();
        ItemDefinition.modelCache.removeAll();
        ItemDefinition.rgbImageCache.removeAll();
        Player.modelCache.removeAll();
        SpotAnimation.modelCache.removeAll();
    }

    public method93(i: number) {
        try {
            this.anInt1276 = -1;
            this.aClass6_1210.getNodeCount();
            this.aClass6_1282.getNodeCount();
            Rasterizer3D.method495((71 as number) | 0);
            this.resetModelCaches();
            this.currentScene.method241();

            for (let plane: number = 0; plane < 4; plane++) {
                this.currentCollisionMap[plane].reset();
            }
            for (let i1: number = 0; i1 < 4; i1++) {
                {
                    for (let l1: number = 0; l1 < 104; l1++) {
                        {
                            for (let k2: number = 0; k2 < 104; k2++) {
                                this.currentSceneTileFlags[i1][l1][k2] = 0;
                            }
                        }
                    }
                }
            }
            const class8: Region = new Region(this.currentSceneTileFlags, 104, 104, this.anIntArrayArrayArray891);
            const l2: number = this.aByteArrayArray838.length;
            this.outBuffer.putOpcode(40);
            if (!this.aBoolean1163) {
                for (let j3: number = 0; j3 < l2; j3++) {
                    {
                        const j4: number = (this.coordinates[j3] >> 8) * 64 - this.nextTopLeftTileX;
                        const l5: number = (this.coordinates[j3] & 255) * 64 - this.nextTopRightTileY;
                        const abyte0: number[] = this.aByteArrayArray838[j3];
                        if (abyte0 != null) {
                            class8.method174(l5, false, (this.chunkY - 6) * 8, j4, abyte0, (this.chunkX - 6) * 8, this.currentCollisionMap);
                        }
                    }
                }
                for (let k4: number = 0; k4 < l2; k4++) {
                    {
                        const i6: number = (this.coordinates[k4] >> 8) * 64 - this.nextTopLeftTileX;
                        const l7: number = (this.coordinates[k4] & 255) * 64 - this.nextTopRightTileY;
                        const abyte2: number[] = this.aByteArrayArray838[k4];
                        if (abyte2 == null && this.chunkY < 800) {
                            class8.initiateVertexHeights(i6, 64, l7, 64);
                        }
                    }
                }
                this.outBuffer.putOpcode(40);
                for (let j6: number = 0; j6 < l2; j6++) {
                    {
                        const abyte1: number[] = this.aByteArrayArray1232[j6];
                        if (abyte1 != null) {
                            const l8: number = (this.coordinates[j6] >> 8) * 64 - this.nextTopLeftTileX;
                            const k9: number = (this.coordinates[j6] & 255) * 64 - this.nextTopRightTileY;
                            class8.method179(k9, this.currentCollisionMap, l8, -571, this.currentScene, abyte1);
                        }
                    }
                }
            }
            if (this.aBoolean1163) {
                for (let k3: number = 0; k3 < 4; k3++) {
                    {
                        for (let l4: number = 0; l4 < 13; l4++) {
                            {
                                for (let k6: number = 0; k6 < 13; k6++) {
                                    {
                                        let flag: boolean = false;
                                        const i9: number = this.constructedMapPalette[k3][l4][k6];
                                        if (i9 !== -1) {
                                            const l9: number = (i9 >> 24) & 3;
                                            const j10: number = (i9 >> 1) & 3;
                                            const l10: number = (i9 >> 14) & 1023;
                                            const j11: number = (i9 >> 3) & 2047;
                                            const l11: number = (((l10 / 8) | 0) << 8) + ((j11 / 8) | 0);
                                            for (let j12: number = 0; j12 < this.coordinates.length; j12++) {
                                                {
                                                    if (this.coordinates[j12] !== l11 || this.aByteArrayArray838[j12] == null) {
                                                        continue;
                                                    }
                                                    class8.method168(
                                                        j10,
                                                        (j11 & 7) * 8,
                                                        false,
                                                        this.aByteArrayArray838[j12],
                                                        k3,
                                                        l9,
                                                        l4 * 8,
                                                        this.currentCollisionMap,
                                                        k6 * 8,
                                                        (l10 & 7) * 8
                                                    );
                                                    flag = true;
                                                    break;
                                                }
                                            }
                                        }
                                        if (!flag) {
                                            class8.method166(this.anInt1072, k3, k6 * 8, l4 * 8);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                for (let i5: number = 0; i5 < 13; i5++) {
                    {
                        for (let l6: number = 0; l6 < 13; l6++) {
                            {
                                const i8: number = this.constructedMapPalette[0][i5][l6];
                                if (i8 === -1) {
                                    class8.initiateVertexHeights(i5 * 8, 8, l6 * 8, 8);
                                }
                            }
                        }
                    }
                }
                this.outBuffer.putOpcode(40);
                for (let i7: number = 0; i7 < 4; i7++) {
                    {
                        for (let j8: number = 0; j8 < 13; j8++) {
                            {
                                for (let j9: number = 0; j9 < 13; j9++) {
                                    {
                                        const i10: number = this.constructedMapPalette[i7][j8][j9];
                                        if (i10 !== -1) {
                                            const k10: number = (i10 >> 24) & 3;
                                            const i11: number = (i10 >> 1) & 3;
                                            const k11: number = (i10 >> 14) & 1023;
                                            const i12: number = (i10 >> 3) & 2047;
                                            const k12: number = (((k11 / 8) | 0) << 8) + ((i12 / 8) | 0);
                                            for (let l12: number = 0; l12 < this.coordinates.length; l12++) {
                                                {
                                                    if (this.coordinates[l12] !== k12 || this.aByteArrayArray1232[l12] == null) {
                                                        continue;
                                                    }
                                                    class8.method172(
                                                        i7,
                                                        this.currentCollisionMap,
                                                        this.currentScene,
                                                        false,
                                                        this.aByteArrayArray1232[l12],
                                                        j9 * 8,
                                                        i11,
                                                        (k11 & 7) * 8,
                                                        j8 * 8,
                                                        (i12 & 7) * 8,
                                                        k10
                                                    );
                                                    break;
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
            this.outBuffer.putOpcode(40);
            class8.createRegionScene(this.currentCollisionMap, this.currentScene);
            if (this.aClass18_1158 != null) {
                this.aClass18_1158.createRasterizer();
                Rasterizer3D.lineOffsets = this.anIntArray1002;
            }
            this.outBuffer.putOpcode(40);
            let l3: number = Region.lowestPlane;
            if (l3 > this.plane) {
                l3 = this.plane;
            }
            if (l3 < this.plane - 1) {
                l3 = this.plane - 1;
            }
            if (Game.lowMemory) {
                this.currentScene.method242(Region.lowestPlane);
            } else {
                this.currentScene.method242(0);
            }
            for (let j5: number = 0; j5 < 104; j5++) {
                {
                    for (let j7: number = 0; j7 < 104; j7++) {
                        this.processGroundItems(j5, j7);
                    }
                }
            }
            this.method18((3 as number) | 0);
        } catch (exception) {}
        GameObjectDefinition.modelCache.removeAll();
        this.outBuffer.putOpcode(78);
        this.outBuffer.putInt(1057001181);
        if (Game.lowMemory) {
            const k: number = this.onDemandRequester.fileCount(0);
            for (let j1: number = 0; j1 < k; j1++) {
                {
                    const i2: number = this.onDemandRequester.modelId(j1);
                    if ((i2 & 121) === 0) {
                        Model.resetModel(j1);
                    }
                }
            }
        }

        Rasterizer3D.method496(20);
        this.onDemandRequester.immediateRequestCount();
        let l: number = (((this.chunkX - 6) / 8) | 0) - 1;
        let k1: number = (((this.chunkX + 6) / 8) | 0) + 1;
        let j2: number = (((this.chunkY - 6) / 8) | 0) - 1;
        let i3: number = (((this.chunkY + 6) / 8) | 0) + 1;
        i = (94 / i) | 0;
        if (this.aBoolean1067) {
            l = 49;
            k1 = 50;
            j2 = 49;
            i3 = 50;
        }
        for (let i4: number = l; i4 <= k1; i4++) {
            {
                for (let k5: number = j2; k5 <= i3; k5++) {
                    if (i4 === l || i4 === k1 || k5 === j2 || k5 === i3) {
                        const k7: number = this.onDemandRequester.regId(0, i4, k5, 0);
                        if (k7 !== -1) {
                            this.onDemandRequester.passiveRequest(k7, 3);
                        }
                        const k8: number = this.onDemandRequester.regId(0, i4, k5, 1);
                        if (k8 !== -1) {
                            this.onDemandRequester.passiveRequest(k8, 3);
                        }
                    }
                }
            }
        }
    }

    public method18(byte0: number) {
        if (byte0 !== 3) {
            return;
        }
        for (
            let spawnObjectNode: SpawnObjectNode = this.aClass6_1261.first() as SpawnObjectNode;
            spawnObjectNode != null;
            spawnObjectNode = this.aClass6_1261.next() as SpawnObjectNode
        ) {
            if (spawnObjectNode.anInt1390 === -1) {
                spawnObjectNode.anInt1395 = 0;
                this.method140((-61 as number) | 0, spawnObjectNode);
            } else {
                spawnObjectNode.remove();
            }
        }
    }

    public method140(byte0: number, spawnObjectNode: SpawnObjectNode) {
        let i: number = 0;
        let j: number = -1;
        let k: number = 0;
        let l: number = 0;
        if (byte0 !== -61) {
            this.outBuffer.putByte(175);
        }
        if (spawnObjectNode.anInt1392 === 0) {
            i = this.currentScene.method267(spawnObjectNode.anInt1391, spawnObjectNode.anInt1393, spawnObjectNode.anInt1394);
        }
        if (spawnObjectNode.anInt1392 === 1) {
            i = this.currentScene.method268(
                spawnObjectNode.anInt1393,
                (4 as number) | 0,
                spawnObjectNode.anInt1391,
                spawnObjectNode.anInt1394
            );
        }
        if (spawnObjectNode.anInt1392 === 2) {
            i = this.currentScene.method269(spawnObjectNode.anInt1391, spawnObjectNode.anInt1393, spawnObjectNode.anInt1394);
        }
        if (spawnObjectNode.anInt1392 === 3) {
            i = this.currentScene.getFloorDecorationHash(spawnObjectNode.anInt1391, spawnObjectNode.anInt1393, spawnObjectNode.anInt1394);
        }
        if (i !== 0) {
            const i1: number = this.currentScene.method271(
                spawnObjectNode.anInt1391,
                spawnObjectNode.anInt1393,
                spawnObjectNode.anInt1394,
                i
            );
            j = (i >> 14) & 32767;
            k = i1 & 31;
            l = i1 >> 6;
        }
        spawnObjectNode.anInt1387 = j;
        spawnObjectNode.anInt1389 = k;
        spawnObjectNode.anInt1388 = l;
    }

    public processGroundItems(x: number, y: number) {
        const linkedList: LinkedList = this.groundItems[this.plane][x][y];
        if (linkedList == null) {
            this.currentScene.clearGroundItem(this.plane, x, y);
            return;
        }
        let maxValue: number = -99999999;
        let mostValuable: Item = null;
        for (let item: Item = linkedList.first() as Item; item != null; item = linkedList.next() as Item) {
            {
                const definition: ItemDefinition = ItemDefinition.lookup(item.itemId);
                let value: number = definition.value;
                if (definition.stackable) {
                    value *= item.itemCount + 1;
                }
                if (value > maxValue) {
                    maxValue = value;
                    mostValuable = item;
                }
            }
        }
        linkedList.addFirst(mostValuable as Node);
        let first: any = null;
        let second: any = null;
        for (let item: Item = linkedList.first() as Item; item != null; item = linkedList.next() as Item) {
            {
                if (item.itemId !== (mostValuable as Item).itemId && first == null) {
                    first = item;
                }
                if (item.itemId !== (mostValuable as Item).itemId && item.itemId !== (first as Item).itemId && second == null) {
                    second = item;
                }
            }
        }
        const key: number = x + (y << 7) + 1610612736;
        this.currentScene.method248(
            this.getTileHeight(y * 128 + 64, x * 128 + 64, (9 as number) | 0, this.plane),
            this.plane,
            mostValuable as Renderable,
            first as Renderable,
            key,
            second as Renderable,
            2,
            y,
            x
        );
    }

    public getTileHeight(i: number, j: number, byte0: number, k: number): number {
        const l: number = j >> 7;
        const i1: number = i >> 7;
        if (l < 0 || i1 < 0 || l > 103 || i1 > 103) {
            return 0;
        }
        let j1: number = k;
        if (j1 < 3 && (this.currentSceneTileFlags[1][l][i1] & 2) === 2) {
            j1++;
        }
        const k1: number = j & 127;
        const l1: number = i & 127;
        if (byte0 !== 9) {
            this.aBoolean953 = !this.aBoolean953;
        }
        const i2: number = (this.anIntArrayArrayArray891[j1][l][i1] * (128 - k1) + this.anIntArrayArrayArray891[j1][l + 1][i1] * k1) >> 7;
        const j2: number =
            (this.anIntArrayArrayArray891[j1][l][i1 + 1] * (128 - k1) + this.anIntArrayArrayArray891[j1][l + 1][i1 + 1] * k1) >> 7;
        return (i2 * (128 - l1) + j2 * l1) >> 7;
    }

    public method125(s: string, s1: string) {
        if (this.aClass18_1158 != null) {
            this.aClass18_1158.createRasterizer();
            Rasterizer3D.lineOffsets = this.anIntArray1002;
            let j: number = 151;
            if (s != null) {
                j -= 7;
            }
            this.fontNormal.drawStringLeft(s1, 257, j, 0);
            this.fontNormal.drawStringLeft(s1, 256, j - 1, 16777215);
            j += 15;
            if (s != null) {
                this.fontNormal.drawStringLeft(s, 257, j, 0);
                this.fontNormal.drawStringLeft(s, 256, j - 1, 16777215);
            }
            this.aClass18_1158.drawGraphics(4, 4, this.gameGraphics);
            return;
        }
        if (this.imageProducer != null) {
            this.imageProducer.createRasterizer();
            Rasterizer3D.lineOffsets = this.anIntArray1003;
            let k: number = 251;
            const c: string = "\u012c";
            const byte0: number = 50;
            Rasterizer.drawFilledRectangle(
                383 - (((c => (c.charCodeAt == null ? (c as any) : c.charCodeAt(0)))(c) / 2) | 0),
                k - 5 - ((byte0 / 2) | 0),
                c.charCodeAt(0),
                byte0,
                0
            );
            Rasterizer.drawUnfilledRectangle(
                383 - (((c => (c.charCodeAt == null ? (c as any) : c.charCodeAt(0)))(c) / 2) | 0),
                k - 5 - ((byte0 / 2) | 0),
                c.charCodeAt(0),
                byte0,
                16777215
            );
            if (s != null) {
                k -= 7;
            }
            this.fontNormal.drawStringLeft(s1, 383, k, 0);
            this.fontNormal.drawStringLeft(s1, 382, k - 1, 16777215);
            k += 15;
            if (s != null) {
                this.fontNormal.drawStringLeft(s, 383, k, 0);
                this.fontNormal.drawStringLeft(s, 382, k - 1, 16777215);
            }
            this.imageProducer.drawGraphics(0, 0, this.gameGraphics);
        }
    }

    public method112(byte0: number, i: number) {
        if (byte0 !== 36) {
            this.outBuffer.putByte(6);
        }
        const class13: Widget = Widget.forId(i);
        for (let j: number = 0; j < class13.children.length; j++) {
            {
                if (class13.children[j] === -1) {
                    break;
                }
                const class13_1: Widget = Widget.forId(class13.children[j]);
                if (class13_1.type === 1) {
                    this.method112((36 as number) | 0, class13_1.id);
                }
                class13_1.anInt235 = 0;
                class13_1.anInt227 = 0;
            }
        }
    }

    public updateVarp(i: number, j: number) {
        this.packetSize += i;
        const action: number = Varp.cache[j].anInt712;
        if (action === 0) {
            return;
        }
        const config: number = this.widgetSettings[j];
        if (action === 1) {
            if (config === 1) {
                Rasterizer3D.method501(0.9);
            }
            if (config === 2) {
                Rasterizer3D.method501(0.8);
            }
            if (config === 3) {
                Rasterizer3D.method501(0.7);
            }
            if (config === 4) {
                Rasterizer3D.method501(0.6);
            }
            ItemDefinition.rgbImageCache.removeAll();
            this.aBoolean1046 = true;
        }
        if (action === 3) {
            const flag: boolean = this.musicEnabled;
            if (config === 0) {
                this.adjustMidiVolume$boolean$byte$int(this.musicEnabled, (8 as number) | 0, 0);
                this.musicEnabled = true;
            }
            if (config === 1) {
                this.adjustMidiVolume$boolean$byte$int(this.musicEnabled, (8 as number) | 0, -400);
                this.musicEnabled = true;
            }
            if (config === 2) {
                this.adjustMidiVolume$boolean$byte$int(this.musicEnabled, (8 as number) | 0, -800);
                this.musicEnabled = true;
            }
            if (config === 3) {
                this.adjustMidiVolume$boolean$byte$int(this.musicEnabled, (8 as number) | 0, -1200);
                this.musicEnabled = true;
            }
            if (config === 4) {
                this.musicEnabled = false;
            }
            if (this.musicEnabled !== flag && !Game.lowMemory) {
                if (this.musicEnabled) {
                    this.nextSong = this.currentSong;
                    this.songChanging = true;
                    this.onDemandRequester.request(2, this.nextSong);
                } else {
                    this.stopMidi();
                }
                this.previousSong = 0;
            }
        }
        if (action === 4) {
            SoundPlayer.setVolume(config);
            if (config === 0) {
                this.aBoolean1301 = true;
                this.setWaveVolume(0);
            }
            if (config === 1) {
                this.aBoolean1301 = true;
                this.setWaveVolume(-400);
            }
            if (config === 2) {
                this.aBoolean1301 = true;
                this.setWaveVolume(-800);
            }
            if (config === 3) {
                this.aBoolean1301 = true;
                this.setWaveVolume(-1200);
            }
            if (config === 4) {
                this.aBoolean1301 = false;
            }
        }
        if (action === 5) {
            this.anInt1300 = config;
        }
        if (action === 6) {
            this.anInt998 = config;
        }
        if (action === 8) {
            this.anInt1223 = config;
            this.redrawChatbox = true;
        }
        if (action === 9) {
            this.anInt955 = config;
        }
    }

    public adjustMidiVolume$boolean$byte$int(flag: boolean, byte0: number, volume: number) {
        SignLink.midiVolume = volume;
        if (flag) {
            SignLink.midi = "voladjust";
        }
    }

    public stopMidi() {
        // TODO fix music
        // SignLink.music.stop();
        SignLink.fadeMidi = 0;
        SignLink.midi = "stop";
    }

    public setWaveVolume(j: number) {
        SignLink.waveVolume = j;
    }

    public method44(flag: boolean, i: number) {
        if (!flag) {
            return;
        } else {
            Widget.method200(i);
            return;
        }
    }

    public method25() {
        this.aBoolean1277 = true;
        for (let j: number = 0; j < 7; j++) {
            {
                this.characterEditIdentityKits[j] = -1;
                for (let k: number = 0; k < IdentityKit.count; k++) {
                    {
                        if (
                            IdentityKit.cache[k].widgetDisplayed ||
                            IdentityKit.cache[k].partId !== j + (this.characterEditChangeGenger ? 0 : 7)
                        ) {
                            continue;
                        }
                        this.characterEditIdentityKits[j] = k;
                        break;
                    }
                }
            }
        }
    }

    public async method122() {
        if (this.chatboxProducingGraphicsBuffer != null) {
            return;
        } else {
            await this.method141();
            this.imageProducer = null;
            this.aClass18_1198 = null;
            this.aClass18_1199 = null;
            this.aClass18_1200 = null;
            this.flameLeftBackground = null;
            this.flameRightBackground = null;
            this.aClass18_1203 = null;
            this.aClass18_1204 = null;
            this.aClass18_1205 = null;
            this.aClass18_1206 = null;
            this.chatboxProducingGraphicsBuffer = new ProducingGraphicsBuffer(479, 96);
            this.aClass18_1157 = new ProducingGraphicsBuffer(172, 156);
            Rasterizer.resetPixels();
            this.minimapBackgroundImage.drawImage(0, 0);
            this.aClass18_1156 = new ProducingGraphicsBuffer(190, 261);
            this.aClass18_1158 = new ProducingGraphicsBuffer(512, 334);
            Rasterizer.resetPixels();
            this.aClass18_1108 = new ProducingGraphicsBuffer(496, 50);
            this.aClass18_1109 = new ProducingGraphicsBuffer(269, 37);
            this.aClass18_1110 = new ProducingGraphicsBuffer(249, 45);
            this.aBoolean1046 = true;
            this.aClass18_1158.createRasterizer();
            Rasterizer3D.lineOffsets = this.anIntArray1002;
            return;
        }
    }

    public async method141() {
        this.startedRenderingFlames = false;
        while (this.isRenderingFlames) {
            this.startedRenderingFlames = false;
            await sleep(50);
        }
        this.titleboxImage = null;
        this.titleboxButtonImage = null;
        this.titleFlameEmblem = null;
        this.anIntArray1310 = null;
        this.anIntArray1311 = null;
        this.anIntArray1312 = null;
        this.anIntArray1313 = null;
        this.anIntArray1176 = null;
        this.anIntArray1177 = null;
        this.anIntArray1084 = null;
        this.anIntArray1085 = null;
        this.anImageRGB1226 = null;
        this.anImageRGB1227 = null;
    }

    public async startUp() {
        if (Configuration.JAGGRAB_ENABLED) await this.requestArchiveCrcs();

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
        if (!Game.lowMemory) {
            this.nextSong = 0;
            // try {
            //     this.nextSong = parseInt(this.getParameter("music"));
            // } catch (ignored) {
            // }
            this.songChanging = true;
            this.onDemandRequester.request(2, this.nextSong);
            while (this.onDemandRequester.immediateRequestsCount() > 0) {
                {
                    this.method77(false);
                    try {
                        await sleep(100);
                    } catch (ignored) {}
                    if (this.onDemandRequester.requestFails > 3) {
                        this.method19("ondemand");
                        return;
                    }
                }
            }
        }

        this.drawLoadingText(65, "Requesting animations");

        let fileRequestCount: number = this.onDemandRequester.fileCount(1);
        for (let i: number = 0; i < fileRequestCount; i++) {
            this.onDemandRequester.request(1, i);
        }
        while (this.onDemandRequester.immediateRequestsCount() > 0) {
            const total: number = fileRequestCount - this.onDemandRequester.immediateRequestsCount();
            if (total > 0) {
                this.drawLoadingText(65, "Loading animations - " + (((total * 100) / fileRequestCount) | 0) + "%");
            }
            this.method77(false);
            await sleep(100);
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
                await sleep(100);
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
            this.mapscenes[i] = new IndexedImage(archiveMedia, "mapscene", i);
        }
        for (let i: number = 0; i < 70; i++) {
            this.worldMapHintIcons[i] = ImageRGB.fromArchive(archiveMedia, "mapfunction", i);
        }
        for (let i: number = 0; i < 5; i++) {
            this.hitmarks[i] = ImageRGB.fromArchive(archiveMedia, "hitmarks", i);
        }
        for (let i: number = 0; i < 6; i++) {
            this.headiconsPks[i] = ImageRGB.fromArchive(archiveMedia, "headicons_pk", i);
        }
        for (let i: number = 0; i < 9; i++) {
            this.headiconsPrayers[i] = ImageRGB.fromArchive(archiveMedia, "headicons_prayer", i);
        }
        for (let i: number = 0; i < 6; i++) {
            this.headiconsHints[i] = ImageRGB.fromArchive(archiveMedia, "headicons_hint", i);
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
                if (this.mapscenes[i] != null) {
                    this.mapscenes[i].mixPalette(red, green, blue);
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
        Game.parallelExecutor.start(this.mouseCapturer);
        // this.mouseCapturer.run();
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

    public async requestArchiveCrcs() {
        let reconnectionDelay: number = 5;
        let attempts: number = 0;
        this.archiveHashes[8] = 0;
        while (this.archiveHashes[8] === 0) {
            {
                let error: string = "Unknown problem";
                this.drawLoadingText(20, "Connecting to web server");
                const stream: Socket = await this.openJaggrabStream("crc" + (((Math.random() * 9.9999999e7) as number) | 0) + "-" + 377);
                const jaggrab: Buffer = new Buffer(Array(40).fill(0));
                await stream.read$byte_A$int$int(jaggrab.buffer, 0, 40);
                stream.close();
                for (let i: number = 0; i < 9; i++) {
                    this.archiveHashes[i] = jaggrab.getInt();
                }
                const expectedCrc: number = jaggrab.getInt();
                let calculatedCrc: number = 1234;
                for (let i: number = 0; i < 9; i++) {
                    calculatedCrc = (calculatedCrc << 1) + this.archiveHashes[i];
                }
                if (expectedCrc !== calculatedCrc) {
                    error = "Checksum problem";
                    this.archiveHashes[8] = 0;
                }
                if (this.archiveHashes[8] === 0) {
                    this.drawLoadingText(10, "Error updating archive crcs");

                    // attempts++;
                    // for (let time: number = reconnectionDelay; time > 0; time--) {
                    //     {
                    //         if (attempts >= 10) {
                    //             this.drawLoadingText(10, "Game updated - please reload page");
                    //             time = 10;
                    //         } else {
                    //             this.drawLoadingText(10, error + " - Will retry in " + time + " secs.");
                    //         }
                    //         try {
                    //             sleep(1000);
                    //         } catch (ignored) {}
                    //     }
                    // }
                    // reconnectionDelay *= 2;
                    // if (reconnectionDelay > 60) {
                    //     reconnectionDelay = 60;
                    // }
                    // this.useJaggrab = !this.useJaggrab;
                }
            }
        }
    }

    public async openJaggrabStream(request: string): Promise<Socket> {
        if (!this.useJaggrab) {
            return null;
        }
        if (this.jaggrabSocket != null) {
            try {
                this.jaggrabSocket.close();
            } catch (ignored) {}
            this.jaggrabSocket = null;
        }
        const buffer: number[] = `JAGGRAB /${request}\n\n`.split("").map(s => s.charCodeAt(0));
        this.jaggrabSocket = await this.openSocket(Configuration.JAGGRAB_PORT);
        this.jaggrabSocket.write$byte_A(buffer);
        return this.jaggrabSocket;
    }

    public async openSocket(port: number): Promise<Socket> {
        const socket = new Socket(Configuration.SERVER_ADDRESS, port);
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
        this.anIntArray1311 = Array(256).fill(0);
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
        this.anIntArray1312 = Array(256).fill(0);
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
        this.anIntArray1310 = Array(256).fill(0);
        this.anIntArray1176 = Array(32768).fill(0);
        this.anIntArray1177 = Array(32768).fill(0);
        this.method83(null, 0);
        this.anIntArray1084 = Array(32768).fill(0);
        this.anIntArray1085 = Array(32768).fill(0);
        await this.drawLoadingText(10, "Connecting to fileserver");
        if (!this.startedRenderingFlames) {
            this.shouldRenderFlames = true;
            this.startedRenderingFlames = true;
            this.run();
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
            if (!this.startedRenderingFlames) {
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

    public async run() {
        if (this.shouldRenderFlames) {
            Game.parallelExecutor.startRaw(this.processFlamesCycle, this);
            // this.processFlamesCycle();
        } else {
            super.run();
        }
    }

    async processFlamesCycle(): Promise<boolean> {
        this.isRenderingFlames = true;
        try {
            this.flameCycle++;
            this.calculateFlamePositions();
            this.calculateFlamePositions();
            this.renderFlames();
        } catch (ignored) {}
        await sleep(50);
        if (this.startedRenderingFlames) {
            return true;
        } else {
            this.isRenderingFlames = false;
            return false;
        }
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
        let abyte0: Int8Array = new Int8Array(jpgBytes);
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

    public processMenuActions(id: number) {
        if (id < 0) {
            return;
        }
        const first: number = this.firstMenuOperand[id];
        const second: number = this.secondMenuOperand[id];
        let action: number = this.menuActionTypes[id];
        const clicked: number = this.selectedMenuActions[id];
        if (action >= 2000) {
            action -= 2000;
        }
        if (this.inputType !== 0 && action !== 1016) {
            this.inputType = 0;
            this.redrawChatbox = true;
        }
        if (action === 200) {
            const player: Player = this.players[clicked];
            if (player != null) {
                this.walk(
                    false,
                    false,
                    player.pathY[0],
                    Game.localPlayer.pathY[0],
                    1,
                    1,
                    2,
                    0,
                    player.pathX[0],
                    0,
                    0,
                    Game.localPlayer.pathX[0]
                );
                this.anInt1020 = this.clickX;
                this.anInt1021 = this.clickY;
                this.crossType = 2;
                this.crossIndex = 0;
                this.outBuffer.putOpcode(245);
                this.outBuffer.putLEShortAdded(clicked);
            }
        }
        if (action === 227) {
            Game.anInt1165;
            Game.anInt1165++;
            if (Game.anInt1165 >= 62) {
                this.outBuffer.putOpcode(165);
                this.outBuffer.putByte(206);
                Game.anInt1165 = 0;
            }
            this.outBuffer.putOpcode(228);
            this.outBuffer.putLEShortDup(first);
            this.outBuffer.putShortAdded(clicked);
            this.outBuffer.putShort(second);
            this.atInventoryLoopCycle = 0;
            this.anInt1330 = second;
            this.anInt1331 = first;
            this.atInventoryInterfaceType = 2;
            if (Widget.forId(second).parentId === this.openInterfaceId) {
                this.atInventoryInterfaceType = 1;
            }
            if (Widget.forId(second).parentId === this.backDialogueId) {
                this.atInventoryInterfaceType = 3;
            }
        }
        if (action === 876) {
            const player: Player = this.players[clicked];
            if (player != null) {
                this.walk(
                    false,
                    false,
                    player.pathY[0],
                    Game.localPlayer.pathY[0],
                    1,
                    1,
                    2,
                    0,
                    player.pathX[0],
                    0,
                    0,
                    Game.localPlayer.pathX[0]
                );
                this.anInt1020 = this.clickX;
                this.anInt1021 = this.clickY;
                this.crossType = 2;
                this.crossIndex = 0;
                this.outBuffer.putOpcode(45);
                this.outBuffer.putShortAdded(clicked);
            }
        }
        if (action === 921) {
            const npc: Npc = this.npcs[clicked];
            if (npc != null) {
                this.walk(false, false, npc.pathY[0], Game.localPlayer.pathY[0], 1, 1, 2, 0, npc.pathX[0], 0, 0, Game.localPlayer.pathX[0]);
                this.anInt1020 = this.clickX;
                this.anInt1021 = this.clickY;
                this.crossType = 2;
                this.crossIndex = 0;
                this.outBuffer.putOpcode(67);
                this.outBuffer.putShortAdded(clicked);
            }
        }
        if (action === 961) {
            Game.anInt1139 = Game.anInt1139 + clicked;
            if (Game.anInt1139 >= 115) {
                this.outBuffer.putOpcode(126);
                this.outBuffer.putByte(125);
                Game.anInt1139 = 0;
            }
            this.outBuffer.putOpcode(203);
            this.outBuffer.putShortAdded(second);
            this.outBuffer.putLEShortDup(first);
            this.outBuffer.putLEShortDup(clicked);
            this.atInventoryLoopCycle = 0;
            this.anInt1330 = second;
            this.anInt1331 = first;
            this.atInventoryInterfaceType = 2;
            if (Widget.forId(second).parentId === this.openInterfaceId) {
                this.atInventoryInterfaceType = 1;
            }
            if (Widget.forId(second).parentId === this.backDialogueId) {
                this.atInventoryInterfaceType = 3;
            }
        }
        if (action === 467 && this.method80(second, 0, first, clicked)) {
            this.outBuffer.putOpcode(152);
            this.outBuffer.putLEShortDup((clicked >> 14) & 32767);
            this.outBuffer.putLEShortDup(this.anInt1148);
            this.outBuffer.putLEShortDup(this.anInt1149);
            this.outBuffer.putLEShortDup(second + this.nextTopRightTileY);
            this.outBuffer.putShort(this.anInt1147);
            this.outBuffer.putLEShortAdded(first + this.nextTopLeftTileX);
        }
        if (action === 9) {
            this.outBuffer.putOpcode(3);
            this.outBuffer.putShortAdded(clicked);
            this.outBuffer.putShort(second);
            this.outBuffer.putShort(first);
            this.atInventoryLoopCycle = 0;
            this.anInt1330 = second;
            this.anInt1331 = first;
            this.atInventoryInterfaceType = 2;
            if (Widget.forId(second).parentId === this.openInterfaceId) {
                this.atInventoryInterfaceType = 1;
            }
            if (Widget.forId(second).parentId === this.backDialogueId) {
                this.atInventoryInterfaceType = 3;
            }
        }
        if (action === 553) {
            const npc: Npc = this.npcs[clicked];
            if (npc != null) {
                this.walk(false, false, npc.pathY[0], Game.localPlayer.pathY[0], 1, 1, 2, 0, npc.pathX[0], 0, 0, Game.localPlayer.pathX[0]);
                this.anInt1020 = this.clickX;
                this.anInt1021 = this.clickY;
                this.crossType = 2;
                this.crossIndex = 0;
                this.outBuffer.putOpcode(42);
                this.outBuffer.putLEShortDup(clicked);
            }
        }
        if (action === 677) {
            const player: Player = this.players[clicked];
            if (player != null) {
                this.walk(
                    false,
                    false,
                    player.pathY[0],
                    Game.localPlayer.pathY[0],
                    1,
                    1,
                    2,
                    0,
                    player.pathX[0],
                    0,
                    0,
                    Game.localPlayer.pathX[0]
                );
                this.anInt1020 = this.clickX;
                this.anInt1021 = this.clickY;
                this.crossType = 2;
                this.crossIndex = 0;
                this.outBuffer.putOpcode(116);
                this.outBuffer.putLEShortDup(clicked);
            }
        }
        if (
            action === Actions.ADD_FRIEND ||
            action === Actions.ADD_IGNORE ||
            action === Actions.REMOVE_FRIEND ||
            action === Actions.REMOVE_IGNORE
        ) {
            const s: string = this.menuActionTexts[id];
            const l1: number = s.indexOf("@whi@");
            if (l1 !== -1) {
                const l3: number = TextUtils.nameToLong(s.substring(l1 + 5).trim());
                if (action === Actions.ADD_FRIEND) {
                    this.addFriend(l3);
                }
                if (action === Actions.ADD_IGNORE) {
                    this.addIgnore(this.anInt1154, l3);
                }
                if (action === Actions.REMOVE_FRIEND) {
                    this.removeFriend(l3);
                }
                if (action === Actions.REMOVE_IGNORE) {
                    this.removeIgnore(325, l3);
                }
            }
        }
        if (action === 930) {
            let flag: boolean = this.walk(
                false,
                false,
                second,
                Game.localPlayer.pathY[0],
                0,
                0,
                2,
                0,
                first,
                0,
                0,
                Game.localPlayer.pathX[0]
            );
            if (!flag) {
                flag = this.walk(false, false, second, Game.localPlayer.pathY[0], 1, 1, 2, 0, first, 0, 0, Game.localPlayer.pathX[0]);
            }
            this.anInt1020 = this.clickX;
            this.anInt1021 = this.clickY;
            this.crossType = 2;
            this.crossIndex = 0;
            this.outBuffer.putOpcode(54);
            this.outBuffer.putShortAdded(clicked);
            this.outBuffer.putLEShortDup(second + this.nextTopRightTileY);
            this.outBuffer.putShort(first + this.nextTopLeftTileX);
        }
        if (action === 399) {
            this.outBuffer.putOpcode(24);
            this.outBuffer.putLEShortDup(second);
            this.outBuffer.putLEShortDup(clicked);
            this.outBuffer.putShortAdded(first);
            this.atInventoryLoopCycle = 0;
            this.anInt1330 = second;
            this.anInt1331 = first;
            this.atInventoryInterfaceType = 2;
            if (Widget.forId(second).parentId === this.openInterfaceId) {
                this.atInventoryInterfaceType = 1;
            }
            if (Widget.forId(second).parentId === this.backDialogueId) {
                this.atInventoryInterfaceType = 3;
            }
        }
        if (action === 347) {
            const class50_sub1_sub4_sub3_sub1_2: Npc = this.npcs[clicked];
            if (class50_sub1_sub4_sub3_sub1_2 != null) {
                this.walk(
                    false,
                    false,
                    class50_sub1_sub4_sub3_sub1_2.pathY[0],
                    Game.localPlayer.pathY[0],
                    1,
                    1,
                    2,
                    0,
                    class50_sub1_sub4_sub3_sub1_2.pathX[0],
                    0,
                    0,
                    Game.localPlayer.pathX[0]
                );
                this.anInt1020 = this.clickX;
                this.anInt1021 = this.clickY;
                this.crossType = 2;
                this.crossIndex = 0;
                this.outBuffer.putOpcode(57);
                this.outBuffer.putShort(clicked);
                this.outBuffer.putLEShortDup(this.anInt1149);
                this.outBuffer.putLEShortAdded(this.anInt1148);
                this.outBuffer.putShort(this.anInt1147);
            }
        }
        if (action === Actions.TOGGLE_SETTING_WIDGET) {
            this.outBuffer.putOpcode(79);
            this.outBuffer.putShort(second);
            const widget: Widget = Widget.forId(second);
            if (widget.opcodes != null && widget.opcodes[0][0] === 5) {
                const setting: number = widget.opcodes[0][1];
                this.widgetSettings[setting] = 1 - this.widgetSettings[setting];
                this.updateVarp(0, setting);
                this.redrawTabArea = true;
            }
        }
        if (action === 493) {
            const class50_sub1_sub4_sub3_sub2_3: Player = this.players[clicked];
            if (class50_sub1_sub4_sub3_sub2_3 != null) {
                this.walk(
                    false,
                    false,
                    class50_sub1_sub4_sub3_sub2_3.pathY[0],
                    Game.localPlayer.pathY[0],
                    1,
                    1,
                    2,
                    0,
                    class50_sub1_sub4_sub3_sub2_3.pathX[0],
                    0,
                    0,
                    Game.localPlayer.pathX[0]
                );
                this.anInt1020 = this.clickX;
                this.anInt1021 = this.clickY;
                this.crossType = 2;
                this.crossIndex = 0;
                this.outBuffer.putOpcode(233);
                this.outBuffer.putShortAdded(clicked);
            }
        }
        if (action === 14) {
            if (!this.menuOpen) {
                this.currentScene.method279(0, this.clickX - 4, this.clickY - 4);
            } else {
                this.currentScene.method279(0, first - 4, second - 4);
            }
        }
        if (action === 903) {
            this.outBuffer.putOpcode(1);
            this.outBuffer.putShort(clicked);
            this.outBuffer.putLEShortDup(this.anInt1147);
            this.outBuffer.putLEShortDup(this.anInt1149);
            this.outBuffer.putLEShortAdded(this.anInt1148);
            this.outBuffer.putShortAdded(first);
            this.outBuffer.putShortAdded(second);
            this.atInventoryLoopCycle = 0;
            this.anInt1330 = second;
            this.anInt1331 = first;
            this.atInventoryInterfaceType = 2;
            if (Widget.forId(second).parentId === this.openInterfaceId) {
                this.atInventoryInterfaceType = 1;
            }
            if (Widget.forId(second).parentId === this.backDialogueId) {
                this.atInventoryInterfaceType = 3;
            }
        }
        if (action === 361) {
            this.outBuffer.putOpcode(36);
            this.outBuffer.putShort(this.anInt1172);
            this.outBuffer.putShortAdded(second);
            this.outBuffer.putShortAdded(first);
            this.outBuffer.putShortAdded(clicked);
            this.atInventoryLoopCycle = 0;
            this.anInt1330 = second;
            this.anInt1331 = first;
            this.atInventoryInterfaceType = 2;
            if (Widget.forId(second).parentId === this.openInterfaceId) {
                this.atInventoryInterfaceType = 1;
            }
            if (Widget.forId(second).parentId === this.backDialogueId) {
                this.atInventoryInterfaceType = 3;
            }
        }
        if (action === 118) {
            const class50_sub1_sub4_sub3_sub1_3: Npc = this.npcs[clicked];
            if (class50_sub1_sub4_sub3_sub1_3 != null) {
                this.walk(
                    false,
                    false,
                    class50_sub1_sub4_sub3_sub1_3.pathY[0],
                    Game.localPlayer.pathY[0],
                    1,
                    1,
                    2,
                    0,
                    class50_sub1_sub4_sub3_sub1_3.pathX[0],
                    0,
                    0,
                    Game.localPlayer.pathX[0]
                );
                this.anInt1020 = this.clickX;
                this.anInt1021 = this.clickY;
                this.crossType = 2;
                this.crossIndex = 0;
                Game.anInt1235 = Game.anInt1235 + clicked;
                if (Game.anInt1235 >= 143) {
                    this.outBuffer.putOpcode(157);
                    this.outBuffer.putInt(0);
                    Game.anInt1235 = 0;
                }
                this.outBuffer.putOpcode(13);
                this.outBuffer.putLEShortAdded(clicked);
            }
        }
        if (action === 376 && this.method80(second, 0, first, clicked)) {
            this.outBuffer.putOpcode(210);
            this.outBuffer.putShort(this.anInt1172);
            this.outBuffer.putLEShortDup((clicked >> 14) & 32767);
            this.outBuffer.putShortAdded(first + this.nextTopLeftTileX);
            this.outBuffer.putLEShortDup(second + this.nextTopRightTileY);
        }
        if (action === 432) {
            const class50_sub1_sub4_sub3_sub1_4: Npc = this.npcs[clicked];
            if (class50_sub1_sub4_sub3_sub1_4 != null) {
                this.walk(
                    false,
                    false,
                    class50_sub1_sub4_sub3_sub1_4.pathY[0],
                    Game.localPlayer.pathY[0],
                    1,
                    1,
                    2,
                    0,
                    class50_sub1_sub4_sub3_sub1_4.pathX[0],
                    0,
                    0,
                    Game.localPlayer.pathX[0]
                );
                this.anInt1020 = this.clickX;
                this.anInt1021 = this.clickY;
                this.crossType = 2;
                this.crossIndex = 0;
                this.outBuffer.putOpcode(8);
                this.outBuffer.putLEShortDup(clicked);
            }
        }
        if (action === Actions.CLOSE_WIDGETS) {
            this.closeWidgets();
        }
        if (action === 918) {
            const class50_sub1_sub4_sub3_sub2_4: Player = this.players[clicked];
            if (class50_sub1_sub4_sub3_sub2_4 != null) {
                this.walk(
                    false,
                    false,
                    class50_sub1_sub4_sub3_sub2_4.pathY[0],
                    Game.localPlayer.pathY[0],
                    1,
                    1,
                    2,
                    0,
                    class50_sub1_sub4_sub3_sub2_4.pathX[0],
                    0,
                    0,
                    Game.localPlayer.pathX[0]
                );
                this.anInt1020 = this.clickX;
                this.anInt1021 = this.clickY;
                this.crossType = 2;
                this.crossIndex = 0;
                this.outBuffer.putOpcode(31);
                this.outBuffer.putShort(clicked);
                this.outBuffer.putLEShortDup(this.anInt1172);
            }
        }
        if (action === 67) {
            const class50_sub1_sub4_sub3_sub1_5: Npc = this.npcs[clicked];
            if (class50_sub1_sub4_sub3_sub1_5 != null) {
                this.walk(
                    false,
                    false,
                    class50_sub1_sub4_sub3_sub1_5.pathY[0],
                    Game.localPlayer.pathY[0],
                    1,
                    1,
                    2,
                    0,
                    class50_sub1_sub4_sub3_sub1_5.pathX[0],
                    0,
                    0,
                    Game.localPlayer.pathX[0]
                );
                this.anInt1020 = this.clickX;
                this.anInt1021 = this.clickY;
                this.crossType = 2;
                this.crossIndex = 0;
                this.outBuffer.putOpcode(104);
                this.outBuffer.putShortAdded(this.anInt1172);
                this.outBuffer.putLEShortDup(clicked);
            }
        }
        if (action === 68) {
            let flag1: boolean = this.walk(
                false,
                false,
                second,
                Game.localPlayer.pathY[0],
                0,
                0,
                2,
                0,
                first,
                0,
                0,
                Game.localPlayer.pathX[0]
            );
            if (!flag1) {
                flag1 = this.walk(false, false, second, Game.localPlayer.pathY[0], 1, 1, 2, 0, first, 0, 0, Game.localPlayer.pathX[0]);
            }
            this.anInt1020 = this.clickX;
            this.anInt1021 = this.clickY;
            this.crossType = 2;
            this.crossIndex = 0;
            this.outBuffer.putOpcode(77);
            this.outBuffer.putShortAdded(first + this.nextTopLeftTileX);
            this.outBuffer.putShort(second + this.nextTopRightTileY);
            this.outBuffer.putLEShortAdded(clicked);
        }
        if (action === 684) {
            let flag2: boolean = this.walk(
                false,
                false,
                second,
                Game.localPlayer.pathY[0],
                0,
                0,
                2,
                0,
                first,
                0,
                0,
                Game.localPlayer.pathX[0]
            );
            if (!flag2) {
                flag2 = this.walk(false, false, second, Game.localPlayer.pathY[0], 1, 1, 2, 0, first, 0, 0, Game.localPlayer.pathX[0]);
            }
            this.anInt1020 = this.clickX;
            this.anInt1021 = this.clickY;
            this.crossType = 2;
            this.crossIndex = 0;
            if ((clicked & 3) === 0) {
                Game.anInt1052;
            }
            Game.anInt1052++;
            if (Game.anInt1052 >= 84) {
                this.outBuffer.putOpcode(222);
                this.outBuffer.putTriByte(11257922);
                Game.anInt1052 = 0;
            }
            this.outBuffer.putOpcode(71);
            this.outBuffer.putLEShortAdded(clicked);
            this.outBuffer.putLEShortAdded(first + this.nextTopLeftTileX);
            this.outBuffer.putShortAdded(second + this.nextTopRightTileY);
        }
        if (action === Actions.ACCEPT_TRADE || action === Actions.ACCEPT_CHALLENGE) {
            let name: string = this.menuActionTexts[id];
            const colour: number = name.indexOf("@whi@");
            if (colour !== -1) {
                name = name.substring(colour + 5).trim();
                const username: string = TextUtils.formatName(TextUtils.longToName(TextUtils.nameToLong(name)));
                let found: boolean = false;
                for (let index: number = 0; index < this.localPlayerCount; index++) {
                    {
                        const player: Player = this.players[this.playerList[index]];
                        if (
                            player == null ||
                            player.playerName == null ||
                            !/* equalsIgnoreCase */ ((o1, o2) => o1.toUpperCase() === (o2 === null ? o2 : o2.toUpperCase()))(
                                player.playerName,
                                username
                            )
                        ) {
                            continue;
                        }
                        this.walk(
                            false,
                            false,
                            player.pathY[0],
                            Game.localPlayer.pathY[0],
                            1,
                            1,
                            2,
                            0,
                            player.pathX[0],
                            0,
                            0,
                            Game.localPlayer.pathX[0]
                        );
                        if (action === Actions.ACCEPT_TRADE) {
                            this.outBuffer.putOpcode(116);
                            this.outBuffer.putLEShortDup(this.playerList[index]);
                        }
                        if (action === Actions.ACCEPT_CHALLENGE) {
                            this.outBuffer.putOpcode(245);
                            this.outBuffer.putLEShortAdded(this.playerList[index]);
                        }
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    this.addChatMessage("", "Unable to find " + username, 0);
                }
            }
        }
        if (action === 225) {
            this.outBuffer.putOpcode(177);
            this.outBuffer.putShortAdded(first);
            this.outBuffer.putLEShortDup(clicked);
            this.outBuffer.putLEShortDup(second);
            this.atInventoryLoopCycle = 0;
            this.anInt1330 = second;
            this.anInt1331 = first;
            this.atInventoryInterfaceType = 2;
            if (Widget.forId(second).parentId === this.openInterfaceId) {
                this.atInventoryInterfaceType = 1;
            }
            if (Widget.forId(second).parentId === this.backDialogueId) {
                this.atInventoryInterfaceType = 3;
            }
        }
        if (action === Actions.USABLE_WIDGET) {
            const widget: Widget = Widget.forId(second);
            this.widgetSelected = 1;
            this.anInt1172 = second;
            this.anInt1173 = widget.optionAttributes;
            this.itemSelected = 0;
            this.redrawTabArea = true;
            let prefix: string = widget.optionCircumfix;
            if (prefix.indexOf(" ") !== -1) {
                prefix = prefix.substring(0, prefix.indexOf(" "));
            }
            let suffix: string = widget.optionCircumfix;
            if (suffix.indexOf(" ") !== -1) {
                suffix = suffix.substring(suffix.indexOf(" ") + 1);
            }
            this.selectedWidgetName = prefix + " " + widget.optionText + " " + suffix;
            if (this.anInt1173 === 16) {
                this.redrawTabArea = true;
                this.anInt1285 = 3;
                this.aBoolean950 = true;
            }
            return;
        }
        if (action === 891) {
            this.outBuffer.putOpcode(4);
            this.outBuffer.putLEShortDup(first);
            this.outBuffer.putLEShortAdded(clicked);
            this.outBuffer.putLEShortAdded(second);
            this.atInventoryLoopCycle = 0;
            this.anInt1330 = second;
            this.anInt1331 = first;
            this.atInventoryInterfaceType = 2;
            if (Widget.forId(second).parentId === this.openInterfaceId) {
                this.atInventoryInterfaceType = 1;
            }
            if (Widget.forId(second).parentId === this.backDialogueId) {
                this.atInventoryInterfaceType = 3;
            }
        }
        if (action === 894) {
            this.outBuffer.putOpcode(158);
            this.outBuffer.putLEShortAdded(first);
            this.outBuffer.putLEShortAdded(clicked);
            this.outBuffer.putLEShortDup(second);
            this.atInventoryLoopCycle = 0;
            this.anInt1330 = second;
            this.anInt1331 = first;
            this.atInventoryInterfaceType = 2;
            if (Widget.forId(second).parentId === this.openInterfaceId) {
                this.atInventoryInterfaceType = 1;
            }
            if (Widget.forId(second).parentId === this.backDialogueId) {
                this.atInventoryInterfaceType = 3;
            }
        }
        if (action === 1280) {
            this.method80(second, 0, first, clicked);
            this.outBuffer.putOpcode(55);
            this.outBuffer.putLEShortDup((clicked >> 14) & 32767);
            this.outBuffer.putLEShortDup(second + this.nextTopRightTileY);
            this.outBuffer.putShort(first + this.nextTopLeftTileX);
        }
        if (action === 35) {
            this.method80(second, 0, first, clicked);
            this.outBuffer.putOpcode(181);
            this.outBuffer.putShortAdded(first + this.nextTopLeftTileX);
            this.outBuffer.putLEShortDup(second + this.nextTopRightTileY);
            this.outBuffer.putLEShortDup((clicked >> 14) & 32767);
        }
        if (action === 888) {
            this.method80(second, 0, first, clicked);
            this.outBuffer.putOpcode(50);
            this.outBuffer.putShortAdded(second + this.nextTopRightTileY);
            this.outBuffer.putLEShortDup((clicked >> 14) & 32767);
            this.outBuffer.putLEShortAdded(first + this.nextTopLeftTileX);
        }
        if (action === 324) {
            this.outBuffer.putOpcode(161);
            this.outBuffer.putLEShortAdded(first);
            this.outBuffer.putLEShortAdded(clicked);
            this.outBuffer.putLEShortDup(second);
            this.atInventoryLoopCycle = 0;
            this.anInt1330 = second;
            this.anInt1331 = first;
            this.atInventoryInterfaceType = 2;
            if (Widget.forId(second).parentId === this.openInterfaceId) {
                this.atInventoryInterfaceType = 1;
            }
            if (Widget.forId(second).parentId === this.backDialogueId) {
                this.atInventoryInterfaceType = 3;
            }
        }
        if (action === Actions.EXAMINE_ITEM) {
            const definition: ItemDefinition = ItemDefinition.lookup(clicked);
            const widget: Widget = Widget.forId(second);
            let description: string;
            if (widget != null && widget.itemAmounts[first] >= 100000) {
                description = widget.itemAmounts[first] + " x " + definition.name;
            } else if (definition.description != null) {
                description = new String(definition.description) as string;
            } else {
                description = "It's a " + definition.name + ".";
            }
            this.addChatMessage("", description, 0);
        }
        if (action === 352) {
            const class13_2: Widget = Widget.forId(second);
            let flag7: boolean = true;
            if (class13_2.contentType > 0) {
                flag7 = this.handleWidgetDynamicAction(class13_2);
            }
            if (flag7) {
                this.outBuffer.putOpcode(79);
                this.outBuffer.putShort(second);
            }
        }
        if (action === 1412) {
            const k1: number = (clicked >> 14) & 32767;
            const class47: GameObjectDefinition = GameObjectDefinition.getDefinition(k1);
            let s9: string;
            if (class47.description != null) {
                s9 = new String(class47.description) as string;
            } else {
                s9 = "It's a " + class47.name + ".";
            }
            this.addChatMessage("", s9, 0);
        }
        if (action === 575 && !this.aBoolean1239) {
            this.outBuffer.putOpcode(226);
            this.outBuffer.putShort(second);
            this.aBoolean1239 = true;
        }
        if (action === 892) {
            this.method80(second, 0, first, clicked);
            this.outBuffer.putOpcode(136);
            this.outBuffer.putShort(first + this.nextTopLeftTileX);
            this.outBuffer.putLEShortDup(second + this.nextTopRightTileY);
            this.outBuffer.putShort((clicked >> 14) & 32767);
        }
        if (action === 270) {
            let flag3: boolean = this.walk(
                false,
                false,
                second,
                Game.localPlayer.pathY[0],
                0,
                0,
                2,
                0,
                first,
                0,
                0,
                Game.localPlayer.pathX[0]
            );
            if (!flag3) {
                flag3 = this.walk(false, false, second, Game.localPlayer.pathY[0], 1, 1, 2, 0, first, 0, 0, Game.localPlayer.pathX[0]);
            }
            this.anInt1020 = this.clickX;
            this.anInt1021 = this.clickY;
            this.crossType = 2;
            this.crossIndex = 0;
            this.outBuffer.putOpcode(230);
            this.outBuffer.putLEShortDup(clicked);
            this.outBuffer.putShortAdded(first + this.nextTopLeftTileX);
            this.outBuffer.putShort(second + this.nextTopRightTileY);
        }
        if (action === 596) {
            const class50_sub1_sub4_sub3_sub2_5: Player = this.players[clicked];
            if (class50_sub1_sub4_sub3_sub2_5 != null) {
                this.walk(
                    false,
                    false,
                    class50_sub1_sub4_sub3_sub2_5.pathY[0],
                    Game.localPlayer.pathY[0],
                    1,
                    1,
                    2,
                    0,
                    class50_sub1_sub4_sub3_sub2_5.pathX[0],
                    0,
                    0,
                    Game.localPlayer.pathX[0]
                );
                this.anInt1020 = this.clickX;
                this.anInt1021 = this.clickY;
                this.crossType = 2;
                this.crossIndex = 0;
                this.outBuffer.putOpcode(143);
                this.outBuffer.putLEShortDup(this.anInt1149);
                this.outBuffer.putLEShortAdded(this.anInt1147);
                this.outBuffer.putShort(this.anInt1148);
                this.outBuffer.putShortAdded(clicked);
            }
        }
        if (action === 100) {
            let flag4: boolean = this.walk(
                false,
                false,
                second,
                Game.localPlayer.pathY[0],
                0,
                0,
                2,
                0,
                first,
                0,
                0,
                Game.localPlayer.pathX[0]
            );
            if (!flag4) {
                flag4 = this.walk(false, false, second, Game.localPlayer.pathY[0], 1, 1, 2, 0, first, 0, 0, Game.localPlayer.pathX[0]);
            }
            this.anInt1020 = this.clickX;
            this.anInt1021 = this.clickY;
            this.crossType = 2;
            this.crossIndex = 0;
            this.outBuffer.putOpcode(211);
            this.outBuffer.putLEShortAdded(this.anInt1147);
            this.outBuffer.putShortAdded(this.anInt1149);
            this.outBuffer.putLEShortAdded(second + this.nextTopRightTileY);
            this.outBuffer.putLEShortAdded(first + this.nextTopLeftTileX);
            this.outBuffer.putLEShortDup(this.anInt1148);
            this.outBuffer.putLEShortDup(clicked);
        }
        if (action === 1668) {
            const class50_sub1_sub4_sub3_sub1_6: Npc = this.npcs[clicked];
            if (class50_sub1_sub4_sub3_sub1_6 != null) {
                let class37: ActorDefinition = class50_sub1_sub4_sub3_sub1_6.npcDefinition;
                if (class37.childrenIds != null) {
                    class37 = class37.getChildDefinition();
                }
                if (class37 != null) {
                    let s10: string;
                    if (class37.description != null) {
                        s10 = new String(class37.description) as string;
                    } else {
                        s10 = "It's a " + class37.name + ".";
                    }
                    this.addChatMessage("", s10, 0);
                }
            }
        }
        if (action === 26) {
            let flag5: boolean = this.walk(
                false,
                false,
                second,
                Game.localPlayer.pathY[0],
                0,
                0,
                2,
                0,
                first,
                0,
                0,
                Game.localPlayer.pathX[0]
            );
            if (!flag5) {
                flag5 = this.walk(false, false, second, Game.localPlayer.pathY[0], 1, 1, 2, 0, first, 0, 0, Game.localPlayer.pathX[0]);
            }
            this.anInt1020 = this.clickX;
            this.anInt1021 = this.clickY;
            this.crossType = 2;
            this.crossIndex = 0;
            Game.anInt1100;
            Game.anInt1100++;
            if (Game.anInt1100 >= 120) {
                this.outBuffer.putOpcode(95);
                this.outBuffer.putInt(0);
                Game.anInt1100 = 0;
            }
            this.outBuffer.putOpcode(100);
            this.outBuffer.putShort(first + this.nextTopLeftTileX);
            this.outBuffer.putShortAdded(second + this.nextTopRightTileY);
            this.outBuffer.putLEShortAdded(clicked);
        }
        if (action === 444) {
            this.outBuffer.putOpcode(91);
            this.outBuffer.putLEShortDup(clicked);
            this.outBuffer.putLEShortAdded(first);
            this.outBuffer.putShort(second);
            this.atInventoryLoopCycle = 0;
            this.anInt1330 = second;
            this.anInt1331 = first;
            this.atInventoryInterfaceType = 2;
            if (Widget.forId(second).parentId === this.openInterfaceId) {
                this.atInventoryInterfaceType = 1;
            }
            if (Widget.forId(second).parentId === this.backDialogueId) {
                this.atInventoryInterfaceType = 3;
            }
        }
        if (action === 507) {
            const string: string = this.menuActionTexts[id];
            const i_389_: number = string.indexOf("@whi@");
            if (i_389_ !== -1) {
                if (this.openInterfaceId === -1) {
                    this.closeWidgets();
                    this.reportedName = string.substring(i_389_ + 5).trim();
                    this.reportMutePlayer = false;
                    this.reportAbuseInterfaceID = this.openInterfaceId = Widget.anInt246;
                } else {
                    this.addChatMessage("", "Please close the interface you have open before using 'report abuse'", 0);
                }
            }
        }
        if (action === 389) {
            this.method80(second, 0, first, clicked);
            this.outBuffer.putOpcode(241);
            this.outBuffer.putShort((clicked >> 14) & 32767);
            this.outBuffer.putShort(first + this.nextTopLeftTileX);
            this.outBuffer.putShortAdded(second + this.nextTopRightTileY);
        }
        if (action === 564) {
            this.outBuffer.putOpcode(231);
            this.outBuffer.putLEShortAdded(second);
            this.outBuffer.putLEShortDup(first);
            this.outBuffer.putShort(clicked);
            this.atInventoryLoopCycle = 0;
            this.anInt1330 = second;
            this.anInt1331 = first;
            this.atInventoryInterfaceType = 2;
            if (Widget.forId(second).parentId === this.openInterfaceId) {
                this.atInventoryInterfaceType = 1;
            }
            if (Widget.forId(second).parentId === this.backDialogueId) {
                this.atInventoryInterfaceType = 3;
            }
        }
        if (action === 984) {
            const s3: string = this.menuActionTexts[id];
            const l2: number = s3.indexOf("@whi@");
            if (l2 !== -1) {
                const l4: number = TextUtils.nameToLong(s3.substring(l2 + 5).trim());
                let k3: number = -1;
                for (let i4: number = 0; i4 < this.friendsCount; i4++) {
                    {
                        if (this.friends[i4] !== l4) {
                            continue;
                        }
                        k3 = i4;
                        break;
                    }
                }
                if (k3 !== -1 && this.friendWorlds[k3] > 0) {
                    this.redrawChatbox = true;
                    this.inputType = 0;
                    this.messagePromptRaised = true;
                    this.chatMessage = "";
                    this.friendsListAction = 3;
                    this.aLong1141 = this.friends[k3];
                    this.chatboxInputMessage = "Enter message to send to " + this.friendUsernames[k3];
                }
            }
        }
        if (action === Actions.RESET_SETTING_WIDGET) {
            this.outBuffer.putOpcode(79);
            this.outBuffer.putShort(second);
            const widget: Widget = Widget.forId(second);
            if (widget.opcodes != null && widget.opcodes[0][0] === 5) {
                const operand: number = widget.opcodes[0][1];
                if (this.widgetSettings[operand] !== widget.conditionValues[0]) {
                    this.widgetSettings[operand] = widget.conditionValues[0];
                    this.updateVarp(0, operand);
                    this.redrawTabArea = true;
                }
            }
        }
        if (action === 318) {
            const class50_sub1_sub4_sub3_sub1_7: Npc = this.npcs[clicked];
            if (class50_sub1_sub4_sub3_sub1_7 != null) {
                this.walk(
                    false,
                    false,
                    class50_sub1_sub4_sub3_sub1_7.pathY[0],
                    Game.localPlayer.pathY[0],
                    1,
                    1,
                    2,
                    0,
                    class50_sub1_sub4_sub3_sub1_7.pathX[0],
                    0,
                    0,
                    Game.localPlayer.pathX[0]
                );
                this.anInt1020 = this.clickX;
                this.anInt1021 = this.clickY;
                this.crossType = 2;
                this.crossIndex = 0;
                this.outBuffer.putOpcode(112);
                this.outBuffer.putLEShortDup(clicked);
            }
        }
        if (action === 199) {
            let flag6: boolean = this.walk(
                false,
                false,
                second,
                Game.localPlayer.pathY[0],
                0,
                0,
                2,
                0,
                first,
                0,
                0,
                Game.localPlayer.pathX[0]
            );
            if (!flag6) {
                flag6 = this.walk(false, false, second, Game.localPlayer.pathY[0], 1, 1, 2, 0, first, 0, 0, Game.localPlayer.pathX[0]);
            }
            this.anInt1020 = this.clickX;
            this.anInt1021 = this.clickY;
            this.crossType = 2;
            this.crossIndex = 0;
            this.outBuffer.putOpcode(83);
            this.outBuffer.putLEShortDup(clicked);
            this.outBuffer.putShort(second + this.nextTopRightTileY);
            this.outBuffer.putLEShortDup(this.anInt1172);
            this.outBuffer.putLEShortAdded(first + this.nextTopLeftTileX);
        }
        if (action === 55) {
            this.method44(Game.aBoolean1190, this.dialogueId);
            this.dialogueId = -1;
            this.redrawChatbox = true;
        }
        if (action === 52) {
            this.itemSelected = 1;
            this.anInt1147 = first;
            this.anInt1148 = second;
            this.anInt1149 = clicked;
            this.aString1150 = /* valueOf */ new String(ItemDefinition.lookup(clicked).name).toString();
            this.widgetSelected = 0;
            this.redrawTabArea = true;
            return;
        }
        if (action === 1564) {
            const class16_1: ItemDefinition = ItemDefinition.lookup(clicked);
            let s6: string;
            if (class16_1.description != null) {
                s6 = new String(class16_1.description) as string;
            } else {
                s6 = "It's a " + class16_1.name + ".";
            }
            this.addChatMessage("", s6, 0);
        }
        if (action === 408) {
            const class50_sub1_sub4_sub3_sub2_6: Player = this.players[clicked];
            if (class50_sub1_sub4_sub3_sub2_6 != null) {
                this.walk(
                    false,
                    false,
                    class50_sub1_sub4_sub3_sub2_6.pathY[0],
                    Game.localPlayer.pathY[0],
                    1,
                    1,
                    2,
                    0,
                    class50_sub1_sub4_sub3_sub2_6.pathX[0],
                    0,
                    0,
                    Game.localPlayer.pathX[0]
                );
                this.anInt1020 = this.clickX;
                this.anInt1021 = this.clickY;
                this.crossType = 2;
                this.crossIndex = 0;
                this.outBuffer.putOpcode(194);
                this.outBuffer.putLEShortDup(clicked);
            }
        }
        this.itemSelected = 0;
        this.widgetSelected = 0;
        this.redrawTabArea = true;
    }

    public handleWidgetDynamicAction(widget: Widget): boolean {
        const type: number = widget.contentType;
        if (this.friendListStatus === 2) {
            if (type === 201) {
                this.redrawChatbox = true;
                this.inputType = 0;
                this.messagePromptRaised = true;
                this.chatMessage = "";
                this.friendsListAction = 1;
                this.chatboxInputMessage = "Enter name of friend to add to list";
            }
            if (type === 202) {
                this.redrawChatbox = true;
                this.inputType = 0;
                this.messagePromptRaised = true;
                this.chatMessage = "";
                this.friendsListAction = 2;
                this.chatboxInputMessage = "Enter name of friend to delete from list";
            }
        }
        if (type === 205) {
            this.anInt873 = 250;
            return true;
        }
        if (type === 501) {
            this.redrawChatbox = true;
            this.inputType = 0;
            this.messagePromptRaised = true;
            this.chatMessage = "";
            this.friendsListAction = 4;
            this.chatboxInputMessage = "Enter name of player to add to list";
        }
        if (type === 502) {
            this.redrawChatbox = true;
            this.inputType = 0;
            this.messagePromptRaised = true;
            this.chatMessage = "";
            this.friendsListAction = 5;
            this.chatboxInputMessage = "Enter name of player to delete from list";
        }
        if (type >= 300 && type <= 313) {
            const k: number = ((type - 300) / 2) | 0;
            const j1: number = type & 1;
            let i2: number = this.characterEditIdentityKits[k];
            if (i2 !== -1) {
                do {
                    {
                        if (j1 === 0 && --i2 < 0) {
                            i2 = IdentityKit.count - 1;
                        }
                        if (j1 === 1 && ++i2 >= IdentityKit.count) {
                            i2 = 0;
                        }
                    }
                } while (
                    IdentityKit.cache[i2].widgetDisplayed ||
                    IdentityKit.cache[i2].partId !== k + (this.characterEditChangeGenger ? 0 : 7)
                );
                this.characterEditIdentityKits[k] = i2;
                this.aBoolean1277 = true;
            }
        }
        if (type >= 314 && type <= 323) {
            const l: number = ((type - 314) / 2) | 0;
            const k1: number = type & 1;
            let j2: number = this.characterEditColors[l];
            if (k1 === 0 && --j2 < 0) {
                j2 = Game.playerColours[l].length - 1;
            }
            if (k1 === 1 && ++j2 >= Game.playerColours[l].length) {
                j2 = 0;
            }
            this.characterEditColors[l] = j2;
            this.aBoolean1277 = true;
        }
        if (type === 324 && !this.characterEditChangeGenger) {
            this.characterEditChangeGenger = true;
            this.method25();
        }
        if (type === 325 && this.characterEditChangeGenger) {
            this.characterEditChangeGenger = false;
            this.method25();
        }
        if (type === 326) {
            this.outBuffer.putOpcode(163);
            this.outBuffer.putByte(this.characterEditChangeGenger ? 0 : 1);
            for (let i1: number = 0; i1 < 7; i1++) {
                this.outBuffer.putByte(this.characterEditIdentityKits[i1]);
            }
            for (let l1: number = 0; l1 < 5; l1++) {
                this.outBuffer.putByte(this.characterEditColors[l1]);
            }
            return true;
        }
        if (type === 620) {
            this.reportMutePlayer = !this.reportMutePlayer;
        }
        if (type >= 601 && type <= 613) {
            this.closeWidgets();
            if (this.reportedName.length > 0) {
                this.outBuffer.putOpcode(184);
                this.outBuffer.putLong(TextUtils.nameToLong(this.reportedName));
                this.outBuffer.putByte(type - 601);
                this.outBuffer.putByte(this.reportMutePlayer ? 1 : 0);
            }
        }
        return false;
    }

    public closeWidgets() {
        this.outBuffer.putOpcode(110);
        if (this.anInt1089 !== -1) {
            this.method44(Game.aBoolean1190, this.anInt1089);
            this.anInt1089 = -1;
            this.redrawTabArea = true;
            this.aBoolean1239 = false;
            this.aBoolean950 = true;
        }
        if (this.backDialogueId !== -1) {
            this.method44(Game.aBoolean1190, this.backDialogueId);
            this.backDialogueId = -1;
            this.redrawChatbox = true;
            this.aBoolean1239 = false;
        }
        if (this.anInt1053 !== -1) {
            this.method44(Game.aBoolean1190, this.anInt1053);
            this.anInt1053 = -1;
            this.aBoolean1046 = true;
        }
        if (this.anInt960 !== -1) {
            this.method44(Game.aBoolean1190, this.anInt960);
            this.anInt960 = -1;
        }
        if (this.openInterfaceId !== -1) {
            this.method44(Game.aBoolean1190, this.openInterfaceId);
            this.openInterfaceId = -1;
        }
    }

    public method80(dstY: number, j: number, dstX: number, l: number): boolean {
        const i1: number = (l >> 14) & 32767;
        const j1: number = this.currentScene.method271(this.plane, dstX, dstY, l);
        if (j1 === -1) {
            return false;
        }
        const objectType: number = j1 & 31;
        const l1: number = (j1 >> 6) & 3;
        if (objectType === 10 || objectType === 11 || objectType === 22) {
            const class47: GameObjectDefinition = GameObjectDefinition.getDefinition(i1);
            let i2: number;
            let j2: number;
            if (l1 === 0 || l1 === 2) {
                i2 = class47.sizeX;
                j2 = class47.sizeY;
            } else {
                i2 = class47.sizeY;
                j2 = class47.sizeX;
            }
            let k2: number = class47.anInt764;
            if (l1 !== 0) {
                k2 = ((k2 << l1) & 15) + (k2 >> (4 - l1));
            }
            this.walk(true, false, dstY, Game.localPlayer.pathY[0], i2, j2, 2, 0, dstX, k2, 0, Game.localPlayer.pathX[0]);
        } else {
            this.walk(true, false, dstY, Game.localPlayer.pathY[0], 0, 0, 2, objectType + 1, dstX, 0, l1, Game.localPlayer.pathX[0]);
        }
        this.anInt1020 = this.clickX;
        this.anInt1021 = this.clickY;
        this.crossType = 2;
        this.crossIndex = 0;
        this.packetSize += j;
        return true;
    }

    public removeFriend(l: number) {
        try {
            if (l === 0) {
                return;
            }
            for (let j: number = 0; j < this.friendsCount; j++) {
                {
                    if (this.friends[j] !== l) {
                        continue;
                    }
                    this.friendsCount--;
                    this.redrawTabArea = true;
                    for (let k: number = j; k < this.friendsCount; k++) {
                        {
                            this.friendUsernames[k] = this.friendUsernames[k + 1];
                            this.friendWorlds[k] = this.friendWorlds[k + 1];
                            this.friends[k] = this.friends[k + 1];
                        }
                    }
                    this.outBuffer.putOpcode(141);
                    this.outBuffer.putLong(l);
                    break;
                }
            }
        } catch (runtimeexception) {
            SignLink.reportError("38799, " + l + ", " + runtimeexception.toString());
        }
        throw Error(); // TODO check why???
    }

    public removeIgnore(i: number, l: number) {
        try {
            if (l === 0) {
                return;
            }
            for (let j: number = 0; j < this.ignoresCount; j++) {
                {
                    if (this.ignores[j] !== l) {
                        continue;
                    }
                    this.ignoresCount--;
                    this.redrawTabArea = true;
                    for (let k: number = j; k < this.ignoresCount; k++) {
                        this.ignores[k] = this.ignores[k + 1];
                    }
                    this.outBuffer.putOpcode(160);
                    this.outBuffer.putLong(l);
                    break;
                }
            }
            i = (42 / i) | 0;
            return;
        } catch (runtimeexception) {
            SignLink.reportError("45745, " + i + ", " + l + ", " + runtimeexception.toString());
        }
        throw Error(); // TODO check why???
    }

    public addFriend(name: number) {
        try {
            if (name === 0) {
                return;
            }
            if (this.friendsCount >= 100 && this.playerMembers !== 1) {
                this.addChatMessage("", "Your friendlist is full. Max of 100 for free users, and 200 for members", 0);
                return;
            }
            if (this.friendsCount >= 200) {
                this.addChatMessage("", "Your friendlist is full. Max of 100 for free users, and 200 for members", 0);
                return;
            }
            const username: string = TextUtils.formatName(TextUtils.longToName(name));
            for (let index: number = 0; index < this.friendsCount; index++) {
                if (this.friends[index] === name) {
                    this.addChatMessage("", username + " is already on your friend list", 0);
                    return;
                }
            }
            for (let index: number = 0; index < this.ignoresCount; index++) {
                if (this.ignores[index] === name) {
                    this.addChatMessage("", "Please remove " + username + " from your ignore list first", 0);
                    return;
                }
            }
            if (
                /* equals */ ((o1: any, o2: any) => {
                    if (o1 && o1.equals) {
                        return o1.equals(o2);
                    } else {
                        return o1 === o2;
                    }
                })(username, Game.localPlayer.playerName) as any
            ) {
                return;
            }
            this.friendUsernames[this.friendsCount] = username;
            this.friends[this.friendsCount] = name;
            this.friendWorlds[this.friendsCount] = 0;
            this.friendsCount++;
            this.redrawTabArea = true;
            this.outBuffer.putOpcode(120);
            this.outBuffer.putLong(name);
            return;
        } catch (runtimeexception) {
            SignLink.reportError("94629, " + name + ", , " + runtimeexception.toString());
        }
        throw Error();
    }

    public addIgnore(i: number, name: number) {
        try {
            if (name === 0) {
                return;
            }
            if (this.ignoresCount >= 100) {
                this.addChatMessage("", "Your ignore list is full. Max of 100 hit", 0);
                return;
            }
            const username: string = TextUtils.formatName(TextUtils.longToName(name));
            for (let index: number = 0; index < this.ignoresCount; index++) {
                if (this.ignores[index] === name) {
                    this.addChatMessage("", username + " is already on your ignore list", 0);
                    return;
                }
            }
            for (let index: number = 0; index < this.friendsCount; index++) {
                if (this.friends[index] === name) {
                    this.addChatMessage("", "Please remove " + username + " from your friend list first", 0);
                    return;
                }
            }
            this.ignores[this.ignoresCount++] = name;
            this.redrawTabArea = true;
            this.outBuffer.putOpcode(217);
            this.outBuffer.putLong(name);
            return;
        } catch (runtimeexception) {
            SignLink.reportError("27939, " + i + ", " + name + ", " + runtimeexception.toString());
        }
        throw Error();
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

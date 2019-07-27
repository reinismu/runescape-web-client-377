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

export class Game extends GameShell {
    public static pulseCycle: number = 0;

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

    constructor(canvas: HTMLCanvasElement) {
        super(canvas);
    }

    public async startUp() {
        await this.initStores();
        this.initArchives();
        this.initTypeFaces();
        await this.initializeApplication(765, 503);
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
        this.titleboxButtonImage = new IndexedImage(
            this.titleArchive,
            "titlebutton",
            0
        );
        this.titleFlameEmblem = (s => {
            const a = [];
            while (s-- > 0) {
                a.push(null);
            }
            return a;
        })(12);
        for (let i: number = 0; i < 12; i++) {
            this.titleFlameEmblem[i] = new IndexedImage(
                this.titleArchive,
                "runes",
                i
            );
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
            await this.run();
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
            ((c => (c.charCodeAt == null ? (c as any) : c.charCodeAt(0)))(c) /
                2) |
                0,
            (((c => (c.charCodeAt == null ? (c as any) : c.charCodeAt(0)))(c1) /
                2) |
                0) -
                26 -
                byte0,
            16777215
        );
        const j: number =
            (((c => (c.charCodeAt == null ? (c as any) : c.charCodeAt(0)))(c1) /
                2) |
                0) -
            18 -
            byte0;
        Rasterizer.drawUnfilledRectangle(
            (((c => (c.charCodeAt == null ? (c as any) : c.charCodeAt(0)))(c) /
                2) |
                0) -
                152,
            j,
            304,
            34,
            9179409
        );
        Rasterizer.drawUnfilledRectangle(
            (((c => (c.charCodeAt == null ? (c as any) : c.charCodeAt(0)))(c) /
                2) |
                0) -
                151,
            j + 1,
            302,
            32,
            0
        );
        Rasterizer.drawFilledRectangle(
            (((c => (c.charCodeAt == null ? (c as any) : c.charCodeAt(0)))(c) /
                2) |
                0) -
                150,
            j + 2,
            i * 3,
            30,
            9179409
        );
        Rasterizer.drawFilledRectangle(
            (((c => (c.charCodeAt == null ? (c as any) : c.charCodeAt(0)))(c) /
                2) |
                0) -
                150 +
                i * 3,
            j + 2,
            300 - i * 3,
            30,
            0
        );
        this.fontBold.drawStringLeft(
            s,
            ((c => (c.charCodeAt == null ? (c as any) : c.charCodeAt(0)))(c) /
                2) |
                0,
            (((c => (c.charCodeAt == null ? (c as any) : c.charCodeAt(0)))(c1) /
                2) |
                0) +
                5 -
                byte0,
            16777215
        );
        this.aClass18_1200.drawGraphics(202, 171, this.gameGraphics);
        if (this.aBoolean1046) {
            this.aBoolean1046 = false;
            if (!this.aBoolean1243) {
                this.flameLeftBackground.drawGraphics(0, 0, this.gameGraphics);
                this.flameRightBackground.drawGraphics(
                    637,
                    0,
                    this.gameGraphics
                );
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
                const i1: number =
                    (((Math.random() * 128.0 * j) as number) as number) | 0;
                this.anIntArray1176[i1] =
                    ((Math.random() * 256.0) as number) | 0;
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
                    for (
                        let l2: number = 0;
                        l2 < class50_sub1_sub1_sub3.width;
                        l2++
                    ) {
                        if (class50_sub1_sub1_sub3.pixels[l1++] !== 0) {
                            const i3: number =
                                l2 + 16 + class50_sub1_sub1_sub3.xDrawOffset;
                            const j3: number =
                                j2 + 16 + class50_sub1_sub1_sub3.yDrawOffset;
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
            this.processFlamesCycle();
        } else {
            await super.run();
            if (this.gameState == -2) {
                return;
            }
        }

        requestAnimationFrame(this.run.bind(this));
    }

    processFlamesCycle() {
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
                const y: number =
                    (((Math.random() * 128.0) as number) | 0) + 128;
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
                            ((this.anIntArray1176[
                                (pixel + this.anInt1238) &
                                    (this.anIntArray1176.length - 1)
                            ] /
                                5) |
                                0);
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
                const i2: number =
                    ((this.anIntArray1166[l1] * (c - l1)) / c) | 0;
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
                            const i5: number = this.flameLeftBackground.pixels[
                                k1
                            ];
                            this.flameLeftBackground.pixels[k1++] =
                                ((((k3 & 16711935) * i4 +
                                    (i5 & 16711935) * k4) &
                                    -16711936) +
                                    (((k3 & 65280) * i4 + (i5 & 65280) * k4) &
                                        16711680)) >>
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
                const j3: number =
                    ((this.anIntArray1166[l2] * (c - l2)) / c) | 0;
                const l3: number = 103 - j3;
                k1 += j3;
                for (let j4: number = 0; j4 < l3; j4++) {
                    {
                        let l4: number = this.anIntArray1084[j1++];
                        if (l4 !== 0) {
                            const j5: number = l4;
                            const k5: number = 256 - l4;
                            l4 = this.anIntArray1310[l4];
                            const l5: number = this.flameRightBackground.pixels[
                                k1
                            ];
                            this.flameRightBackground.pixels[k1++] =
                                ((((l4 & 16711935) * j5 +
                                    (l5 & 16711935) * k5) &
                                    -16711936) +
                                    (((l4 & 65280) * j5 + (l5 & 65280) * k5) &
                                        16711680)) >>
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
        return (
            ((((i & 16711935) * i1 + (j & 16711935) * k) & -16711936) +
                (((i & 65280) * i1 + (j & 65280) * k) & 16711680)) >>
            8
        );
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
            this.stores.push(
                new Index(type + 1, 0x927c0, main, promises[1 + type])
            );
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
                    ai[j] =
                        class50_sub1_sub1_sub1.pixels[
                            class50_sub1_sub1_sub1.width -
                                j -
                                1 +
                                class50_sub1_sub1_sub1.width * i
                        ];
                }
                for (let l: number = 0; l < class50_sub1_sub1_sub1.width; l++) {
                    class50_sub1_sub1_sub1.pixels[
                        l + class50_sub1_sub1_sub1.width * i
                    ] = ai[l];
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
        class50_sub1_sub1_sub1 = ImageRGB.fromArchive(
            this.titleArchive,
            "logo",
            0
        );
        this.aClass18_1198.createRasterizer();
        class50_sub1_sub1_sub1.drawImage(
            18,
            382 - ((class50_sub1_sub1_sub1.width / 2) | 0) - 128
        );
        class50_sub1_sub1_sub1 = null;
        abyte0 = null;
        ai = null;
    }

    initArchives() {
        console.log("initArchives");
        this.titleArchive = this.requestArchive(
            1,
            "title",
            this.archiveHashes[1],
            25,
            "title screen"
        );
    }

    initTypeFaces() {
        console.log("initTypeFaces");
        this.fontSmall = new TypeFace(false, this.titleArchive, "p11_full");
        this.fontNormal = new TypeFace(false, this.titleArchive, "p12_full");
        this.fontBold = new TypeFace(false, this.titleArchive, "b12_full");
        this.fontFancy = new TypeFace(true, this.titleArchive, "q8_full");
    }

    requestArchive(
        id: number,
        file: string,
        expectedCrc: number,
        x: number,
        displayName: string
    ): Archive {
        // In rs it does web requests, hash checks and updates
        return new Archive(this.stores[0].get(id));
    }

    async getFile(fileUrl: string): Promise<ArrayBuffer> {
        const resp = await fetch(fileUrl);
        return resp.arrayBuffer();
    }
}

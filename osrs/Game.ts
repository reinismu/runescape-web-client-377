import cacheData from "./../client_cache/*.dat";
import cacheIndices from "./../client_cache/*.idx*";
import { Index } from "./cache/Index";
import { Archive } from "./cache/Archive";
import { TypeFace } from "./cache/media/TypeFace";
import { GameShell } from "./GameShell";

export class Game extends GameShell {
    public stores: Index[] = [];
    public archiveHashes: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0]; // currently unused
    titleArchive: Archive;
    fontSmall: TypeFace;
    fontNormal: TypeFace;
    fontBold: TypeFace;
    fontFancy: TypeFace;

    constructor(canvas: HTMLCanvasElement) {
        super(canvas);
    }

    public async startUp() {
        await this.initStores();
        this.initArchives();
        this.initTypeFaces();
        this.initializeApplication(765, 503);
    }

    async initStores() {
        console.log("initStores");
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

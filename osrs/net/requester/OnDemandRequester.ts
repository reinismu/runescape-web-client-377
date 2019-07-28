import { Archive } from "../../cache/Archive";
import { Queue } from "../../collection/Queue";
import { Game } from "../../Game";
import { LinkedList } from "../../util/LinkedList";
import { Buffer } from "../Buffer";
import { OnDemandNode } from "./OnDemandNode";
import { Requester } from "./Requester";
import { ungzip } from "pako";
import { Socket } from "../Socket";
import { crc32 } from "@stardazed/crc32";

export class OnDemandRequester extends Requester {
    public anInt1334: number;

    public modelIndex: number[];

    public regShouldPreload: number[];

    public filePriorities: number[][] = [null, null, null, null];

    public expectData: boolean = false;

    public running: boolean = true;

    public wanted: LinkedList = new LinkedList();

    public highestPriority: number;

    public immediateRequestsSent: number;

    public anInt1343: number;

    public fileCrc: number[][] = [null, null, null, null];

    public anInt1345: number;

    public regHash: number[];

    public message: string = "";

    public cycle: number;

    public anInt1350: number;

    public aClass6_1351: LinkedList = new LinkedList();

    public aBoolean1352: boolean = false;

    public idleCycles: number;

    public socket: Socket = null;

    public completed: LinkedList = new LinkedList();

    public immediateRequests: LinkedList = new LinkedList();

    public deflateOut: number[] = Array(65000).fill(0);

    public regMapIndex: number[];

    public offset: number;

    public toRead: number;

    public anInt1363: number;

    public inputBuffer: number[] = (s => {
        const a = [];
        while (s-- > 0) {
            a.push(0);
        }
        return a;
    })(500);

    public regLandIndex: number[];

    public midiIndex: number[];

    public anInt1367: number = 591;

    public immediateRequests1: Queue = new Queue();

    public onDemandNode: OnDemandNode;

    public client: Game;

    public toRequest: LinkedList = new LinkedList();

    public sinceKeepAlive: number;

    public animIndex: number[];

    public fileVersions: number[][] = [null, null, null, null];

    public lastSocketOpen: number;

    public requestFails: number;

    runBound = this.run.bind(this);

    constructor() {
        super();
        if (this.anInt1334 === undefined) {
            this.anInt1334 = 0;
        }
        if (this.modelIndex === undefined) {
            this.modelIndex = null;
        }
        if (this.regShouldPreload === undefined) {
            this.regShouldPreload = null;
        }
        if (this.highestPriority === undefined) {
            this.highestPriority = 0;
        }
        if (this.immediateRequestsSent === undefined) {
            this.immediateRequestsSent = 0;
        }
        if (this.anInt1343 === undefined) {
            this.anInt1343 = 0;
        }
        if (this.anInt1345 === undefined) {
            this.anInt1345 = 0;
        }
        if (this.regHash === undefined) {
            this.regHash = null;
        }
        if (this.cycle === undefined) {
            this.cycle = 0;
        }
        if (this.anInt1350 === undefined) {
            this.anInt1350 = 0;
        }
        if (this.idleCycles === undefined) {
            this.idleCycles = 0;
        }
        if (this.regMapIndex === undefined) {
            this.regMapIndex = null;
        }
        if (this.offset === undefined) {
            this.offset = 0;
        }
        if (this.toRead === undefined) {
            this.toRead = 0;
        }
        if (this.anInt1363 === undefined) {
            this.anInt1363 = 0;
        }
        if (this.regLandIndex === undefined) {
            this.regLandIndex = null;
        }
        if (this.midiIndex === undefined) {
            this.midiIndex = null;
        }
        if (this.onDemandNode === undefined) {
            this.onDemandNode = null;
        }
        if (this.client === undefined) {
            this.client = null;
        }
        if (this.sinceKeepAlive === undefined) {
            this.sinceKeepAlive = 0;
        }
        if (this.animIndex === undefined) {
            this.animIndex = null;
        }
        if (this.lastSocketOpen === undefined) {
            this.lastSocketOpen = 0;
        }
        if (this.requestFails === undefined) {
            this.requestFails = 0;
        }
    }

    public verify(expectedVersion: number, expectedCrc: number, data: number[] | null): boolean {
        if (data == null || data.length < 2) {
            return false;
        }
        const length: number = data.length - 2;
        const version: number = ((data[length] & 255) << 8) + (data[length + 1] & 255);

        if (version !== expectedVersion) {
            return false;
        }
        const buffer = new Int8Array(data);
        const byteCrc = crc32(buffer.slice(0, buffer.length - 2));
        return byteCrc === expectedCrc;
    }

    public async handleResp() {
        try {
            const available: number = this.socket.available();
            if (this.toRead === 0 && available >= 6) {
                this.expectData = true;
                for (let read: number = 0; read < 6; read += await this.socket.read$byte_A$int$int(this.inputBuffer, read, 6 - read)) {}
                const type: number = this.inputBuffer[0] & 255;
                const id: number = ((this.inputBuffer[1] & 255) << 8) + (this.inputBuffer[2] & 255);
                const size: number = ((this.inputBuffer[3] & 255) << 8) + (this.inputBuffer[4] & 255);
                const chunk: number = this.inputBuffer[5] & 255;
                this.onDemandNode = null;
                for (
                    let ondemandnode: OnDemandNode = this.toRequest.first() as OnDemandNode;
                    ondemandnode != null;
                    ondemandnode = this.toRequest.next() as OnDemandNode
                ) {
                    {
                        if (ondemandnode.type === type && ondemandnode.id === id) {
                            this.onDemandNode = ondemandnode;
                        }
                        if (this.onDemandNode != null) {
                            ondemandnode.cyclesSinceSend = 0;
                        }
                    }
                }
                if (this.onDemandNode != null) {
                    this.idleCycles = 0;
                    if (size === 0) {
                        console.error("Rej: " + type + "," + id);
                        this.onDemandNode.buffer = null;
                        if (this.onDemandNode.immediate) {
                            {
                                this.completed.insertBack(this.onDemandNode);
                            }
                        } else {
                            this.onDemandNode.remove();
                        }
                        this.onDemandNode = null;
                    } else {
                        if (this.onDemandNode.buffer == null && chunk === 0) {
                            this.onDemandNode.buffer = Array(size).fill(0);
                        }
                        if (this.onDemandNode.buffer == null && chunk !== 0) {
                            throw Error("missing initializeApplication of file");
                        }
                    }
                }
                this.offset = chunk * 500;
                this.toRead = 500;
                if (this.toRead > size - chunk * 500) {
                    this.toRead = size - chunk * 500;
                }
            }
            if (this.toRead > 0 && available >= this.toRead) {
                this.expectData = true;
                let buffer: number[] = this.inputBuffer;
                let bufferOffset: number = 0;
                if (this.onDemandNode != null) {
                    buffer = this.onDemandNode.buffer;
                    bufferOffset = this.offset;
                }
                for (
                    let i: number = 0;
                    i < this.toRead;
                    i += await this.socket.read$byte_A$int$int(buffer, i + bufferOffset, this.toRead - i)
                ) {}
                if (this.toRead + this.offset >= buffer.length && this.onDemandNode != null) {
                    if (this.client.stores[0] != null) {
                        this.client.stores[this.onDemandNode.type + 1].put$int$byte_A$int(buffer.length, buffer, this.onDemandNode.id);
                    }
                    if (!this.onDemandNode.immediate && this.onDemandNode.type === 3) {
                        this.onDemandNode.immediate = true;
                        this.onDemandNode.type = 93;
                    }
                    if (this.onDemandNode.immediate) {
                        {
                            this.completed.insertBack(this.onDemandNode);
                        }
                    } else {
                        this.onDemandNode.remove();
                    }
                }
                this.toRead = 0;
                return;
            }
        } catch (ioexception) {
            try {
                await this.socket.close();
            } catch (_ex) {}
            this.socket = null;
            this.toRead = 0;
        }
    }

    public modelId(model: number): number {
        return this.modelIndex[model] & 255;
    }

    /**
     *
     * @param {number} id
     */
    public requestModel(id: number) {
        this.request(0, id);
    }

    public async passivesRequest(i: number) {
        if (i !== 0) {
            return;
        }
        while (this.immediateRequestsSent === 0 && this.anInt1343 < 10) {
            {
                if (this.highestPriority === 0) {
                    break;
                }
                let class50_sub1_sub3: OnDemandNode;
                {
                    class50_sub1_sub3 = this.immediateRequests.removeFirst() as OnDemandNode;
                }
                while (class50_sub1_sub3 != null) {
                    {
                        if (this.filePriorities[class50_sub1_sub3.type][class50_sub1_sub3.id] !== 0) {
                            this.filePriorities[class50_sub1_sub3.type][class50_sub1_sub3.id] = 0;
                            this.toRequest.insertBack(class50_sub1_sub3);
                            await this.sendRequest(class50_sub1_sub3);
                            this.expectData = true;
                            if (this.anInt1334 < this.anInt1350) {
                                this.anInt1334++;
                            }
                            this.message = "Loading extra files - " + (((this.anInt1334 * 100) / this.anInt1350) | 0) + "%";
                            this.anInt1343++;
                            if (this.anInt1343 === 10) {
                                return;
                            }
                        }
                        {
                            class50_sub1_sub3 = this.immediateRequests.removeFirst() as OnDemandNode;
                        }
                    }
                }
                for (let j: number = 0; j < 4; j++) {
                    {
                        const abyte0: number[] = this.filePriorities[j];
                        const k: number = abyte0.length;
                        for (let l: number = 0; l < k; l++) {
                            if (abyte0[l] === this.highestPriority) {
                                abyte0[l] = 0;
                                const class50_sub1_sub3_1: OnDemandNode = new OnDemandNode();
                                class50_sub1_sub3_1.type = j;
                                class50_sub1_sub3_1.id = l;
                                class50_sub1_sub3_1.immediate = false;
                                this.toRequest.insertBack(class50_sub1_sub3_1);
                                await this.sendRequest(class50_sub1_sub3_1);
                                this.expectData = true;
                                if (this.anInt1334 < this.anInt1350) {
                                    this.anInt1334++;
                                }
                                this.message = "Loading extra files - " + (((this.anInt1334 * 100) / this.anInt1350) | 0) + "%";
                                this.anInt1343++;
                                if (this.anInt1343 === 10) {
                                    return;
                                }
                            }
                        }
                    }
                }
                this.highestPriority--;
            }
        }
    }

    public setPriority(byte0: number, j: number, k: number) {
        if (this.client.stores[0] == null) {
            return;
        }
        if (this.fileVersions[j][k] === 0) {
            return;
        }
        const abyte0: number[] = this.client.stores[j + 1].get(k);
        if (this.verify(this.fileVersions[j][k], this.fileCrc[j][k], abyte0)) {
            return;
        }
        this.filePriorities[j][k] = byte0;
        if (byte0 > this.highestPriority) {
            this.highestPriority = byte0;
        }
        this.anInt1350++;
    }

    public midiIdEqualsOne(i: number): boolean {
        return this.midiIndex[i] === 1;
    }

    public request(type: number, id: number) {
        if (type < 0 || type > this.fileVersions.length || id < 0 || id > this.fileVersions[type].length) {
            return;
        }
        if (this.fileVersions[type][id] === 0) {
            return;
        }

        for (
            let onDemandNode: OnDemandNode = this.immediateRequests1.first() as OnDemandNode;
            onDemandNode != null;
            onDemandNode = this.immediateRequests1.next() as OnDemandNode
        ) {
            if (onDemandNode.type === type && onDemandNode.id === id) {
                return;
            }
        }

        const onDemandNode: OnDemandNode = new OnDemandNode();
        onDemandNode.type = type;
        onDemandNode.id = id;
        onDemandNode.immediate = true;

        this.wanted.insertBack(onDemandNode);
        this.immediateRequests1.push(onDemandNode);
    }

    public next(): OnDemandNode {
        let onDemandNode = this.completed.removeFirst() as OnDemandNode;

        if (onDemandNode == null) {
            return null;
        }
        {
            onDemandNode.clear();
        }
        if (onDemandNode.buffer == null) {
            return onDemandNode;
        }
        this.deflateOut = Array.from(ungzip(new Uint8Array(onDemandNode.buffer)));

        onDemandNode.buffer = [...this.deflateOut];

        return onDemandNode;
    }

    public async run() {
        try {
            this.cycle++;
            let toWait: number = 20;
            if (this.highestPriority === 0 && this.client.stores[0] != null) {
                toWait = 50;
            }

            this.expectData = true;
            for (let i: number = 0; i < 100; i++) {
                {
                    if (!this.expectData) {
                        break;
                    }
                    this.expectData = false;
                    this.localComplete();
                    await this.remainingRequest(0);
                    if (this.immediateRequestsSent === 0 && i >= 5) {
                        break;
                    }
                    this.passivesRequest(0);
                    if (this.socket != null) {
                        await this.handleResp();
                    }
                }
            }
            let idle: boolean = false;
            for (
                let onDemandNode: OnDemandNode = this.toRequest.first() as OnDemandNode;
                onDemandNode != null;
                onDemandNode = this.toRequest.next() as OnDemandNode
            ) {
                if (onDemandNode.immediate) {
                    idle = true;
                    onDemandNode.cyclesSinceSend++;
                    if (onDemandNode.cyclesSinceSend > 50) {
                        onDemandNode.cyclesSinceSend = 0;
                        await this.sendRequest(onDemandNode);
                    }
                }
            }
            if (!idle) {
                for (
                    let onDemandNode: OnDemandNode = this.toRequest.first() as OnDemandNode;
                    onDemandNode != null;
                    onDemandNode = this.toRequest.next() as OnDemandNode
                ) {
                    {
                        idle = true;
                        onDemandNode.cyclesSinceSend++;
                        if (onDemandNode.cyclesSinceSend > 50) {
                            onDemandNode.cyclesSinceSend = 0;
                            await this.sendRequest(onDemandNode);
                        }
                    }
                }
            }
            if (idle) {
                this.idleCycles++;
                if (this.idleCycles > 750) {
                    try {
                        this.socket.close();
                    } catch (_ex) {}
                    this.socket = null;
                    this.toRead = 0;
                }
            } else {
                this.idleCycles = 0;
                this.message = "";
            }
            if (this.client.loggedIn && this.socket != null && (this.highestPriority > 0 || this.client.stores[0] == null)) {
                this.sinceKeepAlive++;
                if (this.sinceKeepAlive > 500) {
                    this.sinceKeepAlive = 0;
                    this.inputBuffer[0] = 0;
                    this.inputBuffer[1] = 0;
                    this.inputBuffer[2] = 0;
                    this.inputBuffer[3] = 10;
                    try {
                        this.socket.write$byte_A$int$int(this.inputBuffer, 0, 4);
                    } catch (_ex) {
                        this.idleCycles = 5000;
                    }
                }
            }
            if (this.running) {
                setTimeout(this.runBound, toWait);
            }
        } catch (exception) {
            console.error(exception);
        }
    }

    public async remainingRequest(i: number) {
        this.immediateRequestsSent = 0;
        this.anInt1343 = 0;
        if (i !== 0) {
            return;
        }
        for (
            let class50_sub1_sub3: OnDemandNode = this.toRequest.first() as OnDemandNode;
            class50_sub1_sub3 != null;
            class50_sub1_sub3 = this.toRequest.next() as OnDemandNode
        ) {
            if (class50_sub1_sub3.immediate) {
                this.immediateRequestsSent++;
            } else {
                this.anInt1343++;
            }
        }
        while (this.immediateRequestsSent < 10) {
            {
                const class50_sub1_sub3_1: OnDemandNode = this.aClass6_1351.removeFirst() as OnDemandNode;
                if (class50_sub1_sub3_1 == null) {
                    break;
                }
                if (this.filePriorities[class50_sub1_sub3_1.type][class50_sub1_sub3_1.id] !== 0) {
                    this.anInt1334++;
                }
                this.filePriorities[class50_sub1_sub3_1.type][class50_sub1_sub3_1.id] = 0;
                this.toRequest.insertBack(class50_sub1_sub3_1);
                this.immediateRequestsSent++;
                await this.sendRequest(class50_sub1_sub3_1);
                this.expectData = true;
            }
        }
    }

    public preloadRegions(members: boolean) {
        for (let reg: number = 0; reg < this.regHash.length; reg++) {
            if (members || this.regShouldPreload[reg] !== 0) {
                this.setPriority((2 as number) | 0, 3, this.regLandIndex[reg]);
                this.setPriority((2 as number) | 0, 3, this.regMapIndex[reg]);
            }
        }
    }

    public immediateRequestsCount(): number {
        return this.immediateRequests1.size();
    }

    public method334(i: number, flag: boolean): boolean {
        for (let j: number = 0; j < this.regHash.length; j++) {
            if (this.regLandIndex[j] === i) {
                return true;
            }
        }
        if (flag) {
            this.anInt1363 = -405;
        }
        return false;
    }

    public init(archive: Archive, client: Game) {
        const versionFiles: string[] = ["model_version", "anim_version", "midi_version", "map_version"];
        for (let version: number = 0; version < 4; version++) {
            {
                const data: number[] = archive.getFile(versionFiles[version]);
                const versionCount: number = (data.length / 2) | 0;
                const buffer: Buffer = new Buffer(data);
                this.fileVersions[version] = (s => {
                    const a = [];
                    while (s-- > 0) {
                        a.push(0);
                    }
                    return a;
                })(versionCount);
                this.filePriorities[version] = (s => {
                    const a = [];
                    while (s-- > 0) {
                        a.push(0);
                    }
                    return a;
                })(versionCount);
                for (let file: number = 0; file < versionCount; file++) {
                    this.fileVersions[version][file] = buffer.getUnsignedLEShort();
                }
            }
        }
        const crcFiles: string[] = ["model_crc", "anim_crc", "midi_crc", "map_crc"];
        for (let crc: number = 0; crc < 4; crc++) {
            {
                const data: number[] = archive.getFile(crcFiles[crc]);
                const crcCount: number = (data.length / 4) | 0;
                const buffer: Buffer = new Buffer(data);
                this.fileCrc[crc] = Array(crcCount).fill(0);
                for (let file: number = 0; file < crcCount; file++) {
                    this.fileCrc[crc][file] = buffer.getInt();
                }
            }
        }
        let data: number[] = archive.getFile("model_index");
        let count: number = this.fileVersions[0].length;
        this.modelIndex = Array(count).fill(0);

        for (let i: number = 0; i < count; i++) {
            if (i < data.length) {
                this.modelIndex[i] = data[i];
            } else {
                this.modelIndex[i] = 0;
            }
        }
        data = archive.getFile("map_index");
        let buffer: Buffer = new Buffer(data);
        count = (data.length / 7) | 0;
        this.regHash = Array(count).fill(0);
        this.regMapIndex = Array(count).fill(0);
        this.regLandIndex = Array(count).fill(0);
        this.regShouldPreload = Array(count).fill(0);
        for (let reg: number = 0; reg < count; reg++) {
            {
                this.regHash[reg] = buffer.getUnsignedLEShort();
                this.regMapIndex[reg] = buffer.getUnsignedLEShort();
                this.regLandIndex[reg] = buffer.getUnsignedLEShort();
                this.regShouldPreload[reg] = buffer.getUnsignedByte();
            }
        }
        data = archive.getFile("anim_index");
        buffer = new Buffer(data);
        count = (data.length / 2) | 0;
        this.animIndex = Array(count).fill(0);
        for (let i: number = 0; i < count; i++) {
            this.animIndex[i] = buffer.getUnsignedLEShort();
        }
        data = archive.getFile("midi_index");
        buffer = new Buffer(data);
        count = data.length;
        this.midiIndex = Array(count).fill(0);
        for (let i: number = 0; i < count; i++) {
            this.midiIndex[i] = buffer.getUnsignedByte();
        }
        this.client = client;
        this.running = true;
        this.run();
    }

    public immediateRequestCount() {
        {
            this.immediateRequests.getNodeCount();
        }
    }

    public passiveRequest(i: number, j: number) {
        if (this.client.stores[0] == null) {
            return;
        }
        if (this.fileVersions[j][i] === 0) {
            return;
        }
        if (this.filePriorities[j][i] === 0) {
            return;
        }
        if (this.highestPriority === 0) {
            return;
        }
        const class50_sub1_sub3: OnDemandNode = new OnDemandNode();
        class50_sub1_sub3.type = j;
        class50_sub1_sub3.id = i;
        class50_sub1_sub3.immediate = false;
        {
            this.immediateRequests.insertBack(class50_sub1_sub3);
        }
    }

    public localComplete() {
        let onDemandNode = this.wanted.removeFirst() as OnDemandNode;

        while (onDemandNode != null && onDemandNode instanceof OnDemandNode) {
            this.expectData = true;
            let abyte0: number[] | null = null;
            if (this.client.stores[0] != null) {
                abyte0 = this.client.stores[onDemandNode.type + 1].get(onDemandNode.id);
            }
            if (
                !this.verify(
                    this.fileVersions[onDemandNode.type][onDemandNode.id],
                    this.fileCrc[onDemandNode.type][onDemandNode.id],
                    abyte0
                )
            ) {
                abyte0 = null;
            }
            if (abyte0 == null) {
                this.aClass6_1351.insertBack(onDemandNode);
            } else {
                onDemandNode.buffer = abyte0;
                this.completed.insertBack(onDemandNode);
            }
            onDemandNode = this.wanted.removeFirst() as OnDemandNode;
        }
    }

    public stop() {
        this.running = false;
    }

    public fileCount(file: number): number {
        return this.fileVersions[file].length;
    }

    public async sendRequest(onDemandNode: OnDemandNode) {
        try {
            if (this.socket == null) {
                const currentTime: number = new Date().getTime();
                if (currentTime - this.lastSocketOpen < 4000) {
                    return;
                }
                this.lastSocketOpen = currentTime;
                this.socket = await this.client.openSocket(43594 + Game.portOffset);
                this.socket.write$int(15);
                for (let i: number = 0; i < 8; i++) {
                    await this.socket.read();
                }
                this.idleCycles = 0;
            }
            this.inputBuffer[0] = (onDemandNode.type as number) | 0;
            this.inputBuffer[1] = ((onDemandNode.id >> 8) as number) | 0;
            this.inputBuffer[2] = (onDemandNode.id as number) | 0;
            if (onDemandNode.immediate) {
                this.inputBuffer[3] = 2;
            } else if (!this.client.loggedIn) {
                this.inputBuffer[3] = 1;
            } else {
                this.inputBuffer[3] = 0;
            }
            this.socket.write$byte_A$int$int(this.inputBuffer, 0, 4);
            this.sinceKeepAlive = 0;
            this.requestFails = -10000;
            return;
        } catch (ioexception) {}
        try {
            this.socket.close();
        } catch (_ex) {}
        this.socket = null;
        this.toRead = 0;
        this.requestFails++;
    }

    public animCount(): number {
        return this.animIndex.length;
    }

    public regId(i: number, regX: number, regY: number, l: number): number {
        const localRegHash: number = (regX << 8) + regY;
        for (let reg: number = 0; reg < this.regHash.length; reg++) {
            if (this.regHash[reg] === localRegHash) {
                if (l === 0) {
                    return this.regMapIndex[reg];
                } else {
                    return this.regLandIndex[reg];
                }
            }
        }
        return -1;
    }
}

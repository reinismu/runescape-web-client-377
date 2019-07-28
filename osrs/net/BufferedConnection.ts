import { GameShell } from "../GameShell";
import { Socket } from "./Socket";

export class BufferedConnection {
    public socket: Socket;

    public closed: boolean = false;

    public gameStub: GameShell;

    public buffer: number[];

    public writerPosition: number;

    public bufferPosition: number;

    public writing: boolean = false;

    public ioError: boolean = false;

    public constructor(gameStub: GameShell, socket: Socket) {
        if (this.socket === undefined) {
            this.socket = null;
        }
        if (this.gameStub === undefined) {
            this.gameStub = null;
        }
        if (this.buffer === undefined) {
            this.buffer = null;
        }
        if (this.writerPosition === undefined) {
            this.writerPosition = 0;
        }
        if (this.bufferPosition === undefined) {
            this.bufferPosition = 0;
        }
        this.gameStub = gameStub;
        this.socket = socket;
        // this.socket.setSoTimeout(30000);
        // this.socket.setTcpNoDelay(true);
        // this.inputStream = socket.getInputStream();
        // this.outputStream = socket.getOutputStream();
    }

    public close() {
        this.closed = true;
        try {
            if (this.socket != null) {
                this.socket.close();
            }
        } catch (_ex) {
            console.info("Error closing stream");
        }
        this.writing = false;
        // this.notify();
        this.buffer = null;
    }

    public async read$(): Promise<number> {
        if (this.closed) {
            return 0;
        } else {
            return await this.socket.read();
        }
    }

    public getAvailable(): number {
        if (this.closed) {
            return 0;
        } else {
            return this.socket.available();
        }
    }

    public async read$byte_A$int$int(src: number[] | Int8Array, offset: number, length: number) {
        if (!this.closed) {
            let byteRead: number;
            for (; length > 0; length -= byteRead) {
                {
                    byteRead = await this.socket.read$byte_A$int$int(src, offset, length);
                    if (byteRead <= 0) {
                        throw Error("EOF");
                    }
                    offset += byteRead;
                }
            }
        }
    }

    public write(length: number, offset: number, src: number[] | Int8Array) {
        if (this.closed) {
            return;
        }
        if (this.ioError) {
            this.ioError = false;
            throw Error("Error in writer thread");
        }
        this.socket.write$byte_A$int$int(src, offset, length);

        if (this.buffer == null) {
            this.buffer = Array(5000).fill(0);
        }
    }

    public printDebug() {
        console.info("dummy:" + this.closed);
        console.info("tcycl:" + this.writerPosition);
        console.info("tnum:" + this.bufferPosition);
        console.info("writer:" + this.writing);
        console.info("ioerror:" + this.ioError);
        try {
            console.info("available:" + this.getAvailable());
        } catch (_ex) {}
    }
}

import { WebSocketClient } from "./WebSocketClient";

export class Socket {
    host: string;
    port: number;
    client: WebSocketClient;
    lastArrayBufferReceived: Int8Array = null;
    lastArrayBufferReadIndex: number = 0;

    constructor(host: string, port: number) {
        this.host = host;
        this.port = port;
        this.client = new WebSocketClient();
    }

    public async connect() {
        await this.client.connect(`ws://${this.host}:${this.port}`);
    }

    public write$int(buf: number) {
        this.client.send(new Int8Array([buf]));
    }

    public write$byte_A$int$int(bytes: number[] | Int8Array, off: number, len: number) {
        if(bytes instanceof Int8Array) {
            this.client.send(bytes.slice(off, off + len));
        } else {
            this.client.send(new Int8Array(bytes.slice(off, off + len)));

        }
    }

    public async read(): Promise<number> {
        if (this.lastArrayBufferReceived != null && this.lastArrayBufferReadIndex < this.lastArrayBufferReceived.length) {
            return this.lastArrayBufferReceived[this.lastArrayBufferReadIndex++];
        }
        const received = await this.client.receive();
        if (received instanceof Error) {
            return -1;
        }
        this.lastArrayBufferReceived = new Int8Array(received);
        this.lastArrayBufferReadIndex = 0;
        return this.lastArrayBufferReceived[this.lastArrayBufferReadIndex++];
    }

    public readReceivedOnly(): number {
        if (this.lastArrayBufferReceived != null && this.lastArrayBufferReadIndex < this.lastArrayBufferReceived.length) {
            return this.lastArrayBufferReceived[this.lastArrayBufferReadIndex++];
        }
        if (this.client.dataAvailable <= 0) {
            return -1;
        }
        this.lastArrayBufferReadIndex = 0;
        this.lastArrayBufferReceived = new Int8Array(this.client.receiveLocal());
        return this.lastArrayBufferReceived[this.lastArrayBufferReadIndex++];
    }

    public async read$byte_A$int$int(b: number[] | Int8Array, off: number, len: number): Promise<number> {
        let c = await this.read();
        if (c == -1) {
            return -1;
        }
        b[off] = c;
        let i = 1;
        for (; i < len; i++) {
            c = await this.read();
            if (c == -1) {
                break;
            }
            b[off + i] = c;
        }
        return i;
    }

    public async close() {
        await this.client.disconnect();
    }

    public available(): number {
        return this.client.dataBytesAvailable;
    }
}

import { Game } from "../Game";
import { Runnable, sleep } from "../ParallelExecutor";

export class MouseCapturer implements Runnable {
    public _client: Game;

    public capturing: boolean = true;

    public coordsY: number[] = Array(500).fill(0);

    public objectLock: any = new Object() as any;

    public client: Game;

    public coord: number;

    public coordsX: number[] = Array(500).fill(0);

    public constructor(_client: Game) {
        if (this._client === undefined) {
            this._client = null;
        }
        if (this.client === undefined) {
            this.client = null;
        }
        if (this.coord === undefined) {
            this.coord = 0;
        }
        this.client = _client;
    }

    public async run(): Promise<boolean> {
        if (this.coord < 500) {
            this.coordsX[this.coord] = this.client.mouseX;
            this.coordsY[this.coord] = this.client.mouseY;
            this.coord++;
        }
        await sleep(50);
        return this.capturing;
    }
}

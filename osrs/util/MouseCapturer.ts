import { Game } from "../Game";

export class MouseCapturer {
    public _client: Game;

    public capturing: boolean = true;

    public coordsY: number[] = (s => {
        const a = [];
        while (s-- > 0) {
            a.push(0);
        }
        return a;
    })(500);

    public objectLock: any = new Object() as any;

    public client: Game;

    public coord: number;

    public coordsX: number[] = (s => {
        const a = [];
        while (s-- > 0) {
            a.push(0);
        }
        return a;
    })(500);

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

    public async run() {
        if (this.coord < 500) {
            this.coordsX[this.coord] = this.client.mouseX;
            this.coordsY[this.coord] = this.client.mouseY;
            this.coord++;
        }
        if (this.capturing) {
            setInterval(this.run.bind(this), 50);
        }
    }
}

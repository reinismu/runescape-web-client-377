import { CacheableNode } from "../../collection/CacheableNode";

export class OnDemandNode extends CacheableNode {
    public type: number;

    public id: number;

    public cyclesSinceSend: number;

    public buffer: number[];

    public immediate: boolean = true;

    constructor() {
        super();
        if (this.type === undefined) { this.type = 0; }
        if (this.id === undefined) { this.id = 0; }
        if (this.cyclesSinceSend === undefined) { this.cyclesSinceSend = 0; }
        if (this.buffer === undefined) { this.buffer = null; }
    }
}

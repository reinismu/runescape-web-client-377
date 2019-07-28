import { CacheableNode } from "../../collection/CacheableNode";

export class OnDemandNode extends CacheableNode {
    public type: number = 0;

    public id: number = 0;

    public cyclesSinceSend: number = 0;

    public buffer: number[] = null;

    public immediate: boolean = true;

    constructor() {
        super();
    }
}

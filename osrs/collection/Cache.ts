import { CacheableNode } from "./CacheableNode";

export class Cache {
    map: Map<number, CacheableNode> = new Map();

    public constructor(size: number) {

    }

    public get(id: number): CacheableNode {
        return this.map[id];
    }

    public put(cacheableNode: CacheableNode, id: number) {
        this.map.set(cacheableNode.id, cacheableNode);
    }

    public removeAll() {
        this.map = new Map();
    }
}

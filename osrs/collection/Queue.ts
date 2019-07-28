import { CacheableNode } from "./CacheableNode";

export class Queue {
    public head: CacheableNode = new CacheableNode();

    public current: CacheableNode = null;

    public constructor() {
        this.head.cacheNext = this.head;
        this.head.cachePrevious = this.head;
    }

    public push(node: CacheableNode) {
        if (node.cachePrevious != null) { 
            node.clear(); 
        }
        node.cachePrevious = this.head.cachePrevious;
        node.cacheNext = this.head;
        node.cachePrevious.cacheNext = node;
        node.cacheNext.cachePrevious = node;
    }

    public pop(): CacheableNode {
        const node: CacheableNode = this.head.cacheNext;
        if (node === this.head) {
            return null;
        } else {
            node.clear();
            return node;
        }
    }

    public first(): CacheableNode {
        const node: CacheableNode = this.head.cacheNext;
        if (node === this.head || node == null) {
            this.current = null;
            return null;
        } else {
            this.current = node.cacheNext;
            return node;
        }
    }

    public next(): CacheableNode {
        const node: CacheableNode = this.current;
        if (node === this.head) {
            this.current = null;
            return null;
        }
        this.current = node.cacheNext;
        return node;
    }

    public size(): number {
        let size: number = 0;
        for (let node: CacheableNode = this.head.cacheNext; node !== this.head && node != null; node = node.cacheNext) {size++; }
        return size;
    }
}

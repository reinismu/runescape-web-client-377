import { CacheableNode } from "./CacheableNode";

export class Queue {
    public head: CacheableNode = new CacheableNode();

    public current: CacheableNode;

    public constructor() {
        if (this.current === undefined) { this.current = null; }
        this.head.next = this.head;
        this.head.prev = this.head;
    }

    public push(node: CacheableNode) {
        if (node.prev != null) { node.clear(); }
        node.prev = this.head.prev;
        node.next = this.head;
        node.prev.next = node;
        node.next.prev = node;
    }

    public pop(): CacheableNode {
        const node: CacheableNode = this.head.next;
        if (node === this.head) {
            return null;
        } else {
            node.clear();
            return node;
        }
    }

    public first(): CacheableNode {
        const node: CacheableNode = this.head.next;
        if (node === this.head) {
            this.current = null;
            return null;
        } else {
            this.current = node.next;
            return node;
        }
    }

    public next(): CacheableNode {
        const node: CacheableNode = this.current;
        if (node === this.head) {
            this.current = null;
            return null;
        }
        this.current = node.next;
        return node;
    }

    public size(): number {
        let size: number = 0;
        for (let node: CacheableNode = this.head.next; node !== this.head; node = node.next) {size++; }
        return size;
    }
}

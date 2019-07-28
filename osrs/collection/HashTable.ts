import { Node } from "./Node";

export class HashTable {
    public size: number;

    public cache: Node[];

    public constructor(_size: number) {
        if (this.size === undefined) { this.size = 0; }
        if (this.cache === undefined) { this.cache = null; }
        this.size = _size;
        this.cache = Array(_size);
        for (let nodeId: number = 0; nodeId < _size; nodeId++) {{
            const node: Node = this.cache[nodeId] = new Node();
            node.next = node;
            node.previous = node;
        }}
    }

    public get(id: number): Node {
        const bucket: Node = this.cache[(((id & (this.size - 1)) as number) | 0)];
        for (let node: Node = bucket.next; node !== bucket; node = node.next) {
            if (node.id === id) { 
                return node; 
            }
        }
        return null;
    }

    public put(node: Node, id: number) {
        if (node.previous != null) { node.remove(); }
        const bucket: Node = this.cache[(((id & (this.size - 1)) as number) | 0)];
        node.previous = bucket.previous;
        node.next = bucket;
        node.previous.next = node;
        node.next.previous = node;
        node.id = id;
        return;
    }
}

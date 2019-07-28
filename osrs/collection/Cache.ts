import { CacheableNode } from "./CacheableNode";
import { HashTable } from "./HashTable";
import { Queue } from "./Queue";

export class Cache {
    public misses: number;

    public hits: number;

    public capacity: number;

    public remaining: number;

    public hashTable: HashTable;

    public queue: Queue = new Queue();

    public constructor(size: number) {
        if (this.misses === undefined) { this.misses = 0; }
        if (this.hits === undefined) { this.hits = 0; }
        if (this.capacity === undefined) { this.capacity = 0; }
        if (this.remaining === undefined) { this.remaining = 0; }
        if (this.hashTable === undefined) { this.hashTable = null; }
        this.capacity = size;
        this.remaining = size;
        this.hashTable = new HashTable(1024);
    }

    public get(id: number): CacheableNode {
        const cacheablenode: CacheableNode = this.hashTable.get(id) as CacheableNode;
        if (cacheablenode != null) {
            this.queue.push(cacheablenode);
        }
        return cacheablenode;
    }

    public put(cacheableNode: CacheableNode, id: number) {
        if (this.remaining === 0) {
            const oldestNode: CacheableNode = this.queue.pop();
            oldestNode.remove();
            oldestNode.clear();
        } else {
            this.remaining--;
        }
        this.hashTable.put(cacheableNode, id);
        this.queue.push(cacheableNode);
    }

    public removeAll() {
        do {{
            const node: CacheableNode = this.queue.pop();
            if (node != null) {
                node.remove();
                node.clear();
            } else {
                this.remaining = this.capacity;
                return;
            }
        }} while ((true));
    }
}

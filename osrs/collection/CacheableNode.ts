/* Generated from Java with JSweet 2.3.0 - http://www.jsweet.org */
import { Node } from "./Node";

export class CacheableNode extends Node {

    public next: CacheableNode;

    public prev: CacheableNode;

    public constructor() {
        super();
        if (this.next === undefined) { this.next = null; }
        if (this.prev === undefined) { this.prev = null; }
    }
    public clear() {
        if (this.prev == null) {
            return;
        } else {
            this.prev.next = this.next;
            this.next.prev = this.prev;
            this.next = null;
            this.prev = null;
            return;
        }
    }
}

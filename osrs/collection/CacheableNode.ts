/* Generated from Java with JSweet 2.3.0 - http://www.jsweet.org */
import { Node } from "./Node";

export class CacheableNode extends Node {

    public cacheNext: CacheableNode = null;

    public cachePrevious: CacheableNode = null;

    public constructor() {
        super();
        if (this.cacheNext === undefined) { this.cacheNext = null; }
        if (this.cachePrevious === undefined) { this.cachePrevious = null; }
    }
    public clear() {
        if (this.cachePrevious == null) {
            return;
        } else {
            this.cachePrevious.next = this.next;
            this.cacheNext.cachePrevious = this.cachePrevious;
            this.cacheNext = null;
            this.cachePrevious = null;
            return;
        }
    }
}

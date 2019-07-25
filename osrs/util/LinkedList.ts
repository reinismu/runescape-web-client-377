/* Generated from Java with JSweet 2.3.0 - http://www.jsweet.org */
import { Node } from "../collection/Node";

export class LinkedList {
    public head: Node = new Node();

    public current: Node;

    public constructor() {
        if (this.current === undefined) { this.current = null; }
        this.head.next = this.head;
        this.head.previous = this.head;
    }

    public insertBack(node: Node) {
        if (node.previous != null) { node.remove(); }
        node.previous = this.head.previous;
        node.next = this.head;
        node.previous.next = node;
        node.next.previous = node;
    }

    public addFirst(node: Node) {
        if (node.previous != null) { node.remove(); }
        node.previous = this.head;
        node.next = this.head.next;
        node.previous.next = node;
        node.next.previous = node;
    }

    public removeFirst(): Node {
        const node: Node = this.head.next;
        if (node === this.head) {
            return null;
        } else {
            node.remove();
            return node;
        }
    }

    public first(): Node {
        const node: Node = this.head.next;
        if (node === this.head) {
            this.current = null;
            return null;
        } else {
            this.current = node.next;
            return node;
        }
    }

    public last(): Node {
        const node: Node = this.head.previous;
        if (node === this.head) {
            this.current = null;
            return null;
        } else {
            this.current = node.previous;
            return node;
        }
    }

    public next(): Node {
        const node: Node = this.current;
        if (node === this.head) {
            this.current = null;
            return null;
        }
        this.current = node.next;
        return node;
    }

    public previous(): Node {
        const node: Node = this.current;
        if (node === this.head) {
            this.current = null;
            return null;
        } else {
            this.current = node.previous;
            return node;
        }
    }

    public getNodeCount() {
        if (this.head.next === this.head) { return; }
        do {{
            const node: Node = this.head.next;
            if (node === this.head) { return; }
            node.remove();
        }} while ((true));
    }
}

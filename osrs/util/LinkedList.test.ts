import { LinkedList } from "./LinkedList";
import { Node } from "../collection/Node";
import { OnDemandNode } from "../net/requester/OnDemandNode";



test("Can insetBack get first and last", () => {
    const list = new LinkedList();
    const firstNode = createNode(1);
    const lastNode = createNode(3);
    list.insertBack(firstNode);
    list.insertBack(createNode(2));
    list.insertBack(lastNode);
    expect(list.first()).toBe(firstNode);
    expect(list.last()).toBe(lastNode);
});

test("Can addFirst get first and last", () => {
    const list = new LinkedList();
    const firstNode = createNode(1);
    const lastNode = createNode(3);
    list.addFirst(lastNode);
    list.addFirst(createNode(2));
    list.addFirst(firstNode);
    expect(list.last()).toBe(lastNode);
    expect(list.first()).toBe(firstNode);
});

test("Can iterate through all nodes", () => {
    const list = new LinkedList();
    const firstNode = createNode(1);
    const secondNode = createNode(2);
    const thirdNode = createNode(2);
    list.insertBack(firstNode);
    list.insertBack(secondNode);
    list.insertBack(thirdNode);
    const nodes = [];
    for (
        let node: Node = list.first() as OnDemandNode;
        node != null;
        node = list.next() as OnDemandNode
    ) {
        nodes.push(node);
    }
    expect(nodes.length).toBe(3);
    expect(nodes[0]).toBe(firstNode);
    expect(nodes[1]).toBe(secondNode);
    expect(nodes[2]).toBe(thirdNode);
});

test("Can iterate through while removing", () => {
    const list = new LinkedList();
    const firstNode = createNode(1);
    const secondNode = createNode(2);
    const thirdNode = createNode(2);
    list.insertBack(firstNode);
    list.insertBack(secondNode);
    list.insertBack(thirdNode);
    const nodes = [];
    let onDemandNode = list.removeFirst() as OnDemandNode;
    while (onDemandNode != null && onDemandNode instanceof OnDemandNode) {
        nodes.push(onDemandNode);
        onDemandNode = list.removeFirst() as OnDemandNode;
    }

    expect(list.first()).toBe(null);
    expect(nodes.length).toBe(3);
    expect(nodes[0]).toBe(firstNode);
    expect(nodes[1]).toBe(secondNode);
    expect(nodes[2]).toBe(thirdNode);
});

test("Can iterate through while removing and changing", () => {
    const list = new LinkedList();
    const firstNode = createNode(1);
    const secondNode = createNode(2);
    const thirdNode = createNode(2);
    list.insertBack(firstNode);
    list.insertBack(secondNode);
    list.insertBack(thirdNode);
    const nodes = [];
    let onDemandNode = list.removeFirst() as OnDemandNode;
    while (onDemandNode != null && onDemandNode instanceof OnDemandNode) {
        onDemandNode.id = 5;
        nodes.push(onDemandNode);
        onDemandNode = list.removeFirst() as OnDemandNode;
    }

    expect(list.first()).toBe(null);
    expect(nodes.length).toBe(3);
    expect(nodes[0]).toBe(firstNode);
    expect(nodes[1]).toBe(secondNode);
    expect(nodes[2]).toBe(thirdNode);
});

function createNode(id: number): OnDemandNode {
    const node = new OnDemandNode()
    node.id = id;
    return node;
}
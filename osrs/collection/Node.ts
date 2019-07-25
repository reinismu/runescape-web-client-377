export class Node {
  public id: number;

  public next: Node;

  public previous: Node;

  constructor() {
    if (this.id === undefined) {
      this.id = 0;
    }
    if (this.next === undefined) {
      this.next = null;
    }
    if (this.previous === undefined) {
      this.previous = null;
    }
  }

  public remove() {
    if (this.previous != null) {
      this.previous.next = this.next;
      this.next.previous = this.previous;
      this.next = null;
      this.previous = null;
    }
  }
}

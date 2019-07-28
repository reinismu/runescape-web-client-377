export class Node {
  public id: number = 0;

  public next: Node = null;

  public previous: Node = null;

  public remove() {
    if (this.previous != null) {
      this.previous.next = this.next;
      this.next.previous = this.previous;
      this.next = null;
      this.previous = null;
    }
  }
}

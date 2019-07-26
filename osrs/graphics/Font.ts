export class Font {
    name: string;
    type: number;
    size: number;

    constructor(name: string, type: number, size: number) {
        this.name = name;
        this.type = type;
        this.size = size;
    }

    public toCanvasFont(): string {
        return `${this.getType()} ${this.size}px ${this.name}`;
    }

    getType(): string {
        if (this.type == 1) {
            return "bold";
        } else if (this.type == 2) {
            return "italic";
        }
        return "normal";
    }
}

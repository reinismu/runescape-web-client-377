export class Color {
    public static white = new Color(255, 255, 255);
    public static WHITE = Color.white;

    public static lightGray = new Color(192, 192, 192);
    public static LIGHT_GRAY = Color.lightGray;

    public static gray = new Color(128, 128, 128);
    public static GRAY = Color.gray;

    public static darkGray = new Color(64, 64, 64);
    public static DARK_GRAY = Color.darkGray;

    public static black = new Color(0, 0, 0);
    public static BLACK = Color.black;

    public static red = new Color(255, 0, 0);
    public static RED = Color.red;

    public static pink = new Color(255, 175, 175);
    public static PINK = Color.pink;

    public static orange = new Color(255, 200, 0);
    public static ORANGE = Color.orange;

    public static yellow = new Color(255, 255, 0);
    public static YELLOW = Color.yellow;

    public static green = new Color(0, 255, 0);
    public static GREEN = Color.green;

    public static magenta = new Color(255, 0, 255);
    public static MAGENTA = Color.magenta;

    public static cyan = new Color(0, 255, 255);
    public static CYAN = Color.cyan;

    public static blue = new Color(0, 0, 255);
    public static BLUE = Color.blue;

    r: number;
    g: number;
    b: number;
    a: number;
    constructor(r: number, g: number, b: number, a: number = 255) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }

    public toCanvasStyle(): string {
        return `rgba(${this.r},${this.g}, ${this.b}, ${this.a})`;
    }
}

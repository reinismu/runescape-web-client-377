import { ImageRGB } from "./cache/media/ImageRGB";
import { ProducingGraphicsBuffer } from "./media/ProducingGraphicsBuffer";
import { Graphics } from "./graphics/Graphics";
import { Font } from "./graphics/Font";
import { Color } from "./graphics/Color";

interface LoopData {
    opos: number;
    ratio: number;
    del: number;
    count: number;
    intex: number;
}

export class GameShell {
    canvas: HTMLCanvasElement;

    /*private*/ public gameState: number = 0;

    /*private*/ public deltime: number = 20;

    public mindel: number = 1;

    /*private*/ public optims: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    public fps: number = 0;

    public dumpRequested: boolean = false;

    public width: number = 0;

    public height: number = 0;

    public gameGraphics: Graphics;

    public imageProducer: ProducingGraphicsBuffer;

    public aClass50_Sub1_Sub1_Sub1Array16: ImageRGB[] = [null, null, null, null, null, null];

    // public gameFrame: GameFrame;

    public clearScreen: boolean = true;

    public awtFocus: boolean = true;

    public idleTime: number = 0;

    public mouseButtonPressed: number;

    public mouseX: number = 0;

    public mouseY: number = 0;

    public eventMouseButtonPressed: number = 0;

    public eventClickX: number = 0;

    public eventClickY: number = 0;

    public lastClick: number = 0;

    public clickType: number = 0;

    public clickX: number = 0;

    public clickY: number = 0;

    public clickTime: number = 0;

    public keyStatus: number[] = (s => {
        const a = [];
        while (s-- > 0) {
            a.push(0);
        }
        return a;
    })(128);

    /*private*/ public inputBuffer: number[] = (s => {
        const a = [];
        while (s-- > 0) {
            a.push(0);
        }
        return a;
    })(128);

    /*private*/ public readIndex: number = 0;

    /*private*/ public writeIndex: number = 0;

    public mouseWheelDown: boolean = false;

    public mouseWheelX: number = 0;

    public mouseWheelY: number = 0;

    public loopData: LoopData = {
        opos: 0,
        ratio: 256,
        del: 1,
        count: 0,
        intex: 0
    };
    public runInitialized = false;
    mainLoopBound = this.mainLoop.bind(this);

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.gameGraphics = new Graphics(canvas);
    }

    public async initializeApplication(_width: number, _height: number) {
        this.width = _width;
        this.height = _height;
        // this.gameFrame = new GameFrame(this, this.width, this.height);
        this.gameGraphics = new Graphics(this.canvas);
        this.imageProducer = new ProducingGraphicsBuffer(this.width, this.height);
        await this.run();
    }

    public async run() {
        if (!this.runInitialized) {
            this.runInitialized = true;
            this.canvas.addEventListener("mousedown", this.mousePressed.bind(this));
            this.canvas.addEventListener("mouseup", this.mouseReleased.bind(this));
            this.canvas.addEventListener("dragstart", this.mouseDragged.bind(this));
            this.canvas.addEventListener("mouseleave", this.mouseExited.bind(this));
            this.canvas.addEventListener("mousemove", this.mouseMoved.bind(this));

            this.canvas.addEventListener("keydown", this.keyPressed.bind(this));
            this.canvas.addEventListener("keyup", this.keyReleased.bind(this));

            // this.getParentComponent().addMouseListener(this);
            // this.getParentComponent().addMouseMotionListener(this);
            // this.getParentComponent().addKeyListener(this);
            // this.getParentComponent().addFocusListener(this);
            // if (this.gameFrame != null) { this.gameFrame.addWindowListener(this); }
            await this.drawLoadingText(0, "Loading...");
            await this.startUp();

            for (let optim: number = 0; optim < 10; optim++) {
                this.optims[optim] = new Date().getTime();
            }
        }
        this.mainLoop();
    }

    public async mainLoop() {
        const ld = this.loopData;
        if (this.gameState > 0) {
            this.gameState--;
            if (this.gameState === 0) {
                this.exit();
                return;
            }
        }
        ld.ratio = 300;
        ld.del = 1;
        const currentTime: number = new Date().getTime();
        if (currentTime > this.optims[ld.opos]) {
            ld.ratio =
                ((n => (n < 0 ? Math.ceil(n) : Math.floor(n)))((2560 * this.deltime) / (currentTime - this.optims[ld.opos])) as number) | 0;
        }
        if (ld.ratio < 25) {
            ld.ratio = 25;
        }
        if (ld.ratio > 256) {
            ld.ratio = 256;
            ld.del =
                ((this.deltime - (n => (n < 0 ? Math.ceil(n) : Math.floor(n)))((currentTime - this.optims[ld.opos]) / 10)) as number) | 0;
        }
        if (ld.del > this.deltime) {
            ld.del = this.deltime;
        }
        this.optims[ld.opos] = currentTime;
        ld.opos = (ld.opos + 1) % 10;
        if (ld.del > 1) {
            for (let optim: number = 0; optim < 10; optim++) {
                if (this.optims[optim] !== 0) {
                    this.optims[optim] += ld.del;
                }
            }
        }
        if (ld.del < this.mindel) {
            ld.del = this.mindel;
        }

        for (; ld.count < 256; ld.count += ld.ratio) {
            {
                this.clickType = this.eventMouseButtonPressed;
                this.clickX = this.eventClickX;
                this.clickY = this.eventClickY;
                this.clickTime = this.lastClick;
                this.eventMouseButtonPressed = 0;
                await this.doLogic();
                this.readIndex = this.writeIndex;
            }
        }
        ld.count &= 255;
        if (this.deltime > 0) {
            this.fps = ((1000 * ld.ratio) / (this.deltime * 256)) | 0;
        }
        this.repaintGame();
        if (this.dumpRequested) {
            console.info("ntime:" + currentTime);
            for (let i: number = 0; i < 10; i++) {
                {
                    const optim: number = (ld.opos - i - 1 + 20) % 10;
                    console.info("otim" + optim + ":" + this.optims[optim]);
                }
            }
            console.info("fps:" + this.fps + " ratio:" + ld.ratio + " count:" + ld.count);
            console.info("del:" + ld.del + " deltime:" + this.deltime + " mindel:" + this.mindel);
            console.info("intex:" + ld.intex + " opos:" + ld.opos);
            this.dumpRequested = false;
            ld.intex = 0;
        }

        if (this.gameState === -1) {
            this.exit();
        } else if (this.gameState >= 0) {
            setTimeout(this.mainLoopBound, ld.del);
        }
    }

    public exit() {
        this.gameState = -2;
        this.shutdown();
    }

    public setFrameRate(i: number) {
        this.deltime = (1000 / i) | 0;
    }

    /**
     *
     */
    public start() {
        if (this.gameState >= 0) {
            this.gameState = 0;
        }
    }

    public stop() {
        if (this.gameState >= 0) {
            this.gameState = (4000 / this.deltime) | 0;
        }
    }

    public destroy() {
        this.gameState = -1;
        this.exit();
    }

    /**
     *
     * @param {Graphics} graphics
     */
    public update(graphics: Graphics) {
        if (this.gameGraphics == null) {
            this.gameGraphics = graphics;
        }
        this.clearScreen = true;
        this.redraw();
    }

    /**
     *
     * @param {Graphics} graphics
     */
    public paint(graphics: Graphics) {
        if (this.gameGraphics == null) {
            this.gameGraphics = graphics;
        }
        this.clearScreen = true;
        this.redraw();
    }

    public mousePressed(mouseevent: MouseEvent) {
        let mouseX: number = mouseevent.offsetX;
        let mouseY: number = mouseevent.offsetY;

        this.idleTime = 0;
        this.eventClickX = mouseX;
        this.eventClickY = mouseY;
        this.lastClick = new Date().getTime();
        if (mouseevent.button === 1) {
            this.mouseWheelDown = true;
            this.mouseWheelX = mouseX;
            this.mouseWheelY = mouseY;
            return;
        }
        if (mouseevent.metaKey) {
            this.eventMouseButtonPressed = 2;
            this.mouseButtonPressed = 2;
        } else {
            this.eventMouseButtonPressed = 1;
            this.mouseButtonPressed = 1;
        }
    }

    public mouseReleased(mouseevent: MouseEvent) {
        this.idleTime = 0;
        this.mouseButtonPressed = 0;
        this.mouseWheelDown = false;
    }

    public mouseExited(mouseevent: MouseEvent) {
        this.idleTime = 0;
        this.mouseX = -1;
        this.mouseY = -1;
    }

    public mouseDragged(mouseevent: DragEvent) {
        let mouseX: number = mouseevent.offsetX;
        let mouseY: number = mouseevent.offsetY;

        if (this.mouseWheelDown) {
            mouseY = this.mouseWheelX - mouseevent.x;
            const k: number = this.mouseWheelY - mouseevent.y;
            this.mouseWheelDragged(mouseY, -k);
            this.mouseWheelX = mouseevent.x;
            this.mouseWheelY = mouseevent.y;
            return;
        }
        this.idleTime = 0;
        this.mouseX = mouseX;
        this.mouseY = mouseY;
    }

    public mouseWheelDragged(param1: number, param2: number) {}

    public mouseMoved(mouseevent: MouseEvent) {
        let mouseX: number = mouseevent.offsetX;
        let mouseY: number = mouseevent.offsetY;
        
        this.idleTime = 0;
        this.mouseX = mouseX;
        this.mouseY = mouseY;
    }

    public keyPressed(event: KeyboardEvent) {
        this.idleTime = 0;
        const keyCode: number = event.keyCode;
        let keyChar: number = (event.key.length == 1) ? event.key.charCodeAt(0) : keyCode;
        if (keyChar < 30) {
            keyChar = 0;
        }
        if (keyCode === 37) {
            keyChar = 1;
        }
        if (keyCode === 13) {
            keyChar = 13;
        }
        if (keyCode === 39) {
            keyChar = 2;
        }
        if (keyCode === 38) {
            keyChar = 3;
        }
        if (keyCode === 40) {
            keyChar = 4;
        }
        if (keyCode === 17) {
            keyChar = 5;
        }
        if (keyCode === 8) {
            keyChar = 8;
        }
        if (keyCode === 127) {
            keyChar = 8;
        }
        if (keyCode === 9) {
            keyChar = 9;
        }
        if (keyCode === 10) {
            keyChar = 10;
        }
        if (keyCode >= 112 && keyCode <= 123) {
            keyChar = 1008 + keyCode - 112;
        }
        if (keyCode === 36) {
            keyChar = 1000;
        }
        if (keyCode === 35) {
            keyChar = 1001;
        }
        if (keyCode === 33) {
            keyChar = 1002;
        }
        if (keyCode === 34) {
            keyChar = 1003;
        }
        if (keyChar > 0 && keyChar < 128) {
            this.keyStatus[keyChar] = 1;
        }
        if (keyChar > 4) {
            this.inputBuffer[this.writeIndex] = keyChar;
            this.writeIndex = (this.writeIndex + 1) & 127;
        }
    }

    public keyReleased(event: KeyboardEvent) {
        this.idleTime = 0;
        const keyCode: number = event.keyCode;
        let keyChar: number = (event.key.length == 1) ? event.key.charCodeAt(0) : keyCode;
        if (keyChar < 36) {
            keyChar = 0;
        }
        if (keyCode === 37) {
            keyChar = 1;
        }
        if (keyCode === 39) {
            keyChar = 2;
        }
        if (keyCode === 38) {
            keyChar = 3;
        }
        if (keyCode === 40) {
            keyChar = 4;
        }
        if (keyCode === 17) {
            keyChar = 5;
        }
        if (keyCode === 8) {
            keyChar = 8;
        }
        if (keyCode === 127) {
            keyChar = 8;
        }
        if (keyCode === 9) {
            keyChar = 9;
        }
        if (keyCode === 10) {
            keyChar = 10;
        }
        if (keyChar > 0 && keyChar < 128) {
            this.keyStatus[keyChar] = 0;
        }
    }

    public keyTyped(KeyboardEvent: KeyboardEvent) {}

    public readCharacter(): number {
        let character: number = -1;
        if (this.writeIndex !== this.readIndex) {
            character = this.inputBuffer[this.readIndex];
            this.readIndex = (this.readIndex + 1) & 127;
        }
        return character;
    }

    public focusGained(focusevent: FocusEvent) {
        this.awtFocus = true;
        this.clearScreen = true;
        this.redraw();
    }

    public focusLost(focusevent: FocusEvent) {
        this.awtFocus = false;
        for (let key: number = 0; key < 128; key++) {
            this.keyStatus[key] = 0;
        }
    }

    public async startUp() {}

    public async doLogic() {}

    public shutdown() {}

    public repaintGame() {}

    public redraw() {}

    public getParentComponent(): any {
        // if (this.gameFrame != null) { return this.gameFrame; } else { return this; }
    }

    public async drawLoadingText(percent: number, desc: string) {
        const helveticaBold: Font = new Font("Helvetica", 1, 13);

        if (this.clearScreen) {
            this.gameGraphics.setColor(Color.black);
            this.gameGraphics.fillRect(0, 0, this.width, this.height);
            this.clearScreen = false;
        }
        const color: Color = new Color(140, 17, 17);
        const centerHeight: number = ((this.height / 2) | 0) - 18;
        this.gameGraphics.setColor(color);
        this.gameGraphics.drawRect(((this.width / 2) | 0) - 152, centerHeight, 304, 34);
        this.gameGraphics.fillRect(((this.width / 2) | 0) - 150, centerHeight + 2, percent * 3, 30);
        this.gameGraphics.setColor(Color.black);
        this.gameGraphics.fillRect(((this.width / 2) | 0) - 150 + percent * 3, centerHeight + 2, 300 - percent * 3, 30);
        this.gameGraphics.setFont(helveticaBold);
        this.gameGraphics.setColor(Color.white);
        this.gameGraphics.drawString(desc, ((this.width - this.gameGraphics.measureTextWidth(desc)) / 2) | 0, centerHeight + 22);
    }
}

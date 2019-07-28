import { AnimationSequence } from "../../../cache/media/AnimationSequence";
import { Renderable } from "../Renderable";

export abstract class Actor extends Renderable {
    public forcedChat: string;

    public textCycle: number = 100;

    public textColour: number;

    public nextStepOrientation: number;

    public pulseCycle: number;

    public pathX: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    public pathY: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    public movementAnimation: number = -1;

    public displayedMovementFrames: number;

    public anInt1590: number;

    public runningQueue: boolean[] = [false, false, false, false, false, false, false, false, false, false];

    public aBoolean1592: boolean = false;

    public textEffect: number;

    public modelHeight: number = 200;

    public endCycle: number = -1000;

    public anInt1596: number;

    public anInt1597: number;

    public anInt1598: number;

    public anInt1599: number;

    public anInt1600: number = 32;

    public boundaryDimension: number = 1;

    public anInt1602: number;

    public anInt1603: number;

    public anInt1604: number;

    public anInt1605: number;

    public anInt1606: number;

    public anInt1607: number;

    public anInt1608: number;

    public anInt1609: number = -1;

    public worldX: number;

    public worldY: number;

    public anInt1612: number;

    public anInt1613: number;

    public graphic: number = -1;

    public currentAnimation: number;

    public anInt1616: number;

    public anInt1617: number;

    public spotAnimationDelay: number;

    public walkAnimationId: number = -1;

    public turnAroundAnimationId: number = -1;

    public turnRightAnimationId: number = -1;

    public turnLeftAnimationId: number = -1;

    public anInt1623: number;

    public emoteAnimation: number = -1;

    public displayedEmoteFrames: number;

    public anInt1626: number;

    public animationDelay: number;

    public anInt1628: number;

    public runAnimationId: number = -1;

    public hitDamages: number[] = [0, 0, 0, 0];

    public hitTypes: number[] = [0, 0, 0, 0];

    public hitCycles: number[] = [0, 0, 0, 0];

    public pathLength: number;

    public idleAnimation: number = -1;

    public standTurnAnimationId: number = -1;

    constructor() {
        super();
        if (this.forcedChat === undefined) { this.forcedChat = null; }
        if (this.textColour === undefined) { this.textColour = 0; }
        if (this.nextStepOrientation === undefined) { this.nextStepOrientation = 0; }
        if (this.pulseCycle === undefined) { this.pulseCycle = 0; }
        if (this.displayedMovementFrames === undefined) { this.displayedMovementFrames = 0; }
        if (this.anInt1590 === undefined) { this.anInt1590 = 0; }
        if (this.textEffect === undefined) { this.textEffect = 0; }
        if (this.anInt1596 === undefined) { this.anInt1596 = 0; }
        if (this.anInt1597 === undefined) { this.anInt1597 = 0; }
        if (this.anInt1598 === undefined) { this.anInt1598 = 0; }
        if (this.anInt1599 === undefined) { this.anInt1599 = 0; }
        if (this.anInt1602 === undefined) { this.anInt1602 = 0; }
        if (this.anInt1603 === undefined) { this.anInt1603 = 0; }
        if (this.anInt1604 === undefined) { this.anInt1604 = 0; }
        if (this.anInt1605 === undefined) { this.anInt1605 = 0; }
        if (this.anInt1606 === undefined) { this.anInt1606 = 0; }
        if (this.anInt1607 === undefined) { this.anInt1607 = 0; }
        if (this.anInt1608 === undefined) { this.anInt1608 = 0; }
        if (this.worldX === undefined) { this.worldX = 0; }
        if (this.worldY === undefined) { this.worldY = 0; }
        if (this.anInt1612 === undefined) { this.anInt1612 = 0; }
        if (this.anInt1613 === undefined) { this.anInt1613 = 0; }
        if (this.currentAnimation === undefined) { this.currentAnimation = 0; }
        if (this.anInt1616 === undefined) { this.anInt1616 = 0; }
        if (this.anInt1617 === undefined) { this.anInt1617 = 0; }
        if (this.spotAnimationDelay === undefined) { this.spotAnimationDelay = 0; }
        if (this.anInt1623 === undefined) { this.anInt1623 = 0; }
        if (this.displayedEmoteFrames === undefined) { this.displayedEmoteFrames = 0; }
        if (this.anInt1626 === undefined) { this.anInt1626 = 0; }
        if (this.animationDelay === undefined) { this.animationDelay = 0; }
        if (this.anInt1628 === undefined) { this.anInt1628 = 0; }
        if (this.pathLength === undefined) { this.pathLength = 0; }
    }

    public resetPath() {
        this.pathLength = 0;
        this.anInt1613 = 0;
    }

    public isVisible(): boolean {
        return false;
    }

    public move(direction: number, running: boolean) {
        let x: number = this.pathX[0];
        let y: number = this.pathY[0];
        if (direction === 0) {
            x--;
            y++;
        }
        if (direction === 1) { y++; }
        if (direction === 2) {
            x++;
            y++;
        }
        if (direction === 3) { x--; }
        if (direction === 4) { x++; }
        if (direction === 5) {
            x--;
            y--;
        }
        if (direction === 6) { y--; }
        if (direction === 7) {
            x++;
            y--;
        }
        if (this.emoteAnimation !== -1 && AnimationSequence.animations[this.emoteAnimation].priority === 1) { this.emoteAnimation = -1; }
        if (this.pathLength < 9) { this.pathLength++; }
        for (let pos: number = this.pathLength; pos > 0; pos--) {{
            this.pathX[pos] = this.pathX[pos - 1];
            this.pathY[pos] = this.pathY[pos - 1];
            this.runningQueue[pos] = this.runningQueue[pos - 1];
        }}
        this.pathX[0] = x;
        this.pathY[0] = y;
        this.runningQueue[0] = running;
    }

    public updateHits(hitType: number, hitDamage: number, hitCycle: number) {
        for (let hit: number = 0; hit < 4; hit++) {if (this.hitCycles[hit] <= hitCycle) {
            this.hitDamages[hit] = hitDamage;
            this.hitTypes[hit] = hitType;
            this.hitCycles[hit] = hitCycle + 70;
            return;
        }}
    }

    public setPosition(x: number, y: number, discard: boolean) {
        if (this.emoteAnimation !== -1 && AnimationSequence.animations[this.emoteAnimation].priority === 1) { this.emoteAnimation = -1; }
        if (!discard) {
            const k: number = x - this.pathX[0];
            const i1: number = y - this.pathY[0];
            if (k >= -8 && k <= 8 && i1 >= -8 && i1 <= 8) {
                if (this.pathLength < 9) { this.pathLength++; }
                for (let j1: number = this.pathLength; j1 > 0; j1--) {{
                    this.pathX[j1] = this.pathX[j1 - 1];
                    this.pathY[j1] = this.pathY[j1 - 1];
                    this.runningQueue[j1] = this.runningQueue[j1 - 1];
                }}
                this.pathX[0] = x;
                this.pathY[0] = y;
                this.runningQueue[0] = false;
                return;
            }
        }
        this.pathLength = 0;
        this.anInt1613 = 0;
        this.anInt1623 = 0;
        this.pathX[0] = x;
        this.pathY[0] = y;
        this.worldX = this.pathX[0] * 128 + this.boundaryDimension * 64;
        this.worldY = this.pathY[0] * 128 + this.boundaryDimension * 64;
    }
}

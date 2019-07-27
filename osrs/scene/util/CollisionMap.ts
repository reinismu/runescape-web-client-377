export class CollisionMap {
    public insetX: number;

    public insetY: number;

    public width: number;

    public height: number;

    public adjacency: number[][];

    public constructor(height: number, width: number) {
        if (this.insetX === undefined) { this.insetX = 0; }
        if (this.insetY === undefined) { this.insetY = 0; }
        if (this.width === undefined) { this.width = 0; }
        if (this.height === undefined) { this.height = 0; }
        if (this.adjacency === undefined) { this.adjacency = null; }
        this.insetX = 0;
        this.insetY = 0;
        this.width = width;
        this.height = height;
        this.adjacency = (function(dims) { const allocate = function(dims) { if (dims.length == 0) { return 0; } else { const array = []; for (let i = 0; i < dims[0]; i++) { array.push(allocate(dims.slice(1))); } return array; }}; return allocate(dims); })([width, height]) as any;
        this.reset();
    }

    public reset() {
        for (let x: number = 0; x < this.width; x++) {{
            for (let y: number = 0; y < this.height; y++) {if (x === 0 || y === 0 || x === this.width - 1 || y === this.height - 1) { this.adjacency[x][y] = 16777215; } else { this.adjacency[x][y] = 16777216; }}
        }}
    }

    public markWall(x: number, y: number, position: number, orientation: number, impenetrable: boolean) {
        x -= this.insetX;
        y -= this.insetY;
        if (position === 0) {
            if (orientation === 0) {
                this.set(x, y, 128);
                this.set(x - 1, y, 8);
            }
            if (orientation === 1) {
                this.set(x, y, 2);
                this.set(x, y + 1, 32);
            }
            if (orientation === 2) {
                this.set(x, y, 8);
                this.set(x + 1, y, 128);
            }
            if (orientation === 3) {
                this.set(x, y, 32);
                this.set(x, y - 1, 2);
            }
        }
        if (position === 1 || position === 3) {
            if (orientation === 0) {
                this.set(x, y, 1);
                this.set(x - 1, y + 1, 16);
            }
            if (orientation === 1) {
                this.set(x, y, 4);
                this.set(x + 1, y + 1, 64);
            }
            if (orientation === 2) {
                this.set(x, y, 16);
                this.set(x + 1, y - 1, 1);
            }
            if (orientation === 3) {
                this.set(x, y, 64);
                this.set(x - 1, y - 1, 4);
            }
        }
        if (position === 2) {
            if (orientation === 0) {
                this.set(x, y, 130);
                this.set(x - 1, y, 8);
                this.set(x, y + 1, 32);
            }
            if (orientation === 1) {
                this.set(x, y, 10);
                this.set(x, y + 1, 32);
                this.set(x + 1, y, 128);
            }
            if (orientation === 2) {
                this.set(x, y, 40);
                this.set(x + 1, y, 128);
                this.set(x, y - 1, 2);
            }
            if (orientation === 3) {
                this.set(x, y, 160);
                this.set(x, y - 1, 2);
                this.set(x - 1, y, 8);
            }
        }
        if (impenetrable) {
            if (position === 0) {
                if (orientation === 0) {
                    this.set(x, y, 65536);
                    this.set(x - 1, y, 4096);
                }
                if (orientation === 1) {
                    this.set(x, y, 1024);
                    this.set(x, y + 1, 16384);
                }
                if (orientation === 2) {
                    this.set(x, y, 4096);
                    this.set(x + 1, y, 65536);
                }
                if (orientation === 3) {
                    this.set(x, y, 16384);
                    this.set(x, y - 1, 1024);
                }
            }
            if (position === 1 || position === 3) {
                if (orientation === 0) {
                    this.set(x, y, 512);
                    this.set(x - 1, y + 1, 8192);
                }
                if (orientation === 1) {
                    this.set(x, y, 2048);
                    this.set(x + 1, y + 1, 32768);
                }
                if (orientation === 2) {
                    this.set(x, y, 8192);
                    this.set(x + 1, y - 1, 512);
                }
                if (orientation === 3) {
                    this.set(x, y, 32768);
                    this.set(x - 1, y - 1, 2048);
                }
            }
            if (position === 2) {
                if (orientation === 0) {
                    this.set(x, y, 66560);
                    this.set(x - 1, y, 4096);
                    this.set(x, y + 1, 16384);
                }
                if (orientation === 1) {
                    this.set(x, y, 5120);
                    this.set(x, y + 1, 16384);
                    this.set(x + 1, y, 65536);
                }
                if (orientation === 2) {
                    this.set(x, y, 20480);
                    this.set(x + 1, y, 65536);
                    this.set(x, y - 1, 1024);
                }
                if (orientation === 3) {
                    this.set(x, y, 81920);
                    this.set(x, y - 1, 1024);
                    this.set(x - 1, y, 4096);
                }
            }
        }
    }

    public method413(y: number, orient: number, h: number, w: number, impenetrable: boolean, x: number, byte0: number) {
        let occupied: number = 256;
        if (impenetrable) { occupied += 131072; }
        x -= this.insetX;
        y -= this.insetY;
        if (orient === 1 || orient === 3) {
            const tmp: number = w;
            w = h;
            h = tmp;
        }
        for (let l1: number = x; l1 < x + w; l1++) {if (l1 >= 0 && l1 < this.width) {
            for (let i2: number = y; i2 < y + h; i2++) {if (i2 >= 0 && i2 < this.height) { this.set(l1, i2, occupied); }}
        }}
    }

    public markBlocked(x: number, y: number) {
        x -= this.insetX;
        y -= this.insetY;
        this.adjacency[x][y] |= 2097152;
    }

    public set(x: number, y: number, flag: number) {
        this.adjacency[x][y] |= flag;
    }

    public unmarkWall(orientation: number, x: number, y: number, position: number, impenetrable: boolean) {
        x -= this.insetX;
        y -= this.insetY;
        if (position === 0) {
            if (orientation === 0) {
                this.unset(x, y, 128);
                this.unset(x - 1, y, 8);
            }
            if (orientation === 1) {
                this.unset(x, y, 2);
                this.unset(x, y + 1, 32);
            }
            if (orientation === 2) {
                this.unset(x, y, 8);
                this.unset(x + 1, y, 128);
            }
            if (orientation === 3) {
                this.unset(x, y, 32);
                this.unset(x, y - 1, 2);
            }
        }
        if (position === 1 || position === 3) {
            if (orientation === 0) {
                this.unset(x, y, 1);
                this.unset(x - 1, y + 1, 16);
            }
            if (orientation === 1) {
                this.unset(x, y, 4);
                this.unset(x + 1, y + 1, 64);
            }
            if (orientation === 2) {
                this.unset(x, y, 16);
                this.unset(x + 1, y - 1, 1);
            }
            if (orientation === 3) {
                this.unset(x, y, 64);
                this.unset(x - 1, y - 1, 4);
            }
        }
        if (position === 2) {
            if (orientation === 0) {
                this.unset(x, y, 130);
                this.unset(x - 1, y, 8);
                this.unset(x, y + 1, 32);
            }
            if (orientation === 1) {
                this.unset(x, y, 10);
                this.unset(x, y + 1, 32);
                this.unset(x + 1, y, 128);
            }
            if (orientation === 2) {
                this.unset(x, y, 40);
                this.unset(x + 1, y, 128);
                this.unset(x, y - 1, 2);
            }
            if (orientation === 3) {
                this.unset(x, y, 160);
                this.unset(x, y - 1, 2);
                this.unset(x - 1, y, 8);
            }
        }
        if (impenetrable) {
            if (position === 0) {
                if (orientation === 0) {
                    this.unset(x, y, 65536);
                    this.unset(x - 1, y, 4096);
                }
                if (orientation === 1) {
                    this.unset(x, y, 1024);
                    this.unset(x, y + 1, 16384);
                }
                if (orientation === 2) {
                    this.unset(x, y, 4096);
                    this.unset(x + 1, y, 65536);
                }
                if (orientation === 3) {
                    this.unset(x, y, 16384);
                    this.unset(x, y - 1, 1024);
                }
            }
            if (position === 1 || position === 3) {
                if (orientation === 0) {
                    this.unset(x, y, 512);
                    this.unset(x - 1, y + 1, 8192);
                }
                if (orientation === 1) {
                    this.unset(x, y, 2048);
                    this.unset(x + 1, y + 1, 32768);
                }
                if (orientation === 2) {
                    this.unset(x, y, 8192);
                    this.unset(x + 1, y - 1, 512);
                }
                if (orientation === 3) {
                    this.unset(x, y, 32768);
                    this.unset(x - 1, y - 1, 2048);
                }
            }
            if (position === 2) {
                if (orientation === 0) {
                    this.unset(x, y, 66560);
                    this.unset(x - 1, y, 4096);
                    this.unset(x, y + 1, 16384);
                }
                if (orientation === 1) {
                    this.unset(x, y, 5120);
                    this.unset(x, y + 1, 16384);
                    this.unset(x + 1, y, 65536);
                }
                if (orientation === 2) {
                    this.unset(x, y, 20480);
                    this.unset(x + 1, y, 65536);
                    this.unset(x, y - 1, 1024);
                }
                if (orientation === 3) {
                    this.unset(x, y, 81920);
                    this.unset(x, y - 1, 1024);
                    this.unset(x - 1, y, 4096);
                }
            }
        }
    }

    public unmarkSolidOccupant(impenetrable: number, y: number, x: number, orientation: number, height: number, flag: boolean, width: number) {
        const occupied: number = 256;
        x -= this.insetX;
        y -= this.insetY;
        if (orientation === 1 || orientation === 3) {
            const originalWidth: number = width;
            width = height;
            height = originalWidth;
        }
        for (let xCounter: number = x; xCounter < x + width; xCounter++) {if (xCounter >= 0 && xCounter < this.width) {
            for (let yCounter: number = y; yCounter < y + height; yCounter++) {if (yCounter >= 0 && yCounter < this.height) { this.unset(xCounter, yCounter, occupied); }}
        }}
    }

    public unset(x: number, y: number, flag: number) {
        this.adjacency[x][y] &= 16777215 - flag;
    }

    public unmarkConcealed(x: number, y: number) {
        x -= this.insetX;
        y -= this.insetY;
        this.adjacency[x][y] &= 14680063;
    }

    public reachedWall(currentX: number, currentY: number, goalX: number, goalY: number, goalPosition: number, goalOrientation: number): boolean {
        if (currentX === goalX && currentY === goalY) { return true; }
        currentX -= this.insetX;
        currentY -= this.insetY;
        goalX -= this.insetX;
        goalY -= this.insetY;
        if (goalPosition === 0) { if (goalOrientation === 0) {
            if (currentX === goalX - 1 && currentY === goalY) { return true; }
            if (currentX === goalX && currentY === goalY + 1 && (this.adjacency[currentX][currentY] & 19398944) === 0) { return true; }
            if (currentX === goalX && currentY === goalY - 1 && (this.adjacency[currentX][currentY] & 19398914) === 0) { return true; }
        } else if (goalOrientation === 1) {
            if (currentX === goalX && currentY === goalY + 1) { return true; }
            if (currentX === goalX - 1 && currentY === goalY && (this.adjacency[currentX][currentY] & 19398920) === 0) { return true; }
            if (currentX === goalX + 1 && currentY === goalY && (this.adjacency[currentX][currentY] & 19399040) === 0) { return true; }
        } else if (goalOrientation === 2) {
            if (currentX === goalX + 1 && currentY === goalY) { return true; }
            if (currentX === goalX && currentY === goalY + 1 && (this.adjacency[currentX][currentY] & 19398944) === 0) { return true; }
            if (currentX === goalX && currentY === goalY - 1 && (this.adjacency[currentX][currentY] & 19398914) === 0) { return true; }
        } else if (goalOrientation === 3) {
            if (currentX === goalX && currentY === goalY - 1) { return true; }
            if (currentX === goalX - 1 && currentY === goalY && (this.adjacency[currentX][currentY] & 19398920) === 0) { return true; }
            if (currentX === goalX + 1 && currentY === goalY && (this.adjacency[currentX][currentY] & 19399040) === 0) { return true; }
        }
        }
        if (goalPosition === 2) { if (goalOrientation === 0) {
            if (currentX === goalX - 1 && currentY === goalY) { return true; }
            if (currentX === goalX && currentY === goalY + 1) { return true; }
            if (currentX === goalX + 1 && currentY === goalY && (this.adjacency[currentX][currentY] & 19399040) === 0) { return true; }
            if (currentX === goalX && currentY === goalY - 1 && (this.adjacency[currentX][currentY] & 19398914) === 0) { return true; }
        } else if (goalOrientation === 1) {
            if (currentX === goalX - 1 && currentY === goalY && (this.adjacency[currentX][currentY] & 19398920) === 0) { return true; }
            if (currentX === goalX && currentY === goalY + 1) { return true; }
            if (currentX === goalX + 1 && currentY === goalY) { return true; }
            if (currentX === goalX && currentY === goalY - 1 && (this.adjacency[currentX][currentY] & 19398914) === 0) { return true; }
        } else if (goalOrientation === 2) {
            if (currentX === goalX - 1 && currentY === goalY && (this.adjacency[currentX][currentY] & 19398920) === 0) { return true; }
            if (currentX === goalX && currentY === goalY + 1 && (this.adjacency[currentX][currentY] & 19398944) === 0) { return true; }
            if (currentX === goalX + 1 && currentY === goalY) { return true; }
            if (currentX === goalX && currentY === goalY - 1) { return true; }
        } else if (goalOrientation === 3) {
            if (currentX === goalX - 1 && currentY === goalY) { return true; }
            if (currentX === goalX && currentY === goalY + 1 && (this.adjacency[currentX][currentY] & 19398944) === 0) { return true; }
            if (currentX === goalX + 1 && currentY === goalY && (this.adjacency[currentX][currentY] & 19399040) === 0) { return true; }
            if (currentX === goalX && currentY === goalY - 1) { return true; }
        }
        }
        if (goalPosition === 9) {
            if (currentX === goalX && currentY === goalY + 1 && (this.adjacency[currentX][currentY] & 32) === 0) { return true; }
            if (currentX === goalX && currentY === goalY - 1 && (this.adjacency[currentX][currentY] & 2) === 0) { return true; }
            if (currentX === goalX - 1 && currentY === goalY && (this.adjacency[currentX][currentY] & 8) === 0) { return true; }
            if (currentX === goalX + 1 && currentY === goalY && (this.adjacency[currentX][currentY] & 128) === 0) { return true; }
        }
        return false;
    }

    public reachedWallDecoration(currentX: number, currentY: number, goalX: number, goalY: number, goalPosition: number, goalOrientation: number): boolean {
        currentX -= this.insetX;
        currentY -= this.insetY;
        goalX -= this.insetX;
        goalY -= this.insetY;
        if (goalPosition === 6 || goalPosition === 7) {
            if (goalPosition === 7) { goalOrientation = goalOrientation + 2 & 3; }
            if (goalOrientation === 0) {
                if (currentX === goalX + 1 && currentY === goalY && (this.adjacency[currentX][currentY] & 128) === 0) { return true; }
                if (currentX === goalX && currentY === goalY - 1 && (this.adjacency[currentX][currentY] & 2) === 0) { return true; }
            } else if (goalOrientation === 1) {
                if (currentX === goalX - 1 && currentY === goalY && (this.adjacency[currentX][currentY] & 8) === 0) { return true; }
                if (currentX === goalX && currentY === goalY - 1 && (this.adjacency[currentX][currentY] & 2) === 0) { return true; }
            } else if (goalOrientation === 2) {
                if (currentX === goalX - 1 && currentY === goalY && (this.adjacency[currentX][currentY] & 8) === 0) { return true; }
                if (currentX === goalX && currentY === goalY + 1 && (this.adjacency[currentX][currentY] & 32) === 0) { return true; }
            } else if (goalOrientation === 3) {
                if (currentX === goalX + 1 && currentY === goalY && (this.adjacency[currentX][currentY] & 128) === 0) { return true; }
                if (currentX === goalX && currentY === goalY + 1 && (this.adjacency[currentX][currentY] & 32) === 0) { return true; }
            }
        }
        if (goalPosition === 8) {
            if (currentX === goalX && currentY === goalY + 1 && (this.adjacency[currentX][currentY] & 32) === 0) { return true; }
            if (currentX === goalX && currentY === goalY - 1 && (this.adjacency[currentX][currentY] & 2) === 0) { return true; }
            if (currentX === goalX - 1 && currentY === goalY && (this.adjacency[currentX][currentY] & 8) === 0) { return true; }
            if (currentX === goalX + 1 && currentY === goalY && (this.adjacency[currentX][currentY] & 128) === 0) { return true; }
        }
        return false;
    }

    public reachedFacingObject(currentX: number, currentY: number, goalX: number, goalY: number, goalDX: number, goalDY: number, surroundings: number): boolean {
        const goalX2: number = (goalX + goalDX) - 1;
        const goalY2: number = (goalY + goalDY) - 1;
        if (currentX >= goalX && currentX <= goalX2 && currentY >= goalY && currentY <= goalY2) { return true; }
        if (currentX === goalX - 1 && currentY >= goalY && currentY <= goalY2 && (this.adjacency[currentX - this.insetX][currentY - this.insetY] & 8) === 0 && (surroundings & 8) === 0) { return true; }
        if (currentX === goalX2 + 1 && currentY >= goalY && currentY <= goalY2 && (this.adjacency[currentX - this.insetX][currentY - this.insetY] & 128) === 0 && (surroundings & 2) === 0) { return true; }
        if (currentY === goalY - 1 && currentX >= goalX && currentX <= goalX2 && (this.adjacency[currentX - this.insetX][currentY - this.insetY] & 2) === 0 && (surroundings & 4) === 0) { return true; }
        return currentY === goalY2 + 1 && currentX >= goalX && currentX <= goalX2 && (this.adjacency[currentX - this.insetX][currentY - this.insetY] & 32) === 0 && (surroundings & 1) === 0;
    }
}

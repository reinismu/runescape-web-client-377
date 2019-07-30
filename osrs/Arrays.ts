export function array4d<T>(x: number,y: number,z: number, w: number, init: T): T[][][][] {
    return Array.from(Array(x), _ => Array.from(Array(y), _ => Array.from(Array(z), _ => Array(w).fill(init))));
}

export function array3d<T>(x: number,y: number,z: number, init: T): T[][][] {
    return Array.from(Array(x), _ => Array.from(Array(y), _ => Array(z).fill(init)));
}

export function array2d<T>(x: number,y: number, init: T): T[][] {
    return Array.from(Array(x), _ => Array(y).fill(init));
}
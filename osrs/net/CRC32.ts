import cyclic32 from "cyclic-32";

export function crc32(b: number[]): number {
    return cyclic32(Buffer.from(b));
}
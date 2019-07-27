declare module "cyclic-32" {
    function crc32(buf: Buffer);
    export = crc32;
}
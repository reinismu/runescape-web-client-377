declare module "image-pixels" {
    function pixels(data: Int8Array, options?: any): Promise<{ data: Uint8ClampedArray; width: number; height: number }>;
    export = pixels;
}

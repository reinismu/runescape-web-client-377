import { ImageRGB } from "./ImageRGB";
import { readFileSync } from "fs";

test("initialize correctly from", () => {
    const image = ImageRGB.from(200, 100);
    expect(image.pixels.length).toBe(20000);
    expect(image.width).toBe(200);
    expect(image.height).toBe(100);
}) 

// Useless to test on jest as different approach is used!
// test("initialize correctly bytes", async () => {
//     const bytes = readFileSync("test_files/index1.raw");
//     const image = await ImageRGB.fromJpg(new Int8Array(bytes));
//     expect(image.pixels.length).toBe(192649);
//     expect(image.width).toBe(383);
//     expect(image.height).toBe(503);
// }) 
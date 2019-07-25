import { Buffer } from "./Buffer";

test("can put Byte", () => {
  const buffer = new Buffer([1, 2, 3, 4]);
  expect(buffer.currentPosition).toBe(0);
  buffer.putByte(255);
  expect(buffer.currentPosition).toBe(1);
  expect(buffer.buffer).toStrictEqual([255, 2, 3, 4]);
});

test("can put String", () => {
  const buffer = new Buffer([1, 2, 3, 4]);
  expect(buffer.currentPosition).toBe(0);
  buffer.putString("hello ");
  expect(buffer.currentPosition).toBe(7);
  expect(buffer.buffer).toStrictEqual([104, 101, 108, 108, 111, 32, 10]);
});

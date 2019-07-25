import { Archive } from "./Archive";
import { readFileSync } from "fs";

jest.mock("./../../wasm/src/lib.rs", () => {
  return {
    rs_hash_string: (s: string) => {
      return 204062206;
    }
  };
});

test("can construct", () => {
  const bytes = Array.from(readFileSync("test_files/index1.raw"));
  const archive = new Archive(bytes);
  const tiles = archive.getFile("title.dat");
  expect(tiles).toBeInstanceOf(Array);
});

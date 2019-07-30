import { TextUtils } from "./TextUtils";

test("long to name works correctly", () => {
    const name = "helloworld"
    const longName = TextUtils.nameToLong(name);
    expect(TextUtils.longToName(longName)).toBe(name);
})
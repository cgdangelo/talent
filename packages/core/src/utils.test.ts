import { not } from "../src/utils";

describe("utils", () => {
  test("not", () => {
    expect(not(true)).toBe(false);
    expect(not(false)).toBe(true);
  });
});

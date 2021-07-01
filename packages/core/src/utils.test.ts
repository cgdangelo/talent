import { char, dir, dumpObject, eq, not, str } from "../src/utils";

describe("utils", () => {
  test("not", () => {
    expect(not(true)).toBe(false);
    expect(not(false)).toBe(true);
  });

  test("eq", () => {
    expect(eq(1)(1)).toBe(true);
    expect(eq(1)(0)).toBe(false);

    expect(eq("foo")("foo")).toBe(true);
    expect(eq("foo")("bar")).toBe(false);

    expect(eq({})({})).toBe(false);
  });

  test("dir", () => {
    const consoleDir = jest.spyOn(console, "dir").mockImplementation(() => {
      /* noop */
    });

    dir({})("foo");

    expect(consoleDir).toHaveBeenCalledWith("foo", {});
  });

  test("dumpObject", () => {
    const consoleDir = jest.spyOn(console, "dir").mockImplementation(() => {
      /* noop */
    });

    dumpObject("foo");

    expect(consoleDir).toHaveBeenCalledWith("foo", { depth: Infinity });
  });

  test("str", () => {
    expect(str(Buffer.from("foo"))()()).toBe("f");
    expect(str(Buffer.from("foo"))()(3)).toBe("foo");
    expect(str(Buffer.from("foo bar baz"))(4)(3)).toBe("bar");
  });

  test("char", () => {
    expect(char(Buffer.from("foo"))()).toBe("f");
    expect(char(Buffer.from("foo"))(1)).toBe("o");
    expect(char(Buffer.from("foo"))(2)).toBe("o");
  });
});

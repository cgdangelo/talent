import { dir, dumpObject, eq, not } from "../src/utils";

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

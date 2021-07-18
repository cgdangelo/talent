import { either as E } from "fp-ts";
import { char, int32_le, str, uint32_le } from "../src/parser";

test("str", () => {
  expect(str(Buffer.from("foo"))()()).toBe("f");
  expect(str(Buffer.from("foo"))()(3)).toBe("foo");
  expect(str(Buffer.from("foo bar baz"))(4)(3)).toBe("bar");
});

test("char", () => {
  expect(char(Buffer.from("foo"))()).toEqual(E.right("f"));
  expect(char(Buffer.from("foo"))(1)).toEqual(E.right("o"));
  expect(char(Buffer.from("foo"))(2)).toEqual(E.right("o"));
  expect(char(Buffer.from("foo"))(-1)).toEqual(E.left(expect.any(Error)));
});

test("uint32_le", () => {
  expect(uint32_le(Buffer.of(0, 0, 0, 1))()).toEqual(E.right(16777216));
});

test("int32_le", () => {
  expect(int32_le(Buffer.of(0, 0, 0, -1))()).toEqual(E.right(-16777216));
});

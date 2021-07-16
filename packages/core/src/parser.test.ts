import { either as E } from "fp-ts";
import { char, str } from "../src/parser";

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

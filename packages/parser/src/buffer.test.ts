import * as B from "./buffer";
import { of as stream } from "./Stream";
import { failure, success } from "./ParseResult";

test("str", () => {
  const buffer = Buffer.from("foo");

  expect(B.str(1)(stream(buffer))).toStrictEqual(
    success("f", stream(buffer), stream(buffer, 1))
  );

  expect(B.str(3)(stream(buffer))).toStrictEqual(
    success("foo", stream(buffer), stream(buffer, 3))
  );

  const longerBuffer = Buffer.from("foo bar baz");

  expect(B.str(3)(stream(longerBuffer, 4))).toStrictEqual(
    success("bar", stream(longerBuffer, 4), stream(longerBuffer, 7))
  );
});

test("char", () => {
  const buffer = Buffer.from("foo");

  expect(B.char(stream(buffer))).toStrictEqual(
    success("f", stream(buffer), stream(buffer, 1))
  );

  expect(B.char(stream(buffer, 1))).toStrictEqual(
    success("o", stream(buffer, 1), stream(buffer, 2))
  );

  expect(B.char(stream(buffer, 2))).toStrictEqual(
    success("o", stream(buffer, 2), stream(buffer, 3))
  );

  expect(B.char(stream(buffer, -1))).toStrictEqual(failure(expect.any(Error)));
});

test("uint32_le", () => {
  const buffer = Buffer.of(0, 0, 0, 1);

  expect(B.uint32_le(stream(buffer))).toStrictEqual(
    success(16777216, stream(buffer), stream(buffer, 4))
  );
});

test("int32_le", () => {
  const buffer = Buffer.of(0, 0, 0, -1);

  expect(B.int32_le(stream(buffer))).toStrictEqual(
    success(-16777216, stream(buffer), stream(buffer, 4))
  );
});

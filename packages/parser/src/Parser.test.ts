import * as P from "./Parser";
import { of as stream } from "./Stream";
import { failure, success } from "./ParseResult";

test("str", () => {
  const buffer = Buffer.from("foo");

  expect(P.str(1)(stream(buffer))).toStrictEqual(
    success("f", stream(buffer), stream(buffer, 1))
  );

  expect(P.str(3)({ buffer, cursor: 0 })).toStrictEqual(
    success("foo", stream(buffer), stream(buffer, 3))
  );

  const longerBuffer = Buffer.from("foo bar baz");

  expect(P.str(3)(stream(longerBuffer, 4))).toStrictEqual(
    success("bar", stream(longerBuffer, 4), stream(longerBuffer, 7))
  );
});

test("char", () => {
  const buffer = Buffer.from("foo");

  expect(P.char(stream(buffer))).toStrictEqual(
    success("f", stream(buffer), stream(buffer, 1))
  );

  expect(P.char(stream(buffer, 1))).toStrictEqual(
    success("o", stream(buffer, 1), stream(buffer, 2))
  );

  expect(P.char(stream(buffer, 2))).toStrictEqual(
    success("o", stream(buffer, 2), stream(buffer, 3))
  );

  expect(P.char(stream(buffer, -1))).toStrictEqual(failure(expect.any(Error)));
});

test("uint32_le", () => {
  const buffer = Buffer.of(0, 0, 0, 1);

  expect(P.uint32_le(stream(buffer))).toStrictEqual(
    success(16777216, stream(buffer), stream(buffer, 4))
  );
});

test("int32_le", () => {
  const buffer = Buffer.of(0, 0, 0, -1);

  expect(P.int32_le(stream(buffer))).toStrictEqual(
    success(-16777216, stream(buffer), stream(buffer, 4))
  );
});

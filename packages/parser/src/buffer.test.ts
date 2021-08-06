import * as B from "./buffer";
import { failure, success } from "./ParseResult";
import { of as stream } from "./Stream";

describe("buffer", () => {
  test.each([
    [8, -1],
    [16, -257],
    [24, -131329],
    [32, -50462977],
    [40, -17230332161],
    [48, -5514788471041],
  ] as const)("int_le %d", (bitLength, expected) => {
    const buffer = Buffer.of(-1, -2, -3, -4, -5, -6);

    expect(B.int_le(bitLength)(stream(buffer))).toStrictEqual(
      success(expected, stream(buffer), stream(buffer, bitLength / 8))
    );
  });

  test.each([
    [8, 1],
    [16, 513],
    [24, 197121],
    [32, 67305985],
    [40, 21542142465],
    [48, 6618611909121],
  ] as const)("uint_le %d", (bitLength, expected) => {
    const buffer = Buffer.of(1, 2, 3, 4, 5, 6);

    expect(B.uint_le(bitLength)(stream(buffer))).toStrictEqual(
      success(expected, stream(buffer), stream(buffer, bitLength / 8))
    );
  });

  test.each([
    [8, -1],
    [16, -2],
    [24, -259],
    [32, -66052],
    [40, -16909061],
    [48, -4328719366],
  ] as const)("int_be %d", (bitLength, expected) => {
    const buffer = Buffer.of(-1, -2, -3, -4, -5, -6);

    expect(B.int_be(bitLength)(stream(buffer))).toStrictEqual(
      success(expected, stream(buffer), stream(buffer, bitLength / 8))
    );
  });

  test.each([
    [8, 1],
    [16, 258],
    [24, 66051],
    [32, 16909060],
    [40, 4328719365],
    [48, 1108152157446],
  ] as const)("uint_be %d", (bitLength, expected) => {
    const buffer = Buffer.of(1, 2, 3, 4, 5, 6);

    expect(B.uint_be(bitLength)(stream(buffer))).toStrictEqual(
      success(expected, stream(buffer), stream(buffer, bitLength / 8))
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

    expect(B.char(stream(buffer, -1))).toStrictEqual(
      failure(
        'RangeError [ERR_OUT_OF_RANGE]: The value of "offset" is out of range. It must be >= 0 and <= 2. Received -1'
      )
    );
  });

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

  test("float32_le", () => {
    const buffer = Buffer.of(1, 2, 3, 4);

    expect(B.float32_le(stream(buffer))).toStrictEqual(
      success(1.539989614439558e-36, stream(buffer), stream(buffer, 4))
    );
  });

  test("point", () => {
    const buffer = Buffer.of(1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4);

    expect(B.point(stream(buffer))).toStrictEqual(
      success(
        {
          x: 1.539989614439558e-36,
          y: 1.539989614439558e-36,
          z: 1.539989614439558e-36,
        },
        stream(buffer, 8),
        stream(buffer, 12)
      )
    );
  });
});

import { failure, success } from "@talent/parser/lib/ParseResult";
import type { Stream } from "@talent/parser/lib/Stream";
import { of as stream } from "@talent/parser/lib/Stream";
import { pipe } from "fp-ts/lib/function";
import * as B from "./buffer";

const empty: Stream<Buffer> = { buffer: Buffer.alloc(0), cursor: 0 };

describe("buffer", () => {
  test("byteSized", () => {
    expect(
      pipe(
        empty,
        B.byteSized(() => {
          throw new Error("a");
        }, 4)
      )
    ).toStrictEqual(failure("a"));

    expect(
      pipe(
        empty,
        B.byteSized(() => "a", 1)
      )
    ).toStrictEqual(success("a", empty, { ...empty, cursor: 1 }));
  });

  test.each([
    [8, -1],
    [16, -257],
    [24, -131329],
    [32, -50462977],
    [40, -17230332161],
    [48, -5514788471041],
  ] as const)("int_le %d", (bitLength, expected) => {
    const buffer = Buffer.of(-1, -2, -3, -4, -5, -6);

    expect(pipe(stream(buffer), B.int_le(bitLength))).toStrictEqual(
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

    expect(pipe(stream(buffer), B.uint_le(bitLength))).toStrictEqual(
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

    expect(pipe(stream(buffer), B.int_be(bitLength))).toStrictEqual(
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

    expect(pipe(stream(buffer), B.uint_be(bitLength))).toStrictEqual(
      success(expected, stream(buffer), stream(buffer, bitLength / 8))
    );
  });

  test("char", () => {
    const buffer = Buffer.from("foo");

    expect(pipe(stream(buffer), B.char)).toStrictEqual(
      success("f", stream(buffer), stream(buffer, 1))
    );

    expect(pipe(stream(buffer, 1), B.char)).toStrictEqual(
      success("o", stream(buffer, 1), stream(buffer, 2))
    );

    expect(pipe(stream(buffer, 2), B.char)).toStrictEqual(
      success("o", stream(buffer, 2), stream(buffer, 3))
    );
  });

  test("str", () => {
    const buffer = Buffer.from("foo");

    expect(pipe(stream(buffer), B.str(1))).toStrictEqual(
      success("f", stream(buffer), stream(buffer, 1))
    );

    expect(pipe(stream(buffer), B.str(3))).toStrictEqual(
      success("foo", stream(buffer), stream(buffer, 3))
    );

    const longerBuffer = Buffer.from("foo bar baz");

    expect(pipe(stream(longerBuffer, 4), B.str(3))).toStrictEqual(
      success("bar", stream(longerBuffer, 4), stream(longerBuffer, 7))
    );
  });

  test("float32_le", () => {
    const buffer = Buffer.of(1, 2, 3, 4);

    expect(pipe(stream(buffer), B.float32_le)).toStrictEqual(
      success(1.539989614439558e-36, stream(buffer), stream(buffer, 4))
    );
  });

  test("take", () => {
    const buffer = Buffer.alloc(100);

    expect(pipe(stream(buffer), B.take(50))).toStrictEqual(
      success(Buffer.alloc(50), stream(buffer), stream(buffer, 50))
    );
  });
});

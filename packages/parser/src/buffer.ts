import { either as E } from "fp-ts";
import { sequenceS } from "fp-ts/lib/Apply";
import { pipe } from "fp-ts/lib/function";
import * as P from "./Parser";
import { success } from "./ParseResult";
import type { Stream } from "./Stream";

const sizedL: <A>(
  f: (a: Stream<Buffer>) => A,
  fs: (a: Stream<Buffer>) => Stream<Buffer>
) => P.Parser<Buffer, A> = (f, fs) => (i) =>
  pipe(
    E.tryCatch(() => f(i), E.toError),
    E.chain((a) => success(a, i, fs(i)))
  );

export const int_le: (byteLength: number) => P.Parser<Buffer, number> = (
  byteLength
) =>
  sizedL(
    (i) => i.buffer.readIntLE(i.cursor, byteLength / 8),
    (i) => ({ ...i, cursor: i.cursor + byteLength / 8 })
  );

export const uint_le: (byteLength: number) => P.Parser<Buffer, number> = (
  byteLength
) =>
  sizedL(
    (i) => i.buffer.readUIntLE(i.cursor, byteLength / 8),
    (i) => ({ ...i, cursor: i.cursor + byteLength / 8 })
  );

export const int_be: (byteLength: number) => P.Parser<Buffer, number> = (
  byteLength
) =>
  sizedL(
    (i) => i.buffer.readIntBE(i.cursor, byteLength / 8),
    (i) => ({ ...i, cursor: i.cursor + byteLength / 8 })
  );

export const uint_be: (byteLength: number) => P.Parser<Buffer, number> = (
  byteLength
) =>
  sizedL(
    (i) => i.buffer.readUIntBE(i.cursor, byteLength / 8),
    (i) => ({ ...i, cursor: i.cursor + byteLength / 8 })
  );

export const char: P.Parser<Buffer, string> = pipe(
  int_le(8),
  P.map(String.fromCharCode)
);

export const str: (byteLength: number) => P.Parser<Buffer, string> =
  (byteLength) => (i) =>
    pipe(
      P.manyN(char, byteLength)(i),
      E.map((a) => ({ ...a, input: i, value: a.value.join("") }))
    );

export const uint32_le: P.Parser<Buffer, number> = uint_le(32);

export const int32_le: P.Parser<Buffer, number> = int_le(32);

export const uint16_le: P.Parser<Buffer, number> = uint_le(16);

export const int16_le: P.Parser<Buffer, number> = int_le(16);

export const uint8_be: P.Parser<Buffer, number> = uint_be(8);

export const int8_be: P.Parser<Buffer, number> = int_be(8);

export const uint8_le: P.Parser<Buffer, number> = int_le(8);

export const float32_le: P.Parser<Buffer, number> = sizedL(
  (i) => i.buffer.readFloatLE(i.cursor),
  (i) => ({ ...i, cursor: i.cursor + 4 })
);

export type Point = {
  readonly x: number;
  readonly y: number;
  readonly z: number;
};

export const point: P.Parser<Buffer, Point> = sequenceS(P.Applicative)({
  x: float32_le,
  y: float32_le,
  z: float32_le,
});

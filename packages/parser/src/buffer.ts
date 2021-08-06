import { either as E } from "fp-ts";
import { sequenceS } from "fp-ts/lib/Apply";
import { flow, pipe } from "fp-ts/lib/function";
import * as P from "./Parser";
import { success } from "./ParseResult";
import type { Stream } from "./Stream";

export type BufferParser<A> = P.Parser<Buffer, A>;

const pluckErrorMsg: (e: unknown) => string = flow(E.toError, (e) => e.message);

const sizedL: <A>(
  f: (a: Stream<Buffer>) => A,
  fs: (a: Stream<Buffer>) => Stream<Buffer>
) => BufferParser<A> = (f, fs) => (i) =>
  pipe(
    E.tryCatch(() => f(i), pluckErrorMsg),
    E.chain((a) => success(a, i, fs(i)))
  );

export const int_le: (
  bitLength: 8 | 16 | 24 | 32 | 40 | 48
) => BufferParser<number> = (bitLength) =>
  sizedL(
    (i) => i.buffer.readIntLE(i.cursor, bitLength / 8),
    (i) => ({ ...i, cursor: i.cursor + bitLength / 8 })
  );

export const uint_le: (
  bitLength: 8 | 16 | 24 | 32 | 40 | 48
) => BufferParser<number> = (bitLength) =>
  sizedL(
    (i) => i.buffer.readUIntLE(i.cursor, bitLength / 8),
    (i) => ({ ...i, cursor: i.cursor + bitLength / 8 })
  );

export const int_be: (
  bitLength: 8 | 16 | 24 | 32 | 40 | 48
) => BufferParser<number> = (bitLength) =>
  sizedL(
    (i) => i.buffer.readIntBE(i.cursor, bitLength / 8),
    (i) => ({ ...i, cursor: i.cursor + bitLength / 8 })
  );

export const uint_be: (
  bitLength: 8 | 16 | 24 | 32 | 40 | 48
) => BufferParser<number> = (bitLength) =>
  sizedL(
    (i) => i.buffer.readUIntBE(i.cursor, bitLength / 8),
    (i) => ({ ...i, cursor: i.cursor + bitLength / 8 })
  );

export const char: BufferParser<string> = pipe(
  int_le(8),
  P.map(String.fromCharCode)
);

export const str: (byteLength: number) => BufferParser<string> =
  (byteLength) => (i) =>
    pipe(
      P.manyN(char, byteLength)(i),
      E.map((a) => ({ ...a, input: i, value: a.value.join("") }))
    );

export const int32_le: BufferParser<number> = int_le(32);
export const int16_le: BufferParser<number> = int_le(16);

export const int8_be: BufferParser<number> = int_be(8);

export const uint32_le: BufferParser<number> = uint_le(32);
export const uint16_le: BufferParser<number> = uint_le(16);
export const uint8_le: BufferParser<number> = int_le(8);

export const uint8_be: BufferParser<number> = uint_be(8);

export const float32_le: BufferParser<number> = sizedL(
  (i) => i.buffer.readFloatLE(i.cursor),
  (i) => ({ ...i, cursor: i.cursor + 4 })
);

// TODO Move this to the goldsrc package.
export type Point = {
  readonly x: number;
  readonly y: number;
  readonly z: number;
};

export const point: BufferParser<Point> = sequenceS(P.Applicative)({
  x: float32_le,
  y: float32_le,
  z: float32_le,
});

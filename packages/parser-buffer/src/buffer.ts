import * as P from "@talent/parser/lib/Parser";
import { success } from "@talent/parser/lib/ParseResult";
import type { Stream } from "@talent/parser/lib/Stream";
import { of as stream } from "@talent/parser/lib/Stream";
import { either as E } from "fp-ts";
import { flow, pipe } from "fp-ts/lib/function";

export type BufferParser<A> = P.Parser<Buffer, A>;

const pluckErrorMsg: (e: unknown) => string = flow(E.toError, (e) => e.message);

export const byteSized: <A>(
  f: (a: Stream<Buffer>) => A,
  byteLength: number
) => BufferParser<A> = (f, byteLength) => (i) =>
  pipe(
    E.tryCatch(() => f(i), pluckErrorMsg),
    E.chain((a) => success(a, i, stream(i.buffer, i.cursor + byteLength)))
  );

export const int_le: (
  bitLength: 8 | 16 | 24 | 32 | 40 | 48
) => BufferParser<number> = (bitLength) =>
  byteSized((i) => i.buffer.readIntLE(i.cursor, bitLength / 8), bitLength / 8);

export const uint_le: (
  bitLength: 8 | 16 | 24 | 32 | 40 | 48
) => BufferParser<number> = (bitLength) =>
  byteSized((i) => i.buffer.readUIntLE(i.cursor, bitLength / 8), bitLength / 8);

export const int_be: (
  bitLength: 8 | 16 | 24 | 32 | 40 | 48
) => BufferParser<number> = (bitLength) =>
  byteSized((i) => i.buffer.readIntBE(i.cursor, bitLength / 8), bitLength / 8);

export const uint_be: (
  bitLength: 8 | 16 | 24 | 32 | 40 | 48
) => BufferParser<number> = (bitLength) =>
  byteSized((i) => i.buffer.readUIntBE(i.cursor, bitLength / 8), bitLength / 8);

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

export const float32_le: BufferParser<number> = byteSized(
  (i) => i.buffer.readFloatLE(i.cursor),
  4
);

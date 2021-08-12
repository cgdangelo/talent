import * as P from "@talent/parser/lib/Parser";
import { success } from "@talent/parser/lib/ParseResult";
import type { Stream } from "@talent/parser/lib/Stream";
import { stream } from "@talent/parser/lib/Stream";
import { either as E } from "fp-ts";
import { flow, identity, pipe } from "fp-ts/lib/function";

export type BufferParser<A> = P.Parser<Buffer, A>;

const int: (
  fa: Buffer["readIntLE" | "readUIntLE" | "readIntBE" | "readUIntBE"]
) => (bitLength: 8 | 16 | 24 | 32 | 40 | 48) => P.Parser<Buffer, number> =
  (fa) => (bitLength) =>
    pipe(bitLength / 8, (byteLength) =>
      byteSized((i) => fa.call(i.buffer, i.cursor, byteLength), byteLength)
    );

type BitLength = 8 | 16 | 24 | 32 | 40 | 48;

export const byteSized: <A>(
  f: (a: Stream<Buffer>) => A,
  byteLength: number
) => BufferParser<A> = (f, byteLength) => (i) =>
  pipe(
    E.tryCatch(
      () => f(i),
      (e) => `${e}`
    ),
    E.chain((a) => success(a, i, stream(i.buffer, i.cursor + byteLength)))
  );

export const int_le: (bitLength: BitLength) => BufferParser<number> = int(
  Buffer.prototype.readIntLE
);

export const uint_le: (bitLength: BitLength) => BufferParser<number> = int(
  Buffer.prototype.readUIntLE
);

export const int_be: (bitLength: BitLength) => BufferParser<number> = int(
  Buffer.prototype.readIntBE
);

export const uint_be: (bitLength: BitLength) => BufferParser<number> = int(
  Buffer.prototype.readUIntBE
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

export const char: BufferParser<string> = pipe(
  int_le(8),
  P.map(String.fromCharCode)
);

export const str: (byteLength: number) => BufferParser<string> = (byteLength) =>
  flow(
    pipe(
      P.manyN(char, byteLength),
      P.map((a) => a.join(""))
    )
  );

export const ztstr: BufferParser<string> = pipe(
  P.manyTill(
    char,
    P.sat(char, (a) => a === "\x00", identity)
  ),
  P.map((a) => a.join(""))
);

export const ztstr_padded: (minLength: number) => BufferParser<string> =
  (minLength) => (i) =>
    pipe(
      ztstr(i),
      E.map((a) => ({
        ...a,
        next: stream(a.next.buffer, i.cursor + minLength),
      }))
    );

export const take: (byteLength: number) => BufferParser<Buffer> = (
  byteLength
) =>
  byteSized((i) => i.buffer.slice(i.cursor, i.cursor + byteLength), byteLength);

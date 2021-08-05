import { either as E } from "fp-ts";
import { sequenceS } from "fp-ts/lib/Apply";
import { pipe } from "fp-ts/lib/function";
import * as P from "./Parser";
import { success } from "./ParseResult";
import { of as stream } from "./Stream";

export const char: P.Parser<Buffer, string> = (i) =>
  pipe(
    E.tryCatch(() => i.buffer.readInt8(i.cursor), E.toError),
    E.chain((a) =>
      success(String.fromCharCode(a), i, stream(i.buffer, i.cursor + 1))
    )
  );

export const str: (byteLength: number) => P.Parser<Buffer, string> =
  (byteLength) => (i) =>
    pipe(
      P.manyN(char, byteLength)(i),
      E.map((a) => ({ ...a, input: i, value: a.value.join("") }))
    );

export const uint32_le: P.Parser<Buffer, number> = (i) =>
  pipe(
    E.tryCatch(() => i.buffer.readUInt32LE(i.cursor), E.toError),
    E.chain((a) => success(a, i, stream(i.buffer, i.cursor + 4)))
  );

export const int32_le: P.Parser<Buffer, number> = (i) =>
  pipe(
    E.tryCatch(() => i.buffer.readInt32LE(i.cursor), E.toError),
    E.chain((a) => success(a, i, stream(i.buffer, i.cursor + 4)))
  );

export const uint16_le: P.Parser<Buffer, number> = (i) =>
  pipe(
    E.tryCatch(() => i.buffer.readUInt16LE(i.cursor), E.toError),
    E.chain((a) => success(a, i, stream(i.buffer, i.cursor + 2)))
  );

export const int16_le: P.Parser<Buffer, number> = (i) =>
  pipe(
    E.tryCatch(() => i.buffer.readInt16LE(i.cursor), E.toError),
    E.chain((a) => success(a, i, stream(i.buffer, i.cursor + 2)))
  );

export const uint8_be: P.Parser<Buffer, number> = (i) =>
  pipe(
    E.tryCatch(() => i.buffer.readUIntBE(i.cursor, 1), E.toError),
    E.chain((a) => success(a, i, stream(i.buffer, i.cursor + 1)))
  );

export const int8_be: P.Parser<Buffer, number> = (i) =>
  pipe(
    E.tryCatch(() => i.buffer.readIntBE(i.cursor, 1), E.toError),
    E.chain((a) => success(a, i, stream(i.buffer, i.cursor + 1)))
  );

export const uint8_le: P.Parser<Buffer, number> = (i) =>
  pipe(
    E.tryCatch(() => i.buffer.readUIntLE(i.cursor, 1), E.toError),
    E.chain((a) => success(a, i, stream(i.buffer, i.cursor + 1)))
  );

export const float32_le: P.Parser<Buffer, number> = (i) =>
  pipe(
    E.tryCatch(() => i.buffer.readFloatLE(i.cursor), E.toError),
    E.chain((a) => success(a, i, stream(i.buffer, i.cursor + 4)))
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

import { array as A, either as E, option as O } from "fp-ts";
import { sequenceS } from "fp-ts/lib/Apply";
import { flow, pipe } from "fp-ts/lib/function";
import { eq, not } from "./utils";

export type Point = {
  readonly x: number;
  readonly y: number;
  readonly z: number;
};

export const str =
  (buffer: Buffer) =>
  (cursor = 0) =>
  (length = 1): string =>
    pipe(
      A.range(1, length),
      A.filterMapWithIndex(
        flow(
          (i) => cursor + i,
          char(buffer),
          O.fromEither,
          O.chain(O.fromPredicate(flow(eq("\x00"), not)))
        )
      ),
      (a) => a.join("")
    );

export const char =
  (buffer: Buffer) =>
  (cursor = 0): E.Either<Error, string> =>
    pipe(
      E.tryCatch(() => buffer.readInt8(cursor), E.toError),
      E.map(String.fromCharCode)
    );

export const uint32_le =
  (buffer: Buffer) =>
  (cursor = 0): E.Either<Error, number> =>
    E.tryCatch(() => buffer.readUInt32LE(cursor), E.toError);

export const int32_le =
  (buffer: Buffer) =>
  (cursor = 0): E.Either<Error, number> =>
    E.tryCatch(() => buffer.readInt32LE(cursor), E.toError);

export const uint16_le =
  (buffer: Buffer) =>
  (cursor = 0): E.Either<Error, number> =>
    E.tryCatch(() => buffer.readUInt16LE(cursor), E.toError);

export const int16_le =
  (buffer: Buffer) =>
  (cursor = 0): E.Either<Error, number> =>
    E.tryCatch(() => buffer.readInt16LE(cursor), E.toError);

export const uint8_be =
  (buffer: Buffer) =>
  (cursor = 0): E.Either<Error, number> =>
    E.tryCatch(() => buffer.readUIntBE(cursor, 1), E.toError);

export const int8_be =
  (buffer: Buffer) =>
  (cursor = 0): E.Either<Error, number> =>
    E.tryCatch(() => buffer.readIntBE(cursor, 1), E.toError);

export const uint8_le =
  (buffer: Buffer) =>
  (cursor = 0): E.Either<Error, number> =>
    E.tryCatch(() => buffer.readUIntLE(cursor, 1), E.toError);

export const float32_le =
  (buffer: Buffer) =>
  (cursor = 0): E.Either<Error, number> =>
    E.tryCatch(() => buffer.readFloatLE(cursor), E.toError);

export const point =
  (buffer: Buffer) =>
  (cursor = 0): E.Either<Error, Point> =>
    sequenceS(E.Applicative)({
      x: float32_le(buffer)(cursor),
      y: float32_le(buffer)(cursor + 4),
      z: float32_le(buffer)(cursor + 4 + 4),
    });

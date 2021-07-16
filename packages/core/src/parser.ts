import { array as A, either as E, option as O } from "fp-ts";
import { flow, pipe } from "fp-ts/lib/function";
import { eq, not } from "./utils";

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

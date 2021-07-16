import { array as A, either as E, io, option as O } from "fp-ts";
import { flow, pipe } from "fp-ts/function";
import type { InspectOptions } from "util";

export const not = (a: boolean): boolean => !a;

export const eq =
  <A>(a: A) =>
  <B extends A>(b: B): boolean =>
    a === b;

export const dir =
  (options: InspectOptions) =>
  (obj: unknown): io.IO<void> =>
    io.of(console.dir(obj, options));

export const dumpObject = dir({ depth: Infinity });

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

export const toError =
  <A>(message: string) =>
  (a: A): Error =>
    new Error(`${message}: ${a}`);

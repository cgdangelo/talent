import { array as A, io, option as O } from "fp-ts";
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
          O.fromPredicate(flow(eq("\x00"), not))
        )
      ),
      (a) => a.join("")
    );

export const char =
  (buffer: Buffer) =>
  (cursor = 0): string =>
    pipe(buffer.readInt8(cursor), String.fromCharCode);

const int32 =
  (unsigned = false) =>
  (endianness: "BE" | "LE" = "LE") =>
  (buffer: Buffer) =>
  (cursor = 0) =>
    // @ts-expect-error Index access error because Buffer extends UInt8Array?
    buffer[`read${unsigned ? "U" : ""}Int32${endianness}`](cursor);

export const uint32_le = int32(true)("LE");

export const int32_le = int32()("LE");

export const toError =
  <A>(message: string) =>
  (a: A): Error =>
    new Error(`${message}: ${a}`);

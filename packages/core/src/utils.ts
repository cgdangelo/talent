import { array as A, io, option as O } from "fp-ts";
import { flow, pipe } from "fp-ts/function";
import type { InspectOptions } from "util";

export const invert = (a: boolean): boolean => !a;

export const eq =
  <A>(a: A) =>
  <B extends A>(b: B) =>
    a === b;

export const dir = (options: InspectOptions) => (obj: unknown) =>
  io.of(console.dir(obj, options));

export const dumpObject = dir({ depth: Infinity });

export const readString =
  (buffer: Buffer) =>
  (cursor = 0) =>
  (length = 1): string =>
    pipe(
      A.range(1, length),
      A.filterMapWithIndex(
        flow(
          (_, i) => cursor + i,
          readChar(buffer),
          O.fromPredicate(flow(eq("\x00"), invert))
        )
      ),
      (a) => a.join("")
    );

const readChar =
  (buffer: Buffer) =>
  (cursor = 0) =>
    pipe(buffer.readInt8(cursor), String.fromCharCode);

import { io } from "fp-ts";
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

export const toError =
  <A>(message: string) =>
  (a: A): Error =>
    new Error(`${message}: ${a}`);

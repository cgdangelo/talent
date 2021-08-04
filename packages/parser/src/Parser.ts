import { array as A, either as E } from "fp-ts";
import type { Applicative2 } from "fp-ts/lib/Applicative";
import { sequenceS } from "fp-ts/lib/Apply";
import type { Chain2 } from "fp-ts/lib/Chain";
import type { Predicate, Refinement } from "fp-ts/lib/function";
import { flow, pipe } from "fp-ts/lib/function";
import type { Functor2 } from "fp-ts/lib/Functor";
import type { Monad2 } from "fp-ts/lib/Monad";
import type { ParseResult } from "./ParseResult";
import { failure, success } from "./ParseResult";
import type { Stream } from "./Stream";

export type Parser<I, A> = (stream: Stream<I>) => ParseResult<I, A>;

export const URI = "Parser";

export type URI = typeof URI;

declare module "fp-ts/lib/HKT" {
  interface URItoKind2<E, A> {
    [URI]: Parser<E, A>;
  }
}

const ap_: Applicative2<URI>["ap"] = (fab, fa) =>
  chain_(fab, (f) => map_(fa, f));

const map_: Functor2<URI>["map"] = (fa, f) => chain_(fa, (a) => of(f(a)));

const chain_: Chain2<URI>["chain"] = (fa, f) =>
  flow(
    fa,
    E.chain(({ value, next }) => f(value)(next))
  );

export const ap: <I, A>(
  fa: Parser<I, A>
) => <B>(fab: Parser<I, (a: A) => B>) => Parser<I, B> = (fa) => (fab) =>
  ap_(fab, fa);

export const chain: <I, A, B>(
  f: (a: A) => Parser<I, B>
) => (fa: Parser<I, A>) => Parser<I, B> = (f) => (fa) => chain_(fa, f);

export const map: <A, B>(
  f: (a: A) => B
) => <I>(fa: Parser<I, A>) => Parser<I, B> = (f) => (fa) => map_(fa, f);

export const of: <I, A>(a: A) => Parser<I, A> = (a) => (i) =>
  success(a, i, i.cursor);

export const Functor: Functor2<URI> = {
  URI,
  map: map_,
};

export const Applicative: Applicative2<URI> = {
  URI,
  ap: ap_,
  map: map_,
  of,
};

export const Chain: Chain2<URI> = {
  URI,
  ap: ap_,
  map: map_,
  chain: chain_,
};

export const Monad: Monad2<URI> = {
  URI,
  ap: ap_,
  chain: chain_,
  map: map_,
  of,
};

export const succeed: <I, A>(a: A) => Parser<I, A> = of;

export const fail: <I, A = never>(e: Error) => Parser<I, A> = (e) => () =>
  failure(e);

export const manyN: <I, A>(fa: Parser<I, A>, n: number) => Parser<I, A[]> = (
  fa,
  n
) => pipe(A.replicate(n, fa), A.sequence(Applicative));

export const skip: <I>(byteLength: number) => Parser<I, void> =
  (byteLength) =>
  <I>(i: Stream<I>) =>
    success<I, undefined>(undefined, i, i.cursor + byteLength);

export const seek: <I>(byteOffset: number) => Parser<I, void> =
  (byteOffset) => (i) =>
    success(undefined, i, byteOffset);

// FIXME No idea what's wrong with these.
export function sat<A>(
  f: Predicate<A>,
  onFail: (a: unknown) => Error
): <I>(fa: Parser<I, A>) => Parser<I, A>;
export function sat<A, B extends A>(
  f: Refinement<A, B>,
  onFail: (a: unknown) => Error
): <I>(fa: Parser<I, A>) => Parser<I, B>;
export function sat<A>(
  f: Predicate<A>,
  onFail: (a: unknown) => Error
): <I>(fa: Parser<I, A>) => Parser<I, A> {
  return chain((a) => (f(a) ? succeed(a) : fail(onFail(a))));
}

export const char: Parser<Buffer, string> = (i) =>
  pipe(
    E.tryCatch(() => i.buffer.readInt8(i.cursor), E.toError),
    E.chain((a) => success(String.fromCharCode(a), i, i.cursor + 1))
  );

export const str: (byteLength: number) => Parser<Buffer, string> = (
  byteLength
) =>
  pipe(
    manyN(char, byteLength),
    map((as) => as.join(""))
  );

export const uint32_le: Parser<Buffer, number> = (i) =>
  pipe(
    E.tryCatch(() => i.buffer.readUInt32LE(i.cursor), E.toError),
    E.chain((a) => success(a, i, i.cursor + 4))
  );

export const int32_le: Parser<Buffer, number> = (i) =>
  pipe(
    E.tryCatch(() => i.buffer.readInt32LE(i.cursor), E.toError),
    E.chain((a) => success(a, i, i.cursor + 4))
  );

export const uint16_le: Parser<Buffer, number> = (i) =>
  pipe(
    E.tryCatch(() => i.buffer.readUInt16LE(i.cursor), E.toError),
    E.chain((a) => success(a, i, i.cursor + 2))
  );

export const int16_le: Parser<Buffer, number> = (i) =>
  pipe(
    E.tryCatch(() => i.buffer.readInt16LE(i.cursor), E.toError),
    E.chain((a) => success(a, i, i.cursor + 2))
  );

export const uint8_be: Parser<Buffer, number> = (i) =>
  pipe(
    E.tryCatch(() => i.buffer.readUIntBE(i.cursor, 1), E.toError),
    E.chain((a) => success(a, i, i.cursor + 1))
  );

export const int8_be: Parser<Buffer, number> = (i) =>
  pipe(
    E.tryCatch(() => i.buffer.readIntBE(i.cursor, 1), E.toError),
    E.chain((a) => success(a, i, i.cursor + 1))
  );

export const uint8_le: Parser<Buffer, number> = (i) =>
  pipe(
    E.tryCatch(() => i.buffer.readUIntLE(i.cursor, 1), E.toError),
    E.chain((a) => success(a, i, i.cursor + 1))
  );

export const float32_le: Parser<Buffer, number> = (i) =>
  pipe(
    E.tryCatch(() => i.buffer.readFloatLE(i.cursor), E.toError),
    E.chain((a) => success(a, i, i.cursor + 4))
  );

export type Point = {
  readonly x: number;
  readonly y: number;
  readonly z: number;
};

export const point: Parser<Buffer, Point> = sequenceS(Applicative)({
  x: float32_le,
  y: float32_le,
  z: float32_le,
});

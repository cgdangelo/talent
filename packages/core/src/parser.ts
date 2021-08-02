import { either as E } from "fp-ts";
import type { Applicative2 } from "fp-ts/lib/Applicative";
import { sequenceS } from "fp-ts/lib/Apply";
import type { Chain2 } from "fp-ts/lib/Chain";
import { flow, pipe } from "fp-ts/lib/function";
import type { Functor2 } from "fp-ts/lib/Functor";
import type { Monad2 } from "fp-ts/lib/Monad";

type Stream<I> = { readonly buffer: I; readonly cursor: number };

export type Parser<I, A> = (stream: Stream<I>) => ParseResult<I, A>;

type ParseResult<I, A> = E.Either<
  Error,
  { readonly value: A; readonly next: Stream<I> }
>;

const URI = "Parser";

type URI = typeof URI;

declare module "fp-ts/lib/HKT" {
  interface URItoKind2<E, A> {
    [URI]: Parser<E, A>;
  }
}

const ap_: Applicative2<URI>["ap"] = (fab, fa) =>
  flow(
    fab,
    E.chain(({ value: a2b, next }) =>
      pipe(
        fa(next),
        E.map((r) => ({ ...r, value: a2b(r.value) }))
      )
    )
  );

const map_: Functor2<URI>["map"] = (fa, f) =>
  flow(
    fa,
    E.map((r) => ({ ...r, value: f(r.value) }))
  );

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
  E.right({ value: a, next: i });

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

const success: <I, A>(value: A, next: Stream<I>) => ParseResult<I, A> = (
  value,
  next
) => E.right({ value, next });

export type Point = {
  readonly x: number;
  readonly y: number;
  readonly z: number;
};

// TODO Need a manyN combinator
export const str: (byteLength: number) => Parser<Buffer, string> =
  (byteLength) => (i) =>
    success("", { ...i, cursor: i.cursor + byteLength });

export const char: Parser<Buffer, string> = (i) =>
  pipe(
    E.tryCatch(() => i.buffer.readInt8(i.cursor), E.toError),
    E.chain((x) =>
      success(String.fromCharCode(x), { ...i, cursor: i.cursor + 1 })
    )
  );

export const uint32_le: Parser<Buffer, number> = (i) =>
  pipe(
    E.tryCatch(() => i.buffer.readUInt32LE(i.cursor), E.toError),
    E.chain((x) => success(x, { ...i, cursor: i.cursor + 4 }))
  );

export const int32_le: Parser<Buffer, number> = (i) =>
  pipe(
    E.tryCatch(() => i.buffer.readInt32LE(i.cursor), E.toError),
    E.chain((x) => success(x, { ...i, cursor: i.cursor + 4 }))
  );

export const uint16_le: Parser<Buffer, number> = (i) =>
  pipe(
    E.tryCatch(() => i.buffer.readUInt16LE(i.cursor), E.toError),
    E.chain((x) => success(x, { ...i, cursor: i.cursor + 2 }))
  );

export const int16_le: Parser<Buffer, number> = (i) =>
  pipe(
    E.tryCatch(() => i.buffer.readInt16LE(i.cursor), E.toError),
    E.chain((x) => success(x, { ...i, cursor: i.cursor + 2 }))
  );

export const uint8_be: Parser<Buffer, number> = (i) =>
  pipe(
    E.tryCatch(() => i.buffer.readUIntBE(i.cursor, 1), E.toError),
    E.chain((x) => success(x, { ...i, cursor: i.cursor + 1 }))
  );

export const int8_be: Parser<Buffer, number> = (i) =>
  pipe(
    E.tryCatch(() => i.buffer.readIntBE(i.cursor, 1), E.toError),
    E.chain((x) => success(x, { ...i, cursor: i.cursor + 1 }))
  );

export const uint8_le: Parser<Buffer, number> = (i) =>
  pipe(
    E.tryCatch(() => i.buffer.readUIntLE(i.cursor, 1), E.toError),
    E.chain((x) => success(x, { ...i, cursor: i.cursor + 1 }))
  );

export const float32_le: Parser<Buffer, number> = (i) =>
  pipe(
    E.tryCatch(() => i.buffer.readFloatLE(i.cursor), E.toError),
    E.chain((x) => success(x, { ...i, cursor: i.cursor + 4 }))
  );

export const point: Parser<Buffer, Point> = sequenceS(Applicative)({
  x: float32_le,
  y: float32_le,
  z: float32_le,
});

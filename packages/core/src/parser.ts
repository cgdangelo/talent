import { array as A, either as E, option as O } from "fp-ts";
import type { Applicative2 } from "fp-ts/lib/Applicative";
import { sequenceS } from "fp-ts/lib/Apply";
import type { Chain2 } from "fp-ts/lib/Chain";
import { flow, pipe } from "fp-ts/lib/function";
import type { Functor2 } from "fp-ts/lib/Functor";
import type { Monad2 } from "fp-ts/lib/Monad";
import { eq, not } from "./utils";

type Stream<I> = { readonly buffer: I; readonly cursor: number };

export type Parser<I, A> = (
  stream: Stream<I>
) => E.Either<Error, ParseResult<I, A>>;

type ParseResult<I, A> = { readonly value: A; readonly next: Stream<I> };

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

export const ap: <I, A, B>(
  fab: Parser<I, (a: A) => B>
) => (fa: Parser<I, A>) => Parser<I, B> = (fab) => (fa) => ap_(fab, fa);

export const chain: <I, A, B>(
  fa: Parser<I, A>
) => (f: (a: A) => Parser<I, B>) => Parser<I, B> = (fa) => (f) => chain_(fa, f);

export const map: <I, A, B>(
  fa: Parser<I, A>
) => (f: (a: A) => B) => Parser<I, B> = (fa) => (f) => map_(fa, f);

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

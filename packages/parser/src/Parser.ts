import {
  array as A,
  either as E,
  readonlyArray as RA,
  readonlyNonEmptyArray as RNEA,
} from "fp-ts";
import type { Alt2 } from "fp-ts/lib/Alt";
import type { Applicative2 } from "fp-ts/lib/Applicative";
import type { Apply2 } from "fp-ts/lib/Apply";
import type { Chain2 } from "fp-ts/lib/Chain";
import type { ChainRec2 } from "fp-ts/lib/ChainRec";
import { tailRec } from "fp-ts/lib/ChainRec";
import type { Lazy } from "fp-ts/lib/function";
import { constant, flow, pipe } from "fp-ts/lib/function";
import type { Functor2 } from "fp-ts/lib/Functor";
import type { Monad2 } from "fp-ts/lib/Monad";
import type { Pointed2 } from "fp-ts/lib/Pointed";
import type { Predicate } from "fp-ts/lib/Predicate";
import type { Refinement } from "fp-ts/lib/Refinement";
import type { ParseResult, ParseSuccess } from "./ParseResult";
import { failure, success } from "./ParseResult";
import type { Stream } from "./Stream";
import { stream } from "./Stream";

export type Parser<I, A> = (stream: Stream<I>) => ParseResult<I, A>;

export const URI = "Parser";

export type URI = typeof URI;

declare module "fp-ts/lib/HKT" {
  interface URItoKind2<E, A> {
    [URI]: Parser<E, A>;
  }
}

const alt_: Alt2<URI>["alt"] = (fa, that) => (i) =>
  pipe(fa(i), (s) => (E.isRight(s) ? s : that()(i)));

const ap_: Apply2<URI>["ap"] = (fab, fa) => chain_(fab, (f) => map_(fa, f));

const chain_: Chain2<URI>["chain"] = (fa, f) =>
  flow(
    fa,
    E.chain(({ value, input, next }) =>
      pipe(
        f(value)(next),
        E.chain(({ value, next }) => success(value, input, next))
      )
    )
  );

// https://github.com/gcanti/parser-ts/blob/master/src/Parser.ts#L534-L549
const chainRec_: ChainRec2<URI>["chainRec"] = <I, A, B>(
  a: A,
  f: (a: A) => Parser<I, E.Either<A, B>>
): Parser<I, B> => {
  type Next<I, A> = { readonly stream: Stream<I>; readonly value: A };

  const split =
    (start: Stream<I>) =>
    (
      result: ParseSuccess<I, E.Either<A, B>>
    ): E.Either<Next<I, A>, ParseResult<I, B>> =>
      pipe(
        result.value,
        E.match(
          (e) => E.left({ value: e, stream: result.next }),
          (a) => E.right(success(a, result.next, start))
        )
      );

  return (start) =>
    tailRec({ value: a, stream: start }, (state) =>
      pipe(f(state.value)(state.stream), (a) =>
        E.isLeft(a) ? E.right(failure(a.left)) : split(start)(a.right)
      )
    );
};

const map_: Functor2<URI>["map"] = (fa, f) =>
  flow(
    fa,
    E.map((a) => ({ ...a, value: f(a.value) }))
  );

export const alt: <I, A>(
  that: Lazy<Parser<I, A>>
) => (fa: Parser<I, A>) => Parser<I, A> = (that) => (fa) => alt_(fa, that);

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

export const of: Pointed2<URI>["of"] = (a) => (i) => success(a, i, i);

export const Alt: Alt2<URI> = {
  URI,
  alt: alt_,
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

export const ChainRec: ChainRec2<URI> = {
  URI,
  ap: ap_,
  chain: chain_,
  chainRec: chainRec_,
  map: map_,
};

export const Functor: Functor2<URI> = {
  URI,
  map: map_,
};

export const Monad: Monad2<URI> = {
  URI,
  ap: ap_,
  chain: chain_,
  map: map_,
  of,
};

export const Pointed: Pointed2<URI> = {
  URI,
  of,
};

export const succeed: <I, A>(a: A) => Parser<I, A> = of;

export const fail: <I, A = never>(e: string) => Parser<I, A> = (e) => () =>
  failure(e);

export const skip =
  (length: number) =>
  <I>(i: Stream<I>): ParseResult<I, undefined> =>
    success(undefined, i, stream(i.buffer, i.cursor + length));

export const seek =
  (offset: number) =>
  <I>(i: Stream<I>): ParseResult<I, undefined> =>
    success(undefined, i, stream(i.buffer, offset));

export const manyN: <I, A>(fa: Parser<I, A>, n: number) => Parser<I, A[]> = (
  fa,
  n
) => pipe(A.replicate(n, fa), A.sequence(Applicative));

export const many1Till = <I, A, B>(
  parser: Parser<I, A>,
  terminator: Parser<I, B>
): Parser<I, RNEA.ReadonlyNonEmptyArray<A>> =>
  pipe(
    parser,
    chain((x) =>
      chainRec_(RNEA.of(x), (acc) =>
        pipe(
          terminator,
          map(constant(E.right(acc))),
          alt(() =>
            pipe(
              parser,
              map((a) => E.left(RA.append(a)(acc)))
            )
          )
        )
      )
    )
  );

export const manyTill = <I, A, B>(
  parser: Parser<I, A>,
  terminator: Parser<I, B>
): Parser<I, ReadonlyArray<A>> =>
  pipe(
    terminator,
    map<B, ReadonlyArray<A>>(() => RA.empty),
    alt<I, ReadonlyArray<A>>(() => many1Till(parser, terminator))
  );

export const logPositions: <I, A>(fa: Parser<I, A>) => Parser<I, A> =
  (fa) => (i) =>
    pipe(
      fa(i),
      E.map((a) => {
        console.log(`before: ${i.cursor}, after: ${a.next.cursor}`);

        return a;
      })
    );

export const logResult: <I, A>(fa: Parser<I, A>) => Parser<I, A> = flow(
  chain((a) => {
    console.dir(a, { depth: Infinity });

    return succeed(a);
  })
);

export const sat: {
  <I, A, B extends A>(
    fa: Parser<I, A>,
    predicate: Refinement<A, B>,
    onPredicateFail: (a: A) => string
  ): Parser<I, B>;

  <I, A>(
    fa: Parser<I, A>,
    predicate: Predicate<A>,
    onPredicateFail: (a: A) => string
  ): Parser<I, A>;
} = <I, A>(
  fa: Parser<I, A>,
  predicate: Predicate<A>,
  onPredicateFail: (a: A) => string
) =>
  pipe(
    fa,
    chain((a) => (predicate(a) ? succeed(a) : fail(onPredicateFail(a))))
  );

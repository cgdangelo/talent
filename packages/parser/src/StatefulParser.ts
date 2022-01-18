import {
  either as E,
  readonlyArray as RA,
  readonlyNonEmptyArray as RNEA,
  stateT as ST,
} from "fp-ts";
import type { Alt3 } from "fp-ts/lib/Alt";
import type { Alternative3 } from "fp-ts/lib/Alternative";
import type { Applicative3 } from "fp-ts/lib/Applicative";
import { sequenceS, sequenceT } from "fp-ts/lib/Apply";
import type { Chain3 } from "fp-ts/lib/Chain";
import { bind as bind_ } from "fp-ts/lib/Chain";
import type { ChainRec3 } from "fp-ts/lib/ChainRec";
import { tailRec } from "fp-ts/lib/ChainRec";
import type { Lazy } from "fp-ts/lib/function";
import { pipe } from "fp-ts/lib/function";
import type { Functor3 } from "fp-ts/lib/Functor";
import { bindTo as bindTo_ } from "fp-ts/lib/Functor";
import type { Monad3 } from "fp-ts/lib/Monad";
import type { Predicate } from "fp-ts/lib/Predicate";
import type { Refinement } from "fp-ts/lib/Refinement";
import * as P from "./Parser";
import type { ParseResult, ParseSuccess } from "./ParseResult";
import { error, success } from "./ParseResult";
import type { Stream } from "./Stream";

// -----------------------------------------------------------------------------
// model
// -----------------------------------------------------------------------------

export type StatefulParser<R, E, A> = ST.StateT2<P.URI, R, E, A>;

// -----------------------------------------------------------------------------
// constructors
// -----------------------------------------------------------------------------

export const fail: <S, I, A = never>() => StatefulParser<S, I, A> = () =>
  lift(P.fail());

// TODO reverse typeparams
export const get: <I, S>() => StatefulParser<S, I, S> = () => (s) =>
  P.of([s, s]);

export const modify: <S, I>(f: (s: S) => S) => StatefulParser<S, I, void> =
  (f) => (s) =>
    P.of([undefined, f(s)]);

export const put: <S, I>(s: S) => StatefulParser<S, I, void> = (s) => () =>
  P.of([undefined, s]);

export const succeed: <S, I, A>(a: A) => StatefulParser<S, I, A> = (a) =>
  lift(P.succeed(a));

// -----------------------------------------------------------------------------
// combinators
// -----------------------------------------------------------------------------

export const filter: {
  <A>(f: Predicate<A>): <S, I>(
    p: StatefulParser<S, I, A>
  ) => StatefulParser<S, I, A>;

  <A, B extends A>(f: Refinement<A, B>): <S, I>(
    p: StatefulParser<S, I, A>
  ) => StatefulParser<S, I, B>;
} =
  <A>(f: Predicate<A>) =>
  <S, I>(p: StatefulParser<S, I, A>): StatefulParser<S, I, A> =>
  (s) =>
    pipe(
      p(s),
      P.filter(([a]) => f(a))
    );

export const item = <S, I>(): StatefulParser<S, I, I> => lift(P.item<I>());

export const many1 = <S, I, A>(
  ma: StatefulParser<S, I, A>
): StatefulParser<S, I, RNEA.ReadonlyNonEmptyArray<A>> =>
  pipe(
    ma,
    chain((head) =>
      chainRec_(RNEA.of(head), (acc) =>
        pipe(
          ma,
          map((a) => E.left(RNEA.snoc(acc, a))),
          alt(() => of(E.right(acc)))
        )
      )
    )
  );

export const many = <S, I, A>(
  ma: StatefulParser<S, I, A>
): StatefulParser<S, I, readonly A[]> =>
  pipe(
    many1(ma),
    alt(() => of<readonly A[], S, I>([]))
  );

export const many1Till = <S, I, A, B>(
  parser: StatefulParser<S, I, A>,
  terminator: StatefulParser<S, I, B>
): StatefulParser<S, I, RNEA.ReadonlyNonEmptyArray<A>> =>
  pipe(
    parser,
    chain((x) =>
      chainRec_(RNEA.of(x), (acc) =>
        pipe(
          terminator,
          map(() => E.right(acc)),
          alt(() =>
            pipe(
              parser,
              map((a) => E.left(RNEA.snoc(acc, a)))
            )
          )
        )
      )
    )
  );

export const manyTill = <S, I, A, B>(
  parser: StatefulParser<S, I, A>,
  terminator: StatefulParser<S, I, B>
): StatefulParser<S, I, ReadonlyArray<A>> =>
  pipe(
    terminator,
    map<B, ReadonlyArray<A>>(() => RA.empty),
    alt<S, I, ReadonlyArray<A>>(() => many1Till(parser, terminator))
  );

export const manyN = <S, I, A>(
  parser: StatefulParser<S, I, A>,
  n: number
): StatefulParser<S, I, readonly A[]> =>
  n === 0
    ? of([])
    : pipe(
        parser,

        chain((x) =>
          chainRec_(RNEA.of(x), (acc) =>
            pipe(
              lift<I, E.Either<never, RNEA.ReadonlyNonEmptyArray<A>>, S>(
                pipe(
                  acc.length === n ? P.succeed(undefined) : P.fail<I>(),
                  P.map(() => E.right(acc))
                )
              ),

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

export const seek: <S, I>(cursor: number) => StatefulParser<S, I, void> = (
  cursor
) => lift(P.seek(cursor));

export const skip: <S, I>(offset: number) => StatefulParser<S, I, void> = (
  offset
) => lift(P.skip(offset));

export const take: <S, I>(
  length: number
) => StatefulParser<S, I, readonly I[]> = (length) => lift(P.take(length));

// -----------------------------------------------------------------------------
// non-pipeables
// -----------------------------------------------------------------------------

const alt_: Alt3<URI>["alt"] = (fa, that) => (s) =>
  pipe(
    fa(s),
    P.alt(() => that()(s))
  );

const ap_: Monad3<URI>["ap"] = (fab, fa) => pipe(fab, ap(fa));

const chain_: Chain3<URI>["chain"] = (fa, f) => pipe(fa, chain(f));

const chainRec_: ChainRec3<URI>["chainRec"] = <S, I, A, B>(
  a: A,
  f: (a: A) => StatefulParser<S, I, E.Either<A, B>>
): StatefulParser<S, I, B> => {
  const split =
    (start: Stream<I>) =>
    (
      result: ParseSuccess<I, [E.Either<A, B>, S]>
    ): E.Either<
      { readonly value: A; readonly stream: Stream<I>; readonly state: S },
      ParseResult<I, [B, S]>
    > =>
      E.isLeft(result.value[0])
        ? E.left({
            value: result.value[0].left,
            stream: result.next,
            state: result.value[1],
          })
        : E.right(
            success(
              [result.value[0].right, result.value[1]],
              start,
              result.next
            )
          );
  return (s) => (start) =>
    tailRec({ value: a, stream: start, state: s }, (state) => {
      const result = f(state.value)(state.state)(state.stream);
      if (E.isLeft(result)) {
        return E.right(
          error(state.stream, result.left.expected, result.left.fatal)
        );
      }
      return split(start)(result.right);
    });
};

const map_: Functor3<URI>["map"] = (fa, fab) => pipe(fa, map(fab));

// -----------------------------------------------------------------------------
// pipeables
// -----------------------------------------------------------------------------

export const alt: <S, I, A>(
  that: Lazy<StatefulParser<S, I, A>>
) => (ma: StatefulParser<S, I, A>) => StatefulParser<S, I, A> =
  (that) => (ma) =>
    alt_(ma, that);

export const ap: <S, I, A>(
  ma: StatefulParser<S, I, A>
) => <B>(mab: StatefulParser<S, I, (a: A) => B>) => StatefulParser<S, I, B> =
  ST.ap(P.Monad);

export const chain: <A, S, I, B>(
  f: (a: A) => StatefulParser<S, I, B>
) => (ma: StatefulParser<S, I, A>) => StatefulParser<S, I, B> = ST.chain(
  P.Monad
);

export const chainFirst: <A, S, I, B>(
  f: (a: A) => StatefulParser<S, I, B>
) => (ma: StatefulParser<S, I, A>) => StatefulParser<S, I, A> = (f) => (ma) =>
  chain_(ma, (a) => map_(f(a), () => a));

export const map: <A, B>(
  f: (a: A) => B
) => <S, I>(ma: StatefulParser<S, I, A>) => StatefulParser<S, I, B> = ST.map(
  P.Functor
);

export const of: <A, S, I>(a: A) => StatefulParser<S, I, A> = ST.of(P.Monad);

// -----------------------------------------------------------------------------
// instances
// -----------------------------------------------------------------------------

export const URI = "StatefulParser";

export type URI = typeof URI;

declare module "fp-ts/lib/HKT" {
  interface URItoKind3<R, E, A> {
    readonly [URI]: StatefulParser<R, E, A>;
  }
}

export const Alt: Alt3<URI> = {
  URI,
  alt: alt_,
  map: map_,
};

export const Alternative: Alternative3<URI> = {
  URI,
  alt: alt_,
  ap: ap_,
  map: map_,
  of,
  zero: fail,
};

export const Applicative: Applicative3<URI> = {
  URI,
  ap: ap_,
  map: map_,
  of,
};

export const Chain: Chain3<URI> = {
  URI,
  ap: ap_,
  chain: chain_,
  map: map_,
};

export const ChainRec: ChainRec3<URI> = {
  URI,
  ap: ap_,
  chain: chain_,
  chainRec: chainRec_,
  map: map_,
};

export const Functor: Functor3<URI> = {
  URI,
  map: map_,
};

export const Monad: Monad3<URI> = {
  URI,
  ap: ap_,
  chain: chain_,
  map: map_,
  of,
};

// -----------------------------------------------------------------------------
// utils
// -----------------------------------------------------------------------------

export const evaluate: <S>(
  s: S
) => <I, A>(ma: StatefulParser<S, I, A>) => P.Parser<I, A> = ST.evaluate(
  P.Functor
);

export const execute: <S>(
  s: S
) => <I, A>(ma: StatefulParser<S, I, A>) => P.Parser<I, S> = ST.execute(
  P.Functor
);

export const lift: <I, A, S>(p: P.Parser<I, A>) => StatefulParser<S, I, A> =
  ST.fromF(P.Functor);

export const log: <S, I, A>(
  ma: StatefulParser<S, I, A>
) => StatefulParser<S, I, A> = (ma) => (s) =>
  pipe(
    P.log(ma(s)),
    P.map(([a, s_]) => {
      console.log(
        `state: start=${JSON.stringify(s)} end=${JSON.stringify(s_)}`
      );
      return [a, s_];
    })
  );

export const struct = sequenceS(Applicative);

export const tuple = sequenceT(Applicative);

// -----------------------------------------------------------------------------
// do notation
// -----------------------------------------------------------------------------

export const bind = bind_(Chain);

export const bindTo = bindTo_(Functor);

import {
  either as E,
  readonlyArray as RA,
  readonlyNonEmptyArray as RNEA,
  stateT,
} from "fp-ts";
import type { Alt3 } from "fp-ts/lib/Alt";
import type { Applicative3 } from "fp-ts/lib/Applicative";
import type { Chain3 } from "fp-ts/lib/Chain";
import { bind as bind_ } from "fp-ts/lib/Chain";
import type { ChainRec3 } from "fp-ts/lib/ChainRec";
import { tailRec } from "fp-ts/lib/ChainRec";
import type { Lazy } from "fp-ts/lib/function";
import { flow, pipe } from "fp-ts/lib/function";
import type { Functor3 } from "fp-ts/lib/Functor";
import { bindTo as bindTo_ } from "fp-ts/lib/Functor";
import type { Predicate } from "fp-ts/lib/Predicate";
import type { Refinement } from "fp-ts/lib/Refinement";
import * as P from "./Parser";
import type { ParseResult, ParseSuccess } from "./ParseResult";
import { error, success } from "./ParseResult";
import type { Stream } from "./Stream";

export type StatefulParser<R, E, A> = stateT.StateT2<P.URI, R, E, A>;

const URI = "StatefulParser";

type URI = typeof URI;

declare module "fp-ts/lib/HKT" {
  interface URItoKind3<R, E, A> {
    readonly [URI]: StatefulParser<R, E, A>;
  }
}

export const ap = stateT.ap(P.Monad);

export const chain = stateT.chain(P.Monad);

export const chainFirst: <E, A, S, B>(
  f: (a: A) => StatefulParser<S, E, B>
) => (ma: StatefulParser<S, E, A>) => StatefulParser<S, E, A> = (f) => (ma) =>
  flow(
    ma,
    P.chain(([a, s]) =>
      pipe(
        f(a)(s),
        P.map(([, s]) => [a, s])
      )
    )
  );

export const evaluate = stateT.evaluate(P.Functor);

export const execute = stateT.execute(P.Functor);

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
    pipe(
      p,
      chain((a) => (f(a) ? of(a) : lift(P.fail())))
    );

export const get: <E, S>() => StatefulParser<S, E, S> = () => (s) =>
  P.of([s, s]);

export const lift = stateT.fromF(P.Functor);

export const log: <S, I, A>(
  ma: StatefulParser<S, I, A>
) => StatefulParser<S, I, A> = (ma) => (s) => (i) =>
  pipe(
    ma(s)(i),
    E.map((a) => {
      console.log(
        `result: ${
          typeof a.value === "object" && a.value != null
            ? JSON.stringify(a.value)
            : a.value
        }, before: ${i.cursor}, after: ${a.next.cursor}`
      );

      return a;
    })
  );

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

// NOTE Not stack safe
export const manyN: <S, E, A>(
  ma: StatefulParser<S, E, A>,
  n: number
) => StatefulParser<S, E, readonly A[]> = (ma, n) =>
  pipe(RA.replicate(n, ma), RA.sequence(Applicative));

// FIXME returns first outgoing position instead of last
// export const manyN = <S, I, A>(
//   parser: StatefulParser<S, I, A>,
//   n: number
// ): StatefulParser<S, I, readonly A[]> =>
//   n === 0
//     ? of([])
//     : pipe(
//         parser,

//         chain((x) =>
//           chainRec_(RNEA.of(x), (acc) =>
//             pipe(
//               lift<I, E.Either<never, RNEA.ReadonlyNonEmptyArray<A>>, S>(
//                 pipe(
//                   acc.length === n ? P.succeed(undefined) : P.fail<I>(),
//                   P.map(() => E.right(acc))
//                 )
//               ),

//               alt(() =>
//                 log(
//                   pipe(
//                     parser,
//                     map((a) => E.left(RA.append(a)(acc)))
//                   )
//                 )
//               )
//             )
//           )
//         )
//       );

export const map = stateT.map(P.Functor);

export const modify: <S, E>(fs: (s: S) => S) => StatefulParser<S, E, void> =
  (fs) => (s) =>
    P.of([undefined, fs(s)]);

export const of = stateT.of(P.Monad);

export const put: <E, S>(s: S) => StatefulParser<S, E, undefined> = (s) => () =>
  P.of([undefined, s]);

export const Functor: Functor3<URI> = {
  URI,
  map: (fa, fab) => pipe(fa, map(fab)),
};

export const bindTo = bindTo_(Functor);

export const Chain: Chain3<URI> = {
  URI,
  ap: (fab, fa) => pipe(fab, ap(fa)),
  chain: (fa, f) => pipe(fa, chain(f)),
  map: Functor.map,
};

export const Applicative: Applicative3<URI> = {
  URI,
  ap: Chain.ap,
  map: Functor.map,
  of,
};

export const Alt: Alt3<URI> = {
  URI,
  alt: (fa, that) => (s) => (i) =>
    pipe(
      fa(s)(i),
      E.alt(() => that()(s)(i))
    ),
  map: Functor.map,
};

export const alt: <S, E, A>(
  that: Lazy<StatefulParser<S, E, A>>
) => (ma: StatefulParser<S, E, A>) => StatefulParser<S, E, A> =
  (that) => (ma) =>
    Alt.alt(ma, that);

export const bind = bind_(Chain);

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
              result.next,
              start
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

export const ChainRec: ChainRec3<URI> = {
  URI,
  ap: Chain.ap,
  chain: Chain.chain,
  chainRec: chainRec_,
  map: Functor.map,
};

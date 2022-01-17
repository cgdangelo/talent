import { readonlyArray as RA, stateT } from "fp-ts";
import type { Applicative3 } from "fp-ts/lib/Applicative";
import type { Chain3 } from "fp-ts/lib/Chain";
import { bind as bind_ } from "fp-ts/lib/Chain";
import { flow, pipe } from "fp-ts/lib/function";
import type { Functor3 } from "fp-ts/lib/Functor";
import { bindTo as bindTo_ } from "fp-ts/lib/Functor";
import * as P from "./Parser";

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

export const get: <E, S>() => StatefulParser<S, E, S> = () => (s) =>
  P.of([s, s]);

export const lift = stateT.fromF(P.Functor);

// NOTE Not stack safe
export const manyN: <S, E, A>(
  ma: StatefulParser<S, E, A>,
  n: number
) => StatefulParser<S, E, readonly A[]> = (ma, n) =>
  pipe(RA.replicate(n, ma), RA.sequence(Applicative));

export const map = stateT.map(P.Functor);

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

export const bind = bind_(Chain);

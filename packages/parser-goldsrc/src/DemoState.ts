import * as P from "@talent/parser/lib/Parser";
import { stateT } from "fp-ts";
import type { Chain3 } from "fp-ts/lib/Chain";
import { bind as bind_ } from "fp-ts/lib/Chain";
import { flow, pipe } from "fp-ts/lib/function";
import type { Functor3 } from "fp-ts/lib/Functor";
import { bindTo as bindTo_ } from "fp-ts/lib/Functor";

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
  f: (a: A) => stateT.StateT2<P.URI, S, E, B>
) => (ma: stateT.StateT2<P.URI, S, E, A>) => stateT.StateT2<P.URI, S, E, A> =
  (f) => (ma) =>
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

export const lift = stateT.fromF(P.Functor);

export const map = stateT.map(P.Functor);

export const of = stateT.of(P.Monad);

export const put: <E, S>(s: S) => stateT.StateT2<P.URI, S, E, undefined> =
  (s) => () =>
    P.of([undefined, s]);

export const get: <E, S>() => stateT.StateT2<P.URI, S, E, S> = () => (s) =>
  P.of([s, s]);

const Functor: Functor3<URI> = {
  URI,
  map: (fa, fab) => pipe(fa, map(fab)),
};

export const bindTo = bindTo_(Functor);

const Chain: Chain3<URI> = {
  URI,
  ap: (fab, fa) => pipe(fab, ap(fa)),
  chain: (fa, f) => pipe(fa, chain(f)),
  map: Functor.map,
};

export const bind = bind_(Chain);

export type DemoStateParser<A> = StatefulParser<DemoState, number, A>;

export type DemoState = {
  readonly networkProtocol: number;
};

export const initialState: DemoState = {
  networkProtocol: 0,
};

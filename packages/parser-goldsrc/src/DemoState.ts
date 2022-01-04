import * as P from "@talent/parser/lib/Parser";
import { stateT } from "fp-ts";
import { flow, pipe } from "fp-ts/lib/function";

export type DemoState = {
  readonly networkProtocol: number;
};

export const initialState: DemoState = {
  networkProtocol: 0,
};

export type DemoStateParser<A> = stateT.StateT2<P.URI, DemoState, number, A>;

export const lift = stateT.fromF(P.Functor);

export const ap = stateT.ap(P.Monad);

export const chain = stateT.chain(P.Monad);

export const evaluate = stateT.evaluate(P.Functor);

export const execute = stateT.execute(P.Functor);

export const map = stateT.map(P.Functor);

export const of = stateT.of(P.Monad);

export const chainFirst: <E, A, S>(
  f: (a: A) => stateT.StateT2<P.URI, S, E, A>
) => (ma: stateT.StateT2<P.URI, S, E, A>) => stateT.StateT2<P.URI, S, E, A> =
  (f) => (ma) =>
    flow(
      ma,
      P.chainFirst(([a, s]) => pipe(f(a)(s)))
    );

export const put: <I, S>(
  newState: S
) => (oldState: S) => P.Parser<I, [void, S]> = (s) => () =>
  P.of([undefined, s]);

export const get: <I, S>() => (s: S) => P.Parser<I, [S, S]> = () => (s) =>
  P.of([s, s]);

//===============
// worky
// export declare const put: <S, I>(s: S) => (_: S) => P.Parser<I, [void, S]>;

// export declare const get: <S, I>() => (s: S) => P.Parser<I, [S, S]>;

//===============
// export declare const get: <S, I>() => (s: S) => P.Parser<I, [S, S]>;
//

// export const put: <I, S>(s: S) => () => P.Parser<I, [void, S]> = (s) => () =>
//   P.of([undefined, s]);

// export const get: <I, S>() => (s: S) => P.Parser<I, [S, S]> = () => (s) =>
//   P.of([s, s]);

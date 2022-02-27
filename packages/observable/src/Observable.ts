import type { Alt1 } from "fp-ts/lib/Alt";
import type { Alternative1 } from "fp-ts/lib/Alternative";
import type { Applicative1 } from "fp-ts/lib/Applicative";
import type { Apply1 } from "fp-ts/lib/Apply";
import type { Chain1 } from "fp-ts/lib/Chain";
import { pipe } from "fp-ts/lib/function";
import type { Functor1 } from "fp-ts/lib/Functor";
import type { Monad1 } from "fp-ts/lib/Monad";
import type { Pointed1 } from "fp-ts/lib/Pointed";
import type { Zero1 } from "fp-ts/lib/Zero";
import { combineLatest, EMPTY, Observable, of as rxOf } from "rxjs";
import * as RX from "rxjs/operators";

// -----------------------------------------------------------------------------
// model
// -----------------------------------------------------------------------------

export { Observable };

// -----------------------------------------------------------------------------
// constructors
// -----------------------------------------------------------------------------

export const of: <A>(a: A) => Observable<A> = rxOf;

export const zero: <A = never>() => Observable<A> = () => EMPTY;

// -----------------------------------------------------------------------------
// instances
// -----------------------------------------------------------------------------

export const URI = "Observable";

export type URI = typeof URI;

declare module "fp-ts/lib/HKT" {
  interface URItoKind<A> {
    readonly [URI]: Observable<A>;
  }
}

const alt_: Alt1<URI>["alt"] = (fa, that) =>
  fa.pipe(RX.catchError(() => that()));

const ap_: Apply1<URI>["ap"] = (fab, fa) =>
  pipe(
    combineLatest([fab, fa]),
    map(([f, a]) => f(a))
  );

const chain_: Chain1<URI>["chain"] = (fa, f) => pipe(fa, RX.mergeMap(f));

const map_: Functor1<URI>["map"] = (fa, f) => fa.pipe(RX.map(f));

export const ap: <A>(
  fa: Observable<A>
) => <B>(fab: Observable<(a: A) => B>) => Observable<B> = (fa) => (fab) =>
  ap_(fab, fa);

export const chain: <A, B>(
  f: (a: A) => Observable<B>
) => (fa: Observable<A>) => Observable<B> = (f) => (fa) => chain_(fa, f);

export const map: <A, B>(
  f: (a: A) => B
) => (fa: Observable<A>) => Observable<B> = (f) => (fa) => map_(fa, f);

export const Alt: Alt1<URI> = {
  URI,
  alt: alt_,
  map: map_,
};

export const Alternative: Alternative1<URI> = {
  URI,
  alt: alt_,
  ap: ap_,
  map: map_,
  of,
  zero,
};

export const Applicative: Applicative1<URI> = {
  URI,
  ap: ap_,
  map: map_,
  of,
};

export const Apply: Apply1<URI> = {
  URI,
  ap: ap_,
  map: map_,
};

export const Chain: Chain1<URI> = {
  URI,
  ap: ap_,
  map: map_,
  chain: chain_,
};

export const Functor: Functor1<URI> = {
  URI,
  map: map_,
};

export const Monad: Monad1<URI> = {
  URI,
  ap: ap_,
  chain: chain_,
  map: map_,
  of,
};

export const Pointed: Pointed1<URI> = {
  URI,
  of,
};

export const Zero: Zero1<URI> = {
  URI,
  zero,
};

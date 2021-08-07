import { array as A, either as E } from "fp-ts";
import type { Alt2 } from "fp-ts/lib/Alt";
import type { Applicative2 } from "fp-ts/lib/Applicative";
import type { Apply2 } from "fp-ts/lib/Apply";
import type { Chain2 } from "fp-ts/lib/Chain";
import type { Lazy } from "fp-ts/lib/function";
import { flow, pipe } from "fp-ts/lib/function";
import type { Functor2 } from "fp-ts/lib/Functor";
import type { Monad2 } from "fp-ts/lib/Monad";
import type { ParseResult } from "./ParseResult";
import { failure, success } from "./ParseResult";
import type { Stream } from "./Stream";
import { of as stream } from "./Stream";

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

const map_: Functor2<URI>["map"] = (fa, f) => (i) =>
  pipe(
    fa(i),
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

export const of: <I, A>(a: A) => Parser<I, A> = (a) => (i) => success(a, i, i);

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

export const succeed: <I, A>(a: A) => Parser<I, A> = of;

export const fail: <I, A = never>(e: string) => Parser<I, A> = (e) => () =>
  failure(e);

export const manyN: <I, A>(fa: Parser<I, A>, n: number) => Parser<I, A[]> = (
  fa,
  n
) => pipe(A.replicate(n, fa), A.sequence(Applicative));

export const skip =
  (length: number) =>
  <I>(i: Stream<I>): ParseResult<I, undefined> =>
    success(undefined, i, stream(i.buffer, i.cursor + length));

export const seek =
  (offset: number) =>
  <I>(i: Stream<I>): ParseResult<I, undefined> =>
    success(undefined, i, stream(i.buffer, offset));

export const manyTill =
  <I, A, B>(p: Parser<I, A>, closingP: Parser<I, B>): Parser<I, readonly A[]> =>
  (i) => {
    function manyTill_(
      i: Stream<I>,
      acc: ParseResult<I, A>[] = []
    ): typeof acc {
      const closingPR = closingP(i);

      if (E.isRight(closingPR)) {
        return acc;
      }

      const pPR = p(i);

      if (E.isLeft(pPR)) {
        return acc;
      }

      acc.push(pPR);

      return manyTill_(pPR.right.next, acc);
    }

    return pipe(manyTill_(i), E.sequenceArray, (mas) =>
      E.isRight(mas)
        ? success(
            mas.right.map((a) => a.value),
            i,
            mas.right[mas.right.length - 1]?.next ?? i
          )
        : failure("")
    );
  };

export const withLog = <I, A>(fa: Parser<I, A>): Parser<I, A> =>
  pipe(
    fa,
    chain((a) => {
      console.log("parsed", a);

      return succeed(a);
    })
  );

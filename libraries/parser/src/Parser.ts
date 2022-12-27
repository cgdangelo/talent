import {
  either as E,
  readonlyArray as RA,
  readonlyNonEmptyArray as RNEA,
} from "fp-ts";
import { sequenceS, sequenceT } from "fp-ts/lib/Apply";
import { pipe } from "fp-ts/lib/function";
import * as P from "parser-ts/lib/Parser";
import { success } from "./ParseResult";
import { stream } from "./Stream";

export * from "parser-ts/lib/Parser";

export const skip: <I>(offset: number) => P.Parser<I, void> = (offset) => (i) =>
  pipe(i, seek(i.cursor + offset));

export const seek: <I>(cursor: number) => P.Parser<I, void> = (cursor) => (i) =>
  success(undefined, i, stream(i.buffer, cursor));

export const manyN1 = <I, A>(
  parser: P.Parser<I, A>,
  n: number
): P.Parser<I, RNEA.ReadonlyNonEmptyArray<A>> =>
  n === 0
    ? P.fail()
    : pipe(
        parser,

        P.chain((x) =>
          P.ChainRec.chainRec(RNEA.of(x), (acc) =>
            pipe(
              acc.length === n ? P.succeed(undefined) : P.fail<I>(),
              P.map(() => E.right(acc)),
              P.alt(() =>
                pipe(
                  parser,
                  P.map((a) => E.left(RA.append(a)(acc)))
                )
              )
            )
          )
        ),

        P.filter((a) => a.length > 0)
      );

export const manyN = <I, A>(
  parser: P.Parser<I, A>,
  n: number
): P.Parser<I, readonly A[]> =>
  pipe(
    manyN1(parser, n),
    P.alt(() => P.of<I, readonly A[]>([]))
  );

export const take = <I>(length: number): P.Parser<I, readonly I[]> =>
  pipe(
    P.withStart(P.of<I, void>(undefined)),

    // Check for overflow
    P.filter(
      ([, { buffer, cursor }]) =>
        length >= 0 && cursor + length <= buffer.length
    ),

    P.map(([, { buffer, cursor }]) => buffer.slice(cursor, cursor + length)),

    P.apFirst(skip(length))
  );

export const struct = sequenceS(P.Applicative);

export const tuple = sequenceT(P.Applicative);

/* istanbul ignore next: Util function, don't care */
export const log: <I, A>(fa: P.Parser<I, A>) => P.Parser<I, A> = (fa) => (i) =>
  pipe(
    fa(i),
    E.map((a) => {
      console.log(
        `result: ${JSON.stringify(a.value)}, before: ${i.cursor}, after: ${
          a.next.cursor
        }`
      );

      return a;
    })
  );

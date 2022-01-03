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

export const skip = <I>(offset: number): P.Parser<I, void> =>
  pipe(
    P.withStart(P.of<I, number>(offset)),
    P.chain(([offset, i]) => seek(i.cursor + offset))
  );

export const seek =
  <I>(cursor: number): P.Parser<I, void> =>
  (i) =>
    success(undefined, i, stream(i.buffer, cursor));

export const manyN = <I, A>(
  parser: P.Parser<I, A>,
  n: number
): P.Parser<I, readonly A[]> =>
  n === 0
    ? P.of([])
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
        )
      );

export const take = <I>(length: number): P.Parser<I, I[]> =>
  pipe(
    P.withStart(P.of<I, number>(length)),
    P.map(([length, i]) => i.buffer.slice(i.cursor, i.cursor + length)),
    P.apFirst(skip(length))
  );

export const log: <I, A>(fa: P.Parser<I, A>) => P.Parser<I, A> = (fa) => (i) =>
  pipe(
    fa(i),
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

export const struct = sequenceS(P.Applicative);

export const tuple = sequenceT(P.Applicative);

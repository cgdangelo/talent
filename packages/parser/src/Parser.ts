import * as A from "fp-ts/Array";
import * as E from "fp-ts/Either";
import { pipe } from "fp-ts/lib/function";
import { success } from "parser-ts/lib/ParseResult";
import { stream } from "parser-ts/lib/Stream";
import * as P from "parser-ts/Parser";

export const skip: <I>(offset: number) => P.Parser<I, void> = (offset) => (i) =>
  success(undefined, stream(i.buffer, i.cursor + offset), i);

export const seek =
  <I>(cursor: number): P.Parser<I, void> =>
  (i) =>
    success(undefined, stream(i.buffer, cursor), i);

// HACK Not stack safe, not even a little
export const manyN: <I, A>(fa: P.Parser<I, A>, n: number) => P.Parser<I, A[]> =
  (fa, n) => pipe(A.replicate(n, fa), A.sequence(P.Applicative));

// HACK Not stack safe, not even a little
// export const take: <I>(n: number) => P.Parser<I, I[]> = (n) =>
//   manyN(P.item(), n);

export const take: <I>(n: number) => P.Parser<I, I[]> = (n) => (i) =>
  success(
    i.buffer.slice(i.cursor, i.cursor + n),
    stream(i.buffer, i.cursor + n),
    i
  );

export const logPositions: <I, A>(fa: P.Parser<I, A>) => P.Parser<I, A> =
  (fa) => (i) =>
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

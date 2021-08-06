import { pipe } from "fp-ts/lib/function";
import * as P from "./Parser";
import * as PR from "./ParseResult";
import type { Stream } from "./Stream";

const empty: Stream<never[]> = { buffer: [], cursor: 0 };

const resultS = <A>(a: A): PR.ParseResult<never[], A> =>
  PR.success(a, empty, empty);

const resultF: <I, A = never>(e: string) => PR.ParseResult<I, A> = (e) =>
  PR.failure(e);

describe("Parser", () => {
  test("alt", () => {
    expect(
      pipe(
        P.of("a"),
        P.alt(() => P.of("b"))
      )(empty)
    ).toStrictEqual(resultS("a"));

    expect(
      pipe(
        P.of("a"),
        P.alt(() => P.fail("b"))
      )(empty)
    ).toStrictEqual(resultS("a"));

    expect(
      pipe(
        P.fail("a"),
        P.alt(() => P.of("b"))
      )(empty)
    ).toStrictEqual(resultS("b"));

    expect(
      pipe(
        P.fail("a"),
        P.alt(() => P.fail("b"))
      )(empty)
    ).toStrictEqual(resultF("b"));
  });

  test("ap", () => {
    const f = (a: string) => a.repeat(3);

    expect(pipe(P.of(f), P.ap(P.of("a")))(empty)).toStrictEqual(resultS("aaa"));

    expect(pipe(P.of(f), P.ap(P.fail("a")))(empty)).toStrictEqual(resultF("a"));

    expect(pipe(P.fail("a"), P.ap(P.of("b")))(empty)).toStrictEqual(
      resultF("a")
    );

    expect(pipe(P.fail("a"), P.ap(P.fail("b")))(empty)).toStrictEqual(
      resultF("a")
    );
  });

  test("chain", () => {
    expect(
      pipe(
        P.of("a"),
        P.chain((a) => P.of(a.repeat(3)))
      )(empty)
    ).toStrictEqual(resultS("aaa"));

    expect(
      pipe(
        P.of("a"),
        P.chain((a) => P.fail(a.repeat(3)))
      )(empty)
    ).toStrictEqual(resultF("aaa"));

    expect(
      pipe(
        P.fail<unknown, string>("a"),
        P.chain((a) => P.of(a.repeat(3)))
      )(empty)
    ).toStrictEqual(resultF("a"));

    expect(
      pipe(
        P.fail<unknown, string>("a"),
        P.chain((a) => P.fail(a.repeat(3)))
      )(empty)
    ).toStrictEqual(resultF("a"));
  });

  test("map", () => {
    expect(
      pipe(
        P.of("a"),
        P.map((a) => a.repeat(3))
      )(empty)
    ).toStrictEqual(resultS("aaa"));

    expect(
      pipe(
        P.fail<unknown, string>("a"),
        P.map((a) => a.repeat(3))
      )(empty)
    ).toStrictEqual(resultF("a"));
  });
});

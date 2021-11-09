import { pipe } from "fp-ts/lib/function";
import * as P from "./Parser";
import * as PR from "./ParseResult";
import type { Stream } from "./Stream";
import { stream } from "./Stream";

const empty: Stream<never[]> = { buffer: [], cursor: 0 };

const resultS: <A>(a: A) => PR.ParseResult<never[], A> = (a) =>
  PR.success(a, empty, empty);

const resultF: <I, A = never>(e: string) => PR.ParseResult<I, A> = PR.failure;

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

  test("chainFirst", () => {
    expect(
      pipe(
        P.of("a"),
        P.chainFirst(() => P.succeed("b"))
      )(empty)
    ).toStrictEqual(resultS("a"));

    expect(
      pipe(
        P.of("a"),
        P.chainFirst(() => P.fail("b"))
      )(empty)
    ).toStrictEqual(resultF("b"));
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

  test("of", () => {
    expect(pipe(empty, P.of("foo"))).toStrictEqual(
      PR.success("foo", empty, empty)
    );

    expect(
      pipe(stream(empty.buffer, 10), (i) =>
        PR.success("foo", i, stream(i.buffer, i.cursor + 10))
      )
    ).toStrictEqual(
      PR.success("foo", stream(empty.buffer, 10), stream(empty.buffer, 20))
    );
  });

  test("fail", () => {
    expect(pipe(empty, P.fail("foo"))).toStrictEqual(PR.failure("foo"));
  });

  test("skip", () => {
    expect(pipe(empty, P.skip(10))).toStrictEqual(
      PR.success(undefined, empty, stream(empty.buffer, 10))
    );

    expect(pipe(stream(empty.buffer, 10), P.skip(10))).toStrictEqual(
      PR.success(undefined, stream(empty.buffer, 10), stream(empty.buffer, 20))
    );
  });

  test("seek", () => {
    expect(pipe(empty, P.seek(10))).toStrictEqual(
      PR.success(undefined, empty, stream(empty.buffer, 10))
    );

    expect(pipe(stream(empty.buffer, 100), P.seek(1))).toStrictEqual(
      PR.success(undefined, stream(empty.buffer, 100), stream(empty.buffer, 1))
    );
  });

  test("manyN", () => {
    const buffer = [..."foobarbaz"];

    expect(
      pipe(
        stream(buffer),
        P.manyN(
          (i) =>
            PR.success(i.buffer[i.cursor], i, stream(i.buffer, i.cursor + 1)),
          6
        )
      )
    ).toStrictEqual(
      PR.success([..."foobar"], stream(buffer), stream(buffer, 6))
    );

    // TODO Other cases
  });

  test("many1Till", () => {
    const buffer = [..."foobar baz"];
    const charP: P.Parser<string[], string | undefined> = (i) =>
      PR.success(i.buffer[i.cursor], i, stream(i.buffer, i.cursor + 1));

    expect(
      pipe(
        stream(buffer),

        P.many1Till(
          charP,

          pipe(
            charP,
            P.chain(
              (a) => (i) =>
                a === " "
                  ? PR.success(a, i, stream(i.buffer, i.cursor + 1))
                  : PR.failure("")
            )
          )
        )
      )
    );
  });

  test("sat", () => {
    expect(
      pipe(
        empty,
        P.sat(
          P.of("a"),
          (a) => a === "a",
          (a) => a
        )
      )
    ).toStrictEqual(PR.success("a", empty, empty));

    expect(
      pipe(
        empty,
        P.sat(
          P.of("a"),
          (a) => a === "b",
          (a) => a
        )
      )
    ).toStrictEqual(PR.failure("a"));

    expect(
      pipe(
        empty,
        P.sat(
          P.fail("a"),
          (a) => a === "a",
          () => "unused"
        )
      )
    ).toStrictEqual(PR.failure("a"));
  });
});

import { pipe } from "fp-ts/lib/function";
import * as P from "../src/Parser";
import * as PR from "../src/ParseResult";
import { stream } from "../src/Stream";

describe("Parser", () => {
  test("skip", () => {
    expect(pipe(stream(new Array(10)), P.skip(10))).toStrictEqual(
      PR.success(undefined, stream(new Array(10)), stream(new Array(10), 10))
    );

    expect(pipe(stream(new Array(20), 10), P.skip(10))).toStrictEqual(
      PR.success(
        undefined,
        stream(new Array(20), 10),
        stream(new Array(20), 20)
      )
    );

    expect(pipe(stream([]), P.skip(1))).toStrictEqual(PR.error(stream([])));

    expect(pipe(stream([]), P.skip(-1))).toStrictEqual(PR.error(stream([])));
  });

  test("seek", () => {
    expect(pipe(stream(new Array(10)), P.seek(10))).toStrictEqual(
      PR.success(undefined, stream(new Array(10)), stream(new Array(10), 10))
    );

    expect(pipe(stream(new Array(100), 100), P.seek(1))).toStrictEqual(
      PR.success(
        undefined,
        stream(new Array(100), 100),
        stream(new Array(100), 1)
      )
    );

    expect(pipe(stream([]), P.seek(1))).toStrictEqual(PR.error(stream([])));

    expect(pipe(stream([]), P.seek(-1))).toStrictEqual(PR.error(stream([])));
  });

  test("manyN1", () => {
    const buffer = "foobarbaz".split("");

    expect(pipe(stream(buffer), P.manyN1(P.item(), 6))).toStrictEqual(
      PR.success("foobar".split(""), stream(buffer), stream(buffer, 6))
    );

    expect(pipe(stream([]), P.manyN1(P.item(), 0))).toStrictEqual(
      PR.error(stream([]))
    );

    expect(pipe(stream([]), P.manyN1(P.item(), 6))).toStrictEqual(
      PR.error(stream([]))
    );
  });

  test("manyN", () => {
    const buffer = "foobarbaz".split("");

    expect(pipe(stream(buffer), P.manyN(P.item(), 6))).toStrictEqual(
      PR.success("foobar".split(""), stream(buffer), stream(buffer, 6))
    );

    expect(pipe(stream([]), P.manyN(P.item(), 6))).toStrictEqual(
      PR.success([], stream([]), stream([]))
    );
  });

  test("take", () => {
    expect(pipe(stream(["a", "b", "c"]), P.take(1))).toStrictEqual(
      PR.success(["a"], stream(["a", "b", "c"]), stream(["a", "b", "c"], 1))
    );

    expect(pipe(stream([]), P.take(100))).toStrictEqual(PR.error(stream([])));

    expect(pipe(stream([]), P.take(-1))).toStrictEqual(PR.error(stream([])));
  });

  test("struct", () => {
    expect(
      pipe(stream([]), P.struct({ a: P.of("a"), b: P.of("b") }))
    ).toStrictEqual(PR.success({ a: "a", b: "b" }, stream([]), stream([])));

    expect(
      pipe(stream([]), P.struct({ a: P.of("a"), b: P.fail() }))
    ).toStrictEqual(PR.error(stream([])));
  });

  test("tuple", () => {
    expect(pipe(stream([]), P.tuple(P.of("a"), P.of("b")))).toStrictEqual(
      PR.success(["a", "b"], stream([]), stream([]))
    );

    expect(pipe(stream([]), P.tuple(P.of("a"), P.fail()))).toStrictEqual(
      PR.error(stream([]))
    );
  });
});

// import * as PR from "../src/ParseResult";
import { pipe } from "fp-ts/lib/function";
import { error, success } from "../src/ParseResult";
import * as _ from "../src/StatefulParser";
import { stream } from "../src/Stream";

describe("StatefulParser", () => {
  describe("constructors", () => {
    test("fail", () => {
      expect(_.fail()("a")(stream([]))).toStrictEqual(error(stream([])));
    });

    test("get", () => {
      expect(_.get()("s")(stream([]))).toStrictEqual(
        success(["s", "s"], stream([]), stream([]))
      );
    });

    test("modify", () => {
      expect(
        _.modify((s: string) => s.repeat(3))("s")(stream([]))
      ).toStrictEqual(success([undefined, "sss"], stream([]), stream([])));
    });

    test("put", () => {
      expect(_.put("s")("")(stream([]))).toStrictEqual(
        success([undefined, "s"], stream([]), stream([]))
      );
    });

    test("succeed", () => {
      expect(_.succeed("a")("s")(stream([]))).toStrictEqual(
        success(["a", "s"], stream([]), stream([]))
      );
    });
  });

  describe("combinators", () => {
    test("filter", () => {
      const f = _.filter((a: number) => a > 0);

      expect(pipe(_.of(1), f)("s")(stream([]))).toStrictEqual(
        success([1, "s"], stream([]), stream([]))
      );

      expect(pipe(_.of(0), f)("s")(stream([]))).toStrictEqual(
        error(stream([]))
      );
    });

    test("many1", () => {
      const p = pipe(
        _.item<string, string>(),
        _.chainFirst((a) => _.modify((s) => s.concat(a.toUpperCase())))
      );

      expect(_.many1(p)("")(stream(["a", "b", "c", "d"]))).toStrictEqual(
        success(
          [["a", "b", "c", "d"], "ABCD"],
          stream(["a", "b", "c", "d"]),
          stream(["a", "b", "c", "d"], 4)
        )
      );

      expect(_.many1(p)("")(stream([]))).toStrictEqual(error(stream([])));
    });

    test("many", () => {
      const p = pipe(
        _.item<string, string>(),
        _.chainFirst((a) => _.modify((s) => s.concat(a.toUpperCase())))
      );

      expect(_.many(p)("")(stream(["a", "b", "c", "d"]))).toStrictEqual(
        success(
          [["a", "b", "c", "d"], "ABCD"],
          stream(["a", "b", "c", "d"]),
          stream(["a", "b", "c", "d"], 4)
        )
      );

      expect(_.many(p)("s")(stream([]))).toStrictEqual(
        success([[], "s"], stream([]), stream([]))
      );
    });

    test("many1Till", () => {
      const p = pipe(
        _.item<string, string>(),
        _.filter((a) => a === "a"),
        _.chainFirst((a) => _.modify((s) => s.concat(a.toUpperCase())))
      );

      const term = pipe(
        _.item<string, string>(),
        _.filter((a) => a === "x")
      );

      expect(
        _.many1Till(p, term)("")(stream(["a", "a", "b", "x"]))
      ).toStrictEqual(error(stream(["a", "a", "b", "x"])));

      expect(_.many1Till(p, term)("")(stream(["x"]))).toStrictEqual(
        error(stream(["x"]))
      );

      expect(_.many1Till(p, term)("")(stream(["a", "a", "a"]))).toStrictEqual(
        error(stream(["a", "a", "a"]))
      );

      expect(_.many1Till(p, term)("")(stream(["a", "a", "x"]))).toStrictEqual(
        success(
          [["a", "a"], "AA"],
          stream(["a", "a", "x"]),
          stream(["a", "a", "x"], 3)
        )
      );
    });

    test("manyTill", () => {
      const p = pipe(
        _.item<string, string>(),
        _.filter((a) => a === "a"),
        _.chainFirst((a) => _.modify((s) => s.concat(a.toUpperCase())))
      );

      const term = pipe(
        _.item<string, string>(),
        _.filter((a) => a === "x")
      );

      expect(
        _.manyTill(p, term)("")(stream(["a", "a", "b", "x"]))
      ).toStrictEqual(error(stream(["a", "a", "b", "x"])));

      expect(_.manyTill(p, term)("")(stream(["x"]))).toStrictEqual(
        success([[], ""], stream(["x"]), stream(["x"], 1))
      );

      expect(_.manyTill(p, term)("")(stream(["a", "a", "a"]))).toStrictEqual(
        error(stream(["a", "a", "a"]))
      );

      expect(_.manyTill(p, term)("")(stream(["a", "a", "x"]))).toStrictEqual(
        success(
          [["a", "a"], "AA"],
          stream(["a", "a", "x"]),
          stream(["a", "a", "x"], 3)
        )
      );
    });

    test("manyN1", () => {
      const p = pipe(
        _.item<string, string>(),
        _.chainFirst((a) => _.modify((s) => s.concat(a.toUpperCase())))
      );

      expect(_.manyN1(p, 2)("")(stream([]))).toStrictEqual(error(stream([])));

      expect(_.manyN1(p, 4)("")(stream(["a", "a", "a"]))).toStrictEqual(
        error(stream(["a", "a", "a"]))
      );

      expect(_.manyN1(p, 2)("")(stream(["a", "a"]))).toStrictEqual(
        success([["a", "a"], "AA"], stream(["a", "a"]), stream(["a", "a"], 2))
      );
    });
  });

  describe("pipeables", () => {
    test("alt", () => {
      expect(
        _.alt(() => _.of("that"))(_.of("ma"))("s")(stream([]))
      ).toStrictEqual(success(["ma", "s"], stream([]), stream([])));

      expect(
        _.alt(() => _.of("that"))(_.fail())("s")(stream([]))
      ).toStrictEqual(success(["that", "s"], stream([]), stream([])));
    });

    test("altW", () => {
      expect(
        _.altW(() => _.of(123))(_.of("ma"))("s")(stream([]))
      ).toStrictEqual(success(["ma", "s"], stream([]), stream([])));

      expect(_.altW(() => _.of(123))(_.fail())("s")(stream([]))).toStrictEqual(
        success([123, "s"], stream([]), stream([]))
      );
    });

    test("chain", () => {
      expect(
        pipe(
          _.of("a"),
          _.chain((a) => _.of(a.repeat(3)))
        )("s")(stream([]))
      ).toStrictEqual(success(["aaa", "s"], stream([]), stream([])));
    });

    test("chainFirst", () => {
      expect(
        pipe(
          _.item<string, string>(),
          _.chainFirst((a) => _.modify((s) => s.concat(a.toUpperCase())))
        )("")(stream(["a", "b", "c"]))
      ).toStrictEqual(
        success(["a", "A"], stream(["a", "b", "c"]), stream(["a", "b", "c"], 1))
      );
    });
  });
});

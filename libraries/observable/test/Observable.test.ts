import { pipe } from "fp-ts/lib/function";
import { RunHelpers, TestScheduler } from "rxjs/testing";
import * as _ from "../src/Observable";

const testScheduler = new TestScheduler((actual, expected) =>
  expect(actual).toStrictEqual(expected)
);

const test$: (name: string, f: (helpers: RunHelpers) => void) => void = (
  name,
  f
) => test(name, () => testScheduler.run(f));

describe("Observable", () => {
  describe("constructors", () => {
    test$("from", ({ expectObservable }) =>
      expectObservable(_.from([1, 2])).toBe("(ab|)", { a: 1, b: 2 })
    );

    test$("of", ({ expectObservable }) =>
      expectObservable(_.of(1)).toBe("(a|)", { a: 1 })
    );

    test$("zero", ({ expectObservable }) =>
      expectObservable(_.zero()).toBe("(|)")
    );
  });

  describe("combinators", () => {
    test$("filter", ({ expectObservable }) =>
      expectObservable(
        pipe(
          _.from([1, 2, 3, 4]),
          _.filter((a) => a % 2 === 0)
        )
      ).toEqual(_.from([2, 4]))
    );
  });

  describe("instances", () => {
    test$("alt", ({ expectObservable }) =>
      expectObservable(
        pipe(
          _.of(1),
          _.alt(() => _.of(2))
        )
      ).toEqual(_.from([1, 2]))
    );

    test$("ap", ({ expectObservable }) =>
      expectObservable(
        pipe(
          _.of((a: number) => a * 2),
          _.ap(_.of(1))
        )
      ).toEqual(_.of(2))
    );

    test$("chain", ({ expectObservable }) =>
      expectObservable(
        pipe(
          _.of(1),
          _.chain((a) => _.of(a * 2))
        )
      ).toEqual(_.of(2))
    );

    test$("map", ({ expectObservable }) =>
      expectObservable(
        pipe(
          _.of(1),
          _.map((a) => a * 2)
        )
      ).toEqual(_.of(2))
    );
  });
});

import { pipe } from "fp-ts/lib/function";
import * as P from "./Parser";
import * as PR from "./ParseResult";
import type { Stream } from "./Stream";

const empty: Stream<void> = { buffer: undefined, cursor: 0 };

describe("Parser", () => {
  test("alt", () => {
    expect(
      pipe(
        P.of("a"),
        P.alt(() => P.of("b"))
      )(empty)
    ).toStrictEqual(PR.success("a", empty, empty));

    expect(
      pipe(
        P.of("a"),
        P.alt(() => P.fail("b"))
      )(empty)
    ).toStrictEqual(PR.success("a", empty, empty));

    expect(
      pipe(
        P.fail("a"),
        P.alt(() => P.of("b"))
      )(empty)
    ).toStrictEqual(PR.success("b", empty, empty));

    expect(
      pipe(
        P.fail("a"),
        P.alt(() => P.fail("b"))
      )(empty)
    ).toStrictEqual(PR.failure("b"));
  });
});

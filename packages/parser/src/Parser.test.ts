import { pipe } from "fp-ts/lib/function";
import * as P from "./Parser";
import * as PR from "./ParseResult";
import type { Stream } from "./Stream";
import { stream } from "./Stream";

const empty: Stream<never> = { buffer: [], cursor: 0 };

describe("Parser", () => {
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
});

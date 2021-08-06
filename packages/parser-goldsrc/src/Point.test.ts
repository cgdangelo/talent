import { success } from "@talent/parser/lib/ParseResult";
import { of as stream } from "@talent/parser/lib/Stream";
import { pipe } from "fp-ts/lib/function";
import { point } from "./Point";

describe("Point", () => {
  test("point", () => {
    const buffer = Buffer.of(1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4);

    expect(pipe(stream(buffer), point)).toStrictEqual(
      success(
        {
          x: 1.539989614439558e-36,
          y: 1.539989614439558e-36,
          z: 1.539989614439558e-36,
        },
        stream(buffer),
        stream(buffer, 12)
      )
    );
  });
});

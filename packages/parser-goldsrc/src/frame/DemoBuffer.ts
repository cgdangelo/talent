import { buffer as B } from "@talent/parser-buffer";
import { take } from "@talent/parser/lib/Parser";
import { pipe } from "fp-ts/lib/function";
import { parser as P } from "parser-ts";

export const demoBuffer: B.BufferParser<Buffer> = pipe(
  B.int32_le,
  P.chain((n) => take(n)),
  P.map((as) => Buffer.from(as))
);

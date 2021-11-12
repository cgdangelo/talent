import { buffer as B } from "@talent/parser-buffer";
import * as P from "@talent/parser/lib/Parser";
import { pipe } from "fp-ts/lib/function";

export const demoBuffer: B.BufferParser<Buffer> = pipe(
  B.uint32_le,
  P.chain((n) => P.take(n)),
  P.map((as) => Buffer.from(as))
);

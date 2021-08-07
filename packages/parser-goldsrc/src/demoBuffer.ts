import { parser as P } from "@talent/parser";
import { buffer as B } from "@talent/parser-buffer";
import { pipe } from "fp-ts/lib/function";

export const demoBuffer: B.BufferParser<Buffer> = pipe(
  B.int32_le,
  P.chain(B.take)
);

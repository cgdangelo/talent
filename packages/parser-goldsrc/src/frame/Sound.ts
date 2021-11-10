import { buffer as B } from "@talent/parser-buffer";
import * as P from "@talent/parser/lib/Parser";
import { sequenceS } from "fp-ts/lib/Apply";
import { pipe } from "fp-ts/lib/function";

export type Sound = {
  readonly channel: number;
  readonly sample: Buffer;
  readonly attenuation: number;
  readonly volume: number;
  readonly flags: number;
  readonly pitch: number;
};

export const sound: B.BufferParser<Sound> = sequenceS(P.Applicative)({
  channel: B.int32_le,
  sample: pipe(
    B.int32_le,
    P.chain((n) => P.take<number>(n)),
    P.map((as) => Buffer.from(as))
  ),
  attenuation: B.float32_le,
  volume: B.float32_le,
  flags: B.int32_le,
  pitch: B.int32_le,
});

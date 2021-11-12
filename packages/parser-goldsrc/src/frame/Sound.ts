import { buffer as B } from "@talent/parser-buffer";
import * as P from "@talent/parser/lib/Parser";
import { pipe } from "fp-ts/lib/function";

export type Sound = {
  readonly channel: number;
  readonly sample: string;
  readonly attenuation: number;
  readonly volume: number;
  readonly flags: number;
  readonly pitch: number;
};

export const sound: B.BufferParser<Sound> = P.struct({
  channel: B.int32_le,
  sample: pipe(
    B.uint32_le,
    P.chain(B.ztstr_padded) // TODO Is this actually correct?
  ),
  attenuation: B.float32_le,
  volume: B.float32_le,
  flags: B.int32_le,
  pitch: B.int32_le,
});

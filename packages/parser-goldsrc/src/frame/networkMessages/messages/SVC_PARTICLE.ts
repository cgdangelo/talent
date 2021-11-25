import { buffer as B } from "@talent/parser-buffer";
import * as P from "@talent/parser/lib/Parser";
import { pipe } from "fp-ts/lib/function";

export type Particle = {
  readonly origin: [number, number, number];
  readonly direction: [number, number, number];
};

export const particle: B.BufferParser<Particle> = P.struct({
  // TODO AlliedMods does not scaling, hlviewer says 1/8
  origin: pipe(
    B.int16_le,
    P.map((a) => a / 8),
    (fa) => P.tuple(fa, fa, fa)
  ),

  // TODO AlliedMods says 1/16, hlviewer does not scale
  // TODO Value must be [-128, 127]
  direction: P.tuple(B.int8_le, B.int8_le, B.int8_le),

  count: B.uint8_le,
  color: B.uint8_le,
});

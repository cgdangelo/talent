import { buffer as B } from "@talent/parser-buffer";
import * as P from "@talent/parser/lib/Parser";
import { pipe } from "fp-ts/lib/function";
import type { Point } from "../../../Point";
import { pointBy } from "../../../Point";

export type SpawnStaticSound = {
  readonly origin: Point;
  readonly soundIndex: number;
  readonly volume: number;
  readonly attenuation: number;
  readonly entityIndex: number;
  readonly flags: number;
};

export const spawnStaticSound: B.BufferParser<SpawnStaticSound> = P.struct({
  origin: pointBy(
    pipe(
      B.int16_le,
      P.map((a) => a / 8)
    )
  ),
  soundIndex: B.uint16_le,
  volume: pipe(
    B.int8_le,
    P.map((a) => a / 255)
  ),
  attenuation: pipe(
    B.int8_le,
    P.map((a) => a / 64)
  ),
  entityIndex: B.int16_le,

  // TODO Find all the SND_, VOL_ ATTN_, PITCH_ flags?
  // https://forums.alliedmods.net/showthread.php?t=234965
  // https://forums.alliedmods.net/showpost.php?p=2455441&postcount=8
  // https://github.com/baso88/SC_AngelScript/wiki/SoundSystem
  flags: B.int8_le,
});

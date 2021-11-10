import { buffer as B } from "@talent/parser-buffer";
import { sequenceS } from "fp-ts/lib/Apply";
import { parser as P } from "parser-ts";

export type WeaponAnimation = {
  readonly animation: number;
  readonly body: number;
};

export const weaponAnimation: B.BufferParser<WeaponAnimation> = sequenceS(
  P.Applicative
)({
  animation: B.int32_le,
  body: B.int32_le,
});

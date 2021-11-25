import { buffer as B } from "@talent/parser-buffer";
import * as P from "@talent/parser/lib/Parser";

export type WeaponAnim = {
  readonly sequenceNumber: number;
  readonly weaponModelBodyGroup: number;
};

export const weaponAnim: B.BufferParser<WeaponAnim> = P.struct({
  sequenceNumber: B.int8_le,
  weaponModelBodyGroup: B.int8_le,
});

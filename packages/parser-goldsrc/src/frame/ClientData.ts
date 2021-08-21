import { parser as P } from "@talent/parser";
import { buffer as B } from "@talent/parser-buffer";
import { sequenceS } from "fp-ts/lib/Apply";
import type { Point } from "../Point";
import { point } from "../Point";

export type ClientData = {
  readonly origin: Point;
  readonly viewAngles: Point;
  readonly weaponBits: number;
  readonly fov: number;
};

export const clientData: B.BufferParser<ClientData> = sequenceS(P.Applicative)({
  origin: point,
  viewAngles: point,
  weaponBits: B.int32_le,
  fov: B.float32_le,
});

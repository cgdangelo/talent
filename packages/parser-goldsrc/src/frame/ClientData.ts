import { buffer as B } from "@talent/parser-buffer";
import * as P from "@talent/parser/lib/Parser";
import type { Point } from "../Point";
import { point } from "../Point";

export type ClientData = {
  readonly origin: Point;
  readonly viewAngles: Point;
  readonly weaponBits: number;
  readonly fov: number;
};

export const clientData: B.BufferParser<ClientData> = P.struct({
  origin: point,
  viewAngles: point,
  weaponBits: B.int32_le,
  fov: B.float32_le,
});

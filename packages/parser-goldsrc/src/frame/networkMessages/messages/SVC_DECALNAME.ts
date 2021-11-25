import { buffer as B } from "@talent/parser-buffer";
import * as P from "@talent/parser/lib/Parser";

export type DecalName = {
  readonly positionIndex: number;
  readonly decalName: string;
};

export const decalName: B.BufferParser<DecalName> = P.struct({
  positionIndex: B.uint8_le,
  decalName: B.ztstr,
});

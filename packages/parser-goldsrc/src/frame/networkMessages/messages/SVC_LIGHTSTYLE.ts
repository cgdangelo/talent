import { buffer as B } from "@talent/parser-buffer";
import * as P from "@talent/parser/lib/Parser";

export type LightStyle = {
  readonly index: number;
  readonly lightInfo: string;
};

// TODO Parse light info
export const lightStyle: B.BufferParser<LightStyle> = P.struct({
  index: B.uint8_le,
  lightInfo: B.ztstr,
});

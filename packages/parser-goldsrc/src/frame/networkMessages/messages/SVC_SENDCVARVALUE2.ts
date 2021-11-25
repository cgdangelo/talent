import { buffer as B } from "@talent/parser-buffer";
import * as P from "@talent/parser/lib/Parser";

export type SendCvarValue2 = {
  readonly requestId: number;
  readonly name: string;
};

export const sendCvarValue2: B.BufferParser<SendCvarValue2> = P.struct({
  requestId: B.uint32_le,
  name: B.ztstr,
});

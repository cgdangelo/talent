import { buffer as B } from "@talent/parser-buffer";
import * as P from "@talent/parser/lib/Parser";

export type SendExtraInfo = {
  readonly fallbackDir: string;
  readonly canCheat: number;
};

export const sendExtraInfo: B.BufferParser<SendExtraInfo> = P.struct({
  fallbackDir: B.ztstr,
  canCheat: B.uint8_le,
});

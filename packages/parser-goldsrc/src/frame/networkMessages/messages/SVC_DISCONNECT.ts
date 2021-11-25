import { buffer as B } from "@talent/parser-buffer";
import * as P from "@talent/parser/lib/Parser";

export type Disconnect = {
  readonly reason: string;
};

export const disconnect: B.BufferParser<Disconnect> = P.struct({
  reason: B.ztstr,
});

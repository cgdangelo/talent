import { buffer as B } from "@talent/parser-buffer";
import * as P from "@talent/parser/lib/Parser";
import { pipe } from "fp-ts/lib/function";

export type ResourceRequest = {
  readonly spawnCount: number;
};

export const resourceRequest: B.BufferParser<ResourceRequest> = pipe(
  P.struct({ spawnCount: B.int32_le }),
  P.apFirst(P.skip(4))
);

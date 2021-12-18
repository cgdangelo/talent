import { buffer as B } from "@talent/parser-buffer";
import * as P from "@talent/parser/lib/Parser";
import {
  readonlyArray as RA,
  readonlyNonEmptyArray as RNEA,
  string as S,
} from "fp-ts";
import { flow, pipe } from "fp-ts/lib/function";

export type UpdateUserInfo = {
  readonly clientIndex: number;
  readonly clientUserId: number;
  readonly clientUserInfo: Record<string, string>;
  readonly clientCdKeyHash: readonly number[];
};

export const updateUserInfo: B.BufferParser<UpdateUserInfo> = P.struct({
  clientIndex: B.uint8_le,
  clientUserId: B.uint32_le,
  clientUserInfo: pipe(
    B.ztstr,
    P.map(flow(S.split("\\"), RNEA.tail, RA.chunksOf(2), Object.fromEntries))
  ),
  clientCdKeyHash: P.take(16),
});

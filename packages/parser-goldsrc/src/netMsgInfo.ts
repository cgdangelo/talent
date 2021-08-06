import { parser as P } from "@talent/parser";
import { buffer as B } from "@talent/parser-buffer";
import { sequenceS } from "fp-ts/lib/Apply";
import { moveVars } from "./moveVars";
import { point } from "./Point";
import type { RefParams } from "./refParams";
import { refParams } from "./refParams";
import { userCmd } from "./userCmd";

export type NetMsgInfo = {
  readonly timestamp: number;
  readonly refParams: RefParams;
};

export const netMsgInfo: B.BufferParser<NetMsgInfo> = sequenceS(P.Applicative)({
  timestamp: B.float32_le,
  refParams,
  userCmd,
  moveVars,
  view: point,
  viewModel: B.int32_le,
});

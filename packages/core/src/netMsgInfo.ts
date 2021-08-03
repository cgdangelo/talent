import { sequenceS } from "fp-ts/lib/Apply";
import { moveVars } from "./moveVars";
import * as P from "@talent/parser";
import type { RefParams } from "./refParams";
import { refParams } from "./refParams";
import { userCmd } from "./userCmd";

export type NetMsgInfo = {
  readonly timestamp: number;
  readonly refParams: RefParams;
};

export const netMsgInfo: P.Parser<Buffer, NetMsgInfo> = sequenceS(
  P.Applicative
)({
  timestamp: P.float32_le,
  refParams,
  userCmd,
  moveVars,
  view: P.point,
  viewModel: P.int32_le,
});

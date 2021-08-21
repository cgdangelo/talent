import { parser as P } from "@talent/parser";
import { buffer as B } from "@talent/parser-buffer";
import { sequenceS } from "fp-ts/lib/Apply";
import type { Point } from "../Point";
import { point } from "../Point";
import type { MoveVars } from "./MoveVars";
import { moveVars } from "./MoveVars";
import type { RefParams } from "./RefParams";
import { refParams } from "./RefParams";
import type { UserCmd } from "./UserCmd";
import { userCmd } from "./UserCmd";

export type NetMsgInfo = {
  readonly timestamp: number;
  readonly refParams: RefParams;
  readonly userCmd: UserCmd;
  readonly moveVars: MoveVars;
  readonly view: Point;
  readonly viewModel: number;
};

export const netMsgInfo: B.BufferParser<NetMsgInfo> = sequenceS(P.Applicative)({
  timestamp: B.float32_le,
  refParams,
  userCmd,
  moveVars,
  view: point,
  viewModel: B.int32_le,
});

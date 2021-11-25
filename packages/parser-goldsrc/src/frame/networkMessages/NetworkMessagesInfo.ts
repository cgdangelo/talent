import { buffer as B } from "@talent/parser-buffer";
import * as P from "@talent/parser/lib/Parser";
import type { Point } from "../../Point";
import { point } from "../../Point";
import type { MoveVars } from "../MoveVars";
import { moveVars } from "../MoveVars";
import type { RefParams } from "../RefParams";
import { refParams } from "../RefParams";
import type { UserCmd } from "../UserCmd";
import { userCmd } from "../UserCmd";

export type NetworkMessagesInfo = {
  readonly timestamp: number;
  readonly refParams: RefParams;
  readonly userCmd: UserCmd;
  readonly moveVars: MoveVars;
  readonly view: Point;
  readonly viewModel: number;
};

export const networkMessagesInfo: B.BufferParser<NetworkMessagesInfo> =
  P.struct({
    timestamp: B.float32_le,
    refParams,
    userCmd,
    moveVars,
    view: point,
    viewModel: B.int32_le,
  });

import { either as E } from "fp-ts";
import { sequenceS } from "fp-ts/lib/Apply";
import { pipe } from "fp-ts/lib/function";
import { float32_le } from "./parser";
import type { RefParams } from "./refParams";
import { refParams } from "./refParams";
import { userCmd } from "./userCmd";

export type NetMsgInfo = {
  readonly timestamp: number;
  readonly refParams: RefParams;
};

export const netMsgInfo =
  (buffer: Buffer) =>
  (cursor = 0): E.Either<Error, NetMsgInfo> =>
    pipe(
      sequenceS(E.Applicative)({
        timestamp: float32_le(buffer)(cursor),
        refParams: refParams(buffer)(cursor + 4),
        userCmd: userCmd(buffer)(cursor + 4 + 232),
      })
    );

import { parser as P, statefulParser as SP } from "@talent/parser";
import { buffer as B } from "@talent/parser-buffer";
import { number, readonlyMap as RM } from "fp-ts";
import { pipe } from "fp-ts/lib/function";
import type { DemoState, DemoStateParser } from "../../../DemoState";

export type NewUserMsg = {
  readonly index: number;
  readonly size: number;
  readonly name: string;
};

const addUserMessage = RM.upsertAt(number.Eq);

export const newUserMsg: DemoStateParser<NewUserMsg> = pipe(
  SP.lift<number, NewUserMsg, DemoState>(
    P.struct({
      index: B.uint8_le,
      size: B.uint8_le,

      // TODO "Name can be represented as an array of 4 "longs"." ???
      // https://wiki.alliedmods.net/Half-Life_1_Engine_Messages#SVC_NEWUSERMSG
      name: B.ztstr_padded(16),
    })
  ),

  SP.chainFirst((a) =>
    SP.modify((s) => ({
      ...s,
      userMessages: pipe(s.userMessages, addUserMessage(a.index, a)),
    }))
  )
);

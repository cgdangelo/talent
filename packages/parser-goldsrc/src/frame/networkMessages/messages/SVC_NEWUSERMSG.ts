import { buffer as B } from "@talent/parser-buffer";
import * as P from "@talent/parser/lib/Parser";

export type NewUserMsg = {
  readonly index: number;
  readonly size: number;
  readonly name: string;
};

export const newUserMsg: B.BufferParser<NewUserMsg> = P.struct({
  index: B.uint8_le,
  size: B.uint8_le,

  // TODO "Name can be represented as an array of 4 "longs"." ???
  // https://wiki.alliedmods.net/Half-Life_1_Engine_Messages#SVC_NEWUSERMSG
  name: B.ztstr_padded(16),
});

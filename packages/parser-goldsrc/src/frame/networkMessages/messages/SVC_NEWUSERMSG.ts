import { buffer as B } from "@talent/parser-buffer";
import * as P from "@talent/parser/lib/Parser";
import { pipe } from "fp-ts/lib/function";

export type NewUserMsg = {
  readonly index: number;
  readonly size: number;
  readonly name: string;
};

// FIXME HACK FIXME HACK mutable shared state
export const customMessages: Map<number, NewUserMsg> = new Map();

export const newUserMsg: B.BufferParser<NewUserMsg> = pipe(
  P.struct({
    index: B.uint8_le,
    size: B.uint8_le,

    // TODO "Name can be represented as an array of 4 "longs"." ???
    // https://wiki.alliedmods.net/Half-Life_1_Engine_Messages#SVC_NEWUSERMSG
    name: B.ztstr_padded(16),
  }),

  P.map((a) => {
    customMessages.set(a.index, a);

    return a;
  })
);

import { buffer as B } from "@talent/parser-buffer";
import * as P from "@talent/parser/lib/Parser";
import { pipe } from "fp-ts/lib/function";
import { MessageType } from "../MessageType";

export type Restore = {
  readonly type: {
    readonly id: MessageType.SVC_RESTORE;
    readonly name: "SVC_RESTORE";
  };

  readonly fields: {
    readonly saveName: string;
    readonly mapCount: number;
    readonly mapNames: readonly string[];
  };
};

export const restore: B.BufferParser<Restore> = pipe(
  P.struct({ saveName: B.ztstr, mapCount: B.uint8_le }),
  P.bind("mapNames", ({ mapCount }) => P.manyN(B.ztstr, mapCount)),

  P.map((fields) => ({
    type: { id: MessageType.SVC_RESTORE, name: "SVC_RESTORE" } as const,
    fields,
  }))
);

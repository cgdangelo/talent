import type { buffer as B } from "@talent/parser-buffer";
import * as P from "@talent/parser/lib/Parser";
import { MessageType } from "../MessageType";

export type Intermission = {
  readonly type: {
    readonly id: MessageType.SVC_INTERMISSION;
    readonly name: "SVC_INTERMISSION";
  };

  readonly fields: null;
};

export const intermission: B.BufferParser<Intermission> = P.of({
  type: { id: MessageType.SVC_INTERMISSION, name: "SVC_INTERMISSION" },
  fields: null,
});

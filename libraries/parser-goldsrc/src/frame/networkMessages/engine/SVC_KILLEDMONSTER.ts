import type { buffer as B } from "@talent/parser-buffer";
import * as P from "@talent/parser/lib/Parser";
import { MessageType } from "../MessageType";

export type KilledMonster = {
  readonly id: MessageType.SVC_KILLEDMONSTER;
  readonly name: "SVC_KILLEDMONSTER";

  readonly fields: null;
};

// Deprecated
export const killedMonster: B.BufferParser<KilledMonster> = P.of({
  id: MessageType.SVC_KILLEDMONSTER,
  name: "SVC_KILLEDMONSTER",
  fields: null,
});

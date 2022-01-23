import type { buffer as B } from "@talent/parser-buffer";
import * as P from "@talent/parser/lib/Parser";
import { MessageType } from "../MessageType";

export type Damage = {
  readonly type: {
    readonly id: MessageType.SVC_DAMAGE;
    readonly name: "SVC_DAMAGE";
  };

  readonly fields: null;
};

// Deprecated
export const damage: B.BufferParser<Damage> = P.of({
  type: { id: MessageType.SVC_DAMAGE, name: "SVC_DAMAGE" },
  fields: null,
});

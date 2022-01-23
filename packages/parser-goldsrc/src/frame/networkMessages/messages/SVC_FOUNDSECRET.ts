import type { buffer as B } from "@talent/parser-buffer";
import * as P from "@talent/parser/lib/Parser";
import { MessageType } from "../MessageType";

export type FoundSecret = {
  readonly type: {
    readonly id: MessageType.SVC_FOUNDSECRET;
    readonly name: "SVC_FOUNDSECRET";
  };

  readonly fields: null;
};

// Deprecated. Probably old Q2 message?
export const foundSecret: B.BufferParser<FoundSecret> = P.of({
  type: { id: MessageType.SVC_FOUNDSECRET, name: "SVC_FOUNDSECRET" },
  fields: null,
});

import type { buffer as B } from "@talent/parser-buffer";
import * as P from "@talent/parser/lib/Parser";
import { MessageType } from "../MessageType";

export type Nop = {
  readonly id: MessageType.SVC_NOP;
  readonly name: "SVC_NOP";

  readonly fields: null;
};

export const nop: B.BufferParser<Nop> = P.of({
  id: MessageType.SVC_NOP,
  name: "SVC_NOP",
  fields: null,
});

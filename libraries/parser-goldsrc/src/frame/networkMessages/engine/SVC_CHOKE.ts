import type { buffer as B } from "@talent/parser-buffer";
import * as P from "@talent/parser/lib/Parser";
import { MessageType } from "../MessageType";

export type Choke = {
  readonly id: MessageType.SVC_CHOKE;
  readonly name: "SVC_CHOKE";

  readonly fields: null;
};

export const choke: B.BufferParser<Choke> = P.of({
  id: MessageType.SVC_CHOKE,
  name: "SVC_CHOKE",
  fields: null,
});

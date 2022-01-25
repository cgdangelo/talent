import type { buffer as B } from "@talent/parser-buffer";
import * as P from "@talent/parser/lib/Parser";
import type { MessageType } from "../MessageType";

export type Bad = {
  readonly id: MessageType.SVC_BAD;
  readonly name: "SVC_BAD";

  readonly fields: never;
};

// TODO Turn this back to fatal when the SVC_CLIENTDATA bug is fixed
// Should never see this message, so we can treat it as an exceptional
// case?
export const bad: B.BufferParser<Bad> = P.fail();

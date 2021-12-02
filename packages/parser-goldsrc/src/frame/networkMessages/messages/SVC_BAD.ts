import type { buffer as B } from "@talent/parser-buffer";
import * as P from "@talent/parser/lib/Parser";

export type Bad = never;

// TODO Turn this back to fatal when the SVC_CLIENTDATA bug is fixed
// Should never see this message, so we can treat it as an exceptional
// case?
export const bad: B.BufferParser<Bad> = P.fail();

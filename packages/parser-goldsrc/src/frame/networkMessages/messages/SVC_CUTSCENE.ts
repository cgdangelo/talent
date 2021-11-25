import { buffer as B } from "@talent/parser-buffer";
import * as P from "@talent/parser/lib/Parser";

export type Cutscene = {
  readonly text: string;
};

export const cutscene: B.BufferParser<Cutscene> = P.struct({ text: B.ztstr });

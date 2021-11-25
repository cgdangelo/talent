import { buffer as B } from "@talent/parser-buffer";
import * as P from "@talent/parser/lib/Parser";

export type Finale = {
  readonly text: string;
};

export const finale: B.BufferParser<Finale> = P.struct({ text: B.ztstr });

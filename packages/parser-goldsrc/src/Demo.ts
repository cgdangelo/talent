import type { buffer as B } from "@talent/parser-buffer";
import { sequenceS } from "fp-ts/lib/Apply";
import { parser as P } from "parser-ts";
import type { DemoHeader } from "./DemoHeader";
import { header } from "./DemoHeader";
import type { Directory } from "./Directory";
import { directory } from "./Directory";

export type Demo = {
  readonly header: DemoHeader;
  readonly directory: Directory;
};

export const demo: B.BufferParser<Demo> = sequenceS(P.Applicative)({
  header,
  directory,
});

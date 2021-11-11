import type { buffer as B } from "@talent/parser-buffer";
import * as P from "@talent/parser/lib/Parser";
import type { DemoHeader } from "./DemoHeader";
import { header } from "./DemoHeader";
import type { Directory } from "./Directory";
import { directory } from "./Directory";

export type Demo = {
  readonly header: DemoHeader;
  readonly directory: Directory;
};

export const demo: B.BufferParser<Demo> = P.struct({
  header,
  directory,
});

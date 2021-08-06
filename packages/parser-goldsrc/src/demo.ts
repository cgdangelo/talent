import { parser as P } from "@talent/parser";
import type { buffer as B } from "@talent/parser-buffer";
import { sequenceS } from "fp-ts/lib/Apply";
import type { Directory } from "./directory";
import { directory } from "./directory";
import type { Header } from "./header";
import { header } from "./header";

export type Demo = {
  readonly header: Header;
  readonly directory: Directory;
};

export const demo: B.BufferParser<Demo> = sequenceS(P.Applicative)({
  header,
  directory,
});

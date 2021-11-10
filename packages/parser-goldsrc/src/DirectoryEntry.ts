import { parser as P } from "parser-ts";
import { buffer as B } from "@talent/parser-buffer";
import { sequenceS } from "fp-ts/lib/Apply";
import { pipe } from "fp-ts/lib/function";
import type { Frame } from "./frame/Frame";

export type DirectoryEntry = {
  readonly type: number;
  readonly description: string;
  readonly flags: number;
  readonly cdTrack: number;
  readonly trackTime: number;
  readonly frameCount: number;
  readonly offset: number;
  readonly fileLength: number;
  readonly frames: readonly Frame[];
};

export const directoryEntry: B.BufferParser<DirectoryEntry> = pipe(
  sequenceS(P.Applicative)({
    type: B.int32_le,
    description: B.ztstr_padded(64),
    flags: B.int32_le,
    cdTrack: B.int32_le,
    trackTime: B.float32_le,
    frameCount: B.int32_le,
    offset: B.int32_le,
    fileLength: B.int32_le,
    frames: P.of([]),
  })
);

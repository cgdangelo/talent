import { buffer as B } from "@talent/parser-buffer";
import * as P from "@talent/parser/lib/Parser";
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
  P.struct({
    type: B.uint32_le,
    description: B.ztstr_padded(64),
    flags: B.uint32_le,
    cdTrack: B.int32_le,
    trackTime: B.float32_le,
    frameCount: B.uint32_le,
    offset: B.uint32_le,
    fileLength: B.uint32_le,
    frames: P.of([]),
  })
);

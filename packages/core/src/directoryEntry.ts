import * as P from "@talent/parser";
import { sequenceS } from "fp-ts/lib/Apply";
import { pipe } from "fp-ts/lib/function";
import type { Frame } from "./frame";
import { frames } from "./frame";

export type DirectoryEntry = {
  readonly cdTrack: number;
  readonly description: string;
  readonly fileLength: number;
  readonly flags: number;
  readonly frames: readonly Frame[];
  readonly frameCount: number;
  readonly offset: number;
  readonly trackTime: number;
  readonly type: number;
};

export const directoryEntry: P.Parser<Buffer, DirectoryEntry> = pipe(
  sequenceS(P.Applicative)({
    type: P.int32_le,
    description: P.str(64),
    flags: P.int32_le,
    cdTrack: P.int32_le,
    trackTime: P.float32_le,
    frameCount: P.int32_le,
    offset: P.int32_le,
    fileLength: P.int32_le,
  }),

  (x) => x,

  P.chain((a) =>
    pipe(
      P.seek<Buffer>(a.offset),
      P.chain(() => frames),
      P.map((frames) => ({ ...a, frames }))
    )
  ),

  (x) => x
);

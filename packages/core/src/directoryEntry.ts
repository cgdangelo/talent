import { buffer as B, parser as P } from "@talent/parser";
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
    type: B.int32_le,
    description: B.str(64),
    flags: B.int32_le,
    cdTrack: B.int32_le,
    trackTime: B.float32_le,
    frameCount: B.int32_le,
    offset: B.int32_le,
    fileLength: B.int32_le,
  }),

  P.chain((a) =>
    pipe(
      P.seek(a.offset),
      P.chain(() => frames),
      P.map((frames) => ({ ...a, frames }))
    )
  )
);

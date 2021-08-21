import { parser as P } from "@talent/parser";
import { buffer as B } from "@talent/parser-buffer";
import { array as A } from "fp-ts";
import { pipe } from "fp-ts/lib/function";
import type { DirectoryEntry } from "./DirectoryEntry";
import { directoryEntry } from "./DirectoryEntry";
import { frames } from "./frame/Frame";

export type Directory = readonly DirectoryEntry[];

const directoryOffset: B.BufferParser<number> = (i) =>
  pipe(
    i,
    P.sat(
      B.uint32_le,
      (a) => a === i.buffer.byteLength - 4 - 92 * 2,
      (a) =>
        `expected ${
          i.buffer.byteLength - 4 - 92 * 2
        } for entries offset, got ${a}`
    )
  );

const totalEntries: B.BufferParser<number> = P.sat(
  B.int32_le,
  (a) => a >= 1 && a <= 1024,
  (a) => `expected 1 - 1024 directory entries, got ${a}`
);

export const directory: B.BufferParser<Directory> = pipe(
  directoryOffset,

  // Read entries without frames.
  P.chain((directoryOffset) =>
    pipe(
      P.seek(directoryOffset),
      P.chain(() => totalEntries),
      P.chain((totalEntries) => P.manyN(directoryEntry, totalEntries))
    )
  ),

  // Read frames and add to entries.
  P.chain((directoryEntries) =>
    A.sequence(P.Applicative)(
      directoryEntries.map((directoryEntry) =>
        pipe(
          P.seek(directoryEntry.offset),
          P.chain(() => frames),
          P.map((frames) => ({ ...directoryEntry, frames }))
        )
      )
    )
  )
);

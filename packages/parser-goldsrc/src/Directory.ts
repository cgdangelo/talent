import { buffer as B } from "@talent/parser-buffer";
import * as P from "@talent/parser/lib/Parser";
import { array as A } from "fp-ts";
import { pipe } from "fp-ts/lib/function";
import type { DirectoryEntry } from "./DirectoryEntry";
import { directoryEntry } from "./DirectoryEntry";
import { frames } from "./frame/Frame";

export type Directory = readonly DirectoryEntry[];

const directoryOffset: B.BufferParser<number> = (i) =>
  pipe(
    B.uint32_le,
    P.filter((a) => a === i.buffer.length - 4 - 92 * 2)
  )(i);

const totalEntries: B.BufferParser<number> = P.expected(
  pipe(
    B.int32_le,
    P.filter((a) => a >= 1 && a <= 1024)
  ),
  `1 - 1024 directory entries`
);

export const directory: B.BufferParser<Directory> = pipe(
  directoryOffset,

  // Read entries without frames.
  P.chain((directoryOffset) =>
    pipe(
      P.seek<number>(directoryOffset),
      P.chain(() => totalEntries),
      P.chain((totalEntries) => P.manyN(directoryEntry, totalEntries))
    )
  ),

  // Read frames and add to entries.
  P.chain((directoryEntries) =>
    A.sequence(P.Applicative)(
      directoryEntries.map((directoryEntry) =>
        pipe(
          P.seek<number>(directoryEntry.offset),
          P.chain(() => frames),
          // P.chain(() => (Math.random() < -1 ? frames : P.succeed([]))),
          P.map((frames) => ({ ...directoryEntry, frames }))
        )
      )
    )
  )
);

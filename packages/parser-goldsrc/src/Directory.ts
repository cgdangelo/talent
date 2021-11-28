import { buffer as B } from "@talent/parser-buffer";
import * as P from "@talent/parser/lib/Parser";
import { readonlyArray as RA } from "fp-ts";
import { flow, pipe } from "fp-ts/lib/function";
import { fst } from "fp-ts/lib/ReadonlyTuple";
import type { DirectoryEntry } from "./DirectoryEntry";
import { directoryEntry } from "./DirectoryEntry";
import { frames } from "./frame/Frame";

export type Directory = readonly DirectoryEntry[];

const directoryOffset: B.BufferParser<number> = pipe(
  P.withStart(B.uint32_le),
  P.filter(([a, i]) => a === i.buffer.length - 188),
  P.map(fst)
);

const totalEntries: B.BufferParser<number> = P.expected(
  pipe(
    B.int32_le,
    P.filter((a) => a >= 1 && a <= 1024)
  ),
  "directory entries [1, 1024]"
);

const directoryEntries: (
  totalEntries: number
) => B.BufferParser<DirectoryEntry[]> = (totalEntries) =>
  P.manyN(directoryEntry, totalEntries);

const directoryEntriesWithoutFrames: (
  directoryOffset: number
) => B.BufferParser<Directory> = (directoryOffset) =>
  pipe(
    P.seek(directoryOffset),
    P.apSecond(totalEntries),
    P.chain(directoryEntries)
  );

const addFramesToDirectoryEntry: (
  directoryEntry: DirectoryEntry
) => B.BufferParser<DirectoryEntry> = (directoryEntry) =>
  pipe(
    P.seek(directoryEntry.offset),
    P.apSecond(frames),
    P.map((frames) => ({ ...directoryEntry, frames }))
  );

const addFramesToDirectoryEntries: (
  directoryEntries: Directory
) => B.BufferParser<Directory> = flow(
  RA.map(addFramesToDirectoryEntry),
  RA.sequence(P.Applicative)
);

export const directory: B.BufferParser<Directory> = pipe(
  directoryOffset,
  P.chain(directoryEntriesWithoutFrames),
  P.chain(addFramesToDirectoryEntries)
);

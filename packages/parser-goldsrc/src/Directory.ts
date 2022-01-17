import { buffer as B } from "@talent/parser-buffer";
import { parser as P, statefulParser as SP } from "@talent/parser";
import { readonlyArray as RA } from "fp-ts";
import { flow, pipe } from "fp-ts/lib/function";
import { fst } from "fp-ts/lib/ReadonlyTuple";
import type { DemoState, DemoStateParser } from "./DemoState";
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
) => B.BufferParser<readonly DirectoryEntry[]> = (totalEntries) =>
  P.manyN(directoryEntry, totalEntries);

const directoryEntriesWithoutFrames: (
  directoryOffset: number
) => B.BufferParser<Directory> = (directoryOffset) =>
  pipe(
    P.seek<number>(directoryOffset),
    P.apSecond(totalEntries),
    P.chain(directoryEntries)
  );

const addFramesToDirectoryEntry: (
  directoryEntry: DirectoryEntry
) => DemoStateParser<DirectoryEntry> = (directoryEntry) =>
  pipe(
    SP.lift<number, void, DemoState>(P.seek<number>(directoryEntry.offset)),
    SP.chain(() => frames),
    SP.map((frames) => ({ ...directoryEntry, frames }))
  );

const addFramesToDirectoryEntries: (
  directoryEntries: Directory
) => DemoStateParser<Directory> = flow(
  RA.map(addFramesToDirectoryEntry),
  RA.sequence(SP.Applicative)
);

export const directory: DemoStateParser<Directory> = pipe(
  SP.lift<number, Directory, DemoState>(
    pipe(directoryOffset, P.chain(directoryEntriesWithoutFrames))
  ),
  SP.chain(addFramesToDirectoryEntries)
);

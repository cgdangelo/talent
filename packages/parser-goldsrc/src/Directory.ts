import { parser as P, statefulParser as SP } from "@talent/parser";
import { buffer as B } from "@talent/parser-buffer";
import { readonlyArray as RA } from "fp-ts";
import { flow, pipe } from "fp-ts/lib/function";
import * as DS from "./DemoState";
import type { DirectoryEntry } from "./DirectoryEntry";
import { directoryEntry } from "./DirectoryEntry";
import { frames } from "./frame/Frame";

export type Directory = readonly DirectoryEntry[];

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
) => DS.DemoStateParser<DirectoryEntry> = (directoryEntry) =>
  pipe(
    DS.lift(P.seek<number>(directoryEntry.offset)),
    SP.chain(() => frames),
    SP.map((frames) => ({ ...directoryEntry, frames }))
  );

const addFramesToDirectoryEntries: (
  directoryEntries: Directory
) => DS.DemoStateParser<Directory> = flow(
  RA.map(addFramesToDirectoryEntry),
  RA.sequence(SP.Applicative)
);

export const directory: (
  directoryOffset: number
) => DS.DemoStateParser<Directory> = flow(
  directoryEntriesWithoutFrames,
  DS.lift,
  SP.chain(addFramesToDirectoryEntries)
);

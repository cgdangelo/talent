import { parser as P, statefulParser as SP } from '@cgdangelo/talent-parser';
import { buffer as B } from '@cgdangelo/talent-parser-buffer';
import { readonlyArray as RA, readonlyNonEmptyArray as RNEA } from 'fp-ts';
import { flow, pipe } from 'fp-ts/lib/function';
import * as DS from './DemoState';
import type { DirectoryEntry } from './DirectoryEntry';
import { directoryEntry } from './DirectoryEntry';
import { frames } from './frame/Frame';
import { fst } from 'fp-ts/ReadonlyTuple';

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
  'directory entries [1, 1024]'
);

const directoryEntries: (totalEntries: number) => DS.DemoStateParser<readonly DirectoryEntry[]> = (
  totalEntries
) => SP.manyN(directoryEntry, totalEntries);

const directoryEntriesWithoutFrames: (directoryOffset: number) => DS.DemoStateParser<Directory> = (
  directoryOffset
) =>
  pipe(
    SP.seek<DS.DemoState, number>(directoryOffset),
    SP.chain(() => SP.lift(totalEntries)),
    SP.chain(directoryEntries)
  );

const addFramesToDirectoryEntry: (directoryEntry: DirectoryEntry) => DS.DemoStateParser<DirectoryEntry> = (
  directoryEntry
) =>
  pipe(
    DS.lift(P.seek<number>(directoryEntry.offset)),
    SP.chain(() => frames),
    SP.map((frames) => ({ ...directoryEntry, frames }))
  );

const addFramesToDirectoryEntries: (directoryEntries: Directory) => DS.DemoStateParser<Directory> = flow(
  RA.map(addFramesToDirectoryEntry),
  RA.sequence(SP.Applicative)
);

const fallbackDirectory: (headerEndOffset: number) => DS.DemoStateParser<Directory> = (headerEndOffset) =>
  pipe(
    RNEA.of<DirectoryEntry>({
      cdTrack: -1,
      description: 'Fallback',
      fileLength: -1,
      flags: 0,
      frameCount: 0,
      frames: [],
      offset: headerEndOffset,
      trackTime: -1,
      type: -1
    }),

    SP.of,
    SP.chainFirst((directoryEntry) =>
      pipe(
        SP.get<number, DS.DemoState>(),
        SP.map(({ eventEmitter }) => eventEmitter?.emit('demo:directory-entry', directoryEntry[0]))
      )
    ),

    SP.chain(addFramesToDirectoryEntries)
  );

export const directory: DS.DemoStateParser<Directory> = pipe(
  DS.lift(directoryOffset),
  SP.chain(directoryEntriesWithoutFrames),
  SP.alt(() =>
    pipe(
      DS.lift(P.withStart(P.of({}))),
      SP.chain(([, i]) => fallbackDirectory(i.cursor + 4))
    )
  ),
  SP.chain(addFramesToDirectoryEntries)
);

import type { Frame } from "./frame";
import { str } from "./utils";

export type DirectoryEntry = {
  readonly cdTrack: number;
  readonly description: string;
  readonly fileLength: number;
  readonly flags: number;
  readonly frames: Frame[];
  readonly frameCount: number;
  readonly offset: number;
  readonly trackTime: number;
  readonly type: number;
};

export const directoryEntry =
  (buffer: Buffer) =>
  (cursor = 0): DirectoryEntry => ({
    type: buffer.readInt32LE(cursor),
    description: str(buffer)(cursor + 4)(64),
    flags: buffer.readInt32LE(cursor + 4 + 64),
    cdTrack: buffer.readInt32LE(cursor + 4 + 64 + 4),
    trackTime: buffer.readInt32LE(cursor + 4 + 64 + 4 + 4),
    frameCount: buffer.readInt32LE(cursor + 4 + 64 + 4 + 4 + 4),
    offset: buffer.readInt32LE(cursor + 4 + 64 + 4 + 4 + 4 + 4 + 4),
    fileLength: buffer.readInt32LE(cursor + 4 + 64 + 4 + 4 + 4 + 4 + 4),
    frames: [],
  });

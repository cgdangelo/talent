import { readString } from ".";

export type DirectoryEntry = {
  readonly cdTrack: number;
  readonly description: string;
  readonly fileLength: number;
  readonly flags: number;
  readonly frameCount: number;
  readonly offset: number;
  readonly trackTime: number;
  readonly type: number;
};

export const readDirectoryEntry = (
  buffer: Buffer,
  cursor = 0
): DirectoryEntry => ({
  type: buffer.readInt32LE(cursor),
  description: readString(buffer, cursor + 4, 64),
  flags: 0,
  cdTrack: 0,
  trackTime: 0,
  frameCount: 0,
  offset: 0,
  fileLength: 0,
});

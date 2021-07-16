import { either as E } from "fp-ts";
import { sequenceS } from "fp-ts/lib/Apply";
import type { Frame } from "./frame";
import { int32_le, str } from "./parser";

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
  (cursor = 0): E.Either<Error, DirectoryEntry> =>
    sequenceS(E.Applicative)({
      type: int32_le(buffer)(cursor),
      description: E.of(str(buffer)(cursor + 4)(64)),
      flags: int32_le(buffer)(cursor + 4 + 64),
      cdTrack: int32_le(buffer)(cursor + 4 + 64 + 4),
      trackTime: int32_le(buffer)(cursor + 4 + 64 + 4 + 4),
      frameCount: int32_le(buffer)(cursor + 4 + 64 + 4 + 4 + 4),
      offset: int32_le(buffer)(cursor + 4 + 64 + 4 + 4 + 4 + 4 + 4),
      fileLength: int32_le(buffer)(cursor + 4 + 64 + 4 + 4 + 4 + 4 + 4),
      frames: E.of([]),
    });

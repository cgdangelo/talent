import { buffer as B } from "@talent/parser-buffer";
import * as P from "@talent/parser/lib/Parser";
import { pipe } from "fp-ts/lib/function";

export type ServerInfo = {
  readonly protocol: number;
  readonly spawnCount: number;
  readonly mapChecksum: number;
  readonly clientDllHash: number[]; // TODO buffer
  readonly maxPlayers: number;
  readonly playerIndex: number;
  readonly isDeathmatch: number;
  readonly gameDir: string;
  readonly hostname: string;
  readonly mapFileName: string;
  readonly mapCycle: string;
};

export const serverInfo: B.BufferParser<ServerInfo> = pipe(
  P.struct({
    protocol: B.int32_le,
    spawnCount: B.int32_le,
    mapChecksum: B.int32_le,
    clientDllHash: P.take(16),
    maxPlayers: B.uint8_le,
    playerIndex: B.uint8_le,
    isDeathmatch: B.uint8_le,
    gameDir: B.ztstr,
    hostname: B.ztstr,
    mapFileName: B.ztstr,
    mapCycle: B.ztstr,
  }),

  P.apFirst(P.skip(1))
);

import { buffer as B } from "@talent/parser-buffer";
import { parser as P, statefulParser as SP } from "@talent/parser";
import { pipe } from "fp-ts/lib/function";
import { MessageType } from "../MessageType";
import * as DS from "../../../DemoState";

export type ServerInfo = {
  readonly id: MessageType.SVC_SERVERINFO;
  readonly name: "SVC_SERVERINFO";

  readonly fields: {
    readonly protocol: number;
    readonly spawnCount: number;
    readonly mapChecksum: number;
    readonly clientDllHash: readonly number[]; // TODO buffer
    readonly maxPlayers: number;
    readonly playerIndex: number;
    readonly isDeathmatch: number;
    readonly gameDir: string;
    readonly hostname: string;
    readonly mapFileName: string;
    readonly mapCycle: string;
  };
};

const serverInfo_: B.BufferParser<ServerInfo> = pipe(
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

  // TODO What's this?
  // https://github.com/jpcy/coldemoplayer/blob/9c97ab128ac889739c1643baf0d5fdf884d8a65f/compLexity%20Demo%20Player/demo%20parser/HalfLifeDemoParser.cs#L684-L690
  P.apFirst(
    pipe(
      B.uint8_le,
      P.chain((hasUnknown) => P.skip(hasUnknown !== 0 ? 21 : 0))
    )
  ),

  P.map((fields) => ({
    id: MessageType.SVC_SERVERINFO,
    name: "SVC_SERVERINFO",
    fields,
  }))
);

export const serverInfo: DS.DemoStateParser<ServerInfo> = pipe(
  DS.lift(serverInfo_),
  SP.chainFirst(({ fields: { maxPlayers } }) =>
    pipe(SP.modify((s) => ({ ...s, maxClients: maxPlayers })))
  )
);

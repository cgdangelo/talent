import * as BB from "@talent/parser-bitbuffer";
import type { buffer as B } from "@talent/parser-buffer";
import * as P from "@talent/parser/lib/Parser";
import { stream } from "@talent/parser/lib/Stream";
import { pipe } from "fp-ts/lib/function";
import type { Delta } from "../../../delta";
import { readDelta } from "../../../delta";

export type ClientData = {
  readonly deltaUpdateMask?: number;
  readonly clientData: Delta;
  readonly weaponData: readonly Delta[];
};

// FIXME Something is wrong in this parser? Possibly wrong size because an
// SVC_BAD is following the first instance of this message in demo.dem. hlviewer
// misses out on that message because it skips to the end of network message
// data when parsing a message without fields (SVC_NOP, SVC_CHOKE).
export const clientData: B.BufferParser<ClientData> = (i) =>
  pipe(
    stream(i.buffer, i.cursor * 8),

    pipe(
      BB.ubits(1),
      P.filter((a) => a !== 0),
      P.apSecond(BB.ubits(8)),
      P.bindTo("deltaUpdateMask"),
      P.alt(() => P.of({})),

      P.chain((delta) =>
        pipe(
          readDelta("clientdata_t"),
          P.map((clientData) => ({ ...delta, clientData }))
        )
      ),

      P.chain((delta) =>
        pipe(
          P.many(
            pipe(
              BB.ubits(1),
              P.filter((hasWeaponData) => hasWeaponData !== 0),
              P.apSecond(
                P.struct({
                  weaponIndex: BB.ubits(6),
                  weaponData: readDelta("weapon_data_t"),
                })
              ),
              P.map(({ weaponIndex, weaponData }) => ({
                weaponIndex,
                ...weaponData,
              }))
            )
          ),
          P.map((weaponData) => ({ ...delta, weaponData }))
        )
      ),

      BB.nextByte
    )
  );

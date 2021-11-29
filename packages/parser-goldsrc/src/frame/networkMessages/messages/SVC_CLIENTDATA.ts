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
//
// 2021-11-29
// 22 missing somewhere (hlviewer @ 49619, talent @ 49597)
//
// talent:   {"clientData":{"flTimeStepSound":258,"origin[1]":-32,"origin[2]":137.984375,"velocity[0]":236.75,"weaponanim":0,"maxspeed":3283.1,"flDuckTime":0},"weaponData":[]}}
// hlviewer: {"clientData":{"origin[0]":639,"origin[1]":-947,"origin[2]":126,"m_flNextAttack":-0.001,"flags":8,"health":100,"maxspeed":350,"view_ofs[2]":22,"deadflag":2,"physinfo":"\\slj\\0\\hl\\1","fuser4":100}}
//
// - bad delta reader, bad delta description?
// - m_flNextAttack = 22 bits
// - clientdata_t delta descriptions are identical
// - mask bits when reading clientdata_t do not align
//
// talent:   [ 29, 208 ]
// hlviewer: [ 142, 104, 129, 2, 64 ]
//
// 2021-11-29
// - need to skip a bit if no delta mask found
export const clientData: B.BufferParser<ClientData> = (i) =>
  pipe(
    stream(i.buffer, i.cursor * 8),

    pipe(
      BB.ubits(1),
      P.filter((a) => a !== 0),
      P.apSecond(BB.ubits(8)),
      P.bindTo("deltaUpdateMask"),
      P.alt(() =>
        pipe(
          P.of<number, { deltaUpdateMask?: number }>({}),
          P.apFirst(P.skip<number>(1))
        )
      ),

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

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

const deltaUpdateMask: B.BufferParser<number | undefined> = pipe(
  BB.ubits(1),

  P.chain((hasDeltaMask) =>
    hasDeltaMask !== 0 ? BB.ubits(8) : P.of(undefined)
  )
);

const weaponData: B.BufferParser<ClientData["weaponData"]> = pipe(
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
      P.map(({ weaponIndex, weaponData }) => ({ weaponIndex, ...weaponData }))
    )
  ),

  P.apFirst(P.skip(1)) // skip hasWeaponData flag
);

export const clientData: B.BufferParser<ClientData> = (i) =>
  pipe(
    stream(i.buffer, i.cursor * 8),

    pipe(
      P.struct({
        deltaUpdateMask,
        clientData: readDelta("clientdata_t"),
        weaponData,
      }),
      BB.nextByte
    )
  );

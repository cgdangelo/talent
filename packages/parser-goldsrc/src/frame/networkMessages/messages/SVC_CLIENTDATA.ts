import { parser as P, statefulParser as SP } from "@talent/parser";
import * as BB from "@talent/parser-bitbuffer";
import type { buffer as B } from "@talent/parser-buffer";
import { success } from "@talent/parser/lib/ParseResult";
import { stream } from "@talent/parser/lib/Stream";
import { pipe } from "fp-ts/lib/function";
import type { Delta } from "../../../delta";
import { readDelta } from "../../../delta";
import type { DemoState, DemoStateParser } from "../../../DemoState";

export type ClientData = {
  readonly deltaUpdateMask?: number;
  readonly clientData: Delta;
  readonly weaponData: readonly {
    readonly weaponIndex: number;
    readonly weaponData: Delta;
  }[];
};

const deltaUpdateMask: B.BufferParser<number | undefined> = BB.bitFlagged(() =>
  BB.ubits(8)
);

const hasWeaponData: DemoStateParser<number> = SP.lift(
  pipe(
    BB.ubits(1),
    P.filter((hasWeaponData) => hasWeaponData !== 0)
  )
);

const weaponData: DemoStateParser<ClientData["weaponData"]> = pipe(
  SP.many(
    pipe(
      hasWeaponData,
      SP.chain(() =>
        pipe(
          SP.lift<number, number, DemoState>(BB.ubits(6)),
          SP.bindTo("weaponIndex"),
          SP.bind("weaponData", () => readDelta("weapon_data_t"))
        )
      )
    )
  ),

  SP.chainFirst(() => SP.lift(P.skip(1)))
);

export const clientData: DemoStateParser<ClientData> = pipe(
  SP.lift<number, number | undefined, DemoState>(deltaUpdateMask),
  SP.bindTo("deltaUpdateMask"),
  SP.bind("clientData", () => readDelta("clientdata_t")),
  SP.bind("weaponData", () => weaponData),

  SP.chain((a) =>
    SP.lift((i) =>
      success(
        a,
        i,
        stream(
          i.buffer,
          i.cursor % 8 === 0 ? i.cursor / 8 : Math.floor(i.cursor / 8) + 1
        )
      )
    )
  )
);

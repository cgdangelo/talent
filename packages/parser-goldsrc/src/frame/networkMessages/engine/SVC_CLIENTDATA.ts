import { parser as P, statefulParser as SP } from "@talent/parser";
import * as BB from "@talent/parser-bitbuffer";
import type { buffer as B } from "@talent/parser-buffer";
import { success } from "@talent/parser/lib/ParseResult";
import { stream } from "@talent/parser/lib/Stream";
import { pipe } from "fp-ts/lib/function";
import type { Delta } from "../../../delta";
import { readDelta } from "../../../delta";
import * as DS from "../../../DemoState";
import { MessageType } from "../MessageType";

export type ClientData = {
  readonly id: MessageType.SVC_CLIENTDATA;
  readonly name: "SVC_CLIENTDATA";

  readonly fields: {
    readonly deltaUpdateMask?: number;
    readonly clientData: Delta;
    readonly weaponData: readonly {
      readonly weaponIndex: number;
      readonly weaponData: Delta;
    }[];
  };
};

const deltaUpdateMask: B.BufferParser<number | undefined> = BB.bitFlagged(() =>
  BB.ubits(8)
);
const hasWeaponData: DS.DemoStateParser<number> = SP.lift(
  pipe(
    BB.ubits(1),
    P.filter((hasWeaponData) => hasWeaponData !== 0)
  )
);

const weaponData: DS.DemoStateParser<ClientData["fields"]["weaponData"]> = pipe(
  SP.many(
    pipe(
      hasWeaponData,
      SP.chain(() =>
        pipe(
          DS.lift(BB.ubits(6)),
          SP.bindTo("weaponIndex"),
          SP.bind("weaponData", () => readDelta("weapon_data_t"))
        )
      )
    )
  ),

  SP.chainFirst(() => SP.lift(P.skip(1)))
);

export const clientData: DS.DemoStateParser<ClientData> = (s) => (i) =>
  pipe(
    stream(i.buffer, i.cursor * 8),

    pipe(
      DS.lift(deltaUpdateMask),
      SP.bindTo("deltaUpdateMask"),

      SP.bind("clientData", () => readDelta("clientdata_t")),

      SP.bind("weaponData", () => weaponData),

      SP.chain((a) =>
        SP.lift((o) =>
          success(
            a,
            i,
            stream(
              o.buffer,
              o.cursor % 8 === 0 ? o.cursor / 8 : Math.floor(o.cursor / 8) + 1
            )
          )
        )
      ),

      SP.map(
        (fields) =>
          ({
            id: MessageType.SVC_CLIENTDATA,
            name: "SVC_CLIENTDATA",
            fields,
          } as const)
      )
    )(s)
  );

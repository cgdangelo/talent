import { buffer as B } from "@talent/parser-buffer";
import * as P from "@talent/parser/lib/Parser";
import { pipe } from "fp-ts/lib/function";
import { MessageType } from "../MessageType";

export type CrosshairAngle = {
  readonly id: MessageType.SVC_CROSSHAIRANGLE;
  readonly name: "SVC_CROSSHAIRANGLE";

  readonly fields: {
    readonly pitch: number;
    readonly yaw: number;
  };
};

export const crosshairAngle: B.BufferParser<CrosshairAngle> = pipe(
  P.struct({ pitch: B.int16_le, yaw: B.int16_le }),

  P.map((fields) => ({
    id: MessageType.SVC_CROSSHAIRANGLE,
    name: "SVC_CROSSHAIRANGLE",
    fields,
  }))
);

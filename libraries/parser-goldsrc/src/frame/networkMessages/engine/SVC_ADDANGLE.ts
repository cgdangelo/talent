import { buffer as B } from "@talent/parser-buffer";
import * as P from "@talent/parser/lib/Parser";
import { pipe } from "fp-ts/lib/function";
import { MessageType } from "../MessageType";

export type AddAngle = {
  readonly id: MessageType.SVC_ADDANGLE;
  readonly name: "SVC_ADDANGLE";

  readonly fields: {
    readonly angleToAdd: number;
  };
};

export const addAngle: B.BufferParser<AddAngle> = pipe(
  P.struct({
    angleToAdd: pipe(
      B.int16_le,
      P.map((a) => a / (65536 / 360))
    ),
  }),

  P.map((fields) => ({
    id: MessageType.SVC_ADDANGLE,
    name: "SVC_ADDANGLE",
    fields,
  }))
);

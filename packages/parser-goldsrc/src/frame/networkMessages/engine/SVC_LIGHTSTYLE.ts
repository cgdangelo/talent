import { buffer as B } from "@talent/parser-buffer";
import * as P from "@talent/parser/lib/Parser";
import { pipe } from "fp-ts/lib/function";
import { MessageType } from "../MessageType";

export type LightStyle = {
  readonly id: MessageType.SVC_LIGHTSTYLE;
  readonly name: "SVC_LIGHTSTYLE";

  readonly fields: {
    readonly index: number;
    readonly lightInfo: string;
  };
};

// TODO Parse light info
export const lightStyle: B.BufferParser<LightStyle> = pipe(
  P.struct({ index: B.uint8_le, lightInfo: B.ztstr }),

  P.map((fields) => ({
    id: MessageType.SVC_LIGHTSTYLE,
    name: "SVC_LIGHTSTYLE",
    fields,
  }))
);

import { buffer as B } from "@talent/parser-buffer";
import * as P from "@talent/parser/lib/Parser";
import { pipe } from "fp-ts/lib/function";
import { MessageType } from "../MessageType";

export type StopSound = {
  readonly type: {
    readonly id: MessageType.SVC_STOPSOUND;
    readonly name: "SVC_STOPSOUND";
  };

  readonly fields: {
    readonly entityIndex: number;
  };
};

export const stopSound: B.BufferParser<StopSound> = pipe(
  P.struct({ entityIndex: B.int16_le }),

  P.map((fields) => ({
    type: { id: MessageType.SVC_STOPSOUND, name: "SVC_STOPSOUND" } as const,
    fields,
  }))
);

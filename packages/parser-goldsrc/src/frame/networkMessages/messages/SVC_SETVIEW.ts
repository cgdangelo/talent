import { buffer as B } from "@talent/parser-buffer";
import * as P from "@talent/parser/lib/Parser";
import { pipe } from "fp-ts/lib/function";

export type SetView = {
  readonly type: {
    readonly id: 5;
    readonly name: "SVC_SETVIEW";
  };

  readonly fields: {
    readonly entityIndex: number;
  };
};

export const setView: B.BufferParser<SetView> = pipe(
  P.struct({ entityIndex: B.int16_le }),
  P.map((fields) => ({ type: { id: 5, name: "SVC_SETVIEW" } as const, fields }))
);

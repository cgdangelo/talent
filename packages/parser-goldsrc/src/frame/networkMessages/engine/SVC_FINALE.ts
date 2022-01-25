import { buffer as B } from "@talent/parser-buffer";
import * as P from "@talent/parser/lib/Parser";
import { pipe } from "fp-ts/lib/function";
import { MessageType } from "../MessageType";

export type Finale = {
  readonly id: MessageType.SVC_FINALE;
  readonly name: "SVC_FINALE";

  readonly fields: {
    readonly text: string;
  };
};

export const finale: B.BufferParser<Finale> = pipe(
  P.struct({ text: B.ztstr }),

  P.map((fields) => ({
    id: MessageType.SVC_FINALE,
    name: "SVC_FINALE",
    fields,
  }))
);

import { buffer as B } from "@talent/parser-buffer";
import * as P from "@talent/parser/lib/Parser";
import { pipe } from "fp-ts/lib/function";
import { MessageType } from "../MessageType";

export type Director = {
  readonly id: MessageType.SVC_DIRECTOR;
  readonly name: "SVC_DIRECTOR";

  readonly fields: {
    readonly flag: number;
    readonly message: string;
  };
};

export const director: B.BufferParser<Director> = pipe(
  B.uint8_le,

  P.chain((length) =>
    P.struct({
      flag: B.uint8_le,
      message: B.ztstr_padded(length),
    })
  ),

  P.map((fields) => ({
    id: MessageType.SVC_DIRECTOR,
    name: "SVC_DIRECTOR",
    fields,
  }))
);

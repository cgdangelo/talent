import { buffer as B } from "@talent/parser-buffer";
import * as P from "@talent/parser/lib/Parser";
import { pipe } from "fp-ts/lib/function";

export type Director = {
  readonly flag: number;
  readonly message: string;
};

export const director: B.BufferParser<Director> = pipe(
  B.uint8_le,

  P.chain((length) =>
    P.struct({
      flag: B.uint8_le,
      message: B.ztstr_padded(length),
    })
  )
);

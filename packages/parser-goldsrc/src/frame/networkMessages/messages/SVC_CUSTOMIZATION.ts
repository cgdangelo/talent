import { buffer as B } from "@talent/parser-buffer";
import * as P from "@talent/parser/lib/Parser";
import { pipe } from "fp-ts/lib/function";

export type Customization = {
  readonly playerIndex: number;
  readonly type: number;
  readonly name: string;
  readonly index: number;
  readonly downloadSize: number;
  readonly flags: number;
  readonly md5Hash?: number;
};

export const customization: B.BufferParser<Customization> = pipe(
  P.struct({
    playerIndex: B.uint8_le,
    type: B.uint8_le,
    name: B.ztstr,
    index: B.uint16_le,
    downloadSize: B.uint32_le,
    flags: B.uint8_le,
  }),

  P.chain((a) =>
    pipe(
      P.of<number, number>(a.flags),
      P.filter((flags) => (flags & 4) !== 0),
      P.apSecond(P.take(16)),
      P.map((md5Hash) => ({ ...a, md5Hash })),
      P.alt(() => P.of(a))
    )
  )
);

import { buffer as B } from "@talent/parser-buffer";
import * as P from "@talent/parser/lib/Parser";
import { pipe } from "fp-ts/lib/function";

export type HLTV =
  // #define HLTV_ACTIVE	0	// tells client that he's an spectator and will get director commands
  | { readonly mode: 0; readonly modeName: "HLTV_ACTIVE" }
  // #define HLTV_STATUS	1	// send status infos about proxy
  | { readonly mode: 1; readonly modeName: "HLTV_STATUS" }
  // #define HLTV_LISTEN	2	// tell client to listen to a multicast stream
  | { readonly mode: 2; readonly modeName: "HLTV_LISTEN" };

export const hltv: B.BufferParser<HLTV> = pipe(
  B.uint8_le,
  P.filter((a): a is HLTV["mode"] => a >= 0 && a <= 2),
  P.map((mode) => {
    switch (mode) {
      case 0:
        return { mode: 0, modeName: "HLTV_ACTIVE" };
      case 1:
        return { mode: 1, modeName: "HLTV_STATUS" };
      case 2:
        return { mode: 2, modeName: "HLTV_LISTEN" };
    }
  })
);

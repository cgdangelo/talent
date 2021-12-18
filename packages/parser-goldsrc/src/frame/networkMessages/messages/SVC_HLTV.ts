import { buffer as B } from "@talent/parser-buffer";
import * as P from "@talent/parser/lib/Parser";
import { absurd, pipe } from "fp-ts/lib/function";

export type HLTV = {
  readonly mode:
    | { readonly id: 0; readonly name: "HLTV_ACTIVE" } // tells client that he's an spectator and will get director commands
    | { readonly id: 1; readonly name: "HLTV_STATUS" } // send status infos about proxy
    | { readonly id: 2; readonly name: "HLTV_LISTEN" }; // tell client to listen to a multicast stream
};

export const hltv: B.BufferParser<HLTV> = pipe(
  B.uint8_le,
  P.filter((a): a is HLTV["mode"]["id"] => a >= 0 && a <= 2),
  P.map((mode): HLTV["mode"] => {
    switch (mode) {
      case 0:
        return { id: 0, name: "HLTV_ACTIVE" };
      case 1:
        return { id: 1, name: "HLTV_STATUS" };
      case 2:
        return { id: 2, name: "HLTV_LISTEN" };
      default:
        return absurd(mode);
    }
  }),
  P.bindTo("mode")
);

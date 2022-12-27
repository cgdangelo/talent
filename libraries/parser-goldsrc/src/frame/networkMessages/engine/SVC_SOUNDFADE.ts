import { buffer as B } from "@talent/parser-buffer";
import * as P from "@talent/parser/lib/Parser";
import { pipe } from "fp-ts/lib/function";
import { MessageType } from "../MessageType";

export type SoundFade = {
  readonly id: MessageType.SVC_SOUNDFADE;
  readonly name: "SVC_SOUNDFADE";

  readonly fields: {
    readonly initialPercent: number;
    readonly holdTime: number;
    readonly fadeOutTime: number;
    readonly fadeInTime: number;
  };
};

export const soundFade: B.BufferParser<SoundFade> = pipe(
  P.struct({
    initialPercent: B.uint8_le,
    holdTime: B.uint8_le,
    fadeOutTime: B.uint8_le,
    fadeInTime: B.uint8_le,
  }),

  P.map((fields) => ({
    id: MessageType.SVC_SOUNDFADE,
    name: "SVC_SOUNDFADE",
    fields,
  }))
);

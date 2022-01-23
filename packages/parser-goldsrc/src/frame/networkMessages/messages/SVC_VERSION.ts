import { buffer as B } from "@talent/parser-buffer";
import * as P from "@talent/parser/lib/Parser";
import { pipe } from "fp-ts/lib/function";
import { MessageType } from "../MessageType";

export type Version = {
  readonly type: {
    readonly id: 4;
    readonly name: "SVC_VERSION";
  };

  readonly fields: {
    readonly protocolVersion: number;
  };
};

export const version: B.BufferParser<Version> = pipe(
  P.struct({ protocolVersion: B.uint32_le }),

  P.map((fields) => ({
    type: { id: MessageType.SVC_VERSION, name: "SVC_VERSION" } as const,
    fields,
  }))
);

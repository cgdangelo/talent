import { buffer as B } from "@talent/parser-buffer";
import * as P from "@talent/parser/lib/Parser";
import { pipe } from "fp-ts/lib/function";
import { MessageType } from "../MessageType";

export type ResourceRequest = {
  readonly id: MessageType.SVC_RESOURCEREQUEST;
  readonly name: "SVC_RESOURCEREQUEST";

  readonly fields: {
    readonly spawnCount: number;
  };
};

export const resourceRequest: B.BufferParser<ResourceRequest> = pipe(
  P.struct({ spawnCount: B.int32_le }),
  P.apFirst(P.skip(4)),

  P.map((fields) => ({
    id: MessageType.SVC_RESOURCEREQUEST,
    name: "SVC_RESOURCEREQUEST",
    fields,
  }))
);

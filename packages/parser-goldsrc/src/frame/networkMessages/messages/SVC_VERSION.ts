import { buffer as B } from "@talent/parser-buffer";
import * as P from "@talent/parser/lib/Parser";

export type Version = {
  readonly protocolVersion: number;
};

export const version: B.BufferParser<Version> = P.struct({
  protocolVersion: B.uint32_le,
});

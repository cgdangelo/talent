import { parser as P } from "@talent/parser";
import type { buffer as B } from "@talent/parser-buffer";
import { pipe } from "fp-ts/lib/function";
import type { Point } from "../../../../Point";
import { coordPoint } from "./coord";
import { TempEntityType } from "./TempEntityType";

export type Teleport = {
  readonly id: TempEntityType.TE_TELEPORT;
  readonly name: "TE_TELEPORT";
  readonly fields: {
    readonly position: Point;
  };
};

export const teleport: B.BufferParser<Teleport> = pipe(
  P.struct({ position: coordPoint }),

  P.map((fields) => ({
    id: TempEntityType.TE_TELEPORT,
    name: "TE_TELEPORT",
    fields,
  }))
);

import { parser as P } from "@talent/parser";
import type { buffer as B } from "@talent/parser-buffer";
import { pipe } from "fp-ts/lib/function";
import type { Point } from "../../../../Point";
import { coordPoint } from "./SVC_TEMPENTITY";
import { TempEntityType } from "./TempEntityType";

export type TarExplosion = {
  readonly id: TempEntityType.TE_TAREXPLOSION;
  readonly name: "TE_TAREXPLOSION";
  readonly fields: {
    readonly position: Point;
  };
};

export const tarExplosion: B.BufferParser<TarExplosion> = pipe(
  P.struct({ position: coordPoint }),

  P.map((fields) => ({
    id: TempEntityType.TE_TAREXPLOSION,
    name: "TE_TAREXPLOSION",
    fields,
  }))
);

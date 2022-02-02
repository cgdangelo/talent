import { parser as P } from "@talent/parser";
import type { buffer as B } from "@talent/parser-buffer";
import { pipe } from "fp-ts/lib/function";
import type { Point } from "../../../../Point";
import { coord, coordPoint } from "../SVC_TEMPENTITY";
import { TempEntityType } from "./TempEntityType";

export type TE_MULTIGUNSHOT = {
  readonly id: TempEntityType.TE_MULTIGUNSHOT;
  readonly name: "TE_MULTIGUNSHOT";
  readonly fields: {
    readonly origin: Point;
    readonly direction: Point;
    readonly noise: Point;
  };
};

export const multiGunshot: B.BufferParser<TE_MULTIGUNSHOT> = pipe(
  P.struct({
    origin: coordPoint,
    direction: coordPoint,
    noise: pipe(
      P.tuple(coord, coord),
      P.map(([x, y]) => ({ x, y, z: 0 }))
    ),
  }),

  P.map((fields) => ({
    id: TempEntityType.TE_MULTIGUNSHOT,
    name: "TE_MULTIGUNSHOT",
    fields,
  }))
);

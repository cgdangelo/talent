import type { Point } from "../../../../Point";
import type { TempEntityType } from "./TempEntityType";

export type TE_LARGEFUNNEL = {
  readonly id: TempEntityType.TE_LARGEFUNNEL;
  readonly name: "TE_LARGEFUNNEL";
  readonly fields: {
    readonly position: Point;
    readonly modelIndex: number;
    readonly flags: number;
  };
};

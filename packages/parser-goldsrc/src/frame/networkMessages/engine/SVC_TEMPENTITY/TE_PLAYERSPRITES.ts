import type { TempEntityType } from "./TempEntityType";

export type TE_PLAYERSPRITES = {
  readonly id: TempEntityType.TE_PLAYERSPRITES;
  readonly name: "TE_PLAYERSPRITES";
  readonly fields: {
    readonly entityIndex: number;
    readonly modelIndex: number;
    readonly count: number;
    readonly variance: number;
  };
};

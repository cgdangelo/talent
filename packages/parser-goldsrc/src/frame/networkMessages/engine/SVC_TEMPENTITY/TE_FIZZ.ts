import type { TempEntityType } from "./TempEntityType";

export type TE_FIZZ = {
  readonly id: TempEntityType.TE_FIZZ;
  readonly name: "TE_FIZZ";
  readonly fields: {
    readonly entityIndex: number;
    readonly modelIndex: number;
    readonly scale: number;
  };
};

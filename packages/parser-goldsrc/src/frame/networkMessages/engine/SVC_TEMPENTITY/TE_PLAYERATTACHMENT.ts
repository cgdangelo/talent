import type { TempEntityType } from "./TempEntityType";

export type TE_PLAYERATTACHMENT = {
  readonly id: TempEntityType.TE_PLAYERATTACHMENT;
  readonly name: "TE_PLAYERATTACHMENT";
  readonly fields: {
    readonly entityIndex: number;
    readonly scale: number;
    readonly modelIndex: number;
    readonly life: number;
  };
};

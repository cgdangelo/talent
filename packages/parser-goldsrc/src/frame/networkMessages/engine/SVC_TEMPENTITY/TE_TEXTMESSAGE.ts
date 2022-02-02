import type { TempEntityType } from "./TempEntityType";

export enum TE_TEXTMESSAGE_FX {
  FadeInOut = 0,
  Credits = 1 << 0,
  WriteOut = 1 << 1,
}

export type TE_TEXTMESSAGE = {
  readonly id: TempEntityType.TE_TEXTMESSAGE;
  readonly name: "TE_TEXTMESSAGE";
  readonly fields: {
    readonly channel: number;
    readonly position: {
      readonly x: number;
      readonly y: number;
    };
    readonly effect: TE_TEXTMESSAGE_FX;
    readonly textColor: {
      readonly r: number;
      readonly g: number;
      readonly b: number;
      readonly a: number;
    };
    readonly effectColor: {
      readonly r: number;
      readonly g: number;
      readonly b: number;
      readonly a: number;
    };
    readonly fadeIn: number;
    readonly fadeOut: number;
    readonly hold: number;
    readonly fxTime?: number;
    readonly textMessage: string;
  };
};

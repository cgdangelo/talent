import { buffer as B } from "@talent/parser-buffer";
import * as P from "@talent/parser/lib/Parser";
import { absurd, pipe } from "fp-ts/lib/function";
import { MessageType } from "../MessageType";

export type RoomType = {
  readonly type: {
    readonly id: MessageType.SVC_ROOMTYPE;
    readonly name: "SVC_ROOMTYPE";
  };

  readonly fields: {
    readonly type:
      | { readonly id: 0; readonly name: "Normal" }
      | { readonly id: 1; readonly name: "Generic" }
      | { readonly id: 2; readonly name: "Metal Small" }
      | { readonly id: 3; readonly name: "Metal Medium" }
      | { readonly id: 4; readonly name: "Metal Large" }
      | { readonly id: 5; readonly name: "Tunnel Small" }
      | { readonly id: 6; readonly name: "Tunnel Medium" }
      | { readonly id: 7; readonly name: "Tunnel Large" }
      | { readonly id: 8; readonly name: "Chamber Small" }
      | { readonly id: 9; readonly name: "Chamber Medium" }
      | { readonly id: 10; readonly name: "Chamber Large" }
      | { readonly id: 11; readonly name: "Bright Small" }
      | { readonly id: 12; readonly name: "Bright Medium" }
      | { readonly id: 13; readonly name: "Bright Large" }
      | { readonly id: 14; readonly name: "Water 1" }
      | { readonly id: 15; readonly name: "Water 2" }
      | { readonly id: 16; readonly name: "Water 3" }
      | { readonly id: 17; readonly name: "Concrete Small" }
      | { readonly id: 18; readonly name: "Concrete Medium" }
      | { readonly id: 19; readonly name: "Concrete Large" }
      | { readonly id: 20; readonly name: "Big 1" }
      | { readonly id: 21; readonly name: "Big 2" }
      | { readonly id: 22; readonly name: "Big 3" }
      | { readonly id: 23; readonly name: "Cavern Small" }
      | { readonly id: 24; readonly name: "Cavern Medium" }
      | { readonly id: 25; readonly name: "Cavern Large" }
      | { readonly id: 26; readonly name: "Weirdo Small" }
      | { readonly id: 27; readonly name: "Weirdo Medium" }
      | { readonly id: 28; readonly name: "Weirdo Large" };
  };
};

export const roomType: B.BufferParser<RoomType> = pipe(
  B.uint16_le,
  P.filter((a): a is RoomType["fields"]["type"]["id"] => a >= 0 && a <= 28),
  P.map((type): RoomType["fields"]["type"] => {
    switch (type) {
      case 0:
        return { id: 0, name: "Normal" };
      case 1:
        return { id: 1, name: "Generic" };
      case 2:
        return { id: 2, name: "Metal Small" };
      case 3:
        return { id: 3, name: "Metal Medium" };
      case 4:
        return { id: 4, name: "Metal Large" };
      case 5:
        return { id: 5, name: "Tunnel Small" };
      case 6:
        return { id: 6, name: "Tunnel Medium" };
      case 7:
        return { id: 7, name: "Tunnel Large" };
      case 8:
        return { id: 8, name: "Chamber Small" };
      case 9:
        return { id: 9, name: "Chamber Medium" };
      case 10:
        return { id: 10, name: "Chamber Large" };
      case 11:
        return { id: 11, name: "Bright Small" };
      case 12:
        return { id: 12, name: "Bright Medium" };
      case 13:
        return { id: 13, name: "Bright Large" };
      case 14:
        return { id: 14, name: "Water 1" };
      case 15:
        return { id: 15, name: "Water 2" };
      case 16:
        return { id: 16, name: "Water 3" };
      case 17:
        return { id: 17, name: "Concrete Small" };
      case 18:
        return { id: 18, name: "Concrete Medium" };
      case 19:
        return { id: 19, name: "Concrete Large" };
      case 20:
        return { id: 20, name: "Big 1" };
      case 21:
        return { id: 21, name: "Big 2" };
      case 22:
        return { id: 22, name: "Big 3" };
      case 23:
        return { id: 23, name: "Cavern Small" };
      case 24:
        return { id: 24, name: "Cavern Medium" };
      case 25:
        return { id: 25, name: "Cavern Large" };
      case 26:
        return { id: 26, name: "Weirdo Small" };
      case 27:
        return { id: 27, name: "Weirdo Medium" };
      case 28:
        return { id: 28, name: "Weirdo Large" };
      default:
        return absurd(type);
    }
  }),
  P.bindTo("type"),

  P.map((fields) => ({
    type: { id: MessageType.SVC_ROOMTYPE, name: "SVC_ROOMTYPE" } as const,
    fields,
  }))
);

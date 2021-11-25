import { buffer as B } from "@talent/parser-buffer";
import * as P from "@talent/parser/lib/Parser";
import { absurd, pipe } from "fp-ts/lib/function";

export type RoomType =
  | { readonly type: 0; readonly typeName: "Normal" }
  | { readonly type: 1; readonly typeName: "Generic" }
  | { readonly type: 2; readonly typeName: "Metal Small" }
  | { readonly type: 3; readonly typeName: "Metal Medium" }
  | { readonly type: 4; readonly typeName: "Metal Large" }
  | { readonly type: 5; readonly typeName: "Tunnel Small" }
  | { readonly type: 6; readonly typeName: "Tunnel Medium" }
  | { readonly type: 7; readonly typeName: "Tunnel Large" }
  | { readonly type: 8; readonly typeName: "Chamber Small" }
  | { readonly type: 9; readonly typeName: "Chamber Medium" }
  | { readonly type: 10; readonly typeName: "Chamber Large" }
  | { readonly type: 11; readonly typeName: "Bright Small" }
  | { readonly type: 12; readonly typeName: "Bright Medium" }
  | { readonly type: 13; readonly typeName: "Bright Large" }
  | { readonly type: 14; readonly typeName: "Water 1" }
  | { readonly type: 15; readonly typeName: "Water 2" }
  | { readonly type: 16; readonly typeName: "Water 3" }
  | { readonly type: 17; readonly typeName: "Concrete Small" }
  | { readonly type: 18; readonly typeName: "Concrete Medium" }
  | { readonly type: 19; readonly typeName: "Concrete Large" }
  | { readonly type: 20; readonly typeName: "Big 1" }
  | { readonly type: 21; readonly typeName: "Big 2" }
  | { readonly type: 22; readonly typeName: "Big 3" }
  | { readonly type: 23; readonly typeName: "Cavern Small" }
  | { readonly type: 24; readonly typeName: "Cavern Medium" }
  | { readonly type: 25; readonly typeName: "Cavern Large" }
  | { readonly type: 26; readonly typeName: "Weirdo Small" }
  | { readonly type: 27; readonly typeName: "Weirdo Medium" }
  | { readonly type: 28; readonly typeName: "Weirdo Large" };

export const roomType: B.BufferParser<RoomType> = pipe(
  B.uint16_le,
  P.filter((a): a is RoomType["type"] => a >= 0 && a <= 28),
  P.map((type) => {
    switch (type) {
      case 0:
        return { type: 0, typeName: "Normal" };
      case 1:
        return { type: 1, typeName: "Generic" };
      case 2:
        return { type: 2, typeName: "Metal Small" };
      case 3:
        return { type: 3, typeName: "Metal Medium" };
      case 4:
        return { type: 4, typeName: "Metal Large" };
      case 5:
        return { type: 5, typeName: "Tunnel Small" };
      case 6:
        return { type: 6, typeName: "Tunnel Medium" };
      case 7:
        return { type: 7, typeName: "Tunnel Large" };
      case 8:
        return { type: 8, typeName: "Chamber Small" };
      case 9:
        return { type: 9, typeName: "Chamber Medium" };
      case 10:
        return { type: 10, typeName: "Chamber Large" };
      case 11:
        return { type: 11, typeName: "Bright Small" };
      case 12:
        return { type: 12, typeName: "Bright Medium" };
      case 13:
        return { type: 13, typeName: "Bright Large" };
      case 14:
        return { type: 14, typeName: "Water 1" };
      case 15:
        return { type: 15, typeName: "Water 2" };
      case 16:
        return { type: 16, typeName: "Water 3" };
      case 17:
        return { type: 17, typeName: "Concrete Small" };
      case 18:
        return { type: 18, typeName: "Concrete Medium" };
      case 19:
        return { type: 19, typeName: "Concrete Large" };
      case 20:
        return { type: 20, typeName: "Big 1" };
      case 21:
        return { type: 21, typeName: "Big 2" };
      case 22:
        return { type: 22, typeName: "Big 3" };
      case 23:
        return { type: 23, typeName: "Cavern Small" };
      case 24:
        return { type: 24, typeName: "Cavern Medium" };
      case 25:
        return { type: 25, typeName: "Cavern Large" };
      case 26:
        return { type: 26, typeName: "Weirdo Small" };
      case 27:
        return { type: 27, typeName: "Weirdo Medium" };
      case 28:
        return { type: 28, typeName: "Weirdo Large" };
      default:
        return absurd(type);
    }
  })
);

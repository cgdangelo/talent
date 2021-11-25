import { buffer as B } from "@talent/parser-buffer";
import * as P from "@talent/parser/lib/Parser";

export type ResourceLocation = {
  readonly sv_downloadurl: string;
};

export const resourceLocation: B.BufferParser<ResourceLocation> = P.struct({
  sv_downloadurl: B.ztstr,
});

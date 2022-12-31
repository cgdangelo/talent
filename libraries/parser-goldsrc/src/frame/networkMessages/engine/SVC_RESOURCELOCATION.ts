import { buffer as B } from '@cgdangelo/talent-parser-buffer';
import * as P from '@cgdangelo/talent-parser/lib/Parser';
import { pipe } from 'fp-ts/lib/function';
import { MessageType } from '../MessageType';

export type ResourceLocation = {
  readonly id: MessageType.SVC_RESOURCELOCATION;
  readonly name: 'SVC_RESOURCELOCATION';

  readonly fields: {
    readonly sv_downloadurl: string;
  };
};

export const resourceLocation: B.BufferParser<ResourceLocation> = pipe(
  P.struct({ sv_downloadurl: B.ztstr }),

  P.map((fields) => ({
    id: MessageType.SVC_RESOURCELOCATION,
    name: 'SVC_RESOURCELOCATION',
    fields
  }))
);

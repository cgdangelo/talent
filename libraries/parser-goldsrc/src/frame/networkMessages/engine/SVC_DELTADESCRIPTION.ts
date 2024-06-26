import { statefulParser as SP } from '@cgdangelo/talent-parser';
import { buffer as B } from '@cgdangelo/talent-parser-buffer';
import { success } from '@cgdangelo/talent-parser/lib/ParseResult';
import { stream } from '@cgdangelo/talent-parser/lib/Stream';
import { readonlyMap as RM, string } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { type DeltaFieldDecoder } from '../../../delta';
import { readDelta } from '../../../delta';
import * as DS from '../../../DemoState';
import { MessageType } from '../MessageType';

export type DeltaDescription = {
  readonly id: MessageType.SVC_DELTADESCRIPTION;
  readonly name: 'SVC_DELTADESCRIPTION';

  readonly fields: {
    readonly name: string;
    readonly fields: readonly DeltaFieldDecoder[];
  };
};

const addDeltaDecoder = RM.upsertAt(string.Eq);

export const deltaDescription: DS.DemoStateParser<DeltaDescription> = pipe(
  DS.lift(B.ztstr),
  SP.bindTo('name'),

  SP.bind('fields', () =>
    pipe(
      DS.lift(B.uint16_le),
      SP.chain(
        (fieldCount) => (s) => (i) =>
          pipe(
            stream(i.buffer, i.cursor * 8),

            pipe(
              SP.manyN(readDelta<DeltaFieldDecoder>('delta_description_t'), fieldCount),

              SP.chain((a) =>
                SP.lift((o) =>
                  success(
                    a,
                    i,
                    stream(o.buffer, o.cursor % 8 === 0 ? o.cursor / 8 : Math.floor(o.cursor / 8) + 1)
                  )
                )
              )
            )(s)
          )
      )
    )
  ),

  SP.chainFirst(({ name, fields }) =>
    SP.modify((s) => ({
      ...s,
      deltaDecoders: pipe(s.deltaDecoders, addDeltaDecoder(name, fields))
    }))
  ),

  SP.map((fields) => ({
    id: MessageType.SVC_DELTADESCRIPTION,
    name: 'SVC_DELTADESCRIPTION',
    fields
  }))
);

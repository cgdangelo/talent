import { statefulParser as SP } from '@cgdangelo/talent-parser';
import * as BB from '@cgdangelo/talent-parser-bitbuffer';
import { success } from '@cgdangelo/talent-parser/lib/ParseResult';
import { stream } from '@cgdangelo/talent-parser/lib/Stream';
import { pipe } from 'fp-ts/lib/function';
import type { Delta } from '../../../delta';
import { readDelta } from '../../../delta';
import * as DS from '../../../DemoState';
import { MessageType } from '../MessageType';

export type ClientData = {
  readonly id: MessageType.SVC_CLIENTDATA;
  readonly name: 'SVC_CLIENTDATA';

  readonly fields: {
    readonly deltaUpdateMask?: number;
    readonly clientData: Delta;
    readonly weaponData: readonly {
      readonly weaponIndex: number;
      readonly weaponData: Delta;
    }[];
  };
};

export const clientData: DS.DemoStateParser<ClientData> = (s) => (i) =>
  pipe(
    stream(i.buffer, i.cursor * 8),

    pipe(
      DS.lift(BB.bitFlagged(() => BB.ubits(8))),
      SP.bindTo('deltaUpdateMask'),

      SP.bind('clientData', () => readDelta('clientdata_t')),

      SP.bind('weaponData', () => {
        const weaponDatum = pipe(
          DS.lift(BB.ubits(1)),
          SP.chain((hasWeaponData) =>
            hasWeaponData !== 0
              ? pipe(
                  DS.lift(BB.ubits(6)),
                  SP.bindTo('weaponIndex'),
                  SP.bind('weaponData', () => readDelta('weapon_data_t'))
                )
              : SP.fail()
          )
        );

        return pipe(
          SP.many(weaponDatum),
          SP.chainFirst(() => SP.skip(1))
        );
      }),

      SP.chain((a) =>
        SP.lift((o) =>
          success(a, i, stream(o.buffer, o.cursor % 8 === 0 ? o.cursor / 8 : Math.floor(o.cursor / 8) + 1))
        )
      ),

      SP.map(
        (fields) =>
          ({
            id: MessageType.SVC_CLIENTDATA,
            name: 'SVC_CLIENTDATA',
            fields
          } as const)
      )
    )(s)
  );

import { ParseResult } from '@talent/parser/lib/ParseResult';
import { Stream, stream } from '@talent/parser/lib/Stream';
import * as E from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/function';
import { IO } from 'fp-ts/lib/IO';
import { demo, Demo } from './Demo';
import { IDemoEventEmitter } from './DemoEventEmitter';

export type { IDemoEventEmitter } from './DemoEventEmitter';
export { demo };
export type { Demo };

/**
 * Run the demo parser and return a ParseResult.
 *
 * @param demoBuffer - Contents of a demo file.
 * @param eventEmitter - Optional event bus for real-time event access.
 * @returns Parse result.
 */
export function runDemoParser(
  demoBuffer: Buffer,
  eventEmitter?: IDemoEventEmitter
): ParseResult<number, Demo> {
  const demoStream: Stream<number> = stream(demoBuffer as unknown as number[]);

  return demo(eventEmitter)(demoStream);
}

/**
 * Create a lazy function that runs the parser and returns the Demo object, if successful.
 *
 * @param demoBuffer - Contents of a demo file.
 * @param eventEmitter - Optional event bus for real-time event access.
 * @returns Returns Demo object if parse succeeds; undefined otherwise.
 */
export function createDemoParserIO(
  demoBuffer: Buffer,
  eventEmitter?: IDemoEventEmitter
): IO<Demo | undefined> {
  const demoStream: Stream<number> = stream(demoBuffer as unknown as number[]);

  return () => {
    const parseResult = pipe(
      demo(eventEmitter)(demoStream),
      E.map(({ value }) => value)
    );

    return E.isRight(parseResult) ? parseResult.right : undefined;
  };
}

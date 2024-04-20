import { type ParseResult } from '@cgdangelo/talent-parser/lib/ParseResult';
import { type Stream, stream } from '@cgdangelo/talent-parser/lib/Stream';
import * as E from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/function';
import { type IO } from 'fp-ts/lib/IO';
import { demo, type Demo } from './Demo';
import { type IDemoEventEmitter } from './DemoEventEmitter';

/**
 * Run the demo parser and return a ParseResult.
 *
 * @param demoBuffer - Contents of a demo file.
 * @param eventEmitter - Optional event bus for real-time event access.
 * @returns Parse result.
 */
export function goldsrcParserEither(
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
export function goldsrcParserIO(demoBuffer: Buffer, eventEmitter?: IDemoEventEmitter): IO<Demo | undefined> {
  const demoStream: Stream<number> = stream(demoBuffer as unknown as number[]);

  return () => {
    const parseResult = pipe(
      demo(eventEmitter)(demoStream),
      E.map(({ value }) => value)
    );

    return E.isRight(parseResult) ? parseResult.right : undefined;
  };
}

/**
 * Run the parser on a buffer and return a Demo object, if successful.
 *
 * @param demoBuffer - Contents of a demo file.
 * @param eventEmitter - Optional event bus for real-time event access.
 * @returns Returns Demo object if parse succeeds; undefined otherwise.
 */
export function parseDemo(demoBuffer: Buffer, eventEmitter?: IDemoEventEmitter): Demo | undefined {
  const runParser = goldsrcParserIO(demoBuffer, eventEmitter);

  return runParser();
}

export type { IDemoEventEmitter } from './DemoEventEmitter';
export type { DemoHeader } from './DemoHeader';
export type { DirectoryEntry } from './DirectoryEntry';
export type { Frame } from './frame/Frame';
export type { EngineMessage } from './frame/networkMessages/EngineMessage';
export type { UserMessage } from './frame/networkMessages/UserMessage';
export { demo };
export type { Demo };

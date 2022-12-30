import { EventEmitter } from 'events';
import { DemoHeader } from './DemoHeader';
import { DirectoryEntry } from './DirectoryEntry';
import { Frame } from './frame/Frame';
import { EngineMessage } from './frame/networkMessages/EngineMessage';
import { UserMessage } from './frame/networkMessages/UserMessage';

/**
 * Event bus for demo parser.
 */
export interface IDemoEventEmitter extends EventEmitter {
  /**
   * Emitted when parsing has begun.
   *
   * @param eventName - The name of the event.
   * @param listener - The callback function.
   */
  on(eventName: 'demo:start', listener: () => void): this;

  /**
   * Emitted when a demo header has been parsed.
   *
   * @see {@link DemoHeader}
   * @param eventName - The name of the event.
   * @param listener - The callback function.
   */
  on(eventName: 'demo:header', listener: (demoHeader: DemoHeader) => void): this;

  /**
   * Emitted when directory entry, but not its frames, has been parsed.
   *
   * @see {@link DirectoryEntry}
   * @param eventName - The name of the event.
   * @param listener - The callback function.
   */
  on(
    eventName: 'demo:directory-entry',
    listener: (directoryEntry: DirectoryEntry & { frames: never[] }) => void
  ): this;

  /**
   * Emitted when a frame in a directory entry has been parsed.
   *
   * @see {@link Frame}
   * @param eventName - The name of the event.
   * @param listener - The callback function.
   */
  on(eventName: 'demo:frame', listener: (frame: Frame) => void): this;

  /**
   * Emitted when an engine message in a NetworkMessages frame has been parsed.
   *
   * @see {@link EngineMessage}
   * @param eventName - The name of the event.
   * @param listener - The callback function.
   */
  on(eventName: 'demo:netmessage:engine', listener: (engineMessage: EngineMessage) => void): this;

  /**
   * Emitted when a user message in a NetworkMessages frame has been parsed.
   *
   * @see {@link UserMessage}
   * @param eventName - The name of the event.
   * @param listener - The callback function.
   */
  on(eventName: 'demo:netmessage:user', listener: (userMessage: UserMessage) => void): this;

  /**
   * Emitted when parsing has finished.
   *
   * @param eventName - The name of the event.
   * @param listener - The callback function.
   */
  on(eventName: 'demo:end', listener: () => void): this;
}

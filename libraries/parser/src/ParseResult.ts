export * from 'parser-ts/lib/ParseResult';
import * as PR from 'parser-ts/lib/ParseResult';
import { type Stream } from './Stream';

export const success: <I, A>(a: A, input: Stream<I>, next: Stream<I>) => PR.ParseResult<I, A> = (
  a,
  input,
  next
) => PR.success(a, next, input);

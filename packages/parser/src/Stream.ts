export type Stream<I> = {
  readonly buffer: I;
  readonly cursor: number;
};

export const stream: <I>(buffer: I, cursor?: number) => Stream<I> = (
  buffer,
  cursor = 0
) => ({ buffer, cursor });

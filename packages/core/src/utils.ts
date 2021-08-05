export const not = (a: boolean): boolean => !a;

export const eq =
  <A>(a: A) =>
  <B extends A>(b: B): boolean =>
    a === b;

export const toError =
  <A>(message: string) =>
  (a: A): string =>
    `${message}: ${a}`;

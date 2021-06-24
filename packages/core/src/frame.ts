export type Frame = {
  readonly header: Header;
  readonly data: unknown;
};

export type Header = {
  readonly type: number;
  readonly time: number;
  readonly frame: number;
};

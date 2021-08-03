import * as P from "../src/parser";

test.skip("str", () => {
  const buffer = Buffer.from("foo");

  expect(P.str(1)({ buffer, cursor: 0 })).toStrictEqual(
    P.success("f", { buffer, cursor: 0 }, 1)
  );

  expect(P.str(3)({ buffer, cursor: 0 })).toStrictEqual(
    P.success("foo", { buffer, cursor: 0 }, 3)
  );

  expect(
    P.str(3)({ buffer: Buffer.from("foo bar baz"), cursor: 4 })
  ).toStrictEqual(P.success("bar", { buffer, cursor: 4 }, 7));
});

test("char", () => {
  const buffer = Buffer.from("foo");

  expect(P.char({ buffer, cursor: 0 })).toStrictEqual(
    P.success("f", { buffer, cursor: 0 }, 1)
  );

  expect(P.char({ buffer, cursor: 1 })).toStrictEqual(
    P.success("o", { buffer, cursor: 1 }, 2)
  );

  expect(P.char({ buffer, cursor: 2 })).toStrictEqual(
    P.success("o", { buffer, cursor: 2 }, 3)
  );

  expect(P.char({ buffer, cursor: -1 })).toStrictEqual(
    P.failure(expect.any(Error))
  );
});

test("uint32_le", () => {
  const buffer = Buffer.of(0, 0, 0, 1);

  expect(P.uint32_le({ buffer, cursor: 0 })).toStrictEqual(
    P.success(16777216, { buffer, cursor: 0 }, 4)
  );
});

test("int32_le", () => {
  const buffer = Buffer.of(0, 0, 0, -1);

  expect(P.int32_le({ buffer, cursor: 0 })).toStrictEqual(
    P.success(-16777216, { buffer, cursor: 0 }, 4)
  );
});

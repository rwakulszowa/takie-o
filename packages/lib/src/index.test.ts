import { calc } from ".";
import { expect, test } from "@jest/globals";

test("calc", () => {
  expect(calc("2+2")).toBe(4);
});

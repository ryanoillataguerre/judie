import { Environment, getEnv } from "./env.js";
import { test, expect } from "@jest/globals";

test("Checks that the NODE_ENV is 'test'", () => {
  expect(getEnv()).toBe(Environment.Test);
});

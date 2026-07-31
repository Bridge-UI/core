// ** External Imports
import { isString } from "es-toolkit/compat";
import { expect, test } from "vitest";

// ** Local Imports
import { createLayerId, resetLayerIdCounterForTests } from "@/Layer/registry";

test("it should generate unique ids", () => {
  resetLayerIdCounterForTests();

  const first = createLayerId();
  const second = createLayerId();

  expect(second).not.toBe(first);
  expect(isString(first)).toBe(true);
  expect(first.length).toBeGreaterThan(0);
});

test("it should use assigned id when provided", () => {
  expect(createLayerId("host-assigned-id")).toBe("host-assigned-id");
});

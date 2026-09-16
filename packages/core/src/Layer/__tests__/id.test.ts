// ** External Imports
import { isString } from "es-toolkit/compat";
import { expect, test } from "vitest";

// ** Local Imports
import { createLayerId } from "@/Layer/registry";

const UUID_V4 =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

test("it should generate unique ids", () => {
  const first = createLayerId();
  const second = createLayerId();

  expect(second).not.toBe(first);
  expect(isString(first)).toBe(true);
  expect(first).toMatch(UUID_V4);
});

test("it should use assigned id when provided", () => {
  expect(createLayerId("host-assigned-id")).toBe("host-assigned-id");
});

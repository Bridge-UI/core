// ** External Imports
import { expect, test } from "vitest";

// ** Local Imports
import { hasNamedSlot, hasSlotOrProp, isPropPresent } from "@/Utils/slotOrProp";

test("it should treat empty string as absent in isPropPresent", () => {
  expect(isPropPresent("")).toBe(false);

  expect(isPropPresent("x")).toBe(true);

  expect(isPropPresent(null)).toBe(false);
});

test("it should detect slot content in hasNamedSlot", () => {
  expect(hasNamedSlot(undefined, "label")).toBe(false);

  expect(hasNamedSlot({ label: <span /> }, "label")).toBe(true);
});

test("it should be true when slot or prop is present in hasSlotOrProp", () => {
  expect(hasSlotOrProp(undefined, "label", "")).toBe(false);

  expect(hasSlotOrProp(undefined, "label", "Name")).toBe(true);

  expect(hasSlotOrProp({ label: <span /> }, "label", "")).toBe(true);
});

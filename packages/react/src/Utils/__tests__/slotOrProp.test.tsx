// ** External Imports
import { expect, test } from "vitest";

// ** Local Imports
import {
  hasNamedSlot,
  hasSlotOrProp,
  isPropPresent,
  resolveSlotOrProp,
} from "@/Utils/slotOrProp";

test("isPropPresent treats empty string as absent", () => {
  expect(isPropPresent("")).toBe(false);

  expect(isPropPresent("x")).toBe(true);

  expect(isPropPresent(null)).toBe(false);
});

test("hasNamedSlot detects slot content", () => {
  expect(hasNamedSlot(undefined, "label")).toBe(false);

  expect(hasNamedSlot({ label: <span /> }, "label")).toBe(true);
});

test("hasSlotOrProp is true when slot or prop is present", () => {
  expect(hasSlotOrProp(undefined, "label", "")).toBe(false);

  expect(hasSlotOrProp(undefined, "label", "Name")).toBe(true);

  expect(hasSlotOrProp({ label: <span /> }, "label", "")).toBe(true);
});

test("resolveSlotOrProp prefers slot over fallback", () => {
  expect(
    resolveSlotOrProp({
      slots: { description: <span>Slot</span> },
      name: "description",
      fallback: "Prop",
    }),
  ).toEqual(<span>Slot</span>);
});

test("resolveSlotOrProp uses fallback when slot is absent", () => {
  expect(
    resolveSlotOrProp({
      name: "description",
      fallback: "Inform your full name",
    }),
  ).toBe("Inform your full name");
});

test("resolveSlotOrProp returns null when both are absent", () => {
  expect(resolveSlotOrProp({ name: "description", fallback: "" })).toBeNull();
});

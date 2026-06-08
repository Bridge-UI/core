// ** External Imports
import { expect, test } from "vitest";

// ** Local Imports
import {
  hasNamedSlot,
  hasSlotOrProp,
  isPropPresent,
  resolveSlotOrProp,
} from "@/Utils/slotOrProp";

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

test("it should prefer slot over fallback in resolveSlotOrProp", () => {
  expect(
    resolveSlotOrProp({
      fallback: "Prop",
      name: "description",
      slots: { description: <span>Slot</span> },
    }),
  ).toEqual(<span>Slot</span>);
});

test("it should use fallback when slot is absent in resolveSlotOrProp", () => {
  expect(
    resolveSlotOrProp({
      name: "description",
      fallback: "Inform your full name",
    }),
  ).toBe("Inform your full name");
});

test("it should return null when both slot and fallback are absent", () => {
  expect(resolveSlotOrProp({ fallback: "", name: "description" })).toBeNull();
});

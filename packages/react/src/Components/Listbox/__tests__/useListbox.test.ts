// ** External Imports
import { renderHook } from "@testing-library/react";
import { expect, test } from "vitest";

// ** Local Imports
import { useListbox, type ListboxOwnProps } from "@/Components/Listbox";

const libDefaults = {
  size: "md",
  color: "primary",
} as const satisfies Partial<ListboxOwnProps>;

const baseProps = {
  listboxId: "listbox-id",
  options: [{ label: "One", value: "one" }],
} satisfies ListboxOwnProps;

function renderUseListbox(props: Partial<ListboxOwnProps> = {}) {
  return renderHook(() => useListbox({ ...baseProps, ...props }, libDefaults));
}

test("it should return default color as primary", () => {
  const { result } = renderUseListbox();

  expect(result.current.merged.color).toBe("primary");
});

test("it should override color when prop is passed", () => {
  const { result } = renderUseListbox({ color: "error" });

  expect(result.current.merged.color).toBe("error");
});

test("it should expose color classes for options", () => {
  const { result } = renderUseListbox({ color: "primary" });

  expect(result.current.optionSelectedClass).toBeTruthy();
  expect(result.current.optionHighlightedClass).toBeTruthy();
  expect(result.current.checkClass).toBeTruthy();
});

test("it should merge registry classes", () => {
  const { result } = renderUseListbox({
    classes: { check: "custom-check" },
  });

  expect(result.current.mergedClasses.check).toBe("custom-check");
});

test("it should apply default scroll classes", () => {
  const { result } = renderUseListbox();

  expect(result.current.scrollBind.className).toContain("max-h-60");
  expect(result.current.scrollBind.className).toContain("overflow-y-auto");
});

test("it should apply custom maxHeight tailwind class", () => {
  const { result } = renderUseListbox({ maxHeight: "max-h-80" });

  expect(result.current.scrollBind.className).toContain("max-h-80");
  expect(result.current.scrollBind.className).not.toContain("max-h-60");
});

test("it should disable max height when disableMaxHeight is true", () => {
  const { result } = renderUseListbox({ disableMaxHeight: true });

  expect(result.current.scrollBind.className).not.toContain("max-h-60");
  expect(result.current.scrollBind.className).not.toContain("overflow-y-auto");
});

test("it should return default size as md", () => {
  const { result } = renderUseListbox();

  expect(result.current.merged.size).toBe("md");
  expect(result.current.sizeClasses?.option).toContain("px-4");
  expect(result.current.messageBind.className).toContain("text-sm");
});

test("it should apply size classes when size is overridden", () => {
  const { result } = renderUseListbox({ size: "xs" });

  expect(result.current.merged.size).toBe("xs");
  expect(result.current.sizeClasses?.option).toContain("px-3");
  expect(result.current.sizeClasses?.primary).toContain("text-xs");
  expect(result.current.messageBind.className).toContain("text-xs");
  expect(result.current.checkClass).toContain("size-3");
});

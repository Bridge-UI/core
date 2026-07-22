// ** External Imports
import { renderHook } from "@testing-library/react";
import { expect, test } from "vitest";

// ** Local Imports
import {
  useDivider,
  type DividerOwnProps,
  type DividerProps,
} from "@/Components/Divider";

const libDefaults = {
  color: "dark",
  orientation: "horizontal",
} as const satisfies Partial<DividerOwnProps>;

function renderUseDivider(props: DividerProps = {}) {
  return renderHook(() =>
    useDivider(props, libDefaults as Parameters<typeof useDivider>[1]),
  );
}

test("it should merge default color and orientation", () => {
  const { result } = renderUseDivider();

  expect(result.current.merged.color).toBe("dark");
  expect(result.current.merged.orientation).toBe("horizontal");
});

test("it should override color when prop is passed", () => {
  const { result } = renderUseDivider({ color: "primary" });

  expect(result.current.merged.color).toBe("primary");
});

test("it should override orientation when prop is passed", () => {
  const { result } = renderUseDivider({ orientation: "vertical" });

  expect(result.current.merged.orientation).toBe("vertical");
});

test("it should compute rootBind className as a non-empty string", () => {
  const { result } = renderUseDivider();

  expect(typeof result.current.rootBind.className).toBe("string");
  expect(result.current.rootBind.className.length).toBeGreaterThan(0);
});

test("it should merge className into rootBind", () => {
  const { result } = renderUseDivider({ className: "my-4" });

  expect(result.current.rootBind.className).toContain("my-4");
});

test("it should expose inherited attrs on rootBind", () => {
  const { result } = renderUseDivider({
    id: "divider-root",
    "data-testid": "divider",
  });

  expect(result.current.rootBind.id).toBe("divider-root");
  expect(result.current.rootBind["data-testid"]).toBe("divider");
});

test("it should apply className after classes.root in rootBind", () => {
  const { result } = renderUseDivider({
    className: "my-8",
    classes: { root: "my-2" },
  });

  expect(result.current.rootBind.className).toContain("my-8");
  expect(result.current.rootBind.className).not.toContain("my-2");
});

test("it should apply vertical orientation classes", () => {
  const { result } = renderUseDivider({ orientation: "vertical" });

  expect(result.current.rootBind.className).toContain("border-l");
  expect(result.current.rootBind["aria-orientation"]).toBe("vertical");
});

test("it should apply primary color class when color is primary", () => {
  const { result } = renderUseDivider({ color: "primary" });

  expect(result.current.rootBind.className).toContain("border-primary-200");
});

test("it should set separator role on rootBind", () => {
  const { result } = renderUseDivider();

  expect(result.current.rootBind.role).toBe("separator");
});

// ** External Imports
import { renderHook } from "@testing-library/react";
import { isString } from "es-toolkit/compat";
import { expect, test } from "vitest";

// ** Local Imports
import {
  useEmptyState,
  type EmptyStateOwnProps,
  type EmptyStateProps,
} from "@/Components/EmptyState";

const libDefaults = {
  size: "md",
  titleAs: "p",
  align: "center",
  mediaDecorative: true,
} as const satisfies Partial<EmptyStateOwnProps>;

function renderUseEmptyState(props: EmptyStateProps = {}) {
  return renderHook(() =>
    useEmptyState(props, libDefaults as Parameters<typeof useEmptyState>[1]),
  );
}

test("it should return default size as md", () => {
  const { result } = renderUseEmptyState();

  expect(result.current.merged.size).toBe("md");
});

test("it should override size when prop is passed", () => {
  const { result } = renderUseEmptyState({ size: "sm" });

  expect(result.current.merged.size).toBe("sm");
});

test("it should return default align as center", () => {
  const { result } = renderUseEmptyState();

  expect(result.current.merged.align).toBe("center");
});

test("it should compute rootBind className as a non-empty string", () => {
  const { result } = renderUseEmptyState();

  expect(isString(result.current.rootBind.className)).toBe(true);
  expect(result.current.rootBind.className.length).toBeGreaterThan(0);
});

test("it should include compact size classes when size is sm", () => {
  const { result } = renderUseEmptyState({ size: "sm" });

  expect(result.current.rootBind.className).toContain("max-w-sm");
});

test("it should include start alignment classes when align is start", () => {
  const { result } = renderUseEmptyState({ align: "start" });

  expect(result.current.rootBind.className).toContain("items-start");
});

test("it should include end alignment classes when align is end", () => {
  const { result } = renderUseEmptyState({ align: "end" });

  expect(result.current.rootBind.className).toContain("ms-auto");
});

test("it should set iconBind size from the size token", () => {
  const { result } = renderUseEmptyState();

  expect(result.current.iconBind.size).toBe("xl");
});

test("it should set compact iconBind size when size is sm", () => {
  const { result } = renderUseEmptyState({ size: "sm" });

  expect(result.current.iconBind.size).toBe("lg");
});

test("it should let customProps.icon.size override the token size", () => {
  const { result } = renderUseEmptyState({
    customProps: { icon: { size: "xs" } },
  });

  expect(result.current.iconBind.size).toBe("xs");
});

test("it should mark media as hidden when mediaDecorative is true", () => {
  const { result } = renderUseEmptyState();

  expect(result.current.mediaBind["aria-hidden"]).toBe(true);
});

test("it should not mark media as hidden when mediaDecorative is false", () => {
  const { result } = renderUseEmptyState({ mediaDecorative: false });

  expect(result.current.mediaBind["aria-hidden"]).toBeUndefined();
});

test("it should merge className into rootBind", () => {
  const { result } = renderUseEmptyState({ className: "custom-empty" });

  expect(result.current.rootBind.className).toContain("custom-empty");
});

test("it should expose inherited attrs on rootBind", () => {
  const { result } = renderUseEmptyState({
    id: "empty-root",
    "data-testid": "empty",
  });

  expect(result.current.rootBind.id).toBe("empty-root");
  expect(result.current.rootBind["data-testid"]).toBe("empty");
});

test("it should apply className after classes.root in rootBind", () => {
  const { result } = renderUseEmptyState({
    className: "py-4",
    classes: { root: "py-10" },
  });

  expect(result.current.rootBind.className).toContain("py-4");
  expect(result.current.rootBind.className).not.toContain("py-10");
});

test("it should forward customProps.root onto rootBind", () => {
  const { result } = renderUseEmptyState({
    customProps: { root: { id: "empty-root-part" } },
  });

  expect(result.current.rootBind.id).toBe("empty-root-part");
});

test("it should expose default titleAs as p", () => {
  const { result } = renderUseEmptyState();

  expect(result.current.merged.titleAs).toBe("p");
});

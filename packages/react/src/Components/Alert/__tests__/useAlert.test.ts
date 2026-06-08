// ** External Imports
import { renderHook } from "@testing-library/react";
import { CircleX } from "lucide-react";
import { expect, test } from "vitest";

// ** Local Imports
import {
  useAlert,
  type AlertOwnProps,
  type AlertProps,
} from "@/Components/Alert";

const libDefaults = {
  shadow: "none",
  variant: "flat",
  rounded: "none",
  padding: "none",
  color: "primary",
} as const satisfies Partial<AlertOwnProps>;

function renderUseAlert(props: AlertProps = {}) {
  return renderHook(() =>
    useAlert(props, libDefaults as Parameters<typeof useAlert>[1]),
  );
}

test("it should return default color as primary", () => {
  const { result } = renderUseAlert();

  expect(result.current.merged.color).toBe("primary");
});

test("it should override color when prop is passed", () => {
  const { result } = renderUseAlert({ color: "error" });

  expect(result.current.merged.color).toBe("error");
});

test("it should resolve the default icon for a given color", () => {
  const { result } = renderUseAlert({ color: "error" });

  expect(result.current.resolvedIcon).toBe(CircleX);
});

test("it should suppress the icon when icon is null", () => {
  const { result } = renderUseAlert({ icon: null });

  expect(result.current.resolvedIcon).toBeNull();
});

test("it should compute rootBind className as a non-empty string", () => {
  const { result } = renderUseAlert({
    variant: "flat",
    color: "primary",
  });

  expect(typeof result.current.rootBind.className).toBe("string");
  expect(result.current.rootBind.className.length).toBeGreaterThan(0);
});

test("it should include shadow classes when shadow is set", () => {
  const { result } = renderUseAlert({ shadow: "sm" });

  expect(result.current.rootBind.className).toContain("shadow");
});

test("it should include rounded classes when rounded is set", () => {
  const { result } = renderUseAlert({ rounded: "md" });

  expect(result.current.rootBind.className).toContain("rounded");
});

test("it should compute title classes with font-normal when no body", () => {
  const { result } = renderUseAlert({ title: "Test" });

  expect(result.current.titleBind.className).toContain("font-normal");
});

test("it should compute title classes with font-semibold when body exists", () => {
  const { result } = renderUseAlert({
    title: "Test",
    children: "Body",
  });

  expect(result.current.hasDefaultBody).toBe(true);
  expect(result.current.titleBind.className).toContain("font-semibold");
});

test("it should expose children from props", () => {
  const { result } = renderUseAlert({ children: "Body text" });

  expect(result.current.children).toBe("Body text");
});

test("it should merge className into rootBind", () => {
  const { result } = renderUseAlert({ className: "custom-alert" });

  expect(result.current.rootBind.className).toContain("custom-alert");
});

test("it should expose inherited attrs on rootBind", () => {
  const { result } = renderUseAlert({
    id: "alert-root",
    "data-testid": "alert",
  });

  expect(result.current.rootBind.id).toBe("alert-root");
  expect(result.current.rootBind["data-testid"]).toBe("alert");
});

test("it should apply className after classes.root in rootBind", () => {
  const { result } = renderUseAlert({
    className: "p-4",
    classes: { root: "p-2" },
  });

  expect(result.current.rootBind.className).toContain("p-4");
  expect(result.current.rootBind.className).not.toContain("p-2");
});

test("it should forward partsProps.root onto rootBind", () => {
  const { result } = renderUseAlert({
    partsProps: { root: { id: "alert-root-part" } },
  });

  expect(result.current.rootBind.id).toBe("alert-root-part");
});

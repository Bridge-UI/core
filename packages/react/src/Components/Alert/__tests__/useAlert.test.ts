// ** External Imports
import { renderHook } from "@testing-library/react";
import { expect, test } from "vitest";

// ** Local Imports
import { useAlert, type AlertProps } from "@/Components/Alert";

const libDefaults: Partial<AlertProps> = {
  color: "primary",
  variant: "flat",
  shadow: "none",
  rounded: "none",
  padding: "none",
};

function renderUseAlert(props: AlertProps = {}) {
  return renderHook(() => useAlert(props, libDefaults));
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

  expect(result.current.resolvedIcon).not.toBeNull();
});

test("it should suppress the icon when icon is null", () => {
  const { result } = renderUseAlert({ icon: null });

  expect(result.current.resolvedIcon).toBeNull();
});

test("it should compute rootClasses as a non-empty string", () => {
  const { result } = renderUseAlert({
    variant: "flat",
    color: "primary",
  });

  expect(typeof result.current.rootClasses).toBe("string");
  expect(result.current.rootClasses.length).toBeGreaterThan(0);
});

test("it should include shadow classes when shadow is set", () => {
  const { result } = renderUseAlert({ shadow: "sm" });

  expect(result.current.rootClasses).toContain("shadow");
});

test("it should include rounded classes when rounded is set", () => {
  const { result } = renderUseAlert({ rounded: "md" });

  expect(result.current.rootClasses).toContain("rounded");
});

test("it should compute title classes with font-normal when no body", () => {
  const { result } = renderUseAlert({ title: "Test" });

  expect(result.current.titleClasses).toContain("font-normal");
});

test("it should compute title classes with font-semibold when body exists", () => {
  const { result } = renderUseAlert({
    title: "Test",
    children: "Body",
  });

  expect(result.current.hasDefaultBody).toBe(true);
  expect(result.current.titleClasses).toContain("font-semibold");
});

test("it should show title row when title prop is provided", () => {
  const { result } = renderUseAlert({ title: "Hello" });

  expect(result.current.showTitleRow).toBe(true);
});

test("it should hide title row when no title, icon, or icon slot", () => {
  const { result } = renderUseAlert({ icon: null });

  expect(result.current.showTitleRow).toBe(false);
});

test("it should expose children from props", () => {
  const { result } = renderUseAlert({ children: "Body text" });

  expect(result.current.children).toBe("Body text");
});

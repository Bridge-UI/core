// ** External Imports
import { renderHook } from "@testing-library/react";
import { Info } from "lucide-react";
import { expect, test } from "vitest";

// ** Local Imports
import {
  useMiniButton,
  type MiniButtonOwnProps,
  type MiniButtonProps,
} from "@/Components/MiniButton";

const libDefaults: Partial<MiniButtonOwnProps> = {
  as: "button",
  size: "md",
  color: "primary",
  variant: "flat",
  rounded: "none",
};

function renderUseMiniButton(props: MiniButtonProps = { icon: Info }) {
  return renderHook(() => useMiniButton(props, libDefaults));
}

test("it should default to button element", () => {
  const { result } = renderUseMiniButton();

  expect(result.current.tag).toBe("button");
  expect(result.current.isButton).toBe(true);
});

test("it should render as anchor when as is a", () => {
  const { result } = renderUseMiniButton({ as: "a", href: "#", icon: Info });

  expect(result.current.tag).toBe("a");
  expect(result.current.isAnchor).toBe(true);
});

test("it should be disabled when disabled prop is true", () => {
  const { result } = renderUseMiniButton({ icon: Info, disabled: true });

  expect(result.current.isDisabled).toBe(true);
});

test("it should be disabled when loading is true", () => {
  const { result } = renderUseMiniButton({ icon: Info, loading: true });

  expect(result.current.isDisabled).toBe(true);
  expect(result.current.showSpinner).toBe(true);
  expect(result.current.showIcon).toBe(false);
});

test("it should show icon when not loading", () => {
  const { result } = renderUseMiniButton();

  expect(result.current.showIcon).toBe(true);
});

test("it should show default content instead of icon when children are provided", () => {
  const { result } = renderUseMiniButton({
    children: <span>AB</span>,
  });

  expect(result.current.showDefault).toBe(true);
  expect(result.current.showIcon).toBe(false);
});

test("it should hide default content when loading", () => {
  const { result } = renderUseMiniButton({
    loading: true,
    children: <span>AB</span>,
  });

  expect(result.current.showDefault).toBe(false);
  expect(result.current.showSpinner).toBe(true);
});

test("it should prefer icon over children when both are provided", () => {
  const { result } = renderUseMiniButton({
    icon: Info,
    children: <span>AB</span>,
  });

  expect(result.current.showDefault).toBe(false);
  expect(result.current.showIcon).toBe(true);
});

test("it should compute rootClass as a non-empty string", () => {
  const { result } = renderUseMiniButton();

  expect(result.current.rootClass.length).toBeGreaterThan(0);
});

test("it should merge className into rootClass", () => {
  const { result } = renderUseMiniButton({
    icon: Info,
    className: "custom-mini",
  });

  expect(result.current.rootClass).toContain("custom-mini");
});

test("it should expose rootHtmlProps for additional attributes", () => {
  const { result } = renderUseMiniButton({
    icon: Info,
    id: "settings-btn",
    "data-testid": "mini-button",
  });

  expect(result.current.rootHtmlProps.id).toBe("settings-btn");
  expect(result.current.rootHtmlProps["data-testid"]).toBe("mini-button");
});

test("it should apply className after classes.root in rootClass", () => {
  const { result } = renderUseMiniButton({
    icon: Info,
    className: "p-4",
    classes: { root: "p-2" },
  });

  expect(result.current.rootClass).toContain("p-4");
  expect(result.current.rootClass).not.toContain("p-2");
});

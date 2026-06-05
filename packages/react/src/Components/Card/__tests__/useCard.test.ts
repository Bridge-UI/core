// ** External Imports
import { renderHook } from "@testing-library/react";
import { expect, test } from "vitest";

// ** Local Imports
import { useCard, type CardOwnProps, type CardProps } from "@/Components/Card";

const libDefaults = {
  shadow: "none",
  padding: "none",
  rounded: "none",
  variant: "elevated",
} as const satisfies Partial<CardOwnProps>;

function renderUseCard(props: CardProps = {}) {
  return renderHook(() =>
    useCard(props, libDefaults as Parameters<typeof useCard>[1]),
  );
}

test("it should return default variant as elevated", () => {
  const { result } = renderUseCard();

  expect(result.current.merged.variant).toBe("elevated");
});

test("it should override variant when prop is passed", () => {
  const { result } = renderUseCard({ variant: "outlined" });

  expect(result.current.merged.variant).toBe("outlined");
});

test("it should compute rootBind className as a non-empty string", () => {
  const { result } = renderUseCard();

  expect(typeof result.current.rootBind.className).toBe("string");
  expect(result.current.rootBind.className.length).toBeGreaterThan(0);
});

test("it should include shadow classes for elevated variant when shadow is set", () => {
  const { result } = renderUseCard({ shadow: "sm", variant: "elevated" });

  expect(result.current.rootBind.className).toContain("shadow");
});

test("it should omit shadow classes for non-elevated variants", () => {
  const { result } = renderUseCard({ shadow: "sm", variant: "flat" });

  expect(result.current.rootBind.className).not.toContain("shadow-sm");
});

test("it should include rounded classes when rounded is set", () => {
  const { result } = renderUseCard({ rounded: "md" });

  expect(result.current.rootBind.className).toContain("rounded");
});

test("it should include header border for elevated variant", () => {
  const { result } = renderUseCard({ title: "Test", variant: "elevated" });

  expect(result.current.headerBind.className).toContain("border-b");
});

test("it should omit header border for flat variant", () => {
  const { result } = renderUseCard({ title: "Test", variant: "flat" });

  expect(result.current.headerBind.className).not.toContain("border-b");
});

test("it should omit header border when borderless is true", () => {
  const { result } = renderUseCard({
    title: "Test",
    borderless: true,
    variant: "elevated",
  });

  expect(result.current.headerBind.className).not.toContain("border-b");
});

test("it should apply outlined border on root", () => {
  const { result } = renderUseCard({ variant: "outlined" });

  expect(result.current.rootBind.className).toContain("border");
});

test("it should set hasFooter when footer slot is provided", () => {
  const { result } = renderUseCard({
    slots: { footer: "Footer" },
  });

  expect(result.current.hasFooter).toBe(true);
});

test("it should expose children from props", () => {
  const { result } = renderUseCard({ children: "Body text" });

  expect(result.current.hasDefaultBody).toBe(true);
  expect(result.current.children).toBe("Body text");
});

test("it should merge className into rootBind", () => {
  const { result } = renderUseCard({ className: "custom-card" });

  expect(result.current.rootBind.className).toContain("custom-card");
});

test("it should expose inherited attrs on rootBind", () => {
  const { result } = renderUseCard({
    id: "card-root",
    "data-testid": "card",
  });

  expect(result.current.rootBind.id).toBe("card-root");
  expect(result.current.rootBind["data-testid"]).toBe("card");
});

test("it should apply className after classes.root in rootBind", () => {
  const { result } = renderUseCard({
    className: "p-4",
    classes: { root: "p-2" },
  });

  expect(result.current.rootBind.className).toContain("p-4");
  expect(result.current.rootBind.className).not.toContain("p-2");
});

test("it should forward partsProps.root onto rootBind", () => {
  const { result } = renderUseCard({
    partsProps: { root: { id: "card-root-part" } },
  });

  expect(result.current.rootBind.id).toBe("card-root-part");
});

// ** External Imports
import { renderHook } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";

// ** Local Imports
import { useMenu, type MenuOwnProps, type MenuProps } from "@/Components/Menu";
import { resetLayerStackForTests } from "@bridge-ui/core";

afterEach(() => {
  resetLayerStackForTests();
  document.body.innerHTML = "";
  document.body.style.overflow = "";
});

const libDefaults = {
  offset: 4,
  shadow: "md",
  rounded: "md",
  strategy: "fixed",
  teleportTo: "body",
  closeOnEscape: true,
  closeOnClickAway: true,
  disableScrollLock: true,
  placement: "bottom-start",
} as const satisfies Partial<MenuOwnProps>;

function renderUseMenu(
  props: MenuProps = {},
  options: Parameters<typeof useMenu>[2] = {},
) {
  return renderHook(() =>
    useMenu(props, libDefaults as Parameters<typeof useMenu>[1], options),
  );
}

test("it should return default placement as bottom-start", () => {
  const { result } = renderUseMenu();

  expect(result.current.merged.placement).toBe("bottom-start");
});

test("it should override placement when prop is passed", () => {
  const { result } = renderUseMenu({ placement: "top-end" });

  expect(result.current.merged.placement).toBe("top-end");
});

test("it should expose menu semantics on trigger and content binds", () => {
  const { result } = renderUseMenu(
    { slots: { trigger: <span>Open</span> } },
    { show: false },
  );

  expect(result.current.triggerBind["aria-haspopup"]).toBe("menu");
  expect(result.current.triggerBind["aria-expanded"]).toBe(false);
  expect(result.current.contentBind.role).toBe("menu");
});

test("it should reflect aria-expanded when show is true", () => {
  const { result } = renderUseMenu(
    { slots: { trigger: <span>Open</span> } },
    { show: true },
  );

  expect(result.current.triggerBind["aria-expanded"]).toBe(true);
  expect(result.current.mounted).toBe(true);
});

test("it should call onShowChange when trigger capture handler runs", () => {
  const onShowChange = vi.fn();

  const { result } = renderUseMenu(
    { slots: { trigger: <span>Open</span> } },
    { show: false, onShowChange },
  );

  result.current.triggerBind.onClickCapture?.({
    preventDefault() {},
    stopPropagation() {},
  } as React.MouseEvent<HTMLDivElement>);

  expect(onShowChange).toHaveBeenCalledWith(true);
});

test("it should call onShowChange on escape when show is true", () => {
  const onShowChange = vi.fn();

  renderUseMenu({ disableScrollLock: true }, { show: true, onShowChange });

  window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));

  expect(onShowChange).toHaveBeenCalledWith(false);
});

test("it should include rounded and shadow classes on content bind", () => {
  const { result } = renderUseMenu({ shadow: "sm", rounded: "lg" });

  expect(result.current.contentBind.className).toContain("rounded-lg");
  expect(result.current.contentBind.className).toContain("shadow-sm");
});

test("it should not lock body scroll by default", () => {
  renderUseMenu({}, { show: true });

  expect(document.body.style.overflow).not.toBe("hidden");
});

test("it should lock body scroll when disableScrollLock is false", () => {
  renderUseMenu({ disableScrollLock: false }, { show: true });

  expect(document.body.style.overflow).toBe("hidden");
});

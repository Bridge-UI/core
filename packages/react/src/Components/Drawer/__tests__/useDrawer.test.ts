// ** External Imports
import { renderHook } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";

// ** Local Imports
import {
  useDrawer,
  type DrawerOwnProps,
  type DrawerProps,
} from "@/Components/Drawer";
import { resetLayerStackForTests } from "@bridge-ui/core/Layer";

afterEach(() => {
  resetLayerStackForTests();
  document.body.style.overflow = "";
});

const libDefaults = {
  size: "md",
  blur: "none",
  scroll: "paper",
  autoFocus: false,
  placement: "left",
  teleportTo: "body",
  transition: "slide",
  closeOnEscape: true,
  closeOnOverlay: true,
} as const satisfies Partial<DrawerOwnProps>;

function renderUseDrawer(
  props: DrawerProps = {},
  options: Parameters<typeof useDrawer>[2] = {},
) {
  return renderHook(() =>
    useDrawer(props, libDefaults as Parameters<typeof useDrawer>[1], options),
  );
}

test("it should return default size as md", () => {
  const { result } = renderUseDrawer();

  expect(result.current.merged.size).toBe("md");
});

test("it should return default placement as left", () => {
  const { result } = renderUseDrawer();

  expect(result.current.merged.placement).toBe("left");
});

test("it should include horizontal width class on panel bind for left placement", () => {
  const { result } = renderUseDrawer({ size: "sm" });

  expect(result.current.panelBind.className).toContain("w-72");
});

test("it should include vertical height class on panel bind for bottom placement", () => {
  const { result } = renderUseDrawer({ size: "sm", placement: "bottom" });

  expect(result.current.panelBind.className).toContain("h-56");
});

test("it should call onShowChange when overlay is clicked", () => {
  const onShowChange = vi.fn();

  const { result } = renderUseDrawer(
    { transition: "none" },
    { show: true, onShowChange },
  );

  result.current.handleOverlayClick();

  expect(onShowChange).toHaveBeenCalledWith(false);
});

test("it should call onShowChange on escape keydown", () => {
  const onShowChange = vi.fn();

  renderUseDrawer({ transition: "none" }, { show: true, onShowChange });

  window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));

  expect(onShowChange).toHaveBeenCalledWith(false);
});

test("it should disable slide transition when prefers-reduced-motion is set", () => {
  vi.stubGlobal(
    "matchMedia",
    vi.fn().mockImplementation((query: string) => ({
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      matches: query.includes("reduce"),
    })),
  );

  const { result } = renderUseDrawer({ transition: "slide" });

  expect(result.current.overlayBind.className).not.toContain("duration-300");

  vi.unstubAllGlobals();
});

test("it should not call onShowChange when persistent", () => {
  const onShowChange = vi.fn();

  const { result } = renderUseDrawer(
    { persistent: true },
    { show: true, onShowChange },
  );

  result.current.handleOverlayClick();

  expect(onShowChange).not.toHaveBeenCalled();
});

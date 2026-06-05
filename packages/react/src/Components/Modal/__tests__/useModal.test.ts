// ** External Imports
import { renderHook } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";

// ** Local Imports
import {
  useModal,
  type ModalOwnProps,
  type ModalProps,
} from "@/Components/Modal";
import { resetModalStackForTests } from "@bridge-ui/core";

afterEach(() => {
  resetModalStackForTests();
  document.body.style.overflow = "";
});

const libDefaults = {
  size: "md",
  blur: "none",
  teleportTo: "body",
  transition: "fade",
  closeOnEscape: true,
  closeOnOverlay: true,
  align: "middle-center",
} as const satisfies Partial<ModalOwnProps>;

function renderUseModal(
  props: ModalProps = {},
  options: Parameters<typeof useModal>[2] = {},
) {
  return renderHook(() =>
    useModal(props, libDefaults as Parameters<typeof useModal>[1], options),
  );
}

test("it should return default size as md", () => {
  const { result } = renderUseModal();

  expect(result.current.merged.size).toBe("md");
});

test("it should include max width class on wrapper bind", () => {
  const { result } = renderUseModal({ size: "sm" });

  expect(result.current.wrapperBind.className).toContain("sm:max-w-sm");
});

test("it should call onShowChange when overlay is clicked", () => {
  const onShowChange = vi.fn();

  const { result } = renderUseModal(
    { transition: "none" },
    { show: true, onShowChange },
  );

  result.current.handleOverlayClick();

  expect(onShowChange).toHaveBeenCalledWith(false);
});

test("it should call onShowChange on escape keydown", () => {
  const onShowChange = vi.fn();

  renderUseModal({ transition: "none" }, { show: true, onShowChange });

  window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));

  expect(onShowChange).toHaveBeenCalledWith(false);
});

test("it should disable fade transition when prefers-reduced-motion is set", () => {
  vi.stubGlobal(
    "matchMedia",
    vi.fn().mockImplementation((query: string) => ({
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      matches: query.includes("reduce"),
    })),
  );

  const { result } = renderUseModal({ transition: "fade" });

  expect(result.current.overlayBind.className).not.toContain("duration-300");

  vi.unstubAllGlobals();
});

test("it should not call onShowChange when persistent", () => {
  const onShowChange = vi.fn();

  const { result } = renderUseModal(
    { persistent: true },
    { show: true, onShowChange },
  );

  result.current.handleOverlayClick();

  expect(onShowChange).not.toHaveBeenCalled();
});

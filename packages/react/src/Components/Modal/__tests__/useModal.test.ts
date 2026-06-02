// ** External Imports
import { renderHook } from "@testing-library/react";
import { expect, test, vi } from "vitest";

// ** Local Imports
import {
  useModal,
  type ModalOwnProps,
  type ModalProps,
} from "@/Components/Modal";

const libDefaults = {
  size: "md",
  teleportTo: "body",
  closeOnEscape: true,
  closeOnOverlay: true,
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

test("it should include max width class on panel bind", () => {
  const { result } = renderUseModal({ size: "sm" });

  expect(result.current.panelBind.className).toContain("max-w-sm");
});

test("it should call onShowChange when overlay is clicked", () => {
  const onShowChange = vi.fn();
  const { result } = renderUseModal({}, { show: true, onShowChange });

  result.current.handleOverlayClick();

  expect(onShowChange).toHaveBeenCalledWith(false);
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

// ** External Imports
import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";

// ** Core Imports
import { resetLayerStackForTests } from "@bridge-ui/core/Layer";

// ** Local Imports
import {
  useModal,
  type ModalOwnProps,
  type ModalProps,
} from "@/Components/Modal";

afterEach(() => {
  vi.unstubAllGlobals();
  resetLayerStackForTests();
  document.body.style.overflow = "";
});

function queueAnimationFrames() {
  const queue = new Map<number, FrameRequestCallback>();
  let nextId = 0;

  vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
    nextId += 1;
    queue.set(nextId, callback);

    return nextId;
  });

  vi.stubGlobal("cancelAnimationFrame", (id: number) => {
    queue.delete(id);
  });

  return () => {
    const pending = [...queue.values()];

    queue.clear();
    pending.forEach((callback) => {
      callback(0);
    });
  };
}

const libDefaults = {
  size: "md",
  blur: "none",
  autoFocus: false,
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

test("it should include max width class on panel bind", () => {
  const { result } = renderUseModal({ size: "sm" });

  expect(result.current.panelBind.className).toContain("sm:max-w-sm");
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

test("it should finish closing when transitionend never fires", async () => {
  const onShowChange = vi.fn();

  const { result } = renderUseModal(
    { transition: "fade" },
    { show: true, onShowChange },
  );

  act(() => {
    result.current.handleOverlayClick();
  });

  expect(onShowChange).not.toHaveBeenCalled();

  await waitFor(
    () => {
      expect(onShowChange).toHaveBeenCalledWith(false);
    },
    { timeout: 1000 },
  );
});

test("it should wait for the first paint before entering", () => {
  const flushFrame = queueAnimationFrames();

  const { result, unmount } = renderUseModal(
    { transition: "fade" },
    { show: true },
  );

  act(() => {
    flushFrame();
  });

  expect(result.current.overlayBind["data-state"]).toBe("closed");

  act(() => {
    flushFrame();
  });

  expect(result.current.overlayBind["data-state"]).toBe("open");

  unmount();
});

test("it should not reopen when closed before the enter frame fires", () => {
  const flushFrame = queueAnimationFrames();

  const { result, unmount } = renderUseModal(
    { transition: "fade" },
    { show: true },
  );

  act(() => {
    result.current.handleOverlayClick();
  });

  act(() => {
    flushFrame();
    flushFrame();
  });

  expect(result.current.overlayBind["data-state"]).toBe("closed");

  unmount();
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

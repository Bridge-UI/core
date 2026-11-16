// ** External Imports
import { act, renderHook } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";

// ** Core Imports
import { resetLayerStackForTests } from "@bridge-ui/core/Layer";

// ** Local Imports
import {
  usePopoverBase,
  type UsePopoverBaseOptions,
} from "@/Components/Popover/hooks/usePopoverBase";

afterEach(() => {
  resetLayerStackForTests();
  document.body.innerHTML = "";
  document.body.style.overflow = "";
});

function renderOverlay(options: Partial<UsePopoverBaseOptions> = {}) {
  const setShow = vi.fn();

  const hook = renderHook(
    (props: Partial<UsePopoverBaseOptions>) =>
      usePopoverBase({ setShow, show: false, id: "overlay", ...props }),
    { initialProps: options },
  );

  return { ...hook, setShow };
}

test("it should mount when shown and unmount when hidden", () => {
  const { result, rerender } = renderOverlay();

  expect(result.current.mounted).toBe(false);

  rerender({ show: true });
  expect(result.current.mounted).toBe(true);

  rerender({ show: false });
  expect(result.current.mounted).toBe(false);
});

test("it should stay mounted and hidden with keepMounted", () => {
  const { result, rerender } = renderOverlay({ keepMounted: true });

  rerender({ show: true, keepMounted: true });
  rerender({ show: false, keepMounted: true });

  expect(result.current.mounted).toBe(true);
  expect(result.current.isHiddenWhileMounted).toBe(true);
});

test("it should toggle and request close through setShow", () => {
  const { result, setShow, rerender } = renderOverlay();

  result.current.toggle();
  expect(setShow).toHaveBeenLastCalledWith(true);

  rerender({ show: true });
  result.current.requestClose();
  expect(setShow).toHaveBeenLastCalledWith(false);
});

test("it should ignore close requests when persistent", () => {
  const { result, setShow } = renderOverlay({ show: true, persistent: true });

  result.current.toggle();
  result.current.requestClose();

  expect(setShow).not.toHaveBeenCalled();
});

test("it should call onOpen each time it opens", () => {
  const onOpen = vi.fn();
  const { rerender } = renderOverlay({ onOpen });

  rerender({ onOpen, show: true });
  rerender({ onOpen, show: false });
  rerender({ onOpen, show: true });

  expect(onOpen).toHaveBeenCalledTimes(2);
});

test("it should not call onOpen again when keepMounted changes while open", () => {
  const onOpen = vi.fn();
  const { rerender } = renderOverlay({ onOpen });

  rerender({ onOpen, show: true });
  rerender({ onOpen, show: true, keepMounted: true });

  expect(onOpen).toHaveBeenCalledOnce();
});

test("it should release the claim when unmounted while open", async () => {
  const release = vi.fn();
  const claimOpen = vi.fn(() => release);
  const { unmount, rerender } = renderOverlay({ claimOpen });

  rerender({ claimOpen, show: true });

  await act(async () => {
    await Promise.resolve();
  });

  unmount();

  expect(release).toHaveBeenCalledOnce();
});

test("it should claim and release the open slot", async () => {
  const release = vi.fn();
  const claimOpen = vi.fn(() => release);
  const { rerender } = renderOverlay({ claimOpen });

  rerender({ claimOpen, show: true });

  await act(async () => {
    await Promise.resolve();
  });

  expect(claimOpen).toHaveBeenCalledWith(
    expect.objectContaining({ id: "overlay" }),
  );

  rerender({ claimOpen, show: false });

  expect(release).toHaveBeenCalledOnce();
});

test("it should close on Escape unless closeOnEscape is false", () => {
  const open = renderOverlay({ show: true });

  act(() => {
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
  });

  expect(open.setShow).toHaveBeenCalledWith(false);

  open.unmount();
  resetLayerStackForTests();

  const blocked = renderOverlay({ show: true, closeOnEscape: false });

  act(() => {
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
  });

  expect(blocked.setShow).not.toHaveBeenCalled();
});

test("it should lock body scroll unless disableScrollLock is set", () => {
  const locked = renderOverlay({ show: true });

  expect(document.body.style.overflow).toBe("hidden");

  locked.unmount();

  renderOverlay({ show: true, disableScrollLock: true });

  expect(document.body.style.overflow).not.toBe("hidden");
});

test("it should stack above overlays opened while it was hidden with keepMounted", () => {
  const first = renderOverlay({ keepMounted: true });

  first.rerender({ show: true, keepMounted: true });
  first.rerender({ show: false, keepMounted: true });

  const second = renderOverlay({ show: true });

  first.rerender({ show: true, keepMounted: true });

  expect(first.result.current.stackZIndex).toBeGreaterThan(
    second.result.current.stackZIndex,
  );
});

test("it should use the latest persistent value in the open claim", async () => {
  let claim: undefined | { requestClose: () => void };
  const claimOpen = vi.fn((next: { requestClose: () => void }) => {
    claim = next;

    return () => {};
  });
  const { setShow, rerender } = renderOverlay({ claimOpen });

  rerender({ claimOpen, show: true });

  await act(async () => {
    await Promise.resolve();
  });

  rerender({ claimOpen, show: true, persistent: true });

  claim?.requestClose();

  expect(setShow).not.toHaveBeenCalled();
});

test("it should request a close only once until show changes", () => {
  const { result, setShow } = renderOverlay({ show: true });

  result.current.requestClose();
  result.current.requestClose();

  expect(setShow).toHaveBeenCalledOnce();
});

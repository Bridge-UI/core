// ** External Imports
import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";

// ** Core Imports
import { resetLayerStackForTests } from "@bridge-ui/core";

// ** Local Imports
import {
  useSnackbar,
  type SnackbarOwnProps,
  type SnackbarProps,
} from "@/Components/Snackbar";

afterEach(() => {
  resetLayerStackForTests();
  document.body.innerHTML = "";
  document.body.style.overflow = "";
});

const libDefaults = {
  duration: 5000,
  color: "primary",
  padding: "medium",
  closeButton: true,
  progressbar: true,
  teleportTo: "body",
  transition: "slide",
  position: "bottom-center",
} as const satisfies Partial<SnackbarOwnProps>;

function renderUseSnackbar(
  props: SnackbarProps = {},
  options: Parameters<typeof useSnackbar>[2] = {},
) {
  return renderHook(() =>
    useSnackbar(
      props,
      libDefaults as Parameters<typeof useSnackbar>[1],
      options,
    ),
  );
}

test("it should return default color as primary", async () => {
  const { result } = renderUseSnackbar(
    { duration: false, transition: "none" },
    { show: true },
  );

  await waitFor(() => {
    expect(result.current.rendered).toBe(true);
  });

  expect(result.current.merged.color).toBe("primary");
});

test("it should include bottom-center position class on portal bind", async () => {
  const { result } = renderUseSnackbar(
    { duration: false, transition: "none" },
    { show: true },
  );

  await waitFor(() => {
    expect(result.current.portalBind.className).toContain("items-end");
    expect(result.current.portalBind.className).toContain("justify-center");
  });
});

test("it should include top-center position class when position is top-center", async () => {
  const { result } = renderUseSnackbar(
    { duration: false, transition: "none", position: "top-center" },
    { show: true },
  );

  await waitFor(() => {
    expect(result.current.portalBind.className).toContain("items-start");
  });
});

test("it should call onShowChange when requestClose is invoked", async () => {
  const onShowChange = vi.fn();

  const { result } = renderUseSnackbar(
    { duration: false, transition: "none" },
    { show: true, onShowChange },
  );

  await waitFor(() => {
    expect(result.current.rendered).toBe(true);
  });

  act(() => {
    result.current.requestClose();
  });

  expect(onShowChange).toHaveBeenCalledWith(false);
});

test("it should call onClose when requestClose is invoked", async () => {
  const onClose = vi.fn();

  const { result } = renderUseSnackbar(
    { duration: false, transition: "none" },
    { onClose, show: true },
  );

  await waitFor(() => {
    expect(result.current.rendered).toBe(true);
  });

  act(() => {
    result.current.requestClose();
  });

  expect(onClose).toHaveBeenCalledOnce();
});

test("it should call onShowChange on escape keydown", async () => {
  const onShowChange = vi.fn();

  const { result } = renderUseSnackbar(
    { duration: false, transition: "none" },
    { show: true, onShowChange },
  );

  await waitFor(() => {
    expect(result.current.rendered).toBe(true);
  });

  act(() => {
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
  });

  expect(onShowChange).toHaveBeenCalledWith(false);
});

test("it should include motion-reduce fallback on slide transition", async () => {
  const { result } = renderUseSnackbar(
    { duration: false, transition: "slide" },
    { show: true },
  );

  await waitFor(() => {
    expect(result.current.rendered).toBe(true);
  });

  expect(result.current.panelBind.className).toContain(
    "motion-reduce:transition-none",
  );
});

test("it should resolve default icon from color", async () => {
  const { result } = renderUseSnackbar(
    { duration: false, color: "success", transition: "none" },
    { show: true },
  );

  await waitFor(() => {
    expect(result.current.resolvedIcon).toBeTruthy();
  });
});

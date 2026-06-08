// ** External Imports
import { act, render, waitFor } from "@testing-library/react";
import { isString } from "es-toolkit/compat";
import { useEffect } from "react";
import { afterEach, expect, test, vi } from "vitest";

// ** Core Imports
import { resetLayerStackForTests } from "@bridge-ui/core";

// ** Local Imports
import {
  BridgeSnackbarHost,
  BridgeSnackbarHostMissingError,
  useSnackbarAction,
} from "@/Actions/Snackbar";
afterEach(() => {
  vi.useRealTimers();
  resetLayerStackForTests();
  document.body.innerHTML = "";
  document.body.style.overflow = "";
});

function RunOnMount({
  onMount,
}: {
  onMount: (snackbar: ReturnType<typeof useSnackbarAction>) => void;
}) {
  const snackbar = useSnackbarAction();

  useEffect(() => {
    void Promise.resolve(onMount(snackbar));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- imperative setup once on mount
  }, []);

  return null;
}

test("useSnackbarAction should throw when BridgeSnackbarHost is missing", () => {
  function BadConsumer() {
    useSnackbarAction();

    return null;
  }

  expect(() => render(<BadConsumer />)).toThrow(BridgeSnackbarHostMissingError);
});

test("open should return an id and render snackbar content", async () => {
  render(
    <BridgeSnackbarHost>
      <RunOnMount
        onMount={(snackbar) => {
          snackbar.open({
            title: "Saved",
            duration: false,
            transition: "none",
            description: "Changes stored",
          });
        }}
      />
    </BridgeSnackbarHost>,
  );

  await waitFor(() => {
    expect(document.body.textContent).toContain("Saved");
    expect(document.body.textContent).toContain("Changes stored");
  });
});

test("close should dismiss a snackbar", async () => {
  render(
    <BridgeSnackbarHost>
      <RunOnMount
        onMount={(snackbar) => {
          const id = snackbar.open({
            duration: false,
            transition: "none",
            title: "Dismiss me",
          });

          snackbar.close(id);
        }}
      />
    </BridgeSnackbarHost>,
  );

  await waitFor(() => {
    expect(document.body.textContent).not.toContain("Dismiss me");
  });
});

test("closeAll should dismiss every snackbar", async () => {
  let api!: ReturnType<typeof useSnackbarAction>;

  render(
    <BridgeSnackbarHost>
      <RunOnMount
        onMount={(snackbar) => {
          api = snackbar;
          snackbar.open({
            title: "One",
            duration: false,
            transition: "none",
          });
          snackbar.open({
            title: "Two",
            duration: false,
            transition: "none",
          });
        }}
      />
    </BridgeSnackbarHost>,
  );

  await waitFor(() => {
    expect(document.body.textContent).toContain("One");
    expect(document.body.textContent).toContain("Two");
  });

  await act(async () => {
    api.closeAll();
  });

  await waitFor(() => {
    expect(document.body.textContent).not.toContain("One");
    expect(document.body.textContent).not.toContain("Two");
  });
});

test("accept action should use the snackbar color, not primary", async () => {
  render(
    <BridgeSnackbarHost>
      <RunOnMount
        onMount={(snackbar) => {
          snackbar.open({
            title: "Saved",
            duration: false,
            color: "success",
            transition: "none",
            actions: { accept: { label: "Undo" } },
          });
        }}
      />
    </BridgeSnackbarHost>,
  );

  await waitFor(() => {
    const action = document.body.querySelector("button");

    expect(action).toBeTruthy();
    expect(action?.className).toContain("text-success-600");
    expect(action?.className).not.toContain("text-primary-600");
  });
});

test("top-center should grow downward with newest below oldest", async () => {
  render(
    <BridgeSnackbarHost position="top-center">
      <RunOnMount
        onMount={(snackbar) => {
          snackbar.open({
            title: "Older",
            duration: false,
            transition: "none",
          });
          snackbar.open({
            title: "Newer",
            duration: false,
            transition: "none",
          });
        }}
      />
    </BridgeSnackbarHost>,
  );

  await waitFor(() => {
    const host = document.body.querySelector("[data-snackbar-host]");
    const panels = host?.querySelectorAll('[data-snackbar-part="panel"]');

    expect(host?.className).toContain("items-start");
    expect(panels?.length).toBe(2);
    expect(panels?.[0]?.textContent).toContain("Older");
    expect(panels?.[1]?.textContent).toContain("Newer");
    expect(host?.querySelector(".flex-col")).toBeTruthy();
    expect(host?.querySelector(".flex-col-reverse")).toBeFalsy();
  });
});

test("bottom-center should stack upward from the viewport edge", async () => {
  render(
    <BridgeSnackbarHost position="bottom-center">
      <RunOnMount
        onMount={(snackbar) => {
          snackbar.open({
            title: "Older",
            duration: false,
            transition: "none",
          });
          snackbar.open({
            title: "Newer",
            duration: false,
            transition: "none",
          });
        }}
      />
    </BridgeSnackbarHost>,
  );

  await waitFor(() => {
    const host = document.body.querySelector("[data-snackbar-host]");
    const panels = host?.querySelectorAll('[data-snackbar-part="panel"]');

    expect(host?.className).toContain("items-end");
    expect(panels?.length).toBe(2);
    expect(host?.querySelector(".flex-col-reverse")).toBeTruthy();
    expect(host?.querySelector(".flex-col")).toBeFalsy();
    expect(panels?.[0]?.textContent).toContain("Older");
    expect(panels?.[1]?.textContent).toContain("Newer");
  });
});

test("imperative snackbars should stack in a single notification column", async () => {
  render(
    <BridgeSnackbarHost>
      <RunOnMount
        onMount={(snackbar) => {
          snackbar.open({
            title: "One",
            duration: false,
            transition: "none",
          });
          snackbar.open({
            title: "Two",
            duration: false,
            transition: "none",
          });
        }}
      />
    </BridgeSnackbarHost>,
  );

  await waitFor(() => {
    const host = document.body.querySelector("[data-snackbar-host]");
    const panels = host?.querySelectorAll('[data-snackbar-part="panel"]');

    expect(host).toBeTruthy();
    expect(panels?.length).toBe(2);
    expect(document.body.querySelectorAll("[data-snackbar-layer]").length).toBe(
      0,
    );
  });
});

test("host snackbar defaults should merge into open options", async () => {
  render(
    <BridgeSnackbarHost
      snackbar={{ dense: true, classes: { root: "host-shell" } }}
    >
      <RunOnMount
        onMount={(snackbar) => {
          snackbar.open({
            duration: false,
            transition: "none",
            title: "Dense default",
          });
        }}
      />
    </BridgeSnackbarHost>,
  );

  await waitFor(() => {
    const snackbar = document.body.querySelector(
      '[data-snackbar-part="panel"]',
    );

    expect(snackbar?.className).toContain("host-shell");
  });
});

test("host timeout should auto-dismiss snackbars", async () => {
  render(
    <BridgeSnackbarHost timeout={50}>
      <RunOnMount
        onMount={(snackbar) => {
          snackbar.open({
            title: "Timed out",
            transition: "none",
          });
        }}
      />
    </BridgeSnackbarHost>,
  );

  await waitFor(() => {
    expect(document.body.textContent).toContain("Timed out");
  });

  await waitFor(
    () => {
      expect(document.body.textContent).not.toContain("Timed out");
    },
    { timeout: 500 },
  );
});

test("open duration should override host timeout", async () => {
  render(
    <BridgeSnackbarHost timeout={50}>
      <RunOnMount
        onMount={(snackbar) => {
          snackbar.open({
            duration: false,
            transition: "none",
            title: "Persistent",
          });
        }}
      />
    </BridgeSnackbarHost>,
  );

  await waitFor(() => {
    expect(document.body.textContent).toContain("Persistent");
  });

  await new Promise((resolve) => setTimeout(resolve, 150));

  expect(document.body.textContent).toContain("Persistent");
});

test("isOpen and stackSize should reflect mounted entries", async () => {
  let api!: ReturnType<typeof useSnackbarAction>;
  let id = "";

  render(
    <BridgeSnackbarHost>
      <RunOnMount
        onMount={(snackbar) => {
          api = snackbar;
          id = snackbar.open({
            duration: false,
            title: "Tracked",
            transition: "none",
          });
        }}
      />
    </BridgeSnackbarHost>,
  );

  await waitFor(() => {
    expect(document.body.textContent).toContain("Tracked");
  });

  expect(isString(id)).toBe(true);
  expect(api.isOpen(id)).toBe(true);
  expect(api.stackSize).toBe(1);

  act(() => {
    api.close(id);
  });

  await waitFor(() => {
    expect(document.body.textContent).not.toContain("Tracked");
  });

  expect(api.isOpen(id)).toBe(false);
  expect(api.stackSize).toBe(0);
});

test("closeTop should close only the topmost snackbar", async () => {
  let api!: ReturnType<typeof useSnackbarAction>;
  let firstId = "";
  let secondId = "";

  render(
    <BridgeSnackbarHost>
      <RunOnMount
        onMount={(snackbar) => {
          api = snackbar;
          firstId = snackbar.open({
            title: "First",
            duration: false,
            transition: "none",
          });
          secondId = snackbar.open({
            title: "Second",
            duration: false,
            transition: "none",
          });
        }}
      />
    </BridgeSnackbarHost>,
  );

  await waitFor(() => {
    expect(document.body.textContent).toContain("First");
    expect(document.body.textContent).toContain("Second");
  });

  act(() => {
    api.closeTop();
  });

  await waitFor(() => {
    expect(document.body.textContent).not.toContain("Second");
    expect(document.body.textContent).toContain("First");
  });

  expect(api.isOpen(secondId)).toBe(false);
  expect(api.isOpen(firstId)).toBe(true);
  expect(api.stackSize).toBe(1);
});

test("onClose should run before onClosed when close is called", async () => {
  const onClose = vi.fn();
  const onClosed = vi.fn();
  let api!: ReturnType<typeof useSnackbarAction>;
  let id = "";

  render(
    <BridgeSnackbarHost>
      <RunOnMount
        onMount={(snackbar) => {
          api = snackbar;
          id = snackbar.open({
            onClose,
            onClosed,
            duration: false,
            title: "Lifecycle",
            transition: "none",
          });
        }}
      />
    </BridgeSnackbarHost>,
  );

  await waitFor(() => {
    expect(document.body.textContent).toContain("Lifecycle");
  });

  act(() => {
    api.close(id);
  });

  expect(onClose).toHaveBeenCalledOnce();
  expect(onClose.mock.invocationCallOrder[0]).toBeLessThan(
    onClosed.mock.invocationCallOrder[0] ?? Number.MAX_SAFE_INTEGER,
  );

  await waitFor(() => {
    expect(onClosed).toHaveBeenCalledOnce();
  });
});

test("update should patch props on an open snackbar", async () => {
  render(
    <BridgeSnackbarHost>
      <RunOnMount
        onMount={(snackbar) => {
          const openedId = snackbar.open({
            title: "Before",
            duration: false,
            transition: "none",
          });

          snackbar.update(openedId, { props: { title: "After" } });
        }}
      />
    </BridgeSnackbarHost>,
  );

  await waitFor(() => {
    expect(document.body.textContent).toContain("After");
    expect(document.body.textContent).not.toContain("Before");
  });
});

test("nested BridgeSnackbarHost should warn in development", () => {
  const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

  render(
    <BridgeSnackbarHost>
      <BridgeSnackbarHost>
        <span>nested</span>
      </BridgeSnackbarHost>
    </BridgeSnackbarHost>,
  );

  expect(warn).toHaveBeenCalledWith(
    "[Bridge UI] Nested <BridgeSnackbarHost /> detected. useSnackbarAction() will target the nearest host only. Remove the extra host.",
  );

  warn.mockRestore();
});

test("max should close the oldest snackbar when the limit is exceeded", async () => {
  render(
    <BridgeSnackbarHost max={2}>
      <RunOnMount
        onMount={(snackbar) => {
          snackbar.open({
            title: "One",
            duration: false,
            transition: "none",
          });
          snackbar.open({
            title: "Two",
            duration: false,
            transition: "none",
          });
          snackbar.open({
            title: "Three",
            duration: false,
            transition: "none",
          });
        }}
      />
    </BridgeSnackbarHost>,
  );

  await waitFor(() => {
    expect(document.body.textContent).not.toContain("One");
    expect(document.body.textContent).toContain("Two");
    expect(document.body.textContent).toContain("Three");
  });
});

// ** External Imports
import { act, render, waitFor } from "@testing-library/react";
import { useEffect } from "react";
import { afterEach, expect, test, vi } from "vitest";

// ** Core Imports
import { resetLayerStackForTests } from "@bridge-ui/core";

// ** Local Imports
import {
  BridgeSnackbarHost,
  BridgeSnackbarHostMissingError,
  useBridgeSnackbar,
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
  onMount: (snackbar: ReturnType<typeof useBridgeSnackbar>) => void;
}) {
  const snackbar = useBridgeSnackbar();

  useEffect(() => {
    onMount(snackbar);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- imperative setup once on mount
  }, []);

  return null;
}

test("useBridgeSnackbar should throw when BridgeSnackbarHost is missing", () => {
  function BadConsumer() {
    useBridgeSnackbar();

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
            description: "Changes stored",
            transition: "none",
            duration: false,
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
            title: "Dismiss me",
            transition: "none",
            duration: false,
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
  render(
    <BridgeSnackbarHost>
      <RunOnMount
        onMount={(snackbar) => {
          snackbar.open({
            title: "One",
            transition: "none",
            duration: false,
          });
          snackbar.open({
            title: "Two",
            transition: "none",
            duration: false,
          });

          act(() => {
            snackbar.closeAll();
          });
        }}
      />
    </BridgeSnackbarHost>,
  );

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
            color: "success",
            transition: "none",
            duration: false,
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

test("imperative snackbars should stack with increasing z-index", async () => {
  render(
    <BridgeSnackbarHost>
      <RunOnMount
        onMount={(snackbar) => {
          snackbar.open({
            title: "One",
            transition: "none",
            duration: false,
          });
          snackbar.open({
            title: "Two",
            transition: "none",
            duration: false,
          });
        }}
      />
    </BridgeSnackbarHost>,
  );

  await waitFor(() => {
    const layers = document.body.querySelectorAll("[data-snackbar-layer]");

    expect(layers.length).toBe(2);

    const firstZ = Number((layers[0] as HTMLElement).style.zIndex);
    const secondZ = Number((layers[1] as HTMLElement).style.zIndex);

    expect(secondZ).toBeGreaterThan(firstZ);
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
            title: "Dense default",
            transition: "none",
            duration: false,
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
            title: "Persistent",
            transition: "none",
            duration: false,
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

test("max should close the oldest snackbar when the limit is exceeded", async () => {
  render(
    <BridgeSnackbarHost max={2}>
      <RunOnMount
        onMount={(snackbar) => {
          snackbar.open({
            title: "One",
            transition: "none",
            duration: false,
          });
          snackbar.open({
            title: "Two",
            transition: "none",
            duration: false,
          });
          snackbar.open({
            title: "Three",
            transition: "none",
            duration: false,
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

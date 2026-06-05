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
    onMount(snackbar);
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

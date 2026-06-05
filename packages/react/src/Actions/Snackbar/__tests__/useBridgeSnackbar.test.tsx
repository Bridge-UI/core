// ** External Imports
import { act, render, waitFor } from "@testing-library/react";
import { useEffect } from "react";
import { afterEach, expect, test } from "vitest";

// ** Local Imports
import {
  BridgeSnackbarHost,
  BridgeSnackbarHostMissingError,
  useBridgeSnackbar,
} from "@/Actions/Snackbar";
afterEach(() => {
  document.body.innerHTML = "";
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

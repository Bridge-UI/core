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
import { BridgeUIProvider } from "@/Provider";

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

test("useBridgeSnackbar should throw when BridgeUIProvider is missing", () => {
  function BadConsumer() {
    useBridgeSnackbar();

    return null;
  }

  expect(() => render(<BadConsumer />)).toThrow(BridgeSnackbarHostMissingError);
});

test("open should return an id and render snackbar content", async () => {
  render(
    <BridgeUIProvider>
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
    </BridgeUIProvider>,
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
    <BridgeUIProvider>
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
    </BridgeUIProvider>,
  );

  await waitFor(() => {
    expect(document.body.textContent).not.toContain("One");
    expect(document.body.textContent).not.toContain("Two");
  });
});

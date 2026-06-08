// ** External Imports
import { fireEvent, render, waitFor } from "@testing-library/react";
import { useEffect } from "react";
import { afterEach, expect, test, vi } from "vitest";

// ** Local Imports
import {
  BridgeDialogHost,
  BridgeDialogHostMissingError,
  useDialogAction,
} from "@/Actions/Dialog";
import { resetLayerStackForTests } from "@bridge-ui/core";

afterEach(() => {
  resetLayerStackForTests();
  document.body.innerHTML = "";
  document.body.style.overflow = "";
});

function RunOnMount({
  onMount,
}: {
  onMount: (dialog: ReturnType<typeof useDialogAction>) => void;
}) {
  const dialog = useDialogAction();

  useEffect(() => {
    onMount(dialog);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- imperative setup once on mount
  }, []);

  return null;
}

test("it should throw when BridgeDialogHost is missing", () => {
  function BadConsumer() {
    useDialogAction();

    return null;
  }

  expect(() => render(<BadConsumer />)).toThrow(BridgeDialogHostMissingError);
});

test("it should render title and description", async () => {
  render(
    <BridgeDialogHost>
      <RunOnMount
        onMount={(dialog) => {
          dialog.open({
            title: "Delete item?",
            modal: { transition: "none" },
            description: "This cannot be undone.",
          });
        }}
      />
    </BridgeDialogHost>,
  );

  await waitFor(() => {
    expect(document.body.textContent).toContain("Delete item?");
    expect(document.body.textContent).toContain("This cannot be undone.");
  });
});

test("it should render footer buttons and dismiss on accept", async () => {
  const onAccept = vi.fn();

  render(
    <BridgeDialogHost>
      <RunOnMount
        onMount={(dialog) => {
          dialog.open({
            title: "Confirm",
            modal: { transition: "none" },
            actions: {
              reject: { label: "Cancel" },
              accept: { label: "Delete", onClick: onAccept },
            },
          });
        }}
      />
    </BridgeDialogHost>,
  );

  await waitFor(() => {
    expect(document.body.textContent).toContain("Cancel");
    expect(document.body.textContent).toContain("Delete");
  });

  fireEvent.click(
    Array.from(document.body.querySelectorAll("button")).find((button) =>
      button.textContent?.includes("Delete"),
    )!,
  );

  expect(onAccept).toHaveBeenCalledTimes(1);

  await waitFor(() => {
    expect(document.body.textContent).not.toContain("Confirm");
  });
});

test("it should dismiss a dialog", async () => {
  render(
    <BridgeDialogHost>
      <RunOnMount
        onMount={(dialog) => {
          const id = dialog.open({
            title: "Dismiss me",
            modal: { transition: "none" },
          });

          dialog.close(id);
        }}
      />
    </BridgeDialogHost>,
  );

  await waitFor(() => {
    expect(document.body.textContent).not.toContain("Dismiss me");
  });
});

test("it should merge into open options", async () => {
  render(
    <BridgeDialogHost modal={{ size: "sm", transition: "none" }}>
      <RunOnMount
        onMount={(dialog) => {
          dialog.open({
            title: "Small dialog",
          });
        }}
      />
    </BridgeDialogHost>,
  );

  await waitFor(() => {
    const panel = document.body.querySelector('[data-modal-part="panel"]');

    expect(panel?.className).toContain("sm:max-w-sm");
  });
});

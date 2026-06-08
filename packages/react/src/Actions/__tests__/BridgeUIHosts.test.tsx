// ** External Imports
import { render, waitFor } from "@testing-library/react";
import { useEffect } from "react";
import { afterEach, expect, test } from "vitest";

// ** Local Imports
import { BridgeUIHosts } from "@/Actions/BridgeUIHosts";
import { useDialogAction } from "@/Actions/Dialog";
import { useModalAction } from "@/Actions/Modal";
import { useSnackbarAction } from "@/Actions/Snackbar";
import { resetLayerStackForTests } from "@bridge-ui/core";

afterEach(() => {
  resetLayerStackForTests();
  document.body.innerHTML = "";
});

function Content() {
  return <p className="bridge-modal-body">Modal</p>;
}

function OpenAllOnMount() {
  const modal = useModalAction();
  const dialog = useDialogAction();
  const snackbar = useSnackbarAction();

  useEffect(() => {
    modal.open({ component: Content, modal: { transition: "none" } });

    dialog.open({
      title: "Confirm",
      description: "Are you sure?",
      modal: { transition: "none" },
    });

    snackbar.open({
      title: "Toast",
      duration: false,
      transition: "none",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- imperative setup once on mount
  }, []);

  return null;
}

test("it should mount modal, dialog, and snackbar imperatives", async () => {
  render(
    <BridgeUIHosts>
      <OpenAllOnMount />
    </BridgeUIHosts>,
  );

  await waitFor(() => {
    expect(document.body.textContent).toContain("Modal");
    expect(document.body.textContent).toContain("Confirm");
    expect(document.body.textContent).toContain("Are you sure?");
    expect(document.body.textContent).toContain("Toast");
  });
});

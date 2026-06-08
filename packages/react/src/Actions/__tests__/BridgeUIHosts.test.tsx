// ** External Imports
import { render, waitFor } from "@testing-library/react";
import { useEffect } from "react";
import { afterEach, expect, test } from "vitest";

// ** Local Imports
import { BridgeUIHosts } from "@/Actions/BridgeUIHosts";
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

function OpenBothOnMount() {
  const modal = useModalAction();
  const snackbar = useSnackbarAction();

  useEffect(() => {
    modal.open({ component: Content, modal: { transition: "none" } });

    snackbar.open({
      title: "Toast",
      duration: false,
      transition: "none",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- imperative setup once on mount
  }, []);

  return null;
}

test("BridgeUIHosts should mount modal and snackbar imperatives", async () => {
  render(
    <BridgeUIHosts>
      <OpenBothOnMount />
    </BridgeUIHosts>,
  );

  await waitFor(() => {
    expect(document.body.textContent).toContain("Modal");
    expect(document.body.textContent).toContain("Toast");
  });
});

// ** External Imports
import { render, waitFor } from "@testing-library/react";
import { useEffect } from "react";
import { afterEach, expect, test } from "vitest";

// ** Local Imports
import { BridgeModalHostMissingError, useBridgeModal } from "@/Actions/Modal";
import { BridgeUIProvider } from "@/Provider";
import { resetModalStackForTests } from "@bridge-ui/core";

afterEach(() => {
  resetModalStackForTests();
  document.body.innerHTML = "";
  document.body.style.overflow = "";
});

function Content() {
  return <p className="bridge-modal-body">Imperative</p>;
}

function OpenOnMount() {
  const modal = useBridgeModal();

  useEffect(() => {
    modal.open({ component: Content });
  }, []);

  return null;
}

function OpenAndCloseOnMount() {
  const modal = useBridgeModal();

  useEffect(() => {
    const id = modal.open({ component: Content });

    modal.close(id);
  }, []);

  return null;
}

function OpenWithRef({
  onOpen,
}: {
  onOpen: (api: ReturnType<typeof useBridgeModal>, id: string) => void;
}) {
  const modal = useBridgeModal();

  useEffect(() => {
    const id = modal.open({ component: Content });

    onOpen(modal, id);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once on mount
  }, []);

  return null;
}

test("useBridgeModal should throw when BridgeUIProvider is missing", () => {
  function BadConsumer() {
    useBridgeModal();

    return null;
  }

  expect(() => render(<BadConsumer />)).toThrow(BridgeModalHostMissingError);
});

test("open should return an id and render modal content", async () => {
  render(
    <BridgeUIProvider>
      <OpenOnMount />
    </BridgeUIProvider>,
  );

  await waitFor(() => {
    expect(document.body.querySelector(".bridge-modal-body")?.textContent).toBe(
      "Imperative",
    );
  });
});

test("close should unmount imperative modal", async () => {
  render(
    <BridgeUIProvider>
      <OpenAndCloseOnMount />
    </BridgeUIProvider>,
  );

  await waitFor(() => {
    expect(document.body.querySelector('[role="dialog"]')).toBeNull();
  });
});

test("isOpen and stackSize should reflect registry state", async () => {
  let api!: ReturnType<typeof useBridgeModal>;
  let id = "";

  render(
    <BridgeUIProvider>
      <OpenWithRef
        onOpen={(modal, openedId) => {
          api = modal;
          id = openedId;
        }}
      />
    </BridgeUIProvider>,
  );

  await waitFor(() => {
    expect(document.body.querySelector('[role="dialog"]')).not.toBeNull();
  });

  expect(typeof id).toBe("string");
  expect(api.isOpen(id)).toBe(true);
  expect(api.stackSize).toBe(1);
});

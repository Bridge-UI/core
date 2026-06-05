// ** External Imports
import { act, render, waitFor } from "@testing-library/react";
import { useEffect } from "react";
import { afterEach, expect, test, vi } from "vitest";

// ** Local Imports
import { BridgeModalHostMissingError, useBridgeModal } from "@/Actions/Modal";
import { BridgeUIProvider } from "@/Provider";
import {
  MODAL_STACK_BASE_Z_INDEX,
  resetModalStackForTests,
} from "@bridge-ui/core";

afterEach(() => {
  resetModalStackForTests();
  document.body.innerHTML = "";
  document.body.style.overflow = "";
});

function Content({ label = "Imperative" }: { label?: string }) {
  return <p className="bridge-modal-body">{label}</p>;
}

function OpenOnMount() {
  const modal = useBridgeModal();

  useEffect(() => {
    modal.open({ component: Content, modal: { transition: "none" } });
  }, []);

  return null;
}

function OpenAndCloseOnMount() {
  const modal = useBridgeModal();

  useEffect(() => {
    const id = modal.open({
      component: Content,
      modal: { transition: "none" },
    });

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
    const id = modal.open({
      component: Content,
      modal: { transition: "none" },
    });

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

test("isOpen and stackSize should reflect mounted entries", async () => {
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

  act(() => {
    api.close(id);
  });

  await waitFor(() => {
    expect(document.body.querySelector('[role="dialog"]')).toBeNull();
  });

  expect(api.isOpen(id)).toBe(false);
  expect(api.stackSize).toBe(0);
});

test("closeTop should close only the topmost imperative modal", async () => {
  let api!: ReturnType<typeof useBridgeModal>;
  let outerId = "";
  let innerId = "";

  function OpenTwo() {
    api = useBridgeModal();

    useEffect(() => {
      outerId = api.open({
        component: Content,
        modal: { transition: "none" },
        props: { label: "Outer" },
      });
      innerId = api.open({
        component: Content,
        modal: { transition: "none" },
        props: { label: "Inner" },
      });
    }, []);

    return null;
  }

  render(
    <BridgeUIProvider>
      <OpenTwo />
    </BridgeUIProvider>,
  );

  await waitFor(() => {
    expect(document.body.querySelectorAll('[role="dialog"]')).toHaveLength(2);
  });

  act(() => {
    api.closeTop();
  });

  await waitFor(() => {
    expect(document.body.querySelectorAll('[role="dialog"]')).toHaveLength(1);
  });

  expect(api.isOpen(innerId)).toBe(false);
  expect(api.isOpen(outerId)).toBe(true);
  expect(api.stackSize).toBe(1);
});

test("onClose should run before onClosed when close is called", async () => {
  const onClose = vi.fn();
  const onClosed = vi.fn();
  let api!: ReturnType<typeof useBridgeModal>;
  let id = "";

  function OpenWithCallbacks() {
    api = useBridgeModal();

    useEffect(() => {
      id = api.open({
        component: Content,
        modal: { transition: "none" },
        onClose,
        onClosed,
      });
    }, []);

    return null;
  }

  render(
    <BridgeUIProvider>
      <OpenWithCallbacks />
    </BridgeUIProvider>,
  );

  await waitFor(() => {
    expect(document.body.querySelector('[role="dialog"]')).not.toBeNull();
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

test("onClose should run before onClosed when escape is pressed", async () => {
  const onClose = vi.fn();
  const onClosed = vi.fn();

  function OpenWithCallbacks() {
    const modal = useBridgeModal();

    useEffect(() => {
      modal.open({
        component: Content,
        modal: { transition: "none" },
        onClose,
        onClosed,
      });
    }, []);

    return null;
  }

  render(
    <BridgeUIProvider>
      <OpenWithCallbacks />
    </BridgeUIProvider>,
  );

  await waitFor(() => {
    expect(document.body.querySelector('[role="dialog"]')).not.toBeNull();
  });

  act(() => {
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
  });

  expect(onClose).toHaveBeenCalledOnce();
  expect(onClose.mock.invocationCallOrder[0]).toBeLessThan(
    onClosed.mock.invocationCallOrder[0] ?? Number.MAX_SAFE_INTEGER,
  );

  await waitFor(() => {
    expect(onClosed).toHaveBeenCalledOnce();
  });
});

test("update should patch props on an open modal", async () => {
  let api!: ReturnType<typeof useBridgeModal>;
  let id = "";

  function OpenAndUpdate() {
    api = useBridgeModal();

    useEffect(() => {
      id = api.open({
        component: Content,
        modal: { transition: "none" },
        props: { label: "Before" },
      });
      api.update(id, { props: { label: "After" } });
    }, []);

    return null;
  }

  render(
    <BridgeUIProvider>
      <OpenAndUpdate />
    </BridgeUIProvider>,
  );

  await waitFor(() => {
    expect(document.body.querySelector(".bridge-modal-body")?.textContent).toBe(
      "After",
    );
  });
});

test("update should patch modal shell options on an open modal", async () => {
  let api!: ReturnType<typeof useBridgeModal>;
  let id = "";

  function OpenAndUpdateModal() {
    api = useBridgeModal();

    useEffect(() => {
      id = api.open({
        component: Content,
        modal: { transition: "none", size: "sm" },
      });
      api.update(id, { modal: { size: "lg" } });
    }, []);

    return null;
  }

  render(
    <BridgeUIProvider>
      <OpenAndUpdateModal />
    </BridgeUIProvider>,
  );

  await waitFor(() => {
    const wrapper = document.body.querySelector(".mx-auto.flex.min-h-full");

    expect(wrapper?.className).toContain("sm:max-w-lg");
  });
});

test("open with persistent modal should ignore escape", async () => {
  const onClose = vi.fn();

  function OpenPersistent() {
    const modal = useBridgeModal();

    useEffect(() => {
      modal.open({
        onClose,
        component: Content,
        modal: { transition: "none", persistent: true },
      });
    }, []);

    return null;
  }

  render(
    <BridgeUIProvider>
      <OpenPersistent />
    </BridgeUIProvider>,
  );

  await waitFor(() => {
    expect(document.body.querySelector('[role="dialog"]')).not.toBeNull();
  });

  act(() => {
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
  });

  expect(onClose).not.toHaveBeenCalled();
  expect(document.body.querySelector('[role="dialog"]')).not.toBeNull();
});

test("stacked imperative modals should use incremental z-index", async () => {
  function OpenTwo() {
    const modal = useBridgeModal();

    useEffect(() => {
      modal.open({
        component: Content,
        props: { label: "Outer" },
        modal: { transition: "none" },
      });
      modal.open({
        component: Content,
        props: { label: "Inner" },
        modal: { transition: "none" },
      });
    }, []);

    return null;
  }

  render(
    <BridgeUIProvider>
      <OpenTwo />
    </BridgeUIProvider>,
  );

  await waitFor(() => {
    const zIndexes = [
      ...document.body.querySelectorAll<HTMLElement>(
        ".fixed.inset-0.overflow-y-auto",
      ),
    ]
      .map((root) => Number(root.style.zIndex))
      .sort((left, right) => left - right);

    expect(zIndexes).toEqual([
      MODAL_STACK_BASE_Z_INDEX,
      MODAL_STACK_BASE_Z_INDEX + 1,
    ]);
  });
});

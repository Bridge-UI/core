// ** External Imports
import { act, render, waitFor } from "@testing-library/react";
import { isString } from "es-toolkit/compat";
import { useEffect } from "react";
import { afterEach, expect, test, vi } from "vitest";

// ** Local Imports
import {
  BridgeModalHost,
  BridgeModalHostMissingError,
  useModalAction,
} from "@/Actions/Modal";
import {
  LAYER_STACK_BASE_Z_INDEX,
  resetLayerStackForTests,
} from "@bridge-ui/core";

afterEach(() => {
  resetLayerStackForTests();
  document.body.innerHTML = "";
  document.body.style.overflow = "";
});

function Content({ label = "Imperative" }: { label?: string }) {
  return <p className="bridge-modal-body">{label}</p>;
}

function RunOnMount({
  onMount,
}: {
  onMount: (modal: ReturnType<typeof useModalAction>) => void;
}) {
  const modal = useModalAction();

  useEffect(() => {
    onMount(modal);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- imperative setup once on mount
  }, []);

  return null;
}

function OpenOnMount() {
  return (
    <RunOnMount
      onMount={(modal) => {
        modal.open({ component: Content, modal: { transition: "none" } });
      }}
    />
  );
}

function OpenAndCloseOnMount() {
  return (
    <RunOnMount
      onMount={(modal) => {
        const id = modal.open({
          component: Content,
          modal: { transition: "none" },
        });

        modal.close(id);
      }}
    />
  );
}

function OpenWithRef({
  onOpen,
}: {
  onOpen: (api: ReturnType<typeof useModalAction>, id: string) => void;
}) {
  const modal = useModalAction();

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

test("useModalAction should throw when BridgeModalHost is missing", () => {
  function BadConsumer() {
    useModalAction();

    return null;
  }

  expect(() => render(<BadConsumer />)).toThrow(BridgeModalHostMissingError);
});

test("open should return an id and render modal content", async () => {
  render(
    <BridgeModalHost>
      <OpenOnMount />
    </BridgeModalHost>,
  );

  await waitFor(() => {
    expect(document.body.querySelector(".bridge-modal-body")?.textContent).toBe(
      "Imperative",
    );
  });
});

test("close should unmount imperative modal", async () => {
  render(
    <BridgeModalHost>
      <OpenAndCloseOnMount />
    </BridgeModalHost>,
  );

  await waitFor(() => {
    expect(document.body.querySelector('[role="dialog"]')).toBeNull();
  });
});

test("isOpen and stackSize should reflect mounted entries", async () => {
  let api!: ReturnType<typeof useModalAction>;
  let id = "";

  render(
    <BridgeModalHost>
      <OpenWithRef
        onOpen={(modal, openedId) => {
          api = modal;
          id = openedId;
        }}
      />
    </BridgeModalHost>,
  );

  await waitFor(() => {
    expect(document.body.querySelector('[role="dialog"]')).not.toBeNull();
  });

  expect(isString(id)).toBe(true);
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
  let api!: ReturnType<typeof useModalAction>;
  let outerId = "";
  let innerId = "";

  render(
    <BridgeModalHost>
      <RunOnMount
        onMount={(modal) => {
          api = modal;
          outerId = modal.open({
            component: Content,
            props: { label: "Outer" },
            modal: { transition: "none" },
          });
          innerId = modal.open({
            component: Content,
            props: { label: "Inner" },
            modal: { transition: "none" },
          });
        }}
      />
    </BridgeModalHost>,
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
  let api!: ReturnType<typeof useModalAction>;
  let id = "";

  render(
    <BridgeModalHost>
      <RunOnMount
        onMount={(modal) => {
          api = modal;
          id = modal.open({
            onClose,
            onClosed,
            component: Content,
            modal: { transition: "none" },
          });
        }}
      />
    </BridgeModalHost>,
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

  render(
    <BridgeModalHost>
      <RunOnMount
        onMount={(modal) => {
          modal.open({
            onClose,
            onClosed,
            component: Content,
            modal: { transition: "none" },
          });
        }}
      />
    </BridgeModalHost>,
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
  render(
    <BridgeModalHost>
      <RunOnMount
        onMount={(modal) => {
          const openedId = modal.open({
            component: Content,
            props: { label: "Before" },
            modal: { transition: "none" },
          });

          modal.update(openedId, { props: { label: "After" } });
        }}
      />
    </BridgeModalHost>,
  );

  await waitFor(() => {
    expect(document.body.querySelector(".bridge-modal-body")?.textContent).toBe(
      "After",
    );
  });
});

test("update should patch modal shell options on an open modal", async () => {
  render(
    <BridgeModalHost>
      <RunOnMount
        onMount={(modal) => {
          const openedId = modal.open({
            component: Content,
            modal: { size: "sm", transition: "none" },
          });

          modal.update(openedId, { modal: { size: "lg" } });
        }}
      />
    </BridgeModalHost>,
  );

  await waitFor(() => {
    const panel = document.body.querySelector('[role="dialog"]');

    expect(panel?.className).toContain("sm:max-w-lg");
  });
});

test("open with persistent modal should ignore escape", async () => {
  const onClose = vi.fn();

  render(
    <BridgeModalHost>
      <RunOnMount
        onMount={(modal) => {
          modal.open({
            onClose,
            component: Content,
            modal: { persistent: true, transition: "none" },
          });
        }}
      />
    </BridgeModalHost>,
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
  render(
    <BridgeModalHost>
      <RunOnMount
        onMount={(modal) => {
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
        }}
      />
    </BridgeModalHost>,
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
      LAYER_STACK_BASE_Z_INDEX,
      LAYER_STACK_BASE_Z_INDEX + 1,
    ]);
  });
});

test("onClose should run before onClosed when the overlay is clicked", async () => {
  const onClose = vi.fn();
  const onClosed = vi.fn();
  let api!: ReturnType<typeof useModalAction>;
  let id = "";

  render(
    <BridgeModalHost>
      <RunOnMount
        onMount={(modal) => {
          api = modal;
          id = modal.open({
            onClose,
            onClosed,
            component: Content,
            modal: { transition: "none" },
          });
        }}
      />
    </BridgeModalHost>,
  );

  await waitFor(() => {
    expect(document.body.querySelector('[role="dialog"]')).not.toBeNull();
  });

  act(() => {
    document.body.querySelector<HTMLElement>('[aria-hidden="true"]')?.click();
  });

  expect(onClose).toHaveBeenCalledOnce();
  expect(onClose.mock.invocationCallOrder[0]).toBeLessThan(
    onClosed.mock.invocationCallOrder[0] ?? Number.MAX_SAFE_INTEGER,
  );

  await waitFor(() => {
    expect(onClosed).toHaveBeenCalledOnce();
  });

  expect(api.isOpen(id)).toBe(false);
});

test("modal shell options must not override host-controlled props", async () => {
  const onClose = vi.fn();

  render(
    <BridgeModalHost>
      <RunOnMount
        onMount={(modal) => {
          modal.open({
            onClose,
            component: Content,
            modal: {
              onClose: vi.fn(),
              transition: "none",
              onShowChange: vi.fn(),
            },
          });
        }}
      />
    </BridgeModalHost>,
  );

  await waitFor(() => {
    expect(document.body.querySelector('[role="dialog"]')).not.toBeNull();
  });

  act(() => {
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
  });

  expect(onClose).toHaveBeenCalledOnce();
});

test("nested BridgeModalHost should warn in development", () => {
  const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

  render(
    <BridgeModalHost>
      <BridgeModalHost>
        <span>nested</span>
      </BridgeModalHost>
    </BridgeModalHost>,
  );

  expect(warn).toHaveBeenCalledWith(
    "[Bridge UI] Nested <BridgeModalHost /> detected. useModalAction() will target the nearest host only. Remove the extra host.",
  );

  warn.mockRestore();
});

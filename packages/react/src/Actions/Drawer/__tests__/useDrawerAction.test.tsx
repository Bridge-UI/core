// ** External Imports
import { act, render, waitFor } from "@testing-library/react";
import { isString } from "es-toolkit/compat";
import { useEffect } from "react";
import { afterEach, expect, test, vi } from "vitest";

// ** Local Imports
import {
  BridgeDrawerHost,
  BridgeDrawerHostMissingError,
  useDrawerAction,
} from "@/Actions/Drawer";
import {
  LAYER_STACK_BASE_Z_INDEX,
  resetLayerStackForTests,
} from "@bridge-ui/core/Layer";

afterEach(() => {
  resetLayerStackForTests();
  document.body.innerHTML = "";
  document.body.style.overflow = "";
});

function Content({ label = "Imperative" }: { label?: string }) {
  return <p className="bridge-drawer-body">{label}</p>;
}

function RunOnMount({
  onMount,
}: {
  onMount: (drawer: ReturnType<typeof useDrawerAction>) => void;
}) {
  const drawer = useDrawerAction();

  useEffect(() => {
    onMount(drawer);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- imperative setup once on mount
  }, []);

  return null;
}

function OpenOnMount() {
  return (
    <RunOnMount
      onMount={(drawer) => {
        drawer.open({ component: Content, drawer: { transition: "none" } });
      }}
    />
  );
}

function OpenAndCloseOnMount() {
  return (
    <RunOnMount
      onMount={(drawer) => {
        const id = drawer.open({
          component: Content,
          drawer: { transition: "none" },
        });

        drawer.close(id);
      }}
    />
  );
}

function OpenWithRef({
  onOpen,
}: {
  onOpen: (api: ReturnType<typeof useDrawerAction>, id: string) => void;
}) {
  const drawer = useDrawerAction();

  useEffect(() => {
    const id = drawer.open({
      component: Content,
      drawer: { transition: "none" },
    });

    onOpen(drawer, id);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once on mount
  }, []);

  return null;
}

test("it should throw when BridgeDrawerHost is missing", () => {
  function BadConsumer() {
    useDrawerAction();

    return null;
  }

  expect(() => render(<BadConsumer />)).toThrow(BridgeDrawerHostMissingError);
});

test("it should return an id and render drawer content", async () => {
  render(
    <BridgeDrawerHost>
      <OpenOnMount />
    </BridgeDrawerHost>,
  );

  await waitFor(() => {
    expect(
      document.body.querySelector(".bridge-drawer-body")?.textContent,
    ).toBe("Imperative");
  });
});

test("it should unmount imperative drawer", async () => {
  render(
    <BridgeDrawerHost>
      <OpenAndCloseOnMount />
    </BridgeDrawerHost>,
  );

  await waitFor(() => {
    expect(document.body.querySelector('[role="dialog"]')).toBeNull();
  });
});

test("it should reflect mounted entries", async () => {
  let api!: ReturnType<typeof useDrawerAction>;
  let id = "";

  render(
    <BridgeDrawerHost>
      <OpenWithRef
        onOpen={(drawer, openedId) => {
          api = drawer;
          id = openedId;
        }}
      />
    </BridgeDrawerHost>,
  );

  await waitFor(() => {
    expect(document.body.querySelector('[role="dialog"]')).not.toBeNull();
  });

  expect(api.stackSize).toBe(1);
  expect(isString(id)).toBe(true);
  expect(api.isOpen(id)).toBe(true);

  act(() => {
    api.close(id);
  });

  await waitFor(() => {
    expect(document.body.querySelector('[role="dialog"]')).toBeNull();
  });

  expect(api.stackSize).toBe(0);
  expect(api.isOpen(id)).toBe(false);
});

test("it should close only the topmost imperative drawer", async () => {
  let api!: ReturnType<typeof useDrawerAction>;
  let outerId = "";
  let innerId = "";

  render(
    <BridgeDrawerHost>
      <RunOnMount
        onMount={(drawer) => {
          api = drawer;
          outerId = drawer.open({
            component: Content,
            props: { label: "Outer" },
            drawer: { transition: "none" },
          });
          innerId = drawer.open({
            component: Content,
            props: { label: "Inner" },
            drawer: { transition: "none" },
          });
        }}
      />
    </BridgeDrawerHost>,
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

  expect(api.stackSize).toBe(1);
  expect(api.isOpen(outerId)).toBe(true);
  expect(api.isOpen(innerId)).toBe(false);
});

test("it should run before onClosed when close is called", async () => {
  const onClose = vi.fn();
  const onClosed = vi.fn();
  let api!: ReturnType<typeof useDrawerAction>;
  let id = "";

  render(
    <BridgeDrawerHost>
      <RunOnMount
        onMount={(drawer) => {
          api = drawer;
          id = drawer.open({
            onClose,
            onClosed,
            component: Content,
            drawer: { transition: "none" },
          });
        }}
      />
    </BridgeDrawerHost>,
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

test("it should run before onClosed when escape is pressed", async () => {
  const onClose = vi.fn();
  const onClosed = vi.fn();

  render(
    <BridgeDrawerHost>
      <RunOnMount
        onMount={(drawer) => {
          drawer.open({
            onClose,
            onClosed,
            component: Content,
            drawer: { transition: "none" },
          });
        }}
      />
    </BridgeDrawerHost>,
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

test("it should patch props on an open drawer", async () => {
  render(
    <BridgeDrawerHost>
      <RunOnMount
        onMount={(drawer) => {
          const openedId = drawer.open({
            component: Content,
            props: { label: "Before" },
            drawer: { transition: "none" },
          });

          drawer.update(openedId, { props: { label: "After" } });
        }}
      />
    </BridgeDrawerHost>,
  );

  await waitFor(() => {
    expect(
      document.body.querySelector(".bridge-drawer-body")?.textContent,
    ).toBe("After");
  });
});

test("it should patch drawer shell options on an open drawer", async () => {
  render(
    <BridgeDrawerHost>
      <RunOnMount
        onMount={(drawer) => {
          const openedId = drawer.open({
            component: Content,
            drawer: { size: "sm", transition: "none" },
          });

          drawer.update(openedId, { drawer: { size: "lg" } });
        }}
      />
    </BridgeDrawerHost>,
  );

  await waitFor(() => {
    const panel = document.body.querySelector('[role="dialog"]');

    expect(panel?.className).toContain("w-96");
  });
});

test("it should ignore escape", async () => {
  const onClose = vi.fn();

  render(
    <BridgeDrawerHost>
      <RunOnMount
        onMount={(drawer) => {
          drawer.open({
            onClose,
            component: Content,
            drawer: { persistent: true, transition: "none" },
          });
        }}
      />
    </BridgeDrawerHost>,
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

test("it should use incremental z-index", async () => {
  render(
    <BridgeDrawerHost>
      <RunOnMount
        onMount={(drawer) => {
          drawer.open({
            component: Content,
            props: { label: "Outer" },
            drawer: { transition: "none" },
          });
          drawer.open({
            component: Content,
            props: { label: "Inner" },
            drawer: { transition: "none" },
          });
        }}
      />
    </BridgeDrawerHost>,
  );

  await waitFor(() => {
    const zIndexes = [
      ...document.body.querySelectorAll<HTMLElement>(
        '.fixed.inset-0[style*="z-index"]',
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

test("it should run before onClosed when the overlay is clicked", async () => {
  const onClose = vi.fn();
  const onClosed = vi.fn();
  let api!: ReturnType<typeof useDrawerAction>;
  let id = "";

  render(
    <BridgeDrawerHost>
      <RunOnMount
        onMount={(drawer) => {
          api = drawer;
          id = drawer.open({
            onClose,
            onClosed,
            component: Content,
            drawer: { transition: "none" },
          });
        }}
      />
    </BridgeDrawerHost>,
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

test("it should not override host-controlled props with drawer shell options", async () => {
  const onClose = vi.fn();

  render(
    <BridgeDrawerHost>
      <RunOnMount
        onMount={(drawer) => {
          drawer.open({
            onClose,
            component: Content,
            drawer: {
              onClose: vi.fn(),
              transition: "none",
              onShowChange: vi.fn(),
            },
          });
        }}
      />
    </BridgeDrawerHost>,
  );

  await waitFor(() => {
    expect(document.body.querySelector('[role="dialog"]')).not.toBeNull();
  });

  act(() => {
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
  });

  expect(onClose).toHaveBeenCalledOnce();
});

test("it should warn in development", () => {
  const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

  render(
    <BridgeDrawerHost>
      <BridgeDrawerHost>
        <span>nested</span>
      </BridgeDrawerHost>
    </BridgeDrawerHost>,
  );

  expect(warn).toHaveBeenCalledWith(
    "[Bridge UI] Nested <BridgeDrawerHost /> detected. useDrawerAction() will target the nearest host only. Remove the extra host.",
  );

  warn.mockRestore();
});

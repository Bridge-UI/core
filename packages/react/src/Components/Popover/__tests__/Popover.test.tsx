// ** External Imports
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { useState, type ReactNode } from "react";
import { afterEach, expect, test, vi } from "vitest";

// ** Core Imports
import { pushLayerStack, resetLayerStackForTests } from "@bridge-ui/core/Layer";

// ** Local Imports
import { Button } from "@/Components/Button";
import { Menu } from "@/Components/Menu";
import { Modal } from "@/Components/Modal";
import { Popover, type PopoverProps } from "@/Components/Popover";

afterEach(() => {
  cleanup();
  resetLayerStackForTests();
  document.body.innerHTML = "";
  document.body.style.overflow = "";
});

function ControlledPopover({
  children,
  initialOpen = false,
  ...props
}: Omit<PopoverProps, "children"> & {
  children?: PopoverProps["children"];
  initialOpen?: boolean;
}) {
  const [open, setOpen] = useState(initialOpen);

  return (
    <Popover
      show={open}
      onShowChange={setOpen}
      slots={{ trigger: <Button>Open</Button> }}
      {...props}
    >
      {children ?? "Popover body"}
    </Popover>
  );
}

async function flushFrame() {
  await act(async () => {
    await new Promise((resolve) => requestAnimationFrame(resolve));
  });
}

test("it should open the popover when the trigger is clicked", () => {
  render(<ControlledPopover />);

  expect(screen.queryByRole("dialog")).toBeNull();

  fireEvent.click(screen.getByText("Open"));

  expect(screen.getByRole("dialog")).toBeTruthy();
  expect(document.body.textContent).toContain("Popover body");
});

test("it should close the popover when the trigger is clicked again", () => {
  render(<ControlledPopover />);

  fireEvent.click(screen.getByText("Open"));
  fireEvent.click(screen.getByText("Open"));

  expect(screen.queryByRole("dialog")).toBeNull();
});

test("it should expose dialog semantics on the trigger", () => {
  render(<ControlledPopover initialOpen />);

  const trigger = document.querySelector('[aria-haspopup="dialog"]');
  const dialog = screen.getByRole("dialog");

  expect(trigger?.getAttribute("aria-expanded")).toBe("true");
  expect(trigger?.getAttribute("aria-controls")).toBe(dialog.id);
});

test("it should label the dialog with the title", () => {
  render(<ControlledPopover initialOpen title="Filters" />);

  const dialog = screen.getByRole("dialog", { name: "Filters" });

  expect(dialog).toBeTruthy();
});

test("it should not trap arrow keys inside the content", () => {
  render(
    <ControlledPopover initialOpen>
      <input aria-label="Name" />
    </ControlledPopover>,
  );

  const input = screen.getByLabelText("Name");
  const event = new KeyboardEvent("keydown", {
    bubbles: true,
    key: "ArrowDown",
    cancelable: true,
  });

  input.dispatchEvent(event);

  expect(event.defaultPrevented).toBe(false);
});

test("it should close on click away", async () => {
  const onClose = vi.fn();

  render(
    <div>
      <ControlledPopover initialOpen onClose={onClose} />
      <span>Outside</span>
    </div>,
  );

  await flushFrame();

  fireEvent.pointerDown(screen.getByText("Outside"));

  expect(screen.queryByRole("dialog")).toBeNull();
  expect(onClose).toHaveBeenCalledOnce();
});

test("it should stay open on click away when closeOnClickAway is false", async () => {
  render(
    <div>
      <ControlledPopover initialOpen closeOnClickAway={false} />
      <span>Outside</span>
    </div>,
  );

  await flushFrame();

  fireEvent.pointerDown(screen.getByText("Outside"));

  expect(screen.getByRole("dialog")).toBeTruthy();
});

test("it should stay open when clicking inside a layer opened from it", async () => {
  function Host() {
    const [open, setOpen] = useState(true);
    const [menuOpen, setMenuOpen] = useState(false);

    return (
      <Popover
        show={open}
        onShowChange={setOpen}
        slots={{ trigger: <Button>Open</Button> }}
      >
        <Menu
          show={menuOpen}
          onShowChange={setMenuOpen}
          slots={{ trigger: <Button>Nested</Button> }}
        >
          <span>Nested item</span>
        </Menu>
      </Popover>
    );
  }

  render(<Host />);

  fireEvent.click(screen.getByText("Nested"));
  await flushFrame();

  fireEvent.pointerDown(screen.getByText("Nested item"));

  expect(screen.getByRole("dialog")).toBeTruthy();
  expect(screen.getByRole("menu")).toBeTruthy();
});

test("it should close on Escape and return focus to the trigger", () => {
  render(<ControlledPopover initialOpen />);

  fireEvent.keyDown(window, { key: "Escape" });

  expect(screen.queryByRole("dialog")).toBeNull();
  expect(document.activeElement).toBe(
    document.querySelector('[aria-haspopup="dialog"]'),
  );
});

test("it should stay open on Escape when closeOnEscape is false", () => {
  render(<ControlledPopover initialOpen closeOnEscape={false} />);

  fireEvent.keyDown(window, { key: "Escape" });

  expect(screen.getByRole("dialog")).toBeTruthy();
});

test("it should close when focus moves outside", () => {
  render(
    <div>
      <ControlledPopover initialOpen>
        <input aria-label="Name" />
      </ControlledPopover>
      <button type="button">After</button>
    </div>,
  );

  fireEvent.blur(screen.getByRole("dialog"), {
    relatedTarget: screen.getByText("After"),
  });

  expect(screen.queryByRole("dialog")).toBeNull();
});

test("it should stay open when focus moves inside the content", () => {
  render(
    <ControlledPopover initialOpen>
      <input aria-label="Name" />
    </ControlledPopover>,
  );

  fireEvent.blur(screen.getByRole("dialog"), {
    relatedTarget: screen.getByLabelText("Name"),
  });

  expect(screen.getByRole("dialog")).toBeTruthy();
});

test("it should not close on dismiss when persistent", async () => {
  render(
    <div>
      <ControlledPopover persistent initialOpen />
      <span>Outside</span>
    </div>,
  );

  await flushFrame();

  fireEvent.pointerDown(screen.getByText("Outside"));
  fireEvent.keyDown(window, { key: "Escape" });

  expect(screen.getByRole("dialog")).toBeTruthy();
});

test("it should close from the content with the render function", () => {
  render(
    <ControlledPopover persistent initialOpen>
      {({ close }) => (
        <button type="button" onClick={close}>
          Done
        </button>
      )}
    </ControlledPopover>,
  );

  fireEvent.click(screen.getByText("Done"));

  expect(screen.queryByRole("dialog")).toBeNull();
});

test("it should close an open menu when it opens", async () => {
  function Host({ children }: { children?: ReactNode }) {
    const [menuOpen, setMenuOpen] = useState(true);

    return (
      <div>
        <Menu
          show={menuOpen}
          onShowChange={setMenuOpen}
          slots={{ trigger: <Button>Menu</Button> }}
        >
          Menu body
        </Menu>
        {children}
      </div>
    );
  }

  render(
    <Host>
      <ControlledPopover />
    </Host>,
  );

  await flushFrame();

  fireEvent.pointerDown(screen.getByText("Open"));
  fireEvent.click(screen.getByText("Open"));

  await waitFor(() => {
    expect(screen.getByRole("dialog")).toBeTruthy();
    expect(screen.queryByRole("menu")).toBeNull();
  });
});

test("it should render the arrow when arrow is true", () => {
  render(<ControlledPopover arrow initialOpen />);

  const arrow = screen
    .getByRole("dialog")
    .querySelector('[aria-hidden="true"]');

  expect(arrow).toBeTruthy();
});

test("it should anchor to anchorEl without a trigger slot", () => {
  function Host() {
    const [anchor, setAnchor] = useState<null | HTMLElement>(null);

    return (
      <div>
        <button type="button" ref={setAnchor}>
          Anchor
        </button>

        <Popover show anchorEl={anchor}>
          Anchored body
        </Popover>
      </div>
    );
  }

  render(<Host />);

  expect(screen.getByRole("dialog").textContent).toContain("Anchored body");
  expect(document.querySelector('[aria-haspopup="dialog"]')).toBeNull();
});

test("it should keep the parent menu open when opened from inside it", async () => {
  function Host() {
    const [menuOpen, setMenuOpen] = useState(true);
    const [open, setOpen] = useState(false);

    return (
      <Menu
        show={menuOpen}
        onShowChange={setMenuOpen}
        slots={{ trigger: <Button>Menu</Button> }}
      >
        <Popover
          show={open}
          onShowChange={setOpen}
          slots={{ trigger: <Button>Nested</Button> }}
        >
          Nested popover
        </Popover>
      </Menu>
    );
  }

  render(<Host />);

  await flushFrame();

  fireEvent.click(screen.getByText("Nested"));
  await flushFrame();

  expect(screen.getByRole("menu")).toBeTruthy();
  expect(screen.getByRole("dialog").textContent).toContain("Nested popover");
});

test("it should return focus to the trigger when closed from the content", () => {
  render(
    <ControlledPopover initialOpen>
      {({ close }) => (
        <button type="button" onClick={close}>
          Done
        </button>
      )}
    </ControlledPopover>,
  );

  const done = screen.getByText("Done");

  done.focus();
  fireEvent.click(done);

  expect(screen.queryByRole("dialog")).toBeNull();
  expect(document.activeElement).toBe(
    document.querySelector('[aria-haspopup="dialog"]'),
  );
});

test("it should stay open when focus moves outside and closeOnFocusOut is false", () => {
  render(
    <div>
      <ControlledPopover initialOpen closeOnFocusOut={false} />
      <button type="button">After</button>
    </div>,
  );

  fireEvent.blur(screen.getByRole("dialog"), {
    relatedTarget: screen.getByText("After"),
  });

  expect(screen.getByRole("dialog")).toBeTruthy();
});

test("it should not label the dialog when the title is falsy", () => {
  render(<ControlledPopover initialOpen title={false} />);

  const dialog = screen.getByRole("dialog");

  expect(dialog.getAttribute("aria-labelledby")).toBeNull();
  expect(dialog.querySelector(".mb-2")).toBeNull();
});

test("it should not move focus back to the trigger on click away", async () => {
  render(
    <div>
      <ControlledPopover initialOpen>
        <input aria-label="Name" />
      </ControlledPopover>
      <span>Outside</span>
    </div>,
  );

  await flushFrame();

  const trigger = document.querySelector<HTMLElement>(
    '[aria-haspopup="dialog"]',
  );
  const onTriggerFocus = vi.fn();

  trigger?.addEventListener("focus", onTriggerFocus);

  expect(document.activeElement).toBe(screen.getByLabelText("Name"));

  fireEvent.pointerDown(screen.getByText("Outside"));

  expect(screen.queryByRole("dialog")).toBeNull();
  expect(onTriggerFocus).not.toHaveBeenCalled();
});

test("it should close the parent popover when focus leaves a nested one", async () => {
  function Host() {
    const [outer, setOuter] = useState(true);
    const [inner, setInner] = useState(true);

    return (
      <div>
        <Popover
          show={outer}
          onShowChange={setOuter}
          slots={{ trigger: <Button>Outer</Button> }}
        >
          <Popover
            show={inner}
            onShowChange={setInner}
            slots={{ trigger: <Button>Inner</Button> }}
          >
            <input aria-label="Inner field" />
          </Popover>
        </Popover>
        <button type="button">After</button>
      </div>
    );
  }

  render(<Host />);

  await flushFrame();

  fireEvent.focusOut(screen.getByLabelText("Inner field"), {
    relatedTarget: screen.getByText("After"),
  });

  expect(screen.queryAllByRole("dialog")).toHaveLength(0);
});

test("it should keep keyboard input inside a popover opened from a menu", async () => {
  function Host() {
    const [menuOpen, setMenuOpen] = useState(true);
    const [open, setOpen] = useState(true);

    return (
      <Menu
        show={menuOpen}
        onShowChange={setMenuOpen}
        slots={{ trigger: <Button>Menu</Button> }}
      >
        <Popover
          show={open}
          onShowChange={setOpen}
          slots={{ trigger: <Button>Nested</Button> }}
        >
          <input aria-label="Search" />
        </Popover>
      </Menu>
    );
  }

  render(<Host />);

  await flushFrame();

  const input = screen.getByLabelText("Search");

  input.focus();

  const arrow = fireEvent.keyDown(input, { key: "ArrowDown" });

  expect(arrow).toBe(true);
  expect(document.activeElement).toBe(input);

  fireEvent.keyDown(input, { key: "Escape" });

  expect(screen.getByRole("menu")).toBeTruthy();
});

test("it should restore focus on a later close when the parent ignored click away", async () => {
  function Host() {
    const [open, setOpen] = useState(true);

    return (
      <div>
        <Popover
          show={open}
          onShowChange={() => {}}
          slots={{ trigger: <Button>Open</Button> }}
        >
          <input aria-label="Name" />
          <button type="button" onClick={() => setOpen(false)}>
            Done
          </button>
        </Popover>
        <span>Outside</span>
      </div>
    );
  }

  render(<Host />);

  await flushFrame();

  fireEvent.pointerDown(screen.getByText("Outside"));

  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  });

  expect(screen.getByRole("dialog")).toBeTruthy();

  screen.getByText("Done").focus();
  fireEvent.click(screen.getByText("Done"));

  expect(screen.queryByRole("dialog")).toBeNull();
  expect(document.activeElement).toBe(
    document.querySelector('[aria-haspopup="dialog"]'),
  );
});

test("it should stay open when focus leaves the anchor input", async () => {
  function Host() {
    const [anchor, setAnchor] = useState<null | HTMLInputElement>(null);
    const [open, setOpen] = useState(true);

    return (
      <div>
        <input ref={setAnchor} aria-label="Search" />
        <Popover
          show={open}
          disableAutoFocus
          anchorEl={anchor}
          onShowChange={setOpen}
        >
          Suggestions
        </Popover>
        <button type="button">After</button>
      </div>
    );
  }

  render(<Host />);

  await flushFrame();

  fireEvent.focusOut(screen.getByLabelText("Search"), {
    relatedTarget: screen.getByText("After"),
  });

  expect(screen.getByRole("dialog")).toBeTruthy();
});

test("it should close a menu from a toggle button inside the anchor", async () => {
  function Host() {
    const [anchor, setAnchor] = useState<null | HTMLElement>(null);
    const [open, setOpen] = useState(true);

    return (
      <div>
        <div ref={setAnchor}>
          <button type="button" onClick={() => setOpen((value) => !value)}>
            Toggle
          </button>
        </div>
        <Menu show={open} anchorEl={anchor} onShowChange={setOpen}>
          <button type="button">Item</button>
        </Menu>
      </div>
    );
  }

  render(<Host />);

  await flushFrame();

  fireEvent.pointerDown(screen.getByText("Toggle"));
  fireEvent.click(screen.getByText("Toggle"));

  expect(screen.queryByRole("menu")).toBeNull();
});

test("it should use the latest onShowChange on click away and Escape", async () => {
  const first = vi.fn();
  const latest = vi.fn();

  const { rerender } = render(
    <div>
      <Popover
        show
        onShowChange={first}
        slots={{ trigger: <Button>Open</Button> }}
      >
        Body
      </Popover>
      <span>Outside</span>
    </div>,
  );

  await flushFrame();

  rerender(
    <div>
      <Popover
        show
        onShowChange={latest}
        slots={{ trigger: <Button>Open</Button> }}
      >
        Body
      </Popover>
      <span>Outside</span>
    </div>,
  );

  fireEvent.pointerDown(screen.getByText("Outside"));

  expect(first).not.toHaveBeenCalled();
  expect(latest).toHaveBeenCalledWith(false);

  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  });

  fireEvent.keyDown(window, { key: "Escape" });

  expect(first).not.toHaveBeenCalled();
  expect(latest).toHaveBeenCalledTimes(2);
});

test("it should close a menu from a plain button outside it", async () => {
  const onShowChange = vi.fn();

  render(
    <div>
      <Menu
        show
        onShowChange={onShowChange}
        slots={{ trigger: <Button>Menu</Button> }}
      >
        <button type="button">Item</button>
      </Menu>
      <button type="button">Save</button>
    </div>,
  );

  await flushFrame();

  fireEvent.pointerDown(screen.getByText("Save"));

  expect(onShowChange).toHaveBeenCalledWith(false);
});

test("it should honor closeOnEscape when Escape is pressed inside the menu", async () => {
  const onClose = vi.fn();

  render(
    <Menu
      show
      onClose={onClose}
      closeOnEscape={false}
      slots={{ trigger: <Button>Menu</Button> }}
    >
      <button type="button">Item</button>
    </Menu>,
  );

  await flushFrame();

  fireEvent.keyDown(screen.getByText("Item"), { key: "Escape" });

  expect(onClose).not.toHaveBeenCalled();
});

test("it should call onClose once when Escape is pressed inside the menu", async () => {
  const onClose = vi.fn();

  render(
    <Menu show onClose={onClose} slots={{ trigger: <Button>Menu</Button> }}>
      <button type="button">Item</button>
    </Menu>,
  );

  await flushFrame();

  fireEvent.keyDown(screen.getByText("Item"), { key: "Escape" });

  expect(onClose).toHaveBeenCalledOnce();
});

test("it should close when focus leaves through the trigger", async () => {
  render(
    <div>
      <ControlledPopover initialOpen />
      <button type="button">Before</button>
    </div>,
  );

  await flushFrame();

  fireEvent.focusOut(screen.getByText("Open"), {
    relatedTarget: screen.getByText("Before"),
  });

  expect(screen.queryByRole("dialog")).toBeNull();
});

test("it should close when focus moves into an unrelated layer and then out", async () => {
  render(
    <div>
      <ControlledPopover initialOpen>
        <input aria-label="Name" />
      </ControlledPopover>
      <button type="button">Opener</button>
    </div>,
  );

  await flushFrame();

  const panel = document.createElement("div");
  const field = document.createElement("input");

  panel.append(field);
  document.body.append(panel);

  const opener = screen.getByText("Opener");
  const layer = pushLayerStack({ container: panel, origin: () => opener });

  fireEvent.focusOut(field, { relatedTarget: opener });

  expect(screen.getByRole("dialog")).toBeTruthy();

  fireEvent.focusOut(screen.getByLabelText("Name"), { relatedTarget: field });

  expect(screen.queryByRole("dialog")).toBeNull();

  layer.release();
});

test("it should return focus to the trigger when click away does not move it", async () => {
  render(
    <div>
      <ControlledPopover initialOpen keepMounted>
        <input aria-label="Name" />
      </ControlledPopover>
      <canvas data-testid="canvas" />
    </div>,
  );

  await flushFrame();

  const canvas = screen.getByTestId("canvas");

  canvas.addEventListener("pointerdown", (event) => {
    event.preventDefault();
  });

  expect(document.activeElement).toBe(screen.getByLabelText("Name"));

  fireEvent.pointerDown(canvas);

  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  });

  expect(document.activeElement).toBe(
    document.querySelector('[aria-haspopup="dialog"]'),
  );
});

test("it should apply customProps.content without a trigger slot", () => {
  render(
    <Popover
      show
      classes={{ content: "custom-panel" }}
      customProps={{ content: { "data-testid": "filters" } }}
    >
      Body
    </Popover>,
  );

  const dialog = screen.getByTestId("filters");

  expect(dialog.getAttribute("role")).toBe("dialog");
  expect(dialog.className).toContain("custom-panel");
});

test("it should stay open when a modal opened from it changes props", async () => {
  function Host({
    modal,
    persistent,
  }: {
    modal: boolean;
    persistent: boolean;
  }) {
    return (
      <div>
        <ControlledPopover initialOpen>
          <button type="button">Open modal</button>
        </ControlledPopover>
        <Modal
          show={modal}
          transition="none"
          persistent={persistent}
          disableScrollLock={persistent}
        >
          <button type="button">Inside modal</button>
        </Modal>
      </div>
    );
  }

  const { rerender } = render(<Host modal={false} persistent={false} />);

  await flushFrame();

  screen.getByText("Open modal").focus();
  rerender(<Host modal persistent={false} />);
  await flushFrame();

  // Focus is inside the modal when its props change.
  screen.getByText("Inside modal").focus();
  rerender(<Host modal persistent />);
  await flushFrame();

  fireEvent.pointerDown(screen.getByText("Inside modal"));

  expect(
    document
      .querySelector('[aria-haspopup="dialog"]')
      ?.getAttribute("aria-expanded"),
  ).toBe("true");
});

test("it should keep the outer menu open when a menu opens inside its popover", async () => {
  function Host() {
    const [outerOpen, setOuterOpen] = useState(true);
    const [innerOpen, setInnerOpen] = useState(false);
    const [popoverOpen, setPopoverOpen] = useState(true);

    return (
      <Menu
        show={outerOpen}
        onShowChange={setOuterOpen}
        slots={{ trigger: <Button>Outer</Button> }}
      >
        <Popover
          show={popoverOpen}
          onShowChange={setPopoverOpen}
          slots={{ trigger: <Button>Details</Button> }}
        >
          <Menu
            show={innerOpen}
            onShowChange={setInnerOpen}
            slots={{ trigger: <Button>Inner</Button> }}
          >
            <button type="button">Inner item</button>
          </Menu>
        </Popover>
      </Menu>
    );
  }

  render(<Host />);

  await flushFrame();

  fireEvent.click(screen.getByText("Inner"));
  await flushFrame();

  expect(screen.getAllByRole("menu")).toHaveLength(2);
  expect(screen.getByText("Inner item")).toBeTruthy();
});

test("it should close from its trigger when it also has an anchorEl", async () => {
  function Host() {
    const [anchor, setAnchor] = useState<null | HTMLElement>(null);
    const [open, setOpen] = useState(true);

    return (
      <div>
        <div ref={setAnchor}>Anchor</div>
        <Popover
          show={open}
          anchorEl={anchor}
          onShowChange={setOpen}
          slots={{ trigger: <Button>Open</Button> }}
        >
          Body
        </Popover>
      </div>
    );
  }

  render(<Host />);

  await flushFrame();

  fireEvent.pointerDown(screen.getByText("Open"));
  fireEvent.click(screen.getByText("Open"));

  expect(screen.queryByRole("dialog")).toBeNull();
});

test("it should close a menu anchored to a row when a menu inside the row opens", async () => {
  function Host() {
    const [contextOpen, setContextOpen] = useState(true);
    const [actionsOpen, setActionsOpen] = useState(false);
    const [row, setRow] = useState<null | HTMLElement>(null);

    return (
      <div>
        <div ref={setRow}>
          <Menu
            show={actionsOpen}
            onShowChange={setActionsOpen}
            slots={{ trigger: <Button>Row actions</Button> }}
          >
            <button type="button">Edit</button>
          </Menu>
        </div>
        <Menu anchorEl={row} show={contextOpen} onShowChange={setContextOpen}>
          <button type="button">Copy</button>
        </Menu>
      </div>
    );
  }

  render(<Host />);

  await flushFrame();

  fireEvent.click(screen.getByText("Row actions"));
  await flushFrame();

  expect(screen.getAllByRole("menu")).toHaveLength(1);
  expect(screen.getByText("Edit")).toBeTruthy();
});

test("it should keep the outer menu open when an inner menu with an outside anchorEl opens", async () => {
  function Host() {
    const [outerOpen, setOuterOpen] = useState(true);
    const [innerOpen, setInnerOpen] = useState(false);
    const [toolbar, setToolbar] = useState<null | HTMLElement>(null);

    return (
      <div>
        <div ref={setToolbar}>Toolbar</div>
        <Menu
          show={outerOpen}
          onShowChange={setOuterOpen}
          slots={{ trigger: <Button>Outer</Button> }}
        >
          <Popover show slots={{ trigger: <Button>Details</Button> }}>
            <Menu
              show={innerOpen}
              anchorEl={toolbar}
              onShowChange={setInnerOpen}
              slots={{ trigger: <Button>Inner</Button> }}
            >
              <button type="button">Inner item</button>
            </Menu>
          </Popover>
        </Menu>
      </div>
    );
  }

  render(<Host />);

  await flushFrame();

  fireEvent.click(screen.getByText("Inner"));
  await flushFrame();

  expect(screen.getAllByRole("menu")).toHaveLength(2);
});

test("it should keep a nested menu open when the outer menu's props change", async () => {
  function Host({ keepMounted }: { keepMounted: boolean }) {
    const [innerOpen, setInnerOpen] = useState(false);

    return (
      <Menu
        show
        keepMounted={keepMounted}
        slots={{ trigger: <Button>Outer</Button> }}
      >
        <Popover show slots={{ trigger: <Button>Details</Button> }}>
          <Menu
            show={innerOpen}
            onShowChange={setInnerOpen}
            slots={{ trigger: <Button>Inner</Button> }}
          >
            <button type="button">Inner item</button>
          </Menu>
        </Popover>
      </Menu>
    );
  }

  const { rerender } = render(<Host keepMounted={false} />);

  await flushFrame();

  fireEvent.click(screen.getByText("Inner"));
  await flushFrame();

  rerender(<Host keepMounted />);
  await flushFrame();

  expect(screen.getByText("Inner item")).toBeTruthy();
});

test("it should stay open when the backdrop of a modal opened from it is pressed", async () => {
  function Host({ modal }: { modal: boolean }) {
    return (
      <div>
        <ControlledPopover initialOpen>
          <button type="button">Open modal</button>
        </ControlledPopover>
        <Modal show={modal} transition="none">
          <button type="button">Inside modal</button>
        </Modal>
      </div>
    );
  }

  const { rerender } = render(<Host modal={false} />);

  await flushFrame();

  screen.getByText("Open modal").focus();
  rerender(<Host modal />);
  await flushFrame();

  const backdrop = document.querySelector('[data-modal-part="overlay"]');

  expect(backdrop).not.toBeNull();
  fireEvent.pointerDown(backdrop as Element);

  expect(
    document
      .querySelector('[aria-haspopup="dialog"]')
      ?.getAttribute("aria-expanded"),
  ).toBe("true");
});

test("it should close on Escape in the content under an unrelated layer", () => {
  render(<ControlledPopover initialOpen />);

  const onEscape = vi.fn();
  const tooltip = pushLayerStack({
    onEscape,
    lockScroll: false,
    origin: () => null,
  });

  fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" });

  expect(screen.queryByRole("dialog")).toBeNull();
  expect(onEscape).not.toHaveBeenCalled();

  tooltip.release();
});

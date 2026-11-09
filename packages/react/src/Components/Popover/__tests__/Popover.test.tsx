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
import { resetLayerStackForTests } from "@bridge-ui/core/Layer";

// ** Local Imports
import { Button } from "@/Components/Button";
import { Menu } from "@/Components/Menu";
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

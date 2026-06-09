// ** External Imports
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { useRef, useState, type ReactNode } from "react";
import { afterEach, expect, test } from "vitest";

// ** Local Imports
import { Button } from "@/Components/Button";
import { List } from "@/Components/List";
import { ListItem } from "@/Components/ListItem";
import { Menu } from "@/Components/Menu";
import { resetLayerStackForTests } from "@bridge-ui/core";

afterEach(() => {
  cleanup();
  resetLayerStackForTests();
  document.body.innerHTML = "";
  document.body.style.overflow = "";
});

function ControlledMenu({
  children,
  onTriggerClick,
  disableScrollLock,
  initialOpen = false,
}: {
  children?: ReactNode;
  disableScrollLock?: boolean;
  initialOpen?: boolean;
  onTriggerClick?: () => void;
}) {
  const [open, setOpen] = useState(initialOpen);

  return (
    <Menu
      show={open}
      onShowChange={setOpen}
      disableScrollLock={disableScrollLock}
      slots={{
        trigger: <Button onClick={onTriggerClick}>Open</Button>,
      }}
    >
      {children ?? "Menu body"}
    </Menu>
  );
}

test("it should open the menu when the trigger is clicked", () => {
  render(<ControlledMenu />);

  expect(screen.queryByRole("menu")).toBeNull();

  fireEvent.click(screen.getByText("Open"));

  expect(screen.getByRole("menu")).toBeTruthy();
  expect(document.body.textContent).toContain("Menu body");
});

test("it should open when the trigger child also sets show on click", () => {
  function Host() {
    const [open, setOpen] = useState(false);

    return (
      <Menu
        show={open}
        onShowChange={setOpen}
        slots={{
          trigger: (
            <Button
              onClick={() => {
                setOpen(true);
              }}
            >
              Open
            </Button>
          ),
        }}
      >
        Menu body
      </Menu>
    );
  }

  render(<Host />);

  fireEvent.click(screen.getByText("Open"));

  expect(screen.getByRole("menu")).toBeTruthy();
});

test("it should not lock body scroll by default", () => {
  render(<ControlledMenu initialOpen />);

  expect(document.body.style.overflow).not.toBe("hidden");
});

test("it should lock body scroll when disableScrollLock is false", () => {
  render(<ControlledMenu disableScrollLock={false} initialOpen />);

  expect(document.body.style.overflow).toBe("hidden");
});

test("it should close the menu when the trigger is clicked again", () => {
  render(<ControlledMenu />);

  fireEvent.click(screen.getByText("Open"));
  expect(screen.getByRole("menu")).toBeTruthy();

  fireEvent.click(screen.getByText("Open"));
  expect(screen.queryByRole("menu")).toBeNull();
});

test("it should switch to another menu in one click while one is open", async () => {
  function Host() {
    const [openA, setOpenA] = useState(false);
    const [openB, setOpenB] = useState(false);

    return (
      <div>
        <Menu
          show={openA}
          onShowChange={setOpenA}
          slots={{ trigger: <Button>A</Button> }}
        >
          Menu A
        </Menu>
        <Menu
          show={openB}
          onShowChange={setOpenB}
          slots={{ trigger: <Button>B</Button> }}
        >
          Menu B
        </Menu>
      </div>
    );
  }

  render(<Host />);

  fireEvent.click(screen.getByText("A"));
  expect(screen.getByRole("menu")).toBeTruthy();
  expect(document.body.textContent).toContain("Menu A");

  fireEvent.pointerDown(screen.getByText("B"));
  fireEvent.click(screen.getByText("B"));

  await waitFor(() => {
    expect(document.body.textContent).toContain("Menu B");
    expect(document.body.textContent).not.toContain("Menu A");
  });
});

test("it should render List and ListItem inside the menu panel", () => {
  render(
    <ControlledMenu initialOpen>
      <List dense padding="none">
        <ListItem interactive primary="Item one" role="menuitem" />
      </List>
    </ControlledMenu>,
  );

  expect(screen.getByRole("menu")).toBeTruthy();
  expect(screen.getByRole("menuitem")).toBeTruthy();
  expect(screen.getByText("Item one")).toBeTruthy();
});

test("it should close other menus with anchorEl when another opens", async () => {
  function Host() {
    const anchorARef = useRef<HTMLButtonElement>(null);
    const anchorBRef = useRef<HTMLButtonElement>(null);
    const [openA, setOpenA] = useState(false);
    const [openB, setOpenB] = useState(false);

    return (
      <div>
        <button
          ref={anchorARef}
          type="button"
          onClick={() => {
            setOpenA(true);
          }}
        >
          Open A
        </button>

        <Menu show={openA} onShowChange={setOpenA} anchorEl={anchorARef}>
          Menu A
        </Menu>

        <button
          ref={anchorBRef}
          type="button"
          onClick={() => {
            setOpenB(true);
          }}
        >
          Open B
        </button>

        <Menu show={openB} onShowChange={setOpenB} anchorEl={anchorBRef}>
          Menu B
        </Menu>
      </div>
    );
  }

  render(<Host />);

  fireEvent.click(screen.getByText("Open A"));
  expect(document.body.textContent).toContain("Menu A");

  fireEvent.click(screen.getByText("Open B"));

  await waitFor(() => {
    expect(document.body.textContent).toContain("Menu B");
    expect(document.body.textContent).not.toContain("Menu A");
  });
});

test("it should release scroll lock when the menu closes", () => {
  render(<ControlledMenu disableScrollLock={false} />);

  fireEvent.click(screen.getByText("Open"));
  expect(document.body.style.overflow).toBe("hidden");

  fireEvent.click(screen.getByText("Open"));
  expect(document.body.style.overflow).not.toBe("hidden");
});

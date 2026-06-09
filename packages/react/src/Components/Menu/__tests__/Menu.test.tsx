// ** External Imports
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { useState } from "react";
import { afterEach, expect, test } from "vitest";

// ** Local Imports
import { Button } from "@/Components/Button";
import { Menu } from "@/Components/Menu";
import { resetLayerStackForTests } from "@bridge-ui/core";

afterEach(() => {
  cleanup();
  resetLayerStackForTests();
  document.body.innerHTML = "";
  document.body.style.overflow = "";
});

function ControlledMenu({
  onTriggerClick,
  disableScrollLock,
  initialOpen = false,
}: {
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
      Menu body
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

test("it should release scroll lock when the menu closes", () => {
  render(<ControlledMenu disableScrollLock={false} />);

  fireEvent.click(screen.getByText("Open"));
  expect(document.body.style.overflow).toBe("hidden");

  fireEvent.click(screen.getByText("Open"));
  expect(document.body.style.overflow).not.toBe("hidden");
});

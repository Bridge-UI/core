// ** External Imports
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { useRef, useState } from "react";
import { afterEach, expect, test, vi } from "vitest";

// ** Core Imports
import { resetLayerStackForTests } from "@bridge-ui/core/Layer";

// ** Local Imports
import { Button } from "@/Components/Button";
import { Tooltip } from "@/Components/Tooltip";

afterEach(() => {
  cleanup();
  resetLayerStackForTests();
  document.body.innerHTML = "";
  vi.useRealTimers();
});

test("it should not show the tooltip by default", () => {
  render(
    <Tooltip content="Save file" slots={{ trigger: <Button>Save</Button> }} />,
  );

  expect(screen.queryByRole("tooltip")).toBeNull();
});

test("it should open on pointer enter after openDelay", async () => {
  vi.useFakeTimers();

  render(
    <Tooltip content="Save file" slots={{ trigger: <Button>Save</Button> }} />,
  );

  fireEvent.pointerEnter(screen.getByText("Save").parentElement!);

  expect(screen.queryByRole("tooltip")).toBeNull();

  await act(async () => {
    vi.advanceTimersByTime(200);
  });

  expect(screen.getByRole("tooltip").textContent).toContain("Save file");
});

test("it should open immediately when openDelay is 0", () => {
  render(
    <Tooltip
      openDelay={0}
      content="Save file"
      slots={{ trigger: <Button>Save</Button> }}
    />,
  );

  fireEvent.pointerEnter(screen.getByText("Save").parentElement!);

  expect(screen.getByRole("tooltip").textContent).toContain("Save file");
});

test("it should close on pointer leave", async () => {
  render(
    <Tooltip
      openDelay={0}
      content="Save file"
      slots={{ trigger: <Button>Save</Button> }}
    />,
  );

  const trigger = screen.getByText("Save").parentElement!;

  fireEvent.pointerEnter(trigger);
  expect(screen.getByRole("tooltip")).toBeTruthy();

  fireEvent.pointerLeave(trigger);

  await waitFor(() => {
    expect(screen.queryByRole("tooltip")).toBeNull();
  });
});

test("it should set aria-describedby on the trigger while open", () => {
  render(
    <Tooltip
      openDelay={0}
      content="Save file"
      slots={{ trigger: <Button>Save</Button> }}
    />,
  );

  const trigger = screen.getByText("Save").parentElement!;

  fireEvent.pointerEnter(trigger);

  const tooltip = screen.getByRole("tooltip");

  expect(trigger.getAttribute("aria-describedby")).toBe(tooltip.id);
});

test("it should respect controlled show", () => {
  function Host() {
    const [open, setOpen] = useState(false);

    return (
      <>
        <button type="button" onClick={() => setOpen(true)}>
          Force open
        </button>
        <Tooltip
          show={open}
          content="Controlled"
          onShowChange={setOpen}
          slots={{ trigger: <Button>Save</Button> }}
        />
      </>
    );
  }

  render(<Host />);

  expect(screen.queryByRole("tooltip")).toBeNull();

  fireEvent.click(screen.getByText("Force open"));

  expect(screen.getByRole("tooltip").textContent).toContain("Controlled");
});

test("it should position with anchorEl when provided", () => {
  function Host() {
    const anchorRef = useRef<HTMLButtonElement>(null);
    const [open, setOpen] = useState(true);

    return (
      <>
        <button type="button" ref={anchorRef}>
          Anchor
        </button>
        <Tooltip
          show={open}
          anchorEl={anchorRef}
          content="From anchor"
          onShowChange={setOpen}
        />
      </>
    );
  }

  render(<Host />);

  expect(screen.getByRole("tooltip").textContent).toContain("From anchor");
  expect(
    screen.queryByText("Anchor")?.parentElement?.getAttribute("role"),
  ).not.toBe("tooltip");
});

test("it should not open when disabled", () => {
  render(
    <Tooltip
      disabled
      openDelay={0}
      content="Hidden"
      slots={{ trigger: <Button>Save</Button> }}
    />,
  );

  fireEvent.pointerEnter(screen.getByText("Save").parentElement!);

  expect(screen.queryByRole("tooltip")).toBeNull();
});

test("it should render the arrow by default", () => {
  render(
    <Tooltip
      openDelay={0}
      content="With arrow"
      slots={{ trigger: <Button>Save</Button> }}
    />,
  );

  fireEvent.pointerEnter(screen.getByText("Save").parentElement!);

  const tooltip = screen.getByRole("tooltip");
  const arrow = tooltip.querySelector("[aria-hidden='true']");

  expect(arrow).not.toBeNull();
  expect(arrow?.classList.contains("rotate-45")).toBe(true);
});

test("it should omit the arrow when arrow is false", () => {
  render(
    <Tooltip
      arrow={false}
      openDelay={0}
      content="No arrow"
      slots={{ trigger: <Button>Save</Button> }}
    />,
  );

  fireEvent.pointerEnter(screen.getByText("Save").parentElement!);

  const tooltip = screen.getByRole("tooltip");

  expect(tooltip.querySelector("[aria-hidden='true']")).toBeNull();
});

test("it should close on Escape", async () => {
  render(
    <Tooltip
      openDelay={0}
      content="Escapable"
      slots={{ trigger: <Button>Save</Button> }}
    />,
  );

  const trigger = screen.getByText("Save").parentElement!;

  fireEvent.pointerEnter(trigger);
  expect(screen.getByRole("tooltip")).toBeTruthy();

  fireEvent.keyDown(trigger, { key: "Escape" });

  await waitFor(() => {
    expect(screen.queryByRole("tooltip")).toBeNull();
  });
});

test("it should apply dark content color by default", () => {
  render(
    <Tooltip
      openDelay={0}
      content="Dark"
      slots={{ trigger: <Button>Save</Button> }}
    />,
  );

  fireEvent.pointerEnter(screen.getByText("Save").parentElement!);

  expect(screen.getByRole("tooltip").classList.contains("bg-dark-900")).toBe(
    true,
  );
});

test("it should prefer children over content prop", () => {
  render(
    <Tooltip
      openDelay={0}
      content="Plain text"
      slots={{ trigger: <Button>Save</Button> }}
    >
      <span data-testid="custom-body">Custom body</span>
    </Tooltip>,
  );

  fireEvent.pointerEnter(screen.getByText("Save").parentElement!);

  expect(screen.getByTestId("custom-body").textContent).toBe("Custom body");
  expect(screen.getByRole("tooltip").textContent).not.toContain("Plain text");
});

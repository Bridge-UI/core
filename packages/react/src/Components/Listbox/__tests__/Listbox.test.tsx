// ** External Imports
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { useRef, useState } from "react";
import { afterEach, expect, test, vi } from "vitest";

// ** Local Imports
import { Listbox } from "@/Components/Listbox";
import type { ListboxOption } from "@/Components/Listbox/listbox.types";
import { resetLayerStackForTests } from "@bridge-ui/core";

afterEach(() => {
  cleanup();
  resetLayerStackForTests();
  document.body.innerHTML = "";
});

const options: ListboxOption[] = [
  { label: "Apple", value: "apple" },
  { label: "Banana", value: "banana" },
];

function ControlledListbox({
  initialOpen = false,
  listOptions = options,
}: {
  initialOpen?: boolean;
  listOptions?: ListboxOption[];
}) {
  const [open, setOpen] = useState(initialOpen);
  const anchorRef = useRef<HTMLDivElement>(null);

  return (
    <div>
      <div ref={anchorRef} data-testid="anchor">
        Anchor
      </div>

      <Listbox
        show={open}
        anchorEl={anchorRef}
        options={listOptions}
        onShowChange={setOpen}
        listboxId="test-listbox"
      />
    </div>
  );
}

test("it should render the listbox when open", async () => {
  render(<ControlledListbox initialOpen />);

  await waitFor(() => {
    expect(screen.getByRole("listbox")).toBeTruthy();
  });

  expect(screen.getByText("Apple")).toBeTruthy();
  expect(screen.getByText("Banana")).toBeTruthy();
});

test("it should call onSelect when an option is clicked", async () => {
  const onSelect = vi.fn();

  function Host() {
    const [open, setOpen] = useState(true);
    const anchorRef = useRef<HTMLDivElement>(null);

    return (
      <div ref={anchorRef}>
        <Listbox
          show={open}
          options={options}
          onSelect={onSelect}
          anchorEl={anchorRef}
          onShowChange={setOpen}
          listboxId="test-listbox"
        />
      </div>
    );
  }

  render(<Host />);

  await waitFor(() => {
    expect(screen.getByText("Banana")).toBeTruthy();
  });

  fireEvent.click(screen.getByText("Banana"));

  expect(onSelect).toHaveBeenCalledWith(
    expect.objectContaining({ label: "Banana", value: "banana" }),
  );
});

test("it should show empty message when there are no options", async () => {
  render(<ControlledListbox initialOpen listOptions={[]} />);

  await waitFor(() => {
    expect(screen.getByText("No options")).toBeTruthy();
  });
});

test("it should show loading progress bar and text when loading", async () => {
  function Host() {
    const anchorRef = useRef<HTMLDivElement>(null);

    return (
      <div ref={anchorRef}>
        <Listbox
          show
          loading
          options={[]}
          anchorEl={anchorRef}
          listboxId="test-listbox"
        />
      </div>
    );
  }

  render(<Host />);

  await waitFor(() => {
    expect(document.body.querySelector('[role="progressbar"]')).not.toBeNull();
    expect(screen.getByText("Loading...")).toBeTruthy();
  });
});

test("it should use loadingMessage when provided", async () => {
  function Host() {
    const anchorRef = useRef<HTMLDivElement>(null);

    return (
      <div ref={anchorRef}>
        <Listbox
          show
          loading
          options={[]}
          anchorEl={anchorRef}
          listboxId="test-listbox"
          loadingMessage="Fetching..."
        />
      </div>
    );
  }

  render(<Host />);

  await waitFor(() => {
    expect(screen.getByText("Fetching...")).toBeTruthy();
  });
});

test("it should mark selected options with aria-selected", async () => {
  function Host() {
    const anchorRef = useRef<HTMLDivElement>(null);

    return (
      <div ref={anchorRef}>
        <Listbox
          show
          options={options}
          anchorEl={anchorRef}
          listboxId="test-listbox"
          isSelected={(value) => value === "apple"}
        />
      </div>
    );
  }

  render(<Host />);

  await waitFor(() => {
    const apple = screen.getByText("Apple").closest("li");

    expect(apple?.getAttribute("aria-selected")).toBe("true");
  });
});

test("it should render a scroll container with default max height", async () => {
  function Host() {
    const anchorRef = useRef<HTMLDivElement>(null);

    return (
      <div ref={anchorRef}>
        <Listbox
          show
          options={options}
          anchorEl={anchorRef}
          listboxId="test-listbox"
        />
      </div>
    );
  }

  render(<Host />);

  await waitFor(() => {
    expect(screen.getByRole("listbox")).toBeTruthy();
  });

  const scrollContainer = screen
    .getByRole("listbox")
    .closest(".overflow-y-auto");

  expect(scrollContainer).not.toBeNull();
  expect(scrollContainer?.classList.contains("max-h-60")).toBe(true);
});

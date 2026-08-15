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

// ** Core Imports
import { resetLayerStackForTests } from "@bridge-ui/core/Layer";

// ** Local Imports
import { Listbox } from "@/Components/Listbox";
import type { ListboxOption } from "@/Components/Listbox/listbox.types";
import { ListItem } from "@/Components/ListItem";
import { ListSection } from "@/Components/ListSection";

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
    expect(screen.getByText("Loading...")).toBeTruthy();
    expect(document.body.querySelector('[role="progressbar"]')).not.toBeNull();
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
    const apple = screen.getByRole("option", { name: "Apple" });

    expect(apple.getAttribute("aria-selected")).toBe("true");
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

test("it should apply size classes to options and empty message", async () => {
  function Host() {
    const anchorRef = useRef<HTMLDivElement>(null);

    return (
      <div ref={anchorRef}>
        <Listbox
          show
          size="xs"
          options={[]}
          anchorEl={anchorRef}
          listboxId="test-listbox"
        />
      </div>
    );
  }

  render(<Host />);

  await waitFor(() => {
    expect(screen.getByText("No options")).toBeTruthy();
  });

  expect(screen.getByText("No options").className).toContain("text-xs");
});

test("it should apply size classes to option rows", async () => {
  function Host() {
    const anchorRef = useRef<HTMLDivElement>(null);

    return (
      <div ref={anchorRef}>
        <Listbox
          show
          size="xs"
          options={options}
          anchorEl={anchorRef}
          listboxId="test-listbox"
        />
      </div>
    );
  }

  render(<Host />);

  await waitFor(() => {
    expect(screen.getByText("Apple")).toBeTruthy();
  });

  const option = screen.getByRole("option", { name: "Apple" });

  expect(option.className).toContain("px-3");
  expect(screen.getByText("Apple").className).toContain("text-xs");
});

test("it should render section headers from entries", async () => {
  function Host() {
    const anchorRef = useRef<HTMLDivElement>(null);

    return (
      <div ref={anchorRef}>
        <Listbox
          show
          anchorEl={anchorRef}
          listboxId="test-listbox"
          entries={[
            {
              sticky: true,
              type: "section",
              title: "Fruits",
              options: [{ label: "Apple", value: "apple" }],
            },
            {
              type: "option",
              option: { label: "Other", value: "other" },
            },
          ]}
        />
      </div>
    );
  }

  render(<Host />);

  await waitFor(() => {
    expect(screen.getByText("Fruits")).toBeTruthy();
  });

  expect(screen.getByText("Apple")).toBeTruthy();
  expect(screen.getByText("Other")).toBeTruthy();
  expect(screen.getByText("Fruits").closest("li")?.className).toContain(
    "sticky",
  );
});

test("it should render composed ListSection and ListItem children", async () => {
  const onSelect = vi.fn();

  function Host() {
    const anchorRef = useRef<HTMLDivElement>(null);

    return (
      <div ref={anchorRef}>
        <Listbox
          show
          onSelect={onSelect}
          anchorEl={anchorRef}
          listboxId="test-listbox"
          isSelected={(value) => value === "banana"}
        >
          <ListSection sticky title="Fruits" />
          <ListItem value="apple" primary="Apple" />
          <ListItem value="banana" primary="Banana" />
        </Listbox>
      </div>
    );
  }

  render(<Host />);

  await waitFor(() => {
    expect(screen.getByText("Fruits")).toBeTruthy();
  });

  expect(
    screen
      .getByRole("option", { name: "Banana" })
      .getAttribute("aria-selected"),
  ).toBe("true");
  expect(screen.getByRole("option", { name: "Apple" })).toBeTruthy();

  fireEvent.click(screen.getByRole("option", { name: "Apple" }));

  expect(onSelect).toHaveBeenCalledWith(
    expect.objectContaining({ label: "Apple", value: "apple" }),
  );
});

test("it should show footer actions when showFooter is set", async () => {
  function Host() {
    const anchorRef = useRef<HTMLDivElement>(null);

    return (
      <div ref={anchorRef}>
        <Listbox
          show
          showFooter
          options={options}
          anchorEl={anchorRef}
          listboxId="footer-listbox"
        />
      </div>
    );
  }

  render(<Host />);

  await waitFor(() => {
    expect(screen.getByRole("button", { name: "Cancel" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Apply" })).toBeTruthy();
  });
});

test("it should show footer actions for dialog overlays when showFooter is unset", async () => {
  function Host() {
    const anchorRef = useRef<HTMLDivElement>(null);

    return (
      <div ref={anchorRef}>
        <Listbox
          show
          overlay="modal"
          options={options}
          anchorEl={anchorRef}
          listboxId="dialog-footer-listbox"
        />
      </div>
    );
  }

  render(<Host />);

  await waitFor(() => {
    expect(screen.getByRole("button", { name: "Cancel" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Apply" })).toBeTruthy();
  });
});

test("it should call onApply and onCancel from the footer", async () => {
  const onApply = vi.fn();
  const onCancel = vi.fn();

  function Host() {
    const anchorRef = useRef<HTMLDivElement>(null);

    return (
      <div ref={anchorRef}>
        <Listbox
          show
          showFooter
          options={options}
          onApply={onApply}
          onCancel={onCancel}
          anchorEl={anchorRef}
          listboxId="footer-actions-listbox"
        />
      </div>
    );
  }

  render(<Host />);

  await waitFor(() => {
    expect(screen.getByRole("button", { name: "Apply" })).toBeTruthy();
  });

  fireEvent.click(screen.getByRole("button", { name: "Apply" }));
  expect(onApply).toHaveBeenCalled();

  fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
  expect(onCancel).toHaveBeenCalled();
});

test("it should render a custom footer slot and close on apply", async () => {
  const onApply = vi.fn();
  const onShowChange = vi.fn();

  function Host() {
    const anchorRef = useRef<HTMLDivElement>(null);

    return (
      <div ref={anchorRef}>
        <Listbox
          show
          showFooter
          overlay="modal"
          options={options}
          onApply={onApply}
          anchorEl={anchorRef}
          onShowChange={onShowChange}
          listboxId="custom-footer-listbox"
          slots={{
            footer: ({ apply }) => (
              <button type="button" onClick={apply}>
                Save
              </button>
            ),
          }}
        />
      </div>
    );
  }

  render(<Host />);

  await waitFor(() => {
    expect(screen.getByRole("button", { name: "Save" })).toBeTruthy();
  });

  fireEvent.click(screen.getByRole("button", { name: "Save" }));

  expect(onApply).toHaveBeenCalled();
  expect(onShowChange).toHaveBeenCalledWith(false);
});

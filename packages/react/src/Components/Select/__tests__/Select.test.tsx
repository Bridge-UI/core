// ** External Imports
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { useState } from "react";
import { afterEach, expect, test, vi } from "vitest";

// ** Core Imports
import { resetLayerStackForTests } from "@bridge-ui/core/Layer";

// ** Local Imports
import { ListItem } from "@/Components/ListItem";
import { ListSection } from "@/Components/ListSection";
import { Select } from "@/Components/Select";
import type {
  SelectOption,
  SelectProps,
} from "@/Components/Select/select.types";

afterEach(() => {
  cleanup();
  resetLayerStackForTests();
  document.body.innerHTML = "";
});

const options: SelectOption[] = [
  { label: "Apple", value: "apple" },
  { label: "Banana", value: "banana" },
  { label: "Cherry", value: "cherry" },
];

function ControlledSelect(
  props: Omit<SelectProps, "value" | "onChange"> & {
    initialValue?: string | string[];
  },
) {
  const { initialValue = "", ...rest } = props;
  const [value, setValue] = useState(initialValue);

  return <Select {...rest} value={value} onChange={setValue} />;
}

test("it should render the combobox trigger", () => {
  render(<Select options={options} aria-label="Fruit" />);

  expect(screen.getByRole("combobox")).toBeTruthy();
});

test("it should render a label when label prop is provided", () => {
  render(<Select label="Fruit" options={options} />);

  expect(screen.getByText("Fruit")).toBeTruthy();
});

test("it should open the listbox when the field is clicked", async () => {
  render(<Select options={options} aria-label="Fruit" />);

  fireEvent.click(screen.getByRole("combobox").closest(".group\\/field")!);

  await waitFor(() => {
    expect(screen.getByRole("listbox")).toBeTruthy();
  });
});

test("it should select an option and update the value", async () => {
  const onChange = vi.fn();

  render(
    <Select
      value=""
      options={options}
      aria-label="Fruit"
      onChange={onChange}
    />,
  );

  fireEvent.click(screen.getByRole("combobox").closest(".group\\/field")!);

  await waitFor(() => {
    expect(screen.getByText("Banana")).toBeTruthy();
  });

  fireEvent.click(screen.getByText("Banana"));

  expect(onChange).toHaveBeenCalledWith("banana");
});

test("it should keep selection draft until Apply when showFooter is set", async () => {
  const onChange = vi.fn();

  render(
    <Select
      value=""
      showFooter
      options={options}
      aria-label="Fruit"
      onChange={onChange}
    />,
  );

  fireEvent.click(screen.getByRole("combobox").closest(".group\\/field")!);

  await waitFor(() => {
    expect(screen.getByText("Banana")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Apply" })).toBeTruthy();
  });

  fireEvent.click(screen.getByText("Banana"));
  expect(onChange).not.toHaveBeenCalled();
  expect(screen.getByRole("listbox")).toBeTruthy();

  fireEvent.click(screen.getByRole("button", { name: "Apply" }));
  expect(onChange).toHaveBeenCalledWith("banana");
});

test("it should discard draft selection on Cancel when showFooter is set", async () => {
  const onChange = vi.fn();
  const onCancel = vi.fn();

  render(
    <Select
      showFooter
      value="apple"
      options={options}
      aria-label="Fruit"
      onCancel={onCancel}
      onChange={onChange}
    />,
  );

  fireEvent.click(screen.getByRole("combobox").closest(".group\\/field")!);

  await waitFor(() => {
    expect(screen.getByText("Banana")).toBeTruthy();
  });

  fireEvent.click(screen.getByText("Banana"));
  expect(onChange).not.toHaveBeenCalled();

  fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
  expect(onChange).not.toHaveBeenCalled();
  expect(onCancel).toHaveBeenCalled();
});

test("it should open a dialog when overlay is modal", async () => {
  render(
    <Select
      overlay="modal"
      options={options}
      aria-label="Fruit"
      customProps={{
        listbox: {
          customProps: { modal: { transition: "none" } },
        },
      }}
    />,
  );

  fireEvent.click(screen.getByRole("combobox").closest(".group\\/field")!);

  await waitFor(() => {
    expect(document.body.querySelector('[role="dialog"]')).not.toBeNull();
    expect(screen.getByText("Apple")).toBeTruthy();
  });
});

test("it should display the selected option label in single mode", () => {
  render(
    <ControlledSelect
      options={options}
      aria-label="Fruit"
      initialValue="apple"
    />,
  );

  expect((screen.getByRole("combobox") as HTMLInputElement).value).toBe(
    "Apple",
  );
});

test("it should clear the value when clear control is clicked", () => {
  const onChange = vi.fn();

  render(
    <Select
      value="apple"
      options={options}
      aria-label="Fruit"
      onChange={onChange}
    />,
  );

  fireEvent.click(screen.getByLabelText("Clear selection"));

  expect(onChange).toHaveBeenCalledWith("");
});

test("it should not show the clear control when readonly", () => {
  render(
    <Select readonly value="apple" options={options} aria-label="Fruit" />,
  );

  expect(screen.queryByLabelText("Clear selection")).toBeNull();
});

test("it should expose combobox aria attributes when open", async () => {
  render(<Select options={options} aria-label="Fruit" />);

  const combobox = screen.getByRole("combobox");

  expect(combobox.getAttribute("aria-expanded")).toBe("false");

  fireEvent.click(combobox.closest(".group\\/field")!);

  await waitFor(() => {
    expect(combobox.getAttribute("aria-expanded")).toBe("true");
    expect(combobox.getAttribute("aria-controls")).toBeTruthy();
  });
});

test("it should filter options when searchable", async () => {
  render(<Select searchable options={options} aria-label="Fruit" />);

  const combobox = screen.getByRole("combobox");

  fireEvent.click(combobox.closest(".group\\/field")!);

  await waitFor(() => {
    expect(screen.getByRole("listbox")).toBeTruthy();
  });

  fireEvent.input(combobox, { target: { value: "ban" } });

  await waitFor(() => {
    expect(screen.queryByText("Apple")).toBeNull();
    expect(screen.getByText("Banana")).toBeTruthy();
  });
});

test("it should render grouped options with section titles", async () => {
  render(
    <Select
      aria-label="Fruit"
      options={[
        {
          sticky: true,
          title: "Fruits",
          options: [
            { label: "Apple", value: "apple" },
            { label: "Banana", value: "banana" },
          ],
        },
        { label: "Other", value: "other" },
      ]}
    />,
  );

  fireEvent.click(screen.getByRole("combobox").closest(".group\\/field")!);

  await waitFor(() => {
    expect(screen.getByText("Fruits")).toBeTruthy();
  });

  expect(screen.getByText("Apple")).toBeTruthy();
  expect(screen.getByText("Other")).toBeTruthy();
});

test("it should filter within grouped options and drop empty sections", async () => {
  render(
    <Select
      searchable
      aria-label="Fruit"
      options={[
        {
          title: "Fruits",
          options: [
            { label: "Apple", value: "apple" },
            { label: "Banana", value: "banana" },
          ],
        },
        {
          title: "Other",
          options: [{ label: "Carrot", value: "carrot" }],
        },
      ]}
    />,
  );

  const combobox = screen.getByRole("combobox");

  fireEvent.click(combobox.closest(".group\\/field")!);

  await waitFor(() => {
    expect(screen.getByRole("listbox")).toBeTruthy();
  });

  fireEvent.input(combobox, { target: { value: "ban" } });

  await waitFor(() => {
    expect(screen.queryByText("Other")).toBeNull();
    expect(screen.getByText("Banana")).toBeTruthy();
    expect(screen.getByText("Fruits")).toBeTruthy();
    expect(screen.queryByText("Carrot")).toBeNull();
  });
});

test("it should select from composed ListSection and ListItem children", async () => {
  const onChange = vi.fn();

  render(
    <Select value="" aria-label="Fruit" onChange={onChange}>
      <ListSection title="Fruits" />
      <ListItem value="apple" primary="Apple" />
      <ListItem value="banana" primary="Banana" />
    </Select>,
  );

  fireEvent.click(screen.getByRole("combobox").closest(".group\\/field")!);

  await waitFor(() => {
    expect(screen.getByText("Fruits")).toBeTruthy();
  });

  fireEvent.click(screen.getByRole("option", { name: "Apple" }));

  expect(onChange).toHaveBeenCalledWith("apple");
});

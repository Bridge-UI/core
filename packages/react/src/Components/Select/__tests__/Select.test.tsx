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

// ** Local Imports
import { Select } from "@/Components/Select";
import type {
  SelectOption,
  SelectProps,
} from "@/Components/Select/select.types";
import { resetLayerStackForTests } from "@bridge-ui/core";

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
  render(<Select aria-label="Fruit" options={options} />);

  expect(screen.getByRole("combobox")).toBeTruthy();
});

test("it should render a label when label prop is provided", () => {
  render(<Select label="Fruit" options={options} />);

  expect(screen.getByText("Fruit")).toBeTruthy();
});

test("it should open the listbox when the field is clicked", async () => {
  render(<Select aria-label="Fruit" options={options} />);

  fireEvent.click(screen.getByRole("combobox").closest(".group\\/field")!);

  await waitFor(() => {
    expect(screen.getByRole("listbox")).toBeTruthy();
  });
});

test("it should select an option and update the value", async () => {
  const onChange = vi.fn();

  render(
    <Select
      aria-label="Fruit"
      options={options}
      value=""
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

test("it should display the selected option label in single mode", () => {
  render(
    <ControlledSelect
      aria-label="Fruit"
      options={options}
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
      aria-label="Fruit"
      options={options}
      value="apple"
      onChange={onChange}
    />,
  );

  fireEvent.click(screen.getByLabelText("Clear selection"));

  expect(onChange).toHaveBeenCalledWith("");
});

test("it should expose combobox aria attributes when open", async () => {
  render(<Select aria-label="Fruit" options={options} />);

  const combobox = screen.getByRole("combobox");

  expect(combobox.getAttribute("aria-expanded")).toBe("false");

  fireEvent.click(combobox.closest(".group\\/field")!);

  await waitFor(() => {
    expect(combobox.getAttribute("aria-expanded")).toBe("true");
    expect(combobox.getAttribute("aria-controls")).toBeTruthy();
  });
});

test("it should filter options when searchable", async () => {
  render(<Select aria-label="Fruit" options={options} searchable />);

  const combobox = screen.getByRole("combobox");

  fireEvent.click(combobox.closest(".group\\/field")!);

  await waitFor(() => {
    expect(screen.getByRole("listbox")).toBeTruthy();
  });

  fireEvent.input(combobox, { target: { value: "ban" } });

  await waitFor(() => {
    expect(screen.getByText("Banana")).toBeTruthy();
    expect(screen.queryByText("Apple")).toBeNull();
  });
});

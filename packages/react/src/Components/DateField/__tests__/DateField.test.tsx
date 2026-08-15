// ** External Imports
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";

// ** Core Imports
import { resetLayerStackForTests } from "@bridge-ui/core/Layer";

afterEach(() => {
  cleanup();
  resetLayerStackForTests();
});

// ** Local Imports
import { DateField } from "@/Components/DateField";

test("it should render a text input", () => {
  const { container } = render(<DateField />);

  expect(container.querySelector("input")).not.toBeNull();
});

test("it should open the picker on focus", () => {
  render(<DateField defaultValue={new Date(2021, 4, 21)} />);

  fireEvent.focus(screen.getByRole("textbox"));

  expect(screen.getByRole("button", { name: "Select year" })).toBeTruthy();
});

test("it should call onChange when a day is selected", () => {
  const onChange = vi.fn();

  render(<DateField onChange={onChange} defaultValue={new Date(2021, 4, 1)} />);

  fireEvent.focus(screen.getByRole("textbox"));
  fireEvent.click(screen.getByRole("button", { name: "21" }));

  expect(onChange).toHaveBeenCalled();
});

test("it should close the overlay after Apply when showFooter is set", () => {
  const onApply = vi.fn();
  const onChange = vi.fn();

  render(
    <DateField
      showFooter
      onApply={onApply}
      onChange={onChange}
      defaultValue={new Date(2021, 4, 1)}
    />,
  );

  fireEvent.focus(screen.getByRole("textbox"));
  fireEvent.click(screen.getByRole("button", { name: "21" }));
  expect(onChange).not.toHaveBeenCalled();
  expect(screen.getByRole("button", { name: "Apply" })).toBeTruthy();

  fireEvent.click(screen.getByRole("button", { name: "Apply" }));

  expect(onApply).toHaveBeenCalled();
  expect(onChange).toHaveBeenCalled();
  expect(screen.queryByRole("button", { name: "Apply" })).toBeNull();
});

test("it should close the overlay after Cancel when showFooter is set", () => {
  const onChange = vi.fn();
  const onCancel = vi.fn();

  render(
    <DateField
      showFooter
      onChange={onChange}
      onCancel={onCancel}
      defaultValue={new Date(2021, 4, 1)}
    />,
  );

  fireEvent.focus(screen.getByRole("textbox"));
  fireEvent.click(screen.getByRole("button", { name: "21" }));
  expect(onChange).not.toHaveBeenCalled();
  expect(screen.getByRole("button", { name: "Cancel" })).toBeTruthy();

  fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

  expect(onCancel).toHaveBeenCalled();
  expect(onChange).not.toHaveBeenCalled();
  expect(screen.queryByRole("button", { name: "Cancel" })).toBeNull();
});

test("it should pass color to the nested DatePicker", () => {
  render(<DateField color="secondary" defaultValue={new Date(2021, 4, 21)} />);

  fireEvent.focus(screen.getByRole("textbox"));

  const day = screen.getByRole("button", { name: "15" });

  expect(day.className).toMatch(/secondary/);
});

test("it should show the clear control when a value is present", () => {
  render(<DateField defaultValue={new Date(2021, 4, 21)} />);

  expect(screen.getByLabelText("Clear")).toBeTruthy();
});

test("it should not show the clear control when there is no value", () => {
  render(<DateField />);

  expect(screen.queryByLabelText("Clear")).toBeNull();
});

test("it should call onChange and onClear when the clear control is clicked", () => {
  const onChange = vi.fn();
  const onClear = vi.fn();

  render(
    <DateField
      onClear={onClear}
      onChange={onChange}
      defaultValue={new Date(2021, 4, 21)}
    />,
  );

  fireEvent.click(screen.getByLabelText("Clear"));

  expect(onChange).toHaveBeenCalledWith(null);
  expect(onClear).toHaveBeenCalled();
});

test("it should not show the clear control when clearable is false", () => {
  render(<DateField clearable={false} defaultValue={new Date(2021, 4, 21)} />);

  expect(screen.queryByLabelText("Clear")).toBeNull();
});

test("it should open a dialog when overlay is modal", () => {
  render(
    <DateField
      overlay="modal"
      defaultValue={new Date(2021, 4, 21)}
      customProps={{ modal: { transition: "none" } }}
    />,
  );

  fireEvent.focus(screen.getByRole("textbox"));

  const dialog = document.body.querySelector('[role="dialog"]');

  expect(dialog).not.toBeNull();
  expect(dialog?.className).toMatch(/w-fit/);
});

test("it should show footer actions when overlay is modal", () => {
  render(
    <DateField
      overlay="modal"
      defaultValue={new Date(2021, 4, 1)}
      customProps={{ modal: { transition: "none" } }}
    />,
  );

  fireEvent.focus(screen.getByRole("textbox"));

  expect(screen.getByRole("button", { name: "Apply" })).toBeTruthy();
  expect(screen.getByRole("button", { name: "Cancel" })).toBeTruthy();
});

test("it should apply the value and close the modal overlay after Apply", () => {
  const onChange = vi.fn();

  render(
    <DateField
      overlay="modal"
      onChange={onChange}
      defaultValue={new Date(2021, 4, 1)}
      customProps={{ modal: { transition: "none" } }}
    />,
  );

  fireEvent.focus(screen.getByRole("textbox"));
  fireEvent.click(screen.getByRole("button", { name: "21" }));
  fireEvent.click(screen.getByRole("button", { name: "Apply" }));

  expect(onChange).toHaveBeenCalled();
  expect(document.body.querySelector('[role="dialog"]')).toBeNull();
});

test("it should close the modal overlay after Cancel without applying", () => {
  const onChange = vi.fn();

  render(
    <DateField
      overlay="modal"
      onChange={onChange}
      defaultValue={new Date(2021, 4, 1)}
      customProps={{ modal: { transition: "none" } }}
    />,
  );

  fireEvent.focus(screen.getByRole("textbox"));
  fireEvent.click(screen.getByRole("button", { name: "21" }));
  fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

  expect(onChange).not.toHaveBeenCalled();
  expect(document.body.querySelector('[role="dialog"]')).toBeNull();
});

test("it should close the modal overlay when clicking outside the picker", () => {
  render(
    <DateField
      overlay="modal"
      defaultValue={new Date(2021, 4, 21)}
      customProps={{ modal: { transition: "none" } }}
    />,
  );

  fireEvent.focus(screen.getByRole("textbox"));

  expect(document.body.querySelector('[role="dialog"]')).not.toBeNull();

  const wrapper = document.body.querySelector(
    '[data-modal-part="overlay"]',
  )?.nextElementSibling;

  expect(wrapper).not.toBeNull();

  fireEvent.click(wrapper!);

  expect(document.body.querySelector('[role="dialog"]')).toBeNull();
});

test("it should close the modal overlay from a custom footer apply", () => {
  const onChange = vi.fn();

  render(
    <DateField
      overlay="modal"
      onChange={onChange}
      defaultValue={new Date(2021, 4, 1)}
      customProps={{ modal: { transition: "none" } }}
      slots={{
        footer: ({ apply }) => (
          <button type="button" onClick={apply}>
            Save
          </button>
        ),
      }}
    />,
  );

  fireEvent.focus(screen.getByRole("textbox"));
  fireEvent.click(screen.getByRole("button", { name: "21" }));
  fireEvent.click(screen.getByRole("button", { name: "Save" }));

  expect(onChange).toHaveBeenCalled();
  expect(document.body.querySelector('[role="dialog"]')).toBeNull();
});

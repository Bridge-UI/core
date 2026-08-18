// ** External Imports
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";

// ** Core Imports
import { resetLayerStackForTests } from "@bridge-ui/core/Layer";

// ** Local Imports
import { ColorField } from "@/Components/ColorField";

afterEach(() => {
  cleanup();
  resetLayerStackForTests();
});

test("it should keep the input read-only by default", () => {
  render(<ColorField />);

  expect((screen.getByRole("textbox") as HTMLInputElement).readOnly).toBe(true);
});

test("it should unlock the input when editable is set", () => {
  render(<ColorField editable />);

  expect((screen.getByRole("textbox") as HTMLInputElement).readOnly).toBe(
    false,
  );
});

test("it should show the formatted value", () => {
  render(<ColorField defaultValue="#ea1212" />);

  expect((screen.getByRole("textbox") as HTMLInputElement).value).toBe(
    "#ea1212",
  );
});

test("it should format rgba in the field", () => {
  render(<ColorField format="rgba" defaultValue="#ea1212" />);

  expect((screen.getByRole("textbox") as HTMLInputElement).value).toBe(
    "rgba(234, 18, 18, 1)",
  );
});

test("it should render the start swatch", () => {
  const { container } = render(<ColorField defaultValue="#ea1212" />);

  expect(container.querySelector("[aria-hidden]")).toBeTruthy();
});

test("it should open the picker on focus", () => {
  render(<ColorField defaultValue="#ea1212" />);

  fireEvent.focus(screen.getByRole("textbox"));

  expect(
    screen.getByRole("slider", { name: "Saturation and brightness" }),
  ).toBeTruthy();
});

test("it should call onChange when a swatch is selected", () => {
  const onChange = vi.fn();

  render(
    <ColorField
      onChange={onChange}
      defaultValue="#000000"
      swatches={["#ea1212"]}
    />,
  );

  fireEvent.focus(screen.getByRole("textbox"));
  fireEvent.click(screen.getByRole("button", { name: "#ea1212" }));

  expect(onChange).toHaveBeenCalledWith("#ea1212");
});

test("it should close the overlay after Apply when showFooter is set", () => {
  const onApply = vi.fn();
  const onChange = vi.fn();
  const onClose = vi.fn();

  render(
    <ColorField
      showFooter
      onApply={onApply}
      onClose={onClose}
      onChange={onChange}
      defaultValue="#000000"
      swatches={["#ea1212"]}
    />,
  );

  fireEvent.focus(screen.getByRole("textbox"));
  fireEvent.click(screen.getByRole("button", { name: "#ea1212" }));
  expect(onChange).not.toHaveBeenCalled();
  expect(screen.getByRole("button", { name: "Apply" })).toBeTruthy();

  fireEvent.click(screen.getByRole("button", { name: "Apply" }));

  expect(onApply).toHaveBeenCalledTimes(1);
  expect(onChange).toHaveBeenCalledWith("#ea1212");
  expect(onClose).toHaveBeenCalledTimes(1);
  expect(screen.queryByRole("button", { name: "Apply" })).toBeNull();
});

test("it should show the clear control when a value is present", () => {
  render(<ColorField defaultValue="#ea1212" />);

  expect(screen.getByLabelText("Clear")).toBeTruthy();
});

test("it should not show the clear control when there is no value", () => {
  render(<ColorField />);

  expect(screen.queryByLabelText("Clear")).toBeNull();
});

test("it should call onChange and onClear when the clear control is clicked", () => {
  const onChange = vi.fn();
  const onClear = vi.fn();

  render(
    <ColorField onClear={onClear} onChange={onChange} defaultValue="#ea1212" />,
  );

  fireEvent.click(screen.getByLabelText("Clear"));

  expect(onChange).toHaveBeenCalledWith(null);
  expect(onClear).toHaveBeenCalled();
});

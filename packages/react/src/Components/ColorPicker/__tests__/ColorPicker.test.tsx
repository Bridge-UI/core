// ** External Imports
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";

// ** Local Imports
import { ColorPicker } from "@/Components/ColorPicker";

afterEach(() => {
  cleanup();
});

test("it should render the saturation area", () => {
  render(<ColorPicker defaultValue="#ea1212" />);

  expect(
    screen.getByRole("slider", { name: "Saturation and brightness" }),
  ).toBeTruthy();
  expect(screen.getByRole("slider", { name: "Hue" })).toBeTruthy();
});

test("it should show the formatted value", () => {
  render(<ColorPicker defaultValue="#ea1212" />);

  expect(screen.getByText("#ea1212")).toBeTruthy();
});

test("it should serialize rgba when format is rgba", () => {
  render(<ColorPicker format="rgba" defaultValue="#ea1212" />);

  expect(screen.getByText("rgba(234, 18, 18, 1)")).toBeTruthy();
});

test("it should show the alpha slider for rgba", () => {
  render(<ColorPicker format="rgba" defaultValue="#ea1212" />);

  expect(screen.getByRole("slider", { name: "Alpha" })).toBeTruthy();
});

test("it should hide the alpha slider for hex by default", () => {
  render(<ColorPicker defaultValue="#ea1212" />);

  expect(screen.queryByRole("slider", { name: "Alpha" })).toBeNull();
});

test("it should commit a preset swatch immediately without footer", () => {
  const onChange = vi.fn();

  render(
    <ColorPicker
      onChange={onChange}
      defaultValue="#000000"
      swatches={["#ea1212", "#2563eb"]}
    />,
  );

  fireEvent.click(screen.getByRole("button", { name: "#ea1212" }));

  expect(onChange).toHaveBeenCalledWith("#ea1212");
});

test("it should show footer actions when showFooter is set", () => {
  render(<ColorPicker showFooter />);

  expect(screen.getByRole("button", { name: "Cancel" })).toBeTruthy();
  expect(screen.getByRole("button", { name: "Apply" })).toBeTruthy();
});

test("it should commit draft value on Apply", () => {
  const onChange = vi.fn();

  render(
    <ColorPicker
      showFooter
      onChange={onChange}
      defaultValue="#000000"
      swatches={["#ea1212"]}
    />,
  );

  fireEvent.click(screen.getByRole("button", { name: "#ea1212" }));
  expect(onChange).not.toHaveBeenCalled();

  fireEvent.click(screen.getByRole("button", { name: "Apply" }));
  expect(onChange).toHaveBeenCalledWith("#ea1212");
});

// ** External Imports
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";

afterEach(() => {
  cleanup();
});

// ** Core Imports
import { resetLayerStackForTests } from "@bridge-ui/core/Layer";

// ** Local Imports
import { Slider } from "@/Components/Slider";

afterEach(() => {
  resetLayerStackForTests();
});

test("it should render a slider thumb with role slider", () => {
  render(<Slider label="Volume" />);

  expect(screen.getByRole("slider", { name: "Volume" })).not.toBeNull();
});

test("it should render label corner and description chrome", () => {
  render(
    <Slider corner="%" label="Opacity" description="Adjust transparency" />,
  );

  expect(screen.getByText("%")).not.toBeNull();
  expect(screen.getByText("Opacity")).not.toBeNull();
  expect(screen.getByText("Adjust transparency")).not.toBeNull();
});

test("it should render two thumbs when range is enabled", () => {
  render(<Slider range defaultValue={[20, 80]} />);

  expect(screen.getAllByRole("slider")).toHaveLength(2);
});

test("it should call onChange when using keyboard arrows", () => {
  const onChange = vi.fn();

  render(<Slider value={40} label="Volume" onChange={onChange} />);

  fireEvent.keyDown(screen.getByRole("slider"), { key: "ArrowRight" });

  expect(onChange).toHaveBeenCalledWith(41);
});

test("it should respect min max and step on keyboard", () => {
  const onChange = vi.fn();

  render(
    <Slider
      min={0}
      max={100}
      step={10}
      value={20}
      label="Volume"
      onChange={onChange}
    />,
  );

  fireEvent.keyDown(screen.getByRole("slider"), { key: "ArrowRight" });

  expect(onChange).toHaveBeenCalledWith(30);
});

test("it should hide tooltip when showTooltip is false", () => {
  render(<Slider label="Volume" defaultValue={50} showTooltip={false} />);

  fireEvent.focus(screen.getByRole("slider"));

  expect(screen.queryByRole("tooltip")).toBeNull();
});

test("it should show tooltip on focus by default", () => {
  render(<Slider label="Volume" defaultValue={50} />);

  fireEvent.focus(screen.getByRole("slider"));

  expect(screen.getByRole("tooltip").textContent).toContain("50");
});

test("it should render stop labels", () => {
  render(
    <Slider
      showStops
      label="Rating"
      stops={[
        { value: 0, label: "Low" },
        { value: 100, label: "High" },
      ]}
    />,
  );

  expect(screen.getByText("Low")).not.toBeNull();
  expect(screen.getByText("High")).not.toBeNull();
});

test("it should show error message when invalid", () => {
  render(<Slider error label="Volume" errorMessage="Value is required" />);

  expect(screen.getByText("Value is required")).not.toBeNull();
});

test("it should render start and end slots from BaseField", () => {
  render(
    <Slider
      label="Volume"
      slots={{
        end: <span data-testid="slider-end">%</span>,
        start: <span data-testid="slider-start">$</span>,
      }}
    />,
  );

  expect(screen.getByTestId("slider-end")).not.toBeNull();
  expect(screen.getByTestId("slider-start")).not.toBeNull();
});

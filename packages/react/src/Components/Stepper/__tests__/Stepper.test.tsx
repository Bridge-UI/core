// ** External Imports
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { afterEach, expect, test, vi } from "vitest";

// ** Local Imports
import { Step } from "@/Components/Step";
import { Stepper } from "@/Components/Stepper";

afterEach(() => {
  cleanup();
});

function BasicStepper({
  onChange,
  linear = true,
  activeStep: controlled,
}: {
  activeStep?: number;
  linear?: boolean;
  onChange?: (step: number) => void;
}) {
  const [activeStep, setActiveStep] = useState(controlled ?? 1);

  return (
    <Stepper
      linear={linear}
      activeStep={controlled ?? activeStep}
      onChange={(next) => {
        setActiveStep(next);
        onChange?.(next);
      }}
    >
      <Step label="Account" />
      <Step label="Profile" />
      <Step disabled label="Confirm" />
    </Stepper>
  );
}

test("it should mark the active step with aria-current", () => {
  render(<BasicStepper />);

  expect(
    screen
      .getByRole("button", { name: /Profile/i })
      .getAttribute("aria-current"),
  ).toBe("step");
  expect(
    screen
      .getByRole("button", { name: /Account/i })
      .getAttribute("aria-current"),
  ).toBeNull();
});

test("it should select a completed step when clicked in linear mode", () => {
  const onChange = vi.fn();

  render(<BasicStepper onChange={onChange} />);

  fireEvent.click(screen.getByRole("button", { name: /Account/i }));

  expect(onChange).toHaveBeenCalledWith(0);
});

test("it should not select an upcoming step in linear mode", () => {
  const onChange = vi.fn();

  render(
    <Stepper activeStep={0} onChange={onChange}>
      <Step label="Account" />
      <Step label="Profile" />
    </Stepper>,
  );

  fireEvent.click(screen.getByText("Profile"));

  expect(onChange).not.toHaveBeenCalled();
});

test("it should select an upcoming step when linear is false", () => {
  const onChange = vi.fn();

  render(
    <Stepper linear={false} activeStep={0} onChange={onChange}>
      <Step label="Account" />
      <Step label="Profile" />
    </Stepper>,
  );

  fireEvent.click(screen.getByRole("button", { name: /Profile/i }));

  expect(onChange).toHaveBeenCalledWith(1);
});

test("it should not select a disabled step", () => {
  const onChange = vi.fn();

  render(<BasicStepper linear={false} onChange={onChange} />);

  fireEvent.click(screen.getByText("Confirm"));

  expect(onChange).not.toHaveBeenCalled();
});

test("it should show vertical step content for the active step", () => {
  render(
    <Stepper activeStep={1} orientation="vertical">
      <Step label="Cart">Cart details</Step>
      <Step label="Shipping">Shipping form</Step>
    </Stepper>,
  );

  expect(screen.getByText("Shipping form")).toBeTruthy();
  expect(screen.queryByText("Cart details")).toBeNull();
});

test("it should apply vertical orientation classes on the list", () => {
  const { container } = render(
    <Stepper activeStep={0} orientation="vertical">
      <Step label="Account" />
    </Stepper>,
  );

  expect(container.querySelector("ol")?.className).toContain("flex-col");
});

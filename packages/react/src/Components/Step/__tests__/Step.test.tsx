// ** External Imports
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";

// ** Local Imports
import { Step } from "@/Components/Step";
import { Stepper } from "@/Components/Stepper";

afterEach(() => {
  cleanup();
});

test("it should render the label and a numeric indicator", () => {
  render(
    <Stepper activeStep={0}>
      <Step label="Account" />
    </Stepper>,
  );

  expect(screen.getByRole("button", { name: /Account/i })).toBeTruthy();
  expect(screen.getByText("1")).toBeTruthy();
});

test("it should wire aria-controls when vertical content is shown", () => {
  render(
    <Stepper activeStep={0} orientation="vertical">
      <Step label="Account">Account form</Step>
    </Stepper>,
  );

  const trigger = screen.getByRole("button", { name: /Account/i });
  const contentId = trigger.getAttribute("aria-controls");

  expect(contentId).toBeTruthy();
  expect(document.getElementById(contentId!)).toBeTruthy();
  expect(screen.getByText("Account form")).toBeTruthy();
});

test("it should show a description when provided", () => {
  render(
    <Stepper activeStep={0}>
      <Step label="Cart" description="Review items" />
    </Stepper>,
  );

  expect(screen.getByText("Review items")).toBeTruthy();
});

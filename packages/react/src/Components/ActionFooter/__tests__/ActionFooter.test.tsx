// ** External Imports
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";

// ** Local Imports
import { ActionFooter } from "@/Components/ActionFooter";
import { BridgeUIProvider } from "@/Provider";

afterEach(() => {
  cleanup();
});

test("it should render Cancel and Apply", () => {
  render(<ActionFooter />);

  expect(screen.getByRole("button", { name: "Cancel" })).toBeTruthy();
  expect(screen.getByRole("button", { name: "Apply" })).toBeTruthy();
});

test("it should apply default Apply and Cancel colors", () => {
  render(<ActionFooter />);

  expect(screen.getByRole("button", { name: "Apply" }).className).toContain(
    "bg-primary-500",
  );
  expect(
    screen.getByRole("button", { name: "Cancel" }).className,
  ).not.toContain("bg-primary-500");
});

test("it should call onApply and onCancel when the buttons are clicked", () => {
  const onApply = vi.fn();
  const onCancel = vi.fn();

  render(<ActionFooter onApply={onApply} onCancel={onCancel} />);

  fireEvent.click(screen.getByRole("button", { name: "Apply" }));
  fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

  expect(onApply).toHaveBeenCalledOnce();
  expect(onCancel).toHaveBeenCalledOnce();
});

test("it should let customProps.applyButton color win over applyColor", () => {
  render(
    <ActionFooter
      applyColor="info"
      customProps={{ applyButton: { color: "error" } }}
    />,
  );

  expect(screen.getByRole("button", { name: "Apply" }).className).toContain(
    "bg-error-500",
  );
});

test("it should apply ActionFooter defaultProps from BridgeUIProvider", () => {
  render(
    <BridgeUIProvider
      components={{
        ActionFooter: { defaultProps: { applyColor: "info" } },
      }}
    >
      <ActionFooter />
    </BridgeUIProvider>,
  );

  expect(screen.getByRole("button", { name: "Apply" }).className).toContain(
    "bg-info-500",
  );
});

test("it should render custom labels", () => {
  render(<ActionFooter applyLabel="Save" cancelLabel="Discard" />);

  expect(screen.getByRole("button", { name: "Save" })).toBeTruthy();
  expect(screen.getByRole("button", { name: "Discard" })).toBeTruthy();
});

// ** External Imports
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";

// ** Local Imports
import { Chip } from "@/Components/Chip";

afterEach(() => {
  cleanup();
});

test("it should render the label", () => {
  render(<Chip label="Alpha" />);

  expect(screen.getByText("Alpha")).toBeTruthy();
});

test("it should render children instead of label when both are provided", () => {
  render(<Chip label="Alpha">Beta</Chip>);

  expect(screen.getByText("Beta")).toBeTruthy();
  expect(screen.queryByText("Alpha")).toBeNull();
});

test("it should apply size classes to the label", () => {
  render(<Chip size="xs" label="Small" />);

  expect(screen.getByText("Small").className).toContain("text-xs");
});

test("it should call onDismiss when dismissible clear is clicked", () => {
  const onDismiss = vi.fn();

  render(<Chip dismissible label="Alpha" onDismiss={onDismiss} />);

  fireEvent.click(screen.getByRole("button", { name: "Remove" }));

  expect(onDismiss).toHaveBeenCalledOnce();
});

test("it should not render the dismiss control when dismissible is false", () => {
  render(<Chip label="Alpha" />);

  expect(screen.queryByRole("button", { name: "Remove" })).toBeNull();
});

// ** External Imports
import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";

afterEach(() => {
  document.body.innerHTML = "";
});

// ** Local Imports
import { Snackbar } from "@/Components/Snackbar";

test("it should render title and description when show is true", () => {
  render(
    <Snackbar
      show
      title="Hello"
      description="World"
      transition="none"
      duration={false}
    />,
  );

  expect(screen.getByText("Hello")).toBeTruthy();
  expect(screen.getByText("World")).toBeTruthy();
});

test("it should call onShowChange when close button is clicked", () => {
  const onShowChange = vi.fn();

  render(
    <Snackbar
      show
      title="Close me"
      transition="none"
      duration={false}
      onShowChange={onShowChange}
    />,
  );

  fireEvent.click(screen.getByLabelText("Close"));

  expect(onShowChange).toHaveBeenCalledWith(false);
});

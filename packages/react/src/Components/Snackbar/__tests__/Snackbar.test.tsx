// ** External Imports
import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";

// ** Core Imports
import { resetLayerStackForTests } from "@bridge-ui/core";

afterEach(() => {
  resetLayerStackForTests();
  document.body.innerHTML = "";
  document.body.style.overflow = "";
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

test("standalone snackbars should stack with increasing z-index", () => {
  render(
    <>
      <Snackbar show title="One" transition="none" duration={false} />
      <Snackbar show title="Two" transition="none" duration={false} />
    </>,
  );

  const layers = document.body.querySelectorAll("[data-snackbar-layer]");

  expect(layers.length).toBe(2);

  const firstZ = Number((layers[0] as HTMLElement).style.zIndex);
  const secondZ = Number((layers[1] as HTMLElement).style.zIndex);

  expect(secondZ).toBeGreaterThan(firstZ);
});

test("standalone snackbar should not lock body scroll", () => {
  render(<Snackbar show title="Toast" transition="none" duration={false} />);

  expect(document.body.style.overflow).not.toBe("hidden");
});

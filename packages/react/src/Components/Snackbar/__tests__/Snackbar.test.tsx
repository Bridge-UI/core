// ** External Imports
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { Fragment } from "react";
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

test("it should not render when show is false", () => {
  render(<Snackbar show={false} title="Hidden" duration={false} />);

  expect(
    document.body.querySelector('[data-snackbar-part="panel"]'),
  ).toBeNull();
});

test("it should render in a portal when show is true", () => {
  render(
    <Snackbar show title="Toast" duration={false} transition="none">
      Body
    </Snackbar>,
  );

  expect(screen.getByRole("status")).toBeTruthy();
  expect(document.body.textContent).toContain("Toast");
  expect(document.body.textContent).toContain("Body");
  expect(document.body.querySelector("[data-snackbar-layer]")).not.toBeNull();
});

test("it should call onClose when close button is clicked", () => {
  const onClose = vi.fn();

  render(
    <Snackbar
      show
      title="Close me"
      duration={false}
      transition="none"
      onClose={onClose}
    />,
  );

  fireEvent.click(screen.getByLabelText("Close"));

  expect(onClose).toHaveBeenCalledOnce();
});

test("it should call onShowChange on escape keydown", () => {
  const onShowChange = vi.fn();

  render(
    <Snackbar
      show
      title="Dismiss"
      duration={false}
      transition="none"
      onShowChange={onShowChange}
    />,
  );

  window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));

  expect(onShowChange).toHaveBeenCalledWith(false);
});

test("it should apply top-center position classes on the portal layer", () => {
  render(
    <Snackbar
      show
      title="Top"
      duration={false}
      transition="none"
      position="top-center"
    />,
  );

  const layer = document.body.querySelector("[data-snackbar-layer]");

  expect(layer?.className).toContain("items-start");
  expect(layer?.className).toContain("justify-center");
});

test("it should render title and description when show is true", () => {
  render(
    <Snackbar
      show
      title="Hello"
      duration={false}
      transition="none"
      description="World"
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
      duration={false}
      transition="none"
      onShowChange={onShowChange}
    />,
  );

  fireEvent.click(screen.getByLabelText("Close"));

  expect(onShowChange).toHaveBeenCalledWith(false);
});

test("it should stack with increasing z-index", () => {
  render(
    <Fragment>
      <Snackbar show title="One" duration={false} transition="none" />
      <Snackbar show title="Two" duration={false} transition="none" />
    </Fragment>,
  );

  const layers = document.body.querySelectorAll("[data-snackbar-layer]");

  expect(layers.length).toBe(2);

  const firstZ = Number((layers[0] as HTMLElement).style.zIndex);
  const secondZ = Number((layers[1] as HTMLElement).style.zIndex);

  expect(secondZ).toBeGreaterThan(firstZ);
});

test("it should apply rounded classes when rounded prop is set", () => {
  render(
    <Snackbar
      show
      rounded="xl"
      title="Rounded"
      duration={false}
      transition="none"
    />,
  );

  const panel = document.body.querySelector('[data-snackbar-part="panel"]');

  expect(panel?.classList.contains("rounded-xl")).toBe(true);
});

test("it should not lock body scroll", () => {
  render(<Snackbar show title="Toast" duration={false} transition="none" />);

  expect(document.body.style.overflow).not.toBe("hidden");
});

test("it should stay open when reopened before the leave transition ends", async () => {
  const onShowChange = vi.fn();

  const { rerender } = render(
    <Snackbar
      show
      title="First"
      duration={false}
      transition="slide"
      onShowChange={onShowChange}
    />,
  );

  await waitFor(() => {
    expect(screen.getByRole("status")).toBeTruthy();
  });

  rerender(
    <Snackbar
      show={false}
      title="First"
      duration={false}
      transition="slide"
      onShowChange={onShowChange}
    />,
  );

  rerender(
    <Snackbar
      show
      title="Second"
      duration={false}
      transition="slide"
      onShowChange={onShowChange}
    />,
  );

  const panel = document.body.querySelector('[data-snackbar-part="panel"]');

  act(() => {
    fireEvent.transitionEnd(panel!, {
      elapsedTime: 0.3,
      propertyName: "transform",
    });
  });

  await waitFor(() => {
    expect(document.body.textContent).toContain("Second");
  });

  expect(onShowChange).not.toHaveBeenCalledWith(false);
});

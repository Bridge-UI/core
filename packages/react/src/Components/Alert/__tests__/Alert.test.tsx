// ** External Imports
import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";

// ** Local Imports
import { Alert } from "@/Components/Alert";

test("it should render the root element", () => {
  const { container } = render(<Alert />);

  expect(container.querySelector(".w-full")).not.toBeNull();
});

test("it should render a title when title prop is provided", () => {
  render(<Alert title="Heads up!" />);

  expect(screen.getByText("Heads up!")).toBeTruthy();
});

test("it should render body content via children", () => {
  render(<Alert title="Info">This is the body content</Alert>);

  expect(screen.getByText("This is the body content")).toBeTruthy();
});

test("it should render the default icon for error color", () => {
  const { container } = render(<Alert title="Error" color="error" />);

  expect(container.querySelector("svg")).not.toBeNull();
});

test("it should not render an icon when icon is null", () => {
  const { container } = render(<Alert title="No icon" icon={null} />);

  expect(container.querySelector("svg")).toBeNull();
});

test("it should apply rounded classes when rounded prop is set", () => {
  const { container } = render(<Alert title="Rounded" rounded="lg" />);

  expect(
    container.querySelector(".w-full")?.classList.contains("rounded-lg"),
  ).toBe(true);
});

test("it should apply shadow classes when shadow prop is set", () => {
  const { container } = render(<Alert title="Shadow" shadow="md" />);

  expect(
    container.querySelector(".w-full")?.classList.contains("shadow-md"),
  ).toBe(true);
});

test("it should render footer slot content", () => {
  render(
    <Alert
      title="With footer"
      slots={{ footer: <span>Footer content</span> }}
    />,
  );

  expect(screen.getByText("Footer content")).toBeTruthy();
});

test("it should render action slot content", () => {
  render(
    <Alert
      title="With action"
      slots={{ action: <button type="button">Dismiss</button> }}
    />,
  );

  expect(screen.getByText("Dismiss")).toBeTruthy();
});

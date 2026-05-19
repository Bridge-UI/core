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

test("it should merge className with root classes", () => {
  const { container } = render(
    <Alert title="Custom class" className="custom-alert" />,
  );

  const root = container.querySelector(".w-full");

  expect(root?.classList.contains("custom-alert")).toBe(true);
});

test("it should forward additional attributes to the root element", () => {
  const { container } = render(
    <Alert title="With id" id="alert-root" data-testid="alert" />,
  );

  const root = container.querySelector("#alert-root");

  expect(root).not.toBeNull();
  expect(root?.getAttribute("data-testid")).toBe("alert");
});

test("it should apply user className after classes.root (tailwind-merge)", () => {
  const { container } = render(
    <Alert className="p-4" title="Priority" classes={{ root: "p-2" }} />,
  );

  const root = container.querySelector(".w-full");

  expect(root?.classList.contains("p-4")).toBe(true);
  expect(root?.classList.contains("p-2")).toBe(false);
});

test("it should forward partsProps to the default icon", () => {
  const { container } = render(
    <Alert title="Notice" partsProps={{ icon: { id: "alert-icon" } }} />,
  );

  expect(container.querySelector("#alert-icon")).toBeTruthy();
});

test("it should forward partsProps to title and body containers", () => {
  const { container } = render(
    <Alert
      title="Title"
      partsProps={{
        body: { id: "alert-body" },
        title: { id: "alert-title" },
      }}
    >
      Body text
    </Alert>,
  );

  expect(container.querySelector("#alert-body")).toBeTruthy();
  expect(container.querySelector("#alert-title")).toBeTruthy();
});

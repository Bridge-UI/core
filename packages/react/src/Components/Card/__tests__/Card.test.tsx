// ** External Imports
import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";

// ** Local Imports
import { Card } from "@/Components/Card";

test("it should render the root element", () => {
  const { container } = render(<Card />);

  expect(container.querySelector(".flex.w-full.flex-col")).not.toBeNull();
});

test("it should render a title when title prop is provided", () => {
  render(<Card title="Card title" />);

  expect(screen.getByText("Card title")).toBeTruthy();
});

test("it should render body content via children", () => {
  render(<Card title="Info">This is the body content</Card>);

  expect(screen.getByText("This is the body content")).toBeTruthy();
});

test("it should apply rounded classes when rounded prop is set", () => {
  const { container } = render(<Card title="Rounded" rounded="lg" />);

  expect(
    container.querySelector(".flex.w-full")?.classList.contains("rounded-lg"),
  ).toBe(true);
});

test("it should apply shadow classes for elevated variant", () => {
  const { container } = render(
    <Card title="Shadow" variant="elevated" shadow="md" />,
  );

  expect(
    container.querySelector(".flex.w-full")?.classList.contains("shadow-md"),
  ).toBe(true);
});

test("it should not apply shadow for flat variant", () => {
  const { container } = render(
    <Card title="Flat" variant="flat" shadow="md" />,
  );

  const root = container.querySelector(".flex.w-full");

  expect(root?.className.includes("shadow")).toBe(false);
});

test("it should apply outlined border on root", () => {
  const { container } = render(<Card title="Outlined" variant="outlined" />);

  const root = container.querySelector(".flex.w-full");

  expect(root?.classList.contains("border")).toBe(true);
});

test("it should render footer slot content", () => {
  render(
    <Card
      title="With footer"
      slots={{ footer: <span>Footer content</span> }}
    />,
  );

  expect(screen.getByText("Footer content")).toBeTruthy();
});

test("it should render action slot content", () => {
  render(
    <Card
      title="With action"
      slots={{ action: <button type="button">Action</button> }}
    />,
  );

  expect(screen.getByText("Action")).toBeTruthy();
});

test("it should render header slot content", () => {
  render(<Card slots={{ header: <span>Custom header</span> }}>Body</Card>);

  expect(screen.getByText("Custom header")).toBeTruthy();
});

test("it should merge className with root classes", () => {
  const { container } = render(
    <Card title="Custom class" className="custom-card" />,
  );

  const root = container.querySelector(".flex.w-full");

  expect(root?.classList.contains("custom-card")).toBe(true);
});

test("it should forward additional attributes to the root element", () => {
  const { container } = render(
    <Card title="With id" id="card-root" data-testid="card" />,
  );

  const root = container.querySelector("#card-root");

  expect(root).not.toBeNull();
  expect(root?.getAttribute("data-testid")).toBe("card");
});

test("it should apply user className after classes.root (tailwind-merge)", () => {
  const { container } = render(
    <Card className="p-4" title="Priority" classes={{ root: "p-2" }} />,
  );

  const root = container.querySelector(".flex.w-full");

  expect(root?.classList.contains("p-4")).toBe(true);
  expect(root?.classList.contains("p-2")).toBe(false);
});

test("it should forward partsProps to title and body containers", () => {
  const { container } = render(
    <Card
      title="Title"
      partsProps={{
        body: { id: "card-body" },
        title: { id: "card-title" },
      }}
    >
      Body text
    </Card>,
  );

  expect(container.querySelector("#card-body")).toBeTruthy();
  expect(container.querySelector("#card-title")).toBeTruthy();
});

test("it should forward partsProps to footer container", () => {
  const { container } = render(
    <Card
      title="Title"
      slots={{ footer: <span>Footer</span> }}
      partsProps={{ footer: { id: "card-footer" } }}
    />,
  );

  expect(container.querySelector("#card-footer")).toBeTruthy();
});

test("it should omit header border when borderless is true", () => {
  const { container } = render(<Card title="Borderless" borderless />);

  expect(container.querySelector(".border-b")).toBeNull();
});

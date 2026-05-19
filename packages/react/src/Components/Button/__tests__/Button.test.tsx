// ** External Imports
import { cleanup, render, screen } from "@testing-library/react";
import { CircleAlert } from "lucide-react";
import { afterEach, expect, test } from "vitest";

afterEach(() => {
  cleanup();
});

// ** Local Imports
import { Button } from "@/Components/Button";

test("it should render a button with children", () => {
  render(<Button>Click me</Button>);

  const button = screen.getByRole("button", { name: "Click me" });

  expect(button).toBeTruthy();
});

test("it should apply disabled attribute when disabled", () => {
  render(<Button disabled>Disabled</Button>);

  const button = screen.getByRole("button", { name: "Disabled" });

  expect((button as HTMLButtonElement).disabled).toBe(true);
});

test("it should show loading spinner when loading", () => {
  const { container } = render(<Button loading>Saving</Button>);

  const button = screen.getByRole("button");

  expect(button.getAttribute("aria-busy")).toBe("true");
  expect(container.querySelector("svg.animate-spin")).not.toBeNull();
  expect(screen.queryByText("Saving")).toBeNull();
});

test("it should render text prop when children are not provided", () => {
  render(<Button text="Click me" />);

  expect(screen.getByRole("button", { name: "Click me" })).toBeTruthy();
});

test("it should prefer text prop over children", () => {
  render(<Button text="From prop">From children</Button>);

  expect(screen.queryByText("From children")).toBeNull();
  expect(screen.getByRole("button", { name: "From prop" })).toBeTruthy();
});

test("it should replace text with spinner when loading", () => {
  const { container } = render(<Button loading text="Saving" />);

  expect(screen.queryByText("Saving")).toBeNull();
  expect(container.querySelector("svg.animate-spin")).not.toBeNull();
});

test("it should render start icon when startIcon prop is set", () => {
  const { container } = render(
    <Button startIcon={CircleAlert}>With icon</Button>,
  );

  expect(container.querySelector("button svg")).not.toBeNull();
});

test("it should render as anchor when as is a", () => {
  render(
    <Button as="a" href="https://example.com">
      Link
    </Button>,
  );

  const link = screen.getByRole("link", { name: "Link" });

  expect(link.getAttribute("href")).toBe("https://example.com");
});

test("it should apply full width class when full is true", () => {
  const { container } = render(<Button full>Full</Button>);

  expect(container.querySelector("button")?.classList.contains("w-full")).toBe(
    true,
  );
});

test("it should render start slot content", () => {
  render(
    <Button slots={{ start: <span data-testid="start-slot">◀</span> }}>
      Label
    </Button>,
  );

  expect(screen.getByText("Label")).toBeTruthy();
  expect(screen.getByTestId("start-slot")).toBeTruthy();
});

test("it should merge className with root classes", () => {
  const { container } = render(
    <Button className="custom-button">Styled</Button>,
  );

  expect(
    container.querySelector("button")?.classList.contains("custom-button"),
  ).toBe(true);
});

test("it should forward additional attributes to the root element", () => {
  render(
    <Button id="submit-btn" data-testid="button">
      Submit
    </Button>,
  );

  const button = screen.getByRole("button", { name: "Submit" });

  expect(button.id).toBe("submit-btn");
  expect(button.getAttribute("data-testid")).toBe("button");
});

test("it should apply user className after classes.root (tailwind-merge)", () => {
  const { container } = render(
    <Button className="p-4" classes={{ root: "p-2" }}>
      Priority
    </Button>,
  );

  const root = container.querySelector("button");

  expect(root?.classList.contains("p-4")).toBe(true);
  expect(root?.classList.contains("p-2")).toBe(false);
});

test("it should forward partsProps to icon sub-parts", () => {
  const { container } = render(
    <Button
      text="Save"
      startIcon={CircleAlert}
      partsProps={{
        startIcon: { id: "start-icon" },
      }}
    />,
  );

  expect(container.querySelector("#start-icon")).toBeTruthy();
});

test("it should forward partsProps to slot wrappers", () => {
  const { container } = render(
    <Button
      text="Label"
      slots={{ start: "◀" }}
      partsProps={{
        start: { "data-testid": "start-slot" },
      }}
    />,
  );

  expect(container.querySelector('[data-testid="start-slot"]')).toBeTruthy();
});

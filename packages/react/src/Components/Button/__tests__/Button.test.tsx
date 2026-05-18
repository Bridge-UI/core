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

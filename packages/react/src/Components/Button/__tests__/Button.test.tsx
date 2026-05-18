// ** External Imports
import { render, screen } from "@testing-library/react";
import { CircleAlert } from "lucide-react";
import { expect, test } from "vitest";

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

  const button = screen.getByRole("button", { name: "Saving" });

  expect(button.getAttribute("aria-busy")).toBe("true");
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

  expect(screen.getByTestId("start-slot")).toBeTruthy();
  expect(screen.getByText("Label")).toBeTruthy();
});

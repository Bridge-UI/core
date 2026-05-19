// ** External Imports
import { cleanup, render, screen } from "@testing-library/react";
import { Settings } from "lucide-react";
import { afterEach, expect, test } from "vitest";

afterEach(() => {
  cleanup();
});

// ** Local Imports
import { MiniButton } from "@/Components/MiniButton";

test("it should render a button with an icon", () => {
  const { container } = render(
    <MiniButton icon={Settings} aria-label="Settings" />,
  );

  expect(screen.getByRole("button", { name: "Settings" })).toBeTruthy();
  expect(container.querySelector("button svg")).not.toBeNull();
});

test("it should apply disabled attribute when disabled", () => {
  render(<MiniButton icon={Settings} disabled aria-label="Settings" />);

  const button = screen.getByRole("button", { name: "Settings" });

  expect((button as HTMLButtonElement).disabled).toBe(true);
});

test("it should show loading spinner when loading", () => {
  const { container } = render(
    <MiniButton loading icon={Settings} aria-label="Settings" />,
  );

  const button = screen.getByRole("button");

  expect(button.getAttribute("aria-busy")).toBe("true");
  expect(container.querySelector("svg.animate-spin")).not.toBeNull();
});

test("it should render as anchor when as is a", () => {
  const { container } = render(
    <MiniButton
      as="a"
      href="https://example.com"
      icon={Settings}
      aria-label="Settings"
    />,
  );

  const link = screen.getByRole("link", { name: "Settings" });

  expect(link.getAttribute("href")).toBe("https://example.com");
  expect(container.querySelector("a svg")).not.toBeNull();
});

test("it should merge className with root classes", () => {
  const { container } = render(
    <MiniButton
      icon={Settings}
      className="custom-mini-button"
      aria-label="Settings"
    />,
  );

  expect(
    container.querySelector("button")?.classList.contains("custom-mini-button"),
  ).toBe(true);
});

test("it should forward additional attributes to the root element", () => {
  render(
    <MiniButton
      icon={Settings}
      id="settings-btn"
      data-testid="mini-button"
      aria-label="Settings"
    />,
  );

  const button = screen.getByRole("button", { name: "Settings" });

  expect(button.id).toBe("settings-btn");
  expect(button.getAttribute("data-testid")).toBe("mini-button");
});

test("it should render children in place of the icon", () => {
  render(
    <MiniButton aria-label="Avatar">
      <span data-testid="avatar">AB</span>
    </MiniButton>,
  );

  expect(screen.getByTestId("avatar").textContent).toBe("AB");
  expect(screen.queryByRole("img")).toBeNull();
});

test("it should hide children when loading", () => {
  const { container } = render(
    <MiniButton loading aria-label="Avatar">
      <span data-testid="avatar">AB</span>
    </MiniButton>,
  );

  expect(screen.queryByTestId("avatar")).toBeNull();
  expect(container.querySelector("svg.animate-spin")).not.toBeNull();
});

test("it should prefer icon over children when both are provided", () => {
  const { container } = render(
    <MiniButton icon={Settings} aria-label="Settings">
      <span data-testid="avatar">AB</span>
    </MiniButton>,
  );

  expect(screen.queryByTestId("avatar")).toBeNull();
  expect(container.querySelector("button svg")).not.toBeNull();
});

test("it should forward partsProps to icon sub-parts", () => {
  const { container } = render(
    <MiniButton
      icon={Settings}
      aria-label="Settings"
      partsProps={{
        icon: { id: "mini-button-icon" },
      }}
    />,
  );

  expect(container.querySelector("#mini-button-icon")).toBeTruthy();
});

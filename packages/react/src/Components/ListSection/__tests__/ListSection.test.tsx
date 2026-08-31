// ** External Imports
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";

// ** Local Imports
import { List } from "@/Components/List";
import { ListSection } from "@/Components/ListSection";

afterEach(() => {
  cleanup();
});

test("it should render the title from the title prop", () => {
  render(<ListSection title="Section title" />);

  expect(screen.getByText("Section title")).toBeTruthy();
});

test("it should render children as the title", () => {
  render(<ListSection>Custom label</ListSection>);

  expect(screen.getByText("Custom label")).toBeTruthy();
});

test("it should apply sticky classes on the li root when sticky is true", () => {
  const { container } = render(<ListSection sticky title="Sticky" />);

  expect(
    container
      .querySelector('[role="presentation"]')
      ?.classList.contains("sticky"),
  ).toBe(false);
  expect(container.querySelector("li")?.classList.contains("sticky")).toBe(
    true,
  );
});

test("it should apply sticky classes on the title when as is div", () => {
  const { container } = render(
    <ListSection sticky as="div" title="Sticky div" />,
  );

  expect(
    container
      .querySelector('[role="presentation"]')
      ?.classList.contains("sticky"),
  ).toBe(true);
});

test("it should apply inset padding when inset is true", () => {
  const { container } = render(<ListSection inset title="Inset" />);

  expect(
    container
      .querySelector('[role="presentation"]')
      ?.classList.contains("pl-14"),
  ).toBe(true);
});

test("it should inherit dense padding from parent List", () => {
  const { container } = render(
    <List dense>
      <ListSection title="Dense section" />
    </List>,
  );

  expect(
    container
      .querySelector('[role="presentation"]')
      ?.classList.contains("py-1.5"),
  ).toBe(true);
});

test("it should render a div root when as prop is div", () => {
  const { container } = render(<ListSection as="div" title="Div section" />);

  expect(container.querySelector("li")).toBeNull();
  expect(container.querySelector("div[role='presentation']")).not.toBeNull();
});

test("it should hide the section when parent List is iconOnly", () => {
  render(
    <List iconOnly>
      <ListSection title="Application" />
    </List>,
  );

  expect(screen.queryByText("Application")).toBeNull();
});

test("it should hide the section when an ancestor List is iconOnly", () => {
  render(
    <List iconOnly>
      <List nested>
        <ListSection title="Nested" />
      </List>
    </List>,
  );

  expect(screen.queryByText("Nested")).toBeNull();
});

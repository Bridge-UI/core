// ** External Imports
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";

afterEach(() => {
  cleanup();
});

// ** Local Imports
import { EmptyState } from "@/Components/EmptyState";

test("it should render the root element", () => {
  const { container } = render(<EmptyState title="Empty" />);

  expect(container.querySelector(".max-w-md")).not.toBeNull();
});

test("it should render a title when title prop is provided", () => {
  render(<EmptyState title="No projects yet" />);

  expect(screen.getByText("No projects yet")).toBeTruthy();
});

test("it should render description when description prop is provided", () => {
  render(
    <EmptyState
      title="No projects yet"
      description="Create your first project to get started."
    />,
  );

  expect(
    screen.getByText("Create your first project to get started."),
  ).toBeTruthy();
});

test("it should render the default icon when icon is provided", () => {
  const { container } = render(<EmptyState icon="search" title="No results" />);

  expect(container.querySelector("svg")).not.toBeNull();
});

test("it should hide decorative media from assistive tech", () => {
  const { container } = render(
    <EmptyState
      icon="search"
      title="No results"
      customProps={{ media: { id: "empty-media" } }}
    />,
  );

  expect(
    container.querySelector("#empty-media")?.getAttribute("aria-hidden"),
  ).toBe("true");
});

test("it should not hide media when mediaDecorative is false", () => {
  const { container } = render(
    <EmptyState
      icon="search"
      title="No results"
      mediaDecorative={false}
      customProps={{ media: { id: "empty-media" } }}
    />,
  );

  expect(
    container.querySelector("#empty-media")?.getAttribute("aria-hidden"),
  ).toBeNull();
});

test("it should render title as the requested heading", () => {
  render(<EmptyState titleAs="h2" title="No projects yet" />);

  expect(screen.getByRole("heading", { level: 2 }).textContent).toBe(
    "No projects yet",
  );
});

test("it should apply compact size classes when size is sm", () => {
  const { container } = render(<EmptyState size="sm" title="No results" />);

  expect(container.querySelector(".max-w-sm")).not.toBeNull();
});

test("it should apply start alignment classes when align is start", () => {
  const { container } = render(<EmptyState align="start" title="No results" />);

  expect(container.querySelector(".items-start")).not.toBeNull();
});

test("it should apply end alignment classes when align is end", () => {
  const { container } = render(<EmptyState align="end" title="No results" />);

  expect(container.querySelector(".ms-auto")).not.toBeNull();
});

test("it should render multiple buttons in the action slot", () => {
  render(
    <EmptyState
      title="No projects yet"
      slots={{
        action: (
          <>
            <button type="button">New project</button>
            <button type="button">Learn more</button>
          </>
        ),
      }}
    />,
  );

  expect(screen.getByText("Learn more")).toBeTruthy();
  expect(screen.getByText("New project")).toBeTruthy();
});

test("it should render title and description slots instead of props", () => {
  render(
    <EmptyState
      title="Prop title"
      description="Prop description"
      slots={{
        title: "Slot title",
        description: "Slot description",
      }}
    />,
  );

  expect(screen.getByText("Slot title")).toBeTruthy();
  expect(screen.getByText("Slot description")).toBeTruthy();
  expect(screen.queryByText("Prop title")).toBeNull();
  expect(screen.queryByText("Prop description")).toBeNull();
});

test("it should render media slot instead of the icon prop", () => {
  const { container } = render(
    <EmptyState
      icon="search"
      title="No results"
      slots={{ media: <span>Custom media</span> }}
    />,
  );

  expect(container.querySelector("svg")).toBeNull();
  expect(screen.getByText("Custom media")).toBeTruthy();
});

test("it should merge className with root classes", () => {
  const { container } = render(
    <EmptyState title="Custom class" className="custom-empty" />,
  );

  const root = container.querySelector(".max-w-md");

  expect(root?.classList.contains("custom-empty")).toBe(true);
});

test("it should forward additional attributes to the root element", () => {
  const { container } = render(
    <EmptyState title="With id" id="empty-root" data-testid="empty" />,
  );

  const root = container.querySelector("#empty-root");

  expect(root).not.toBeNull();
  expect(root?.getAttribute("data-testid")).toBe("empty");
});

test("it should apply user className after classes.root (tailwind-merge)", () => {
  const { container } = render(
    <EmptyState
      className="py-4"
      title="Priority"
      classes={{ root: "py-10" }}
    />,
  );

  const root = container.querySelector(".max-w-md");

  expect(root?.classList.contains("py-4")).toBe(true);
  expect(root?.classList.contains("py-10")).toBe(false);
});

test("it should forward customProps to title and description containers", () => {
  const { container } = render(
    <EmptyState
      title="Title"
      description="Body"
      customProps={{
        title: { id: "empty-title" },
        description: { id: "empty-description" },
      }}
    />,
  );

  expect(container.querySelector("#empty-title")).toBeTruthy();
  expect(container.querySelector("#empty-description")).toBeTruthy();
});

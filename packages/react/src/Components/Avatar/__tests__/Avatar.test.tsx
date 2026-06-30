// ** External Imports
import { cleanup, render, screen } from "@testing-library/react";
import { User } from "lucide-react";
import { afterEach, expect, test } from "vitest";

afterEach(() => {
  cleanup();
});

// ** Local Imports
import { Avatar } from "@/Components/Avatar";

test("it should render an image when src is passed", () => {
  const { container } = render(
    <Avatar alt="Jane Doe" src="https://example.com/avatar.jpg" />,
  );

  const image = container.querySelector("img");

  expect(image).not.toBeNull();
  expect(image?.getAttribute("src")).toBe("https://example.com/avatar.jpg");
  expect(image?.getAttribute("alt")).toBe("Jane Doe");
});

test("it should render fallback text when fallback is passed", () => {
  render(<Avatar fallback="JP" />);

  expect(screen.getByText("JP")).toBeTruthy();
});

test("it should render default icon when no src or fallback is passed", () => {
  const { container } = render(<Avatar />);

  expect(container.querySelector("svg")).not.toBeNull();
});

test("it should render custom icon when icon prop is passed", () => {
  const { container } = render(<Avatar icon={User} />);

  expect(container.querySelector("svg")).not.toBeNull();
});

test("it should render children when custom content is passed", () => {
  render(<Avatar>Custom</Avatar>);

  expect(screen.getByText("Custom")).toBeTruthy();
});

test("it should render fallback slot when no image is available", () => {
  render(<Avatar slots={{ fallback: <span>Custom fallback</span> }} />);

  expect(screen.getByText("Custom fallback")).toBeTruthy();
});

test("it should apply rounded-full by default", () => {
  const { container } = render(<Avatar fallback="JP" />);

  expect(
    container.querySelector("div")?.classList.contains("rounded-full"),
  ).toBe(true);
});

test("it should merge className with root classes", () => {
  const { container } = render(
    <Avatar fallback="JP" className="custom-avatar" />,
  );

  expect(
    container.querySelector("div")?.classList.contains("custom-avatar"),
  ).toBe(true);
});

test("it should forward additional attributes to the root element", () => {
  const { container } = render(
    <Avatar fallback="JP" id="avatar-root" data-testid="avatar" />,
  );

  const root = container.querySelector("#avatar-root");

  expect(root).not.toBeNull();
  expect(root?.getAttribute("data-testid")).toBe("avatar");
});

test("it should apply user className after classes.root (tailwind-merge)", () => {
  const { container } = render(
    <Avatar fallback="JP" className="p-4" classes={{ root: "p-2" }} />,
  );

  const root = container.querySelector("div");

  expect(root?.classList.contains("p-4")).toBe(true);
  expect(root?.classList.contains("p-2")).toBe(false);
});

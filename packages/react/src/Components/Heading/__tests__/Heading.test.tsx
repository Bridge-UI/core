// ** External Imports
import { cleanup, render } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";

afterEach(() => {
  cleanup();
});

// ** Local Imports
import { Heading } from "@/Components/Heading";
import { BridgeUIProvider } from "@/Provider";

test("it should render as an h2 element by default", () => {
  const { container } = render(<Heading>Title</Heading>);

  expect(container.querySelector("h2")?.textContent).toBe("Title");
});

test("it should render the element for the given level", () => {
  const { container } = render(<Heading level={1}>Title</Heading>);

  expect(container.querySelector("h1")).not.toBeNull();
});

test("it should take the font size from the level", () => {
  const { container } = render(<Heading level={1}>Title</Heading>);

  expect(container.querySelector("h1")?.classList.contains("text-3xl")).toBe(
    true,
  );
});

test("it should let size override the level font size", () => {
  const { container } = render(
    <Heading size="lg" level={1}>
      Title
    </Heading>,
  );

  const root = container.querySelector("h1");

  expect(root?.classList.contains("text-lg")).toBe(true);
  expect(root?.classList.contains("text-3xl")).toBe(false);
});

test("it should apply default weight and color", () => {
  const { container } = render(<Heading>Title</Heading>);

  const root = container.querySelector("h2");

  expect(root?.classList.contains("font-semibold")).toBe(true);
  expect(root?.classList.contains("text-dark-950")).toBe(true);
});

test("it should apply muted color when variant is muted", () => {
  const { container } = render(<Heading variant="muted">Title</Heading>);

  expect(
    container.querySelector("h2")?.classList.contains("text-dark-500"),
  ).toBe(true);
});

test("it should ignore global defaultColor", () => {
  const { container } = render(
    <BridgeUIProvider global={{ defaultColor: "primary" }}>
      <Heading>Title</Heading>
    </BridgeUIProvider>,
  );

  expect(
    container.querySelector("h2")?.classList.contains("text-dark-950"),
  ).toBe(true);
});

test("it should use level tokens from the provider", () => {
  const { container } = render(
    <BridgeUIProvider
      components={{ Heading: { tokens: { level: { "2": "text-4xl" } } } }}
    >
      <Heading>Title</Heading>
    </BridgeUIProvider>,
  );

  expect(container.querySelector("h2")?.classList.contains("text-4xl")).toBe(
    true,
  );
});

test("it should forward additional attributes to the root element", () => {
  const { container } = render(
    <Heading id="heading-root" data-testid="heading">
      Title
    </Heading>,
  );

  const root = container.querySelector("#heading-root");

  expect(root).not.toBeNull();
  expect(root?.getAttribute("data-testid")).toBe("heading");
});

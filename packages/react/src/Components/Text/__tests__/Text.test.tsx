// ** External Imports
import { cleanup, render } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";

afterEach(() => {
  cleanup();
});

// ** Local Imports
import { Text } from "@/Components/Text";
import { BridgeUIProvider } from "@/Provider";

test("it should render as a p element by default", () => {
  const { container } = render(<Text>Hello</Text>);

  expect(container.querySelector("p")?.textContent).toBe("Hello");
});

test("it should render the element set by as", () => {
  const { container } = render(<Text as="span">Hello</Text>);

  expect(container.querySelector("span")).not.toBeNull();
  expect(container.querySelector("p")).toBeNull();
});

test("it should apply default size, weight and color", () => {
  const { container } = render(<Text>Hello</Text>);

  const root = container.querySelector("p");

  expect(root?.classList.contains("text-base")).toBe(true);
  expect(root?.classList.contains("font-normal")).toBe(true);
  expect(root?.classList.contains("text-dark-950")).toBe(true);
  expect(root?.classList.contains("dark:text-dark-50")).toBe(true);
});

test("it should apply muted dark color when variant is muted", () => {
  const { container } = render(<Text variant="muted">Hello</Text>);

  const root = container.querySelector("p");

  expect(root?.classList.contains("text-dark-500")).toBe(true);
  expect(root?.classList.contains("dark:text-dark-400")).toBe(true);
});

test("it should apply the color for the given variant", () => {
  const { container } = render(
    <Text color="error" variant="muted">
      Hello
    </Text>,
  );

  expect(
    container.querySelector("p")?.classList.contains("text-error-600/75"),
  ).toBe(true);
});

test("it should apply size and weight tokens", () => {
  const { container } = render(
    <Text size="xl" weight="semibold">
      Hello
    </Text>,
  );

  const root = container.querySelector("p");

  expect(root?.classList.contains("text-xl")).toBe(true);
  expect(root?.classList.contains("font-semibold")).toBe(true);
});

test("it should apply numeric, truncate and uppercase classes", () => {
  const { container } = render(
    <Text numeric truncate uppercase>
      Hello
    </Text>,
  );

  const root = container.querySelector("p");

  expect(root?.classList.contains("tabular-nums")).toBe(true);
  expect(root?.classList.contains("truncate")).toBe(true);
  expect(root?.classList.contains("uppercase")).toBe(true);
});

test("it should ignore global defaultColor", () => {
  const { container } = render(
    <BridgeUIProvider global={{ defaultColor: "primary" }}>
      <Text>Hello</Text>
    </BridgeUIProvider>,
  );

  expect(
    container.querySelector("p")?.classList.contains("text-dark-950"),
  ).toBe(true);
});

test("it should use defaultProps from the provider", () => {
  const { container } = render(
    <BridgeUIProvider
      components={{ Text: { defaultProps: { variant: "muted" } } }}
    >
      <Text>Hello</Text>
    </BridgeUIProvider>,
  );

  expect(
    container.querySelector("p")?.classList.contains("text-dark-500"),
  ).toBe(true);
});

test("it should use variant tokens from the provider", () => {
  const { container } = render(
    <BridgeUIProvider
      components={{
        Text: { tokens: { variant: { muted: { dark: "text-dark-600" } } } },
      }}
    >
      <Text variant="muted">Hello</Text>
    </BridgeUIProvider>,
  );

  expect(
    container.querySelector("p")?.classList.contains("text-dark-600"),
  ).toBe(true);
});

test("it should let className override the token color", () => {
  const { container } = render(<Text className="text-info-700">Hello</Text>);

  const root = container.querySelector("p");

  expect(root?.classList.contains("text-info-700")).toBe(true);
  expect(root?.classList.contains("text-dark-950")).toBe(false);
});

test("it should forward additional attributes to the root element", () => {
  const { container } = render(
    <Text id="text-root" data-testid="text">
      Hello
    </Text>,
  );

  const root = container.querySelector("#text-root");

  expect(root).not.toBeNull();
  expect(root?.getAttribute("data-testid")).toBe("text");
});

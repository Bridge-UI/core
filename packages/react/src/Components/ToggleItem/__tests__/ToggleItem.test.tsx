// ** External Imports
import { cleanup, render, screen } from "@testing-library/react";
import { User } from "lucide-react";
import { afterEach, expect, test } from "vitest";

// ** Local Imports
import { ToggleGroup } from "@/Components/ToggleGroup";
import { ToggleItem } from "@/Components/ToggleItem";

afterEach(() => {
  cleanup();
});

test("it should render a radio button with aria attributes", () => {
  render(
    <ToggleGroup defaultValue="a" aria-label="Options">
      <ToggleItem value="a">Alpha</ToggleItem>
    </ToggleGroup>,
  );

  const toggle = screen.getByRole("radio", { name: "Alpha" });

  expect(toggle.getAttribute("tabindex")).toBe("0");
  expect(toggle.getAttribute("aria-checked")).toBe("true");
});

test("it should render a leading icon when startIcon is set", () => {
  const { container } = render(
    <ToggleGroup defaultValue="a" aria-label="Options">
      <ToggleItem value="a" startIcon={User} aria-label="User" />
    </ToggleGroup>,
  );

  expect(container.querySelector("svg")).toBeTruthy();
  expect(screen.getByRole("radio", { name: "User" }).className).toContain(
    "gap-",
  );
});

test("it should stretch when the group is full", () => {
  render(
    <ToggleGroup full defaultValue="a" aria-label="Options">
      <ToggleItem value="a">Alpha</ToggleItem>
      <ToggleItem value="b">Beta</ToggleItem>
    </ToggleGroup>,
  );

  expect(screen.getByRole("radiogroup").className).toContain("w-full");
  expect(screen.getByRole("radio", { name: "Alpha" }).className).toContain(
    "flex-1",
  );
});

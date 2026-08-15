// ** External Imports
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { afterEach, expect, test, vi } from "vitest";

// ** Core Imports
import type { ToggleGroupValue } from "@bridge-ui/core";

// ** Local Imports
import { ToggleGroup } from "@/Components/ToggleGroup";
import { ToggleItem } from "@/Components/ToggleItem";

afterEach(() => {
  cleanup();
});

function BasicToggleGroup({
  onChange,
  value: controlled,
}: {
  onChange?: (value: ToggleGroupValue) => void;
  value?: string;
}) {
  const [value, setValue] = useState<ToggleGroupValue>(controlled ?? "react");

  return (
    <ToggleGroup
      aria-label="Library"
      value={controlled ?? value}
      onChange={(next) => {
        setValue(next);
        onChange?.(next);
      }}
    >
      <ToggleItem value="react">React</ToggleItem>
      <ToggleItem value="vue">Vue</ToggleItem>
      <ToggleItem disabled value="svelte">
        Svelte
      </ToggleItem>
    </ToggleGroup>
  );
}

test("it should render a radiogroup with selected radio", () => {
  render(<BasicToggleGroup />);

  expect(screen.getByRole("radiogroup")).toBeTruthy();
  expect(
    screen.getByRole("radio", { name: "React" }).getAttribute("aria-checked"),
  ).toBe("true");
  expect(
    screen.getByRole("radio", { name: "Vue" }).getAttribute("aria-checked"),
  ).toBe("false");
});

test("it should change selection when a toggle is clicked", () => {
  const onChange = vi.fn();

  render(<BasicToggleGroup onChange={onChange} />);

  fireEvent.click(screen.getByRole("radio", { name: "Vue" }));

  expect(onChange).toHaveBeenCalledWith("vue");
  expect(
    screen.getByRole("radio", { name: "Vue" }).getAttribute("aria-checked"),
  ).toBe("true");
});

test("it should not select a disabled toggle", () => {
  const onChange = vi.fn();

  render(<BasicToggleGroup onChange={onChange} />);

  fireEvent.click(screen.getByRole("radio", { name: "Svelte" }));

  expect(onChange).not.toHaveBeenCalled();
  expect(
    screen.getByRole("radio", { name: "React" }).getAttribute("aria-checked"),
  ).toBe("true");
});

test("it should apply soft selected classes for solid success color", () => {
  render(
    <ToggleGroup
      value="vue"
      color="success"
      onChange={() => {}}
      aria-label="Library"
    >
      <ToggleItem value="react">React</ToggleItem>
      <ToggleItem value="vue">Vue</ToggleItem>
    </ToggleGroup>,
  );

  expect(screen.getByRole("radio", { name: "Vue" }).className).toContain(
    "bg-success-500/15",
  );
});

test("it should allow multiple selections when multiple is set", () => {
  const onChange = vi.fn();

  function MultipleToggleGroup() {
    const [value, setValue] = useState<ToggleGroupValue>(["react"]);

    return (
      <ToggleGroup
        multiple
        value={value}
        aria-label="Library"
        onChange={(next) => {
          setValue(next);
          onChange(next);
        }}
      >
        <ToggleItem value="react">React</ToggleItem>
        <ToggleItem value="vue">Vue</ToggleItem>
      </ToggleGroup>
    );
  }

  render(<MultipleToggleGroup />);

  expect(screen.getByRole("group")).toBeTruthy();
  expect(
    screen.getByRole("button", { name: "React" }).getAttribute("aria-pressed"),
  ).toBe("true");

  fireEvent.click(screen.getByRole("button", { name: "Vue" }));

  expect(onChange).toHaveBeenCalledWith(["react", "vue"]);
  expect(
    screen.getByRole("button", { name: "Vue" }).getAttribute("aria-pressed"),
  ).toBe("true");

  fireEvent.click(screen.getByRole("button", { name: "React" }));

  expect(onChange).toHaveBeenCalledWith(["vue"]);
});

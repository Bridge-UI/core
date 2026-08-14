// ** External Imports
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { afterEach, expect, test, vi } from "vitest";

// ** Local Imports
import { Toggle } from "@/Components/Toggle";
import { ToggleGroup } from "@/Components/ToggleGroup";

afterEach(() => {
  cleanup();
});

function BasicToggleGroup({
  onChange,
  value: controlled,
}: {
  onChange?: (value: string) => void;
  value?: string;
}) {
  const [value, setValue] = useState(controlled ?? "react");

  return (
    <ToggleGroup
      aria-label="Library"
      value={controlled ?? value}
      onChange={(next) => {
        setValue(next);
        onChange?.(next);
      }}
    >
      <Toggle value="react">React</Toggle>
      <Toggle value="vue">Vue</Toggle>
      <Toggle disabled value="svelte">
        Svelte
      </Toggle>
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
      <Toggle value="react">React</Toggle>
      <Toggle value="vue">Vue</Toggle>
    </ToggleGroup>,
  );

  expect(screen.getByRole("radio", { name: "Vue" }).className).toContain(
    "bg-success-500/15",
  );
});

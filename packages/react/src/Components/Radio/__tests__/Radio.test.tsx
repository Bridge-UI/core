// ** External Imports
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";

afterEach(() => {
  cleanup();
});

// ** Local Imports
import { Radio } from "@/Components/Radio";

test("it should render a radio control", () => {
  render(<Radio value="a" endLabel="Option A" />);

  expect(screen.getByRole("radio", { name: "Option A" })).toBeTruthy();
});

test("it should be checked when checked prop is true", () => {
  render(<Radio checked value="a" endLabel="Option A" />);

  expect((screen.getByRole("radio") as HTMLInputElement).checked).toBe(true);
});

test("it should not be checked when checked prop is false", () => {
  render(<Radio value="a" checked={false} endLabel="Option A" />);

  expect((screen.getByRole("radio") as HTMLInputElement).checked).toBe(false);
});

test("it should toggle in uncontrolled mode when clicked", () => {
  render(<Radio value="a" endLabel="Option A" defaultChecked={false} />);

  const radio = screen.getByRole("radio") as HTMLInputElement;

  expect(radio.checked).toBe(false);

  fireEvent.click(radio);

  expect(radio.checked).toBe(true);
});

test("it should apply disabled attribute when disabled", () => {
  render(<Radio disabled value="a" endLabel="Option A" />);

  expect((screen.getByRole("radio") as HTMLInputElement).disabled).toBe(true);
});

test("it should set aria-invalid when error is set", () => {
  render(<Radio error value="a" endLabel="Option A" />);

  expect(screen.getByRole("radio").getAttribute("aria-invalid")).toBe("true");
});

test("it should forward name to the native input", () => {
  render(<Radio value="a" name="plan" endLabel="Option A" />);

  expect((screen.getByRole("radio") as HTMLInputElement).name).toBe("plan");
});

test("it should link label to control id", () => {
  render(<Radio value="a" controlId="plan-a" endLabel="Option A" />);

  expect(screen.getByLabelText("Option A").id).toBe("plan-a");
});

test("it should forward extra HTML props only to the radio input", () => {
  const { container } = render(
    <Radio
      id="field-attrs"
      name="field-attrs"
      data-test="field-attrs"
      aria-describedby="field-help"
    />,
  );

  const control = container.querySelector('input[type="radio"]');
  const tagged = container.querySelectorAll('[data-test="field-attrs"]');

  expect(tagged).toHaveLength(1);
  expect(tagged[0]).toBe(control);
  expect(control?.getAttribute("id")).toBe("field-attrs");
  expect(control?.getAttribute("name")).toBe("field-attrs");
  expect(container.querySelectorAll("#field-attrs")).toHaveLength(1);
  expect(control?.getAttribute("aria-describedby")).toBe("field-help");
});

test("it should apply className and style to the root, not the radio input", () => {
  const { container } = render(
    <Radio className="field-root" style={{ width: 240 }} />,
  );

  const root = container.querySelector<HTMLElement>(".field-root");
  const control = container.querySelector('input[type="radio"]');

  expect(root?.style.width).toBe("240px");
  expect(root?.contains(control)).toBe(true);
  expect(control?.getAttribute("style")).toBeNull();
  expect(control?.classList.contains("field-root")).toBe(false);
});

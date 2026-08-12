// ** External Imports
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { afterEach, expect, test, vi } from "vitest";

// ** Local Imports
import { Accordion } from "@/Components/Accordion";
import { AccordionItem } from "@/Components/AccordionItem";

afterEach(() => {
  cleanup();
});

function BasicAccordion({
  onChange,
  multiple = false,
  value: controlled,
}: {
  multiple?: boolean;
  onChange?: (value: string | string[]) => void;
  value?: string | string[];
}) {
  const [value, setValue] = useState<string | string[]>(
    controlled ?? (multiple ? ["a"] : "a"),
  );

  return (
    <Accordion
      multiple={multiple}
      value={controlled ?? value}
      onChange={(next) => {
        setValue(next);
        onChange?.(next);
      }}
    >
      <AccordionItem value="a" title="Shipping">
        Delivery in 2–5 business days.
      </AccordionItem>
      <AccordionItem value="b" title="Returns">
        Free returns within 30 days.
      </AccordionItem>
      <AccordionItem disabled value="c" title="Warranty">
        One year coverage.
      </AccordionItem>
    </Accordion>
  );
}

test("it should render triggers and the expanded panel", () => {
  render(<BasicAccordion />);

  expect(
    screen
      .getByRole("button", { name: /Shipping/i })
      .getAttribute("aria-expanded"),
  ).toBe("true");
  expect(screen.getByText("Delivery in 2–5 business days.")).toBeTruthy();
  expect(
    screen
      .getByText("Free returns within 30 days.")
      .closest('[role="region"]')
      ?.getAttribute("aria-hidden"),
  ).toBe("true");
});

test("it should expand another item when clicked in single mode", () => {
  const onChange = vi.fn();

  render(<BasicAccordion onChange={onChange} />);

  fireEvent.click(screen.getByRole("button", { name: /Returns/i }));

  expect(onChange).toHaveBeenCalledWith("b");
  expect(
    screen
      .getByRole("button", { name: /Returns/i })
      .getAttribute("aria-expanded"),
  ).toBe("true");
});

test("it should collapse the open item when clicked again in single mode", () => {
  const onChange = vi.fn();

  render(<BasicAccordion onChange={onChange} />);

  fireEvent.click(screen.getByRole("button", { name: /Shipping/i }));

  expect(onChange).toHaveBeenCalledWith("");
});

test("it should not toggle a disabled item", () => {
  const onChange = vi.fn();

  render(<BasicAccordion onChange={onChange} />);

  fireEvent.click(screen.getByRole("button", { name: /Warranty/i }));

  expect(onChange).not.toHaveBeenCalled();
});

test("it should allow multiple expanded items when multiple is true", () => {
  const onChange = vi.fn();

  render(<BasicAccordion multiple onChange={onChange} />);

  fireEvent.click(screen.getByRole("button", { name: /Returns/i }));

  expect(onChange).toHaveBeenCalledWith(["a", "b"]);
});

test("it should move focus with arrow keys", () => {
  render(<BasicAccordion />);

  const shipping = screen.getByRole("button", { name: /Shipping/i });

  shipping.focus();
  fireEvent.keyDown(shipping, { key: "ArrowDown" });

  expect(document.activeElement).toBe(
    screen.getByRole("button", { name: /Returns/i }),
  );
});

test("it should apply separated variant classes on the root", () => {
  const { container } = render(
    <Accordion defaultValue="a" variant="separated">
      <AccordionItem value="a" title="One">
        First
      </AccordionItem>
    </Accordion>,
  );

  expect(container.firstElementChild?.className).toContain("gap-2");
});

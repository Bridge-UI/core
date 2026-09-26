// ** External Imports
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";

// ** Local Imports
import { Rating } from "@/Components/Rating";

afterEach(() => {
  cleanup();
});

test("it should render five stars by default", () => {
  render(<Rating label="Quality" />);

  expect(screen.getAllByRole("radio")).toHaveLength(5);
  expect(screen.getByRole("radiogroup", { name: "Quality" })).toBeTruthy();
});

test("it should select a value and clear it when the same item is clicked", () => {
  render(<Rating label="Quality" />);

  const item = screen.getByRole("radio", { name: "3 stars" });

  fireEvent.click(item);

  expect(item.getAttribute("aria-checked")).toBe("true");

  fireEvent.click(item);

  expect(item.getAttribute("aria-checked")).toBe("false");
});

test("it should call onChange in controlled mode", () => {
  const values: Array<null | number> = [];

  render(
    <Rating
      value={1}
      label="Quality"
      onChange={(next) => {
        values.push(next);
      }}
    />,
  );

  fireEvent.click(screen.getByRole("radio", { name: "4 stars" }));
  fireEvent.click(screen.getByRole("radio", { name: "1 star" }));

  expect(values).toEqual([4, null]);
});

test("it should select a half step from the pointer", () => {
  const values: Array<null | number> = [];

  render(
    <Rating
      step={0.5}
      label="Quality"
      onChange={(next) => {
        values.push(next);
      }}
    />,
  );

  const star = screen.getByRole("radio", { name: "2 stars" });

  vi.spyOn(star, "getBoundingClientRect").mockReturnValue({
    x: 0,
    y: 0,
    top: 0,
    left: 0,
    right: 100,
    width: 100,
    bottom: 20,
    height: 20,
    toJSON() {
      return {};
    },
  });

  fireEvent.click(star, { clientX: 20 });
  fireEvent.click(star, { clientX: 80 });

  expect(values).toEqual([1.5, 2]);
});

test("it should preview a value on hover without committing it", () => {
  const { container } = render(<Rating label="Quality" />);

  fireEvent.mouseEnter(screen.getByRole("radio", { name: "3 stars" }));

  const icons = container.querySelectorAll("svg");

  expect(icons[2]?.classList.contains("text-primary-500")).toBe(true);
  expect(icons[3]?.classList.contains("text-primary-500")).toBe(false);
  expect(
    screen.getByRole("radio", { name: "3 stars" }).getAttribute("aria-checked"),
  ).toBe("false");

  fireEvent.mouseLeave(screen.getByRole("radiogroup"));

  expect(icons[2]?.classList.contains("text-primary-500")).toBe(false);
});

test("it should change the value from the keyboard", () => {
  render(<Rating label="Quality" />);

  const first = screen.getByRole("radio", { name: "1 star" });

  first.focus();
  fireEvent.keyDown(first, { key: "ArrowRight" });

  expect(first.getAttribute("aria-checked")).toBe("true");

  fireEvent.keyDown(first, { key: "ArrowRight" });

  expect(
    screen.getByRole("radio", { name: "2 stars" }).getAttribute("aria-checked"),
  ).toBe("true");

  fireEvent.keyDown(screen.getByRole("radio", { name: "2 stars" }), {
    key: "End",
  });

  expect(
    screen.getByRole("radio", { name: "5 stars" }).getAttribute("aria-checked"),
  ).toBe("true");

  fireEvent.keyDown(screen.getByRole("radio", { name: "5 stars" }), {
    key: "Home",
  });

  expect(first.getAttribute("aria-checked")).toBe("true");

  fireEvent.keyDown(first, { key: "ArrowLeft" });

  expect(first.getAttribute("aria-checked")).toBe("false");
});

test("it should render only max items", () => {
  render(<Rating max={3} label="Quality" />);

  expect(screen.getAllByRole("radio")).toHaveLength(3);
});

test("it should ignore changes when readonly", () => {
  const values: Array<null | number> = [];

  render(
    <Rating
      readonly
      value={2}
      label="Quality"
      onChange={(next) => {
        values.push(next);
      }}
    />,
  );

  fireEvent.click(screen.getByRole("radio", { name: "4 stars" }));

  expect(values).toEqual([]);
  expect(
    screen.getByRole("radio", { name: "2 stars" }).getAttribute("aria-checked"),
  ).toBe("true");
});

test("it should move focus without changing the value when readonly", () => {
  render(<Rating readonly value={2} label="Quality" />);

  const current = screen.getByRole("radio", { name: "2 stars" });

  current.focus();
  fireEvent.keyDown(current, { key: "ArrowRight" });

  expect(current.getAttribute("aria-checked")).toBe("true");
  expect(document.activeElement).toBe(
    screen.getByRole("radio", { name: "3 stars" }),
  );
});

test("it should disable each item when disabled", () => {
  render(<Rating disabled label="Quality" />);

  for (const item of screen.getAllByRole("radio")) {
    expect((item as HTMLButtonElement).disabled).toBe(true);
  }
});

test("it should set aria-invalid when error is set", () => {
  render(<Rating error label="Quality" errorMessage="Choose a score." />);

  expect(screen.getByRole("radiogroup").getAttribute("aria-invalid")).toBe(
    "true",
  );
  expect(screen.getByText("Choose a score.")).toBeTruthy();
});

test("it should submit the value through a named hidden input", () => {
  const { container } = render(<Rating name="score" defaultValue={4} />);

  const input = container.querySelector(
    'input[type="hidden"]',
  ) as HTMLInputElement;

  expect(input.value).toBe("4");
  expect(input.name).toBe("score");
});

test("it should link the label to the first item", () => {
  const { container } = render(<Rating label="Quality" controlId="quality" />);

  expect(container.querySelector("label")?.getAttribute("for")).toBe(
    "quality-0",
  );
  expect(screen.getByRole("radio", { name: "1 star" }).id).toBe("quality-0");
});

test("it should fill the next item halfway for a fractional value", () => {
  render(<Rating value={1.5} label="Quality" />);

  const items = screen.getAllByRole("radio");

  expect(items[0]?.querySelectorAll("svg")).toHaveLength(1);
  expect(items[1]?.querySelector(".overflow-hidden")?.style.width).toBe("50%");
  expect(items[1]?.querySelectorAll("svg")).toHaveLength(2);
  expect(
    items[0]?.querySelector("svg")?.classList.contains("text-primary-500"),
  ).toBe(true);
  expect(
    items[2]?.querySelector("svg")?.classList.contains("text-primary-500"),
  ).toBe(false);
  expect(
    items[1]
      ?.querySelector(".overflow-hidden svg")
      ?.classList.contains("text-primary-500"),
  ).toBe(true);
});

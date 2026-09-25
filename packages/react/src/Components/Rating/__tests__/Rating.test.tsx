// ** External Imports
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";

// ** Local Imports
import { Rating } from "@/Components/Rating";

afterEach(() => {
  cleanup();
});

test("it should render five stars by default", () => {
  render(<Rating endLabel="Quality" />);

  expect(screen.getAllByRole("radio")).toHaveLength(5);
  expect(screen.getByRole("radiogroup", { name: "Quality" })).toBeTruthy();
});

test("it should select a value and clear it when the same item is clicked", () => {
  render(<Rating endLabel="Quality" />);

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
      endLabel="Quality"
      onChange={(next) => {
        values.push(next);
      }}
    />,
  );

  fireEvent.click(screen.getByRole("radio", { name: "4 stars" }));
  fireEvent.click(screen.getByRole("radio", { name: "1 star" }));

  expect(values).toEqual([4, null]);
});

test("it should preview a value on hover without committing it", () => {
  const { container } = render(<Rating endLabel="Quality" />);

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
  render(<Rating endLabel="Quality" />);

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
  render(<Rating max={3} endLabel="Quality" />);

  expect(screen.getAllByRole("radio")).toHaveLength(3);
});

test("it should ignore changes when readonly", () => {
  const values: Array<null | number> = [];

  render(
    <Rating
      readonly
      value={2}
      endLabel="Quality"
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

test("it should disable each item when disabled", () => {
  render(<Rating disabled endLabel="Quality" />);

  for (const item of screen.getAllByRole("radio")) {
    expect((item as HTMLButtonElement).disabled).toBe(true);
  }
});

test("it should set aria-invalid when error is set", () => {
  render(<Rating error endLabel="Quality" errorMessage="Choose a score." />);

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

  expect(input.name).toBe("score");
  expect(input.value).toBe("4");
});

test("it should link the label to the tabbable item", () => {
  const { container } = render(<Rating endLabel="Quality" controlId="quality" />);

  expect(container.querySelector("label")?.getAttribute("for")).toBe("quality");
  expect(screen.getByRole("radio", { name: "1 star" }).id).toBe("quality");
});

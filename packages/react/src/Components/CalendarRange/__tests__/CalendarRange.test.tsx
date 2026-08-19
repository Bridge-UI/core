// ** External Imports
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";

afterEach(() => {
  cleanup();
});

// ** Local Imports
import { CalendarRange } from "@/Components/CalendarRange";

test("it should render a shared year selector and dual date panels", () => {
  render(
    <CalendarRange
      defaultValue={[new Date(2021, 4, 1), new Date(2021, 4, 10)]}
    />,
  );

  expect(screen.getAllByRole("button", { name: "Select year" })).toHaveLength(
    1,
  );
  expect(screen.getAllByRole("button", { name: "Select month" })).toHaveLength(
    1,
  );
  expect(
    screen.getAllByRole("button", { name: "Select end month" }),
  ).toHaveLength(1);
});

test("it should keep end month one month ahead of start", () => {
  render(
    <CalendarRange
      onViewDateChange={() => {}}
      viewDate={new Date(2021, 4, 1)}
    />,
  );

  expect(
    screen.getByRole("button", { name: "Select month" }).textContent,
  ).toContain("May");
  expect(
    screen.getByRole("button", { name: "Select end month" }).textContent,
  ).toContain("June");
});

test("it should call onChange when a range is selected", () => {
  const onChange = vi.fn();

  render(
    <CalendarRange
      onChange={onChange}
      onViewDateChange={() => {}}
      viewDate={new Date(2021, 4, 1)}
    />,
  );

  fireEvent.click(screen.getAllByRole("button", { name: "10" })[0]!);
  fireEvent.click(screen.getAllByRole("button", { name: "15" })[0]!);

  expect(onChange).toHaveBeenCalled();
});

test("it should highlight the start month when opening from the end month selector", () => {
  render(
    <CalendarRange
      onViewDateChange={() => {}}
      viewDate={new Date(2021, 4, 1)}
    />,
  );

  fireEvent.click(screen.getByRole("button", { name: "Select end month" }));

  expect(screen.getByRole("button", { name: "Select month" })).toBeTruthy();
  expect(screen.getByRole("button", { name: "Select end month" })).toBeTruthy();

  const june = screen.getByRole("button", { name: /june/i });
  const may = screen.getByRole("button", { name: /may/i });

  expect(may.getAttribute("aria-pressed")).toBe("true");
  expect(june.getAttribute("aria-pressed")).toBe("false");
});

test("it should apply the selected month to the start calendar from either selector", () => {
  const onViewDateChange = vi.fn();

  render(
    <CalendarRange
      viewDate={new Date(2021, 4, 1)}
      onViewDateChange={onViewDateChange}
    />,
  );

  fireEvent.click(screen.getByRole("button", { name: "Select end month" }));
  fireEvent.click(screen.getByRole("button", { name: /august/i }));

  expect(onViewDateChange).toHaveBeenCalled();
  const next = onViewDateChange.mock.calls.at(-1)?.[0] as Date;
  expect(next.getMonth()).toBe(7);
});

test("it should update uncontrolled start month from the start selector", () => {
  render(
    <CalendarRange
      defaultValue={[new Date(2021, 4, 1), new Date(2021, 4, 10)]}
    />,
  );

  fireEvent.click(screen.getByRole("button", { name: "Select month" }));
  fireEvent.click(screen.getByRole("button", { name: /august/i }));

  expect(
    screen.getByRole("button", { name: "Select month" }).textContent,
  ).toContain("August");
  expect(
    screen.getByRole("button", { name: "Select end month" }).textContent,
  ).toContain("September");
});

test("it should keep end month over the end calendar when horizontal", () => {
  render(
    <CalendarRange
      orientation="horizontal"
      onViewDateChange={() => {}}
      viewDate={new Date(2021, 4, 1)}
    />,
  );

  expect(screen.getByRole("separator")).toBeTruthy();
  expect(screen.getByRole("button", { name: "Select end month" })).toBeTruthy();
});

test("it should move end month below the start panel when vertical", () => {
  const { container } = render(
    <CalendarRange
      orientation="vertical"
      onViewDateChange={() => {}}
      viewDate={new Date(2021, 4, 1)}
    />,
  );

  const header = container.firstElementChild?.firstElementChild;
  expect(header?.querySelector('[aria-label="Select end month"]')).toBeNull();
  expect(screen.getByRole("button", { name: "Select end month" })).toBeTruthy();
});

test("it should not change month when selecting an outside day on the start panel", () => {
  render(<CalendarRange />);

  fireEvent.click(screen.getByRole("button", { name: "Select year" }));
  fireEvent.click(screen.getByRole("button", { name: "2021" }));
  fireEvent.click(screen.getByRole("button", { name: /may/i }));

  expect(
    screen.getByRole("button", { name: "Select month" }).textContent,
  ).toMatch(/may/i);

  const aprilThirtieth = screen
    .getAllByRole("button", { name: "30" })
    .find((node) => node.className.includes("text-dark-400"));

  expect(aprilThirtieth).toBeTruthy();
  fireEvent.click(aprilThirtieth!);

  expect(
    screen.getByRole("button", { name: "Select month" }).textContent,
  ).toMatch(/may/i);
  expect(
    screen.getByRole("button", { name: "Select end month" }).textContent,
  ).toMatch(/june/i);
});

test("it should not change month when selecting an outside day on the end panel", () => {
  render(<CalendarRange />);

  fireEvent.click(screen.getByRole("button", { name: "Select year" }));
  fireEvent.click(screen.getByRole("button", { name: "2021" }));
  fireEvent.click(screen.getByRole("button", { name: /may/i }));

  const julyFirst = screen
    .getAllByRole("button", { name: "1" })
    .filter((node) => node.className.includes("text-dark-400"))
    .at(-1);

  expect(julyFirst).toBeTruthy();
  fireEvent.click(julyFirst!);

  expect(
    screen.getByRole("button", { name: "Select month" }).textContent,
  ).toMatch(/may/i);
  expect(
    screen.getByRole("button", { name: "Select end month" }).textContent,
  ).toMatch(/june/i);
});

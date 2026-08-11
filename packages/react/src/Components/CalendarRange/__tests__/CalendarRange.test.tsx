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

test("it should highlight the end month when opening from the end month selector", () => {
  render(
    <CalendarRange
      onViewDateChange={() => {}}
      viewDate={new Date(2021, 4, 1)}
    />,
  );

  fireEvent.click(screen.getByRole("button", { name: "Select end month" }));

  const june = screen.getByRole("button", { name: /june/i });
  const may = screen.getByRole("button", { name: /may/i });

  expect(june.getAttribute("aria-pressed")).toBe("true");
  expect(may.getAttribute("aria-pressed")).toBe("false");
});

test("it should move the end panel when selecting a month from the end selector", () => {
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
  // End month August => start viewDate is July (month index 6)
  expect(next.getMonth()).toBe(6);
});

test("it should update uncontrolled end month from the end selector", () => {
  render(
    <CalendarRange
      defaultValue={[new Date(2021, 4, 1), new Date(2021, 4, 10)]}
    />,
  );

  expect(
    screen.getByRole("button", { name: "Select month" }).textContent,
  ).toContain("May");
  expect(
    screen.getByRole("button", { name: "Select end month" }).textContent,
  ).toContain("June");

  fireEvent.click(screen.getByRole("button", { name: "Select end month" }));
  fireEvent.click(screen.getByRole("button", { name: /august/i }));

  expect(
    screen.getByRole("button", { name: "Select month" }).textContent,
  ).toContain("July");
  expect(
    screen.getByRole("button", { name: "Select end month" }).textContent,
  ).toContain("August");
});

test("it should switch the highlighted month when opening the other selector", () => {
  render(
    <CalendarRange
      onViewDateChange={() => {}}
      viewDate={new Date(2021, 4, 1)}
    />,
  );

  fireEvent.click(screen.getByRole("button", { name: "Select month" }));
  expect(
    screen.getByRole("button", { name: /may/i }).getAttribute("aria-pressed"),
  ).toBe("true");

  fireEvent.click(screen.getByRole("button", { name: "Select end month" }));
  expect(
    screen.getByRole("button", { name: /june/i }).getAttribute("aria-pressed"),
  ).toBe("true");
  expect(
    screen.getByRole("button", { name: /may/i }).getAttribute("aria-pressed"),
  ).toBe("false");
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

test("it should keep end month in the header when horizontal", () => {
  const { container } = render(<CalendarRange orientation="horizontal" />);

  const header = container.firstElementChild?.firstElementChild;
  expect(
    header?.querySelector('[aria-label="Select end month"]'),
  ).not.toBeNull();
});

test("it should move end month below the start panel when vertical", () => {
  const { container } = render(<CalendarRange orientation="vertical" />);

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

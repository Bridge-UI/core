// ** External Imports
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";

afterEach(() => {
  cleanup();
});

// ** Local Imports
import { Calendar } from "@/Components/Calendar";

test("it should render year and month selectors", () => {
  render(<Calendar viewDate={new Date(2021, 4, 1)} />);

  expect(screen.getByRole("button", { name: "Select year" })).toBeTruthy();
  expect(screen.getByRole("button", { name: "Select month" })).toBeTruthy();
});

test("it should open the month panel", () => {
  render(<Calendar viewDate={new Date(2021, 4, 1)} />);

  fireEvent.click(screen.getByRole("button", { name: "Select month" }));

  expect(screen.getByRole("button", { name: /january/i })).toBeTruthy();
});

test("it should open the year panel", () => {
  render(<Calendar viewDate={new Date(2021, 4, 1)} />);

  fireEvent.click(screen.getByRole("button", { name: "Select year" }));

  expect(screen.getByRole("button", { name: "2021" })).toBeTruthy();
});

test("it should call onChange when a day is selected", () => {
  const onChange = vi.fn();

  render(<Calendar onChange={onChange} viewDate={new Date(2021, 4, 1)} />);

  fireEvent.click(screen.getByRole("button", { name: "21" }));

  expect(onChange).toHaveBeenCalled();
});

test("it should hide year selector when hideYears is set", () => {
  render(<Calendar hideYears viewDate={new Date(2021, 4, 1)} />);

  expect(screen.queryByRole("button", { name: "Select year" })).toBeNull();
});

test("it should update the date grid after year and month selection", () => {
  const onChange = vi.fn();

  render(<Calendar onChange={onChange} viewDate={new Date(2021, 4, 1)} />);

  fireEvent.click(screen.getByRole("button", { name: "Select year" }));
  fireEvent.click(screen.getByRole("button", { name: "2018" }));
  fireEvent.click(screen.getByRole("button", { name: /march/i }));

  expect(
    screen.getByRole("button", { name: "Select year" }).textContent,
  ).toContain("2018");
  expect(
    screen
      .getByRole("button", { name: "Select month" })
      .textContent?.toLowerCase(),
  ).toContain("march");

  const fifteenth = screen
    .getAllByRole("button", { name: "15" })
    .find((node) => !node.className.includes("text-dark-400"));

  expect(fifteenth).toBeTruthy();
  fireEvent.click(fifteenth!);

  const selected = onChange.mock.calls[0]?.[0] as Date;

  expect(selected.getFullYear()).toBe(2018);
  expect(selected.getMonth()).toBe(2);
  expect(selected.getDate()).toBe(15);
});

test("it should navigate months when viewDate is passed without onViewDateChange", () => {
  render(<Calendar viewDate={new Date(2021, 4, 1)} />);

  fireEvent.click(screen.getByRole("button", { name: "Next month" }));

  expect(
    screen
      .getByRole("button", { name: "Select month" })
      .textContent?.toLowerCase(),
  ).toContain("june");
});

test("it should paginate years with nav arrows on the year panel", () => {
  render(<Calendar viewDate={new Date(2021, 4, 1)} />);

  fireEvent.click(screen.getByRole("button", { name: "Select year" }));

  expect(screen.getByRole("button", { name: "2021" })).toBeTruthy();

  fireEvent.click(screen.getByRole("button", { name: "Next years" }));

  expect(screen.queryByRole("button", { name: "2021" })).toBeNull();
  expect(screen.getByRole("button", { name: "2036" })).toBeTruthy();
});

test("it should change month with nav arrows on the month panel", () => {
  render(<Calendar viewDate={new Date(2021, 4, 1)} />);

  fireEvent.click(screen.getByRole("button", { name: "Select month" }));
  fireEvent.click(screen.getByRole("button", { name: "Next month" }));

  expect(
    screen
      .getByRole("button", { name: "Select month" })
      .textContent?.toLowerCase(),
  ).toContain("june");
  expect(
    screen.getByRole("button", { name: "Select year" }).textContent,
  ).toContain("2021");
});

test("it should keep the today button on year and month panels", () => {
  render(<Calendar viewDate={new Date(2021, 4, 1)} />);

  expect(screen.getByRole("button", { name: "Today" })).toBeTruthy();

  fireEvent.click(screen.getByRole("button", { name: "Select year" }));
  expect(screen.getByRole("button", { name: "Today" })).toBeTruthy();

  fireEvent.click(screen.getByRole("button", { name: "Select month" }));
  expect(screen.getByRole("button", { name: "Today" })).toBeTruthy();
});

test("it should return to today's month without selecting a date", () => {
  const onChange = vi.fn();
  const today = new Date();

  render(
    <Calendar
      onChange={onChange}
      value={new Date(2021, 4, 21)}
      viewDate={new Date(2021, 4, 1)}
    />,
  );

  fireEvent.click(screen.getByRole("button", { name: "Select year" }));
  fireEvent.click(screen.getByRole("button", { name: "Today" }));

  expect(onChange).not.toHaveBeenCalled();
  expect(screen.getByRole("grid")).toBeTruthy();
  expect(screen.getByRole("button", { current: "date" }).textContent).toBe(
    String(today.getDate()),
  );
  expect(
    screen.getByRole("button", { name: "Select year" }).textContent,
  ).toContain(String(today.getFullYear()));
});

test("it should open on the controlled value month when remounted", () => {
  const { unmount } = render(
    <Calendar onChange={() => {}} value={new Date(2026, 6, 29)} />,
  );

  expect(
    screen.getByRole("button", { name: "Select month" }).textContent,
  ).toMatch(/july/i);

  unmount();

  render(<Calendar onChange={() => {}} value={new Date(2026, 6, 29)} />);

  expect(
    screen.getByRole("button", { name: "Select month" }).textContent,
  ).toMatch(/july/i);
  expect(
    screen
      .getAllByRole("button", { name: "29" })
      .some((node) => node.getAttribute("aria-pressed") === "true"),
  ).toBe(true);
});

test("it should open on the selected value month after menu remount", () => {
  function Demo({
    open,
    value,
    onChange,
  }: {
    onChange: (next: Date | null) => void;
    open: boolean;
    value: Date | null;
  }) {
    if (!open) {
      return null;
    }

    return (
      <Calendar
        value={value}
        onChange={(next) => onChange((next as Date) ?? null)}
      />
    );
  }

  let value: Date | null = new Date(2026, 7, 6);
  const onChange = (next: Date | null) => {
    value = next;
  };

  const { rerender } = render(<Demo open value={value} onChange={onChange} />);

  expect(
    screen.getByRole("button", { name: "Select month" }).textContent,
  ).toMatch(/august/i);

  const julyTwentyNinth = screen
    .getAllByRole("button", { name: "29" })
    .find((node) => node.className.includes("text-dark-400"));

  expect(julyTwentyNinth).toBeTruthy();
  fireEvent.click(julyTwentyNinth!);

  expect(value?.getMonth()).toBe(6);
  // Outside-day click keeps the current view month
  expect(
    screen.getByRole("button", { name: "Select month" }).textContent,
  ).toMatch(/august/i);

  // DateField closes the menu (unmount) then reopens focused on the value month
  rerender(<Demo open={false} value={value} onChange={onChange} />);
  rerender(<Demo open value={value} onChange={onChange} />);

  expect(
    screen.getByRole("button", { name: "Select month" }).textContent,
  ).toMatch(/july/i);
});

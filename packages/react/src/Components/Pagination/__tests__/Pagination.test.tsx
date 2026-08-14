// ** External Imports
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";

// ** Local Imports
import { Pagination } from "@/Components/Pagination";

afterEach(() => {
  cleanup();
});

test("it should render numbered pages with a current page", () => {
  render(<Pagination page={2} count={5} aria-label="Pagination" />);

  expect(screen.getByRole("navigation", { name: "Pagination" })).toBeTruthy();
  expect(
    screen.getByRole("button", { name: "Page 2" }).getAttribute("aria-current"),
  ).toBe("page");
  expect(screen.getByRole("button", { name: "Page 1" })).toBeTruthy();
});

test("it should call onChange when a page is clicked", () => {
  const onChange = vi.fn();

  render(<Pagination page={1} count={5} onChange={onChange} />);

  fireEvent.click(screen.getByRole("button", { name: "Page 3" }));

  expect(onChange).toHaveBeenCalledWith(3);
});

test("it should collapse long ranges with ellipsis", () => {
  render(<Pagination page={5} count={12} siblingCount={1} boundaryCount={1} />);

  expect(screen.getAllByText("…").length).toBeGreaterThan(0);
  expect(screen.getByRole("button", { name: "Page 1" })).toBeTruthy();
  expect(screen.queryByRole("button", { name: "Page 2" })).toBeNull();
  expect(screen.getByRole("button", { name: "Page 12" })).toBeTruthy();
});

test("it should support simple prev/next mode", () => {
  const onNext = vi.fn();
  const onPrevious = vi.fn();

  render(
    <Pagination
      hasNext
      mode="simple"
      onNext={onNext}
      hasPrevious={false}
      onPrevious={onPrevious}
    />,
  );

  expect(screen.queryByRole("button", { name: /Page / })).toBeNull();

  const previous = screen.getByRole("button", { name: "Previous" });
  const next = screen.getByRole("button", { name: "Next" });

  expect(previous).toHaveProperty("disabled", true);

  fireEvent.click(next);
  expect(onNext).toHaveBeenCalledTimes(1);

  fireEvent.click(previous);
  expect(onPrevious).not.toHaveBeenCalled();
});

test("it should apply visual variants", () => {
  const { rerender, container } = render(
    <Pagination page={1} count={3} variant="outlined" />,
  );

  expect(screen.getByRole("list").className).toContain("rounded-md");
  expect(container.querySelector("li")?.className).toContain("contents");
  expect(screen.getByRole("button", { name: "Previous" }).className).toContain(
    "ml-0",
  );
  expect(screen.getByRole("button", { name: "Next" }).className).toContain(
    "-ml-px",
  );
  expect(screen.getByRole("button", { name: "Next" }).className).toContain(
    "rounded-r-md",
  );
  expect(screen.getByRole("button", { name: "Previous" }).className).toContain(
    "rounded-l-md",
  );
  expect(screen.getByRole("button", { name: "Previous" }).className).toContain(
    "cursor-pointer",
  );

  rerender(<Pagination page={1} count={3} variant="ghost" />);
  expect(screen.getByRole("list").className).toContain("gap-1");
  expect(screen.getByRole("button", { name: "Next" }).className).toContain(
    "w-9",
  );
  expect(screen.getByRole("button", { name: "Next" }).className).toContain(
    "rounded-md",
  );

  rerender(<Pagination page={1} count={3} rounded="lg" variant="ghost" />);
  expect(screen.getByRole("button", { name: "Next" }).className).toContain(
    "rounded-lg",
  );

  rerender(<Pagination page={1} count={3} variant="text" />);
  expect(screen.getByRole("list").className).toContain("border-t");
  expect(screen.getByRole("button", { name: "Next" }).className).toContain(
    "border-t-2",
  );
});

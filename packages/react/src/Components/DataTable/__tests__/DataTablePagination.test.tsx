// ** External Imports
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";

// ** Local Imports
import { DataTablePagination } from "@/Components/DataTable";

afterEach(() => {
  cleanup();
});

test("it should render first and last controls without page numbers", () => {
  const onChange = vi.fn();

  render(<DataTablePagination page={1} count={7} onChange={onChange} />);

  expect(screen.queryByRole("button", { name: /Page / })).toBeNull();
  expect(screen.getByRole("button", { name: "First page" })).toHaveProperty(
    "disabled",
    true,
  );
  expect(screen.getByRole("button", { name: "Last page" })).toHaveProperty(
    "disabled",
    false,
  );

  fireEvent.click(screen.getByRole("button", { name: "Last page" }));

  expect(onChange).toHaveBeenCalledWith(7);
});

test("it should go to the previous page", () => {
  const onChange = vi.fn();

  render(<DataTablePagination page={3} count={7} onChange={onChange} />);

  fireEvent.click(screen.getByRole("button", { name: "Previous" }));

  expect(onChange).toHaveBeenCalledWith(2);
});

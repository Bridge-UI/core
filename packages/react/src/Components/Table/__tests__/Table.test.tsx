// ** External Imports
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";

// ** Local Imports
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/Table";

afterEach(() => {
  cleanup();
});

function SampleTable(
  props: Parameters<typeof Table>[0] & {
    numeric?: boolean;
  },
) {
  const { numeric, ...tableProps } = props;

  return (
    <Table {...tableProps}>
      <TableCaption>Team roster</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead numeric={numeric}>Score</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Ada Lovelace</TableCell>
          <TableCell numeric={numeric}>12</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Alan Turing</TableCell>
          <TableCell numeric={numeric}>9</TableCell>
        </TableRow>
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell>Total</TableCell>
          <TableCell numeric={numeric}>21</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}

test("it should render a semantic table with caption and cells", () => {
  render(<SampleTable />);

  expect(screen.getByRole("table")).toBeTruthy();
  expect(screen.getByText("Total")).toBeTruthy();
  expect(screen.getByText("Alan Turing")).toBeTruthy();
  expect(screen.getByText("Team roster")).toBeTruthy();
  expect(screen.getByText("Ada Lovelace")).toBeTruthy();
  expect(
    screen.getByRole("columnheader", { name: "Name" }).getAttribute("scope"),
  ).toBe("col");
});

test("it should apply the bordered variant on the wrapper", () => {
  const { container } = render(<SampleTable variant="bordered" />);

  expect(container.firstElementChild?.className).toContain("ring-1");
});

test("it should apply the ghost variant on the wrapper", () => {
  const { container } = render(<SampleTable variant="ghost" />);

  expect(container.firstElementChild?.className).not.toContain("ring-1");
  expect(container.firstElementChild?.className).toContain("rounded-lg");
});

test("it should stripe and hover body rows only", () => {
  const { container } = render(<SampleTable striped hoverable />);

  const bodyRows = container.querySelectorAll("tbody tr");
  const headerRow = container.querySelector("thead tr");
  const footerRow = container.querySelector("tfoot tr");

  expect(bodyRows[0]?.className).toContain("even:bg-dark-50");
  expect(bodyRows[0]?.className).toContain("hover:bg-dark-500");
  expect(headerRow?.className).not.toContain("even:bg-dark-50");
  expect(footerRow?.className).not.toContain("hover:bg-dark-500");
});

test("it should stick header cells when stickyHeader is set", () => {
  const { container } = render(<SampleTable stickyHeader />);

  expect(container.firstElementChild?.className).not.toContain(
    "overflow-x-auto",
  );
  expect(container.querySelector("th")?.className).toContain("sticky");
  expect(container.querySelector("td")?.className).not.toContain("sticky");
  expect(screen.getByRole("table").className).toContain("border-separate");
  expect(container.querySelector("th")?.className).toContain("backdrop-blur");
});

test("it should align numeric cells to the end with tabular nums", () => {
  const { container } = render(<SampleTable numeric />);

  const numericHead = screen.getByRole("columnheader", { name: "Score" });
  const numericCell = container.querySelector("tbody td:last-child");

  expect(numericHead.className).toContain("text-end");
  expect(numericCell?.className).toContain("text-end");
  expect(numericHead.className).toContain("tabular-nums");
  expect(numericCell?.className).toContain("tabular-nums");
});

test("it should keep the table full width by default", () => {
  const { container } = render(<SampleTable />);

  expect(screen.getByRole("table").className).toContain("min-w-full");
  expect(container.firstElementChild?.className).toContain("overflow-x-auto");
});

test("it should omit full width when full is false", () => {
  render(<SampleTable full={false} />);

  expect(screen.getByRole("table").className).not.toContain("min-w-full");
});

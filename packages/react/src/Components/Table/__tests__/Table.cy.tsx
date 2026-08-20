// ** Local Imports
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/Table";

test("it should render a table in the browser", () => {
  cy.mount(
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Role</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Ada Lovelace</TableCell>
          <TableCell>Engineer</TableCell>
        </TableRow>
      </TableBody>
    </Table>,
  );

  cy.get("table").should("be.visible");
  cy.contains("Ada Lovelace").should("be.visible");
  cy.get("th").first().should("have.attr", "scope", "col");
});

test("it should render bordered and ghost variants", () => {
  cy.mount(
    <Table variant="bordered">
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Ada</TableCell>
        </TableRow>
      </TableBody>
    </Table>,
  );

  cy.get("table").parent().should("have.class", "ring-1");

  cy.mount(
    <Table variant="ghost">
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Ada</TableCell>
        </TableRow>
      </TableBody>
    </Table>,
  );

  cy.get("table").parent().should("have.class", "rounded-lg");
});

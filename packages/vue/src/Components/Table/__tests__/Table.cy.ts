// ** External Imports
import { h } from "vue";

// ** Local Imports
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/Table";

function basicSlots() {
  return {
    default: () => [
      h(TableHeader, null, {
        default: () =>
          h(TableRow, null, {
            default: () => [
              h(TableHead, null, { default: () => "Name" }),
              h(TableHead, null, { default: () => "Role" }),
            ],
          }),
      }),
      h(TableBody, null, {
        default: () =>
          h(TableRow, null, {
            default: () => [
              h(TableCell, null, { default: () => "Ada Lovelace" }),
              h(TableCell, null, { default: () => "Engineer" }),
            ],
          }),
      }),
    ],
  };
}

test("it should render a table in the browser", () => {
  cy.mount(Table, { slots: basicSlots() });

  cy.get("table").should("be.visible");
  cy.contains("Ada Lovelace").should("be.visible");
  cy.get("th").first().should("have.attr", "scope", "col");
});

test("it should render bordered and ghost variants", () => {
  cy.mount(Table, {
    slots: basicSlots(),
    props: { variant: "bordered" },
  });

  cy.get("table").parent().should("have.class", "ring-1");

  cy.mount(Table, {
    slots: basicSlots(),
    props: { variant: "ghost" },
  });

  cy.get("table").parent().should("have.class", "rounded-lg");
});

test("it should shrink-wrap when full is false", () => {
  cy.mount(Table, {
    slots: basicSlots(),
    props: { full: false },
  });

  cy.get("table").parent().should("have.class", "overflow-x-auto");
  cy.get("table").parent().parent().should("have.class", "w-fit");
});

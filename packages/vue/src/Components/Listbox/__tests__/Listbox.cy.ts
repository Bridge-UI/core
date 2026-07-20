// ** Local Imports
import { Listbox } from "@/Components/Listbox";

const options = [
  { label: "Active", value: "active" },
  { label: "Pending", value: "pending" },
];

test("it should render options when open", () => {
  const anchor = document.createElement("div");
  document.body.appendChild(anchor);

  cy.mount(Listbox, {
    props: {
      options,
      modelValue: true,
      anchorEl: anchor,
      listboxId: "cy-listbox",
    },
  });

  cy.get('[role="listbox"]').should("exist");
  cy.contains("Active").should("be.visible");
  cy.contains("Pending").should("be.visible");
});

test("it should emit select when an option is clicked", () => {
  const anchor = document.createElement("div");
  document.body.appendChild(anchor);

  cy.mount(Listbox, {
    props: {
      options,
      modelValue: true,
      anchorEl: anchor,
      listboxId: "cy-listbox",
      onSelect: cy.stub().as("onSelect"),
    },
  });

  cy.contains("Pending").click();
  cy.get("@onSelect").should("have.been.calledOnce");
});

test("it should show empty message when there are no options", () => {
  const anchor = document.createElement("div");
  document.body.appendChild(anchor);

  cy.mount(Listbox, {
    props: {
      options: [],
      modelValue: true,
      anchorEl: anchor,
      listboxId: "cy-listbox",
      emptyMessage: "Nothing here",
    },
  });

  cy.contains("Nothing here").should("be.visible");
});

test("it should show loading progress bar when loading", () => {
  const anchor = document.createElement("div");
  document.body.appendChild(anchor);

  cy.mount(Listbox, {
    props: {
      options: [],
      loading: true,
      modelValue: true,
      anchorEl: anchor,
      listboxId: "cy-listbox",
    },
  });

  cy.get('[role="progressbar"]').should("be.visible");
});

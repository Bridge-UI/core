// ** Local Imports
import { Select } from "@/Components/Select";

const options = [
  { label: "Active", value: "active" },
  { label: "Pending", value: "pending" },
];

test("it should render with default props", () => {
  cy.mount(Select, {
    props: { options },
    attrs: { "aria-label": "Status" },
  });

  cy.get('[role="combobox"]').should("exist");
  cy.get(".w-full").should("exist");
});

test("it should render a label when label prop is provided", () => {
  cy.mount(Select, {
    props: { options, label: "Status" },
  });

  cy.contains("Status").should("be.visible");
});

test("it should open the listbox when the field is clicked", () => {
  cy.mount(Select, {
    props: { options },
    attrs: { "aria-label": "Status" },
  });

  cy.get(".group\\/field").click();
  cy.get('[role="listbox"]').should("exist");
  cy.contains("Active").should("be.visible");
});

test("it should select an option", () => {
  cy.mount(Select, {
    attrs: { "aria-label": "Status" },
    props: {
      options,
      modelValue: undefined,
      "onUpdate:modelValue": cy.stub().as("onUpdate"),
    },
  });

  cy.get(".group\\/field").click();
  cy.contains("Pending").click();
  cy.get("@onUpdate").should("have.been.calledWith", "pending");
});

test("it should show the selected value", () => {
  cy.mount(Select, {
    props: {
      options,
      modelValue: "active",
    },
  });

  cy.get('[role="combobox"]').should("have.value", "Active");
});

test("it should clear the selection", () => {
  cy.mount(Select, {
    props: {
      options,
      clearable: true,
      modelValue: "active",
      "onUpdate:modelValue": cy.stub().as("onUpdate"),
    },
  });

  cy.get('[aria-label="Clear selection"]').click();
  cy.get("@onUpdate").should("have.been.calledWith", null);
});

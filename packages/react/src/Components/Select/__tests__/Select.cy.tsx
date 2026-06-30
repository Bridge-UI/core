// ** External Imports
import { useState } from "react";

// ** Local Imports
import { Select } from "@/Components/Select";

const options = [
  { label: "Apple", value: "apple" },
  { label: "Banana", value: "banana" },
];

function SelectDemo({
  initialValue = "",
}: {
  initialValue?: string | string[];
}) {
  const [value, setValue] = useState(initialValue);

  return (
    <Select label="Fruit" value={value} options={options} onChange={setValue} />
  );
}

test("it should render with default props", () => {
  cy.mount(<Select options={options} aria-label="Fruit" />);

  cy.get('[role="combobox"]').should("exist");
  cy.get(".w-full").should("exist");
});

test("it should render a label when label prop is provided", () => {
  cy.mount(<Select label="Fruit" options={options} />);

  cy.contains("Fruit").should("be.visible");
});

test("it should open the listbox when the field is clicked", () => {
  cy.mount(<Select options={options} aria-label="Fruit" />);

  cy.get(".group\\/field").click();
  cy.get('[role="listbox"]').should("exist");
  cy.contains("Apple").should("be.visible");
});

test("it should select an option", () => {
  cy.mount(<SelectDemo />);

  cy.get(".group\\/field").click();
  cy.contains("Banana").click();
  cy.get('[role="combobox"]').should("have.value", "Banana");
});

test("it should show the selected value", () => {
  cy.mount(<SelectDemo initialValue="apple" />);

  cy.get('[role="combobox"]').should("have.value", "Apple");
});

test("it should clear the selection", () => {
  cy.mount(<SelectDemo initialValue="apple" />);

  cy.get('[aria-label="Clear selection"]').click();
  cy.get('[role="combobox"]').should("have.value", "");
});

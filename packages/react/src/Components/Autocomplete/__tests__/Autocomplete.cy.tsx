// ** External Imports
import { useState } from "react";

// ** Local Imports
import { Autocomplete } from "@/Components/Autocomplete";

const options = [
  { label: "Apple", value: "apple" },
  { label: "Banana", value: "banana" },
];

function AutocompleteDemo({
  initialValue = "",
}: {
  initialValue?: string | string[];
}) {
  const [value, setValue] = useState(initialValue);

  return (
    <Autocomplete
      label="Fruit"
      value={value}
      options={options}
      onChange={setValue}
    />
  );
}

test("it should render with default props", () => {
  cy.mount(<Autocomplete options={options} aria-label="Fruit" />);

  cy.get('[role="combobox"]').should("exist");
  cy.get(".w-full").should("exist");
});

test("it should render a label when label prop is provided", () => {
  cy.mount(<Autocomplete label="Fruit" options={options} />);

  cy.contains("Fruit").should("be.visible");
});

test("it should open the listbox when the field is clicked", () => {
  cy.mount(<Autocomplete options={options} aria-label="Fruit" />);

  cy.get(".group\\/field").click();
  cy.get('[role="listbox"]').should("exist");
  cy.contains("Apple").should("be.visible");
});

test("it should select an option", () => {
  cy.mount(<AutocompleteDemo />);

  cy.get(".group\\/field").click();
  cy.contains("Banana").click();
  cy.get('[role="combobox"]').should("have.value", "Banana");
});

test("it should show the selected value", () => {
  cy.mount(<AutocompleteDemo initialValue="apple" />);

  cy.get('[role="combobox"]').should("have.value", "Apple");
});

test("it should clear the selection", () => {
  cy.mount(<AutocompleteDemo initialValue="apple" />);

  cy.get('[aria-label="Clear selection"]').click();
  cy.get('[role="combobox"]').should("have.value", "");
});

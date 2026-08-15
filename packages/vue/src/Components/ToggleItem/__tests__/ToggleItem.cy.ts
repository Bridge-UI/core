// ** External Imports
import { h } from "vue";

// ** Local Imports
import { ToggleGroup } from "@/Components/ToggleGroup";
import { ToggleItem } from "@/Components/ToggleItem";

test("it should render a toggle item in the browser", () => {
  cy.mount(ToggleGroup, {
    props: { modelValue: "a", "aria-label": "Options" },
    slots: {
      default: () => [
        h(ToggleItem, { value: "a" }, { default: () => "Alpha" }),
        h(ToggleItem, { value: "b" }, { default: () => "Beta" }),
      ],
    },
  });

  cy.get('[role="radio"]').should("have.length", 2);
  cy.contains("Alpha").click();
  cy.get('[role="radio"][aria-checked="true"]').should("contain", "Alpha");
});

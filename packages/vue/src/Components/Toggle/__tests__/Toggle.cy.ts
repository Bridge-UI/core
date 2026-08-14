// ** External Imports
import { h } from "vue";

// ** Local Imports
import { Toggle } from "@/Components/Toggle";
import { ToggleGroup } from "@/Components/ToggleGroup";

test("it should render a toggle in the browser", () => {
  cy.mount(ToggleGroup, {
    props: { modelValue: "a", "aria-label": "Options" },
    slots: {
      default: () => [
        h(Toggle, { value: "a" }, { default: () => "Alpha" }),
        h(Toggle, { value: "b" }, { default: () => "Beta" }),
      ],
    },
  });

  cy.get('[role="radio"]').should("have.length", 2);
  cy.contains("Alpha").click();
  cy.get('[role="radio"][aria-checked="true"]').should("contain", "Alpha");
});

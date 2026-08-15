// ** External Imports
import { h } from "vue";

// ** Local Imports
import { ToggleGroup } from "@/Components/ToggleGroup";
import { ToggleItem } from "@/Components/ToggleItem";

test("it should render toggle group in the browser", () => {
  cy.mount(ToggleGroup, {
    props: { color: "success", modelValue: "vue", "aria-label": "Library" },
    slots: {
      default: () => [
        h(ToggleItem, { value: "react" }, { default: () => "React" }),
        h(ToggleItem, { value: "vue" }, { default: () => "Vue" }),
      ],
    },
  });

  cy.get('[role="radiogroup"]').should("exist");
  cy.get('[role="radio"][aria-checked="true"]').should("contain", "Vue");
  cy.get('[role="radio"][aria-checked="true"]').should(
    "have.class",
    "bg-success-500/15",
  );
});

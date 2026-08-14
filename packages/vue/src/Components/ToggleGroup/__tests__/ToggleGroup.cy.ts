// ** External Imports
import { h } from "vue";

// ** Local Imports
import { Toggle } from "@/Components/Toggle";
import { ToggleGroup } from "@/Components/ToggleGroup";

test("it should render toggle group in the browser", () => {
  cy.mount(ToggleGroup, {
    props: { color: "success", modelValue: "vue", "aria-label": "Library" },
    slots: {
      default: () => [
        h(Toggle, { value: "react" }, { default: () => "React" }),
        h(Toggle, { value: "vue" }, { default: () => "Vue" }),
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

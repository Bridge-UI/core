// ** External Imports
import { h } from "vue";

// ** Local Imports
import { Step } from "@/Components/Step";
import { Stepper } from "@/Components/Stepper";

test("it should render a step in the browser", () => {
  cy.mount(Stepper, {
    props: { modelValue: 0 },
    slots: {
      default: () => [
        h(Step, { label: "Account" }, { default: () => "Account form" }),
      ],
    },
  });

  cy.contains("Account").should("be.visible");
  cy.get('[aria-current="step"]').should("exist");
});

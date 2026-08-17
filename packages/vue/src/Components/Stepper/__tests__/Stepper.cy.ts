// ** External Imports
import { h } from "vue";

// ** Local Imports
import { Step } from "@/Components/Step";
import { Stepper } from "@/Components/Stepper";

test("it should render stepper in the browser", () => {
  cy.mount(Stepper, {
    props: { modelValue: 1 },
    slots: {
      default: () => [
        h(Step, { label: "Account" }),
        h(Step, { label: "Profile" }),
        h(Step, { label: "Confirm" }),
      ],
    },
  });

  cy.get('[aria-current="step"]').should("contain", "Profile");
  cy.contains("Account").should("be.visible");
});

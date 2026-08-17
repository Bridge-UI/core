// ** Local Imports
import { Step } from "@/Components/Step";
import { Stepper } from "@/Components/Stepper";

test("it should render a step in the browser", () => {
  cy.mount(
    <Stepper activeStep={0}>
      <Step label="Account">Account form</Step>
    </Stepper>,
  );

  cy.contains("Account").should("be.visible");
  cy.get('[aria-current="step"]').should("exist");
});

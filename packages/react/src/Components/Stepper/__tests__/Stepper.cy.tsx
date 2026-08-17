// ** Local Imports
import { Step } from "@/Components/Step";
import { Stepper } from "@/Components/Stepper";

test("it should render stepper in the browser", () => {
  cy.mount(
    <Stepper activeStep={1}>
      <Step label="Account" />
      <Step label="Profile" />
      <Step label="Confirm" />
    </Stepper>,
  );

  cy.get('[aria-current="step"]').should("contain", "Profile");
  cy.contains("Account").should("be.visible");
});

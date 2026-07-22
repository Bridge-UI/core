// ** Local Imports
import { Divider } from "@/Components/Divider";

test("it should render with default props", () => {
  cy.mount(<Divider />);

  cy.get("hr")
    .should("exist")
    .and("have.class", "w-full")
    .and("have.class", "h-px")
    .and("have.attr", "role", "separator")
    .and("have.attr", "aria-orientation", "horizontal");
});

test("it should apply vertical orientation", () => {
  cy.mount(<Divider orientation="vertical" />);

  cy.get("hr")
    .should("have.class", "w-px")
    .and("have.attr", "aria-orientation", "vertical");
});

test("it should apply primary color", () => {
  cy.mount(<Divider color="primary" />);

  cy.get("hr").should("have.class", "bg-primary-200");
});

test("it should merge custom className", () => {
  cy.mount(<Divider className="my-4" />);

  cy.get("hr").should("have.class", "my-4");
});

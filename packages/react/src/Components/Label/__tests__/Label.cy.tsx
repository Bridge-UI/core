// ** Local Imports
import { Label } from "@/Components/Label";

test("it should render with default props", () => {
  cy.mount(<Label>Email</Label>);

  cy.get("label").should("exist").and("contain.text", "Email");
});

test("it should associate with a field via htmlFor", () => {
  cy.mount(<Label htmlFor="field-id">Email</Label>);

  cy.get("label").should("have.attr", "for", "field-id");
});

test("it should apply error color when error is true", () => {
  cy.mount(<Label error>Email</Label>);

  cy.get("label").should("have.class", "text-error-600");
});

test("it should render required asterisk when required is true", () => {
  cy.mount(<Label required>Email</Label>);

  cy.get("label").should("contain.text", "*");
  cy.get("label span").should("have.class", "text-error-500");
});

test("it should apply size typography class", () => {
  cy.mount(<Label size="lg">Email</Label>);

  cy.get("label").should("have.class", "text-sm");
});

test("it should merge custom className", () => {
  cy.mount(<Label className="custom-label">Email</Label>);

  cy.get("label").should("have.class", "custom-label");
});

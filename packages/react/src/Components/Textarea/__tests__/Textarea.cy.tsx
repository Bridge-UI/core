// ** Local Imports
import { Textarea } from "@/Components/Textarea";

test("it should render a textarea with default props", () => {
  cy.mount(<Textarea />);

  cy.get(".w-full").should("exist");
  cy.get("textarea").should("exist");
});

test("it should render a label when label prop is provided", () => {
  cy.mount(<Textarea label="Notes" />);

  cy.contains("Notes").should("be.visible");
});

test("it should render description when description prop is provided", () => {
  cy.mount(<Textarea description="Helper text" />);

  cy.contains("Helper text").should("be.visible");
});

test("it should apply disabled attribute when disabled", () => {
  cy.mount(<Textarea disabled />);

  cy.get("textarea").should("be.disabled");
});

test("it should apply vertical resize when resize is vertical", () => {
  cy.mount(<Textarea resize="vertical" />);

  cy.get("textarea").should("have.class", "resize-y");
});

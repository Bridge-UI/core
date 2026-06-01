// ** Local Imports
import { Textarea } from "@/Components/Textarea";

test("it should render a textarea with default props", () => {
  cy.mount(Textarea);

  cy.get("textarea").should("exist");
  cy.get(".w-full").should("exist");
});

test("it should render a label when label prop is provided", () => {
  cy.mount(Textarea, { props: { label: "Notes" } });

  cy.contains("Notes").should("be.visible");
});

test("it should render description when description prop is provided", () => {
  cy.mount(Textarea, { props: { description: "Helper text" } });

  cy.contains("Helper text").should("be.visible");
});

test("it should apply disabled attribute when disabled", () => {
  cy.mount(Textarea, { props: { disabled: true } });

  cy.get("textarea").should("be.disabled");
});

test("it should apply vertical resize when resize is vertical", () => {
  cy.mount(Textarea, { props: { resize: "vertical" } });

  cy.get("textarea").should("have.class", "resize-y");
});

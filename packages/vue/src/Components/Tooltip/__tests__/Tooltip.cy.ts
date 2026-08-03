// ** External Imports
import { h } from "vue";

// ** Local Imports
import { Button } from "@/Components/Button";
import { Tooltip } from "@/Components/Tooltip";

test("it should not show the tooltip by default", () => {
  cy.mount(() =>
    h(
      Tooltip,
      { content: "Save file" },
      {
        trigger: () => h(Button, null, () => "Save"),
      },
    ),
  );

  cy.get('[role="tooltip"]').should("not.exist");
});

test("it should render when modelValue is true", () => {
  cy.mount(() =>
    h(
      Tooltip,
      { modelValue: true, content: "Save file" },
      {
        trigger: () => h(Button, null, () => "Save"),
      },
    ),
  );

  cy.get('[role="tooltip"]').should("contain.text", "Save file");
});

test("it should render the arrow by default", () => {
  cy.mount(() =>
    h(
      Tooltip,
      { modelValue: true, content: "With arrow" },
      {
        trigger: () => h(Button, null, () => "Save"),
      },
    ),
  );

  cy.get('[role="tooltip"] [aria-hidden="true"]').should(
    "have.class",
    "rotate-45",
  );
});

test("it should apply dark background by default", () => {
  cy.mount(() =>
    h(
      Tooltip,
      { content: "Dark", modelValue: true },
      {
        trigger: () => h(Button, null, () => "Save"),
      },
    ),
  );

  cy.get('[role="tooltip"]').should("have.class", "bg-dark-900");
});

test("it should render custom default slot content", () => {
  cy.mount(() =>
    h(
      Tooltip,
      { modelValue: true },
      {
        default: () => h("strong", "Custom"),
        trigger: () => h(Button, null, () => "Save"),
      },
    ),
  );

  cy.get('[role="tooltip"] strong').should("contain.text", "Custom");
});

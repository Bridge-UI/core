// ** External Imports
import { h } from "vue";

// ** Local Imports
import { Button } from "@/Components/Button";
import { ButtonGroup, ButtonGroupText } from "@/Components/ButtonGroup";

test("it should render a button group in the browser", () => {
  cy.mount(ButtonGroup, {
    props: { "aria-label": "Export" },
    slots: {
      default: () => [
        h(Button, { variant: "outline" }, { default: () => "Copy" }),
        h(Button, { variant: "outline" }, { default: () => "Paste" }),
      ],
    },
  });

  cy.get('[role="group"]')
    .should("exist")
    .and("have.attr", "aria-label", "Export")
    .and("have.class", "flex-row")
    .and("have.class", "gap-px");

  cy.contains("button", "Copy").should("be.visible");
  cy.contains("button", "Paste").should("be.visible");
});

test("it should apply vertical orientation", () => {
  cy.mount(ButtonGroup, {
    props: { "aria-label": "Zoom", orientation: "vertical" },
    slots: {
      default: () => [
        h(Button, null, { default: () => "+" }),
        h(Button, null, { default: () => "-" }),
      ],
    },
  });

  cy.get('[role="group"]').should("have.class", "flex-col");
});

test("it should render ButtonGroupText", () => {
  cy.mount(ButtonGroup, {
    props: { "aria-label": "Currency" },
    slots: {
      default: () => [
        h(ButtonGroupText, null, { default: () => "USD" }),
        h(Button, { variant: "outline" }, { default: () => "Pay" }),
      ],
    },
  });

  cy.contains("USD").should("be.visible").and("have.prop", "tagName", "SPAN");
});

// ** External Imports
import { h } from "vue";

// ** Local Imports
import { Button } from "@/Components/Button";
import { ButtonGroup } from "@/Components/ButtonGroup";

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
    .and("have.class", "flex-row");

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

test("it should render nested button groups", () => {
  cy.mount(ButtonGroup, {
    props: { "aria-label": "Editor" },
    slots: {
      default: () => [
        h(ButtonGroup, null, {
          default: () => [
            h(Button, { variant: "outline" }, { default: () => "Bold" }),
            h(Button, { variant: "outline" }, { default: () => "Italic" }),
          ],
        }),
        h(ButtonGroup, null, {
          default: () => [
            h(Button, { variant: "outline" }, { default: () => "Undo" }),
            h(Button, { variant: "outline" }, { default: () => "Redo" }),
          ],
        }),
      ],
    },
  });

  cy.get('[role="group"]').should("have.length", 3);
  cy.contains("button", "Bold").should("be.visible");
  cy.contains("button", "Undo").should("be.visible");
});

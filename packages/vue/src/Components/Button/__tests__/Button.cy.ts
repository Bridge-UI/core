// ** External Imports
import { CircleAlert } from "lucide-vue-next";

// ** Local Imports
import { Button } from "@/Components/Button";

test("it should render a button with default props", () => {
  cy.mount(Button, { slots: { default: () => "Click me" } });

  cy.get("button").should("exist").and("contain.text", "Click me");
});

test("it should apply disabled attribute when disabled", () => {
  cy.mount(Button, {
    props: { disabled: true },
    slots: { default: () => "Disabled" },
  });

  cy.get("button").should("be.disabled");
});

test("it should show loading spinner when loading", () => {
  cy.mount(Button, {
    props: { loading: true },
    slots: { default: () => "Saving" },
  });

  cy.get("button").should("have.attr", "aria-busy", "true");
  cy.get("svg.animate-spin").should("exist");
});

test("it should render start icon when startIcon prop is set", () => {
  cy.mount(Button, {
    props: { startIcon: CircleAlert },
    slots: { default: () => "With icon" },
  });

  cy.get("button svg").should("have.length.at.least", 1);
});

test("it should render as anchor when as is a", () => {
  cy.mount(Button, {
    props: { as: "a", href: "https://example.com" },
    slots: { default: () => "Link" },
  });

  cy.get("a").should("have.attr", "href", "https://example.com");
});

test("it should apply full width class when full is true", () => {
  cy.mount(Button, {
    props: { full: true },
    slots: { default: () => "Full" },
  });

  cy.get("button").should("have.class", "w-full");
});

test("it should render start slot content", () => {
  cy.mount(Button, {
    slots: {
      default: () => "Label",
      start: () => "◀",
    },
  });

  cy.contains("◀").should("be.visible");
  cy.contains("Label").should("be.visible");
});

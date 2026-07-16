// ** External Imports
import { CircleAlert, Settings } from "@lucide/vue";

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

  cy.get("svg.animate-spin").should("exist");
  cy.get("button").should("not.contain.text", "Saving");
  cy.get("button").should("have.attr", "aria-busy", "true");
});

test("it should render text prop when default slot is not used", () => {
  cy.mount(Button, { props: { text: "Click me" } });

  cy.get("button").should("exist").and("contain.text", "Click me");
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
    slots: { default: () => "Link" },
    props: { as: "a", href: "https://example.com" },
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
      start: () => "◀",
      default: () => "Label",
    },
  });

  cy.contains("◀").should("be.visible");
  cy.contains("Label").should("be.visible");
});

test("it should render mini density with icon", () => {
  cy.mount(Button, {
    props: {
      icon: Settings,
      density: "mini",
      "aria-label": "Settings",
    },
  });

  cy.get("button svg").should("exist");
  cy.get("button").should("have.class", "w-7");
  cy.get("button").should("not.have.class", "w-full");
});

test("it should disable mini density button", () => {
  cy.mount(Button, {
    props: {
      icon: Settings,
      disabled: true,
      density: "mini",
      "aria-label": "Settings",
    },
  });

  cy.get("button").should("be.disabled");
});

test("it should show spinner when mini density is loading", () => {
  cy.mount(Button, {
    props: {
      loading: true,
      icon: Settings,
      density: "mini",
      "aria-label": "Settings",
    },
  });

  cy.get("svg.animate-spin").should("exist");
  cy.get("button").should("have.attr", "aria-busy", "true");
});

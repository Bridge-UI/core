// ** External Imports
import { Settings } from "lucide-vue-next";

// ** Local Imports
import { MiniButton } from "@/Components/MiniButton";

test("it should render a button with an icon", () => {
  cy.mount(MiniButton, {
    props: { icon: Settings },
    attrs: { "aria-label": "Settings" },
  });

  cy.get("button").should("exist").and("have.attr", "aria-label", "Settings");
  cy.get("button svg").should("exist");
});

test("it should apply disabled attribute when disabled", () => {
  cy.mount(MiniButton, {
    props: { icon: Settings, disabled: true },
    attrs: { "aria-label": "Settings" },
  });

  cy.get("button").should("be.disabled");
});

test("it should show loading spinner when loading", () => {
  cy.mount(MiniButton, {
    props: { icon: Settings, loading: true },
    attrs: { "aria-label": "Settings" },
  });

  cy.get("svg.animate-spin").should("exist");
  cy.get("button").should("have.attr", "aria-busy", "true");
});

test("it should render as anchor when as is a", () => {
  cy.mount(MiniButton, {
    props: { as: "a", href: "https://example.com", icon: Settings },
    attrs: { "aria-label": "Settings" },
  });

  cy.get("a").should("have.attr", "href", "https://example.com");
});

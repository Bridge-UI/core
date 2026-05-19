// ** External Imports
import { Info } from "lucide-vue-next";

// ** Local Imports
import { Link } from "@/Components/Link";

test("it should render as an anchor with default slot content", () => {
  cy.mount(Link, {
    props: { href: "/docs" },
    slots: { default: () => "Documentation" },
  });

  cy.get("a").should("have.attr", "href", "/docs");
  cy.contains("Documentation").should("be.visible");
});

test("it should apply aria-disabled when disabled", () => {
  cy.mount(Link, {
    props: { href: "/docs", disabled: true },
    slots: { default: () => "Disabled" },
  });

  cy.get("a").should("have.attr", "aria-disabled", "true");
});

test("it should open in a new tab when external is true", () => {
  cy.mount(Link, {
    props: { href: "https://example.com", external: true },
    slots: { default: () => "External" },
  });

  cy.get("a")
    .should("have.attr", "target", "_blank")
    .and("have.attr", "rel", "noopener noreferrer");
});

test("it should render left icon when leftIcon prop is set", () => {
  cy.mount(Link, {
    props: { href: "/docs", leftIcon: Info },
    slots: { default: () => "Docs" },
  });

  cy.get("a svg").should("have.length.at.least", 1);
});

test("it should render prepend slot content", () => {
  cy.mount(Link, {
    props: { href: "/docs" },
    slots: {
      prepend: () => "◀",
      default: () => "Docs",
    },
  });

  cy.contains("◀").should("be.visible");
  cy.contains("Docs").should("be.visible");
});

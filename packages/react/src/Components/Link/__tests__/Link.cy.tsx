// ** External Imports
import { Info } from "lucide-react";

// ** Local Imports
import { Link } from "@/Components/Link";

test("it should render as an anchor with children", () => {
  cy.mount(<Link href="/docs">Documentation</Link>);

  cy.get("a").should("have.attr", "href", "/docs");
  cy.contains("Documentation").should("be.visible");
});

test("it should apply aria-disabled when disabled", () => {
  cy.mount(
    <Link href="/docs" disabled>
      Disabled
    </Link>,
  );

  cy.contains("Disabled").should("have.attr", "aria-disabled", "true");
});

test("it should open in a new tab when external is true", () => {
  cy.mount(
    <Link href="https://example.com" external>
      External
    </Link>,
  );

  cy.get("a")
    .should("have.attr", "target", "_blank")
    .and("have.attr", "rel", "noopener noreferrer");
});

test("it should render left icon when leftIcon prop is set", () => {
  cy.mount(
    <Link href="/docs" leftIcon={Info}>
      Docs
    </Link>,
  );

  cy.get("a svg").should("have.length.at.least", 1);
});

test("it should render prepend slot content", () => {
  cy.mount(
    <Link href="/docs" slots={{ prepend: <span data-cy="prepend">◀</span> }}>
      Docs
    </Link>,
  );

  cy.get("[data-cy=prepend]").should("be.visible");
  cy.contains("Docs").should("be.visible");
});

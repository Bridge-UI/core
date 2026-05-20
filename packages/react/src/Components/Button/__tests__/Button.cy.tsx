// ** External Imports
import { CircleAlert } from "lucide-react";

import { Settings } from "lucide-react";

// ** Local Imports
import { Button } from "@/Components/Button";

test("it should render a button with default props", () => {
  cy.mount(<Button>Click me</Button>);

  cy.get("button").should("exist").and("contain.text", "Click me");
});

test("it should apply disabled attribute when disabled", () => {
  cy.mount(<Button disabled>Disabled</Button>);

  cy.get("button").should("be.disabled");
});

test("it should show loading spinner when loading", () => {
  cy.mount(<Button loading>Saving</Button>);

  cy.get("svg.animate-spin").should("exist");
  cy.get("button").should("not.contain.text", "Saving");
  cy.get("button").should("have.attr", "aria-busy", "true");
});

test("it should render text prop when children are not provided", () => {
  cy.mount(<Button text="Click me" />);

  cy.get("button").should("exist").and("contain.text", "Click me");
});

test("it should render start icon when startIcon prop is set", () => {
  cy.mount(<Button startIcon={CircleAlert}>With icon</Button>);

  cy.get("button svg").should("have.length.at.least", 1);
});

test("it should render as anchor when as is a", () => {
  cy.mount(
    <Button as="a" href="https://example.com">
      Link
    </Button>,
  );

  cy.get("a").should("have.attr", "href", "https://example.com");
});

test("it should apply full width class when full is true", () => {
  cy.mount(<Button full>Full</Button>);

  cy.get("button").should("have.class", "w-full");
});

test("it should render start slot content", () => {
  cy.mount(
    <Button slots={{ start: <span data-cy="start-slot">◀</span> }}>
      Label
    </Button>,
  );

  cy.contains("Label").should("be.visible");
  cy.get("[data-cy=start-slot]").should("be.visible");
});

test("it should render mini density with icon", () => {
  cy.mount(<Button density="mini" icon={Settings} aria-label="Settings" />);

  cy.get("button svg").should("exist");
  cy.get("button").should("have.class", "w-7");
  cy.get("button").should("not.have.class", "w-full");
});

test("it should disable mini density button", () => {
  cy.mount(
    <Button density="mini" icon={Settings} disabled aria-label="Settings" />,
  );

  cy.get("button").should("be.disabled");
});

test("it should show spinner when mini density is loading", () => {
  cy.mount(
    <Button density="mini" loading icon={Settings} aria-label="Settings" />,
  );

  cy.get("svg.animate-spin").should("exist");
  cy.get("button").should("have.attr", "aria-busy", "true");
});

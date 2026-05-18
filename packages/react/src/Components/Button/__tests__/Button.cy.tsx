// ** External Imports
import { CircleAlert } from "lucide-react";

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

  cy.get("button").should("have.attr", "aria-busy", "true");
  cy.get("svg.animate-spin").should("exist");
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

  cy.get("[data-cy=start-slot]").should("be.visible");
  cy.contains("Label").should("be.visible");
});

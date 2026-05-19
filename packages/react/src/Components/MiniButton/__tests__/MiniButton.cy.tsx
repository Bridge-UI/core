// ** External Imports
import { Settings } from "lucide-react";

// ** Local Imports
import { MiniButton } from "@/Components/MiniButton";

test("it should render a button with an icon", () => {
  cy.mount(<MiniButton icon={Settings} aria-label="Settings" />);

  cy.get("button").should("exist").and("have.attr", "aria-label", "Settings");
  cy.get("button svg").should("exist");
});

test("it should apply disabled attribute when disabled", () => {
  cy.mount(<MiniButton icon={Settings} disabled aria-label="Settings" />);

  cy.get("button").should("be.disabled");
});

test("it should show loading spinner when loading", () => {
  cy.mount(<MiniButton loading icon={Settings} aria-label="Settings" />);

  cy.get("svg.animate-spin").should("exist");
  cy.get("button").should("have.attr", "aria-busy", "true");
});

test("it should render as anchor when as is a", () => {
  cy.mount(
    <MiniButton
      as="a"
      href="https://example.com"
      icon={Settings}
      aria-label="Settings"
    />,
  );

  cy.get("a").should("have.attr", "href", "https://example.com");
});

// ** External Imports
import { Info } from "lucide-react";

// ** Local Imports
import { Icon } from "@/Components/Icon";

test("it should render an SVG element", () => {
  cy.mount(<Icon icon={Info} />);

  cy.get("svg").should("exist");
});

test("it should apply default md size classes", () => {
  cy.mount(<Icon icon={Info} />);

  cy.get("svg").should("have.class", "w-4").and("have.class", "h-4");
});

test("it should apply sm size classes", () => {
  cy.mount(<Icon size="sm" icon={Info} />);

  cy.get("svg").should("have.class", "w-3.5").and("have.class", "h-3.5");
});

test("it should apply xl size classes", () => {
  cy.mount(<Icon size="xl" icon={Info} />);

  cy.get("svg").should("have.class", "w-6").and("have.class", "h-6");
});

test("it should merge custom className prop", () => {
  cy.mount(<Icon icon={Info} className="text-red-500" />);

  cy.get("svg").should("have.class", "text-red-500");
});

test("it should apply lg size classes", () => {
  cy.mount(<Icon size="lg" icon={Info} />);

  cy.get("svg").should("have.class", "w-5").and("have.class", "h-5");
});

test("it should apply 2xs size classes", () => {
  cy.mount(<Icon size="2xs" icon={Info} />);

  cy.get("svg").should("have.class", "w-2").and("have.class", "h-2");
});

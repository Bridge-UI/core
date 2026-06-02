// ** Local Imports
import { Card } from "@/Components/Card";

test("it should render with default props", () => {
  cy.mount(Card);

  cy.get("div").should("exist");
});

test("it should render a title when title prop is provided", () => {
  cy.mount(Card, { props: { title: "Card title" } });

  cy.contains("Card title").should("be.visible");
});

test("it should render body content via default slot", () => {
  cy.mount(Card, {
    props: { title: "Info" },
    slots: { default: () => "This is the body content" },
  });

  cy.contains("This is the body content").should("be.visible");
});

test("it should apply rounded classes when rounded prop is set", () => {
  cy.mount(Card, { props: { title: "Rounded", rounded: "lg" } });

  cy.contains("Rounded")
    .closest(".flex.w-full")
    .should("have.class", "rounded-lg");
});

test("it should apply shadow classes for elevated variant", () => {
  cy.mount(Card, {
    props: { title: "Shadow", variant: "elevated", shadow: "md" },
  });

  cy.contains("Shadow")
    .closest(".flex.w-full")
    .should("have.class", "shadow-md");
});

test("it should not apply shadow for flat variant", () => {
  cy.mount(Card, {
    props: { title: "Flat", variant: "flat", shadow: "md" },
  });

  cy.contains("Flat")
    .closest(".flex.w-full")
    .should("not.have.class", "shadow-md");
});

test("it should apply outlined border on root", () => {
  cy.mount(Card, { props: { title: "Outlined", variant: "outlined" } });

  cy.contains("Outlined")
    .closest(".flex.w-full")
    .should("have.class", "border");
});

test("it should render footer slot content", () => {
  cy.mount(Card, {
    props: { title: "With footer" },
    slots: { footer: () => "Footer content" },
  });

  cy.contains("Footer content").should("be.visible");
});

test("it should render action slot content", () => {
  cy.mount(Card, {
    props: { title: "With action" },
    slots: { action: () => "Action" },
  });

  cy.contains("Action").should("be.visible");
});

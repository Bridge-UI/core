// ** Local Imports
import { EmptyState } from "@/Components/EmptyState";

test("it should render with default props", () => {
  cy.mount(EmptyState, { props: { title: "Empty" } });

  cy.contains("Empty").should("be.visible");
});

test("it should render a title when title prop is provided", () => {
  cy.mount(EmptyState, { props: { title: "No projects yet" } });

  cy.contains("No projects yet").should("be.visible");
});

test("it should render description when description prop is provided", () => {
  cy.mount(EmptyState, {
    props: {
      title: "No projects yet",
      description: "Create your first project to get started.",
    },
  });

  cy.contains("Create your first project to get started.").should("be.visible");
});

test("it should render the default icon when icon is provided", () => {
  cy.mount(EmptyState, { props: { icon: "search", title: "No results" } });

  cy.get("svg").should("exist");
});

test("it should apply compact size classes when size is sm", () => {
  cy.mount(EmptyState, { props: { size: "sm", title: "No results" } });

  cy.contains("No results").closest(".max-w-sm").should("exist");
});

test("it should render action slot content", () => {
  cy.mount(EmptyState, {
    props: { title: "No projects yet" },
    slots: { action: () => "New project" },
  });

  cy.contains("New project").should("be.visible");
});

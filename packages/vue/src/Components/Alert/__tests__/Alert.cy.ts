// ** Local Imports
import Alert from "@/Components/Alert";

test("it should render with default props", () => {
  cy.mount(Alert);

  cy.get("div").should("exist");
});

test("it should render a title when title prop is provided", () => {
  cy.mount(Alert, { props: { title: "Heads up!" } });

  cy.contains("Heads up!").should("be.visible");
});

test("it should render body content via default slot", () => {
  cy.mount(Alert, {
    props: { title: "Info" },
    slots: { default: () => "This is the body content" },
  });

  cy.contains("This is the body content").should("be.visible");
});

test("it should render the default icon for error color", () => {
  cy.mount(Alert, { props: { title: "Error", color: "error" } });

  cy.get("svg").should("exist");
});

test("it should not render an icon when icon is null", () => {
  cy.mount(Alert, { props: { title: "No icon", icon: null } });

  cy.get("svg").should("not.exist");
});

test("it should apply rounded classes when rounded prop is set", () => {
  cy.mount(Alert, { props: { title: "Rounded", rounded: "lg" } });

  cy.get("div").first().should("have.class", "rounded-lg");
});

test("it should apply shadow classes when shadow prop is set", () => {
  cy.mount(Alert, { props: { title: "Shadow", shadow: "md" } });

  cy.get("div").first().should("have.class", "shadow-md");
});

test("it should render footer slot content", () => {
  cy.mount(Alert, {
    props: { title: "With footer" },
    slots: { footer: () => "Footer content" },
  });

  cy.contains("Footer content").should("be.visible");
});

test("it should render action slot content", () => {
  cy.mount(Alert, {
    props: { title: "With action" },
    slots: { action: () => "Dismiss" },
  });

  cy.contains("Dismiss").should("be.visible");
});

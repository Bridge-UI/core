// ** Local Imports
import { Alert } from "@/Components/Alert";

test("it should render with default props", () => {
  cy.mount(<Alert />);

  cy.get("div").should("exist");
});

test("it should render a title when title prop is provided", () => {
  cy.mount(<Alert title="Heads up!" />);

  cy.contains("Heads up!").should("be.visible");
});

test("it should render body content via children", () => {
  cy.mount(<Alert title="Info">This is the body content</Alert>);

  cy.contains("This is the body content").should("be.visible");
});

test("it should render the default icon for error color", () => {
  cy.mount(<Alert title="Error" color="error" />);

  cy.get("svg").should("exist");
});

test("it should not render an icon when icon is null", () => {
  cy.mount(<Alert title="No icon" icon={null} />);

  cy.get("svg").should("not.exist");
});

test("it should apply rounded classes when rounded prop is set", () => {
  cy.mount(<Alert title="Rounded" rounded="lg" />);

  cy.contains("Rounded").closest(".w-full").should("have.class", "rounded-lg");
});

test("it should apply shadow classes when shadow prop is set", () => {
  cy.mount(<Alert title="Shadow" shadow="md" />);

  cy.contains("Shadow").closest(".w-full").should("have.class", "shadow-md");
});

test("it should render footer slot content", () => {
  cy.mount(
    <Alert
      title="With footer"
      slots={{ footer: <span>Footer content</span> }}
    />,
  );

  cy.contains("Footer content").should("be.visible");
});

test("it should render action slot content", () => {
  cy.mount(
    <Alert
      title="With action"
      slots={{ action: <button type="button">Dismiss</button> }}
    />,
  );

  cy.contains("Dismiss").should("be.visible");
});

// ** Local Imports
import { Text } from "@/Components/Text";

test("it should render with default props", () => {
  cy.mount(<Text>Hello</Text>);

  cy.get("p")
    .should("contain.text", "Hello")
    .and("have.class", "text-base")
    .and("have.class", "text-dark-950");
});

test("it should render muted text", () => {
  cy.mount(<Text variant="muted">Hello</Text>);

  cy.get("p").should("have.class", "text-dark-500");
});

test("it should render as a span", () => {
  cy.mount(
    <Text as="span" size="xs">
      Hello
    </Text>,
  );

  cy.get("span").should("have.class", "text-xs");
});

test("it should apply color and weight", () => {
  cy.mount(
    <Text color="error" weight="bold">
      Hello
    </Text>,
  );

  cy.get("p")
    .should("have.class", "text-error-600")
    .and("have.class", "font-bold");
});

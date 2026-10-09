// ** Local Imports
import { Heading } from "@/Components/Heading";

test("it should render with default props", () => {
  cy.mount(<Heading>Title</Heading>);

  cy.get("h2")
    .should("contain.text", "Title")
    .and("have.class", "text-2xl")
    .and("have.class", "font-semibold");
});

test("it should render the given level", () => {
  cy.mount(<Heading level={1}>Title</Heading>);

  cy.get("h1").should("have.class", "text-3xl");
});

test("it should apply size over level", () => {
  cy.mount(
    <Heading size="md" level={1}>
      Title
    </Heading>,
  );

  cy.get("h1").should("have.class", "text-base");
});

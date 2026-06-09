// ** Local Imports
import { List } from "@/Components/List";
import { ListSection } from "@/Components/ListSection";

test("it should render the title from the title prop", () => {
  cy.mount(<ListSection title="Section title" />);

  cy.contains("Section title").should("be.visible");
});

test("it should render children as the title", () => {
  cy.mount(<ListSection>Custom label</ListSection>);

  cy.contains("Custom label").should("be.visible");
});

test("it should apply sticky classes when sticky is true", () => {
  cy.mount(<ListSection title="Sticky" sticky />);

  cy.get('[role="presentation"]').should("have.class", "sticky");
});

test("it should inherit dense padding from parent List", () => {
  cy.mount(
    <List dense>
      <ListSection title="Dense section" />
    </List>,
  );

  cy.get('[role="presentation"]').should("have.class", "py-1.5");
});

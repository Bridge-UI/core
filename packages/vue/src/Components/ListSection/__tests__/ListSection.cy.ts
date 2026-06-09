// ** External Imports
import { defineComponent } from "vue";

// ** Local Imports
import { List } from "@/Components/List";
import { ListSection } from "@/Components/ListSection";

test("it should render the title from the title prop", () => {
  cy.mount(ListSection, { props: { title: "Section title" } });

  cy.contains("Section title").should("be.visible");
});

test("it should render default slot content as the title", () => {
  cy.mount(ListSection, {
    slots: { default: () => "Custom label" },
  });

  cy.contains("Custom label").should("be.visible");
});

test("it should apply sticky classes when sticky is true", () => {
  cy.mount(ListSection, {
    props: { sticky: true, title: "Sticky" },
  });

  cy.get('[role="presentation"]').should("have.class", "sticky");
});

test("it should inherit dense padding from parent List", () => {
  const Host = defineComponent({
    components: { List, ListSection },
    template: '<List dense><ListSection title="Dense section" /></List>',
  });

  cy.mount(Host);

  cy.get('[role="presentation"]').should("have.class", "py-1.5");
});

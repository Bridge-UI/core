// ** External Imports
import { h } from "vue";

// ** Local Imports
import { TabItem } from "@/Components/TabItem";
import { Tabs } from "@/Components/Tabs";

test("it should render TabItem-driven tabs in the browser", () => {
  cy.mount(Tabs, {
    props: { modelValue: "a" },
    slots: {
      default: () => [
        h(TabItem, { label: "A", value: "a" }, { default: () => "Panel A" }),
        h(TabItem, { label: "B", value: "b" }, { default: () => "Panel B" }),
      ],
    },
  });

  cy.get('[role="tablist"]').should("exist");
  cy.get('[role="tab"]').should("have.length", 2);
  cy.get('[role="tabpanel"]').should("exist");
});

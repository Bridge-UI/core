// ** External Imports
import { h } from "vue";

// ** Local Imports
import { Tab } from "@/Components/Tab";
import { TabList } from "@/Components/TabList";
import { Tabs } from "@/Components/Tabs";

test("it should render a tab in the browser", () => {
  cy.mount(Tabs, {
    props: { modelValue: "a" },
    slots: {
      default: () =>
        h(TabList, null, {
          default: () => h(Tab, { value: "a" }, { default: () => "Alpha" }),
        }),
    },
  });

  cy.get('[role="tab"]').should("be.visible");
});

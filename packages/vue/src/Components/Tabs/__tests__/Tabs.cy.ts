// ** External Imports
import { h } from "vue";

// ** Local Imports
import { Tab } from "@/Components/Tab";
import { TabList } from "@/Components/TabList";
import { TabPanel } from "@/Components/TabPanel";
import { Tabs } from "@/Components/Tabs";

test("it should render tabs in the browser", () => {
  cy.mount(Tabs, {
    props: { modelValue: "one" },
    slots: {
      default: () => [
        h(TabList, null, {
          default: () => [
            h(Tab, { value: "one" }, { default: () => "One" }),
            h(Tab, { value: "two" }, { default: () => "Two" }),
          ],
        }),
        h(TabPanel, { value: "one" }, { default: () => "First" }),
        h(TabPanel, { value: "two" }, { default: () => "Second" }),
      ],
    },
  });

  cy.get('[role="tablist"]').should("be.visible");
  cy.get('[role="tab"][aria-selected="true"]').should("contain.text", "One");
});

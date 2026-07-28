// ** External Imports
import { h } from "vue";

// ** Local Imports
import { Tab } from "@/Components/Tab";
import { TabList } from "@/Components/TabList";
import { TabPanel } from "@/Components/TabPanel";
import { Tabs } from "@/Components/Tabs";

test("it should render a tabpanel in the browser", () => {
  cy.mount(Tabs, {
    props: { modelValue: "a" },
    slots: {
      default: () => [
        h(TabList, null, {
          default: () => h(Tab, { value: "a" }, { default: () => "Alpha" }),
        }),
        h(TabPanel, { value: "a" }, { default: () => "Content" }),
      ],
    },
  });

  cy.get('[role="tabpanel"]').should("be.visible");
});

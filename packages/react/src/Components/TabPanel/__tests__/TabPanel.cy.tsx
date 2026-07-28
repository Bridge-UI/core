// ** Local Imports
import { Tab } from "@/Components/Tab";
import { TabList } from "@/Components/TabList";
import { TabPanel } from "@/Components/TabPanel";
import { Tabs } from "@/Components/Tabs";

test("it should render a tabpanel in the browser", () => {
  cy.mount(
    <Tabs defaultValue="a">
      <TabList>
        <Tab value="a">Alpha</Tab>
      </TabList>
      <TabPanel value="a">Content</TabPanel>
    </Tabs>,
  );

  cy.get('[role="tabpanel"]').should("exist");
});

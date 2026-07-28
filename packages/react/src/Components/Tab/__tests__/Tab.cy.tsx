// ** Local Imports
import { Tab } from "@/Components/Tab";
import { TabList } from "@/Components/TabList";
import { Tabs } from "@/Components/Tabs";

test("it should render a tab in the browser", () => {
  cy.mount(
    <Tabs defaultValue="a">
      <TabList>
        <Tab value="a">Alpha</Tab>
      </TabList>
    </Tabs>,
  );

  cy.get('[role="tab"]').should("exist");
});

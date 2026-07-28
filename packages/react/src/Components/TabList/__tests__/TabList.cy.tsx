// ** Local Imports
import { Tab } from "@/Components/Tab";
import { TabList } from "@/Components/TabList";
import { Tabs } from "@/Components/Tabs";

test("it should render tablist in the browser", () => {
  cy.mount(
    <Tabs defaultValue="a">
      <TabList>
        <Tab value="a">A</Tab>
      </TabList>
    </Tabs>,
  );

  cy.get('[role="tablist"]').should("exist");
});

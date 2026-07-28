// ** Local Imports
import { TabItem } from "@/Components/TabItem";
import { Tabs } from "@/Components/Tabs";

test("it should render TabItem-driven tabs in the browser", () => {
  cy.mount(
    <Tabs defaultValue="a">
      <TabItem label="A" value="a">
        Panel A
      </TabItem>
      <TabItem label="B" value="b">
        Panel B
      </TabItem>
    </Tabs>,
  );

  cy.get('[role="tablist"]').should("exist");
  cy.get('[role="tab"]').should("have.length", 2);
  cy.get('[role="tabpanel"]').should("exist");
});

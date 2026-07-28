// ** External Imports
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";

// ** Local Imports
import { Tab } from "@/Components/Tab";
import { TabList } from "@/Components/TabList";
import { TabPanel } from "@/Components/TabPanel";
import { Tabs } from "@/Components/Tabs";

afterEach(() => {
  cleanup();
});

test("it should render a tabpanel linked to its tab", () => {
  render(
    <Tabs defaultValue="a">
      <TabList>
        <Tab value="a">Alpha</Tab>
      </TabList>
      <TabPanel value="a">Content</TabPanel>
    </Tabs>,
  );

  const panel = screen.getByRole("tabpanel");

  expect(panel.textContent).toBe("Content");
  expect(panel.getAttribute("aria-labelledby")).toBeTruthy();
});

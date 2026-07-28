// ** External Imports
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";

// ** Local Imports
import { Tab } from "@/Components/Tab";
import { TabList } from "@/Components/TabList";
import { Tabs } from "@/Components/Tabs";

afterEach(() => {
  cleanup();
});

test("it should render a tab button with aria attributes", () => {
  render(
    <Tabs defaultValue="a">
      <TabList>
        <Tab value="a">Alpha</Tab>
      </TabList>
    </Tabs>,
  );

  const tab = screen.getByRole("tab", { name: "Alpha" });

  expect(tab.getAttribute("aria-selected")).toBe("true");
  expect(tab.getAttribute("tabindex")).toBe("0");
});

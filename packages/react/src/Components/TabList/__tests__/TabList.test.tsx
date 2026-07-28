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

test("it should render a tablist container", () => {
  render(
    <Tabs defaultValue="a">
      <TabList aria-label="Demo">
        <Tab value="a">A</Tab>
      </TabList>
    </Tabs>,
  );

  expect(screen.getByRole("tablist", { name: "Demo" })).toBeTruthy();
});

// ** External Imports
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, expect, test } from "vitest";

// ** Local Imports
import { TabItem } from "@/Components/TabItem";
import { Tabs } from "@/Components/Tabs";
import { useTabsContext } from "@/Components/Tabs/TabsContext";

afterEach(() => {
  cleanup();
});

test("it should register a tab item on the Tabs context", async () => {
  let itemsLength = 0;

  function Probe() {
    const tabs = useTabsContext();
    itemsLength = tabs.tabItems.length;

    return null;
  }

  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <Tabs defaultValue="a">
        {children}
        <Probe />
      </Tabs>
    );
  }

  render(
    <Wrapper>
      <TabItem label="A" value="a">
        Panel
      </TabItem>
    </Wrapper>,
  );

  await waitFor(() => {
    expect(itemsLength).toBe(1);
  });
  expect(screen.getByRole("tab", { name: "A" })).toBeTruthy();
});

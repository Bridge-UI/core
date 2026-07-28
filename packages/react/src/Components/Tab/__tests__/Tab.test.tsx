// ** External Imports
import { cleanup, render, screen } from "@testing-library/react";
import { ChevronRight, User } from "lucide-react";
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

test("it should render a leading icon when startIcon is set", () => {
  const { container } = render(
    <Tabs defaultValue="a">
      <TabList>
        <Tab value="a" startIcon={User}>
          Alpha
        </Tab>
      </TabList>
    </Tabs>,
  );

  expect(container.querySelector("svg")).toBeTruthy();
  expect(screen.getByRole("tab", { name: "Alpha" }).className).toContain(
    "gap-",
  );
});

test("it should render start and end slots when icon props are omitted", () => {
  render(
    <Tabs defaultValue="a">
      <TabList>
        <Tab
          value="a"
          slots={{
            end: <span data-testid="end-slot">end</span>,
            start: <span data-testid="start-slot">start</span>,
          }}
        >
          Alpha
        </Tab>
      </TabList>
    </Tabs>,
  );

  expect(screen.getByTestId("start-slot")).toBeTruthy();
  expect(screen.getByTestId("end-slot")).toBeTruthy();
});

test("it should prefer endIcon over the end slot", () => {
  const { container } = render(
    <Tabs defaultValue="a">
      <TabList>
        <Tab
          value="a"
          endIcon={ChevronRight}
          slots={{
            end: <span data-testid="end-slot">end</span>,
          }}
        >
          Alpha
        </Tab>
      </TabList>
    </Tabs>,
  );

  expect(container.querySelector("svg")).toBeTruthy();
  expect(screen.queryByTestId("end-slot")).toBeNull();
});

// ** External Imports
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { afterEach, expect, test, vi } from "vitest";

// ** Local Imports
import { Tab } from "@/Components/Tab";
import { TabList } from "@/Components/TabList";
import { TabPanel } from "@/Components/TabPanel";
import { Tabs } from "@/Components/Tabs";

afterEach(() => {
  cleanup();
});

function BasicTabs({
  onChange,
  value: controlled,
}: {
  onChange?: (value: string) => void;
  value?: string;
}) {
  const [value, setValue] = useState(controlled ?? "a");

  return (
    <Tabs
      value={controlled ?? value}
      onChange={(next) => {
        setValue(next);
        onChange?.(next);
      }}
    >
      <TabList>
        <Tab value="a">Alpha</Tab>
        <Tab value="b">Beta</Tab>
        <Tab disabled value="c">
          Gamma
        </Tab>
      </TabList>
      <TabPanel value="a">Panel A</TabPanel>
      <TabPanel value="b">Panel B</TabPanel>
      <TabPanel value="c">Panel C</TabPanel>
    </Tabs>
  );
}

test("it should render tablist tabs and the selected panel", () => {
  render(<BasicTabs />);

  expect(screen.getByRole("tablist")).toBeTruthy();
  expect(screen.getByText("Panel B").hasAttribute("hidden")).toBe(true);
  expect(screen.getByText("Panel A").hasAttribute("hidden")).toBe(false);
  expect(
    screen.getByRole("tab", { name: "Alpha" }).getAttribute("aria-selected"),
  ).toBe("true");
});

test("it should change selection when a tab is clicked", () => {
  const onChange = vi.fn();

  render(<BasicTabs onChange={onChange} />);

  fireEvent.click(screen.getByRole("tab", { name: "Beta" }));

  expect(onChange).toHaveBeenCalledWith("b");
  expect(screen.getByText("Panel B").hasAttribute("hidden")).toBe(false);
  expect(
    screen.getByRole("tab", { name: "Beta" }).getAttribute("aria-selected"),
  ).toBe("true");
});

test("it should not select a disabled tab", () => {
  const onChange = vi.fn();

  render(<BasicTabs onChange={onChange} />);

  fireEvent.click(screen.getByRole("tab", { name: "Gamma" }));

  expect(onChange).not.toHaveBeenCalled();
  expect(
    screen.getByRole("tab", { name: "Alpha" }).getAttribute("aria-selected"),
  ).toBe("true");
});

test("it should move selection with arrow keys when activation is automatic", () => {
  const onChange = vi.fn();

  render(<BasicTabs onChange={onChange} />);

  const list = screen.getByRole("tablist");

  fireEvent.keyDown(list, { key: "ArrowRight" });

  expect(onChange).toHaveBeenCalledWith("b");
});

test("it should unmount inactive panels when keepMounted is false", () => {
  render(
    <Tabs defaultValue="a" keepMounted={false}>
      <TabList>
        <Tab value="a">Alpha</Tab>
        <Tab value="b">Beta</Tab>
      </TabList>
      <TabPanel value="a">Panel A</TabPanel>
      <TabPanel value="b">Panel B</TabPanel>
    </Tabs>,
  );

  expect(screen.getByText("Panel A")).toBeTruthy();
  expect(screen.queryByText("Panel B")).toBeNull();
});

test("it should apply line underline classes with after content", () => {
  render(
    <Tabs variant="line" defaultValue="a">
      <TabList>
        <Tab value="a">Alpha</Tab>
      </TabList>
      <TabPanel value="a">Panel A</TabPanel>
    </Tabs>,
  );

  const tab = screen.getByRole("tab", { name: "Alpha" });

  expect(tab.className).toContain("after:bg-current");
  expect(tab.className).toContain("after:content-['']");
});

test("it should apply muted track and elevated pill classes", () => {
  render(
    <Tabs defaultValue="a">
      <TabList>
        <Tab value="a">Alpha</Tab>
      </TabList>
      <TabPanel value="a">Panel A</TabPanel>
    </Tabs>,
  );

  expect(screen.getByRole("tablist").className).toContain("bg-dark-100");
  expect(screen.getByRole("tablist").className).toContain("p-1");
  expect(screen.getByRole("tab", { name: "Alpha" }).className).toContain(
    "shadow-sm",
  );
  expect(screen.getByRole("tab", { name: "Alpha" }).className).toContain(
    "bg-white",
  );
});

test("it should lay out vertical tabs beside panels", () => {
  const { container } = render(
    <Tabs defaultValue="a" orientation="vertical">
      <TabList>
        <Tab value="a">Alpha</Tab>
      </TabList>
      <TabPanel value="a">Panel A</TabPanel>
    </Tabs>,
  );

  const root = container.firstElementChild;
  const list = screen.getByRole("tablist");
  const tab = screen.getByRole("tab", { name: "Alpha" });

  expect(list.className).toContain("flex-col");
  expect(root?.className).toContain("flex-row");
  expect(tab.className).not.toContain("after:w-0.5");
});

test("it should move the line indicator to the side when vertical", () => {
  render(
    <Tabs variant="line" defaultValue="a" orientation="vertical">
      <TabList>
        <Tab value="a">Alpha</Tab>
      </TabList>
      <TabPanel value="a">Panel A</TabPanel>
    </Tabs>,
  );

  const list = screen.getByRole("tablist");
  const tab = screen.getByRole("tab", { name: "Alpha" });

  expect(list.className).toContain("border-r");
  expect(tab.className).toContain("after:w-0.5");
});

test("it should weight the selected tab in the plain variant", () => {
  render(
    <Tabs variant="plain" defaultValue="a">
      <TabList>
        <Tab value="a">Alpha</Tab>
        <Tab value="b">Beta</Tab>
      </TabList>
      <TabPanel value="a">Panel A</TabPanel>
    </Tabs>,
  );

  expect(screen.getByRole("tab", { name: "Alpha" }).className).toContain(
    "font-semibold",
  );
  expect(screen.getByRole("tab", { name: "Beta" }).className).not.toContain(
    "font-semibold",
  );
});

test("it should fill and underline the selected tab in the solid variant", () => {
  render(
    <Tabs variant="solid" defaultValue="a">
      <TabList>
        <Tab value="a">Alpha</Tab>
      </TabList>
      <TabPanel value="a">Panel A</TabPanel>
    </Tabs>,
  );

  const tab = screen.getByRole("tab", { name: "Alpha" });

  expect(tab.className).toContain("bg-dark-100");
  expect(tab.className).toContain("after:bg-current");
  expect(tab.className).toContain("after:content-['']");
});

test("it should fill and underline the selected tab in the enclosed variant", () => {
  render(
    <Tabs defaultValue="a" variant="enclosed">
      <TabList>
        <Tab value="a">Alpha</Tab>
      </TabList>
      <TabPanel value="a">Panel A</TabPanel>
    </Tabs>,
  );

  const tab = screen.getByRole("tab", { name: "Alpha" });

  expect(tab.className).toContain("bg-dark-100");
  expect(tab.className).toContain("after:bg-current");
  expect(tab.className).toContain("after:content-['']");
});

test("it should move the solid indicator to the side when vertical", () => {
  render(
    <Tabs variant="solid" defaultValue="a" orientation="vertical">
      <TabList>
        <Tab value="a">Alpha</Tab>
      </TabList>
      <TabPanel value="a">Panel A</TabPanel>
    </Tabs>,
  );

  const list = screen.getByRole("tablist");
  const tab = screen.getByRole("tab", { name: "Alpha" });

  expect(list.className).toContain("border-r");
  expect(tab.className).toContain("after:w-0.5");
});

test("it should move the enclosed indicator to the side when vertical", () => {
  render(
    <Tabs defaultValue="a" variant="enclosed" orientation="vertical">
      <TabList>
        <Tab value="a">Alpha</Tab>
      </TabList>
      <TabPanel value="a">Panel A</TabPanel>
    </Tabs>,
  );

  const list = screen.getByRole("tablist");
  const tab = screen.getByRole("tab", { name: "Alpha" });

  expect(list.className).toContain("divide-y");
  expect(tab.className).toContain("after:w-0.5");
});

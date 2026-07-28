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
  expect(
    screen.getByRole("tab", { name: "Alpha" }).getAttribute("aria-selected"),
  ).toBe("true");
  expect(screen.getByText("Panel A").hasAttribute("hidden")).toBe(false);
  expect(screen.getByText("Panel B").hasAttribute("hidden")).toBe(true);
});

test("it should change selection when a tab is clicked", () => {
  const onChange = vi.fn();

  render(<BasicTabs onChange={onChange} />);

  fireEvent.click(screen.getByRole("tab", { name: "Beta" }));

  expect(onChange).toHaveBeenCalledWith("b");
  expect(
    screen.getByRole("tab", { name: "Beta" }).getAttribute("aria-selected"),
  ).toBe("true");
  expect(screen.getByText("Panel B").hasAttribute("hidden")).toBe(false);
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

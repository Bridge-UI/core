// ** External Imports
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";

// ** Local Imports
import { TabItem } from "@/Components/TabItem";
import { Tabs } from "@/Components/Tabs";

afterEach(() => {
  cleanup();
});

test("it should build tablist and panels from TabItem children", () => {
  render(
    <Tabs defaultValue="bun">
      <TabItem label="bun" value="bun">
        bun install
      </TabItem>
      <TabItem label="npm" value="npm">
        npm install
      </TabItem>
    </Tabs>,
  );

  expect(screen.getByRole("tablist")).toBeTruthy();
  expect(
    screen.getByRole("tab", { name: "bun" }).getAttribute("aria-selected"),
  ).toBe("true");
  expect(screen.getByText("bun install").hasAttribute("hidden")).toBe(false);
  expect(screen.getByText("npm install").hasAttribute("hidden")).toBe(true);
});

test("it should change panel when a TabItem tab is clicked", () => {
  const onChange = vi.fn();

  render(
    <Tabs defaultValue="bun" onChange={onChange}>
      <TabItem label="bun" value="bun">
        bun install
      </TabItem>
      <TabItem label="npm" value="npm">
        npm install
      </TabItem>
    </Tabs>,
  );

  fireEvent.click(screen.getByRole("tab", { name: "npm" }));

  expect(onChange).toHaveBeenCalledWith("npm");
  expect(screen.getByText("npm install").hasAttribute("hidden")).toBe(false);
});

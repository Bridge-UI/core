// ** External Imports
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";

// ** Local Imports
import { ListSection } from "@/Components/ListSection";
import {
  Sidebar,
  SidebarInset,
  SidebarList,
  SidebarListItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/Components/Sidebar";

afterEach(() => {
  cleanup();
});

function AppShell({
  open,
  defaultOpen,
  collapsible,
  onOpenChange,
}: {
  collapsible?: "icon" | "none" | "offcanvas";
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
}) {
  return (
    <SidebarProvider
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
    >
      <Sidebar collapsible={collapsible}>
        <nav>Home</nav>
      </Sidebar>
      <SidebarInset>
        <SidebarTrigger />
        <p>Main</p>
      </SidebarInset>
    </SidebarProvider>
  );
}

test("it should render the sidebar aside and main inset", () => {
  render(<AppShell />);

  expect(screen.getByText("Home")).toBeTruthy();
  expect(screen.getByText("Main")).toBeTruthy();
  expect(screen.getByRole("complementary", { name: "Sidebar" })).toBeTruthy();
});

test("it should default to expanded desktop state", () => {
  const { container } = render(<AppShell />);

  expect(container.querySelector('[data-state="expanded"]')).not.toBeNull();
});

test("it should toggle desktop open when the trigger is clicked", () => {
  const { container } = render(<AppShell />);

  fireEvent.click(screen.getByRole("button", { name: "Toggle sidebar" }));

  expect(container.querySelector('[data-state="collapsed"]')).not.toBeNull();
});

test("it should call onOpenChange when the trigger is clicked", () => {
  const onOpenChange = (open: boolean) => {
    calls.push(open);
  };
  const calls: boolean[] = [];

  render(<AppShell onOpenChange={onOpenChange} />);

  fireEvent.click(screen.getByRole("button", { name: "Toggle sidebar" }));

  expect(calls).toEqual([false]);
});

test("it should keep expanded state when collapsible is none", () => {
  const { container } = render(<AppShell collapsible="none" />);

  fireEvent.click(screen.getByRole("button", { name: "Toggle sidebar" }));

  expect(container.querySelector('[data-state="expanded"]')).not.toBeNull();
  expect(container.querySelector('[data-state="collapsed"]')).toBeNull();
});

test("it should render header and footer slots", () => {
  render(
    <SidebarProvider>
      <Sidebar
        slots={{
          footer: <div>User</div>,
          header: <div>Brand</div>,
        }}
      >
        Nav
      </Sidebar>
      <SidebarInset>
        <SidebarTrigger />
      </SidebarInset>
    </SidebarProvider>,
  );

  expect(screen.getByText("Brand")).toBeTruthy();
  expect(screen.getByText("User")).toBeTruthy();
});

test("it should mark the trigger as expanded by default", () => {
  render(<AppShell />);

  expect(
    screen
      .getByRole("button", { name: "Toggle sidebar" })
      .getAttribute("aria-expanded"),
  ).toBe("true");
});

test("it should dock the left aside and slide it off-canvas by offsetting left", () => {
  const { container } = render(<AppShell />);
  const aside = container.querySelector("aside");

  expect(aside?.className).toContain("left-0");
  expect(aside?.className).toContain("overflow-hidden");
  expect(aside?.className).toContain(
    "left-[calc(var(--bridge-sidebar-width)*-1)]",
  );
});

test("it should apply data-side from the side prop", () => {
  const { container } = render(
    <SidebarProvider>
      <Sidebar side="right">Nav</Sidebar>
      <SidebarInset>
        <SidebarTrigger />
      </SidebarInset>
    </SidebarProvider>,
  );

  expect(container.querySelector('[data-side="right"]')).not.toBeNull();
});

test("it should inert the aside when offcanvas is collapsed", () => {
  const { container } = render(<AppShell />);

  fireEvent.click(screen.getByRole("button", { name: "Toggle sidebar" }));

  expect(container.querySelector("aside")?.hasAttribute("inert")).toBe(true);
});

test("it should not inert the aside when icon mode is collapsed", () => {
  const { container } = render(<AppShell collapsible="icon" />);

  fireEvent.click(screen.getByRole("button", { name: "Toggle sidebar" }));

  expect(container.querySelector("aside")?.hasAttribute("inert")).toBe(false);
});

test("it should collapse SidebarList items when the icon rail is collapsed", () => {
  render(
    <SidebarProvider defaultOpen={false}>
      <Sidebar collapsible="icon">
        <SidebarList>
          <SidebarListItem interactive primary="Home" />
        </SidebarList>
      </Sidebar>
      <SidebarInset>
        <SidebarTrigger />
      </SidebarInset>
    </SidebarProvider>,
  );

  expect(
    screen.getByRole("button", { name: "Home" }).getAttribute("aria-label"),
  ).toBe("Home");
});

test("it should apply nav chrome on SidebarList and SidebarListItem", () => {
  const { container } = render(
    <SidebarProvider>
      <Sidebar>
        <SidebarList>
          <SidebarListItem interactive primary="Home" />
        </SidebarList>
      </Sidebar>
      <SidebarInset>
        <SidebarTrigger />
      </SidebarInset>
    </SidebarProvider>,
  );

  const item = screen.getByRole("button", { name: "Home" });

  expect(container.querySelector("ul")?.className).toContain("gap-1");
  expect(item.className).toContain("min-h-8");
  expect(item.className).toContain("rounded-lg");
});

test("it should hide nested SidebarList when the icon rail is collapsed", () => {
  const { container } = render(
    <SidebarProvider defaultOpen={false}>
      <Sidebar collapsible="icon">
        <SidebarList>
          <SidebarListItem interactive primary="Home" />
          <SidebarList nested>
            <SidebarListItem interactive primary="Nested" />
          </SidebarList>
        </SidebarList>
      </Sidebar>
      <SidebarInset>
        <SidebarTrigger />
      </SidebarInset>
    </SidebarProvider>,
  );

  expect(container.querySelectorAll("ul")[1]?.hasAttribute("hidden")).toBe(
    true,
  );
});

test("it should hide ListSection when the icon rail is collapsed", () => {
  render(
    <SidebarProvider defaultOpen={false}>
      <Sidebar collapsible="icon">
        <SidebarList>
          <ListSection title="Application" />
          <SidebarListItem interactive primary="Home" />
        </SidebarList>
      </Sidebar>
      <SidebarInset>
        <SidebarTrigger />
      </SidebarInset>
    </SidebarProvider>,
  );

  expect(screen.queryByText("Application")).toBeNull();
});

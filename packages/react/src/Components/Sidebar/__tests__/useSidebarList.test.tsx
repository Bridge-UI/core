// ** External Imports
import { renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { expect, test } from "vitest";

// ** Local Imports
import { Sidebar, SidebarProvider, useSidebarList } from "@/Components/Sidebar";

function collapsedIconWrapper({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider defaultOpen={false}>
      <Sidebar collapsible="icon">{children}</Sidebar>
    </SidebarProvider>
  );
}

function expandedIconWrapper({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">{children}</Sidebar>
    </SidebarProvider>
  );
}

test("it should set iconOnly when the icon rail is collapsed", () => {
  const { result } = renderHook(() => useSidebarList({}), {
    wrapper: collapsedIconWrapper,
  });

  expect(result.current.iconOnly).toBe(true);
});

test("it should not set iconOnly when the icon rail is expanded", () => {
  const { result } = renderHook(() => useSidebarList({}), {
    wrapper: expandedIconWrapper,
  });

  expect(result.current.iconOnly).toBe(false);
});

test("it should allow iconOnly to be overridden", () => {
  const { result } = renderHook(() => useSidebarList({ iconOnly: false }), {
    wrapper: collapsedIconWrapper,
  });

  expect(result.current.iconOnly).toBe(false);
});

test("it should apply stacked nav chrome on the list root", () => {
  const { result } = renderHook(() => useSidebarList({}), {
    wrapper: expandedIconWrapper,
  });

  expect(result.current.rootClassName).toContain("p-0");
  expect(result.current.rootClassName).toContain("px-2");
  expect(result.current.rootClassName).toContain("gap-1");
});

test("it should apply a nested start-edge guide line", () => {
  const { result } = renderHook(() => useSidebarList({ nested: true }), {
    wrapper: expandedIconWrapper,
  });

  expect(result.current.rootClassName).toContain("ml-3.5");
  expect(result.current.rootClassName).toContain("border-l");
  expect(result.current.rootClassName).not.toContain("w-full");
});

test("it should hide nested lists when the icon rail is collapsed", () => {
  const { result } = renderHook(() => useSidebarList({ nested: true }), {
    wrapper: collapsedIconWrapper,
  });

  expect(result.current.rootClassName).toContain("hidden");
});

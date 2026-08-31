// ** External Imports
import { cleanup, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { act } from "react";
import { afterEach, expect, test } from "vitest";

// ** Local Imports
import { Sidebar, SidebarProvider, useSidebar } from "@/Components/Sidebar";

afterEach(() => {
  cleanup();
});

function wrapper({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <Sidebar>{children}</Sidebar>
    </SidebarProvider>
  );
}

test("it should throw when used outside SidebarProvider", () => {
  expect(() => {
    renderHook(() => useSidebar());
  }).toThrow("useSidebar must be used within a SidebarProvider");
});

test("it should default to open expanded state", () => {
  const { result } = renderHook(() => useSidebar(), { wrapper });

  expect(result.current.open).toBe(true);
  expect(result.current.state).toBe("expanded");
  expect(result.current.openMobile).toBe(false);
});

test("it should toggle desktop open", () => {
  const { result } = renderHook(() => useSidebar(), { wrapper });

  act(() => {
    result.current.toggleSidebar();
  });

  expect(result.current.open).toBe(false);
  expect(result.current.state).toBe("collapsed");
});

test("it should expose side and collapsible from Sidebar", () => {
  function iconWrapper({ children }: { children: ReactNode }) {
    return (
      <SidebarProvider>
        <Sidebar side="right" collapsible="icon">
          {children}
        </Sidebar>
      </SidebarProvider>
    );
  }

  const { result } = renderHook(() => useSidebar(), { wrapper: iconWrapper });

  expect(result.current.side).toBe("right");
  expect(result.current.collapsible).toBe("icon");
});

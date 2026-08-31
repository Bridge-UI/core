// ** External Imports
import { renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { expect, test } from "vitest";

// ** Local Imports
import {
  Sidebar,
  SidebarProvider,
  useSidebarListItem,
} from "@/Components/Sidebar";

function collapsedIconWrapper({
  side,
  children,
}: {
  children: ReactNode;
  side?: "left" | "right";
}) {
  return (
    <SidebarProvider defaultOpen={false}>
      <Sidebar side={side} collapsible="icon">
        {children}
      </Sidebar>
    </SidebarProvider>
  );
}

test("it should use primary as tooltip when the icon rail is collapsed", () => {
  const { result } = renderHook(() => useSidebarListItem({ primary: "Home" }), {
    wrapper: ({ children }: { children: ReactNode }) => {
      return collapsedIconWrapper({ children });
    },
  });

  expect(result.current.tooltip).toBe("Home");
  expect(result.current.tooltipPlacement).toBe("right");
});

test("it should place the tooltip opposite a right rail", () => {
  const { result } = renderHook(() => useSidebarListItem({ primary: "Home" }), {
    wrapper: ({ children }: { children: ReactNode }) => {
      return collapsedIconWrapper({ children, side: "right" });
    },
  });

  expect(result.current.tooltipPlacement).toBe("left");
});

test("it should omit the tooltip when the rail is expanded", () => {
  const { result } = renderHook(() => useSidebarListItem({ primary: "Home" }), {
    wrapper: ({ children }: { children: ReactNode }) => {
      return (
        <SidebarProvider>
          <Sidebar collapsible="icon">{children}</Sidebar>
        </SidebarProvider>
      );
    },
  });

  expect(result.current.tooltip).toBeUndefined();
});

test("it should apply compact nav chrome when the rail is expanded", () => {
  const { result } = renderHook(() => useSidebarListItem({ primary: "Home" }), {
    wrapper: ({ children }: { children: ReactNode }) => {
      return (
        <SidebarProvider>
          <Sidebar collapsible="icon">{children}</Sidebar>
        </SidebarProvider>
      );
    },
  });

  expect(result.current.itemClasses.interactive).toContain("min-h-8");
  expect(result.current.itemClasses.interactive).toContain("rounded-lg");
});

test("it should apply a taller hit when secondary is set", () => {
  const { result } = renderHook(
    () => useSidebarListItem({ primary: "Acme Inc", secondary: "Enterprise" }),
    {
      wrapper: ({ children }: { children: ReactNode }) => {
        return (
          <SidebarProvider>
            <Sidebar collapsible="icon">{children}</Sidebar>
          </SidebarProvider>
        );
      },
    },
  );

  expect(result.current.itemClasses.interactive).toContain("py-2");
  expect(result.current.itemClasses.interactive).toContain("min-h-12");
});

test("it should apply a compact hit when the icon rail is collapsed", () => {
  const { result } = renderHook(() => useSidebarListItem({ primary: "Home" }), {
    wrapper: ({ children }: { children: ReactNode }) => {
      return collapsedIconWrapper({ children });
    },
  });

  expect(result.current.itemClasses.interactive).toContain("h-8");
  expect(result.current.itemClasses.content).toContain("hidden");
});

test("it should square the hit when secondary is set on the icon rail", () => {
  const { result } = renderHook(
    () => useSidebarListItem({ primary: "Acme Inc", secondary: "Enterprise" }),
    {
      wrapper: ({ children }: { children: ReactNode }) => {
        return collapsedIconWrapper({ children });
      },
    },
  );

  expect(result.current.itemClasses.interactive).toContain("size-8");
  expect(result.current.itemClasses.interactive).toContain("p-0");
  expect(result.current.itemClasses.content).toContain("hidden");
  expect(result.current.itemClasses.end).toContain("hidden");
});

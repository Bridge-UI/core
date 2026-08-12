// ** External Imports
import { cleanup, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, expect, test } from "vitest";

// ** Local Imports
import { BreadcrumbContext } from "@/Components/Breadcrumb/BreadcrumbContext";
import { useBreadcrumbItem } from "@/Components/BreadcrumbItem/hooks/useBreadcrumbItem";

afterEach(() => {
  cleanup();
});

function wrapper({ children }: { children: ReactNode }) {
  return (
    <BreadcrumbContext.Provider
      value={{
        separator: "chevronRight",
        tokenClasses: {
          item: "flex",
          link: "link",
          iconSize: "md",
          separator: "sep",
          current: "current",
        },
      }}
    >
      {children}
    </BreadcrumbContext.Provider>
  );
}

test("it should resolve crumb as anchor when href is set", () => {
  const { result } = renderHook(
    () => useBreadcrumbItem({ href: "/docs", children: "Docs" }),
    { wrapper },
  );

  expect(result.current.crumbAs).toBe("a");
  expect(result.current.linkBind.href).toBe("/docs");
});

test("it should resolve crumb as span when current", () => {
  const { result } = renderHook(
    () => useBreadcrumbItem({ current: true, children: "Page" }),
    { wrapper },
  );

  expect(result.current.crumbAs).toBe("span");
  expect(result.current.linkBind["aria-current"]).toBe("page");
});

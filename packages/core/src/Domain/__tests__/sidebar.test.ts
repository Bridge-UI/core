// ** External Imports
import { describe, expect, test } from "vitest";

// ** Local Imports
import {
  getSidebarPanelId,
  isSidebarIconOnly,
  resolveSidebarCollapsibleData,
  resolveSidebarListTooltipPlacement,
  resolveSidebarState,
  shouldRenderSidebarAsDrawer,
  shouldToggleDesktopSidebar,
  SIDEBAR_DESKTOP_BREAKPOINT,
  toggleSidebarOpen,
} from "@/Domain/sidebar";

describe("resolveSidebarState", () => {
  test("it should return expanded when collapsible is none", () => {
    expect(resolveSidebarState(false, "none")).toBe("expanded");
    expect(resolveSidebarState(true, "none")).toBe("expanded");
  });

  test("it should follow open for icon and offcanvas", () => {
    expect(resolveSidebarState(true, "icon")).toBe("expanded");
    expect(resolveSidebarState(false, "icon")).toBe("collapsed");
    expect(resolveSidebarState(false, "offcanvas")).toBe("collapsed");
  });
});

describe("shouldRenderSidebarAsDrawer", () => {
  test("it should be true only on mobile", () => {
    expect(shouldRenderSidebarAsDrawer(true)).toBe(true);
    expect(shouldRenderSidebarAsDrawer(false)).toBe(false);
  });
});

describe("toggleSidebarOpen", () => {
  test("it should invert the flag", () => {
    expect(toggleSidebarOpen(true)).toBe(false);
    expect(toggleSidebarOpen(false)).toBe(true);
  });
});

describe("resolveSidebarCollapsibleData", () => {
  test("it should be empty when expanded or none", () => {
    expect(resolveSidebarCollapsibleData("expanded", "icon")).toBe("");
    expect(resolveSidebarCollapsibleData("collapsed", "none")).toBe("");
  });

  test("it should echo the mode when collapsed", () => {
    expect(resolveSidebarCollapsibleData("collapsed", "icon")).toBe("icon");
    expect(resolveSidebarCollapsibleData("collapsed", "offcanvas")).toBe(
      "offcanvas",
    );
  });
});

describe("getSidebarPanelId", () => {
  test("it should build a stable panel id", () => {
    expect(getSidebarPanelId("sidebar-1")).toBe("sidebar-1-panel");
  });
});

describe("shouldToggleDesktopSidebar", () => {
  test("it should be false when collapsible is none", () => {
    expect(shouldToggleDesktopSidebar("none")).toBe(false);
    expect(shouldToggleDesktopSidebar("icon")).toBe(true);
    expect(shouldToggleDesktopSidebar("offcanvas")).toBe(true);
  });
});

describe("SIDEBAR_DESKTOP_BREAKPOINT", () => {
  test("it should match the md shell breakpoint", () => {
    expect(SIDEBAR_DESKTOP_BREAKPOINT).toBe("md");
  });
});

describe("isSidebarIconOnly", () => {
  test("it should be true only on a collapsed desktop icon rail", () => {
    expect(isSidebarIconOnly(false, "icon", "collapsed")).toBe(true);
    expect(isSidebarIconOnly(true, "icon", "collapsed")).toBe(false);
    expect(isSidebarIconOnly(false, "icon", "expanded")).toBe(false);
    expect(isSidebarIconOnly(false, "offcanvas", "collapsed")).toBe(false);
  });
});

describe("resolveSidebarListTooltipPlacement", () => {
  test("it should sit opposite the dock edge", () => {
    expect(resolveSidebarListTooltipPlacement("left")).toBe("right");
    expect(resolveSidebarListTooltipPlacement("right")).toBe("left");
  });
});

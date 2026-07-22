// ** External Imports
import { renderHook } from "@testing-library/react";
import { expect, test } from "vitest";

// ** Local Imports
import {
  useSkeleton,
  type SkeletonOwnProps,
  type SkeletonProps,
} from "@/Components/Skeleton";

const libDefaults = {
  rounded: "md",
} as const satisfies Partial<SkeletonOwnProps>;

function renderUseSkeleton(props: SkeletonProps = {}) {
  return renderHook(() =>
    useSkeleton(props, libDefaults as Parameters<typeof useSkeleton>[1]),
  );
}

test("it should merge default rounded", () => {
  const { result } = renderUseSkeleton();

  expect(result.current.merged.rounded).toBe("md");
});

test("it should override rounded when prop is passed", () => {
  const { result } = renderUseSkeleton({ rounded: "full" });

  expect(result.current.merged.rounded).toBe("full");
});

test("it should compute rootBind className as a non-empty string", () => {
  const { result } = renderUseSkeleton();

  expect(typeof result.current.rootBind.className).toBe("string");
  expect(result.current.rootBind.className.length).toBeGreaterThan(0);
});

test("it should merge className into rootBind", () => {
  const { result } = renderUseSkeleton({ className: "h-4 w-32" });

  expect(result.current.rootBind.className).toContain("h-4");
  expect(result.current.rootBind.className).toContain("w-32");
});

test("it should expose inherited attrs on rootBind", () => {
  const { result } = renderUseSkeleton({
    id: "skeleton-root",
    "data-testid": "skeleton",
  });

  expect(result.current.rootBind.id).toBe("skeleton-root");
  expect(result.current.rootBind["data-testid"]).toBe("skeleton");
});

test("it should apply className after classes.root in rootBind", () => {
  const { result } = renderUseSkeleton({
    className: "h-8",
    classes: { root: "h-4" },
  });

  expect(result.current.rootBind.className).toContain("h-8");
  expect(result.current.rootBind.className).not.toContain("h-4");
});

test("it should apply rounded-full class when rounded is full", () => {
  const { result } = renderUseSkeleton({ rounded: "full" });

  expect(result.current.rootBind.className).toContain("rounded-full");
});

test("it should apply pulse animation classes", () => {
  const { result } = renderUseSkeleton();

  expect(result.current.rootBind.className).toContain("animate-pulse");
});

// ** External Imports
import { expect, test } from "vitest";

// ** Local Imports
import type { BridgeUIComponentsConfig } from "@core/Config/types";
import {
  cn,
  createMergePartBind,
  mergeBridgeUILayeredClasses,
  mergePropsWithBridgeUIDefaults,
} from "@core/Utils";

test("it should merge simple class strings", () => {
  expect(cn("foo", "bar")).toBe("foo bar");
});

test("it should handle conditional classes via clsx", () => {
  const condition = false;

  expect(cn("base", condition && "hidden", "visible")).toBe("base visible");
});

test("it should deduplicate tailwind classes via twMerge", () => {
  expect(cn("p-4", "p-8")).toBe("p-8");
});

test("it should handle arrays", () => {
  expect(cn(["foo", "bar"], "baz")).toBe("foo bar baz");
});

test("it should handle objects", () => {
  expect(cn({ hidden: true, visible: false })).toBe("hidden");
});

test("it should handle undefined and null", () => {
  expect(cn("a", undefined, null, "b")).toBe("a b");
});

test("it should return empty string for no inputs", () => {
  expect(cn()).toBe("");
});

test("it should return empty object when no layers provided", () => {
  expect(mergeBridgeUILayeredClasses()).toEqual({});
});

test("it should return the single layer when only one is provided", () => {
  expect(mergeBridgeUILayeredClasses({ root: "bg-red-500" })).toEqual({
    root: "bg-red-500",
  });
});

test("it should merge multiple layers with later overriding earlier", () => {
  const result = mergeBridgeUILayeredClasses(
    { icon: "text-sm", root: "bg-red-500" },
    { root: "bg-blue-500" },
  );

  expect(result).toEqual({ icon: "text-sm", root: "bg-blue-500" });
});

test("it should skip undefined layers", () => {
  const result = mergeBridgeUILayeredClasses(
    { root: "bg-red-500" },
    undefined,
    { icon: "text-sm" },
  );

  expect(result).toEqual({ icon: "text-sm", root: "bg-red-500" });
});

test("it should skip null layers", () => {
  const result = mergeBridgeUILayeredClasses(
    { root: "a" },
    null as unknown as undefined,
    { root: "b" },
  );

  expect(result).toEqual({ root: "b" });
});

test("it should merge three layers progressively", () => {
  const result = mergeBridgeUILayeredClasses(
    { a: "1", b: "2" },
    { b: "3", c: "4" },
    { c: "5", d: "6" },
  );

  expect(result).toEqual({ a: "1", b: "3", c: "5", d: "6" });
});

test("it should return props as-is when no defaults or registry", () => {
  const props = { shadow: "sm" as const, color: "info" as const };

  const result = mergePropsWithBridgeUIDefaults({
    props,
    components: null,
    componentName: "Alert",
  });

  expect(result).toEqual(props);
});

test("it should apply libDefaults when props are missing keys", () => {
  const result = mergePropsWithBridgeUIDefaults({
    components: null,
    componentName: "Alert",
    props: { color: "error" as const },
    libDefaults: { shadow: "md" as never },
  });

  expect(result).toEqual({ shadow: "md", color: "error" });
});

test("it should let registry defaultProps override libDefaults", () => {
  const components: BridgeUIComponentsConfig = {
    Alert: { defaultProps: { color: "success" } },
  };

  const result = mergePropsWithBridgeUIDefaults({
    props: {},
    components,
    componentName: "Alert",
    libDefaults: { color: "info" as never },
  });

  expect(result).toEqual({ color: "success" });
});

test("it should let instance props override everything", () => {
  const components: BridgeUIComponentsConfig = {
    Alert: { defaultProps: { color: "success" } },
  };

  const result = mergePropsWithBridgeUIDefaults({
    components,
    componentName: "Alert",
    props: { color: "error" as const },
    libDefaults: { color: "info" as never },
  });

  expect(result).toEqual({ color: "error" });
});

test("it should handle undefined components gracefully", () => {
  const result = mergePropsWithBridgeUIDefaults({
    components: undefined,
    componentName: "Icon",
    props: { size: "md" as const },
  });

  expect(result).toEqual({ size: "md" });
});

test("mergePartBind should merge bridge, inherited, and part", () => {
  const mergePartBind = createMergePartBind("class");

  expect(
    mergePartBind(undefined, { "data-test": "x" }, { class: "bridge" }),
  ).toEqual({
    class: "bridge",
    "data-test": "x",
  });

  expect(
    mergePartBind(
      { id: "user", class: "part" },
      { class: "inherited" },
      { id: "pkg", class: "bridge" },
    ),
  ).toEqual({
    id: "user",
    class: "bridge inherited part",
  });
});

test("mergePartBind should use className for React", () => {
  const mergePartBind = createMergePartBind("className");

  expect(
    mergePartBind(
      { className: "part" },
      { role: "alert", className: "inherited" },
      "bridge",
    ),
  ).toEqual({
    role: "alert",
    className: "bridge inherited part",
  });
});

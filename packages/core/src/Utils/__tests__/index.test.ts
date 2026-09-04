// ** External Imports
import { expect, test } from "vitest";

// ** Local Imports
import type { BridgeUIComponentsConfig } from "@/Config/types";
import {
  cn,
  createMergeNestedComponentProps,
  createMergePartBind,
  getBridgeUIChromeComponentName,
  getBridgeUIRegistryDefaultProp,
  getColorToken,
  mergeBridgeUILayeredClasses,
  mergePropsWithBridgeUIDefaults,
} from "@/Utils";

test("it should read the error palette when invalid", () => {
  const tokens = { error: { base: "e" }, primary: { base: "p" } };

  expect(getColorToken({ tokens, invalid: true, color: "primary" })).toEqual({
    base: "e",
  });
});

test("it should read the requested color when valid", () => {
  const tokens = { primary: { base: "p" }, secondary: { base: "s" } };

  expect(getColorToken({ tokens, color: "secondary" })).toEqual({ base: "s" });
});

test("it should fall back to primary when color is omitted", () => {
  const tokens = { primary: { base: "p" } };

  expect(getColorToken({ tokens })).toEqual({ base: "p" });
});

test("it should use a custom fallback color", () => {
  const tokens = { secondary: { base: "s" } };

  expect(getColorToken({ tokens, fallback: "secondary" })).toEqual({
    base: "s",
  });
});

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

test("it should apply formDefaults between libDefaults and registry for form components", () => {
  const result = mergePropsWithBridgeUIDefaults({
    props: {},
    components: null,
    componentName: "TextField",
    formDefaults: { size: "lg", rounded: "xl" },
    libDefaults: { size: "sm" as never, rounded: "sm" as never },
  });

  expect(result).toEqual({ size: "lg", rounded: "xl" });
});

test("it should let registry defaultProps override formDefaults", () => {
  const components: BridgeUIComponentsConfig = {
    TextField: { defaultProps: { size: "2xl" } },
  };

  const result = mergePropsWithBridgeUIDefaults({
    props: {},
    components,
    componentName: "TextField",
    formDefaults: { size: "lg" },
    libDefaults: { size: "sm" as never },
  });

  expect(result).toEqual({ size: "2xl" });
});

test("it should ignore formDefaults for non-form components", () => {
  const result = mergePropsWithBridgeUIDefaults({
    props: {},
    components: null,
    componentName: "Progress",
    formDefaults: { size: "lg", rounded: "xl" },
    libDefaults: { size: "md" as never, rounded: "full" as never },
  });

  expect(result).toEqual({ size: "md", rounded: "full" });
});

test("it should apply formDefaults size but not rounded for Radio and Switch", () => {
  const radio = mergePropsWithBridgeUIDefaults({
    props: {},
    components: null,
    componentName: "Radio",
    formDefaults: { size: "lg", rounded: "md" },
    libDefaults: { size: "md" as never, rounded: "full" as never },
  });

  expect(radio).toEqual({ size: "lg", rounded: "full" });

  const sw = mergePropsWithBridgeUIDefaults({
    props: {},
    components: null,
    componentName: "Switch",
    formDefaults: { size: "2xs", rounded: "xl" },
    libDefaults: { size: "md" as never, rounded: "full" as never },
  });

  expect(sw).toEqual({ size: "2xs", rounded: "full" });
});

test("it should apply formDefaults size 2xs to OtpField", () => {
  const result = mergePropsWithBridgeUIDefaults({
    props: {},
    components: null,
    componentName: "OtpField",
    formDefaults: { size: "2xs", rounded: "lg" },
    libDefaults: { size: "md" as never, rounded: "md" as never },
  });

  expect(result).toEqual({ size: "2xs", rounded: "lg" });
});

test("it should apply FormField chrome defaultProps to TextField", () => {
  const components: BridgeUIComponentsConfig = {
    FormField: { defaultProps: { variant: "filled", color: "secondary" } },
  };

  const result = mergePropsWithBridgeUIDefaults({
    props: {},
    components,
    componentName: "TextField",
    libDefaults: { color: "primary" as never, variant: "outline" as never },
  });

  expect(result).toEqual({ variant: "filled", color: "secondary" });
});

test("it should let TextField defaultProps override FormField chrome", () => {
  const components: BridgeUIComponentsConfig = {
    FormField: { defaultProps: { variant: "filled" } },
    TextField: { defaultProps: { variant: "outline" } },
  };

  const result = mergePropsWithBridgeUIDefaults({
    props: {},
    components,
    componentName: "TextField",
    libDefaults: { variant: "underline" as never },
  });

  expect(result).toEqual({ variant: "outline" });
});

test("it should let instance props override FormField chrome", () => {
  const components: BridgeUIComponentsConfig = {
    FormField: { defaultProps: { variant: "filled" } },
  };

  const result = mergePropsWithBridgeUIDefaults({
    components,
    componentName: "TextField",
    props: { variant: "stacked" as const },
    libDefaults: { variant: "outline" as never },
  });

  expect(result).toEqual({ variant: "stacked" });
});

test("it should let FormField chrome override formDefaults", () => {
  const components: BridgeUIComponentsConfig = {
    FormField: { defaultProps: { size: "sm" } },
  };

  const result = mergePropsWithBridgeUIDefaults({
    props: {},
    components,
    componentName: "TextField",
    formDefaults: { size: "lg" },
    libDefaults: { size: "md" as never },
  });

  expect(result).toEqual({ size: "sm" });
});

test("it should apply FormField chrome when componentName is FormField", () => {
  const components: BridgeUIComponentsConfig = {
    FormField: { defaultProps: { variant: "filled" } },
  };

  const result = mergePropsWithBridgeUIDefaults({
    props: {},
    components,
    componentName: "FormField",
    libDefaults: { variant: "outline" as never },
  });

  expect(result).toEqual({ variant: "filled" });
});

test("it should apply FormControl chrome defaultProps to Checkbox", () => {
  const components: BridgeUIComponentsConfig = {
    FormControl: { defaultProps: { hideErrorMessage: true } },
  };

  const result = mergePropsWithBridgeUIDefaults({
    props: {},
    components,
    componentName: "Checkbox",
    libDefaults: { hideErrorMessage: false as never },
  });

  expect(result).toEqual({ hideErrorMessage: true });
});

test("it should apply BaseField chrome defaultProps to Slider", () => {
  const components: BridgeUIComponentsConfig = {
    BaseField: { defaultProps: { hideErrorMessage: true } },
  };

  const result = mergePropsWithBridgeUIDefaults({
    props: {},
    components,
    componentName: "Slider",
    libDefaults: { hideErrorMessage: false as never },
  });

  expect(result).toEqual({ hideErrorMessage: true });
});

test("it should apply TimePanel chrome defaultProps to TimePicker", () => {
  const components: BridgeUIComponentsConfig = {
    TimePanel: { defaultProps: { interval: 15, color: "secondary" } },
  };

  const result = mergePropsWithBridgeUIDefaults({
    props: {},
    components,
    componentName: "TimePicker",
    libDefaults: { interval: 1 as never, color: "primary" as never },
  });

  expect(result).toEqual({ interval: 15, color: "secondary" });
});

test("it should not apply FormField chrome to Button", () => {
  const components: BridgeUIComponentsConfig = {
    FormField: { defaultProps: { variant: "filled" } },
  };

  const result = mergePropsWithBridgeUIDefaults({
    props: {},
    components,
    componentName: "Button",
    libDefaults: { variant: "solid" as never },
  });

  expect(result).toEqual({ variant: "solid" });
});

test("it should apply formDefaults size but not rounded for BaseField and FormControl", () => {
  const baseField = mergePropsWithBridgeUIDefaults({
    props: {},
    components: null,
    componentName: "BaseField",
    libDefaults: { size: "md" as never },
    formDefaults: { size: "lg", rounded: "xl" },
  });

  expect(baseField).toEqual({ size: "lg" });

  const formControl = mergePropsWithBridgeUIDefaults({
    props: {},
    components: null,
    componentName: "FormControl",
    libDefaults: { size: "md" as never },
    formDefaults: { size: "sm", rounded: "md" },
  });

  expect(formControl).toEqual({ size: "sm" });
});

test("it should resolve chrome names for public field components", () => {
  expect(getBridgeUIChromeComponentName("TextField")).toBe("FormField");
  expect(getBridgeUIChromeComponentName("Checkbox")).toBe("FormControl");
  expect(getBridgeUIChromeComponentName("Slider")).toBe("BaseField");
  expect(getBridgeUIChromeComponentName("TimePicker")).toBe("TimePanel");
  expect(getBridgeUIChromeComponentName("FormField")).toBeUndefined();
  expect(getBridgeUIChromeComponentName("Button")).toBeUndefined();
});

test("it should read chrome defaultProps when the public entry omits the key", () => {
  const components: BridgeUIComponentsConfig = {
    FormField: { defaultProps: { variant: "filled" } },
  };

  expect(
    getBridgeUIRegistryDefaultProp<string>({
      components,
      prop: "variant",
      componentName: "DateField",
    }),
  ).toBe("filled");
});

test("it should prefer public defaultProps over chrome in getBridgeUIRegistryDefaultProp", () => {
  const components: BridgeUIComponentsConfig = {
    TimePanel: { defaultProps: { fill: true } },
    TimePicker: { defaultProps: { fill: false } },
  };

  expect(
    getBridgeUIRegistryDefaultProp<boolean>({
      components,
      prop: "fill",
      componentName: "TimePicker",
    }),
  ).toBe(false);
});

test("it should handle undefined components gracefully", () => {
  const result = mergePropsWithBridgeUIDefaults({
    components: undefined,
    componentName: "Icon",
    props: { size: "md" as const },
  });

  expect(result).toEqual({ size: "md" });
});

test("it should merge bridge, inherited, and part", () => {
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

test("it should use className for React", () => {
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

test("it should merge nested component classes and customProps", () => {
  const mergeNestedComponentProps = createMergeNestedComponentProps(
    createMergePartBind("className"),
  );

  const result = mergeNestedComponentProps(
    {
      size: "sm",
      classes: { root: "user-root", label: "user-label" },
      customProps: {
        label: { id: "user-label" },
        clear: { id: "user-clear", className: "user-clear" },
      },
    },
    {
      classes: { root: "pkg-root" },
      customProps: {
        clear: { role: "button", className: "pkg-clear" },
      },
    },
  );

  expect(result).toEqual({
    size: "sm",
    classes: {
      label: "user-label",
      root: "pkg-root user-root",
    },
    customProps: {
      label: { id: "user-label" },
      clear: {
        role: "button",
        id: "user-clear",
        className: "pkg-clear user-clear",
      },
    },
  });
});

test("it should keep user props when nested defaults are empty", () => {
  const mergeNestedComponentProps = createMergeNestedComponentProps(
    createMergePartBind("class"),
  );

  expect(
    mergeNestedComponentProps({ classes: { root: "only-user" } }, {}),
  ).toEqual({
    classes: { root: "only-user" },
  });
});

test("it should merge top-level className defaults", () => {
  const mergeNestedComponentProps = createMergeNestedComponentProps(
    createMergePartBind("className"),
  );

  expect(
    mergeNestedComponentProps(
      { id: "chip", className: "user" },
      { className: "pkg" },
    ),
  ).toEqual({
    id: "chip",
    className: "pkg user",
  });
});

// ** External Imports
import { renderHook } from "@testing-library/react";
import { createElement } from "react";
import { expect, test } from "vitest";

// ** Local Imports
import { BridgeUIProvider } from "@/Provider";
import {
  derived,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
  useFieldShowFooter,
  usePickerFill,
} from "@/Utils";

test("it should keep merged identity when props are shallow-equal", () => {
  const { result, rerender } = renderHook(
    (props: { size?: string }) => {
      return useBridgeUIComponent({
        props,
        componentName: "Button",
        libDefaults: { size: "md" },
      });
    },
    { initialProps: { size: "md" } },
  );

  const first = result.current.merged;

  rerender({ size: "md" });

  expect(result.current.merged).toBe(first);
});

test("it should remake merged when a prop value changes", () => {
  const { result, rerender } = renderHook(
    (props: { size?: string }) => {
      return useBridgeUIComponent({
        props,
        componentName: "Button",
        libDefaults: { size: "md" },
      });
    },
    { initialProps: { size: "md" } },
  );

  const first = result.current.merged;

  rerender({ size: "lg" });

  expect(result.current.merged).not.toBe(first);
  expect(result.current.merged).toMatchObject({ size: "lg" });
});

test("it should run the getter and return its value from derived", () => {
  let runs = 0;

  const value = derived(() => {
    runs += 1;

    return "ok";
  });

  expect(runs).toBe(1);
  expect(value).toBe("ok");
});

test("it should recalculate when called again from derived", () => {
  let count = 0;

  const first = derived(() => {
    count += 1;

    return count;
  });

  const second = derived(() => {
    count += 1;

    return count;
  });

  expect(first).toBe(1);
  expect(second).toBe(2);
});

test("it should return empty object when entry and props have no classes", () => {
  const { result } = renderHook(() =>
    useBridgeUIMergedRegistryClasses({ props: {}, entry: undefined }),
  );

  expect(result.current).toEqual({});
});

test("it should return entry classes when props has none", () => {
  const { result } = renderHook(() =>
    useBridgeUIMergedRegistryClasses({
      props: {},
      entry: { classes: { icon: "text-sm", root: "bg-red-500" } },
    }),
  );

  expect(result.current).toEqual({
    icon: "text-sm",
    root: "bg-red-500",
  });
});

test("it should return props classes when entry has none", () => {
  const { result } = renderHook(() =>
    useBridgeUIMergedRegistryClasses({
      entry: undefined,
      props: { classes: { root: "bg-blue-500" } },
    }),
  );

  expect(result.current).toEqual({ root: "bg-blue-500" });
});

test("it should merge entry and props classes with props winning", () => {
  const { result } = renderHook(() =>
    useBridgeUIMergedRegistryClasses({
      props: { classes: { root: "bg-blue-500" } },
      entry: { classes: { icon: "text-sm", root: "bg-red-500" } },
    }),
  );

  expect(result.current).toEqual({ icon: "text-sm", root: "bg-blue-500" });
});

test("it should default showFooter to true for dialog overlays", () => {
  const { result } = renderHook(() => {
    return useFieldShowFooter({
      overlay: "modal",
      showFooter: undefined,
      componentName: "DateField",
    });
  });

  expect(result.current).toBe(true);
});

test("it should keep an explicit showFooter false on dialog overlays", () => {
  const { result } = renderHook(() => {
    return useFieldShowFooter({
      overlay: "drawer",
      showFooter: false,
      componentName: "DateField",
    });
  });

  expect(result.current).toBe(false);
});

test("it should default fill to true for drawer overlays", () => {
  const { result } = renderHook(() => {
    return usePickerFill({
      fill: undefined,
      overlay: "drawer",
      componentName: "DateField",
    });
  });

  expect(result.current).toBe(true);
});

test("it should keep an explicit fill false on drawer overlays", () => {
  const { result } = renderHook(() => {
    return usePickerFill({
      fill: false,
      overlay: "drawer",
      componentName: "DateField",
    });
  });

  expect(result.current).toBe(false);
});

test("it should resolve fill from BridgeUIProvider defaultProps", () => {
  const { result } = renderHook(
    () => {
      return usePickerFill({
        overlay: "menu",
        fill: undefined,
        componentName: "DateField",
      });
    },
    {
      wrapper: ({ children }) => {
        return createElement(BridgeUIProvider, {
          children,
          components: {
            DateField: { defaultProps: { fill: true } },
          },
        });
      },
    },
  );

  expect(result.current).toBe(true);
});

test("it should keep explicit fill false over registry defaultProps", () => {
  const { result } = renderHook(
    () => {
      return usePickerFill({
        fill: false,
        overlay: "menu",
        componentName: "DateField",
      });
    },
    {
      wrapper: ({ children }) => {
        return createElement(BridgeUIProvider, {
          children,
          components: {
            DateField: { defaultProps: { fill: true } },
          },
        });
      },
    },
  );

  expect(result.current).toBe(false);
});

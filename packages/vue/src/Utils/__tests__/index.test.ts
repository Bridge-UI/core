// ** External Imports
import { expect, test } from "vitest";
import { computed, effectScope } from "vue";

// ** Local Imports
import { useBridgeUIMergedRegistryClasses, useFieldShowFooter } from "@/Utils";

test("it should return empty object when entry and props have no classes", () => {
  const scope = effectScope();

  scope.run(() => {
    const entry = computed(() => {
      return undefined;
    });

    const result = useBridgeUIMergedRegistryClasses({ entry, props: {} });

    expect(result.value).toEqual({});
  });

  scope.stop();
});

test("it should return entry classes when props has none", () => {
  const scope = effectScope();

  scope.run(() => {
    const entry = computed(() => {
      return {
        classes: { icon: "text-sm", root: "bg-red-500" },
      };
    });

    const result = useBridgeUIMergedRegistryClasses({ entry, props: {} });

    expect(result.value).toEqual({
      icon: "text-sm",
      root: "bg-red-500",
    });
  });

  scope.stop();
});

test("it should return props classes when entry has none", () => {
  const scope = effectScope();

  scope.run(() => {
    const entry = computed(() => {
      return undefined;
    });

    const props = { classes: { root: "bg-blue-500" } };

    const result = useBridgeUIMergedRegistryClasses({ entry, props });

    expect(result.value).toEqual({ root: "bg-blue-500" });
  });

  scope.stop();
});

test("it should merge entry and props classes with props winning", () => {
  const scope = effectScope();

  scope.run(() => {
    const entry = computed(() => {
      return {
        classes: { icon: "text-sm", root: "bg-red-500" },
      };
    });

    const props = { classes: { root: "bg-blue-500" } };

    const result = useBridgeUIMergedRegistryClasses({ entry, props });

    expect(result.value).toEqual({ icon: "text-sm", root: "bg-blue-500" });
  });

  scope.stop();
});

test("it should default showFooter to true for dialog overlays", () => {
  const scope = effectScope();

  scope.run(() => {
    const result = useFieldShowFooter({
      overlay: "modal",
      showFooter: undefined,
      componentName: "DateField",
    });

    expect(result.value).toBe(true);
  });

  scope.stop();
});

test("it should keep an explicit showFooter false on dialog overlays", () => {
  const scope = effectScope();

  scope.run(() => {
    const result = useFieldShowFooter({
      overlay: "drawer",
      showFooter: false,
      componentName: "DateField",
    });

    expect(result.value).toBe(false);
  });

  scope.stop();
});

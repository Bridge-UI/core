// ** External Imports
import { expect, test } from "vitest";
import { computed, effectScope } from "vue";

// ** Local Imports
import { useBridgeUIMergedRegistryClasses } from "@/Utils";

test("it should return empty object when entry and props have no classes", () => {
  const scope = effectScope();

  scope.run(() => {
    const entry = computed(() => undefined);

    const result = useBridgeUIMergedRegistryClasses({ entry, props: {} });

    expect(result.value).toEqual({});
  });

  scope.stop();
});

test("it should return entry classes when props has none", () => {
  const scope = effectScope();

  scope.run(() => {
    const entry = computed(() => ({
      classes: { root: "bg-red-500", icon: "text-sm" },
    }));

    const result = useBridgeUIMergedRegistryClasses({ entry, props: {} });

    expect(result.value).toEqual({
      root: "bg-red-500",
      icon: "text-sm",
    });
  });

  scope.stop();
});

test("it should return props classes when entry has none", () => {
  const scope = effectScope();

  scope.run(() => {
    const entry = computed(() => undefined);

    const props = { classes: { root: "bg-blue-500" } };

    const result = useBridgeUIMergedRegistryClasses({ entry, props });

    expect(result.value).toEqual({ root: "bg-blue-500" });
  });

  scope.stop();
});

test("it should merge entry and props classes with props winning", () => {
  const scope = effectScope();

  scope.run(() => {
    const entry = computed(() => ({
      classes: { root: "bg-red-500", icon: "text-sm" },
    }));

    const props = { classes: { root: "bg-blue-500" } };

    const result = useBridgeUIMergedRegistryClasses({ entry, props });

    expect(result.value).toEqual({ root: "bg-blue-500", icon: "text-sm" });
  });

  scope.stop();
});

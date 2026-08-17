// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";
import { computed, defineComponent, effectScope, h } from "vue";

// ** Local Imports
import BridgeUIProvider from "@/Provider/BridgeUIProvider.vue";
import {
  useBridgeUIMergedRegistryClasses,
  useFieldShowFooter,
  usePickerFill,
} from "@/Utils";

function mountUseFieldShowFooter(
  options: Parameters<typeof useFieldShowFooter>[0],
) {
  let result!: ReturnType<typeof useFieldShowFooter>;

  const Wrapper = defineComponent({
    setup() {
      result = useFieldShowFooter(options);

      return () => h("div");
    },
  });

  mount(Wrapper);

  return result;
}

function mountUsePickerFill(
  options: Parameters<typeof usePickerFill>[0],
  registry: { fill?: boolean } = {},
) {
  let result!: ReturnType<typeof usePickerFill>;

  const Consumer = defineComponent({
    setup() {
      result = usePickerFill(options);

      return () => h("div");
    },
  });

  if (!("fill" in registry)) {
    mount(Consumer);

    return result;
  }

  mount(BridgeUIProvider, {
    slots: {
      default: () => h(Consumer),
    },
    props: {
      components: {
        DateField: { defaultProps: { fill: registry.fill } },
      },
    },
  });

  return result;
}

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
  const result = mountUseFieldShowFooter({
    overlay: "modal",
    showFooter: undefined,
    componentName: "DateField",
  });

  expect(result.value).toBe(true);
});

test("it should keep an explicit showFooter false on dialog overlays", () => {
  const result = mountUseFieldShowFooter({
    overlay: "drawer",
    showFooter: false,
    componentName: "DateField",
  });

  expect(result.value).toBe(false);
});

test("it should default fill to true for drawer overlays", () => {
  const result = mountUsePickerFill({
    fill: undefined,
    overlay: "drawer",
    componentName: "DateField",
  });

  expect(result.value).toBe(true);
});

test("it should keep an explicit fill false on drawer overlays", () => {
  const result = mountUsePickerFill({
    fill: false,
    overlay: "drawer",
    componentName: "DateField",
  });

  expect(result.value).toBe(false);
});

test("it should resolve fill from BridgeUIProvider defaultProps", () => {
  const result = mountUsePickerFill(
    {
      overlay: "menu",
      fill: undefined,
      componentName: "DateField",
    },
    { fill: true },
  );

  expect(result.value).toBe(true);
});

test("it should keep explicit fill false over registry defaultProps", () => {
  const result = mountUsePickerFill(
    {
      fill: false,
      overlay: "menu",
      componentName: "DateField",
    },
    { fill: true },
  );

  expect(result.value).toBe(false);
});

// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";
import { defineComponent, h, inject } from "vue";

// ** Local Imports
import {
  RESIZABLE_INJECTION_KEY,
  useResizable,
  type ResizableOwnProps,
} from "@/Components/Resizable";

const libDefaults = {
  disabled: false,
  keyboardStep: 10,
  orientation: "horizontal",
} as const;

function mountUseResizable(
  props: ResizableOwnProps = {},
  attrs: Record<string, unknown> = {},
) {
  let result!: ReturnType<typeof useResizable>;
  let context!: ReturnType<typeof inject<typeof RESIZABLE_INJECTION_KEY>>;

  const Child = defineComponent({
    setup() {
      context = inject(RESIZABLE_INJECTION_KEY);

      return () => h("div");
    },
  });

  const Host = defineComponent({
    inheritAttrs: false,
    setup() {
      result = useResizable(props, libDefaults);

      return () => h("div", result.rootBind.value, [h(Child)]);
    },
  });

  mount(Host, { attrs });

  return { result, context };
}

test("it should lay panels out horizontally by default", () => {
  const { result, context } = mountUseResizable();

  expect(result.orientation.value).toBe("horizontal");
  expect(context?.value.id).toContain("bridge-resizable");
  expect(result.rootBind.value.class).toContain("flex-row");
  expect(result.rootBind.value["data-orientation"]).toBe("horizontal");
});

test("it should stack panels when vertical", () => {
  const { result, context } = mountUseResizable({ orientation: "vertical" });

  expect(context?.value.orientation).toBe("vertical");
  expect(result.rootBind.value.class).toContain("flex-col");
});

test("it should share disabled with panels and handles", () => {
  const { result, context } = mountUseResizable({ disabled: true });

  expect(result.dragging.value).toBe(false);
  expect(context?.value.disabled).toBe(true);
});

test("it should merge classes onto the root", () => {
  const { result } = mountUseResizable(
    { classes: { root: "rounded-lg" } },
    { class: "h-64" },
  );

  expect(result.rootBind.value.class).toContain("h-64");
  expect(result.rootBind.value.class).toContain("rounded-lg");
});

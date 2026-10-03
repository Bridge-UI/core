// ** External Imports
import { flushPromises, mount } from "@vue/test-utils";
import { expect, test } from "vitest";
import { defineComponent, h, ref, type VNode } from "vue";

// ** Local Imports
import { Resizable } from "@/Components/Resizable";
import {
  ResizablePanel,
  useResizablePanel,
  type ResizablePanelOwnProps,
} from "@/Components/ResizablePanel";

const libDefaults = {
  minSize: 0,
  maxSize: 100,
  collapsedSize: 0,
  collapsible: false,
} as const;

async function mountUseResizablePanel(
  props: ResizablePanelOwnProps,
  options: { collapsed?: boolean; siblings?: () => VNode[] } = {},
) {
  let result!: ReturnType<typeof useResizablePanel>;

  const Host = defineComponent({
    setup() {
      result = useResizablePanel(props, libDefaults, ref(options.collapsed));

      return () =>
        h("div", { ...result.rootBind.value, ref: result.elementRef });
    },
  });

  mount(
    defineComponent({
      setup() {
        return () =>
          h(Resizable, null, () => [...(options.siblings?.() ?? []), h(Host)]);
      },
    }),
  );

  await flushPromises();

  return { result };
}

test("it should fill the group when it is the only panel", async () => {
  const { result } = await mountUseResizablePanel({ defaultSize: 30 });

  expect(result.size.value).toBe(100);
  expect(result.collapsed.value).toBe(false);
  expect(result.rootBind.value["data-part"]).toBe("panel");
  expect(result.rootBind.value.style).toEqual({ flex: "100 1 0px" });
});

test("it should share the group with other panels", async () => {
  const { result } = await mountUseResizablePanel(
    { defaultSize: 30 },
    {
      siblings: () => [h(ResizablePanel, { defaultSize: 70 }, () => "Other")],
    },
  );

  expect(result.size.value).toBe(30);
});

test("it should report a collapsed panel", async () => {
  const { result } = await mountUseResizablePanel(
    { minSize: 20, collapsible: true },
    {
      collapsed: true,
      siblings: () => [h(ResizablePanel, null, () => "Other")],
    },
  );

  expect(result.size.value).toBe(0);
  expect(result.collapsed.value).toBe(true);
  expect(result.rootBind.value["data-collapsed"]).toBe("");
});

// ** External Imports
import { flushPromises, mount } from "@vue/test-utils";
import { afterEach, expect, test } from "vitest";
import { defineComponent, h, ref } from "vue";

// ** Core Imports
import { resetLayerStackForTests } from "@bridge-ui/core/Layer";

// ** Local Imports
import { useTooltip, type TooltipOwnProps } from "@/Components/Tooltip";
import { BridgeUIProvider } from "@/Provider";

afterEach(async () => {
  await flushPromises();
  resetLayerStackForTests();
  document.body.innerHTML = "";
});

const libDefaults = {
  offset: 8,
  size: "md",
  arrow: true,
  color: "dark",
  rounded: "md",
  closeDelay: 0,
  openDelay: 200,
  placement: "top",
  strategy: "fixed",
  teleportTo: "body",
} as const satisfies Partial<TooltipOwnProps>;

function mountUseTooltip(
  props: Partial<TooltipOwnProps> = {},
  show = ref(false),
  options: { registryColor?: TooltipOwnProps["color"] } = {},
) {
  let result!: ReturnType<typeof useTooltip>;

  const Wrapper = defineComponent({
    setup() {
      result = useTooltip(
        props,
        libDefaults as Parameters<typeof useTooltip>[1],
        {
          show,
        },
      );

      return () => h("div");
    },
  });

  if (options.registryColor) {
    mount(
      defineComponent({
        setup(_, { slots }) {
          return () =>
            h(
              BridgeUIProvider,
              {
                components: {
                  Tooltip: {
                    defaultProps: { color: options.registryColor },
                  },
                },
              },
              () => slots.default?.(),
            );
        },
      }),
      {
        attachTo: document.body,
        slots: {
          default: () => h(Wrapper),
        },
      },
    );
  } else {
    mount(Wrapper, { attachTo: document.body });
  }

  return { show, result };
}

test("it should return default placement as top", () => {
  const { result } = mountUseTooltip();

  expect(result.merged.value.placement).toBe("top");
});

test("it should merge default arrow as true", () => {
  const { result } = mountUseTooltip();

  expect(result.merged.value.arrow).toBe(true);
});

test("it should expose null arrowBind when arrow is false", () => {
  const { result } = mountUseTooltip({ arrow: false });

  expect(result.arrowBind.value).toBeNull();
});

test("it should set role tooltip on contentBind", () => {
  const { result } = mountUseTooltip();

  expect(result.contentBind.value.role).toBe("tooltip");
});

test("it should resolve color from BridgeUIProvider defaultProps", () => {
  const { result } = mountUseTooltip({}, ref(false), {
    registryColor: "primary",
  });

  expect(result.merged.value.color).toBe("primary");
});

test("it should mark isPortaled when teleportTo is body", () => {
  const { result } = mountUseTooltip();

  expect(result.isPortaled.value).toBe(true);
});

test("it should not portal when teleportTo is false", () => {
  const { result } = mountUseTooltip({ teleportTo: false });

  expect(result.isPortaled.value).toBe(false);
});

test("it should mount content when show is true", async () => {
  const show = ref(true);
  const { result } = mountUseTooltip({}, show);

  await flushPromises();

  expect(result.mounted.value).toBe(true);
  expect(result.show.value).toBe(true);
});

test("it should stay unmounted when show is false", () => {
  const { result } = mountUseTooltip({}, ref(false));

  expect(result.mounted.value).toBe(false);
  expect(result.show.value).toBe(false);
});

test("it should include pointer-events-none on contentBind", () => {
  const { result } = mountUseTooltip();

  expect(result.contentBind.value.class).toContain("pointer-events-none");
});

test("it should open when pointerenter handler runs with openDelay 0", async () => {
  const show = ref(false);
  const { result } = mountUseTooltip({ openDelay: 0 }, show);

  expect(result.show.value).toBe(false);

  result.triggerBind.value.onPointerenter?.();
  await flushPromises();

  expect(show.value).toBe(true);
  expect(result.show.value).toBe(true);
});

// ** External Imports
import { flushPromises, mount } from "@vue/test-utils";
import { afterEach, expect, test, vi } from "vitest";
import { defineComponent, h, ref } from "vue";

// ** Core Imports
import { resetLayerStackForTests } from "@bridge-ui/core/Layer";

// ** Local Imports
import { usePopover, type PopoverOwnProps } from "@/Components/Popover";

afterEach(async () => {
  await flushPromises();
  resetLayerStackForTests();
  document.body.innerHTML = "";
  document.body.style.overflow = "";
});

const libDefaults = {
  offset: 8,
  arrow: false,
  shadow: "md",
  rounded: "md",
  strategy: "fixed",
  teleportTo: "body",
  closeOnEscape: true,
  closeOnFocusOut: true,
  closeOnClickAway: true,
  disableScrollLock: true,
  placement: "bottom-start",
} as const satisfies Partial<PopoverOwnProps>;

function mountUsePopover(
  props: Partial<PopoverOwnProps> = {},
  options: Parameters<typeof usePopover>[2] = {},
) {
  let result!: ReturnType<typeof usePopover>;

  const Wrapper = defineComponent({
    setup() {
      result = usePopover(
        props,
        libDefaults as Parameters<typeof usePopover>[1],
        { show: ref(false), ...options },
      );

      return () => h("div");
    },
  });

  mount(Wrapper, { attachTo: document.body });

  return result;
}

test("it should return the library defaults", () => {
  const result = mountUsePopover();

  expect(result.merged.value.offset).toBe(8);
  expect(result.merged.value.arrow).toBe(false);
  expect(result.merged.value.placement).toBe("bottom-start");
});

test("it should override placement when prop is passed", () => {
  const result = mountUsePopover({ placement: "top-end" });

  expect(result.merged.value.placement).toBe("top-end");
});

test("it should expose dialog semantics on trigger and content binds", () => {
  const result = mountUsePopover();

  expect(result.contentBind.value.role).toBe("dialog");
  expect(result.triggerBind.value["aria-expanded"]).toBe(false);
  expect(result.triggerBind.value["aria-haspopup"]).toBe("dialog");
  expect(result.triggerBind.value["aria-controls"]).toBeUndefined();
});

test("it should wire aria-labelledby from the title prop or slot", () => {
  const fromProp = mountUsePopover({ title: "Filters" });
  const fromSlot = mountUsePopover({}, { hasTitleSlot: () => true });
  const without = mountUsePopover();

  expect(fromProp.contentBind.value["aria-labelledby"]).toBe(
    fromProp.titleBind.value.id,
  );
  expect(fromSlot.hasTitle.value).toBe(true);
  expect(without.contentBind.value["aria-labelledby"]).toBeUndefined();
});

test("it should return no arrow bind unless arrow is true", () => {
  const off = mountUsePopover();
  const on = mountUsePopover({ arrow: true });

  expect(off.arrowBind.value).toBeNull();
  expect(on.arrowBind.value?.["aria-hidden"]).toBe(true);
});

test("it should apply rounded and shadow token classes", () => {
  const result = mountUsePopover({ shadow: "xl", rounded: "lg" });

  expect(result.contentBind.value.class).toContain("rounded-lg");
  expect(result.contentBind.value.class).toContain("shadow-xl");
});

test("it should merge custom classes into the parts", () => {
  const result = mountUsePopover({
    title: "Filters",
    classes: { content: "w-80", title: "uppercase" },
  });

  expect(result.contentBind.value.class).toContain("w-80");
  expect(result.titleBind.value.class).toContain("uppercase");
});

test("it should close with close even when persistent", () => {
  const show = ref(true);
  const onClose = vi.fn();

  const result = mountUsePopover({ persistent: true }, { show, onClose });

  result.close();

  expect(show.value).toBe(false);
  expect(onClose).toHaveBeenCalledOnce();
});

test("it should not change the model from close while hidden", () => {
  const onShowChange = vi.fn();

  const result = mountUsePopover({}, { onShowChange });

  result.close();

  expect(onShowChange).not.toHaveBeenCalled();
});

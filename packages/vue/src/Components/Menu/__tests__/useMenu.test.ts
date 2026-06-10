// ** External Imports
import { flushPromises, mount } from "@vue/test-utils";
import { afterEach, expect, test } from "vitest";
import { defineComponent, h, ref } from "vue";

// ** Local Imports
import { useMenu, type MenuOwnProps } from "@/Components/Menu";
import { resetLayerStackForTests } from "@bridge-ui/core";

afterEach(async () => {
  await flushPromises();
  resetLayerStackForTests();
  document.body.innerHTML = "";
  document.body.style.overflow = "";
});

const libDefaults = {
  offset: 4,
  shadow: "md",
  rounded: "md",
  strategy: "fixed",
  teleportTo: "body",
  closeOnEscape: true,
  closeOnClickAway: true,
  disableScrollLock: true,
  placement: "bottom-start",
} as const satisfies Partial<MenuOwnProps>;

function mountUseMenu(props: Partial<MenuOwnProps> = {}, show = ref(false)) {
  let result!: ReturnType<typeof useMenu>;

  const Wrapper = defineComponent({
    setup() {
      result = useMenu(props, libDefaults as Parameters<typeof useMenu>[1], {
        show,
      });

      return () => h("div");
    },
  });

  mount(Wrapper, { attachTo: document.body });

  return { show, result };
}

test("it should return default placement as bottom-start", () => {
  const { result } = mountUseMenu();

  expect(result.merged.value.placement).toBe("bottom-start");
});

test("it should override placement when prop is passed", () => {
  const { result } = mountUseMenu({ placement: "top-end" });

  expect(result.merged.value.placement).toBe("top-end");
});

test("it should expose menu semantics on trigger and content binds", () => {
  const { result } = mountUseMenu();

  expect(result.triggerBind.value["aria-haspopup"]).toBe("menu");
  expect(result.triggerBind.value["aria-expanded"]).toBe(false);
  expect(result.contentBind.value.role).toBe("menu");
});

test("it should reflect aria-expanded when show is true", async () => {
  const show = ref(true);
  const { result } = mountUseMenu({}, show);

  await flushPromises();

  expect(result.triggerBind.value["aria-expanded"]).toBe(true);
  expect(result.mounted.value).toBe(true);
});

test("it should toggle show when trigger capture handler runs", async () => {
  const show = ref(false);
  const { result } = mountUseMenu({}, show);

  result.triggerBind.value.onClickCapture?.(new MouseEvent("click"));
  await flushPromises();

  expect(show.value).toBe(true);

  result.triggerBind.value.onClickCapture?.(new MouseEvent("click"));
  await flushPromises();

  expect(show.value).toBe(false);
});

test("it should close on escape when show is true", async () => {
  const show = ref(true);

  mountUseMenu({ disableScrollLock: true }, show);

  window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
  await flushPromises();

  expect(show.value).toBe(false);
});

test("it should include rounded and shadow classes on content bind", () => {
  const { result } = mountUseMenu({ shadow: "sm", rounded: "lg" });

  expect(result.contentBind.value.class).toContain("rounded-lg");
  expect(result.contentBind.value.class).toContain("shadow-sm");
});

test("it should not lock body scroll by default", async () => {
  const show = ref(true);

  mountUseMenu({}, show);

  await flushPromises();

  expect(document.body.style.overflow).not.toBe("hidden");
});

test("it should lock body scroll when disableScrollLock is false", async () => {
  const show = ref(true);

  mountUseMenu({ disableScrollLock: false }, show);

  await flushPromises();

  expect(document.body.style.overflow).toBe("hidden");
});

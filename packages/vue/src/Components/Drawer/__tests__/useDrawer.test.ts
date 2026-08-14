// ** External Imports
import { mount } from "@vue/test-utils";
import { afterEach, expect, test, vi } from "vitest";
import { defineComponent, h, ref } from "vue";

// ** Local Imports
import { useDrawer, type DrawerOwnProps } from "@/Components/Drawer";
import { resetLayerStackForTests } from "@bridge-ui/core/Layer";

afterEach(() => {
  resetLayerStackForTests();
  document.body.style.overflow = "";
});

const libDefaults: Partial<DrawerOwnProps> = {
  size: "md",
  blur: "none",
  scroll: "paper",
  autoFocus: false,
  placement: "left",
  teleportTo: "body",
  transition: "slide",
  closeOnEscape: true,
  closeOnOverlay: true,
};

function mountUseDrawer(props: Partial<DrawerOwnProps> = {}, show = ref(true)) {
  let result!: ReturnType<typeof useDrawer>;

  const Wrapper = defineComponent({
    setup() {
      result = useDrawer(
        props,
        libDefaults as Parameters<typeof useDrawer>[1],
        { show },
      );

      return () => h("div");
    },
  });

  mount(Wrapper);

  return { show, result };
}

test("it should return default size as md", () => {
  const { result } = mountUseDrawer();

  expect(result.merged.value.size).toBe("md");
});

test("it should return default placement as left", () => {
  const { result } = mountUseDrawer();

  expect(result.merged.value.placement).toBe("left");
});

test("it should include width class on panel bind for left placement", () => {
  const { result } = mountUseDrawer({ size: "sm" });

  expect(result.panelBind.value.class).toContain("w-72");
});

test("it should include height class on panel bind for bottom placement", () => {
  const { result } = mountUseDrawer({ size: "sm", placement: "bottom" });

  expect(result.panelBind.value.class).toContain("h-56");
  expect(result.panelBind.value.class).not.toContain("w-72");
});

test("it should default closeOnOverlay and closeOnEscape to true", () => {
  const { result } = mountUseDrawer();

  expect(result.merged.value.closeOnEscape).toBe(true);
  expect(result.merged.value.closeOnOverlay).toBe(true);
});

test("it should set show to false when overlay is clicked", () => {
  const show = ref(true);

  const { result } = mountUseDrawer({ transition: "none" }, show);

  result.handleOverlayClick();

  expect(show.value).toBe(false);
});

test("it should apply slide transition classes on panel when transition is slide", () => {
  const { result } = mountUseDrawer({ transition: "slide" });

  expect(result.overlayBind.value["data-state"]).toBeDefined();
  expect(result.panelBind.value.class).toContain("-translate-x-full");
});

test("it should apply the opposite slide direction for right placement", () => {
  const { result } = mountUseDrawer({
    placement: "right",
    transition: "slide",
  });

  expect(result.panelBind.value.class).toContain("translate-x-full");
  expect(result.panelBind.value.class).not.toContain("-translate-x-full");
});

test("it should disable transition classes when prefers-reduced-motion is set", () => {
  vi.stubGlobal(
    "matchMedia",
    vi.fn().mockImplementation((query: string) => ({
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      matches: query.includes("reduce"),
    })),
  );

  const { result } = mountUseDrawer({ transition: "slide" });

  expect(result.overlayBind.value.class).not.toContain("duration-300");

  vi.unstubAllGlobals();
});

test("it should not close when persistent", () => {
  const show = ref(true);

  const { result } = mountUseDrawer({ persistent: true }, show);

  result.handleOverlayClick();

  expect(show.value).toBe(true);
});

test("it should close on escape keydown", () => {
  const show = ref(true);

  mountUseDrawer({ transition: "none" }, show);

  window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));

  expect(show.value).toBe(false);
});

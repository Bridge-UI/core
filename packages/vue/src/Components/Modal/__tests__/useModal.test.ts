// ** External Imports
import { mount } from "@vue/test-utils";
import { afterEach, expect, test, vi } from "vitest";
import { defineComponent, h, ref } from "vue";

// ** Local Imports
import { useModal, type ModalOwnProps } from "@/Components/Modal";
import { resetModalStackForTests } from "@bridge-ui/core";

afterEach(() => {
  resetModalStackForTests();
  document.body.style.overflow = "";
});

const libDefaults: Partial<ModalOwnProps> = {
  size: "md",
  blur: "none",
  align: "middle-center",
  teleportTo: "body",
  transition: "fade",
  closeOnEscape: true,
  closeOnOverlay: true,
};

function mountUseModal(props: Partial<ModalOwnProps> = {}, show = ref(true)) {
  let result!: ReturnType<typeof useModal>;

  const Wrapper = defineComponent({
    setup() {
      result = useModal(props, libDefaults as Parameters<typeof useModal>[1], {
        show,
      });

      return () => h("div");
    },
  });

  mount(Wrapper);

  return { result, show };
}

test("it should return default size as md", () => {
  const { result } = mountUseModal();

  expect(result.merged.value.size).toBe("md");
});

test("it should include max width class on wrapper bind", () => {
  const { result } = mountUseModal({ size: "sm" });

  expect(result.wrapperBind.value.class).toContain("sm:max-w-sm");
});

test("it should default closeOnOverlay and closeOnEscape to true", () => {
  const { result } = mountUseModal();

  expect(result.merged.value.closeOnEscape).toBe(true);
  expect(result.merged.value.closeOnOverlay).toBe(true);
});

test("it should set show to false when overlay is clicked", () => {
  const show = ref(true);

  const { result } = mountUseModal({ transition: "none" }, show);

  result.handleOverlayClick();

  expect(show.value).toBe(false);
});

test("it should apply fade transition classes on overlay when transition is fade", () => {
  const { result } = mountUseModal({ transition: "fade" });

  expect(result.overlayBind.value["data-state"]).toBeDefined();
  expect(result.overlayBind.value.class).toContain(
    "data-[state=open]:opacity-100",
  );
});

test("it should disable fade transition when prefers-reduced-motion is set", () => {
  vi.stubGlobal(
    "matchMedia",
    vi.fn().mockImplementation((query: string) => ({
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      matches: query.includes("reduce"),
    })),
  );

  const { result } = mountUseModal({ transition: "fade" });

  expect(result.overlayBind.value.class).not.toContain("duration-300");

  vi.unstubAllGlobals();
});

test("it should not close when persistent", () => {
  const show = ref(true);

  const { result } = mountUseModal({ persistent: true }, show);

  result.handleOverlayClick();

  expect(show.value).toBe(true);
});

test("it should close on escape keydown", () => {
  const show = ref(true);

  mountUseModal({ transition: "none" }, show);

  window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));

  expect(show.value).toBe(false);
});

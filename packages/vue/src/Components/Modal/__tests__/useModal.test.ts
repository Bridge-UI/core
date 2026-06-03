// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";
import { defineComponent, h, ref } from "vue";

// ** Local Imports
import { useModal, type ModalOwnProps } from "@/Components/Modal";

const libDefaults: Partial<ModalOwnProps> = {
  size: "md",
  blur: "none",
  align: "center",
  teleportTo: "body",
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

  const { result } = mountUseModal({}, show);

  result.handleOverlayClick();

  expect(show.value).toBe(false);
});

test("it should not close when persistent", () => {
  const show = ref(true);

  const { result } = mountUseModal({ persistent: true }, show);

  result.handleOverlayClick();

  expect(show.value).toBe(true);
});

test("it should close on escape keydown", () => {
  const show = ref(true);

  mountUseModal({}, show);

  window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));

  expect(show.value).toBe(false);
});

// ** External Imports
import { flushPromises, mount } from "@vue/test-utils";
import { afterEach, expect, test } from "vitest";
import { defineComponent, h, nextTick } from "vue";

// ** Local Imports
import BridgeUIHosts from "@/Actions/BridgeUIHosts.vue";
import { useBridgeModal } from "@/Actions/Modal";
import { useBridgeSnackbar } from "@/Actions/Snackbar";
import { resetLayerStackForTests } from "@bridge-ui/core";

afterEach(() => {
  document.body.innerHTML = "";
  resetLayerStackForTests();
});

const Content = defineComponent({
  setup() {
    return () => h("p", { class: "bridge-modal-body" }, "Modal");
  },
});

test("BridgeUIHosts should mount modal and snackbar imperatives", async () => {
  const Consumer = defineComponent({
    setup() {
      const modal = useBridgeModal();
      const snackbar = useBridgeSnackbar();

      modal.open({ component: Content, modal: { transition: "none" } });

      snackbar.open({
        title: "Toast",
        duration: false,
        transition: "none",
      });
    },
  });

  mount(BridgeUIHosts, {
    attachTo: document.body,
    slots: { default: () => h(Consumer) },
  });

  await flushPromises();
  await nextTick();

  expect(document.body.textContent).toContain("Modal");
  expect(document.body.textContent).toContain("Toast");
});

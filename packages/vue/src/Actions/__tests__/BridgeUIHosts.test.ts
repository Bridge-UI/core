// ** External Imports
import { flushPromises, mount } from "@vue/test-utils";
import { afterEach, expect, test } from "vitest";
import { defineComponent, h, nextTick } from "vue";

// ** Local Imports
import BridgeUIHosts from "@/Actions/BridgeUIHosts.vue";
import { useDialogAction } from "@/Actions/Dialog";
import { useModalAction } from "@/Actions/Modal";
import { useSnackbarAction } from "@/Actions/Snackbar";
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

test("it should mount modal, dialog, and snackbar imperatives", async () => {
  const Consumer = defineComponent({
    setup() {
      const modal = useModalAction();
      const dialog = useDialogAction();
      const snackbar = useSnackbarAction();

      modal.open({ component: Content, modal: { transition: "none" } });

      dialog.open({
        title: "Confirm",
        description: "Are you sure?",
        modal: { transition: "none" },
      });

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
  expect(document.body.textContent).toContain("Confirm");
  expect(document.body.textContent).toContain("Are you sure?");
  expect(document.body.textContent).toContain("Toast");
});

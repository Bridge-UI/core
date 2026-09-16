// ** External Imports
import { flushPromises, mount } from "@vue/test-utils";
import { afterEach, expect, test } from "vitest";
import { defineComponent, h, nextTick } from "vue";

// ** Core Imports
import { resetLayerStackForTests } from "@bridge-ui/core/Layer";

// ** Local Imports
import BridgeUIHosts from "@/Actions/BridgeUIHosts.vue";
import { useDialogAction } from "@/Actions/Dialog";
import { useDrawerAction } from "@/Actions/Drawer";
import { useModalAction } from "@/Actions/Modal";
import { useSnackbarAction } from "@/Actions/Snackbar";

afterEach(() => {
  document.body.innerHTML = "";
  resetLayerStackForTests();
});

const Content = defineComponent({
  setup() {
    return () => h("p", { class: "bridge-modal-body" }, "Modal");
  },
});

const DrawerContent = defineComponent({
  setup() {
    return () => h("p", { class: "bridge-drawer-body" }, "Drawer");
  },
});

test("it should mount modal, dialog, drawer, and snackbar imperatives", async () => {
  const Consumer = defineComponent({
    setup() {
      const modal = useModalAction();
      const dialog = useDialogAction();
      const drawer = useDrawerAction();
      const snackbar = useSnackbarAction();

      modal.open({ component: Content, modal: { transition: "none" } });

      dialog.open({
        title: "Confirm",
        description: "Are you sure?",
        modal: { transition: "none" },
      });

      drawer.open({
        component: DrawerContent,
        drawer: { transition: "none" },
      });

      snackbar.open({
        title: "Toast",
        duration: false,
        transition: "none",
      });

      return () => null;
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
  expect(document.body.textContent).toContain("Drawer");
  expect(document.body.textContent).toContain("Confirm");
  expect(document.body.textContent).toContain("Are you sure?");
});

test("it should open a snackbar from modal content opened via action", async () => {
  const Draft = defineComponent({
    setup() {
      const snackbar = useSnackbarAction();

      snackbar.open({
        duration: false,
        transition: "none",
        title: "From modal",
      });

      return () => h("p", "Draft");
    },
  });

  const Consumer = defineComponent({
    setup() {
      const modal = useModalAction();

      modal.open({
        component: Draft,
        modal: { transition: "none" },
      });

      return () => null;
    },
  });

  mount(BridgeUIHosts, {
    attachTo: document.body,
    slots: { default: () => h(Consumer) },
  });

  await flushPromises();
  await nextTick();

  expect(document.body.textContent).toContain("Draft");
  expect(document.body.textContent).toContain("From modal");
});

test("it should open a snackbar from drawer content opened via action", async () => {
  const Panel = defineComponent({
    setup() {
      const snackbar = useSnackbarAction();

      snackbar.open({
        duration: false,
        transition: "none",
        title: "From drawer",
      });

      return () => h("p", "Panel");
    },
  });

  const Consumer = defineComponent({
    setup() {
      const drawer = useDrawerAction();

      drawer.open({
        component: Panel,
        drawer: { transition: "none" },
      });

      return () => null;
    },
  });

  mount(BridgeUIHosts, {
    attachTo: document.body,
    slots: { default: () => h(Consumer) },
  });

  await flushPromises();
  await nextTick();

  expect(document.body.textContent).toContain("Panel");
  expect(document.body.textContent).toContain("From drawer");
});

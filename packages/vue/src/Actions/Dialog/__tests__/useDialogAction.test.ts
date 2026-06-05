// ** External Imports
import { flushPromises, mount } from "@vue/test-utils";
import { afterEach, expect, test, vi } from "vitest";
import { defineComponent, h, nextTick } from "vue";

// ** Local Imports
import {
  BridgeDialogHost,
  BridgeDialogHostMissingError,
  useDialogAction,
} from "@/Actions/Dialog";
import { resetLayerStackForTests } from "@bridge-ui/core";

afterEach(() => {
  resetLayerStackForTests();
  document.body.innerHTML = "";
  document.body.style.overflow = "";
});

function mountWithDialogHost(child: ReturnType<typeof defineComponent>) {
  return mount(BridgeDialogHost, {
    attachTo: document.body,
    slots: { default: () => h(child) },
  });
}

test("useDialogAction should throw when BridgeDialogHost is missing", () => {
  const BadConsumer = defineComponent({
    setup() {
      useDialogAction();
    },
  });

  expect(() => mount(BadConsumer)).toThrow(BridgeDialogHostMissingError);
});

test("open should render title and description", async () => {
  const Consumer = defineComponent({
    setup() {
      const dialog = useDialogAction();

      dialog.open({
        title: "Delete item?",
        modal: { transition: "none" },
        description: "This cannot be undone.",
      });
    },
  });

  mountWithDialogHost(Consumer);
  await flushPromises();
  await nextTick();

  expect(document.body.textContent).toContain("Delete item?");
  expect(document.body.textContent).toContain("This cannot be undone.");
});

test("actions should render footer buttons and dismiss on accept", async () => {
  const onAccept = vi.fn();

  const Consumer = defineComponent({
    setup() {
      const dialog = useDialogAction();

      dialog.open({
        title: "Confirm",
        modal: { transition: "none" },
        actions: {
          reject: { label: "Cancel" },
          accept: { label: "Delete", onClick: onAccept },
        },
      });
    },
  });

  mountWithDialogHost(Consumer);
  await flushPromises();
  await nextTick();

  const deleteButton = Array.from(
    document.body.querySelectorAll("button"),
  ).find((button) => button.textContent?.includes("Delete"));

  expect(deleteButton).toBeTruthy();

  deleteButton?.click();
  await flushPromises();
  await nextTick();
  await flushPromises();

  expect(onAccept).toHaveBeenCalledTimes(1);

  await vi.waitUntil(() => {
    return !document.body.textContent?.includes("Confirm");
  });
});

test("close should dismiss a dialog", async () => {
  const Consumer = defineComponent({
    setup() {
      const dialog = useDialogAction();

      const id = dialog.open({
        title: "Dismiss me",
        modal: { transition: "none" },
      });

      dialog.close(id);
    },
  });

  mountWithDialogHost(Consumer);
  await flushPromises();
  await nextTick();

  expect(document.body.textContent).not.toContain("Dismiss me");
});

test("host modal defaults should merge into open options", async () => {
  const Consumer = defineComponent({
    setup() {
      const dialog = useDialogAction();

      dialog.open({
        title: "Small dialog",
      });
    },
  });

  mount(BridgeDialogHost, {
    attachTo: document.body,
    slots: { default: () => h(Consumer) },
    props: { modal: { size: "sm", transition: "none" } },
  });

  await flushPromises();
  await nextTick();

  const panel = document.body.querySelector('[data-modal-part="panel"]');

  expect(panel?.className).toContain("sm:max-w-sm");
});

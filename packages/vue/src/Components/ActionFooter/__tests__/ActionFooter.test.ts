// ** External Imports
import { mount } from "@vue/test-utils";
import { afterEach, expect, test } from "vitest";
import { h } from "vue";

// ** Local Imports
import { ActionFooter } from "@/Components/ActionFooter";
import BridgeUIProvider from "@/Provider/BridgeUIProvider.vue";

afterEach(() => {
  while (mountedWrappers.length > 0) {
    mountedWrappers.pop()?.unmount();
  }

  document.body.innerHTML = "";
});

const mountedWrappers: Array<ReturnType<typeof mount>> = [];

function mountActionFooter(options: Parameters<typeof mount>[1] = {}) {
  const wrapper = mount(ActionFooter, {
    attachTo: document.body,
    ...options,
  });

  mountedWrappers.push(wrapper);

  return wrapper;
}

test("it should render Cancel and Apply", () => {
  mountActionFooter();

  const buttons = document.body.querySelectorAll("button");

  expect(buttons[0]?.textContent).toContain("Cancel");
  expect(buttons[1]?.textContent).toContain("Apply");
});

test("it should apply default Apply and Cancel colors", () => {
  mountActionFooter();

  const buttons = document.body.querySelectorAll("button");

  expect(buttons[1]?.className).toContain("bg-primary-500");
  expect(buttons[0]?.className).not.toContain("bg-primary-500");
});

test("it should emit apply and cancel when the buttons are clicked", async () => {
  const wrapper = mountActionFooter();
  const buttons = document.body.querySelectorAll("button");

  await buttons[1]?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  await buttons[0]?.dispatchEvent(new MouseEvent("click", { bubbles: true }));

  expect(wrapper.emitted("apply")).toHaveLength(1);
  expect(wrapper.emitted("cancel")).toHaveLength(1);
});

test("it should let customProps.applyButton color win over applyColor", () => {
  mountActionFooter({
    props: {
      applyColor: "info",
      customProps: { applyButton: { color: "error" } },
    },
  });

  const buttons = document.body.querySelectorAll("button");

  expect(buttons[1]?.className).toContain("bg-error-500");
});

test("it should apply ActionFooter defaultProps from BridgeUIProvider", () => {
  const wrapper = mount(BridgeUIProvider, {
    slots: {
      default: () => h(ActionFooter),
    },
    props: {
      components: {
        ActionFooter: { defaultProps: { applyColor: "info" } },
      },
    },
  });

  expect(wrapper.html()).toContain("bg-info-500");
});

test("it should render custom labels", () => {
  mountActionFooter({
    props: { applyLabel: "Save", cancelLabel: "Discard" },
  });

  expect(document.body.textContent).toContain("Save");
  expect(document.body.textContent).toContain("Discard");
});

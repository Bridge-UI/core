// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";
import { defineComponent, ref } from "vue";

// ** Local Imports
import { PasswordField } from "@/Components/PasswordField";

test("it should render a password input by default", () => {
  const wrapper = mount(PasswordField);

  expect(wrapper.find('input[type="password"]').exists()).toBe(true);
});

test("it should render visibility toggle button", () => {
  const wrapper = mount(PasswordField);

  expect(wrapper.find('button[aria-label="Show password"]').exists()).toBe(
    true,
  );
});

test("it should reveal password when toggle is clicked", async () => {
  const wrapper = mount(PasswordField, {
    props: {
      modelValue: "secret",
    },
  });

  await wrapper.find('button[aria-label="Show password"]').trigger("click");

  expect(wrapper.find('input[type="text"]').exists()).toBe(true);
  expect(wrapper.find('button[aria-label="Hide password"]').exists()).toBe(
    true,
  );
});

test("it should emit visibility-change when toggle is clicked", async () => {
  const wrapper = mount(PasswordField);

  await wrapper.find('button[aria-label="Show password"]').trigger("click");

  expect(wrapper.emitted("visibility-change")).toEqual([[true]]);

  await wrapper.find('button[aria-label="Hide password"]').trigger("click");

  expect(wrapper.emitted("visibility-change")).toEqual([[true], [false]]);
});

test("it should disable toggle button when disabled", () => {
  const wrapper = mount(PasswordField, { props: { disabled: true } });

  expect(wrapper.find("button").attributes("disabled")).toBeDefined();
});

test("it should render a label when label prop is provided", () => {
  const wrapper = mount(PasswordField, { props: { label: "Password" } });

  expect(wrapper.text()).toContain("Password");
});

test("it should preserve value when controlled visible toggles from parent", async () => {
  const wrapper = mount(PasswordField, {
    props: {
      visible: false,
      label: "Password",
      modelValue: "secret",
      "onUpdate:modelValue": (value: null | string | undefined) => {
        wrapper.setProps({ modelValue: value });
      },
    },
  });

  expect((wrapper.find("input").element as HTMLInputElement).value).toBe(
    "secret",
  );

  await wrapper.setProps({ visible: true });

  expect((wrapper.find("input").element as HTMLInputElement).value).toBe(
    "secret",
  );
});

test("it should preserve value when visibility toggles via the eye button", async () => {
  const wrapper = mount(PasswordField, {
    props: {
      modelValue: "secret",
      "onUpdate:modelValue": (value: null | string | undefined) => {
        wrapper.setProps({ modelValue: value });
      },
    },
  });

  await wrapper.find('button[aria-label="Show password"]').trigger("click");
  await wrapper.find('button[aria-label="Hide password"]').trigger("click");

  expect((wrapper.find("input").element as HTMLInputElement).value).toBe(
    "secret",
  );
});

test("it should preserve value without parent v-model when visible toggles", async () => {
  const Parent = defineComponent({
    components: { PasswordField },
    setup() {
      const visible = ref(false);

      return { visible };
    },
    template: `
      <div>
        <PasswordField :visible="visible" label="Password" />
        <button type="button" data-testid="toggle" @click="visible = !visible">toggle</button>
      </div>
    `,
  });

  const wrapper = mount(Parent);

  await wrapper.find("input").setValue("secret");
  await wrapper.find('[data-testid="toggle"]').trigger("click");

  expect((wrapper.find("input").element as HTMLInputElement).value).toBe(
    "secret",
  );
});

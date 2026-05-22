// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";
import { defineComponent, h } from "vue";

// ** Local Imports
import {
  useAlert,
  type AlertOwnProps,
  type AlertProps,
} from "@/Components/Alert";

const libDefaults: Partial<AlertOwnProps> = {
  color: "primary",
  variant: "flat",
  shadow: "none",
  rounded: "none",
  padding: "none",
};

function mountUseAlert(props: AlertProps = {}) {
  let result!: ReturnType<typeof useAlert>;

  const Wrapper = defineComponent({
    setup() {
      result = useAlert(props, libDefaults);

      return () => h("div");
    },
  });

  mount(Wrapper);

  return result;
}

test("it should return default color as primary", () => {
  const { merged } = mountUseAlert();

  expect(merged.value.color).toBe("primary");
});

test("it should override color when prop is passed", () => {
  const { merged } = mountUseAlert({ color: "error" });

  expect(merged.value.color).toBe("error");
});

test("it should resolve the default icon for a given color", () => {
  const { resolvedIcon } = mountUseAlert({ color: "error" });

  expect(resolvedIcon.value).not.toBeNull();
});

test("it should suppress the icon when icon is null", () => {
  const { resolvedIcon } = mountUseAlert({ icon: null });

  expect(resolvedIcon.value).toBeNull();
});

test("it should compute root class as a non-empty string", () => {
  const { rootBind } = mountUseAlert({
    variant: "flat",
    color: "primary",
  });

  expect(typeof rootBind.value.class).toBe("string");
  expect(rootBind.value.class.length).toBeGreaterThan(0);
});

test("it should include shadow classes when shadow is set", () => {
  const { rootBind } = mountUseAlert({ shadow: "sm" });

  expect(rootBind.value.class).toContain("shadow");
});

test("it should include rounded classes when rounded is set", () => {
  const { rootBind } = mountUseAlert({ rounded: "md" });

  expect(rootBind.value.class).toContain("rounded");
});

test("it should compute title classes with font-normal when no body", () => {
  const { titleBind } = mountUseAlert({ title: "Test" });

  expect(titleBind.value.class).toContain("font-normal");
});

test("it should merge class into root bind", () => {
  const { rootBind } = mountUseAlert({ class: "custom-alert" });

  expect(rootBind.value.class).toContain("custom-alert");
});

test("it should expose rootBind for additional attributes", () => {
  const { rootBind } = mountUseAlert({
    id: "alert-root",
    "data-testid": "alert",
  });

  expect(rootBind.value.id).toBe("alert-root");
  expect(rootBind.value["data-testid"]).toBe("alert");
});

test("it should apply class after classes.root in root bind", () => {
  const { rootBind } = mountUseAlert({
    class: "p-4",
    classes: { root: "p-2" },
  });

  expect(rootBind.value.class).toContain("p-4");
  expect(rootBind.value.class).not.toContain("p-2");
});
